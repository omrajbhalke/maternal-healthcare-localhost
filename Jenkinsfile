pipeline {
    agent any

    environment {
        PYTHON_HOME = 'C:\\Program Files\\Python311'
        PATH = "${env.PYTHON_HOME};${env.PYTHON_HOME}\\Scripts;${env.PATH}"
        SCANNER_HOME = tool 'Sonar-scanner'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/omrajbhalke/Maternal-Health-risk-predictor.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '"%PYTHON_HOME%\\python.exe" --version'
                bat '"%PYTHON_HOME%\\python.exe" -m pip install --upgrade pip'
                bat '"%PYTHON_HOME%\\python.exe" -m pip install -r requirements.txt'
                bat '"%PYTHON_HOME%\\python.exe" -m pip install pytest coverage pytest-cov'
            }
        }

        stage('Run Tests and Generate Coverage') {
            steps {
                bat '"%PYTHON_HOME%\\python.exe" -m coverage run -m pytest'
                bat '"%PYTHON_HOME%\\python.exe" -m coverage xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                bat """
                    "%SCANNER_HOME%\\bin\\sonar-scanner" ^
                    -Dsonar.projectKey=CI_CD ^
                    -Dsonar.projectName=CI_CD ^
                    -Dsonar.host.url=http://localhost:9000 ^
                    -Dsonar.login=squ_f9fc363bfc87d622792b3dc2af6917eceb2eac4f ^
                    -Dsonar.sources=. ^
                    -Dsonar.sourceEncoding=UTF-8 ^
                    -Dsonar.python.coverage.reportPaths=coverage.xml
                """
            }
        }
        stage('OWASP Dependency Check'){
            steps{
                dependencyCheck additionalArguments: '--scan ./', odcInstallation:'DP'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Docker Build and Push') {
    steps {
        script {
            def IMAGE_NAME = 'omrajbhalke/maternal_health'
            def IMAGE_TAG = 'latest'

            // Use the correct credentials ID 'Docker' instead of 'dockerhub-credentials'
            docker.withRegistry('https://index.docker.io/v1/', 'Docker') {
                def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                customImage.push()
            }
        }
    }
}
stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    bat 'docker rm -f maternal_health_container || exit 0'

                    // Run the container with MongoDB connection
                    bat 'docker run -d --name maternal_health_container -p 5000:5000 -e MONGO_URL=mongodb://host.docker.internal:27017 omrajbhalke/maternal_health:latest'
                }
            }
        }
stage('Verify Trivy Installed') {
    steps {
        bat 'trivy --version'
    }
}


    }
}
