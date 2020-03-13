<template>
  <div>
      <h1>Oiu</h1>
      <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
    methods: {
        logout(){
            this.$store.dispatch("logout")
        }
    }
}
</script>

<style>

</style>