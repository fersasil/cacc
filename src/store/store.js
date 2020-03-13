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
            state.username = payload.username;
        },
        wipeUserInfo(state) {
            state.token = null;
            state.userID = null;
            state.username = null;
        },

    },
    actions: {
        isLoggedIn() {
            const encodedData = localStorage.getItem("data");

            if(encodedData == null) return false;

            let data;

            try{
                const decodedData = atob(encodedData);
                data = JSON.parse(decodedData);
            }
            catch(err) {
                throw new Error("erro");
            }
            
            data.expiresIn = new Date(data.expiresIn);
            const now = new Date();

            // console.log(JSON.parse(data))
            if (now >= data.expiresIn) {
                localStorage.removeItem("data");
                // router.router.replace({ name: 'signin' });

                return false;
            }
            
            // commit('authUser', data);
            
            return data;

            // router.push({ name: 'Dashboard' });
        },
        setLogoutTimer({ dispatch }, expiresIn) {
            setTimeout(() => {
                dispatch('logout')
            }, expiresIn * 1000);
        },
        async signup({ dispatch }, newUserData) {
            let data;
            try {
                const res = await axios
                    .post("signup", newUserData);

                data = res.data;
            }

            catch (err) {
                console.log(err);
            }

            if (data == null) return;

            

            dispatch('authUser', data);

            router.push({ name: "Dashboard" });
        },

        async authUser({commit, dispatch}, userData){
            const userInfo = {
                userneme: userData.username,
                token: userData.token,
                userID: userData.userID
            }

            userInfo.expiresIn = 3600;

            dispatch('setLogoutTimer', userInfo.expireIn);

            commit('authUser', userInfo);
            
            console.log("OIIII")

            saveLocalStorage(userInfo);
        },

        async signin({ dispatch }, authData) {
            let data;

            try {
                const res = await axios.get("/signin", {
                    params: {
                        username: authData.username,
                        password: authData.password
                    }
                });

                data = res.data;

            } catch (err) {
                throw new LoginError({status: err.response.status});
            }

 
            if (data == null) return;
            
            const user = {
                token: data.token,
                username: authData.username
            }

            console.log("iu")
            
            user.expiresIn = 3600;

            dispatch("authUser", user)
            
            router.push({ name: "dashboard" });
        },

        logout({ commit }) {
            commit('wipeUserInfo');
            //wipe storage too
            localStorage.removeItem("data");

            // router.replace("/");
        },
    },
    getters: {
        userLoggedIn(state) {
            return state.token ? true : false;
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


function LoginError(detail) {
    this.name = 'LoginError';
    this.message = detail || 'Mensagem de erro padrão';
    this.stack = (new Error()).stack;
  
  LoginError.prototype = Object.create(LoginError.prototype);
  LoginError.prototype.constructor = LoginError;
}
  