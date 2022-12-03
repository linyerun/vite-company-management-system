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
        <el-table-column label="进货数量">
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
        <el-table-column label="查看物品信息">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="showGoodsInfo(row.goodsId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showForm(row.goodsId, row.goodsCount, row.id)">填写
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!--货物信息弹窗-->
  <el-dialog v-model="visibleGoodsInfo" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">货物信息</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled/>
          </el-icon>
          关闭
        </el-button>
      </div>
    </template>
    <!--  显示货物信息  -->
    <div>
      <h5>货物名称: {{ goodsInfo.goodsName }}</h5>
      <h5>库存数量: {{ goodsInfo.goodsCount }}</h5>
      <h5>货物单价: {{ goodsInfo.unitPrice }}</h5>
    </div>
  </el-dialog>
  <!--表单填写-->
  <el-dialog v-model="formVisible" title="填写快递单号">
    <el-form :model="dataInfo">
      <el-form-item label=货物单价 :label-width="'140px'">
        <el-input v-model="dataInfo.unitPrice" autocomplete="off"/>
      </el-form-item>
      <el-form-item label=货物备注 :label-width="'140px'">
        <el-input v-model="dataInfo.commentInfo" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Timer, View, CircleCloseFilled } from '@element-plus/icons-vue'
import { ref, onBeforeMount } from 'vue'
import { getOrderList, updateState } from '../../api/purchase_order'
import {errorInfo, successInfo} from '../../api/message'
import { getGoodsInfoById } from '../../api/goods'

interface IListData {
  id: number
  createdAt: string
  updatedAt: string
  goodsId: number
  goodsCount: number
  state: number
}
interface IGoodsInfo {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
  goodsName: string
  goodsCount: number
  unitPrice: number
}
interface IDataInfo {
  purchaseOrderId: number
  unitPrice: number
  commentInfo: string
}

const infoList = ref<IListData[]>([])
const goodsInfo = ref<IGoodsInfo>({
  id: 0,
  createdAt: '',
  updatedAt: '',
  goodsName: '',
  goodsCount: 0,
  unitPrice: 0,
})
const dataInfo = ref<IDataInfo>({
  purchaseOrderId: -1,
  unitPrice: -1,
  commentInfo: ''
})
const visibleGoodsInfo = ref<boolean>(false)
const formVisible = ref<boolean>(false)

let goodsId: number
let goodsCount: number

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
const getGoodsInfo = (goodsId: number, f: Function) => {
  getGoodsInfoById(goodsId).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    goodsInfo.value = res.data as IGoodsInfo
    f()
  }).catch(err => {
    console.log(err)
    errorInfo('请求出错了')
  })
}
const updateOrder = (goodsId: number, goodsCount: number, f: Function) => {
  updateState(goodsId, goodsCount, dataInfo.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    console.log(err)
    errorInfo('请求发送失败')
  })
}
// 展示数据
const showGoodsInfo = (goodsId: number) => {
  getGoodsInfo(goodsId, ()=>visibleGoodsInfo.value = true)
}
const showForm = (goodsIdVar: number, goodsCountVar: number, purchaseOrderId: number) => {
  goodsId = goodsIdVar
  goodsCount = goodsCountVar
  dataInfo.value.purchaseOrderId = purchaseOrderId
  formVisible.value = true
}
const cancel = () => {
  reset()
  formVisible.value = false
}
const sure = () => {
  updateOrder(goodsId, goodsCount,
      ()=>getInfoList(()=> {
        reset()
        formVisible.value = false
      }))
}
const reset = () => {
  goodsId = 0
  goodsCount = 0
  dataInfo.value = {
    purchaseOrderId: -1,
    unitPrice: -1,
    commentInfo: ''
  }
}

// 周期函数
onBeforeMount(()=>{
  getInfoList(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
.table {
  width: 100%;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
