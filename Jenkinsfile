@Library('jenkins-shared-lib') _

pipeline {
  agent any

  environment {
    IMAGE = "punkakz/snake-game"
    TAG = "build-${env.BUILD_ID}"
    DOCKER_CRED = "dockerhub-credentials-id"    // set in Jenkins Credentials
    SONAR_TOKEN = credentials('sonarcloud-token') // set in Jenkins
    SONAR_PROJECT = "Punkakz_snake-game"
    SONAR_ORG = "punkakz"
    EC2_IP = "98.81.243.46"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build & Test') { steps { buildApp() } }

    stage('SonarCloud') {
      steps { sonarScan(SONAR_PROJECT, SONAR_ORG) }
    }

    stage('Docker Build') {
      steps { dockerBuild(IMAGE, TAG) }
    }

    stage('Trivy Scan') {
      steps { trivyScan("${IMAGE}:${TAG}") }
    }

    stage('Docker Push') {
      steps { dockerPush(IMAGE, TAG, DOCKER_CRED) }
    }

    stage('Deploy') {
      steps {
        deployService(env.EC2_IP, '/home/ubuntu/deploy/snake-game')
      }
    }
  }

  post {
    success { notify("SUCCESS", "Deployed ${IMAGE}:${TAG} to ${EC2_IP}") }
    failure { notify("FAILURE", "Build failed for ${IMAGE}:${TAG}") }
  }
}

