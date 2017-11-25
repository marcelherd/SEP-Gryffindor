<template>
  <md-layout md-flex="100" md-gutter="24" class="bt-bot-summary">
    <md-layout md-flex="10">
      <bt-bot-icon :bot="bot" />
    </md-layout>
    <md-layout md-flex md-column>
      <md-layout md-flex md-vertical-align="start">
        <p class="bt-bot-name">{{ bot.name }}</p>
      </md-layout>
      <md-layout md-flex md-vertical-align="center">
        <p class="bt-bot-uptime">{{ statusText }}</p>
      </md-layout>
    </md-layout>
    <md-layout md-flex>
      <bt-bot-statistics :bot="bot" />
    </md-layout>
    <md-layout md-flex="10" md-vertical-align="end">
      <bt-button @click="edit(bot)">Edit</bt-button>
    </md-layout>
  </md-layout>
</template>

<script>
import BotIcon from '@/components/overview/summary/BotIcon'
import BotStatistics from '@/components/overview/summary/BotStatistics'
import Button from '@/components/core/Button'

export default {
  name: 'bt-bot-summary',
  props: ['bot'],
  components: {
    'bt-bot-icon': BotIcon,
    'bt-bot-statistics': BotStatistics,
    'bt-button': Button
  },
  computed: {
    statusText () {
      const createdDate = new Date(this.bot.createdAt)
      const created = `${createdDate.getDate()}/${createdDate.getMonth()}/${createdDate.getFullYear().toString().substr(-2)}`

      const statusChangedDate = new Date(this.bot.statusChanged)

      if (statusChangedDate.getFullYear() === 2000) {
        return `Born ${created}`
      }

      const statusChanged = `${statusChangedDate.getDate()}/${statusChangedDate.getMonth()}/${statusChangedDate.getFullYear().toString().substr(-2)}`
      const state = (this.bot.running ? 'awake' : 'asleep')

      return `Born ${created} ${state} since ${statusChanged}`
    }
  },
  methods: {
    edit (bot) {
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
.bt-bot-summary {
  height: 72px;
  margin-bottom: 48px;
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px 5px;
}

.bt-bot-name {
  font-size: 24px;
}

.bt-bot-uptime {
  font-size: 16px;
}
</style>
