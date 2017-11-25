<template>
  <bt-page-container :pageTitle="`Editing ${bot.name}`">
    <md-layout md-column>
      <p>{{ bot.name }}</p>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'

import UserService from '@/services/UserService'

export default {
  name: 'bot-edit',
  components: {
    'bt-page-container': PageContainer
  },
  data () {
    return {
      bot: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { userId, botId } = this.$route.params

      UserService.findBot(userId, botId).then((data) => {
        this.bot = data
      })
    }
  }
}
</script>

<style>
</style>
