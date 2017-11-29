<template>
  <md-layout v-if="user" md-flex md-align="end" class="bt-user-menu">
    <md-menu md-align-trigger md-direction="bottom" md-auto-width>
      <md-button md-menu-trigger>{{ user.username }} &#9660;</md-button>

      <md-menu-content>
        <md-menu-item @click="navigate('Account')">Account</md-menu-item>
        <md-menu-item @click="navigate('Administration')" v-if="user.admin">Admin</md-menu-item>
        <md-menu-item @click="logout">Log out</md-menu-item>
      </md-menu-content>
    </md-menu>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-user-menu',
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
    },
    navigate (name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style>
.bt-user-menu .md-button {
  font-weight: 700;
  text-transform: none;
}
</style>
