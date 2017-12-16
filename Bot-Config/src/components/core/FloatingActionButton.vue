<template>
  <button @click="onClick" class="bt-fab">
    <slot />
  </button>
</template>

<script>
/**
 * A Floating Action Button component.
 *
 * @author Marcel Herd
 * @module components/core/FloatingActionButton
 *
 * @param {string} [to] - If set, it navigates to its value when the button is clicked.
 */
export default {
  name: 'bt-fab',
  props: ['to'],
  methods: {
    /**
     * Click handler.
     *
     * If to is set, it navigates to its value.
     * Propagates the click event otherwise.
     */
    onClick () {
      if (this.to) {
        this.$router.push(this.to)
      }

      this.$emit('click')
    }
  }
}
</script>

<style>
.bt-fab {
  position: fixed;
  bottom: calc(100px + 5%);
  right: 5%;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 0;
  border-radius: 56px;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
  background-color: #FAD232;
  background-clip: padding-box;
}

.bt-fab:hover {
  cursor: pointer;
}
</style>
