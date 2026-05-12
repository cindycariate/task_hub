<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase'

const isDrawerVisible = ref(true)
const taskStore = useTaskStore()
const selectedDate = ref(new Date())
const searchQuery = ref('')

// Fetch tasks when the component is mounted
onMounted(async () => {
  try {
    const { data: user, error } = await supabase.auth.getUser()
    if (error) {
      console.error('CalendarView: Error fetching user:', error.message)
      return
    }
    if (user?.user?.id) {
      console.log('CalendarView: Fetching tasks for user:', user.user.id)
      await taskStore.fetchTasksForUser(user.user.id)
    }
  } catch (error) {
    console.error('CalendarView: Error in onMounted:', error.message)
  }
})

// Get tasks for a specific date
const getTasksForDate = (date) => {
  return taskStore.tasks.filter((task) => {
    const taskDate = task.deadline ? new Date(task.deadline) : null
    const startDate = task.start_date ? new Date(task.start_date) : null
    const endDate = task.end_date ? new Date(task.end_date) : null

    const checkDate = new Date(date)

    // Check if task deadline matches
    if (taskDate) {
      if (
        checkDate.getFullYear() === taskDate.getFullYear() &&
        checkDate.getMonth() === taskDate.getMonth() &&
        checkDate.getDate() === taskDate.getDate()
      ) {
        return true
      }
    }

    // Check if date falls within start and end date range
    if (startDate && endDate) {
      if (checkDate >= startDate && checkDate <= endDate) {
        return true
      }
    } else if (startDate) {
      if (
        checkDate.getFullYear() === startDate.getFullYear() &&
        checkDate.getMonth() === startDate.getMonth() &&
        checkDate.getDate() === startDate.getDate()
      ) {
        return true
      }
    }

    return false
  })
}

// Get priority color
const getPriorityColor = (priority) => {
  const colors = {
    Urgent: '#d32f2f',
    Important: '#f57c00',
    Routine: '#388e3c',
  }
  return colors[priority] || '#757575'
}

// Get priority text color
const getPriorityTextColor = (priority) => {
  return 'white'
}

// Format date to string
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Get tasks for selected date
const tasksForSelectedDate = computed(() => {
  const tasks = getTasksForDate(selectedDate.value)
  if (searchQuery.value.trim() === '') {
    return tasks
  }
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

// Get month year string
const monthYearString = computed(() => {
  return selectedDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Get calendar days for current month
const calendarDays = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  return days
})

// Check if date is today
const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// Check if date is selected
const isSelected = (date) => {
  if (!date) return false
  return (
    date.getFullYear() === selectedDate.value.getFullYear() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getDate() === selectedDate.value.getDate()
  )
}

// Navigate to previous month
const previousMonth = () => {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth() - 1,
    1
  )
}

// Navigate to next month
const nextMonth = () => {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth() + 1,
    1
  )
}

// Navigate to today
const goToToday = () => {
  selectedDate.value = new Date()
}

// Select a date
const selectDate = (date) => {
  if (date) {
    selectedDate.value = new Date(date)
  }
}

