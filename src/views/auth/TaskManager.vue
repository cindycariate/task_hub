<script setup>
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'
import TaskForm from '@/components/auth/TaskForm.vue'

const tasksStore = useTasksStore()

const showForm = ref(false)
const isEdit = ref(false)
const selectedTask = ref(null)

// Open form for new/edit task
const openForm = (task = null) => {
  selectedTask.value = task ? { ...task } : null
  isEdit.value = !!task
  showForm.value = true
}

// Close form
const closeForm = () => {
  showForm.value = false
  selectedTask.value = null
}

// Save Task
const saveTask = async (task) => {
  // Ensure dates are formatted for datetime-local fields
  task.start_date = task.start_date ? task.start_date : ''
  task.end_date = task.end_date ? task.end_date : ''
  task.deadline = task.deadline ? task.deadline : ''

  if (isEdit.value) {
    await tasksStore.updateTask(task)
  } else {
    await tasksStore.addTask(task)
  }
  closeForm()
}

onMounted(() => tasksStore.fetchTasks())
</script>

<template>
  <div>
    <button @click="openForm()" class="btn-primary">New Task</button>

    <ul>
      <li v-for="task in tasksStore.tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <small>Deadline: {{ task.deadline }}</small>
        <button @click="openForm(task)">Edit</button>
        <button @click="tasksStore.deleteTask(task.id)">Delete</button>
      </li>
    </ul>

    <!-- Task Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <TaskForm
        :initial-task="selectedTask || {}"
        :is-edit="isEdit"
        @save="saveTask"
        @cancel="closeForm"
      />
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  background-color: #1e90ff;
  color: white;
  padding: 10px;
  cursor: pointer;
}
ul {
  list-style: none;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
