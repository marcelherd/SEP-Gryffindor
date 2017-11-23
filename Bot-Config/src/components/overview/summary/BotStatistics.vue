<template>
  <md-layout md-align="center" md-vertical-align="center">
    <bt-badge text="1" type="success" />
    <bt-badge text="2" type="fail" />
    <bt-badge text="3" type="new" />
    <bt-badge text="4" type="overall" />
  </md-layout>
</template>

<script>
import Badge from '@/components/core/Badge'

export default {
  name: 'bt-bot-statistics',
  props: ['bot'],
  components: {
    'bt-badge': Badge
  }
}
</script>

<style>

</style>
