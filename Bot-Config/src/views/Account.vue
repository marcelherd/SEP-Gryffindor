<template>
  <bt-page-container pageTitle="Account details">
    <md-layout md-column>
      <div class="bt-form">
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

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      user: {
        brandId: '',
        stagingId: ''
      }
    }
  },
  methods: {
    save () {
      alert('TODO')
    }
  }
}
</script>

<style>
</style>
