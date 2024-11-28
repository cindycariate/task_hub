<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>
<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="Email" variant="outlined" prepend-inner-icon="mdi-email"></v-text-field>

    <v-text-field
      variant="outlined"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      :type="visible ? 'text' : 'password'"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="visible = !visible"
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
