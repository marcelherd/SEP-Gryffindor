<template>
  <page-content v-if="bot" :page-title="'Editing ' + bot.name">

    <md-input-container>
      <label>Name</label>
      <md-input placeholder="Name" v-model="bot.name" required></md-input>
    </md-input-container>


    <app-tree> </app-tree>
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
import Tree from '@/components/Tree'

/**
 * This component allows the user to edit an existing bot.
 *
 * @module components/Edit
 */
export default {
  name: 'Edit',
  components: {
    'page-content': PageContent,
    'app-tree': Tree
  },
  data () {
    return {
      bot: null
    }
  },
  created () {
    // Fetches the bot data whenever this component is instantiated
    this.fetchData()
  },
  methods: {

    /**
     * Fetches the bot data from the   bot runtime.
     */
    fetchData () {
      let id = this.$route.params.id

      fetch(`http://localhost:3000/api/v1/manage/bot/${id}`)
      .then(response => response.json())
      .then(data => {
        this.bot = data
        this.$store.dispatch('updateTree', data.tree)
      })
    },

    /**
     * Saves all changes made to the bot.
     */
    save () {
      // TODO: show validation errors in the user interface
      if (this.bot.name.length === 0) {
        return
      }

      let url = `http://localhost:3000/api/v1/manage/bot/${this.bot.id}`
      console.log(this.bot.tree)
      console.log(this.$store.state.tree)
      let payload = JSON.stringify({
        name: this.bot.name,
        tree: this.bot.tree
      })

      let headers = new Headers({ 'Content-Type': 'application/json' })
      let request = new Request(url, {
        method: 'PATCH',
        mode: 'cors',
        headers: headers,
        body: payload
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.$router.push({ name: 'Overview' })
        } else {
          throw new Error(`Could not save changes to bot with id: ${this.bot.id} (${response.status} ${response.statusText})`)
        }
        this.$store.dispatch('updateTree', null)
        this.$store.dispatch('setSelected', null)
      })
      .catch(error => console.log(error.message))
    }
  }
}
</script>

<style scoped>

</style>
