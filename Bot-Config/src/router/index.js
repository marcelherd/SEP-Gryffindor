import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '@/components/Welcome'
import Overview from '@/components/Overview'
import Create from '@/components/Create'
import CreateWelcomeBot from '@/components/CreateWelcomeBot'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/overview',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/create/welcome-bot',
      name: 'CreateWelcomeBot',
      component: CreateWelcomeBot
    }
  ]
})
