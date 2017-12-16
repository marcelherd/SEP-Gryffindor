<template>
  <md-layout md-flex="100" class="bt-page-footer">
    <md-layout md-flex="15" md-flex-xsmall="50" md-flex-small="15" md-flex-medium="15" md-flex-large="15" md-align="center" md-vertical-align="center">
      <div class="bt-page-footer-icon">
        <img src="/static/product_white.png" />
      </div>
    </md-layout>
    <md-layout md-flex md-vertical-align="center">
      <div class="bt-page-footer-contact">
        <p>BOTTERTOAST</p>
        <p>Mannheim, {{ $t('core.country') }} 2017</p>
      </div>
    </md-layout>
    <md-layout md-flex="15" md-align="center" md-vertical-align="end">
      <div class="bt-page-footer-language">
        <span class="bt-lang-selection" @click="setLanguage('de')">de</span>
        <span class="bt-lang-separator">|</span>
        <span class="bt-lang-selection" @click="setLanguage('en')">en</span>
        <span class="bt-lang-separator">|</span>
        <span class="bt-lang-selection" @click="setLanguage('fr')">fr</span>
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
  height: 100px;
  background-color: #101929;
  color: white;
}

.bt-page-footer-icon {
  margin-top: 10px;
  width: 100px;
}

.bt-page-footer-contact p {
  margin: 0;
}

.bt-page-footer-language {
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.bt-page-footer-language .bt-lang-selection:hover {
  cursor: pointer;
  opacity: .7;
}

.bt-lang-selection:not(:last-child)::before {
  padding-right: 6px;
  border-right: 1px solid white;
}
</style>
