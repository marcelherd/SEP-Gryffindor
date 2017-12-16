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
/**
 * A select component.
 *
 * @author Marcel Herd
 * @module components/core/Select
 *
 * @param {string} value - The value to bind to. Can be used with v-model
 * @param {string[]} values - The possible values of the select
 * @param {string} [label] - If set, displays a label above the select
 */
export default {
  name: 'bt-select',
  props: ['value', 'values', 'label'],
  data () {
    return {
      selected: ''
    }
  },
  methods: {
    /**
     * Propagates input event.
     * Allows for v-model binding.
     *
     * @method update
     */
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
