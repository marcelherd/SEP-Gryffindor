<template>
  <bt-page-container :pageTitle="$t('marketplace.lblPageTitle')">
    <md-layout md-flex="100" md-gutter="40">
      <md-layout md-flex="50" v-for="(template, index) in templates" :key="index">
        <div class="bt-tile" @click="navigate(template)">
          <md-layout md-flex="100" class="bt-tile-header">
            <h1 class="bt-tile-title">{{ template.name }}</h1>
          </md-layout>

          <md-layout md-flex="100" class="bt-tile-message-container">
            <md-layout md-flex="15" class="bt-icon-container">
              <img src="/static/robot-icon.png" />
            </md-layout>
            <md-layout md-flex class="bt-tile-message">
              <span>{{ getMessage(template) }}</span>
            </md-layout>
          </md-layout>

          <md-layout md-flex="100">
            <p>{{ getDescription(template) }}</p>
          </md-layout>
        </div>
      </md-layout>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'

import MarketplaceService from '@/services/MarketplaceService'

export default {
  name: 'marketplace',
  components: {
    'bt-page-container': PageContainer
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
      this.$router.push({
        name: 'BotCreate',
        params: {
          template: template.name
        }
      })
    },

    getMessage (template) {
      const locale = localStorage.getItem('locale') || 'en'
      return template[locale].message
    },

    getDescription (template) {
      const locale = localStorage.getItem('locale') || 'en'
      return template[locale].description
    }

  }
}
</script>

<style>
.bt-tile {
  padding: 16px 32px 16px 32px;
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px;
  margin-bottom: 48px;
  width: 100%;
}

.bt-tile:hover {
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.22) 2px 4px 55px 5px;
}

.bt-tile-title {
  font-size: 48px;
  font-weight: 500;
  color: #FAD232;
}

.bt-tile img {
  min-width: 74px;
  width: 74px;
  min-height: 74px;
  height: 74px;
}

.bt-tile-message-container {
  margin-bottom: 8px;
}

.bt-tile-message {
  display: inline-flex;
  align-items: center;
  margin-left: 16px;
  margin-right: 32px;
}

.bt-tile-message span {
  font-weight: 700;
  border: 1px solid #F3F3F4;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: #F3F3F4;
  padding: 16px;
}
</style>
