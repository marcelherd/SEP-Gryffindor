<template>
  <md-layout md-flex="100" class="bt-page-footer">
    <md-layout md-flex="15" md-flex-xsmall="50" md-flex-small="30" md-flex-medium="30" md-flex-large="20" md-align="center" md-vertical-align="center">
      <div class="bt-page-footer-icon">
        <img src="/static/product_white.png" />
      </div>
    </md-layout>
    <md-layout md-vertical-align="end">
      <div class="bt-page-footer-contact">
        <p>BOTTERBROT</p>
        <p>Mannheim, Germany 2017</p>
      </div>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-page-footer'
}
</script>

<style>
.bt-page-footer {
  height: 160px;
  background-color: #101929;
  color: white;
}

.bt-page-footer-icon {
  width: 140px;
}
.bt-page-footer-contact {
  margin-bottom: 40px;
}

.bt-page-footer-contact p {
  margin: 0;
}
</style>
