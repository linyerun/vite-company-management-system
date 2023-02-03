<template>
  <div class="container">
    <div style="width: 500px; margin: 0 auto">
      <el-form :model="purchaseOrderInfo">
        <el-form-item label="货物名称" :label-width="'250'">
          <el-select v-model="purchaseOrderInfo.goodsId" >
            <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="购买数量" :label-width="'250'">
          <el-input v-model="purchaseOrderInfo.goodsCount" type="number" min="1" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否提交" :label-width="'250px'">
          <el-button type="danger" size="default" @click="postPurchaseOrderForm">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IPurchaseOrderInfo, postPurchaseOrder } from '../../../api/purchase_order'
import { IGoods, getAllGoods } from '../../../api/goods'
import { ref, onBeforeMount } from 'vue'
import {errorInfo, successInfo} from "../../../api/message";

const purchaseOrderInfo = ref<IPurchaseOrderInfo>({
  goodsCount: 0,
  goodsId: 0,
})
const goodsList = ref<IGoods[]>([])

// 获取所有货物信息
function getAllGoodsInfo(f: Function) {
  getAllGoods().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    goodsList.value = res.data as IGoods[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}

// 提交表单
function postPurchaseOrderForm() {
  if (purchaseOrderInfo.value.goodsCount === 0) {
    errorInfo('货物数量不能为0')
    return
  }
  postPurchaseOrder(purchaseOrderInfo.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    purchaseOrderInfo.value = {
      goodsCount: 0,
      goodsId: 0,
    }
    successInfo(res.msg)
  }).catch(err => {
    errorInfo(err)
  })
}

onBeforeMount(()=>{
  getAllGoodsInfo(()=>{
    if (goodsList.value.length === 0) {
      errorInfo('仓库无货')
      return
    }else {
      purchaseOrderInfo.value.goodsId = goodsList.value[0].id
    }
  })
})

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
