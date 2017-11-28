<template>
  <bt-page-container pageTitle="New user">
    <md-layout md-column>
      <div class="bt-form">
        <bt-form-section header="Account Details">
          <bt-input v-model="user.username" type="text" placeholder="Username" />
          <bt-input v-model="user.password" type="password" placeholder="Password" />
        </bt-form-section>

        <bt-form-section header="Bot configuration">
          <bt-input v-model="user.brandId" type="text" placeholder="Brand ID for production" />
          <bt-input v-model="user.stagingId" type="text" placeholder="Brand ID for staging" />
        </bt-form-section>
      </div>
      <bt-button @click="save" theme="orange">Save</bt-button>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'user-create',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      user: {
        username: '',
        password: '',
        brandId: '',
        stagingId: '',
        admin: false
      }
    }
  },
  methods: {
    save () {
      RuntimeService.saveUser(this.user).then((response) => {
        if (response.ok) {
          this.$router.push({ name: 'Administration' })
        }
      })
    }
  }
}
</script>

<style>
</style>
