<template>
  <bt-page-container pageTitle="Bot details">
    <md-layout md-flex="100">

      <md-layout md-flex="100">
        <h1 class="bt-header-1">Create the {{ bot.template }}</h1>
      </md-layout>

      <md-layout md-flex>
        <md-layout md-flex="80" md-column>
          <bt-form-section header="Bot Configuration">
            <bt-input v-model="bot.name" type="text" placeholder="Name" />
            <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
          </bt-form-section>
          <bt-button @click="save" theme="orange">Save</bt-button>
        </md-layout>
      </md-layout>

      <md-layout md-flex="30">
        <bt-form-section header="Profile Picture">
          <img src="/static/robot-icon.png" class="bt-profile-picture" />
          <img src="/static/robot-icon.png" class="bt-profile-picture-small" />
        </bt-form-section>
      </md-layout>

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
  name: 'bot-create',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      bot: {
        name: '',
        greeting: '',
        template: this.$route.params.template
      }
    }
  },
  methods: {
    save () {
      const userId = this.$store.getters.user._id

      RuntimeService.saveBot(userId, this.bot)
        .then((data) => {
          this.$router.push({
            name: 'BotEdit',
            params: {
              userId,
              botId: data.message._id
            }
          })
        })
    }
  }
}
</script>

<style>

</style>
