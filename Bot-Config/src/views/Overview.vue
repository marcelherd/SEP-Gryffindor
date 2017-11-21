<template>
  <bt-page-container pageTitle="Overview">
    <bt-bot-summary :bot="bot" v-for="(bot, index) in bots" :key="bot._id" />

    <bt-fab to="/Administration/new">
      <md-icon>add</md-icon>
    </bt-fab>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import BotSummary from '@/components/overview/BotSummary'
import FloatingActionButton from '@/components/core/FloatingActionButton'

import UserService from '@/services/UserService'

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer,
    'bt-bot-summary': BotSummary,
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
      const id = this.$route.params.userId
      UserService.findBots(id).then((data) => {
        this.bots = data
      })
    }
  }
}
</script>

<style>

</style>
