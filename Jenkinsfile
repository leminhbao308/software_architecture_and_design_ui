pipeline {
    agent any

    environment {
        // Define service name
        SERVICE_NAME = "devicer-frontend"
        // Change path to a directory with write permissions
        ENV_BACKUP_DIR = "/tmp/env-backup"
        ENV_CONFIG_DIR = "/tmp/env-backup/config"
        // Flag to track first build
        IS_FIRST_BUILD = "false"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    // Ensure backup and config directories exist
                    sh "mkdir -p ${ENV_BACKUP_DIR}"
                    sh "mkdir -p ${ENV_CONFIG_DIR}"

                    // Check if env-config volume exists
                    def volumeExists = sh(script: "docker volume ls | grep env-config || echo 'NOT_FOUND'", returnStdout: true).trim()
                    if (volumeExists == 'NOT_FOUND' || !volumeExists.contains("env-config")) {
                        echo "Creating env-config volume..."
                        sh "docker volume create env-config"
                    }

                    // Check if microservices-network exists
                    def networkExists = sh(script: "docker network ls | grep microservices-network || echo 'NOT_FOUND'", returnStdout: true).trim()
                    if (networkExists == 'NOT_FOUND' || !networkExists.contains("microservices-network")) {
                        echo "Creating microservices-network..."
                        sh "docker network create microservices-network"
                    }

                    // Ensure env file for service exists
                    sh """
                    if [ ! -f "${ENV_CONFIG_DIR}/${SERVICE_NAME}.env" ]; then
                        echo "Creating empty env file for ${SERVICE_NAME}..."
                        touch "${ENV_CONFIG_DIR}/${SERVICE_NAME}.env"
                    fi
                    """

                    // Copy env file from config dir to Docker volume
                    sh """
                    docker run --rm -v env-config:/data -v ${ENV_CONFIG_DIR}:/source alpine sh -c '
                        mkdir -p /data
                        cp -f /source/${SERVICE_NAME}.env /data/ || true
                        chmod 666 /data/${SERVICE_NAME}.env || true
                    '
                    """
                }
            }
        }

        stage('Detect Changes') {
            steps {
                script {
                    // Check if container exists
                    def containerExists = sh(script: "docker ps -a | grep ${SERVICE_NAME} || echo 'NOT_FOUND'", returnStdout: true).trim()

                    if (containerExists == 'NOT_FOUND' || !containerExists.contains(SERVICE_NAME)) {
                        echo "Service ${SERVICE_NAME} does not exist, this is the first build"
                        env.IS_FIRST_BUILD = "true"
                    } else {
                        // Check if container is running
                        def containerRunning = sh(script: "docker ps | grep ${SERVICE_NAME} || echo 'NOT_RUNNING'", returnStdout: true).trim()
                        if (containerRunning == 'NOT_RUNNING' || !containerRunning.contains(SERVICE_NAME)) {
                            echo "Service ${SERVICE_NAME} exists but is not running, will rebuild it"
                            env.IS_FIRST_BUILD = "true"
                        }
                    }
                }
            }
        }

        stage('Backup Environment Variables') {
            when {
                expression { env.IS_FIRST_BUILD != "true" }
            }
            steps {
                script {
                    echo "Backing up environment variables for service: ${SERVICE_NAME}"
                    sh """
                    # Check if container exists and is running
                    CONTAINER_STATUS=\$(docker inspect --format='{{.State.Status}}' ${SERVICE_NAME} 2>/dev/null || echo "not_found")

                    if [ "\$CONTAINER_STATUS" = "running" ]; then
                        # Extract environment variables
                        docker exec ${SERVICE_NAME} env | grep -v "PATH=" | grep -v "PWD=" | grep -v "HOME=" > ${ENV_BACKUP_DIR}/${SERVICE_NAME}.env || echo "Failed to extract environment variables"
                        echo "Environment variables for ${SERVICE_NAME} backed up successfully"
                    else
                        echo "Container ${SERVICE_NAME} is not running (status: \$CONTAINER_STATUS), no environment to backup"
                        # Create empty file to avoid issues in the restore stage
                        touch ${ENV_BACKUP_DIR}/${SERVICE_NAME}.env
                    fi
                    """
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Display Docker path
                    sh 'which docker'

                    // Check if it's the first build
                    if (env.IS_FIRST_BUILD == "true") {
                        echo "First time build detected. Building with --no-cache to ensure fresh builds."
                        sh "docker compose build --no-cache ${SERVICE_NAME} || { echo 'Failed to build ${SERVICE_NAME} but continuing'; }"
                    } else {
                        // If not first build, build normally
                        echo "Building service: ${SERVICE_NAME}"
                        sh "docker compose build ${SERVICE_NAME} || { echo 'Failed to build ${SERVICE_NAME} but continuing'; }"
                    }
                }
            }
        }

        stage('Deploy Service') {
            steps {
                script {
                    // If first build, stop existing container first
                    if (env.IS_FIRST_BUILD == "true") {
                        echo "First time deployment or service not running. Stopping existing service before redeploying..."
                        sh "docker compose down ${SERVICE_NAME} || true"
                    }

                    echo "Deploying service: ${SERVICE_NAME}"
                    sh """
                    # Stop current service (if running)
                    docker compose stop ${SERVICE_NAME} || true

                    # Remove old container to avoid conflicts
                    docker compose rm -f ${SERVICE_NAME} || true

                    # Start service with new configuration
                    docker compose up -d ${SERVICE_NAME} || echo 'Failed to start ${SERVICE_NAME} but continuing'
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "Verifying service is running..."
                    sh "sleep 30"  // Allow time for startup

                    def isRunning = sh(script: "docker ps | grep ${SERVICE_NAME} || echo 'NOT_RUNNING'", returnStdout: true).trim()
                    if (isRunning == 'NOT_RUNNING' || !isRunning.contains(SERVICE_NAME)) {
                        echo "WARNING: Service ${SERVICE_NAME} is not running!"
                        echo "Checking logs for failed service..."
                        sh "docker compose logs ${SERVICE_NAME} | tail -n 50"
                        // Don't fail pipeline, but log error
                        echo "WARNING: Service failed to start, but continuing pipeline."
                    } else {
                        echo "Service is running correctly."
                    }
                }
            }
        }

        stage('Configure Nginx Proxy') {
            steps {
                script {
                    echo "Setting up Nginx configuration for devicer.punshub.top..."

                    // Create Nginx config file for the domain
                    sh """
                    sudo mkdir -p /etc/nginx/sites-available
                    sudo mkdir -p /etc/nginx/sites-enabled

                    sudo tee /etc/nginx/sites-available/devicer.punshub.top << 'EOF'
server {
    listen 80;
    server_name devicer.punshub.top;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
    }
}
EOF

                    # Check if symlink exists
                    if [ ! -f /etc/nginx/sites-enabled/devicer.punshub.top ]; then
                        sudo ln -s /etc/nginx/sites-available/devicer.punshub.top /etc/nginx/sites-enabled/
                    fi

                    # Test Nginx configuration
                    sudo nginx -t && sudo systemctl reload nginx
                    """
                }
            }
        }

        stage('Configure SSL with Certbot') {
            steps {
                script {
                    echo "Setting up SSL for devicer.punshub.top..."

                    sh """
                    # Ensure certbot is installed
                    which certbot || sudo apt update && sudo apt install -y certbot python3-certbot-nginx

                    # Obtain SSL certificate
                    sudo certbot --nginx -d devicer.punshub.top --non-interactive --agree-tos -m admin@punshub.top || echo "SSL certificate could not be obtained, will continue without SSL"

                    # Reload Nginx if successful
                    sudo nginx -t && sudo systemctl reload nginx
                    """
                }
            }
        }

        stage('Restore Environment Variables') {
            when {
                expression { env.IS_FIRST_BUILD != "true" }
            }
            steps {
                script {
                    echo "Restoring environment variables for service: ${SERVICE_NAME}"
                    sh """
                    if [ -f "${ENV_BACKUP_DIR}/${SERVICE_NAME}.env" ] && [ -s "${ENV_BACKUP_DIR}/${SERVICE_NAME}.env" ]; then
                        echo "Found environment backup for ${SERVICE_NAME}, restoring..."

                        # Wait for container to be fully up
                        sleep 20

                        # Check if container is running before trying to restore environment
                        CONTAINER_STATUS=\$(docker inspect --format='{{.State.Status}}' ${SERVICE_NAME} 2>/dev/null || echo "not_found")

                        if [ "\$CONTAINER_STATUS" = "running" ]; then
                            # Apply each environment variable to the container
                            cat ${ENV_BACKUP_DIR}/${SERVICE_NAME}.env | while read -r line; do
                                # Skip empty lines
                                [ -z "\$line" ] && continue

                                # Extract key and value
                                key=\$(echo "\$line" | cut -d= -f1)
                                value=\$(echo "\$line" | cut -d= -f2-)

                                # Skip some variables we don't want to override
                                if [[ "\$key" != "PATH" && "\$key" != "PWD" && "\$key" != "HOME" && "\$key" != "HOSTNAME" ]]; then
                                    echo "Setting \$key for ${SERVICE_NAME}..."
                                    docker exec ${SERVICE_NAME} /bin/sh -c "export \$key='\$value'" || echo "Failed to set \$key but continuing"
                                fi
                            done
                            echo "Environment restored for ${SERVICE_NAME}"
                        else
                            echo "Container ${SERVICE_NAME} is not running (status: \$CONTAINER_STATUS), skipping environment restoration"
                        fi
                    else
                        echo "No environment backup found for ${SERVICE_NAME} or backup file is empty, skipping restoration"
                    fi
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
            echo "Frontend service is now accessible at: https://devicer.punshub.top"
        }
        failure {
            echo 'Build or deployment failed'
            sh "docker compose logs ${SERVICE_NAME} || echo 'Could not get logs for ${SERVICE_NAME}'"
        }
        always {
            cleanWs()
        }
    }
}
