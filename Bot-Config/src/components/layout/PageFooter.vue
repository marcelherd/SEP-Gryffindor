<template>
  <md-layout md-flex="100" class="bt-page-footer">
    <md-layout md-flex="15" md-flex-xsmall="50" md-flex-small="30" md-flex-medium="30" md-flex-large="20" md-align="center" md-vertical-align="center">
      <div class="bt-page-footer-icon">
        <img src="/static/product_white.png" />
      </div>
    </md-layout>
    <md-layout md-flex md-vertical-align="end">
      <div class="bt-page-footer-contact">
        <p>BOTTERTOAST</p>
        <p>Mannheim, {{ $t('core.country') }} 2017</p>
      </div>
    </md-layout>
    <md-layout md-flex="15" md-align="center" md-vertical-align="end">
      <div class="bt-page-footer-language">
        <span class="flag-icon flag-icon-de" @click="setLanguage('de')"></span>
        <span class="flag-icon flag-icon-us" @click="setLanguage('en')"></span>
      </div>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-page-footer',
  methods: {
    setLanguage (locale) {
      this.$i18n.locale = locale
      localStorage.setItem('locale', locale)
    }
  }
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

.bt-page-footer-language {
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.bt-page-footer-language .flag-icon:hover {
  cursor: pointer;
}
</style>
