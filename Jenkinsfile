pipeline {
    agent any

    environment {
        IMAGE_NAME = "trustretail-ai"
        CONTAINER_NAME = "trustretail-app"
        PORT = "3000"
        VITE_GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Manoghna2005/trustretail-ai.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('TypeScript Validation') {
            steps {
                bat 'npm run lint'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build ^
                --build-arg VITE_GEMINI_API_KEY=%VITE_GEMINI_API_KEY% ^
                -t %IMAGE_NAME% .
                """
            }
        }

        stage('Scan Docker Image') {
            steps {
                bat """
                "C:\\Users\\Manu\\AppData\\Local\\Microsoft\\WinGet\\Packages\\AquaSecurity.Trivy_Microsoft.Winget.Source_8wekyb3d8bbwe\\trivy.exe" image --severity HIGH,CRITICAL %IMAGE_NAME%
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                bat """
                docker rm -f %CONTAINER_NAME% || exit 0
                """
            }
        }

        stage('Run New Container') {
            steps {
                bat """
                docker run -d ^
                --name %CONTAINER_NAME% ^
                -p %PORT%:80 ^
                %IMAGE_NAME%
                """
            }
        }

        stage('Health Check') {
            steps {
                bat """
                timeout /t 10 > nul
                curl http://localhost:%PORT%
                """
            }
        }
    }

    post {
        success {
            echo 'CI/CD + DevSecOps pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check stage logs.'
        }
    }
}