<template>
  <div class="container">
    <div class="time">
      <el-date-picker v-model="startTime" type="date" placeholder="开始时间" value-format="YYYY-MM-DD"/>
      <el-date-picker v-model="endTime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"/>
      <el-button type="primary" @click="searchSum">查询</el-button>
    </div>
    <div class="money">
      <h1 v-if="hiddenSum">公司这段时间的销售总额: ￥{{ Sum }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCompanySumByTime } from '../../../api/contract'
import { ref } from 'vue'
import { errorInfo } from '../../../api/message'

const startTime = ref<string>('')
const endTime = ref<string>('')
const hiddenSum = ref<boolean>(false)
const Sum = ref<number>(0)

const searchSum = () => {
  getCompanySumByTime(startTime.value, endTime.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    hiddenSum.value = true
    Sum.value = (res.data as {sum: number}).sum
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
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
