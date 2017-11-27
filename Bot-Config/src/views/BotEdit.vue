<template>
  <bt-page-container pageTitle="Bot Details">
    <md-layout md-flex="100">
      <h1 class="bt-header-1">{{ bot.name }}</h1>
    </md-layout>
    <bt-flash-message ref="flashMessage" />
    <md-layout md-column>
      <bt-form-section header="Bot configuration">
        <bt-input v-model="bot.name" type="text" placeholder="Name" />
        <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
      </bt-form-section>
      <bt-button @click="save" theme="orange">Save</bt-button>
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
  name: 'bot-edit',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-flash-message': FlashMessage,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      bot: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { userId, botId } = this.$route.params

      RuntimeService.findBotById(userId, botId).then((data) => {
        this.bot = data
      })
    },

    save () {
      const { userId } = this.$route.params

      RuntimeService.updateBot(userId, this.bot).then((data) => {
        if (data.success) {
          this.$refs.flashMessage.setType('info')
          this.$refs.flashMessage.pushMessage('Bot saved.')
        } else {
          this.$refs.flashMessage.setType('error')
          this.$refs.flashMessage.pushMessage(data.message)
        }
      })
    }
  }
}
</script>

<style>
</style>
