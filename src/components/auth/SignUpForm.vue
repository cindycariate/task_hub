<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
</script>
<template>
  <v-form fast-fail @submit.prevent>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field label="First name" variant="outlined"></v-text-field
      ></v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Last name" variant="outlined"></v-text-field
      ></v-col>
    </v-row>

    <v-text-field label="Email" variant="outlined" prepend-inner-icon="mdi-email"></v-text-field>

    <v-text-field
      label="Password"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isPasswordVisible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>
    <v-text-field
      label="Confirm Password"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isPasswordVisible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>

    <v-btn
      class="mt-2 text-white"
      type="submit"
      color="cyan-lighten-3"
      rounded="xl"
      block
      prepend-icon="mdi-account-plus"
      >Sign up</v-btn
    >
  </v-form>
</template>
