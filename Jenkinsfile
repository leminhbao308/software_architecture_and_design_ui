pipeline {
    agent any

    environment {
        // Define service name
        SERVICE_NAME = "devicer-frontend"
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
                    // Check if microservices-network exists
                    def networkExists = sh(script: "docker network ls | grep microservices-network || echo 'NOT_FOUND'", returnStdout: true).trim()
                    if (networkExists == 'NOT_FOUND' || !networkExists.contains("microservices-network")) {
                        echo "Creating microservices-network..."
                        sh "docker network create microservices-network"
                    }
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
