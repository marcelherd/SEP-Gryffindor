<template>
  <div class="login-container">
    <div class="login">
      <img src="/static/product_white.png" width="120" height="80" class="product-logo">

      <div class="flash-message" v-if="flashMessage">
        <p>{{ flashMessage }}</p>
        <span class="close" @click="closeMessage">&times;</span>
      </div>

      <input type="text" placeholder="USERNAME" v-model="name">
      <input type="password" placeholder="PASSWORD" v-model="password">
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
      name: '',
      password: '',
      flashMessage: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {
        name: this.name,
        password: this.password
      }).then(() => {
        this.$router.push({ name: 'Index' })
      }).catch((err) => {
        this.flashMessage = err.message
        this.password = ''
      })
    },

    closeMessage () {
      this.flashMessage = ''
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
  position: relative;
  top: -25px;
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 70%;
}

@media screen and (min-width: 1200px) {
  .product-logo {
    position: relative;
    left: -75px;
    top: -25px;
  }

  .login {
    width: 30%;
  }
}

@media screen and (min-width: 800px) and (max-width: 1200px) {
  .product-logo {
    position: relative;
    left: -75px;
    top: -25px;
  }

  .login {
    width: 50%;
  }
}

.flash-message {
  color: white;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #FF2B4C;
  border-radius: 4px;
}

.flash-message p {
  display: inline-block;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
}

.flash-message .close {
  position: absolute;
  right: 16px;
  font-size: 1.5rem;
}

.flash-message .close:hover {
  cursor: pointer;
  color: #aaa;
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
  letter-spacing: 2px;
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
  letter-spacing: 2px;
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
