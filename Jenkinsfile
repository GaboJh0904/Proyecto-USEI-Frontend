pipeline {
    agent any
    tools {
        nodejs 'NodeJS 18' // Define NodeJS globalmente
    }

    stages {
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
