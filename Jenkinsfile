pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/home/anuj/petstream-deploy/frontend"
    }

    stages {
        stage('Clone Repo') {
            steps {
                echo 'Cloning frontend repository...'
                deleteDir()
                git(
                    url: 'https://github.com/MKN-Infotech/petstream-frontend.git',
                    credentialsId: 'github-petstream-frontend-token',
                    branch: 'main'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                echo 'Building the React frontend...'
                sh '''
                    export CI=false
                    npm run build
                '''
            }
        }

        stage('Deploy Build') {
            steps {
                echo "Deploying to $DEPLOY_DIR ..."
                sh """
                    rm -rf $DEPLOY_DIR
                    mkdir -p $DEPLOY_DIR
                    cp -r build/* $DEPLOY_DIR/
                """
            }
        }
    }

    post {
        success {
            echo '✅ Frontend deployed successfully!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
