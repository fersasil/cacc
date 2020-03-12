import Vue from "vue";
import Router from "vue-router";

import HelloWorld from '@/components/HelloWorld'
import SignIn from '@/pages/SignIn'


Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld,
    }, {
        path: '/entrar',
        name: 'sign-in',
        component: SignIn,
    }]
})