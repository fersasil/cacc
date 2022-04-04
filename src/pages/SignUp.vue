<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="margin-top d-flex justify-content-center">
          <div class="body-form">
            <form @submit="checkForm">
              <p class="text-center paragraph-white">Criar uma conta</p>
              <!--Email-->
              <div :class="classes.email" class="black-input form-group form-padding">
                <label v-if="!errors.email" for="input-senha label-required">Email</label>
                <label v-else class="p-login-error">{{errors.email}}</label>
                <input
                  @blur="emailIsAvaliable"
                  v-model="email"
                  type="text"
                  class="form-control-lg normal-input black-input"
                />
              </div>
              <!--CPF-->
              <div :class="classes.cpf" class="black-input form-group form-padding">
                <label v-if="!errors.cpf" for="input-senha label-required">CPF</label>
                <label v-else class="p-login-error">{{errors.cpf}}</label>

                <input
                  @blur="cpfIsUsable"
                  v-model="cpf"
                  v-mask="'###.###.###-##'"
                  type="text"
                  class="normal-input black-input form-control-lg"
                />
              </div>
              <!-- Senha -->
              <div :class="classes.inputP" class="black-input form-group form-padding">
                <label v-if="!errors.password" for="p-error input-senha label-required">Senha</label>
                <label v-else :class="classes.password" for="input-senha label-required">{{errors.password}}</label>
              
                <span @click="showPassword" class="ti-eye eye-icon-span"></span>
                <input
                  @input="passwordIsUsable"
                  v-model="password"
                  type="password"
                  id="password"
                  class="normal-input  form-control-lg"
                />
              </div>

              <div :class="classes.confirmPassword" class="black-input form-group form-padding">
                <label v-if="!errors.confirmPassword" for="input-senha label-required">Confirme sua senha</label>
                <label v-else class="p-login-error">{{errors.confirmPassword}}</label>
                <input
                  @input="passwordIsEqual"
                  v-model="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  class="normal-input form-control-lg"
                />
              </div>

              <!--Botão Entrar-->
              <div class="form-group form-padding">
                <button
                  type="submit"
                  name="btn-entrar"
                  class="btn bg-primary btn-block btn-lg"
                >Entrar</button>
              </div>

              <!-- Texto você já possui conta e link -->
              <p class="blue-text">
                <router-link :to="{name: 'sign-in'}">Ja possui uma conta?</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import {axiosNormal as axios} from "../util/axios";

