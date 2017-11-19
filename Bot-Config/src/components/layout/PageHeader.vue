<template>
  <md-layout md-flex="100" md-vertical-align="center" class="bt-page-header">
    <md-layout md-flex="25">
      <div class="bt-page-header-icon">
        <img src="/static/favicon.png" />
      </div>
    </md-layout>
    <md-layout md-flex="50" >
      {{ pageTitle }}
    </md-layout>
    <md-layout v-if="user" md-flex="20">
      {{ user.username }}
      <button @click="logout">Logout</button>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-page-header',
  props: ['pageTitle'],
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>

<style scoped>
.bt-page-header {
  height: 50px;
  background-color: #FAD232;
  font-size: 16px;
  font-weight: 700;
}

.bt-page-header-icon {
  width: 24px;
  margin-left: 16px;
}

.bt-page-header-icon img:hover {
  cursor: pointer;
  opacity: .75;
}
</style>
