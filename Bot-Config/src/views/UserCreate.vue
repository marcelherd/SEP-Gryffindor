<template>
  <bt-page-container :pageTitle="$t('userCreate.lblPageTitle')">
    <md-layout md-column>
      <div class="bt-form">
        <bt-form-section :header="$t('userCreate.lblAccountDetails')">
          <bt-input v-model="user.username" type="text" :placeholder="$t('core.username')" />
          <bt-input v-model="user.password" type="password" :placeholder="$t('core.password')" />
        </bt-form-section>

        <bt-form-section :header="$t('shared.lblBotConfiguration')">
          <bt-input v-model="user.brandId" type="text" :placeholder="$t('shared.phProductionId')" />
          <bt-input v-model="user.stagingId" type="text" :placeholder="$t('shared.phStagingId')" />
        </bt-form-section>
      </div>
      <bt-button @click="save" theme="orange">{{ $t('shared.btnSave') }}</bt-button>
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
