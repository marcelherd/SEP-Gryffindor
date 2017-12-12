<template>
  <bt-page-container :pageTitle="$t('account.lblPageTitle')">
    <bt-flash-message ref="flashMessage" />
    <md-layout md-column>
      <bt-form-section :header="$t('shared.lblBotConfiguration')">
        <bt-input v-model="user.brandId" type="text" :placeholder="$t('shared.phProductionId')" />
        <bt-input v-model="user.stagingId" type="text" :placeholder="$t('shared.phStagingId')" />
      </bt-form-section>
      <bt-button @click="save" theme="orange">{{ $t('shared.btnSave') }}</bt-button>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import FlashMessage from '@/components/core/FlashMessage'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'account',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-flash-message': FlashMessage,
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
              console.log(this.$refs)
              this.$refs.flashMessage.pushMessage('Account saved.')
            })
        }
      })
    }
  }
}
</script>

<style>
</style>
