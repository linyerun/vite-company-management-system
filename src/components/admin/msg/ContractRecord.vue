<template>
  <div class="container">
    <el-form :model="contract">
      <el-form-item label="客户姓名" :label-width="'200px'">
        <el-select v-model="contract.clientId" >
          <el-option v-for="item in clientList" :key="item.id" :label="item.clientName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="销售员工" :label-width="'200px'">
        <el-select v-model="contract.userId">
          <el-option v-for="item in employeeList" :key="item.id" :label="item.employeeName" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { getAllClients, IClient } from '../../../api/client'
import { IEmployee, getEmployees} from '../../../api/employee'
import { IContractData, postContract, IGoodsInfo } from '../../../api/contract'
import {onBeforeMount, ref} from "vue";
import { errorInfo } from "../../../api/message";

const clientList = ref<IClient[]>([])
const employeeList = ref<IEmployee[]>([])
const contract = ref<IContractData>({
  clientId: 0,
  contractPic: "",
  goodsInfos: [],
  totalAmount: 0,
  userId: 0
})

// 获取数据
function getClientList(f: Function) {
  getAllClients().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    clientList.value = res.data as IClient[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
function getEmployeeList(f: Function) {
  getEmployees().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    employeeList.value = res.data as IEmployee[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}

// 生命周期函数
onBeforeMount(()=>{
  // 获取客户和用户信息
  getClientList(()=>{
    if (clientList.value.length === 0) return
    contract.value.clientId = clientList.value[0].id
  })
  getEmployeeList(()=>{
    if (employeeList.value.length === 0) return
    contract.value.userId = employeeList.value[0].id
  })
})

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
