<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AlertNotification from '@/components/common/AlertNotification.vue'

// Load variables
const router = useRouter()

// Pass the data here..?
const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})
const formAction = ref({ ...formActionDefault })

const visible = ref(false)
const refVform = ref()

const onSubmit = async () => {
  // Reset utils here
  formAction.value = { ...formActionDefault }
  // Turn on proccessing
  formAction.value.formProcess = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  // Add error message and status code
  if (error) {
    console.error(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Add success meassage
    formAction.value.formSuccessMessage = 'Successfully Logged Account.'
    router.replace('/system/dashboard')
  }

  refVform.value?.resetValidation()
  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />
  <v-form ref="refVform" @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <v-btn
      class="mt-2 text-white"
      type="submit"
      color="cyan-lighten-2"
      rounded="xl"
      block
      prepend-icon="mdi-login"
      >Log in</v-btn
    >
  </v-form>
</template>
