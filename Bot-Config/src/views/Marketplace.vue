<template>
  <bt-page-container :pageTitle="$t('marketplace.lblPageTitle')">
    <md-layout md-flex>
      <bt-tile @click="navigate(template)"
        v-for="(template, index) in templates" flex="40"
        :template="template" :key="index" />
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import Tile from '@/components/core/Tile'

import MarketplaceService from '@/services/MarketplaceService'

export default {
  name: 'marketplace',
  components: {
    'bt-page-container': PageContainer,
    'bt-tile': Tile
  },
  data () {
    return {
      templates: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      MarketplaceService.getTemplates().then((data) => {
        this.templates = data
      })
    },

    navigate (template) {
      console.log('navigate')
      this.$router.push({
        name: 'BotCreate',
        params: {
          template: template.name
        }
      })
    }
  }
}
</script>

<style>
</style>
