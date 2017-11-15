<template>
  <div class="login-container">
    <img src="/static/product_white.png" width="120" height="80" class="product-logo">
    <div class="login">
      <input type="text" placeholder="USERNAME" v-model="username">
      <input type="text" placeholder="PASSWORD" v-model="password">
      <button type="button" @click="login">login
        <span class="arrow">&gt;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      }).then(() => {
        this.$router.push({ name: 'Index' })
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100%;
  background-color: #151722;
}

.product-logo {
  position: absolute;
  top: 35%;
  left: 33%;
  transform: translateX(-50%) translateY(-50%);
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 600px;
}

.login input {
  width: 100%;
  height: 38px;
  padding: 10px;
  font-size: 1.1rem;
  background-color: #2C2E38;
  border: 0;
  margin-bottom: 10px;
  color: white;
  font-family: 'Open Sans', sans-serif;
}

.login input:focus {
  outline: none;
  box-shadow: 0px 0px 20px #3C3F4C;
}

.login button {
  border: 0;
  width: 100%;
  height: 38px;
  padding-left: 10px;
  font-size: 1.1rem;
  text-align: start;
  background-color: #FFCB4C;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-family: 'Open Sans', sans-serif;
}

.login button:hover {
  box-shadow: 0px 0px 20px #C49B3A;
}

.login button .arrow {
  position: absolute;
  right: 20px;
}

.login input::-webkit-input-placeholder,
.login input:-moz-input-placeholder,
.login input::-moz-input-placeholder,
.login input:-ms-input-placeholder {
  color: #66676F !important;
}
</style>
