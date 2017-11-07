
<template>
  <page-content page-title="Create Bot">
    <h2> Configuration </h2>
    <md-input-container md-clearable>
      <label>Name</label>
      <md-input v-model="botName"></md-input>
    </md-input-container>
  <div class="field-group">
  <md-input-container>
    <label for="BotType">Bottype</label>
    <md-select name="Bottype" id="Bottype" v-model="Bottype">
      <md-option value="Welcome Bot">Welcome Bot</md-option>
      <md-option value="FAQ Bot">FAQ Bot</md-option>
    </md-select>
  </md-input-container>
</div>

    <md-button @click="post" class="md-raised md-primary">Save</md-button>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'
import Input from '@/components/Input'

export default {
  name: 'Create',
  components: {
    'page-content': PageContent,
    'input-field': Input
  },
  data () {
    return {
      botName: 'test',
      template: '',
      Bottype: ''
    }
  },
  methods: {
    post () {
      let url = `http://localhost:3000/api/v1/manage/bot`
      let headers = new Headers({ 'Content-Type': 'application/json' })
      console.log(this.botName)
      let payload = JSON.stringify({
        name: this.botName,
        template: this.Bottype
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
