<template>
  <md-layout v-if="user" md-flex md-align="end" class="bt-user-menu">
    <md-menu md-align-trigger md-direction="bottom" md-offset-x="-50">
      <md-button md-menu-trigger>{{ user.username }} &#9660;</md-button>

      <md-menu-content>
        <md-menu-item @click="navigate('Account')">
          {{ $t('menu.btnAccount') }}
        </md-menu-item>
        <md-menu-item @click="navigate('Administration')" v-if="user.admin">
          {{ $t('menu.btnAdmin') }}
        </md-menu-item>
        <md-menu-item @click="logout">
          {{ $t('menu.btnLogout') }}
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </md-layout>
</template>

<script>
/**
 * User menu component.
 * Displays Administration link only if the logged-in user is an admin.
 *
 * @author Marcel Herd
 * @module components/layout/header/UserMenu
 */
export default {
  name: 'bt-user-menu',
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    /**
     * Logs the user out and redirects to the login page.
     *
     * @method logout
     */
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'Login' })
      })
    },

    /**
     * Navigates to the given route.
     *
     * @method navigate
     * @param {string} name - the name of the route to navigate to
     */
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
