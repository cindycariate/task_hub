<script setup>
import { ref } from 'vue'
import { signInWithGoogle } from '@/stores/authUser.js'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  redirectTo: { type: String, default: window.location.origin + '/pages/home' },
})

const processing = ref(false)

const handleGoogle = async () => {
  if (props.disabled || processing.value) return
  processing.value = true
  try {
    await signInWithGoogle({ redirectTo: props.redirectTo })
  } catch (err) {
    // Let the page handle errors via auth flow or console
    console.error('SocialSignIn error:', err)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <v-btn
    class="mt-4"
    color="red lighten-1"
    rounded="xl"
    block
    @click="handleGoogle"
    :disabled="disabled"
    :loading="processing"
  >
    <v-icon left>mdi-google</v-icon>
    Sign in with Google
  </v-btn>
</template>
