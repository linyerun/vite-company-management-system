<template>
  <div class="container">
    <h1 style="text-align: center; margin-top: 10px; margin-bottom: 10px; font-size: large">采购清单待发货列表</h1>
    <el-table :data="purchasingLists" height="590px" border style="width: 100%">
      <el-table-column prop="id" label="采购清单ID" />
      <el-table-column prop="createdAt" label="创建时间" width="220px" />
      <el-table-column prop="address" label="发货地址" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="showDispatchBills(scope.row, scope.$index)">查看清单货物</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--清单货物弹窗-->
  <el-dialog v-model="dispatchBillsVisible" title="待商品信息表">
    <el-table :data="purchasingGoodsLists" style="width: 100%" max-height="250">
      <el-table-column prop="goodId" label="货物ID" />
      <el-table-column prop="goodsName" label="货物名称"  />
      <el-table-column prop="purchasingCount" label="发货数量" />
      <el-table-column prop="unitPrice" label="货物单价" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="generateDispatchBillOnClick(scope.row, scope.$index)">生成发货单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { IPurchasingList, getPurchasingLists } from '../../../api/purchasing_list'
import { errorInfo, successInfo } from '../../../api/message'
import { IPurchasingGoods, getPurchasingGoodsListByContractId } from '../../../api/purchasing_goods'
import { generateDispatchBill } from '../../../api/dispatch_bill'

const purchasingLists = ref<IPurchasingList[]>([])
const purchasingGoodsLists = ref<IPurchasingGoods[]>([])
const dispatchBillsVisible = ref<boolean>(false)
const contractId = ref<number>(0)
const purchasingListIdx = ref<number>(0)

onBeforeMount(()=>{
  getPurchasingListsData(()=>{})
})

// 获取采购清单列表
function getPurchasingListsData(f: Function) {
  getPurchasingLists().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    purchasingLists.value = res.data as IPurchasingList[] //将数据给到purchasingLists
    f()
  }).catch(err => {
    errorInfo(err)
  })
}
// 获取PurchasingListByContractId
function getPurchasingGoodsListsDataByContractId(contractId: number, f: Function) {
  getPurchasingGoodsListByContractId(contractId).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    purchasingGoodsLists.value = res.data as IPurchasingGoods[] // 传递数据
    f()
  }).catch(err => {
    errorInfo(err)
  })
}

// 展示弹窗
function showDispatchBills(purchasingList: IPurchasingList, index: number) {
  getPurchasingGoodsListsDataByContractId(purchasingList.contractId, ()=>{
    contractId.value = purchasingList.contractId
    purchasingListIdx.value = index
    dispatchBillsVisible.value = true
  })
}

// 生成发货单
function generateDispatchBillOnClick(purchasingGoods: IPurchasingGoods, index: number) {
  generateDispatchBill({
    contractId: contractId.value,
    goodsCount: purchasingGoods.purchasingCount,
    goodsId: purchasingGoods.goodId,
    purchasingGoodsId: purchasingGoods.purchasingGoodsId,
  }).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    purchasingGoodsLists.value.splice(index, 1)  // 生成成功了就移除这个数据
    if (purchasingGoodsLists.value.length === 0) {
      // 去掉清单列表上的玩意
      purchasingLists.value.splice(purchasingListIdx.value, 1)
    }
    successInfo(res.msg) // 操作成功
  }).catch(err => {
    errorInfo(err)
  })
}

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
