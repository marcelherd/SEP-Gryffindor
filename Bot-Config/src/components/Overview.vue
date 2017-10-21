<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Overview</h2>
    </md-toolbar>

    <div class="main-content">
      <ul v-for="(bot, index) in bots" v-bind:key="index">
        <li>{{ bot.ownerID }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Overview',
  computed: {
    ...mapGetters(['bots'])
  }
}
</script>

<style>

</style>
