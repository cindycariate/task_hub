<template>
  <div class="params-test">
    <h2>Params Approach Test</h2>
    <button @click="testParamsApproach" class="test-btn">Test Params Method</button>
    <button @click="testCurrentApproach" class="test-btn">Test Current Method</button>
    
    <div class="results">
      <h3>Results:</h3>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <p>Found {{ tasks.length }} tasks</p>
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <h4>{{ task.title }}</h4>
          <p><strong>Notes:</strong> {{ task.notes || 'No notes' }}</p>
          <small>ID: {{ task.id }}</small>
        </div>
      </div>
    </div>
    
    <div class="console-output">
      <h3>Console Output:</h3>
      <pre>{{ consoleOutput }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useTaskStoreParams } from '@/stores/taskStoreParams'
import { supabase } from '@/utils/supabase'

const taskStore = useTaskStore()
const taskStoreParams = useTaskStoreParams()

const tasks = ref([])
const loading = ref(false)
const consoleOutput = ref('')

// Capture console output
const originalLog = console.log
const originalError = console.error

const logToOutput = (message, type = 'log') => {
  const timestamp = new Date().toLocaleTimeString()
  consoleOutput.value += `[${timestamp}] ${type.toUpperCase()}: ${message}\n`
}

console.log = (...args) => {
  originalLog.apply(console, args)
  logToOutput(args.join(' '))
}

console.error = (...args) => {
  originalError.apply(console, args)
  logToOutput(args.join(' '), 'error')
}

const testParamsApproach = async () => {
  loading.value = true
  consoleOutput.value = ''
  
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    console.log('Testing params approach...')
    const result = await taskStoreParams.fetchTasksForUserWithParams(user.user.id)
    tasks.value = result || []
    console.log('Params approach completed successfully')
  } catch (error) {
    console.error('Params approach failed:', error.message)
    tasks.value = []
  } finally {
    loading.value = false
  }
}

const testCurrentApproach = async () => {
  loading.value = true
  consoleOutput.value = ''
  
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    console.log('Testing current approach...')
    const result = await taskStore.fetchTasksForUser(user.user.id)
    tasks.value = result || []
    console.log('Current approach completed successfully')
  } catch (error) {
    console.error('Current approach failed:', error.message)
    tasks.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('Params test component mounted')
})
</script>

<style scoped>
.params-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-btn {
  margin: 10px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.test-btn:hover {
  background: #369870;
}

.results {
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 5px;
}

.task-item {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 3px;
  border-left: 3px solid #42b883;
}

.console-output {
  margin-top: 20px;
  padding: 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 5px;
  max-height: 400px;
  overflow-y: auto;
}

.console-output pre {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>