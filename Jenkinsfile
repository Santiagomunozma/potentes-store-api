pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
  }

  tools {
    nodejs 'node-20'   // Configurado en Global Tool Configuration
  }

  environment {
    // Vercel (Secret text credentials)
    VERCEL_TOKEN      = credentials('vercel-token')
    VERCEL_ORG_ID     = credentials('vercel-org-id')
    VERCEL_PROJECT_ID = credentials('vercel-project-id')

    // Base de datos para CI (rama de pruebas en Neon)
    DATABASE_URL = credentials('neon-test-db-url')

    // Ayuda a algunos toolchains en CI
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Instalar dependencias') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint & Typecheck') {
      steps {
        sh 'npm run lint --if-present'
        sh 'npm run typecheck --if-present'
      }
    }

    stage('Tests') {
      steps {
        sh 'npm test --if-present'
      }
      post {
        always {
          // Si generas reportes JUnit o cobertura, publícalos aquí
          // junit 'reports/junit/*.xml'
          // publishHTML([...])
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Preview deploy (Vercel)') {
      when { not { branch 'main' } }
      steps {
        sh '''
          npx vercel pull --yes --environment=preview --token="$VERCEL_TOKEN"
          npx vercel build
          PREVIEW_URL=$(npx vercel deploy --prebuilt --token="$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID")
          echo "PREVIEW_URL=$PREVIEW_URL"
          echo "$PREVIEW_URL" > preview_url.txt
        '''
        archiveArtifacts artifacts: 'preview_url.txt', onlyIfSuccessful: true
      }
    }

    stage('Production deploy (Vercel)') {
      when { branch 'main' }
      steps {
        input message: '¿Desplegar a PRODUCCIÓN en Vercel?', ok: 'Deploy'
        sh '''
          npx vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
          npx vercel build --prod
          npx vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID"
        '''
      }
    }
  }

  post {
    success {
      echo "Pipeline OK"
    }
    failure {
      echo "Pipeline FAILED"
    }
  }
}
