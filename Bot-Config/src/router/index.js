import Vue from 'vue'
import Router from 'vue-router'

import Welcome from '@/components/Welcome'
import Overview from '@/components/Overview'
import Create from '@/components/Create'

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
    }
  ]
})
