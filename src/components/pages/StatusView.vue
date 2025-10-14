<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)

// for the tabs part
const tab = ref('one')

// Toggle function for the sidebar
const toggleSidebar = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

// Initialize the task store
const taskStore = useTaskStore()

// Fetch tasks from the database on component mount
onMounted(async () => {
  const { data: user, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }
  if (user && user.user) {
    await taskStore.fetchTasksForUser(user.user.id) // Pass the user ID to fetchTasksForUser
  } else {
    console.error('User data is not available')
  }
})

// Computed properties to categorize tasks by priority
const todoTasks = computed(() => taskStore.tasks.filter((task) => task.status_name === 'To Do'))
const inprogressTasks = computed(() =>
  taskStore.tasks.filter((task) => task.status_name === 'In Progress'),
)
const doneTasks = computed(() => taskStore.tasks.filter((task) => task.status_name === 'Done'))

// Function to delete a task
const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(taskId)
  }
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <v-tab value="one">To Do</v-tab>
            <v-tab value="two">In Progress</v-tab>
            <v-tab value="three">Done</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one">
                <v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f">
                      <b>To Do Tasks </b>
                      <v-icon
                        class="mdi mdi-alert-circle-outline"
                        style="font-size: 25px"
                        color="red-darken-3"
                      ></v-icon>
                    </v-card-title>
                    <v-card-subtitle>Plan, Prioritize, and Complete your tasks</v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                        <v-card
                          v-for="task in todoTasks"
                          :key="task.id"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <div>
                              <div><strong>Title: </strong>{{ task.title }}</div>
                              <div><strong>Due Date: </strong> {{ task.deadline }}</div>
                              <div v-if="task.notes"><strong>Notes: </strong>{{ task.notes }}</div>
                            </div>
                            <div>
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(task.id)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="two">
                <v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f">
                      <b>In Progress Tasks </b>
                      <v-icon
                        class="mdi mdi-alert-octagon-outline"
                        style="font-size: 25px"
                        color="red-darken-3"
                      ></v-icon>
                    </v-card-title>
                    <v-card-subtitle> Plan, Prioritize, and Complete your tasks </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                        <v-card
                          v-for="task in inprogressTasks"
                          :key="task.id"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <div>
                              <div><strong>Title:</strong>{{ task.title }}</div>
                              <div><strong>Due Date:</strong> {{ task.deadline }}</div>
                              <div v-if="task.notes"><strong>Notes: </strong>{{ task.notes }}</div>
                            </div>
                            <div>
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(task.id)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="three">
                <v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f">
                      <b>Done Tasks</b>
                      <v-icon
                        class="mdi mdi-clipboard-text-clock-outline"
                        style="font-size: 25px"
                        color="cyan-darken-2"
                      ></v-icon>
                    </v-card-title>
                    <v-card-subtitle> Plan, Prioritize, and Complete your tasks </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>
                        <v-card
                          v-for="task in doneTasks"
                          :key="task.id"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <div>
                              <div><strong>Title:</strong>{{ task.title }}</div>
                              <div><strong>Due Date:</strong> {{ task.deadline }}</div>
                              <div v-if="task.notes"><strong>Notes: </strong>{{ task.notes }}</div>
                            </div>
                            <div>
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(task.id)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-container>
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
.custom-border {
  border: 2px solid #0097a7; /* Adjust color as needed */
  border-radius: 8px; /* Optional: Adds rounded corners */
}
</style>
