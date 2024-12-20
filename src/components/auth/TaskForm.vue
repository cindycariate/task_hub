<script setup>
import { reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  initialTask: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      deadline: '',
      start_date: '',
      end_date: '',
      priority_level: 'Low',
      status_name: 'To Do',
      notes: '',
    }),
  },
  isEdit: Boolean,
})

const emit = defineEmits(['save', 'cancel'])

const form = reactive({ ...props.initialTask })

watch(
  () => props.initialTask,
  (newVal) => {
    // Ensure dates are properly formatted when opening the form
    if (newVal) {
      form.start_date = newVal.start_date || null
      form.end_date = newVal.end_date || null
      form.deadline = newVal.deadline || null
    }
    Object.assign(form, newVal)
  },
  { immediate: true },
)

const submitForm = () => {
  // Ensure proper formatting for datetime fields before emitting the data
  form.start_date = form.start_date || null
  form.end_date = form.end_date || null
  form.deadline = form.deadline || null

  // Emit the task data after ensuring proper formats
  emit('save', { ...form })
}
</script>

<template>
  <div class="modal">
    <h2>{{ isEdit ? 'Edit Task' : 'New Task' }}</h2>
    <label>Title: <input v-model="form.title" /></label>
    <label>Description: <textarea v-model="form.description" /></label>
    <label>Start Date: <input type="datetime-local" v-model="form.start_date" /></label>
    <label>End Date: <input type="datetime-local" v-model="form.end_date" /></label>
    <label>Deadline: <input type="datetime-local" v-model="form.deadline" /></label>
    <label
      >Priority:
      <select v-model="form.priority_level">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </label>
    <label
      >Status:
      <select v-model="form.status_name">
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
    </label>
    <label>Note: <textarea v-model="form.notes" /></label>
    <div class="actions">
      <button @click="submitForm">{{ isEdit ? 'Update' : 'Add' }}</button>
      <button @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
/* Styles remain unchanged */
</style>
