<template>
    <!-- default-openeds：默认展开子栏。default-active：默认高亮 -->
    <el-menu :default-openeds="['1']" :default-active="path" router style="width:200px; height: calc(100vh - 50px);"
        class="el-menu-vertical-demo">
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <Operation />
                </el-icon>
                <span>信息管理</span>
            </template>
            <el-menu-item index="/customer">客户管理</el-menu-item>
            <el-menu-item index="/salesperson">销售人员管理</el-menu-item>
            <el-menu-item index="/contract">合同管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <IconMenu />
                </el-icon>
                <span>进发货管理</span>
            </template>
            <el-menu-item index="/handleOrder">进发货处理</el-menu-item>
            <el-menu-item index="/inOrder">进货单</el-menu-item>
            <el-menu-item index="/outOrder">发货单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>
                <el-icon>
                    <Document />
                </el-icon>
                <span>销售统计</span>
            </template>
            <el-menu-item index="/totalSales">销售总额</el-menu-item>
            <el-menu-item index="/customerSales">客户销售额</el-menu-item>
            <el-menu-item index="/commoditySales">商品销售额</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>
  
<script setup lang="ts">
import { Menu as IconMenu, Document, Operation } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

const path = ref<string>(route.path)

</script>