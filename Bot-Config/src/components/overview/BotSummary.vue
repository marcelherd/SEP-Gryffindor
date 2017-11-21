<template>
  <md-layout md-flex="100" class="bt-bot-summary">
    <md-layout md-flex="10">
      <bt-bot-icon :bot="bot" />
    </md-layout>
    <md-layout md-flex md-vertical-align="center">
      <p>{{ bot.name }}</p>
    </md-layout>
  </md-layout>
</template>

<script>
import BotIcon from '@/components/overview/summary/BotIcon'

export default {
  name: 'bt-bot-summary',
  props: ['bot'],
  components: {
    'bt-bot-icon': BotIcon
  }
}
</script>

<style>
.bt-bot-summary {
  height: 72px;
  margin-bottom: 48px;
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px 5px;
}
</style>
