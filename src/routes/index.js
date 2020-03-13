import Vue from "vue";
import Router from "vue-router";

import HelloWorld from '@/components/HelloWorld'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import Dashboard from '@/pages/Dashboard'


Vue.use(Router);



//TODO move to a separate file
// import * as guard from "../middleware/guard";


export default new Router({
    routes: [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        // beforeEnter: guard.authUser
    }, 
    {
        path: '/entrar',
        name: 'sign-in',
        component: SignIn,
        // beforeEnter: guard.userNotAllowedWhenAuthenticated
    },
    {
        path: '/registrar',
        name: 'sign-up',
        component: SignUp,
        // beforeEnter: guard.userNotAllowedWhenAuthenticated
    },
]})