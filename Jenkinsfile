@Library('jenkins-shared-lib') _

pipeline {
    agent any

    environment {
        IMAGE = "punkakz/snake-game"
        TAG = "build-${env.BUILD_ID}"

        // Credentials
        DOCKER_CRED = "dockerhub-credentials-id"   // your actual ID
        SONAR_TOKEN = credentials('sonarcloud-token')

        // SonarCloud
        SONAR_PROJECT = "Punkakz_snake-game"
        SONAR_ORG = "punkakz"

        // Deployment
        EC2_IP = "98.81.243.46"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                buildApp()
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                sonarScan(SONAR_PROJECT, SONAR_ORG)
            }
        }

        stage('Docker Build') {
            steps {
                dockerBuild(IMAGE, TAG)
            }
        }

        stage('Docker Push') {
            steps {
                dockerPush(IMAGE, TAG, DOCKER_CRED)
            }
        }

	stage('Deploy Application') {
    steps {
        deployService("/home/ubuntu/git/snake-game/deploy")
    }
}


    }

    post {
        success {
            notify("SUCCESS", "Deployed ${IMAGE}:${TAG} to ${EC2_IP}")
        }
        failure {
            notify("FAILURE", "Build failed for ${IMAGE}:${TAG}")
        }
    }
}

