@echo off
REM VigorHealth Deployment Script for Windows
REM This script automates the deployment process on Windows

setlocal enabledelayedexpansion

echo 🚀 Starting VigorHealth Deployment...

REM Function to check Docker installation
:check_docker
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed.
goto :eof

REM Function to check environment file
:check_env
echo [INFO] Checking environment configuration...
if not exist .env (
    echo [WARNING] .env file not found. Copying from .env.example...
    copy .env.example .env >nul
    echo [WARNING] Please edit .env file with your actual values before continuing.
    echo [WARNING] Press Enter to continue after editing .env file...
    pause >nul
)
echo [SUCCESS] Environment configuration found.
goto :eof

REM Function to deploy
:deploy
set environment=%~1
if "%environment%"=="" set environment=production

echo [INFO] Deploying in %environment% mode...

if "%environment%"=="development" (
    echo [INFO] Starting development dependencies...
    docker-compose -f docker-compose.dev.yml up -d
    
    echo [SUCCESS] Development environment ready!
    echo [INFO] MongoDB available at: mongodb://localhost:27018
    echo [INFO] Redis available at: redis://localhost:6380
    echo [INFO] Run 'npm run dev' to start the application in development mode.
) else (
    echo [INFO] Building Docker images...
    docker-compose build --no-cache
    
    echo [INFO] Starting all services...
    docker-compose up -d
    
    echo [INFO] Waiting for services to be ready...
    timeout /t 30 /nobreak >nul
    
    echo [SUCCESS] Production deployment completed successfully!
    echo [INFO] Application available at: http://localhost:3000
    echo [INFO] API available at: http://localhost:5001
    echo [INFO] Admin panel: http://localhost:3000/admin
)
goto :eof

REM Function to show logs
:show_logs
set service=%~1
if "%service%"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %service%
)
goto :eof

REM Function to stop services
:stop_services
echo [INFO] Stopping all services...
docker-compose down
echo [SUCCESS] All services stopped.
goto :eof

REM Function to cleanup
:cleanup
echo [WARNING] This will remove all containers, volumes, and images. Are you sure? (y/N)
set /p response=
if /i "!response!"=="y" (
    echo [INFO] Cleaning up Docker resources...
    docker-compose down -v --rmi all
    docker system prune -f
    echo [SUCCESS] Cleanup completed.
) else (
    echo [INFO] Cleanup cancelled.
)
goto :eof

REM Function to backup database
:backup_db
set backup_dir=.\backups
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=!timestamp: =0!
set backup_file=%backup_dir%\mongodb_backup_%timestamp%.tar.gz

echo [INFO] Creating database backup...

if not exist "%backup_dir%" mkdir "%backup_dir%"

docker-compose exec -T mongodb mongodump --archive > "%backup_file%"

if exist "%backup_file%" (
    echo [SUCCESS] Database backup created: %backup_file%
) else (
    echo [ERROR] Failed to create database backup.
    exit /b 1
)
goto :eof

REM Function to show status
:show_status
echo [INFO] Service Status:
docker-compose ps
goto :eof

REM Function to show help
:show_help
echo VigorHealth Deployment Script for Windows
echo.
echo Usage: %~n0 [COMMAND] [OPTIONS]
echo.
echo Commands:
echo   deploy [production^|development]  Deploy the application (default: production)
echo   logs [service_name]             Show logs for all services or specific service
echo   stop                            Stop all services
echo   restart                         Restart all services
echo   cleanup                         Remove all containers, volumes, and images
echo   backup                          Create database backup
echo   status                          Show status of all services
echo   help                            Show this help message
echo.
echo Examples:
echo   %~n0 deploy production            Deploy in production mode
echo   %~n0 deploy development           Start development dependencies only
echo   %~n0 logs backend                 Show backend service logs
echo   %~n0 backup                       Create database backup
echo.
goto :eof

REM Main script logic
call :check_docker
if errorlevel 1 exit /b 1

call :check_env

set command=%~1
if "%command%"=="" set command=deploy

if "%command%"=="deploy" (
    call :deploy %~2
) else if "%command%"=="logs" (
    call :show_logs %~2
) else if "%command%"=="stop" (
    call :stop_services
) else if "%command%"=="restart" (
    call :stop_services
    timeout /t 5 /nobreak >nul
    call :deploy %~2
) else if "%command%"=="cleanup" (
    call :cleanup
) else if "%command%"=="backup" (
    call :backup_db
) else if "%command%"=="status" (
    call :show_status
) else if "%command%"=="help" (
    call :show_help
) else (
    echo [ERROR] Unknown command: %command%
    call :show_help
    exit /b 1
)

echo.
echo [INFO] Deployment script completed.
pause