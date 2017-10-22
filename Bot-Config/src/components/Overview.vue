<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Overview</h2>
    </md-toolbar>

    <div class="main-content">
      <md-card md-with-hover v-for="(bot, index) in bots" v-bind:key="index">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ bot.username }}</div>
            <div class="md-subhead">Welcome Bot</div>
          </md-card-header-text>

          <md-card-media>
            <img src="/static/logo_black.png" alt="Welcome Bot">
          </md-card-media>
        </md-card-header>

        <md-card-actions>
          <md-button>
            <md-icon class="md-primary">power_settings_new</md-icon>
            Start
          </md-button>
          <md-button>
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
  }
}
</script>

<style>

</style>
