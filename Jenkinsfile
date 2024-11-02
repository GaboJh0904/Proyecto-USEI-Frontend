pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/GaboJh0904/Proyecto-USEI-Frontend.git', branch: 'Frontend-branch' 
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install' 
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build' 
            }
        }

        stage('Deploy to Nginx') {
            steps {
                bat 'xcopy /E /I /Y dist C:\\Users\\ASUS\\Documents\\Nginx\\nginx-1.27.2\\html'
            }
        }
    }
}
