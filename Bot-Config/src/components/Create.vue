
<template>
  <page-content page-title="Create Bot">
    <div class= "Content">
    <h2> Configuration </h2>
    <md-input-container md-clearable>
    <label>Name</label>
    <md-input v-model="botName"></md-input>
  </md-input-container>
  </md-input-container>
      <md-button class="md-raised md-primary">Submit</md-button>
    </div>
  </page-content>
</template>




<script>
import PageContent from '@/components/layout/PageContent'
import Input from '@/components/Input.vue'

export default {
  name: 'Create',
  components: {
    'page-content': PageContent,
    'input-field': Input
  }
}
</script>

<style scoped>

</style>
