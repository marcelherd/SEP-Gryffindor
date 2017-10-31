<template>
  <page-content page-title="Overview">

    <div class="alert alert-success" v-if="message">
      {{ message }}
    </div>

    <md-table v-if="bots">
      <md-table-header>
        <md-table-row>
          <md-table-head>Name</md-table-head>
          <md-table-head>Template</md-table-head>
          <md-table-head>Status</md-table-head>
          <md-table-head></md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(bot, index) in bots" :key="bot.id">
          <md-table-cell>{{ bot.name }}</md-table-cell>
          <md-table-cell>{{ bot.template }}</md-table-cell>
          <md-table-cell :class="bot.status === 'NOT_RUNNING' ? 'danger' : 'success'">
            {{ formatStatus(bot.status) }}
          </md-table-cell>
          <md-table-cell>
            <router-link tag="md-button" class="md-icon-button"
              :to="{ name: 'Edit', params: { id: bot.id }}">
              <md-icon>edit</md-icon>
            </router-link>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <div v-else>
      <p>Looks like you have not created any bots yet.</p>
      <router-link tag="md-button" to="/create" exact class="md-primary">
        &raquo; Get started now
      </router-link>
    </div>

    <router-link tag="md-button" to="/create" exact class="md-fab md-fab-bottom-right">
      <md-icon>add</md-icon>
    </router-link>

    <md-button class="md-fab md-fab-bottom-left">
      <md-icon>code</md-icon>
    </md-button>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

export default {
  name: 'Overview',
  components: {
    'page-content': PageContent
  },
  data () {
    return {
      bots: null
    }
  },
  props: ['message'],
  created () {
    this.fetchData()
  },
  mounted () {
    setTimeout(() => {
      this.message = ''
    }, 4000)
  },
  methods: {
    fetchData () {
      fetch('http://localhost:3000/api/v1/manage/bot/')
      .then(response => response.json())
      .then(data => {
        this.bots = data
      })
    },
    formatStatus (status) {
      return (status === 'NOT_RUNNING' ? 'Not running' : 'Running')
    }
  }
}
</script>

<style scoped>
.danger {
  color: red;
}

.success {
  color: green;
}

.alert {
  position: relative;
  padding: .75rem 1.24rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}
</style>
