<template>
  <bt-page-container pageTitle="New user">
    <md-layout md-column>
      <div class="bt-form">
        <div class="bt-form-section">
          <div class="bt-form-section-header">Account details</div>
          <input v-model="user.username" type="text" placeholder="Username" class="bt-input">
          <input v-model="user.password" type="password" placeholder="Password" class="bt-input">
        </div>

        <div class="bt-form-section">
          <div class="bt-form-section-header">Bot configuration</div>
          <input type="text" placeholder="Brand ID for production" class="bt-input">
          <input type="text" placeholder="Brand ID for staging" class="bt-input">
        </div>
      </div>
      <bt-button @click="save" theme="orange">Save</bt-button>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import Button from '@/components/core/Button'

import UserService from '@/services/UserService'

export default {
  name: 'user-create',
  components: {
    'bt-page-container': PageContainer,
    'bt-button': Button
  },
  data () {
    return {
      user: {
        username: '',
        password: '',
        admin: false
      }
    }
  },
  methods: {
    save () {
      UserService.save(this.user).then((response) => {
        if (response.ok) {
          this.$router.push({ name: 'Administration' })
        }
      })
    }
  }
}
</script>

<style>
.bt-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border: 1px solid #c2c2c2;
  border-radius: 8px;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.bt-input:focus {
  outline: 0;
}

.bt-form-section:not(:last-child) {
  margin-bottom: 20px;
}

.bt-form-section-header {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 5px;
}
</style>
