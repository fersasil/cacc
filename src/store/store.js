import Vue from 'vue';
import Vuex from 'vuex';

import { axiosNormal as axios } from "../util/axios";

import router from '@/routes'

const expireTimeDate = expireInSeconds => {
    const now = new Date();
    const expireTimeMiliseconds = now.getTime() + expireInSeconds * 1000;
    console.log()
    return new Date(expireTimeMiliseconds);
}

const saveLocalStorage = (data => {
    //get expireTime from user info
    data.expiresIn = expireTimeDate(data.expiresIn);

    const dataEncoded = btoa(JSON.stringify(data));

    //atob() btoa()

    localStorage.setItem('data', dataEncoded);
    // localStorage.setItem('expires', data.expiresIn);
})


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: null,
        userID: null,
        username: null,
    },
    mutations: {
        authUser(state, payload) {
            state.token = payload.token;
            state.userID = payload.userID;
            state.userName = payload.username;
        },
        wipeUserInfo(state) {
            state.token = null;
            state.userID = null;
            state.username = null;
        },

    },
    actions: {
        isLoggedIn({ commit }) {
            const encodedData = localStorage.getItem("data");

            if (!encodedData) {
                return
            }

            const decodedData = atob(encodedData);
            const data = JSON.parse(decodedData);
            data.expiresIn = new Date(data.expiresIn);

            const now = new Date();

            // console.log(JSON.parse(data))
            if (now >= data.expiresIn) {
                //wipe localstorage
                return;
            }

            commit('authUser', data);
            // router.push({ name: 'Dashboard' });
        },
        setLogoutTimer({ dispatch }, expiresIn) {
            setTimeout(() => {
                dispatch('logout')
            }, expiresIn * 1000);
        },
        async signup({ commit, dispatch }, newUserData) {
            let data;
            try {
                const res = await axios
                    .post("signup", newUserData);

                data = res.data;
            }

            catch (err) {
                console.log(err);
            }

            if(data == null) return;

            const userInfo = {
                userneme: data.username,
                token: data.token,
                userID: data.userID
            }

            commit('authUser', userInfo);

            // router.push({ name: "Dashboard" });
            dispatch('setLogoutTimer', data.expiresIn);

            userInfo.expiresIn = data.expiresIn;
            saveLocalStorage(userInfo);

        },

        async signin({ commit, dispatch }, authData) {
            console.log(authData)
           
            commit('authUser', authData);

            router.push({ name: "dashboard" });
            dispatch('setLogoutTimer', 3600);

        },

        logout({ commit }) {
            commit('wipeUserInfo');
            //wipe storage too
            localStorage.removeItem("data");

            router.replace({ name: 'Home' });
        },
    },
    getters: {
        userLoggedIn(state) {
            return state.userID ? true : false;
        },
        getUserName(state) {
            return state.username;
        },
        getUserId(state) {
            return state.userID;
        },
        getToken(state) {
            return state.token;
        }
    }
});