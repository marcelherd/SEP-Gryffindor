<template>
  <div>

    <md-toolbar>
      <h2 class="md-title">Choose template</h2>
    </md-toolbar>

    <div class="main-content">
      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Welcome Bot</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-actions>
          <md-button v-on:click="navigate('welcome-bot')">
            <md-icon>add</md-icon>
            Create
          </md-button>
        </md-card-actions>
      </md-card>

      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Consumer FAQ Bot</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-actions>
          <md-button v-on:click="navigate('faq-bot')">
            <md-icon>add</md-icon>
            Create
          </md-button>
        </md-card-actions>
      </md-card>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Create',
  methods: {
    navigate: function (route) {
      this.$router.push(`/create/${route}`)
    }
  }
}
</script>

<style>

</style>
