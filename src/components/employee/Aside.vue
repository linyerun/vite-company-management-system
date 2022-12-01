<template>
  <el-menu :default-openeds="['1']" :default-active="path" router style="width:200px; height: calc(100vh - 50px);"
           class="el-menu-vertical-demo">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Operation/>
        </el-icon>
        <span>合同执行情况</span>
      </template>
      <el-menu-item index="/emp/contractState">查看状态</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <Document/>
        </el-icon>
        <span>销售业绩情况</span>
      </template>
      <el-menu-item index="/emp/performance">一段时间内</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {Document, Operation} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {ref} from 'vue'

const route = useRoute()

const path = ref<string>(route.path)

</script>
