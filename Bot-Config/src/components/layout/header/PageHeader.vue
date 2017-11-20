<template>
  <md-layout md-flex="100" md-vertical-align="center" class="bt-page-header">
    <md-layout md-flex="25">
      <div @click="home" class="bt-page-header-icon">
        <img src="/static/favicon.png" />
      </div>
    </md-layout>
    <md-layout md-flex="50" >
      {{ pageTitle }}
    </md-layout>
    <bt-user-menu />
  </md-layout>
</template>

<script>
import UserMenu from '@/components/layout/header/menu/UserMenu'

export default {
  name: 'bt-page-header',
  props: ['pageTitle'],
  components: {
    'bt-user-menu': UserMenu
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    home () {
      this.$router.push({
        name: 'Overview',
        params: { userId: this.$store.getters.user._id }
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
