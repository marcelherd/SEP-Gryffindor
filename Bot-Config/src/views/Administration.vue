<template>
  <bt-page-container pageTitle="Administration">
    <md-layout md-flex md-column>

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
          <md-table-cell>{{ user.admin ? 'yes' : 'no' }}</md-table-cell>
          <md-table-cell>
            <md-button @click="remove(user)" class="md-icon-button">
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <bt-fab to="/Administration/new">
      <md-icon>add</md-icon>
    </bt-fab>

    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FloatingActionButton from '@/components/core/FloatingActionButton'

import UserService from '@/services/UserService'

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer,
    'bt-fab': FloatingActionButton
  },
  data () {
    return {
      users: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      UserService.getAll().then(data => {
        this.users = data
      })
    },
    remove (user) {
      UserService.delete(user).then((response) => {
        if (response.ok) {
          this.fetchData()
        }
      })
    }
  }
}
</script>

<style>

</style>
