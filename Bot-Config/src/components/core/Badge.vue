<template>
  <md-layout md-flex class="bt-badge" :class="`bt-badge-${type}`">
    <span>{{ text }}</span>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-badge',
  props: ['text', 'type']
}
</script>

<style>
.bt-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 50%;
}

.bt-badge:before {
  content: "";
  display: block;
  padding-top: 100%;
}

.bt-badge.bt-badge-success {
  background-color: #FAD232;
}

.bt-badge.bt-badge-fail {
  background-color: #F53A25;
}

.bt-badge.bt-badge-new {
  background-color: #7FCEB7;
}

.bt-badge.bt-badge-overall {
  background-color: #D1D1D1;
}

.bt-badge span {
  font-size: 18px;
  font-weight: 700;
}
</style>
