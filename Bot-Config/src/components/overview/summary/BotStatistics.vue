<template>
  <md-layout md-align="center" md-vertical-align="center">
    <div class="bt-summary-badge bt-badge-success">
      <span>2</span>
    </div>
    <div class="bt-summary-badge bt-badge-fail">
      <span>2</span>
    </div>
    <div class="bt-summary-badge bt-badge-new">
      <span>2</span>
    </div>
    <div class="bt-summary-badge bt-badge-overall">
      <span>2</span>
    </div>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-bot-statistics',
  props: ['bot']
}
</script>

<style>
.bt-summary-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  width: 48px;
  height: 48px;
  border-radius: 48px;

}

.bt-summary-badge.bt-badge-success {
  background-color: #FAD232;
}

.bt-summary-badge.bt-badge-fail {
  background-color: #F53A25;
}

.bt-summary-badge.bt-badge-new {
  background-color: #7FCEB7;
}

.bt-summary-badge.bt-badge-overall {
  background-color: #D1D1D1;
}

.bt-summary-badge span {
  font-size: 18px;
  font-weight: 700;
}
</style>
