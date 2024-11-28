<script setup>
import { ref } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const refVform = ref()
const visible = ref(false)
const conPassVisible = ref(false)

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
      },
    },
  })
  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Sucessfully Registered Acount.'
    //Will add more actions later... maybe... possibly..?
    refVform.value?.reset()
  }
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    console.log('Validation result:', valid)
    if (valid) onSubmit()
  })
}
</script>
<template>
  <v-alert
    v-if="formAction.formSuccessMessage"
    :text="formAction.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  >
  </v-alert>
  <v-alert
    v-if="formAction.formErrorMessage"
    :text="formAction.formErrorMessage"
    title="Ooops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>
  <v-form ref="refVform" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.firstname"
          label="First name"
          variant="outlined"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.lastname"
          label="Last name"
          variant="outlined"
          :rules="[requiredValidator]"
        ></v-text-field
      ></v-col>
    </v-row>

    <v-text-field
      v-model="formData.email"
      label="Email"
      variant="outlined"
      prepend-inner-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      label="Password"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>
    <v-text-field
      v-model="formData.password_confirmation"
      label="Confirm Password"
      :append-inner-icon="conPassVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="conPassVisible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="conPassVisible = !conPassVisible"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
    ></v-text-field>

    <v-btn
      class="mt-2 text-white"
      type="submit"
      color="cyan-lighten-3"
      rounded="xl"
      block
      prepend-icon="mdi-account-plus"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      >Sign up</v-btn
    >
  </v-form>
</template>
