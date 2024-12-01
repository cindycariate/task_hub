<script setup>
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getAvatarText } from '@/utils/helpers'

const router = useRouter()

// Action state
const formAction = ref({
  ...formActionDefault,
})

// User data state
const userData = ref({
  email: '',
  fullname: '',
  initials: '',
})

// Logout functionality
const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    formAction.value.formProcess = false
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}

// Fetch user information
const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error)
    return
  }

  const metadata = data?.user?.user_metadata || {}
  userData.value.email = metadata.email || 'N/A'
  userData.value.fullname = `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()
  userData.value.initials = getAvatarText(userData.value.fullname || 'Unknown User')
}

// Fetch user on mount
onMounted(() => {
  getUser()
})
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="green-lighten-1" size="large">
          <span class="text-h5">{{ userData.initials || 'U' }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="m-1">
      <v-card-text>
        <v-list>
          <v-list-item
            :subtitle="userData.email || 'No email'"
            :title="userData.fullname || 'Guest'"
          >
            <template #prepend>
              <v-avatar color="green-lighten-1" size="large">
                <span class="text-h5">{{ userData.initials || 'U' }}</span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-3"></v-divider>

        <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
          Account Settings
        </v-btn>

        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
