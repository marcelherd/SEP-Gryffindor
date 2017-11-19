<template>
  <bt-page-container pageTitle="Login">
    <bt-login-form />
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import LoginForm from '@/components/login/LoginForm'

export default {
  name: 'login',
  components: {
    'bt-page-container': PageContainer,
    'bt-login-form': LoginForm
  }
}
</script>

<style>

</style>
