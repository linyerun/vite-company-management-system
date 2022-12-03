<template>
  <div class="container">
    <div class="btn">
      <el-button @click="getAll" type="primary">全部</el-button>
      <el-button @click="getIng" type="warning">进行</el-button>
      <el-button @click="getEnd" type="success">完成</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="contractId" label="合同ID"/>
        <el-table-column prop="contractState" label="合同状态"/>
        <el-table-column prop="msg" label="信息"/>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, onBeforeMount} from 'vue'
import {getContractsState} from '../../api/contract'
import {errorInfo} from "../../api/message";

interface IContractState {
  contractId: number
  contractState: number
  msg: string
}

interface IContractData {
  contractId: number
  contractState: string
  msg: string
}

const contractStates = ref<IContractState[]>([])
const tableData = ref<IContractData[]>([])

// 创造新的合同状态
const dealTableData = (contractStates: IContractState[]) => {
  tableData.value = [] //去除之前的数据
  for (let i = 0; i < contractStates.length; i++) {
    const state = contractStates[i].contractState
    tableData.value.push({
      contractId: contractStates[i].contractId,
      contractState: state === 0 ? '待支付' : (state === 1 ? '正在发货' : '交易结束'),
      msg: contractStates[i].msg
    })
  }
}
// 将满足要求的原始合同状态返回
const dealContractStates = (states: number[]) => {
  return contractStates.value.filter((curVal, idx, arr) => {
    for (let i = 0; i < states.length; i++)
      if (curVal.contractState === states[i]) return true
    return false
  })
}
// 从后端获取数据
const getData = (f: Function) => {
  getContractsState().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    contractStates.value = res.data as IContractState[]
    f() // 执行函数
    console.log(res.data)
  }).catch(err => {
    errorInfo('请求出现异常')
    console.log(err)
  })
}

// 为什么一定要在then里面才行呢？放出来就在执行onBeforeMount出现问题
const getAll = () => getData(() => dealTableData(contractStates.value))
const getIng = () => getData(() => dealTableData(dealContractStates([0, 1])))
const getEnd = () => getData(() => dealTableData(dealContractStates([2])))

onBeforeMount(() => {
  getAll()
})

</script>

<style scoped>
.container, .btn, .table {
  width: 100%;
}

.btn {
  display: flex;
  justify-content: space-around;

  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
