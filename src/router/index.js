import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/examples/index';
import PCIndex from '@/examples/index-pc';
import demoIndex from '@/examples/demo';
/*const Index = () => import('../examples/index.vue');
const PCIndex = () => import('../examples/index-pc.vue');*/

function isMobile() {
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  ){
      return true;
  }
  else {
      return false;
  }
}


Vue.use(Router);

const router= new Router({
  mode:'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Index
    },
    {
      path: '/',
      name: 'index',
      component: PCIndex
    },
    {
      path: '/demo',
      name: 'demo',
      component: demoIndex
    }
  ]
});

router.beforeEach((to, from, next) => {
  //console.log(isMobile());
  next();
  // if (isMobile()) {
  //   if (to.name !== 'home') {
  //     next({ name: 'home' });
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (to.name !== 'index') {
  //      next({ path: '/' });
  //   }else{
  //     next();
  //   }
  // }
});

export default router;
