<template>
  <div class="bt-form-section">
    <div class="bt-form-section-header">
      {{ header }}
      <span v-if="helpText" @click="openDialog">
        <md-icon class="bt-help-icon">help</md-icon>
      </span>
    </div>

    <slot />

    <md-dialog-alert
      md-content="test"
      :md-content-html="helpText"
      md-ok-text="Ok"
      ref="dialog">
    </md-dialog-alert>
  </div>
</template>

<script>
export default {
  name: 'bt-form-section',
  props: ['header', 'helpText'],
  methods: {
    openDialog () {
      this.$refs.dialog.open()
    }
  }
}
</script>

<style>
.bt-form-section-header {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.bt-help-icon {
  margin-left: 4px;
  margin-bottom: 2px;
}

.bt-help-icon:hover {
  cursor: pointer;
  opacity: .7;
}

.md-dialog {
  max-width: 50%;
}

.md-dialog .md-theme-default {
  color: black !important;
}
</style>
