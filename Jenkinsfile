pipeline {
    environment {
        imagename = 'registry.oasis-deu.xyz/metaland-accounts'
        dockerImage = ''
    }
    agent any
    stages {
        stage('Checkout git') {
            steps {
                checkout scm
            }
        }
        stage('Building image') {
            steps {
                script {
                    dockerImage = docker.build(imagename)
                }
            }
        }
        stage('Deploy Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.oasis-deu.xyz', 'oasis-credential') {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Remove Unused docker image') {
            steps {
                sh "docker rmi $imagename:$BUILD_NUMBER"
                sh "docker rmi $imagename:latest"
            }
        }
    }
}
