pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        APP_IMAGE = "trustretail-ai:${env.BUILD_NUMBER}"
        APP_IMAGE_LATEST = "trustretail-ai:latest"
        TRAEFIK_HOST = "trustretail.localhost"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'gemini-api-key', variable: 'VITE_GEMINI_API_KEY')]) {
                    sh '''
                      docker build \
                        --build-arg VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY} \
                        -t ${APP_IMAGE} \
                        -t ${APP_IMAGE_LATEST} .
                    '''
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                  trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --no-progress \
                    ${APP_IMAGE}
                '''
            }
        }

        stage('Deploy With Compose') {
            steps {
                withCredentials([
                    string(credentialsId: 'gemini-api-key', variable: 'VITE_GEMINI_API_KEY'),
                    string(credentialsId: 'grafana-admin-user', variable: 'GRAFANA_ADMIN_USER'),
                    string(credentialsId: 'grafana-admin-password', variable: 'GRAFANA_ADMIN_PASSWORD')
                ]) {
                    sh '''
                      export TRAEFIK_HOST=${TRAEFIK_HOST}
                      docker compose up -d --build
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}" | head -n 20 || true'
        }
        success {
            echo 'Pipeline completed: tests + build + Trivy + deployment succeeded.'
        }
        failure {
            echo 'Pipeline failed. Check logs for the failed stage.'
        }
    }
}
