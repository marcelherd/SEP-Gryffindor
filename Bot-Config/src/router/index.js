import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/index'

import Index from '@/components/Index'
import Login from '@/components/Login'
import Overview from '@/components/Overview'
import Edit from '@/components/Edit'

import TemplateSelection from '@/components/TemplateSelection'
import Create from '@/components/Create'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/TemplateSelection',
      name: 'TemplateSelection',
      component: TemplateSelection
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
      path: '/Create/:template',
      name: 'Create',
      component: Create
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login') {
    // if not logged in
    if (!store.getters.isLoggedIn) {
      return next('Login')
    }
  }

  return next()
})

export default router
