<template>
  <div class="logging-demo">
    <div class="demo-header">
      <h2>🔒 Production-Safe Logging Demo</h2>
      <div class="environment-badge" :class="environmentClass">
        {{ currentEnvironment.toUpperCase() }}
      </div>
    </div>

    <div class="demo-section">
      <h3>Current Environment Detection</h3>
      <p>
        Environment: <strong>{{ currentEnvironment }}</strong>
      </p>
      <p>
        <em>
          {{
            currentEnvironment === 'development'
              ? 'Full logging and debugging information visible'
              : 'Production mode - sensitive information hidden from users'
          }}
        </em>
      </p>
    </div>

    <div class="demo-section">
      <h3>Test Logging Functions</h3>
      <div class="button-group">
        <button @click="testDevLogging" class="demo-btn">Test Dev Logging</button>
        <button @click="testErrorHandling" class="demo-btn">Test Error Handling</button>
        <button @click="testSensitiveData" class="demo-btn">Test Data Protection</button>
        <button @click="clearOutput" class="demo-btn secondary">Clear Output</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Console Output Preview</h3>
      <div class="console-output" ref="consoleOutput">
        {{ outputText || 'Click buttons above to test logging. Also check browser console (F12).' }}
      </div>
    </div>

    <div class="demo-section">
      <h3>Key Features</h3>
      <ul class="feature-list">
        <li>✅ Development logs show detailed debugging information</li>
        <li>✅ Production mode hides sensitive data from users</li>
        <li>✅ Error details stored securely for developers</li>
        <li>✅ User-friendly error messages always shown</li>
        <li>✅ Automatic environment detection</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { logger, ErrorHandler } from '@/utils/logger.js'

export default {
  name: 'LoggingDemo',
  data() {
    return {
      outputText: '',
      currentEnvironment: import.meta.env.MODE || 'development',
    }
  },
  computed: {
    environmentClass() {
      return this.currentEnvironment === 'development' ? 'env-dev' : 'env-prod'
    },
  },
  methods: {
    addToOutput(message) {
      this.outputText += message + '\n\n'
      this.$nextTick(() => {
        this.$refs.consoleOutput.scrollTop = this.$refs.consoleOutput.scrollHeight
      })
    },

    testDevLogging() {
      this.addToOutput('=== TESTING DEVELOPMENT LOGGING ===')
      logger.dev('This is a development log message')

      const sampleTaskData = {
        id: 123,
        title: 'Sample Task',
        description: 'Testing logging functionality',
        user_id: 456,
        apiKey: 'sk-secret123', // This should be sanitized
        password: 'userPassword', // This should be hidden
      }

      logger.dev('Task data received:', logger.sanitizeForLogging(sampleTaskData))
      logger.dev('Processing completed successfully')

      this.addToOutput('✅ Development logging test completed')
      this.addToOutput('Check browser console for detailed logs')
    },

    testErrorHandling() {
      this.addToOutput('=== TESTING ERROR HANDLING ===')

      try {
        // Simulate an API error
        throw new Error(
          'Simulated database connection error with sensitive details: API_KEY=sk-123456',
        )
      } catch (error) {
        const errorInfo = ErrorHandler.handleApiError(error, 'create task')
        logger.error(errorInfo.userMessage, error, {
          operation: 'addTask',
          userId: 123,
          sensitiveData: 'This should be hidden in production',
          databaseUrl: 'postgresql://user:pass@localhost:5432/db',
        })

        this.addToOutput('❌ Error handled gracefully')
        this.addToOutput('User sees: ' + errorInfo.userMessage)
        this.addToOutput('Developer details stored securely')
      }
    },

    testSensitiveData() {
      this.addToOutput('=== TESTING SENSITIVE DATA PROTECTION ===')

      const sensitiveUserData = {
        id: 789,
        name: 'Test User',
        email: 'test@example.com',
        password: 'mySecretPassword123',
        apiKey: 'sk-1234567890abcdef',
        token: 'jwt-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        creditCard: '4111-1111-1111-1111',
        ssn: '123-45-6789',
      }

      logger.dev('Raw user data:', sensitiveUserData)
      logger.dev('Sanitized user data:', logger.sanitizeForLogging(sensitiveUserData))

      this.addToOutput('🛡️ Sensitive data protection test completed')
      this.addToOutput('In production: sensitive fields are hidden')
      this.addToOutput('In development: sensitive fields are redacted but structure shown')
    },

    clearOutput() {
      this.outputText = ''
    },
  },
}
</script>

<style scoped>
.logging-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.demo-header h2 {
  margin: 0;
  color: #333;
}

.environment-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.env-dev {
  background-color: #e3f2fd;
  color: #1976d2;
}

.env-prod {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.demo-section {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.demo-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.demo-btn {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.demo-btn:hover {
  background-color: #45a049;
}

.demo-btn.secondary {
  background-color: #757575;
}

.demo-btn.secondary:hover {
  background-color: #616161;
}

.console-output {
  background-color: #1e1e1e;
  color: #00e676;
  padding: 15px;
  border-radius: 6px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  border: 1px solid #333;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  font-size: 14px;
}

.feature-list li:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
