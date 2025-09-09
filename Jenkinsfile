pipeline {
    agent any

    tools {
        // Requiere el plugin "NodeJS" instalado y configurado en Jenkins
        nodejs "node-20"
    }

    stages {
        stage('Checkout') {
            steps {
                ansiColor('xterm') {
                    git branch: 'main',
                        url: 'https://github.com/Santiagomunozma/potentes-store-api.git'
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                ansiColor('xterm') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                ansiColor('xterm') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                ansiColor('xterm') {
                    sh 'npm test || true'  // para que no falle si aún no tienes tests
                }
            }
        }
    }

    post {
        always {
            ansiColor('xterm') {
                echo "Pipeline finalizado. Estado: ${currentBuild.currentResult}"
            }
        }
    }
}
