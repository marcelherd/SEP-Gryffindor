<template>
  <md-layout v-on:click="alert('click')" :md-flex="flex" md-column class="bt-tile">
    <md-layout md-flex class="bt-tile-title">{{ template.name }}</md-layout>
    <md-layout md-flex class="bt-tile-preview">
      <md-layout md-flex class="bt-tile-icon">
        <img src="/static/favicon.png" />
      </md-layout>
      <md-layout md-flex="70" class="bt-tile-message">
        <span>{{ template.message }}</span>
      </md-layout>
    </md-layout>
    <md-layout md-flex class="bt-tile-description">{{ template.description }}</md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-tile',
  props: ['template', 'flex']
}
</script>

<style>
.bt-tile {
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px 5px;
  margin: 32px;
}

.bt-tile-title {
  font-size: 48px;
  color: #FAD232;
  margin-top: 32px;
  margin-left: 32px;
}

.bt-tile-preview {
  margin-left: 32px;
}

.bt-tile-description {
  margin-left: 32px;
  margin-top: 32px;
  margin-bottom: 32px;
  margin-right: 32px;
}

.bt-tile-message {
  display: flex;
  align-items: center;
  background-color: #F3F3F4;
  padding: 16px;
  margin-left: 16px;
  margin-right: 32px;
  border: 1px solid #F3F3F4;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

.bt-tile-message span {
  font-weight: 700;
}
</style>
