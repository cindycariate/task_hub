<script setup>
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getAvatarText } from '@/utils/helpers'

// Utilize pre-defined vue functions
const router = useRouter()

// Load Variables
const formAction = ref({
  ...formActionDefault,
})

// Logout functionality
const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    return
  }
  formAction.value.formProcess = false
  // Redirect to login
  router.replace('/')
}

const userData = ref({
  email: '',
  fullname: '',
  initials: '',
})

// Getting user information with proper error handling
const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()

    // Null-check and error handling
    if (error || !data?.user) {
      console.error('Error fetching user:', error || 'User is not logged in.')
      userData.value.fullname = 'Guest User'
      userData.value.email = 'No email available'
      userData.value.initials = 'G'
      return
    }

    const metadata = data.user.user_metadata

    userData.value.email = metadata?.email || 'No email'
    userData.value.fullname = (metadata?.firstname || 'No') + ' ' + (metadata?.lastname || 'Name')
    userData.value.initials = getAvatarText(userData.value.fullname)
  } catch (err) {
    console.error('Unexpected error during getUser:', err)
  }
}

// Loading Function during component rendering
onMounted(() => {
  getUser()
})
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="mt-4">
        <v-avatar color="cyan-lighten-1" size="large">
          <span class="text-h6 text-white">{{ userData.initials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="m-1">
      <v-card-text>
        <v-list>
          <v-list-item :subtitle="userData.email" :title="userData.fullname">
            <template #prepend>
              <v-avatar color="cyan-darken-2" size="large">
                <span class="text-h6">{{ userData.initials }}</span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
          >Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