// Week days header
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <div class="calendar-view">
        <!-- Page Header -->
        <v-container class="pa-4">
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h3 font-weight-bold mb-2">Calendar Schedule</h1>
              <p class="text-subtitle1 text-grey">View and manage your tasks in calendar format</p>
            </v-col>
          </v-row>

          <!-- Main Calendar Section -->
          <v-row>
            <!-- Calendar Panel -->
            <v-col cols="12" md="8">
              <v-card class="elevation-2">
                <v-card-text class="pa-0">
                  <!-- Calendar Header -->
                  <div class="calendar-header pa-4 bg-light-blue">
                    <v-row align="center" justify="space-between">
                      <v-col cols="auto">
                        <h2 class="text-h5 font-weight-bold">{{ monthYearString }}</h2>
                      </v-col>
                      <v-col cols="auto" class="d-flex gap-2">
                        <v-btn
                          icon="mdi-chevron-left"
                          size="small"
                          variant="outlined"
                          @click="previousMonth"
                        ></v-btn>
                        <v-btn
                          text="Today"
                          size="small"
                          variant="outlined"
                          @click="goToToday"
                        ></v-btn>
                        <v-btn
                          icon="mdi-chevron-right"
                          size="small"
                          variant="outlined"
                          @click="nextMonth"
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Week Days Header -->
                  <div class="weekdays-header">
                    <div v-for="day in weekDays" :key="day" class="weekday-cell">
                      <strong>{{ day }}</strong>
                    </div>
                  </div>

                  <!-- Calendar Grid -->
                  <div class="calendar-grid">
                    <div
                      v-for="(date, index) in calendarDays"
                      :key="index"
                      :class="[
                        'calendar-day',
                        {
                          'empty-day': !date,
                          'today': isToday(date),
                          'selected': isSelected(date),
                        },
                      ]"
                      @click="selectDate(date)"
                    >
                      <div v-if="date" class="day-content">
                        <div class="day-number">{{ date.getDate() }}</div>
                        <div class="task-indicators">
                          <div
                            v-for="task in getTasksForDate(date).slice(0, 2)"
                            :key="task.id"
                            class="task-dot"
                            :style="{ backgroundColor: getPriorityColor(task.priority_level) }"
                            :title="task.title"
                          ></div>
                          <div
                            v-if="getTasksForDate(date).length > 2"
                            class="more-tasks"
                            :title="`${getTasksForDate(date).length - 2} more tasks`"
                          >
                            +{{ getTasksForDate(date).length - 2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Legend -->
              <v-card class="elevation-2 mt-4">
                <v-card-text class="pa-4">
                  <h3 class="text-h6 font-weight-bold mb-3">Priority Legend</h3>
                  <v-row>
                    <v-col cols="auto" class="d-flex align-center gap-2">
                      <div class="priority-dot" style="background-color: #d32f2f"></div>
                      <span>Urgent</span>
                    </v-col>
                    <v-col cols="auto" class="d-flex align-center gap-2">
                      <div class="priority-dot" style="background-color: #f57c00"></div>
                      <span>Important</span>
                    </v-col>
                    <v-col cols="auto" class="d-flex align-center gap-2">
                      <div class="priority-dot" style="background-color: #388e3c"></div>
                      <span>Routine</span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Tasks Sidebar -->
            <v-col cols="12" md="4">
              <v-card class="elevation-2 sticky-card">
                <v-card-text class="pa-4">
                  <h3 class="text-h6 font-weight-bold mb-3">
                    Tasks for {{ formatDate(selectedDate) }}
                  </h3>

                  <!-- Search Input -->
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search tasks..."
                    density="compact"
                    variant="outlined"
                    class="mb-4"
                  ></v-text-field>

                  <!-- Tasks List -->
                  <div class="tasks-list">
                    <div v-if="tasksForSelectedDate.length === 0" class="no-tasks">
                      <v-icon size="large" class="mb-2">mdi-calendar-blank</v-icon>
                      <p class="text-subtitle2 text-grey">No tasks scheduled for this date</p>
                    </div>

                    <v-card
                      v-for="task in tasksForSelectedDate"
                      :key="task.id"
                      class="task-card mb-3 elevation-1"
                    >
                      <v-card-text class="pa-3">
                        <!-- Task Header -->
                        <div class="d-flex align-start gap-2 mb-2">
                          <div
                            class="priority-indicator"
                            :style="{ backgroundColor: getPriorityColor(task.priority_level) }"
                          ></div>
                          <div class="flex-grow-1">
                            <h4 class="font-weight-bold text-sm">{{ task.title }}</h4>
                            <div class="task-meta mt-1">
                              <v-chip
                                size="x-small"
                                :color="
                                  task.status_name === 'Done'
                                    ? 'success'
                                    : task.status_name === 'In Progress'
                                      ? 'warning'
                                      : 'primary'
                                "
                                text-color="white"
                                class="me-2"
                              >
                                {{ task.status_name }}
                              </v-chip>
                              <v-chip
                                size="x-small"
                                :color="
                                  task.priority_level === 'Urgent'
                                    ? 'error'
                                    : task.priority_level === 'Important'
                                      ? 'warning'
                                      : 'success'
                                "
                                text-color="white"
                              >
                                {{ task.priority_level }}
                              </v-chip>
                            </div>
                          </div>
                        </div>

                        <!-- Task Description -->
                        <p v-if="task.description" class="text-xs text-grey mt-2 mb-2">
                          {{ task.description }}
                        </p>

                        <!-- Task Dates -->
                        <div class="task-dates text-xs text-grey mt-2">
                          <div v-if="task.deadline" class="mb-1">
                            <v-icon size="x-small" class="mr-1">mdi-calendar-check</v-icon>
                            Deadline: {{ formatDate(task.deadline) }}
                          </div>
                          <div v-if="task.start_date" class="mb-1">
                            <v-icon size="x-small" class="mr-1">mdi-calendar-start</v-icon>
                            Start: {{ formatDate(task.start_date) }}
                          </div>
                          <div v-if="task.end_date">
                            <v-icon size="x-small" class="mr-1">mdi-calendar-end</v-icon>
                            End: {{ formatDate(task.end_date) }}
                          </div>
                        </div>

                        <!-- Task Notes -->
                        <div v-if="task.notes" class="notes-preview mt-2 pa-2 bg-grey-100 rounded">
                          <p class="text-xs mb-0">
                            <strong>Notes:</strong> {{ task.notes.substring(0, 50) }}
                            <span v-if="task.notes.length > 50">...</span>
                          </p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.calendar-view {
  padding: 20px 0;
}

.bg-light-blue {
  background-color: #f0f8ff;
}

/* Calendar Grid */
.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  padding: 1px;
}

.weekday-cell {
  padding: 15px;
  text-align: center;
  background-color: #f5f5f5;
  font-weight: bold;
  color: #555;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  padding: 1px;
}

.calendar-day {
  min-height: 100px;
  padding: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.calendar-day:hover:not(.empty-day) {
  background-color: #f0f8ff;
  box-shadow: inset 0 0 8px rgba(0, 150, 200, 0.2);
}

.calendar-day.empty-day {
  background-color: #fafafa;
  cursor: default;
}

.calendar-day.today {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
}

.calendar-day.today .day-number {
  background-color: #ff9800;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.calendar-day.selected {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.calendar-day.selected .day-number {
  background-color: #2196f3;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.day-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.day-number {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  min-width: 24px;
}

.task-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.task-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.8;
}

.more-tasks {
  font-size: 10px;
  font-weight: bold;
  color: #666;
}

/* Tasks Sidebar */
.sticky-card {
  position: sticky;
  top: 20px;
}

.tasks-list {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
}

.no-tasks {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.task-card {
  border-left: 4px solid #2196f3;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.priority-indicator {
  width: 4px;
  height: 100%;
  border-radius: 2px;
  min-height: 60px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.task-dates {
  line-height: 1.6;
  color: #666;
}

.notes-preview {
  font-size: 12px;
  color: #666;
  border-radius: 4px;
  background-color: #f9f9f9;
  border-left: 3px solid #2196f3;
}

.priority-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.gap-2 {
  gap: 8px;
}

/* Scrollbar styling */
.tasks-list::-webkit-scrollbar {
  width: 6px;
}

.tasks-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.tasks-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.tasks-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 960px) {
  .sticky-card {
    position: static;
    top: 0;
  }

  .calendar-day {
    min-height: 80px;
  }

  .day-number {
    font-size: 12px;
  }
}
</style>
