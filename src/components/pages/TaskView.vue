<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const taskStore = useTaskStore()

// Fetch tasks for the logged-in user when the component is mounted
onMounted(async () => {
  const { data: user, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }
  if (user && user.user) {
    await taskStore.fetchTasksForUser(user.user.id)
  } else {
    console.error('User data is not available')
  }
})

// New task input model
const newTask = ref({
  title: '',
  description: '',
  notes: '',
  status_name: 'To Do',
  priority_level: 'Routine',
  deadline: '',
  start_date: '',
  end_date: '',
})

// Function to edit a task
const isEditDialogVisible = ref(false)
const editTaskData = ref({
  id: null,
  title: '',
  description: '',
  notes: '',
  status_name: '',
})

const openEditDialog = (index) => {
  const task = taskStore.tasks[index]
  editTaskData.value = { ...task } // Pre-fill the modal with task data
  isEditDialogVisible.value = true
}

// Remove the unused computed property
// const tasks = computed(() => taskStore.tasks)

const saveEditTask = async () => {
  try {
    // Update the task with all relevant fields
    await taskStore.editTask(editTaskData.value.id, {
      title: editTaskData.value.title,
      description: editTaskData.value.description,
      deadline: editTaskData.value.deadline,
      status_name: editTaskData.value.status_name,
      priority_level: editTaskData.value.priority_level,
      notes: editTaskData.value.notes, // Ensure notes are included in the update
    })

    isEditDialogVisible.value = false
  } catch (error) {
    console.error('Error saving task:', error.message)
  }
}
// Computed properties to categorize tasks by priority
// const tasks = computed(() => taskStore.tasks)

// Function to delete a task
const deleteTask = async (index) => {
  const task = taskStore.tasks[index]
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(task.id)
  }
}

// Filter tasks for "Due Today"
const dueTodayTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return taskStore.tasks.filter((task) => task.deadline === today)
})

// Filter tasks nearing their deadline (e.g., within 3 days)
const nearingDeadlineTasks = computed(() => {
  const today = new Date()
  return taskStore.tasks.filter((task) => {
    const deadline = new Date(task.deadline)
    const diffTime = Math.abs(deadline - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  })
})
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head"> </v-tabs>
          <v-container fluid>
            <v-row>
              <!-- First Column: My Tasks -->
              <v-col :cols="12" md="8">
                <v-card-title class="d-flex align-center">
                  <div class="d-flex align-center" style="font-family: 'Poppins'; color: #00838f">
                    <span class="mr-2"><b>My Tasks</b></span>
                    <v-icon style="font-size: 25px" color="cyan-darken-2"
                      >mdi-progress-pencil</v-icon
                    >
                  </div>
                </v-card-title>
                <v-card-subtitle class="mb-3" style="font-family: 'Poppins'"
                  >Stay on Top of Your Tasks</v-card-subtitle
                >

                <!-- Task List -->
                <div v-if="taskStore.loading">Loading tasks...</div>
                <div v-else>
                  <v-row
                    v-for="(task, index) in taskStore.tasks"
                    :key="index"
                    class="task-container mb-2 align-center"
                    align="center"
                    justify="space-between"
                  >
                    <!-- Left Side: Task Panel -->
                    <v-col cols="12" md="10">
                      <v-expansion-panels>
                        <v-expansion-panel class="custom-border">
                          <v-expansion-panel-title>
                            <!-- Task Title -->
                            <strong>{{ task.title }}</strong>
                          </v-expansion-panel-title>

                          <v-expansion-panel-text>
                            <!-- Task Details -->
                            <div><strong>Description:</strong> {{ task.description }}</div>
                            <div><strong>Notes:</strong> {{ task.notes }}</div>
                            <div><strong>Due Date:</strong> {{ task.deadline }}</div>
                            <div><strong>Priority:</strong> {{ task.priority_level }}</div>
                            <div><strong>Status:</strong> {{ task.status_name }}</div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>

                    <!-- Right Side: Edit and Delete Buttons -->
                    <v-dialog v-model="isEditDialogVisible" max-width="500">
                      <v-card class="elevation-3 edit-dialog">
                        <v-card-title
                          style="font-family: 'Poppins'; font-weight: bold; color: #00838f"
                          class="text-center"
                          ><v-icon>mdi-pencil</v-icon> Edit Task</v-card-title
                        >
                        <v-card-text>
                          <v-text-field
                            v-model="editTaskData.title"
                            label="Task Title"
                            outlined
                            dense
                            color="cyan-darken-3"
                          ></v-text-field>
                          <v-textarea
                            v-model="editTaskData.description"
                            label="Task Description"
                            outlined
                            dense
                            color="cyan-darken-3"
                            rows="3"
                          ></v-textarea>
                          <v-textarea
                            v-model="editTaskData.notes"
                            label="Notes"
                            outlined
                            dense
                            color="cyan-darken-3"
                            rows="3"
                          ></v-textarea>
                          <v-select
                            v-model="editTaskData.status_name"
                            :items="['To Do', 'In Progress', 'Done']"
                            label="Task Status"
                            outlined
                            dense
                            color="cyan-darken-3"
                          ></v-select>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            color="red lighten-1"
                            text
                            @click="isEditDialogVisible = false"
                            class="cancel-btn rounded-pill"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="cyan-darken-3"
                            text
                            @click="saveEditTask"
                            class="save-btn rounded-pill"
                            >Save</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-col cols="12" md="2" class="d-flex justify-end">
                      <v-btn
                        color="cyan-darken-2"
                        size="small"
                        @click="openEditDialog(index)"
                        class="mr-2 ml-2"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>

                      <v-btn color="red" size="small" @click="deleteTask(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <!-- Second Column: Due Today -->
              <v-col :cols="12" md="4">
                <h2 class="text-h5 mb-3" style="color: red; font-family: 'Poppins'">
                  <b>Due Today</b>
                </h2>
                <v-card v-for="(task, index) in dueTodayTasks" :key="index" class="mb-2" outlined>
                  <v-card-text>
                    <strong>{{ task.title }}</strong>
                    <div class="text-caption">Deadline: {{ task.deadline || '-' }}</div>
                  </v-card-text>
                </v-card>

                <!-- Tasks Nearing Deadline -->
                <h2 class="text-h5 mb-3" style="color: orange; font-family: 'Poppins'">
                  <b>Nearing Deadline</b>
                </h2>
                <v-card
                  v-for="(task, index) in nearingDeadlineTasks"
                  :key="index"
                  class="mb-2"
                  outlined
                >
                  <v-card-text>
                    <strong>{{ task.title }}</strong>
                    <div class="text-caption">Deadline: {{ task.deadline || '-' }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <!-- Add Task Modal -->
    </template>
  </AppLayout>
</template>

<style scoped>
/* Gradient background */
.gradient-bg {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Container styling */
.container {
  position: relative;
  padding: 20px;
}

/* Button positioning */
.menu-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}
.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  /* background-image: url('@/assets/img/bg.jpg'); */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.toggle-btn {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}
.text-caption {
  color: #777;
  font-size: 0.9em;
}
.custom-border {
  border: 2px solid #0097a7; /* Adjust color as needed */
  border-radius: 8px; /* Optional: Adds rounded corners */
}

/* DIALOG */

.add-task-dialog {
  border-radius: 12px; /* Round corners */
  border: 2px solid #0097a7; /* Adjust color as needed */
  overflow: hidden;
  background-color: #f7f9fa; /* Light background for contrast */
}

.cancel-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.save-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  border: 2px solid #0097a7;
}
</style>
