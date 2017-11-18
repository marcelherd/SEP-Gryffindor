<template>
  <page-content page-title="Administration">
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>Username</md-table-head>
          <md-table-head>Admin</md-table-head>
          <md-table-head></md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(user, index) in users" :key="user._id">
          <md-table-cell>{{ user.username }}</md-table-cell>
          <md-table-cell>{{ user.admin }}</md-table-cell>
          <md-table-cell>
            <md-button @click="remove(user)" class="md-icon-button">
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <router-link tag="md-button" to="/Administration/new" exact class="md-fab md-fab-bottom-right">
      <md-icon>add</md-icon>
    </router-link>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

/**
 * This component shows the home page for the bot configuration.
 *
 * @module components/Index
 */
export default {
  name: 'Administration',
  components: {
    'page-content': PageContent
  },
  data () {
    return {
      users: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      fetch(`http://localhost:3000/api/v1/manage/users/`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      })
      .then(response => response.json())
      .then(data => {
        this.users = data
      })
    },

    remove (user) {
      let url = `http://localhost:3000/api/v1/manage/users/${user._id}`

      let headers = new Headers({ 'x-access-token': localStorage.getItem('token') })
      let request = new Request(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: headers
      })

      fetch(request).then(response => {
        if (response.ok) {
          this.fetchData()
        } else {
          throw new Error(`Could not delete user with id: ${user._id} (${response.status} ${response.statusText})`)
        }
      })
      .catch(error => console.log(error.message))
    }
  }
}
</script>

<style>
</style>
