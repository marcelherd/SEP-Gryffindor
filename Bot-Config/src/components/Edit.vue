<template>
  <page-content v-if="bot" :page-title="'Editing ' + bot.name">

    <md-input-container>
      <label>Name</label>
      <md-input placeholder="Name" v-model="bot.name" required></md-input>
    </md-input-container>

    <router-link tag="md-button" to="/overview" exact class="md-accent">
      Cancel
    </router-link>

    <md-button @click="save" class="md-raised md-accent">
      Save
    </md-button>

  </page-content>

  <page-content v-else page-title="Loading..."></page-content>
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

      fetch(`http://localhost:3000/api/v1/manage/bot/${id}`)
      .then(response => response.json())
      .then(data => {
        this.bot = data
      })
    },
    save () {
      // TODO: save changes
      this.$router.push({ name: 'Overview', params: { message: `Updated ${this.bot.name}` } })
    }
  }
}
</script>

<style scoped>

</style>
