pipeline {
    agent any

    environment {
        // Forces Docker to use a clean, consistent name instead of the random Jenkins workspace name
        COMPOSE_PROJECT_NAME = 'Forensic-Medical-Project'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically pulls the latest code from your main branch
                checkout scm
            }
        }

        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    // Installs dependencies using the Node.js we installed on your EC2
                    sh 'npm install'
                    
                    // TODO: Uncomment the line below once you write your Jest/Mocha tests
                    // sh 'npm test'
                    echo 'Backend is ready!'
                }
            }
        }

        stage('Frontend Build & Test') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    
                    // TODO: Uncomment the line below once you write your Vite/React tests
                    // sh 'npm test'
                    echo 'Frontend is ready!'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sh '''
                    docker compose down
                    docker compose build --no-cache
                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Cleanup') {
            steps {
                // This is CRITICAL. It automatically deletes old Docker images after every successful deploy
                // so your new 30GB hard drive never fills up to 100% again!
                sh 'docker image prune -af'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful! The new version is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check the Jenkins logs. The previous working version is likely still running.'
        }
        always {
            // Deletes the source code from the Jenkins folder after it finishes to save disk space
            cleanWs()
        }
    }
}