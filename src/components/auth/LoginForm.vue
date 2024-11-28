<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators'

const visible = ref(false)
const refVform = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  // alert(formData.value.email)
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}
</script>
<template>
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
