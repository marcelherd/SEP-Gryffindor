import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/index'

import Login from '@/views/Login'
import Overview from '@/views/Overview'
import Marketplace from '@/views/Marketplace'
import BotCreate from '@/views/BotCreate'
import Account from '@/views/Account'
import Administration from '@/views/Administration'
import UserCreate from '@/views/UserCreate'
import BotEdit from '@/views/BotEdit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Overview/:userId',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/Overview/:userId/Edit/:botId',
      name: 'BotEdit',
      component: BotEdit
    },
    {
      path: '/Create',
      name: 'Marketplace',
      component: Marketplace
    },
    {
      path: '/Create/:template',
      name: 'BotCreate',
      component: BotCreate
    },
    {
      path: '/Account',
      name: 'Account',
      component: Account
    },
    {
      path: '/Administration',
      name: 'Administration',
      component: Administration
    },
    {
      path: '/Administration/new',
      name: 'UserCreate',
      component: UserCreate
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login') {
    if (!store.getters.isLoggedIn) {
      return next('Login')
    }
  }

  if (to.name === 'Login') {
    if (store.getters.isLoggedIn) {
      return next(from.path)
    }
  }

  return next()
})

export default router
