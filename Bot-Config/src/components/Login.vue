<template>
  <div class="login-container">
    <div class="login">
      <img src="/static/product_white.png" class="product-logo">

      <div class="flash-message" v-if="flashMessage">
        <p>{{ flashMessage }}</p>
        <span class="close" @click="closeMessage">&times;</span>
      </div>

      <input id="username" type="text" placeholder="Username" v-model="username">
      <input id="password" idtype="password" placeholder="Password" v-model="password">
      <div class="login-controls">
        <button @click="login" class="login-button">
        Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      flashMessage: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      }).then(() => {
        this.$router.push({ name: 'Overview' })
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
  width: 120px;
  height: 80px;
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
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  color: white;
  font-family: 'Open Sans', sans-serif;
}

.login input:focus {
  background-color: #FFCB4C;
  color: #151722;
  letter-spacing: 1px;
  outline: 0;
}

.login-controls {
  width: 100%;
}

.login-controls .login-button {
  font-family: 'Open Sans', sans-serif;
  position: absolute;
  right: 0;
  color: #FFCB4C;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  border: 0;
  background-color: transparent;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 4px 8px 4px 8px;
}

.login-controls .login-button:hover {
  text-decoration: none;
  color: #151722;
  background-color: #FFCB4C;
}

::-webkit-input-placeholder {
    color:white;
    letter-spacing: 2px;
}

::-moz-placeholder {
    color:white;
    letter-spacing: 2px;
}

::-ms-placeholder {
    color:white;
    letter-spacing: 2px;
}

::placeholder {
    color:white;
    letter-spacing: 2px;
}
</style>
