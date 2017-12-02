<template>
  <bt-page-container :pageTitle="pageTitle">
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
        return 'Overview'
      } else {
        return `Overview for user ${this.user.username}`
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
