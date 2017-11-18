<template>
  <page-content page-title="Create User">

    <md-input-container>
      <label>Username</label>
      <md-input v-model="username"></md-input>
    </md-input-container>

    <md-input-container md-has-password>
      <label>Password</label>
      <md-input v-model="password"></md-input>
    </md-input-container>

    <md-switch v-model="admin">
      Administrator
    </md-switch>

    <md-button @click="save" class="md-raised md-accent">Save</md-button>
    <md-button @click="$router.push('Administration')" class="md-accent">Cancel</md-button>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

export default {
  name: 'NewUser',
  components: {
    'page-content': PageContent
  },
  data () {
    return {
      username: '',
      password: '',
      admin: false
    }
  },
  methods: {
    save () {
      let url = `http://localhost:3000/api/v1/manage/users/`
      let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token') })

      let payload = JSON.stringify({
        username: this.username,
        password: this.password,
        admin: this.admin
      })

      let request = new Request(url, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: payload
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.$router.push({name: 'Administration'})
        }
      }).catch(error => console.log(error.message))
    }
  }
}
</script>

<style scoped>

</style>
