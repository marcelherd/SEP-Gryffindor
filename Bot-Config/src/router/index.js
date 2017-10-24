import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import Foo from '@/components/Foo'

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
    }
  ]
})
