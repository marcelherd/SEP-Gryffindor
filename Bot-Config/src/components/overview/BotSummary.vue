<template>
  <md-layout md-flex="100" class="bt-bot-summary">
    <md-layout md-flex="10">
      <bt-bot-icon :bot="bot" />
    </md-layout>
    <md-layout md-flex md-column>
      <md-layout md-flex>
        <p class="bt-bot-name">{{ bot.name }}</p>
      </md-layout>
      <md-layout md-flex>
        <p class="bt-bot-uptime">Born 09/09/09 awake since 00:00 09/09/09</p>
      </md-layout>
    </md-layout>
    <md-layout md-flex>
      <bt-bot-statistics :bot="bot" />
    </md-layout>
    <md-layout md-flex="10" md-align="end" md-vertical-align="end">
      <span style="padding: 10px;">EDIT</span>
    </md-layout>
  </md-layout>
</template>

<script>
import BotIcon from '@/components/overview/summary/BotIcon'
import BotStatistics from '@/components/overview/summary/BotStatistics'

export default {
  name: 'bt-bot-summary',
  props: ['bot'],
  components: {
    'bt-bot-icon': BotIcon,
    'bt-bot-statistics': BotStatistics
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
