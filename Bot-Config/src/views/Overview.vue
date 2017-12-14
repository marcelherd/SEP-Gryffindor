<template>
  <bt-page-container :pageTitle="pageTitle">
    <md-layout md-flex="100" v-if="bots.length < 1" class="bt-no-bots">
      <md-layout md-flex="100" md-align="center" >
        <img src="/static/botter.png" class="bt-icon-botter" />
      </md-layout>
      <md-layout md-flex="100" md-align="center" >
        <p>{{ $t('overview.lblNoBots') }}</p>
      </md-layout>
      <md-layout md-flex="100" md-align="center" >
        <router-link tag="md-button" :to="createBotUrl()">
          &raquo; {{ $t('overview.btnGetStarted') }}
        </router-link>
      </md-layout>
    </md-layout>
    <md-layout md-flex="100" md-gutter="40">
      <md-layout md-flex="50" v-for="(bot, index) in bots" :key="bot._id">
        <div class="bt-card">
          <div class="bt-card-header" :class="bot.running ? '' : 'bt-bot-offline'">
            <md-layout md-flex="100">
              <md-layout md-flex class="bt-card-header-title">
                {{ bot.name }}
              </md-layout>
              <md-layout md-flex="20" md-align="end" class="bt-card-header-actions">
              </md-layout>
            </md-layout>
            <md-layout md-flex="100" class="bt-card-header-subtitle">
              <md-layout md-flex>
                <span>{{ statusText(bot) }}</span>
              </md-layout>
              <md-layout md-flex="20" md-align="end">
                <bt-switch :initial="bot.running" @click="toggleBot(bot)" />
              </md-layout>
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
                      {{ $t('overview.lblIntroduction', { name: bot.name, template: bot.template }) }}
                    </p>
                    <p class="bt-card-utterance">
                      {{ $t('overview.lblConversations', { conversations: bot.conversations }) }}
                    </p>
                    <p class="bt-card-utterance">
                      {{ $t('overview.lblForwards', { forwards: bot.forwards }) }}
                    </p>
                  </div>
                </md-layout>
              </md-layout>
            </md-layout>
          </div>
          <div class="bt-card-header" :class="bot.running ? '' : 'bt-bot-offline'">
            <md-layout md-flex="20" md-align="end" class="bt-card-header-actions">
              <button @click="editBot(bot)">{{ $t('shared.btnEdit') }}</button>
            </md-layout>
          </div>
        </div>
      </md-layout>
    </md-layout>
    <bt-fab :to="createBotUrl()">
      <md-icon>add</md-icon>
    </bt-fab>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FloatingActionButton from '@/components/core/FloatingActionButton'
import Switch from '@/components/core/Switch'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer,
    'bt-fab': FloatingActionButton,
    'bt-switch': Switch
  },
  data () {
    return {
      bots: [],
      user: {}
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    pageTitle () {
      const currentUser = this.user._id
      const workingUser = this.$store.getters.user._id

      if (currentUser === workingUser) {
        return this.$t('overview.lblPageTitle')
      } else {
        return this.$t('overview.lblPageTitleUser', { user: this.user.username })
      }
    }
  },
  methods: {
    fetchData () {
      const userId = this.$route.params.userId

      RuntimeService.findBotsByUser(userId).then((data) => {
        this.bots = data
      })

      if (userId === this.$store.getters.user._id) {
        this.user = this.$store.getters.user
      } else {
        RuntimeService.findUserById(userId).then((data) => {
          this.user = data
        })
      }
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
    toggleBot (bot) {
      RuntimeService.toggleBot(this.$route.params.userId, bot).then((data) => {
        if (data.success) {
          this.fetchData()
        }
      })
    },
    createBotUrl () {
      return {
        name: 'Marketplace',
        params: {
          userId: this.$route.params.userId
        }
      }
    },
    createdText (bot) {
      const createdDate = new Date(bot.createdAt)

      const day = createdDate.getDate()
      const month = createdDate.getMonth() + 1
      const year = createdDate.getFullYear().toString().substr(-2)
      const hours = ('0' + createdDate.getHours()).slice(-2)
      const minutes = ('0' + createdDate.getMinutes()).slice(-2)

      return `${this.$t('overview.lblBorn')} ${day}/${month}/${year} ${hours}:${minutes}`
    },
    statusText (bot) {
      const date = new Date(bot.statusChanged)

      if (date.getFullYear() === 2000) {
        return this.$t('overview.lblNeverRan')
      }

      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear().toString().substr(-2)

      const state = bot.running ? this.$t('overview.lblAwake') : this.$t('overview.lblAsleep')

      const now = new Date()
      if (now.getDate() === day) {
        const hours = ('0' + date.getHours()).slice(-2)
        const minutes = ('0' + date.getMinutes()).slice(-2)
        return `${state} ${hours}:${minutes}`
      }

      return `${state} ${day}/${month}/${year}`
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

.bt-icon-botter {
  max-height: 30vh;
}

.bt-no-bots {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
