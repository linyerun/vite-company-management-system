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
        <el-table-column label="查看物品信息">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="showGoodsInfo(row.goodsId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="查看客户信息">
          <template #default="{ row }">
            <el-button type="info" size="small" @click="showCliInfo(row.contractId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="填写快递单号">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showForm(row.id, row.contractId, row.goodsId)">填写
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
  <!--客户信息弹窗-->
  <el-dialog v-model="visibleCliInfo" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">客户信息</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled/>
          </el-icon>
          关闭
        </el-button>
      </div>
    </template>
    <!--  显示客户信息  -->
    <div>
      <h5>客户姓名: {{ cliInfo.clientName }}</h5>
      <h5>联系电话: {{ cliInfo.phoneNumber }}</h5>
      <h5>电子邮件: {{ cliInfo.email }}</h5>
      <h5>收货地址: {{ cliInfo.address }}</h5>
    </div>
  </el-dialog>
  <!--快递单号填写弹出-->
  <el-dialog v-model="formVisible" title="填写快递单号">
    <el-form :model="postData">
      <el-form-item label="快递单号" :label-width="'140px'">
        <el-input v-model="postData.courierNumber" autocomplete="off"/>
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
import {ElButton, ElDialog} from 'element-plus'
import {Timer, View, CircleCloseFilled} from '@element-plus/icons-vue'
import {getIngDispatchBill, postCourierNumber} from '../../api/dispatch_bill'
import {getDeliverMsgByContractId} from '../../api/contract'
import {getGoodsInfoById} from '../../api/goods'
import {ref, onBeforeMount} from 'vue'
import {errorInfo, successInfo} from "../../api/message"

interface IPostData {
  clientEmail: string
  courierNumber: string
}

interface IListData {
  id: number,
  createdAt: string,
  updatedAt: string,
  contractId: number,
  goodsId: number,
  goodsCount: number
}

interface IClientInfo {
  address: string,
  email: string,
  clientName: string,
  phoneNumber: string
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

const infoList = ref<IListData[]>([])
const cliInfo = ref<IClientInfo>({
  address: '',
  email: '',
  clientName: '',
  phoneNumber: ''
})
const goodsInfo = ref<IGoodsInfo>({
  id: 0,
  createdAt: '',
  updatedAt: '',
  goodsName: '',
  goodsCount: 0,
  unitPrice: 0,
})
const postData = ref<IPostData>({
  clientEmail: '',
  courierNumber: ''
})
const visibleGoodsInfo = ref<boolean>(false)
const visibleCliInfo = ref<boolean>(false)
const formVisible = ref<boolean>(false)
let dispatchBillId: number
let contractId: number
let goodsId: number

// 后端接口
const getList = (f: Function) => {
  getIngDispatchBill().then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    infoList.value = res.data as IListData[]
    f() //调用函数
  }).catch(err => {
    errorInfo('请求出错了')
    console.log(err)
  })
}
const getClientInfo = (contractId: number, f: Function) => {
  getDeliverMsgByContractId(contractId).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    cliInfo.value = res.data as IClientInfo
    f()
  }).catch(err => {
    errorInfo('请求出错了')
    console.log(err)
  })
}
const postInfo = (dispatchBillId: number, postData: IPostData, f: Function) => {
  console.log(postData)
  postCourierNumber(dispatchBillId, postData).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    errorInfo('请求出现问题了')
    console.log(err)
  })
}
const getGoodsInfo = (goodsId: number) => {
  getGoodsInfoById(goodsId).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    goodsInfo.value = res.data as IGoodsInfo
  }).catch(err => {
    console.log(err)
    errorInfo('请求出错了')
  })
}
// 业务函数
const showGoodsInfo = (goodId: number) => {
  getGoodsInfo(goodId)
  visibleGoodsInfo.value = true
}
const showCliInfo = (contractId: number) => {
  getClientInfo(contractId, ()=>{visibleCliInfo.value = true})
}
const showForm = (dispatchBillIdVar: number, contractIdVar: number, goodsIdVar: number) => {
  dispatchBillId = dispatchBillIdVar
  contractId = contractIdVar
  goodsId = goodsIdVar
  formVisible.value = true
}
const cancel = () => {
  formVisible.value = false
}
const sure = () => {
  // 使用嵌套的方式解决
  getClientInfo(contractId,()=>{
    postData.value.clientEmail = cliInfo.value.email
    postInfo(dispatchBillId, postData.value, ()=>getList(()=>formVisible.value = false))
  })
}

onBeforeMount(() => {
  getList(()=>{})
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