export default {
  data() {
    return {
      errors: { cpf: null, email: null, password: null, confirmPassword: null },
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
      passwordStrength: {letter: false, number: false, special: false, lowerCaseLetter: false},
      classes: {
        email: "",
        password: "",
        confirmPassword: "",
        cpf: "",
        inputP: ""
      }
    };
  },
  methods: {
    async emailIsAvaliable() {
      const res = await axios.get("email-is-avaliable", {
        params: {
          email: this.email
        }
      });
      const isUsable = this.emailIsUsable();
      if (!isUsable) return;
      if (res.data.isInUse == true) {
        this.classes.email = "error";
        this.errors.email = "Email em uso";
        return;
      }
      this.classes.email = "success-input";
      this.errors.email = "";
    },
    showPassword(){
      const inputPassword = document.querySelector("#password");
      const inputConfirmPassword = document.querySelector("#confirmPassword");
      if(inputPassword.type === "text"){
        inputPassword.type = "password";
        inputConfirmPassword.type = "password";
      }
      else{
        inputPassword.type = "text";
        inputConfirmPassword.type = "text";
      }
      
    },
    passwordIsUsable() {
      this.confirmPassword = "";
      this.classes.confirmPassword = "";
      this.errors.confirmPassword = "";
      if (this.password === "") {
        this.classes.password = "";
        this.errors.password = "";
        this.classes.inputP = ""
        return;
      }
      //TODO: caracteres especiais também?
      if (this.password.length <= 5) {
        this.classes.password = "p-login-error";
        this.errors.password = "Senha - Minimo de cinco caracteres";
        this.classes.inputP = "error"
        // this.classes.errors = "Senha - Minimo de cinco caracteres";
        return;
      }
      this.errors.password = "";
      this.securePassword();
      let number = 0;
      if(this.passwordStrength.letter){
      number += 1;
      }
      if(this.passwordStrength.number){
        number += 1;
      }
      if(this.passwordStrength.special){
        number += 1;
      }
      if(this.passwordStrength.lowerCaseLetter){
        number += 1;
      }
      if(number <= 2){
        this.errors.password = "Senha - Senha fraca!";
        this.classes.password = "p-login-error";
        this.classes.inputP = "error";
      }
      else if(number === 3){
        this.errors.password = "Senha - Senha Média!";
        this.classes.password = "p-password-waring";
        this.classes.inputP = "p-login-warning"
      }
      else if(number === 4){
        this.errors.password = "Senha - Senha Forte!";
        this.classes.password = "p-password-success";
        this.classes.inputP = "success-input"
      }
      
    },
    emailIsUsable() {
      if (this.email === "") {
        this.classes.email = "";
        this.errors.email = "";
        return false;
      }
      if (!this.validateEmail()) {
        return false;
      }
      //MOVE this to function above ?
      this.classes.email = "success-input";
      this.errors.email = "";
      return true;
    },
    passwordIsEqual() {
      if (this.confirmPassword === "") {
        this.errors.confirmPassword = "";
        this.classes.confirmPassword = "";
        return;
      }
      if (this.password === this.confirmPassword) {
        this.classes.confirmPassword = "success-input";
        this.errors.confirmPassword = "";
        return;
      }
      this.classes.confirmPassword = "error";
      this.errors.confirmPassword = "Senha - Senhas diferentes!";
    },
    async cpfIsUsable() {
      if (this.cpf === "") {
        this.classes.cpf = "";
        this.errors.cpf = "";
        return;
      }
      if (!this.validateCpf()) {
        this.classes.cpf = "error";
        this.errors.cpf = "CPF - Inválido!";
        return;
      }
      //Verificar se o cpf esta cadastrado no sistema
      const res = await axios.get("cpf-is-avaliable", {
        params: {
          cpf: this.cpf
        }
      });
      if (res.data.isInUse == true) {
        this.classes.cpf = "error";
        this.errors.cpf = "CPF - Em uso";
        return;
      }
      this.classes.cpf = "";
      this.errors.cpf = "";
      this.classes.cpf = "success-input";
    },
    validateCpf() {
      //TODO: Algoritmo não muito bom, essas entradas passam! ps: mudar padrão para ingles 222222222, 3333333...
      const strCPF = this.cpf.replace(/\D/g, "");
      let Soma, Resto, i;
      Soma = 0;
      if (strCPF == "00000000000") return false;
      if (strCPF == "11111111111") return false;
      for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
      if (Resto == 10 || Resto == 11) Resto = 0;
      if (Resto != parseInt(strCPF.substring(9, 10))) return false;
      Soma = 0;
      for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;
      if (Resto == 10 || Resto == 11) Resto = 0;
      if (Resto != parseInt(strCPF.substring(10, 11))) return false;
      return true;
    },
    checkForm: async function(e) {
      e.preventDefault();
      // Mandar para o backend
    //   if (
    //     this.errors.email !== "" ||
    //     this.errors.cpf !== "" ||
    //     this.errors.confirmPassword !== ""
    //     // this.errors.password !== ""
    //   ) {
    //     console.log("algum campo precisa ser preenchido");
    //     return;
    //   }
      //TODO: aceitar senhas fracas!
      const data = {
        cpf: this.cpf,
        email: this.email,
        password: this.password
      };
      let res;
      try {
        res = await axios.post("sign-up", data);
      } catch (err) {
        console.log(err);
      }
      const userData = res.data;
      if (userData.status == -1) {
        console.log("erro");
        //error: "User already signedUp"
        //TODO: visual
        return;
      }
      userData.cpfUser = data.cpf;
      userData.emailUser = data.email;
      this.$store.dispatch("login", userData);
    },
    securePassword() {
      const letterPattern = /[A-Z]/;
      const numberPattern = /[0-9]/;
      const specialCaracterPattern = /[&._-]/ 
      const lowerCaseLetter =  /[a-z]/
      
      if(lowerCaseLetter.test(this.password)){
        this.passwordStrength.lowerCaseLetter = true;
      }
      else{
        this.passwordStrength.lowerCaseLetter = false;        
      }
      if(letterPattern.test(this.password)){
        this.passwordStrength.letter = true;
      }
      else{
        this.passwordStrength.letter = false;
      }
      if(numberPattern.test(this.password)){
        this.passwordStrength.number = true;
      }
      else{
        this.passwordStrength.number = false;
      }
      if(specialCaracterPattern.test(this.password)){
        this.passwordStrength.special = true;
      }
      else{
        this.passwordStrength.special = false;
      }
    },
    validateEmail() {
      const re = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.email.toLowerCase())) {
        this.classes.email = "error";
        this.errors.email = "Email - Por favor, digite um email valido";
        return false;
      } else if (this.email.length > 0) {
        this.classes.email = "";
        this.errors.email = false;
        return true;
      }
    },
    verifyEmpty(name) {
      if (this[name] === "" && this.classes[name].length === 0) {
        this.classes[name].push("error");
        this.errors[name] = "Por favor, prencha esse campo";
        return true;
      } else if (this[name] !== "") {
        this.classes[name].pop();
        this.errors[name] = false;
      }
      return false;
    }
  },
  mounted() {
    document.body.classList.add("body-img");
  },
  destroyed() {
    document.body.classList.remove("body-img");
  },
  directives: { mask }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Be+Vietnam|Mansalva&display=swap");
