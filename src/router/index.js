import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/tabber-layout'),
      children: [
        {
          name: 'Home',
          path: '/',
          component: () => import('@/views/home')
        }
      ]
    },

    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      name: 'text',
      path: '/text',
      component: () => import('@/views/text')
    }
  ]
})
