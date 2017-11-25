<template>
  <input ref="input"
    :type="type" :value="value" :placeholder="placeholder"
    @input="update" class="bt-input" />
</template>

<script>
export default {
  name: 'bt-input',
  props: ['value', 'type', 'placeholder', 'theme'],
  methods: {
    update () {
      this.$emit('input', this.$refs.input.value)
    }
  }
}
</script>

<style>
.bt-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: transparent;
  border: 1px solid #c2c2c2;
  border-radius: 8px;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.bt-input:focus {
  outline: 0;
}
</style>
