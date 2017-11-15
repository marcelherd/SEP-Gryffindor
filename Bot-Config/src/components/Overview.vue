<template>
  <page-content page-title="Overview">
    <md-layout md-gutter="24" v-if="bots">
      <md-layout md-flex-xsmall="100" md-flex-small="100" md-flex-medium="50" md-flex="25" v-for="(bot, index) in bots" :key="bot.id">

        <md-card :class="bot.status === 'RUNNING' ? 'md-primary' : 'md-accent'">
          <md-card-media>
            <img src="/static/robot.jpeg" alt="Robot">
          </md-card-media>

          <md-card-header>
            <div class="md-title">{{ bot.name }}</div>
            <div class="md-subhead">{{ bot.template }} <span style="float:right">{{ formatStatus(bot.status) }}</span></div>
          </md-card-header>


          <md-card-actions>
            <md-button @click="toggle(bot)" class="md-icon-button">
              <md-icon v-if="bot.status === 'RUNNING'">pause</md-icon>
              <md-icon v-else>play_arrow</md-icon>
            </md-button>

            <router-link tag="md-button" class="md-icon-button"
              :to="{ name: 'Edit', params: { id: bot.id }}">
              <md-icon>edit</md-icon>
            </router-link>

            <md-button @click="remove(bot)" class="md-icon-button">
              <md-icon>delete</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>

      </md-layout>
    </md-layout>

    <div v-else>
      <p>Looks like you have not created any bots yet.</p>
      <router-link tag="md-button" to="/templateSelection" exact class="md-primary">
        &raquo; Get started now
      </router-link>
    </div>

    <router-link tag="md-button" to="/templateSelection" exact class="md-fab md-fab-bottom-right">
      <md-icon>add</md-icon>
    </router-link>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

/**
 * This component displays all existing bots.
 *
 * @module components/Overview
 */
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
  created () {
    // Fetches the bot data whenever this component is instantiated
    this.fetchData()
  },
  methods: {

    // TODO: move this to its own class
    /**
     * @typedef {Object} Bot
     * @property {number} id The id of the bot
     * @property {string} name The name of the bot
     * @property {string} template The template of the bot
     * @property {string} status The status of the bot
     */

    /**
     * Fetches the bot data from the bot runtime.
     */
    fetchData () {
      fetch('http://localhost:3000/api/v1/manage/bot/', {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      })
      .then(response => response.json())
      .then(data => {
        this.bots = data
      })
    },

    /**
     * Returns a human readable string representation of the given bot status.
     *
     * @param {string} status - The bot status
     * @return {string} A human readable string representation of the given bot status
     */
    formatStatus (status) {
      return (status === 'NOT_RUNNING' ? 'Not running' : 'Running')
    },

    /**
     * Starts/stops the given bot.
     *
     * @param {Bot} bot - the bot that should be started/stopped
     */
    toggle (bot) {
      let action = (bot.status === 'RUNNING' ? 'stop' : 'start')
      let url = `http://localhost:3000/api/v1/manage/bot/${bot.id}/${action}`

      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') })
      let request = new Request(url, {
        method: 'POST',
        mode: 'CORS',
        headers: headers
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.fetchData()
        } else {
          throw new Error(`Could not change bot status with id: ${bot.id} (${response.status} ${response.statusText})`)
        }
      })
      .catch(error => console.log(error.message))
    },

    /**
     * Removes the given bot.
     *
     * @param {Bot} bot - The bot that is to be deleted
     */
    remove (bot) {
      let url = `http://localhost:3000/api/v1/manage/bot/${bot.id}`

      let headers = new Headers({ 'x-access-token': localStorage.getItem('token') })
      let request = new Request(url, {
        method: 'DELETE',
        mode: 'CORS',
        headers: headers
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.fetchData()
        } else {
          throw new Error(`Could not delete bot with id: ${bot.id} (${response.status} ${response.statusText})`)
        }
      })
      .catch(error => console.log(error.message))
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

.md-layout .md-card {
  margin-bottom: 24px;
}
</style>
