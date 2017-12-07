<template>
  <md-layout md-flex="100" v-if="message"
    class="bt-flash-message" :class="`bt-flash-message-${type}`">
    <md-layout>
      <p>{{ message }}</p>
    </md-layout>
    <md-layout md-align="end">
      <span class="close" @click="closeMessage">&times;</span>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-flash-message',
  props: ['type'],
  data () {
    return {
      message: ''
    }
  },
  methods: {
    pushMessage (message) {
      this.message = message
    },
    closeMessage () {
      this.message = ''
    },
    setType (type) {
      this.type = type
    }
  }
}
</script>

<style>
.bt-flash-message {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #FAD232;
}

.bt-flash-message.bt-flash-message-error {
  border: 1px solid #FF2B4C;
}

.bt-flash-message p,
.bt-flash-message span {
  justify-content: center;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.05rem;
}

.bt-flash-message .close {
  right: 16px;
  font-size: 1.5rem;
}
.bt-flash-message .close:hover {
  cursor: pointer;
  color: #aaa;
}
</style>
