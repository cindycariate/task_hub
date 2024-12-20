<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const taskStore = useTaskStore()

// Fetch tasks when the component is mounted
onMounted(() => {
  taskStore.fetchTasks()
})

// State to control the visibility of the create task modal
const showCreateTaskModal = ref(false)

// New task inputs
const newTask = ref({
  title: '',
  description: '',
  notes: '',
  deadline: '',
  start_date: '',
  end_date: '',
  status_name: 'To Do', // Default status
  priority_level: 'Routine', // Default priority
})

// Function to add a new task
const addTask = async () => {
  const { data: user, error } = await supabase.auth.getUser() // Get the authenticated user

  if (newTask.value.title.trim()) {
    try {
      // Add the task and retrieve its ID
      const taskId = await taskStore.addTask({
        title: newTask.value.title,
        description: newTask.value.description,
        deadline: newTask.value.deadline,
        start_date: newTask.value.start_date,
        end_date: newTask.value.end_date,
        status_name: newTask.value.status_name,
        priority_level: newTask.value.priority_level,
        user_id: user?.user?.id, // Pass the user ID
      })

      console.log('Newly added task ID:', taskId) // Debugging log

      // Add a note referencing the task
      if (newTask.value.notes.trim()) {
        if (taskId) {
          await taskStore.addNote({
            task_id: taskId, // Link the note to the task
            notes: newTask.value.notes,
          })
        } else {
          console.error('Task ID is null or undefined. Cannot add note.')
        }
      }

      // Reset form and close modal
      newTask.value = {
        title: '',
        description: '',
        notes: '',
        deadline: '',
        start_date: '',
        end_date: '',
        status_name: 'To Do',
        priority_level: 'Routine',
      }
      showCreateTaskModal.value = false
    } catch (error) {
      console.error('Error adding task:', error.message)
    }
  }
  if (error) {
    console.error('Error fetching user:', error.message)
    return // Stop execution if there's an error
  }

  console.log('Authenticated user:', user) // Debugging log
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <div class="home-content auth-background">
        <v-row>
          <!-- Responsive image column -->
          <v-col cols="12" sm="6" md="5" class="d-flex justify-center">
            <img src="/src/assets/img/home_img.png" class="img-fluid bouncing-image" height="330" />
          </v-col>

          <!-- Responsive welcome message -->
          <v-col cols="12" sm="6" md="7">
            <div class="welcome-message text-center text-sm-left">
              <h1 class="text-white text-h2 mb-4">
                Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
              </h1>
              <p class="mb-3">Visually Manage Your Tasks</p>
              <button @click="showCreateTaskModal = true" class="create-new-btn rounded-pill">
                <i class="mdi mdi-plus"></i> Create New
              </button>
            </div>
          </v-col>
        </v-row>

        <!-- Create Task Modal -->
        <v-dialog v-model="showCreateTaskModal" max-width="500px">
          <v-card>
            <v-card-title>Create New Task</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="newTask.title" label="Title" required></v-text-field>
                <v-textarea v-model="newTask.description" label="Description"></v-textarea>
                <v-text-field v-model="newTask.notes" label="Notes"></v-text-field>
                <input
                  type="datetime-local"
                  v-model="newTask.deadline"
                  label="Deadline Date/Time"
                />
                <input type="datetime-local" v-model="newTask.start_date" label="Start Date/Time" />
                <input type="datetime-local" v-model="newTask.end_date" label="End Date/Time" />
                <v-select
                  v-model="newTask.status_name"
                  :items="['To Do', 'In Progress', 'Done']"
                  label="Status"
                ></v-select>
                <v-select
                  v-model="newTask.priority_level"
                  :items="['Important', 'Urgent', 'Routine']"
                  label="Priority"
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="addTask">Add Task</v-btn>
              <v-btn text @click="showCreateTaskModal = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
/* BACKGROUND */

.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #0d9ea6);
  background-size: 200% 200%;
  background-position: 0% 50%;
  animation: moveBackground 10s linear infinite;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Keyframe animation for moving background */
@keyframes moveBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* BOUNCING IMAGE */
.bouncing-image {
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* WELCOME PAGE */
.create-new-btn {
  background: #0097a7;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}
.home-content {
  align-items: center;
  color: white;
}
.welcome-message h1 {
  font-weight: bolder;
  font-family: 'Poppins';
  padding-bottom: 3px;
  margin: 0;
}
.welcome-message p {
  font-weight: 500;
  font-size: 25px;
  color: rgb(236, 229, 221);
  margin: 0;
}
.welcome-message {
  padding: 0;
  margin-left: 5px;
}
.hub-text {
  color: aqua;
}
</style>
