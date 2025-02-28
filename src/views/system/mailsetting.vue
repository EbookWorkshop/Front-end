<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.smtp']" />
    <div class="wrapper">
      <a-divider orientation="left">默认收件箱</a-divider>
      <kindlemail></kindlemail>
      <a-divider orientation="left">默认发件箱</a-divider>
      <mailsetting></mailsetting>
    </div>
  </div>
</template>

<script lang="ts" setup>
import kindlemail from './components/kindlemail.vue';
import mailsetting from './components/smtpsetting.vue';
</script>
