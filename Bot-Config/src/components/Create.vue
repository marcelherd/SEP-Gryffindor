<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Create Welcome Bot</h2>
    </md-toolbar>

    <div class="main-content">

      <md-stepper md-alternate-labels @completed="save">

        <md-step md-label="Bot configuration">
          <md-input-container>
            <label>Brand ID</label>
            <md-input type="number" placeholder="Brand ID" v-model="brandID" required></md-input>
          </md-input-container>

          <md-input-container>
            <label>Username</label>
            <md-input placeholder="Username" v-model="username" required></md-input>
          </md-input-container>

          <md-input-container md-has-password>
            <label>Password</label>
            <md-input type="password" placeholder="Password" v-model="password" required></md-input>
          </md-input-container>
        </md-step>

        <md-step md-label="Template configuration" md-button-continue="Save">
          <p>Todo: edit template here</p>
        </md-step>

      </md-stepper>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Create',
  data: () => {
    return {
      brandID: '',
      username: '',
      password: '',
      template: { }
    }
  },
  methods: {
    save: function () {
      this.$store.dispatch('addBot', { brandID: this.brandID, username: this.username, password: this.password })
      this.$router.push('overview')
    }
  }
}
</script>

<style>

</style>
