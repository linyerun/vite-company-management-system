<template>
  <Header :userType="'销售管理员'"/>
  <div style="display: flex">
    <Aside/>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Header from '../common/Header.vue'
import Aside from './Aside.vue'
</script>

<style scoped>

</style>