.p-password-waring {
    color: #ccbc05;
}
.p-password-success{
  color: #169616
}
.eye-icon-span {
  float: right;
  margin-right: 10px;
  margin-top: -0px;
  position: relative;
  z-index: 2;
  top: 44px;
}
.p-login-error {
  color: #ce1a1a
}
.success-input input {
  margin: 0 auto;
  outline: none; /* Remove default outline and use border or box-shadow */
  border: none !important;
  outline: none;
  box-shadow: 0 0 0 2px #0d5d0d;
  color: #351e1e;
}
.p-login-warning input {
  margin: 0 auto;
  outline: none; /* Remove default outline and use border or box-shadow */
  border: none !important;
  outline: none;
  box-shadow: 0 0 0 2px #807714;
  color: #351e1e;
}
.p-login-warning input[type="text"]:focus,
.p-login-warning input[type="password"]:focus,
.p-login-warning input[type="text"]:focus {
  margin: 0 auto !important;
  outline: none !important; /* Remove default outline and use border or box-shadow */
  border: none !important;
  background-color: #343a40 !important;
  /* color: green !important; */
  box-shadow: 0 0 0 2px #ccbc05 !important;
}
.success-input input[type="text"]:focus,
.success-input input[type="password"]:focus,
.success-input input[type="text"]:focus {
  margin: 0 auto !important;
  outline: none !important; /* Remove default outline and use border or box-shadow */
  border: none !important;
  background-color: #343a40 !important;
  /* color: green !important; */
  box-shadow: 0 0 0 2px #169616 !important;
}
.margin-top {
  margin-top: 70px;
}
.label-required::after {
  content: "*";
  color: red;
}
.label-required {
  width: 100%;
}
.align-center {
  display: flex;
  justify-content: center;
}
.btn-form {
  margin-top: 15px;
  width: 100%;
}
.button-submit {
  width: 100%;
  color: #fff;
  background-color: green;
  border-color: transparent;
  border-radius: 0.25rem;
}
.header-main {
  background-color: #343a40;
}
.bg-primary {
  color: #fff;
  cursor: pointer;
}
.paragraph-white {
  color: #dcddde;
  font-size: 25px;
  font-family: "Be Vietnam", cursive;
}
label {
  color: #8e9297;
}
.blue-text {
  color: #007bff;
  text-align: center;
}
.black-input input[type="text"],
.black-input input[type="email"],
.black-input input[type="password"],
.black-input textarea {
  background-color: #d1d1d1;
  font-size: 16px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  border-radius: 3px;
  color: #e9e9e9;
  background-color: #343a40;
  border: 1px solid #212327;
  display: block;
}
.normal-input:focus,
.normal-input:focus,
.normal-input:focus {
  margin: 0 auto;
  outline: none; /* Remove default outline and use border or box-shadow */
  border: none;
  background-color: #343a40;
  color: #e9e9e9;
  box-shadow: 0 0 0 2px gray; /* Full freedom. (works also with border-radius) */
}
.error input {
  margin: 0 auto;
  outline: none; /* Remove default outline and use border or box-shadow */
  border: none !important;
  outline: none;
  box-shadow: 0 0 0 2px #633333;
  color: #b93333;
}
.error input[type="text"]:focus,
.error input[type="password"]:focus,
.error input[type="text"]:focus {
  margin: 0 auto !important;
  outline: none !important; /* Remove default outline and use border or box-shadow */
  border: none !important;
  background-color: #343a40 !important;
  color: #e9e9e9 !important;
  box-shadow: 0 0 0 2px rgb(148, 34, 34) !important;
}
/* Custom, iPhone Retina */
/* Extra Small Devices, Phones */
@media only screen and (max-width: 400px) {
  .body-img {
    background-color: #2d2f34 !important;
    background-image: none;
  }
  .body-form {
    font-family: " !importantBe Vietnam", sans-serif;
    padding: 5px;
    /* border-radius: 1rem; */
    width: 500px;
  }
  .form-padding {
    padding: 0px;
    margin: 0px;
  }
}
/* Medium Devices, Desktops */
@media only screen and (min-width: 400px) {
  .body-img {
    background-color: #343a40;
    /* background-image: url("https://i.imgur.com/M3ioWqh.jpg") !important; */
    background-image: url("~@/assets/images/background.jpg");
  }
  .form-padding {
    padding: 5px 15px;
  }
  .body-form {
    font-family: "Be Vietnam", sans-serif;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #343a40;
    padding: 18px;
    padding-bottom: 0px;
    /* border-radius: 1rem; */
    width: 500px;
    height: 580px;
  }
}
</style>