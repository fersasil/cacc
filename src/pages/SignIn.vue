<template>
  <div>
    <h1>Login</h1>
    <div>
      <label for>Username</label>
      <input v-model="username" type="text" />
    </div>

    <div>
      <label for>Senha</label>
      <input v-model="password" type="text" />
    </div>

    <p>Token: {{token}}</p>

    <button @click="login">Entrar</button>
  </div>
</template>

<script>
import { axiosNormal as axios } from "../util/axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      token: ""
    };
  },
  methods: {
    async login() {
      let data;
      try {
        const res = await axios.get("/signin", {
          params: {
            username: this.username,
            password: this.password
          }
        });

        data = res.data;
      } catch (err) {
        alert("Erro");
      }

      this.token = data.token;

    }
  }
};
</script>

<style>
</style>