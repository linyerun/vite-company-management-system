<template>
  <div class="container">
    <div class="table">
      <el-table :data="infoList" style="width: 100%">
        <el-table-column label="创建时间">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon>
                <Timer/>
              </el-icon>
              <span style="margin-left: 10px">
                {{ scope.row.createdAt }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货数量">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon>
                <View/>
              </el-icon>
              <span style="margin-left: 10px">
                {{ scope.row.goodsCount }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showForm(row.id, row.contractId, row.goodsId)">填写
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Timer, View } from '@element-plus/icons-vue'
import { ref, onBeforeMount } from 'vue'
import { getOrderList } from '../../api/purchase_order'
import {errorInfo} from "../../api/message";

interface IListData {
  id: number
  createdAt: string
  updatedAt: string
  goodsId: number
  goodsCount: number
  state: number
}

const infoList = ref<IListData[]>([])

// 获取后端数据
const getInfoList = (f: Function) => {
  getOrderList().then(res => {
    if (res.code !== 200) {
      return
    }
    infoList.value = res.data as IListData[]
    f()
  }).catch(err => {
    errorInfo('请求出现异常')
    console.log(err)
  })
}

onBeforeMount(()=>{
  getInfoList(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
