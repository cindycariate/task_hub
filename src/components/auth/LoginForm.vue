<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator } from '@/utils/validators'

const visible = ref(false)
const refVform = ref()

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid: isValid }) => {
    // if (isValid) onSubmit()
  })
}
</script>
<template>
  <v-form ref="refVform" fast-fail @submit.prevent="onFormSubmit">
    <v-text-field
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator]"
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
