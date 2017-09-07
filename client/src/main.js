import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Home from './Home.vue'
import FlashcardView from './Flashcards/FlashcardView.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/flashcards',
      name: 'Flashcards',
      component: FlashcardView
    }
  ]
})

new Vue({
  el: '#app',
  router,
  template: '<App></App>',
  components: { App }
})
