<template>
  <div class="container">
    <el-table :data="GoodsList" border style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="goodsName" label="货物名称" />
      <el-table-column prop="goodsCount" label="货物库存" />
      <el-table-column prop="unitPrice" label="货物单价" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="showGoodsSum(row.id)">商品销售额</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="goodsSumVisible">
    <h1>该商品销售额：￥{{goodsSum}}</h1>
  </el-dialog>
</template>

<script setup lang="ts">
import { getAllGoods, getGoodsSumById, IGoods } from '../../../api/goods'
import { errorInfo } from '../../../api/message'
import { ref, onBeforeMount } from 'vue'

const GoodsList = ref<IGoods[]>([])
const goodsSumVisible = ref<boolean>(false)
const goodsSum = ref<number>(0)

// 后端接口
function getAllGoodsInfo(f: Function) {
  getAllGoods().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    GoodsList.value = res.data as IGoods[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
function getGoodsSumInfoById(id: number, f: Function) {
  getGoodsSumById(id).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    goodsSum.value = (res.data as {sum: number}).sum
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
// 数据展示
function showGoodsSum(goodsId: number) {
  getGoodsSumInfoById(goodsId, ()=>{
    goodsSumVisible.value = true
  })
}

// 生命周期函数
onBeforeMount(()=>{
  getAllGoodsInfo(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
