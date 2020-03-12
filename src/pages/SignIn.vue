<template>
  <div>
      <h1>Ola</h1>

      <div class="b">
        <label class="a" for="">Email</label>
        <input v-bind="email" type="text">
      </div>

      <div class="b">
        <label class="a" for="">Password</label>
        <input v-model="password" type="text"> {{email}}
      </div>

      <div class="btn">
        <button @click="login">Login</button>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    login() {
      alert(this.password)
    }
  }
}
</script>

<style>
.a{
  margin-right: 10px;
  margin-bottom: 10px;
}
.b{
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>