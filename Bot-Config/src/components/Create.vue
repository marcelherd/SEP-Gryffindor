
<template>
  <page-content page-title="Create Bot">
    <h2> Configure {{this.$route.params.template}} </h2>
    <md-input-container md-clearable>
      <label>Name</label>
      <md-input v-model="botName"></md-input>
    </md-input-container>
     <md-input-container md-clearable>
      <label>Greeting</label>
      <md-input v-model="greeting"></md-input>
    </md-input-container>
    <app-tree></app-tree>
    <md-button @click="post" class="md-raised md-accent">Save</md-button>
  </page-content>
</template>




<script>
/**
 * This component realises the Bot Configuration
 *
 * @module components/Create
 */
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
      tree: {tree: null},
      greeting: ''
    }
  },

  methods: {
    /*
    * posts Bot with its name, template and decision tree to the server where it is saved
    */
    post () {
      let url = `http://141.19.145.163:3000/api/v1/manage/bot`
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') })

      let payload = JSON.stringify({
        name: this.botName,
        template: this.$route.params.template,
        tree: this.$store.state.tree,
        greeting: this.greeting
      })
      console.log(payload)
      let request = new Request(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: payload
      })
      fetch(request).then(response => {
        if (response.ok) {
          this.$store.dispatch('updateTree', null)
          this.$store.dispatch('setSelected', null)
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
