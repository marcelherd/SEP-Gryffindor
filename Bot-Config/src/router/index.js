import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import Overview from '@/components/Overview'
import Edit from '@/components/Edit'
import Foo from '@/components/Foo'
import Create from '@/components/Create'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/foo',
      name: 'Foo',
      component: Foo
    },
    {
      path: '/overview',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/overview/bot/:id',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/Create',
      name: 'Create',
      component: Create
    }

  ]
})
