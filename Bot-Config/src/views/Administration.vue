<template>
  <bt-page-container :pageTitle="$t('admin.lblPageTitle')">
    <md-layout md-flex md-column>

    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>{{ $t('admin.colUsername') }}</md-table-head>
          <md-table-head>{{ $t('admin.colAdmin') }}</md-table-head>
          <md-table-head>{{ $t('admin.colActions') }}</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(user, index) in users" :key="user._id">
          <md-table-cell>{{ user.username }}</md-table-cell>
          <md-table-cell>{{ user.admin ? $t('core.yes') : $t('core.no') }}</md-table-cell>
          <md-table-cell>
            <md-layout md-flex>
              <md-layout md-flex="80" md-vertical-align="center">
                <span class="bt-inline-link" @click="manage(user)">
                  <md-icon>settings</md-icon>
                  {{ $t('admin.lblManageBots') }}
                </span>
              </md-layout>
              <md-layout md-flex md-align="end">
                <md-button @click="remove(user)" class="md-icon-button">
                  <md-icon>delete</md-icon>
                </md-button>
              </md-layout>
            </md-layout>

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

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'administration',
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
      RuntimeService.findAllUsers().then(data => {
        this.users = data
      })
    },
    remove (user) {
      RuntimeService.deleteUser(user._id).then((response) => {
        if (response.ok) {
          this.fetchData()
        }
      })
    },
    manage (user) {
      this.$router.push({
        name: 'Overview',
        params: {
          userId: user._id
        }
      })
    }
  }
}
</script>

<style>
.bt-inline-link {
  font-weight: 700;
}

.bt-inline-link i.md-icon {
  width: 18px;
  min-width: 18px;
  height: 18px;
  min-height: 18px;
  font-size: 18px;
}

.bt-inline-link:hover {
  cursor: pointer;
}
</style>
