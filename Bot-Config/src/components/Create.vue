
<template>
  <page-content page-title="Create Bot">
    <h2 :template="this.template"> Configure {{template}} </h2>
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

  created () {
    this.setTemplate()
  },
  data () {
    return {
      botName: 'test',
      template: null,
      tree: {tree: null}
    }
  },

  methods: {

    setTemplate () {
      this.template = this.$store.state.template
    },
    // posts Bot to server to be saved there
    post () {
      let url = `http://localhost:3000/api/v1/manage/bot`
      let headers = new Headers({ 'Content-Type': 'application/json' })

      let payload = JSON.stringify({
        name: this.botName,
        template: this.template,
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
