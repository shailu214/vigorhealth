const AssessmentData = require('../models/AssessmentData');
const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

class DataDeletionService {
  
  /**
   * Delete all assessment data for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Deletion result
   */
  static async deleteUserAssessmentData(userId) {
    try {
      // Delete all assessment data for the user
      const result = await AssessmentData.deleteMany({ userId: userId });
      
      // Delete any generated report files
      await this.deleteReportFiles(userId);
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Deleted ${result.deletedCount} assessment records and associated files`
      };
    } catch (error) {
      console.error('Error deleting user assessment data:', error);
      return {
        success: false,
        message: 'Failed to delete assessment data',
        error: error.message
      };
    }
  }

  /**
   * Mark assessment data for deletion after report download
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Result of marking for deletion
   */
  static async markForDeletionAfterDownload(userId) {
    try {
      // Find all assessment data for the user
      const assessments = await AssessmentData.find({ userId: userId });
      
      if (assessments.length === 0) {
        return {
          success: false,
          message: 'No assessment data found for user'
        };
      }

      // Mark each assessment for deletion
      const updatePromises = assessments.map(assessment => 
        assessment.markForDeletion()
      );
      
      await Promise.all(updatePromises);
      
      return {
        success: true,
        message: `Marked ${assessments.length} assessment records for automatic deletion`,
        deletedCount: assessments.length
      };
    } catch (error) {
      console.error('Error marking data for deletion:', error);
      return {
        success: false,
        message: 'Failed to mark data for deletion',
        error: error.message
      };
    }
  }

  /**
   * Delete report files from the server for a specific user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async deleteReportFiles(userId) {
    try {
      const reportsDir = path.join(__dirname, '../reports');
      
      // Check if reports directory exists
      try {
        await fs.access(reportsDir);
      } catch {
        console.log('Reports directory does not exist');
        return;
      }
      
      const files = await fs.readdir(reportsDir);
      
      // Find and delete files that contain the userId
      const userFiles = files.filter(file => file.includes(userId.toString()));
      
      if (userFiles.length === 0) {
        console.log(`No report files found for user ${userId}`);
        return;
      }
      
      const deletePromises = userFiles.map(file => 
        fs.unlink(path.join(reportsDir, file)).catch(err => {
          console.error(`Failed to delete file ${file}:`, err);
        })
      );
      
      await Promise.all(deletePromises);
      
      console.log(`✅ Deleted ${userFiles.length} report files for user ${userId}`);
    } catch (error) {
      console.error('Error deleting report files:', error);
    }
  }

  /**
   * Delete a specific report file
   * @param {string} fileName - Report file name
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteReportFile(fileName) {
    try {
      const reportsDir = path.join(__dirname, '../reports');
      const filePath = path.join(reportsDir, fileName);
      
      await fs.unlink(filePath);
      console.log(`✅ Report file deleted: ${fileName}`);
      return true;
    } catch (error) {
      console.error(`Error deleting report file ${fileName}:`, error);
      return false;
    }
  }

  /**
   * Cleanup expired data (runs periodically)
   * MongoDB TTL index handles most cleanup, but this provides additional safety
   * @returns {Promise<Object>} - Cleanup result
   */
  static async cleanupExpiredData() {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      // Find assessments marked for deletion more than 1 day ago
      const expiredAssessments = await AssessmentData.find({
        scheduledForDeletion: { $lte: oneDayAgo }
      });
      
      if (expiredAssessments.length === 0) {
        return {
          success: true,
          message: 'No expired data found',
          deletedCount: 0
        };
      }

      // Get unique user IDs for file cleanup
      const userIds = [...new Set(expiredAssessments.map(a => a.userId.toString()))];
      
      // Delete the assessment records
      const result = await AssessmentData.deleteMany({
        scheduledForDeletion: { $lte: oneDayAgo }
      });
      
      // Delete associated report files
      for (const userId of userIds) {
        await this.deleteReportFiles(userId);
      }
      
      return {
        success: true,
        message: `Cleaned up ${result.deletedCount} expired assessment records`,
        deletedCount: result.deletedCount,
        usersAffected: userIds.length
      };
    } catch (error) {
      console.error('Error during cleanup:', error);
      return {
        success: false,
        message: 'Failed to cleanup expired data',
        error: error.message
      };
    }
  }

  /**
   * Get data retention statistics for admin dashboard
   * @returns {Promise<Object>} - Statistics about data retention
   */
  static async getDataRetentionStats() {
    try {
      const [
        totalUsers,
        usersWithActiveData,
        pendingDeletions,
        totalReportsDownloaded
      ] = await Promise.all([
        User.countDocuments(),
        AssessmentData.distinct('userId').then(userIds => userIds.length),
        AssessmentData.countDocuments({ 
          scheduledForDeletion: { $exists: true } 
        }),
        AssessmentData.countDocuments({ 
          reportDownloadedAt: { $exists: true } 
        })
      ]);

      const usersWithDeletedData = totalUsers - usersWithActiveData;

      return {
        totalUsers,
        usersWithActiveData,
        usersWithDeletedData,
        pendingDeletions,
        totalReportsDownloaded,
        dataRetentionCompliance: {
          percentage: totalUsers > 0 ? Math.round((usersWithDeletedData / totalUsers) * 100) : 0,
          status: usersWithDeletedData >= usersWithActiveData ? 'Good' : 'Needs Attention'
        }
      };
    } catch (error) {
      console.error('Error getting retention stats:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Start automatic cleanup service (runs every hour)
   */
  static startCleanupService() {
    const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
    
    console.log('🗑️ Starting automatic data cleanup service...');
    
    // Run cleanup immediately
    this.cleanupExpiredData().then(result => {
      console.log('Initial cleanup result:', result);
    });
    
    // Set up periodic cleanup
    setInterval(async () => {
      console.log('🔄 Running scheduled data cleanup...');
      const result = await this.cleanupExpiredData();
      
      if (result.deletedCount > 0) {
        console.log(`✅ Cleanup completed: ${result.message}`);
      }
    }, CLEANUP_INTERVAL);
  }

  /**
   * Validate GDPR compliance for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Compliance status
   */
  static async validateGDPRCompliance(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { compliant: false, reason: 'User not found' };
      }

      const activeData = await AssessmentData.countDocuments({ userId: userId });
      const hasScheduledDeletion = await AssessmentData.countDocuments({ 
        userId: userId, 
        scheduledForDeletion: { $exists: true } 
      });

      return {
        compliant: activeData === 0 || hasScheduledDeletion > 0,
        activeDataCount: activeData,
        scheduledDeletionCount: hasScheduledDeletion,
        userExists: true
      };
    } catch (error) {
      return { 
        compliant: false, 
        reason: 'Error checking compliance', 
        error: error.message 
      };
    }
  }
}

module.exports = DataDeletionService;