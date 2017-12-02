<template>
  <bt-page-container pageTitle="Overview">
    <md-layout md-flex="100" md-gutter="40">
      <md-layout md-flex="50" v-for="(bot, index) in bots" :key="bot._id">
        <div class="bt-card">
          <div class="bt-card-header" :class="bot.running ? '' : 'bt-bot-offline'">
            <md-layout md-flex="100">
              <md-layout md-flex class="bt-card-header-title">
                {{ bot.name }}
              </md-layout>
              <md-layout md-flex="20" md-align="end" class="bt-card-header-actions">
                <button @click="editBot(bot)">Edit</button>
              </md-layout>
            </md-layout>
            <md-layout md-flex="100" class="bt-card-header-subtitle">
              <span>{{ statusText(bot) }}</span>
            </md-layout>
          </div>
          <div class="bt-card-body">
            <md-layout>
              <md-layout md-flex="100" md-align="center" class="bt-bot-created">
                <p>{{ createdText(bot) }}</p>
              </md-layout>
              <md-layout md-flex="100">
                <md-layout md-flex="20">
                  <img src="/static/robot-icon.png" class="bt-profile-picture bt-bot-picture" />
                </md-layout>
                <md-layout md-flex md-flex-offset="5">
                  <div class="bt-card-utterances bt-bot-statistics">
                    <p class="bt-card-utterance">
                      Hi! I'm {{ bot.name }} the {{ bot.template }}!
                    </p>
                    <p class="bt-card-utterance">
                      I had 0 conversations so far
                    </p>
                    <p class="bt-card-utterance">
                      And forwarded 0 times
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
    },
    createdText (bot) {
      const createdDate = new Date(bot.createdAt)

      const day = createdDate.getDate()
      const month = createdDate.getMonth()
      const year = createdDate.getFullYear().toString().substr(-2)
      const hours = createdDate.getHours()
      const minutes = createdDate.getMinutes()

      return `Born ${day}/${month}/${year} ${hours}:${minutes}`
    },
    statusText (bot) {
      const date = new Date(bot.statusChanged)

      if (date.getFullYear() === 2000) {
        return `Bot has never run`
      }

      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear().toString().substr(-2)

      const state = bot.running ? 'awake' : 'asleep'

      return `${state} since ${day}/${month}/${year}`
    }
  }
}
</script>

<style>
.bt-bot-picture {
  align-self: flex-start;
}

.bt-bot-created {
  letter-spacing: 1px;
  color: #999;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
}

.bt-bot-created p {
  margin: 6px;
}

.bt-bot-offline {
  background-color: #D2D2D2;
}

.bt-bot-statistics {
  margin-bottom: 20px;
}

.bt-bot-statistics .bt-card-utterance {
  margin-bottom: 0;
  display: inline-flex;
}
</style>
