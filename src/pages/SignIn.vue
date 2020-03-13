<template>
  <div style="padding: 20px">
    <h1>Login</h1>
    <div v-if="loginWrong">
        <p style="color: red">Usuário ou senha Incorretos</p>
    </div>

    <div>
      <label for>Username</label>
      <input v-model="username" type="text" />
    </div>

    <div>
      <label for>Senha</label>
      <input v-model="password" type="text" />
    </div>


    <button @click="login">Entrar</button>
  </div>
</template>

<script>
// import { axiosNormal as axios } from "../util/axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      token: "",
      loginWrong: false
    };
  },
  methods: {
    async login() {
      const userData = {
        username: this.username,
        password: this.password
      };

      try {
        await this.$store.dispatch("signin", userData);
      } catch (err) {
        if(err.message.status == 401){
          this.loginWrong = true;
        }
      }
    }
  }
};
</script>

<style>
</style>