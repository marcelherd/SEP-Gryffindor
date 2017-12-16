<template>
  <bt-page-container :pageTitle="$t('botCreate.lblPageTitle')">
    <md-layout md-flex="100">

      <md-layout md-flex="100">
        <h1 class="bt-header-1">{{ $t('botCreate.lblHeader', { template: bot.template }) }}</h1>
      </md-layout>

      <md-layout md-flex>
        <md-layout md-flex="80" md-column>
          <form @submit.prevent="save">
            <bt-form-section :header="$t('shared.lblBotConfiguration')">
              <bt-input v-model="bot.name" type="text" :placeholder="$t('shared.phName')" required="true" />
              <bt-input v-model="bot.greeting" type="text" :placeholder="$t('shared.phGreeting')" required="true" />
            </bt-form-section>
            <bt-button type="submit" theme="orange">{{ $t('shared.btnSave') }}</bt-button>
          </form>
        </md-layout>
      </md-layout>

      <md-layout md-flex="30">
        <bt-form-section :header="$t('botCreate.lblProfilePicture')">
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
      const userId = this.$route.params.userId

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
