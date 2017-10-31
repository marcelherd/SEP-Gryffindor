<template>
  <page-content page-title="CreateBot">
    <div class= "Content">
    <h2> Configuration </h2>
    <md-input-container md-clearable>
    <label>Name</label>
    <md-input v-model="botName"></md-input>
  </md-input-container>
  </md-input-container>
  <ul id="demo">
  <tree
    class="item"
    :model="data">
  </tree>
</ul>
  <md-button class="md-raised md-primary">Submit</md-button>
</div>
  </page-content>
</template>

var data = {
  name: 'My Tree',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}

<script>
import PageContent from '@/components/layout/PageContent'
import Input from '@/components/Input.vue'
import Tree from '@/components/tree.vue'

export default {
  name: 'Create',
  components: {
    'page-content': PageContent,
    'input-field': Input,
    'tree': Tree
  }
}
</script>

<style scoped>

</style>
