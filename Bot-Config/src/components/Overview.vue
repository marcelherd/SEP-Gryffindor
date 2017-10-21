<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Overview</h2>
    </md-toolbar>

    <div class="main-content">
      <ul v-for="(bot, index) in bots" v-bind:key="index">
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ bot.username }}</div>
              <div class="md-subhead">{{ bot.brandID }}</div>
            </md-card-header-text>

            <md-card-media>
              <img src="/static/logo_black.png" alt="Welcome Bot">
            </md-card-media>
          </md-card-header>

          <md-card-actions>
            <md-button>Start/Stop</md-button>
            <md-button>Delete</md-button>
          </md-card-actions>
        </md-card>
      </ul>
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
