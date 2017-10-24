<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Overview</h2>
    </md-toolbar>

    <div class="main-content">
      <md-card md-with-hover v-for="(bot, index) in bots" v-bind:key="index">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ bot.type }}</div>
            <div class="md-subhead">{{ bot.username }} <{{ bot.brandID }}></div>
          </md-card-header-text>

          <md-card-media>
            <img src="/static/logo_black.png" alt="Welcome Bot">
          </md-card-media>
        </md-card-header>

        <md-card-content>
          <p v-if="bot.state === 'running'" style="color: green">{{ bot.state }}</p>
          <p v-else style="color: red">{{ bot.state }}</p>
        </md-card-content>

        <md-card-actions>
          <md-button v-on:click="toggleState(index)">
            <md-icon class="md-primary">power_settings_new</md-icon>
            <span v-if="bot.state === 'running'">Stop</span>
            <span v-else>Start</span>
          </md-button>
          <md-button v-on:click="deleteBot(index)">
            <md-icon class="md-accent">delete</md-icon>
            Delete
          </md-button>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Overview',
  computed: {
    ...mapGetters(['bots'])
  },
  methods: {
    deleteBot: function (index) {
      this.$store.dispatch('removeBot', index)
    },
    toggleState: function (index) {
      this.$store.dispatch('toggleBotState', index)
    }
  }
}
</script>

<style>

</style>
