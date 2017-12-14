<template>
  <div id="app">
    <router-view :key="$route.name + ($route.params.userId || '')"></router-view>
  </div>
</template>

<script>
/**
 * The bot platform root component.
 */
export default {
  name: 'app',
  created () {
    const locale = localStorage.getItem('locale')
    if (locale !== null) {
      this.$i18n.locale = locale
    }
  }
}
</script>

<style src="vue-material/dist/vue-material.css"></style>
<style src="flag-icon-css/css/flag-icon.min.css"></style>

<style>
body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Open Sans', sans-serif;
}

.bt-header-1 {
  font-size: 48px;
  font-weight: 500;
  color: #FFD244;
  margin-bottom: 48px;
}

.md-layout .bt-form-section:not(:first-of-type) {
  margin-top: 24px;
}

.bt-profile-picture {
  align-self: center;
  width: 100px;
}

.bt-profile-picture-small {
  position: relative;
  bottom: -30px;
  right: 10px;
  width: 35px;
}

.bt-card {
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px 5px;
  margin-bottom: 48px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.bt-card input:focus {
  outline: 0;
}

.bt-card input:focus {
  background-color: #FAD232;
}

.bt-card-header {
  padding: 12px;
  padding-left: 20px;
  background-color: #FAD232;
  font-size: 24px;
}

.bt-card-header-title {
  font-weight: 700;
}

.bt-card-header-subtitle {
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.bt-card-header input {
  border: 0;
  background-color: transparent;
  font-size: 24px;
  outline: 0;
}

.bt-card-header-actions button {
  border: 0;
  background-color: transparent;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
}

.bt-card-header-actions button:hover {
  cursor: pointer;
}

.bt-card-body {
  padding: 12px;
  padding-left: 20px;
  flex: 1;
}

.bt-card-subtitle {
  color: #aaa;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.bt-card-utterance {
  border: 2px solid black;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px;
  font-size: 16px;
  margin-right: 20px;
}

p.bt-card-utterance {
  margin-bottom: 8px;
  margin-top: 8px;
}

.bt-card-utterance:first-child {
  border-radius: 8px;
  border-bottom-left-radius: 0;
}

.bt-card-utterance:last-of-type {
  border-radius: 8px;
  border-top-left-radius: 0;
}

.bt-card-utterance:only-of-type {
  border-radius: 8px !important;
}

.bt-card-utterances input {
  display: block;
  width: 80%;
  margin-bottom: 6px;
}

.bt-card-answer-config {
  width: 100%;
}

.bt-card-answer {
  width: 80%;
  margin-left: 20%;
  border: 2px solid black;
  border-radius: 8px;
  padding: 8px;
  font-size: 16px;
}

.bt-button-toggle {
  padding: 8px;
}

.bt-button-toggle .md-button:hover {
  background-color: #F9F2AE !important;
}

.bt-button-toggle .md-button.md-toggle {
  background-color: #FAD232;
}

.bt-card-action {
  margin-top: 20px;
}

.bt-card-header ::-webkit-input-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::-moz-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::-ms-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}

a.bt-back-button,
.md-layout a.bt-back-button {
  position: fixed;
  top: 120px;
  left: 5%;
  color: black;
  font-size: 16px;
}

a.bt-back-button:hover,
.md-layout a.bt-back-button:hover {
  color: black;
  opacity: .7;
  cursor: pointer;
  text-decoration: none;
}

.bt-overlay {
  background-color: rgba(0, 0, 0, .55);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bt-overlay-content {
  display: flex;
  align-self: center;
  margin: 0 auto;
}

.bt-overlay-content span {
  font-size: 48px;
  color: white;
}

::-webkit-input-placeholder {
    color:#8C8C8C;
}
::-moz-placeholder {
    color:#8C8C8C;
}
::-ms-placeholder {
    color:#8C8C8C;
}
::placeholder {
    color:#8C8C8C;
}
</style>
