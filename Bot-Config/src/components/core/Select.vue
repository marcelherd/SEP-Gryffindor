<template>
  <label class="bt-label">
    {{ label }}
    <select :value="value" ref="select" @change="update" class="bt-select">
      <option v-for="(value, index) in values" :key="index" :value="value">
        {{ value }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'bt-select',
  props: ['label', 'value', 'values'],
  data () {
    return {
      selected: ''
    }
  },
  methods: {
    update () {
      this.$emit('input', this.$refs.select.value)
    }
  }
}
</script>

<style>
.bt-select {
  width: 100%;
  padding: 10px;
  padding-left: 6px;
  background-color: transparent;
  border: 1px solid #c2c2c2;
  border-radius: 8px;
  font-size: 1.1rem;
}

.bt-select:focus {
  outline: 0;
}
</style>
