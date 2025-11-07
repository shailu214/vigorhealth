#!/bin/bash

# VigorHealth Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting VigorHealth Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed."
}

# Check environment file
check_env() {
    print_status "Checking environment configuration..."
    if [ ! -f .env ]; then
        print_warning ".env file not found. Copying from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual values before continuing."
        print_warning "Press Enter to continue after editing .env file..."
        read
    fi
    print_success "Environment configuration found."
}

# Build and start services
deploy() {
    local environment=${1:-production}
    
    print_status "Deploying in $environment mode..."
    
    if [ "$environment" = "development" ]; then
        # Start only database services for development
        print_status "Starting development dependencies..."
        docker-compose -f docker-compose.dev.yml up -d
        
        print_success "Development environment ready!"
        print_status "MongoDB available at: mongodb://localhost:27018"
        print_status "Redis available at: redis://localhost:6380"
        print_status "Run 'npm run dev' to start the application in development mode."
        
    else
        # Production deployment
        print_status "Building Docker images..."
        docker-compose build --no-cache
        
        print_status "Starting all services..."
        docker-compose up -d
        
        # Wait for services to be healthy
        print_status "Waiting for services to be ready..."
        sleep 30
        
        # Check if services are running
        if docker-compose ps | grep -q "Up (healthy)"; then
            print_success "Production deployment completed successfully!"
            print_status "Application available at: http://localhost:3000"
            print_status "API available at: http://localhost:5001"
            print_status "Admin panel: http://localhost:3000/admin"
        else
            print_error "Some services failed to start. Check logs with: docker-compose logs"
            exit 1
        fi
    fi
}

# Show logs
show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped."
}

# Clean up (remove containers, volumes, and images)
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed."
    else
        print_status "Cleanup cancelled."
    fi
}

# Backup database
backup_db() {
    local backup_dir="./backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${backup_dir}/mongodb_backup_${timestamp}.tar.gz"
    
    print_status "Creating database backup..."
    
    mkdir -p "$backup_dir"
    
    docker-compose exec -T mongodb mongodump --archive | gzip > "$backup_file"
    
    if [ -f "$backup_file" ]; then
        print_success "Database backup created: $backup_file"
    else
        print_error "Failed to create database backup."
        exit 1
    fi
}

# Restore database
restore_db() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please provide backup file path."
        print_status "Usage: ./deploy.sh restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will replace the current database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Restoring database from: $backup_file"
        gunzip < "$backup_file" | docker-compose exec -T mongodb mongorestore --archive
        print_success "Database restored successfully."
    else
        print_status "Database restore cancelled."
    fi
}

# Update application
update() {
    print_status "Updating application..."
    
    # Pull latest changes (if using git)
    if [ -d ".git" ]; then
        print_status "Pulling latest changes from git..."
        git pull
    fi
    
    # Rebuild and restart services
    print_status "Rebuilding services..."
    docker-compose build --no-cache
    docker-compose up -d
    
    print_success "Application updated successfully!"
}

# Show help
show_help() {
    echo "VigorHealth Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy [production|development]  Deploy the application (default: production)"
    echo "  logs [service_name]             Show logs for all services or specific service"
    echo "  stop                            Stop all services"
    echo "  restart                         Restart all services"
    echo "  cleanup                         Remove all containers, volumes, and images"
    echo "  backup                          Create database backup"
    echo "  restore <backup_file>           Restore database from backup"
    echo "  update                          Update and restart the application"
    echo "  status                          Show status of all services"
    echo "  help                            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production            Deploy in production mode"
    echo "  $0 deploy development           Start development dependencies only"
    echo "  $0 logs backend                 Show backend service logs"
    echo "  $0 backup                       Create database backup"
    echo "  $0 restore ./backups/backup.tar.gz  Restore from backup"
    echo ""
}

# Show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_docker
        check_env
        deploy "${2:-production}"
        ;;
    "logs")
        show_logs "$2"
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 5
        deploy "${2:-production}"
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup_db
        ;;
    "restore")
        restore_db "$2"
        ;;
    "update")
        update
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac