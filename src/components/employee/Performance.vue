<template>
  <div class="container">
    <div class="time">
      <el-date-picker v-model="startTime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"/>
      <el-date-picker v-model="endTime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"/>
      <el-button type="primary" @click="searchSum">查询</el-button>
    </div>
    <div class="money">
      <h1 v-if="hiddenSum">您的销售业绩为:   {{sum}}￥</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getEmpSum } from '../../api/contract'
import {errorInfo} from "../../api/error";

const startTime = ref<string>('')
const endTime = ref<string>('')
const sum = ref<number>(0)
const hiddenSum = ref<boolean>(false)

const searchSum = () => {
  getEmpSum(startTime.value, endTime.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    const obj = res.data as {sum: number}
    sum.value = obj.sum
    hiddenSum.value = true
  }).catch(err => {
    console.log(err)
    errorInfo('请求出现异常')
  })
}

</script>

<style scoped>
.container {
  width: 100%;
}

.time {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
}

.money {
  text-align: center;
  margin-top: 100px;
}
</style>
