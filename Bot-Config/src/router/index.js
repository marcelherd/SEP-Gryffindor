import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/index'

import Login from '@/components/Login'
import Overview from '@/components/Overview'
import Edit from '@/components/Edit'

import TemplateSelection from '@/components/TemplateSelection'
import Create from '@/components/Create'

Vue.use(Router)

const router = new Router({
  routes: [
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
      path: '/Overview',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/Overview/bot/:id',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/Create/:template',
      name: 'Create',
      component: Create
    },
    {
      path: '*',
      redirect: '/Overview'
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

  if (to.name === 'Login') {
    if (store.getters.isLoggedIn) {
      return next(to.name)
    }
  }

  return next()
})

export default router
