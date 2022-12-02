<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:250px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <IconMenu/>
        </el-icon>
        <span>进发货管理</span>
      </template>
      <el-menu-item index="/store/out">发货处理</el-menu-item>
      <el-menu-item index="/store/in">进货处理</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {Menu as IconMenu} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

const path = ref<string>(route.path)

</script>
