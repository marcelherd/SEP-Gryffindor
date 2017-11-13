
<template>
  <page-content page-title="Create Bot">
    <h2> Configure {{this.$route.params.template}} </h2>
    <md-input-container md-clearable>
      <label>Name</label>
      <md-input v-model="botName"></md-input>
    </md-input-container>
    <app-tree></app-tree>
    <md-button @click="post" class="md-raised md-primary">Save</md-button>
  </page-content>
</template>




<script>
import PageContent from '@/components/layout/PageContent'
import Tree from '@/components/Tree'

export default {
  name: 'Create',
  components: {
    'page-content': PageContent,
    'app-tree': Tree
  },

  data () {
    return {
      botName: 'test',
      tree: {tree: null}
    }
  },

  methods: {
    // posts Bot to server to be saved there
    post () {
      let url = `http://localhost:3000/api/v1/manage/bot`
      let headers = new Headers({ 'Content-Type': 'application/json' })

      let payload = JSON.stringify({
        name: this.botName,
        template: this.$route.params.template,
        tree: this.$store.state.tree
      })
      console.log(payload)
      let request = new Request(url, {
        method: 'POST',
        mode: 'CORS',
        headers: headers,
        body: payload
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.$store.state.tree = null
          this.$router.push({name: 'Overview'})
        } else { console.log(response) }
      })
        .catch(error => console.log(error.message))
    }
  }
}
</script>

<style scoped>

</style>
