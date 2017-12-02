<template>
  <bt-page-container pageTitle="Overview">
    <md-layout md-flex="100" md-gutter="40">
      <md-layout md-flex="50" v-for="(bot, index) in bots" :key="bot._id">
        <div class="bt-card">
          <div class="bt-card-header">
            <md-layout md-flex="100">
              <md-layout md-flex class="bt-card-header-title">
                {{ bot.name }}
              </md-layout>
              <md-layout md-flex="20" md-align="end" class="bt-card-header-actions">
                <button @click="editBot(bot)">Edit</button>
              </md-layout>
            </md-layout>
            <md-layout md-flex="100" class="bt-card-header-subtitle">
              awake since 09/09/09
            </md-layout>
          </div>
          <div class="bt-card-body">
            <md-layout>
              <md-layout md-flex="100" md-align="center" class="bt-bot-created">
                <p>Born&nbsp;&nbsp;09/09/09&nbsp;&nbsp;12:13</p>
              </md-layout>
              <md-layout md-flex="100">
                <md-layout md-flex="20">
                  <img src="/static/robot-icon.png" class="bt-profile-picture" />
                </md-layout>
                <md-layout md-flex md-flex-offset="5">
                  <div class="bt-card-utterances">
                    <p class="bt-card-utterance">
                      Hi! I'm {{ bot.name }} the {{ bot.template }}!
                    </p>
                    <p class="bt-card-utterance">
                      I had 265 conversations today
                    </p>
                    <p class="bt-card-utterance">
                      And forwarded 3948 times
                    </p>
                  </div>
                </md-layout>
              </md-layout>
            </md-layout>
          </div>
        </div>
      </md-layout>
    </md-layout>
    <bt-fab to="/Create">
      <md-icon>add</md-icon>
    </bt-fab>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FloatingActionButton from '@/components/core/FloatingActionButton'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer,
    'bt-fab': FloatingActionButton
  },
  data () {
    return {
      bots: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const userId = this.$route.params.userId
      RuntimeService.findBotsByUser(userId).then((data) => {
        this.bots = data
      })
    },
    editBot (bot) {
      this.$router.push({
        name: 'BotEdit',
        params: {
          userId: this.$route.params.userId,
          botId: bot._id
        }
      })
    }
  }
}
</script>

<style>
.bt-bot-created {
  letter-spacing: 1px;
  color: #999;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
}
</style>
