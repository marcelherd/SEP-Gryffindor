<template>
  <md-layout md-flex class="bt-login-form">
    <md-layout md-flex="100" md-column>
      <div class="bt-login-icon">
        <img src="/static/product_white.png" />
      </div>
      <md-layout v-if="flashMessage" class="bt-login-flash-message">
        <md-layout>
          <p>{{ flashMessage }}</p>
        </md-layout>
        <md-layout md-align="end">
          <span class="close" @click="closeMessage">&times;</span>
        </md-layout>
      </md-layout>
      <div class="bt-login-input-container">
        <input v-model="username" type="text" placeholder="Username" class="bt-login-input">
        <input v-model="password" type="password" placeholder="Password" class="bt-login-input">
      </div>
      <md-layout md-align="end" class="bt-login-controls">
        <button @click="login" class="bt-login-button">Login</button>
      </md-layout>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-login-form',
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
        this.$router.push({
          name: 'Overview',
          params: { userId: this.$store.getters.user._id }
        })
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

<style>
.bt-login-form {
  align-items: flex-start;
  padding: 70px;
  background-color: #141525;
  color: white;
}

.bt-login-icon {
  width: 110px;
  margin-bottom: 32px;
}

.bt-login-flash-message {
  margin-bottom: 16px;
  padding: 16px;
  color: white;
  border: 1px solid #FF2B4C;
  border-radius: 4px;
}

.bt-login-flash-message p,
.bt-login-flash-message span {
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
}

.bt-login-flash-message .close {
  right: 16px;
  font-size: 1.5rem;
}
.bt-login-flash-message .close:hover {
  cursor: pointer;
  color: #aaa;
}

.bt-login-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 8px;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.bt-login-input:focus {
  background-color: #FFCB4C;
  color: #151722;
  outline: 0;
}

.bt-login-button {
  height: 40px;
  padding: 4px 8px 4px 8px;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  color: #FFCB4C;
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.bt-login-button:hover {
  text-decoration: none;
  color: #151722;
  background-color: #FFCB4C;
}

::-webkit-input-placeholder {
    color:white;
}
::-moz-placeholder {
    color:white;
}
::-ms-placeholder {
    color:white;
}
::placeholder {
    color:white;
}
</style>
