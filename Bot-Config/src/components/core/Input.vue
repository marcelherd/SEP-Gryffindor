<template>
  <label class="bt-label">
    {{ placeholder }} <span v-if="required">*</span>
    <input ref="input"
      :type="type" :value="value" :placeholder="placeholder"
      @input="update" class="bt-input" :required="required || false" />
  </label>
</template>

<script>
/**
 * An input component.
 *
 * @author Marcel Herd
 * @module components/core/Input
 *
 * @param {string} value - The text value to bind to. Can be used with v-model
 * @param {string} [type] - The type of the input field
 * @param {string} [placeholder] - The placeholder of the input field. Shows an asterisk if the input is required
 * @param {string} [required=false] - Whether the input field is required. Only works if type is 'submit'
 */
export default {
  name: 'bt-input',
  props: ['value', 'type', 'placeholder', 'required'],
  methods: {
    /**
     * Propagates input event.
     * Allows for v-model binding.
     *
     * @method update
     */
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
