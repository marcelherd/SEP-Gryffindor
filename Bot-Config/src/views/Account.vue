<template>
  <bt-page-container pageTitle="Account details">
    <md-layout md-column>
      <bt-form-section header="Bot configuration">
        <bt-input v-model="user.brandId" type="text" placeholder="Brand ID for production" />
        <bt-input v-model="user.stagingId" type="text" placeholder="Brand ID for staging" />
      </bt-form-section>
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
  name: 'account',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      user: {
        _id: this.$store.getters.user._id,
        brandId: this.$store.getters.user.brandId || '',
        stagingId: this.$store.getters.user.stagingId || ''
      }
    }
  },
  methods: {
    save () {
      RuntimeService.updateUser(this.user).then((data) => {
        if (data.success) {
          this.$store.dispatch('updateUser', this.user._id)
            .then(() => {
              alert('User saved')
            })
        }
      })
    }
  }
}
</script>

<style>
</style>
