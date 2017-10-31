<template>
  <page-content page-title="Edit">
    <p v-if="bot">
      Editing {{ bot.name }}
    </p>
    <p v-else>Loading...</p>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

export default {
  name: 'Edit',
  components: {
    'page-content': PageContent
  },
  data () {
    return {
      bot: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      let id = this.$route.params.id

      fetch(`http://192.168.1.2:3000/api/v1/manage/bot/${id}`)
      .then(response => response.json())
      .then(data => {
        this.bot = data
      })
    }
  }
}
</script>

<style scoped>

</style>
