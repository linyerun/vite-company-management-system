<template>
  <div class="container">
    <el-button @click="this.$router.push('/admin/contract')" type="info" class="bnt02">返回</el-button>
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
      <el-form-item label="合同照片" :label-width="'200px'">
        <el-upload
            class="avatar-uploader"
            :action=" baseURL+'/pic/upload' "
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="contract.contractPic" :src="contract.contractPic" class="avatar"  alt=""/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table :data="goodsData" style="width: 100%" max-height="250">
      <el-table-column prop="goodsId" label="货物ID" />
      <el-table-column prop="goodsName" label="货物名称"  />
      <el-table-column prop="purchasingCount" label="货物数量" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="mt-4" style="width: 100%" @click="onAddItem">添加货物</el-button>
    <el-button @click="uploadContractMsg" type="danger" class="bnt01">提交合同</el-button>
  </div>
  <el-dialog v-model="goodsMsgVisible" title="商品信息表">
    <el-form :model="goodsMsg">
      <el-form-item label="货物名称" :label-width="'250'">
        <el-select v-model="goodsMsg.goodsId" >
          <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="购买数量" :label-width="'250'">
        <el-input v-model="goodsMsg.purchasingCount" type="number" min="1" autocomplete="off" />
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
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps} from 'element-plus'
import { getAllClients, IClient } from '../../../api/client'
import { IEmployee, getEmployees} from '../../../api/employee'
import {IContractData, postContract} from '../../../api/contract'
import { getAllGoods, IGoods } from '../../../api/goods'
import { onBeforeMount, ref } from 'vue'
import {errorInfo, successInfo} from '../../../api/message'
import { baseURL } from '../../../api/oss'

// 接口
interface IRes {
  code: number
  msg: string
  data: IData
}
interface IData {
  url: string
}
interface IGoodsMsg {
  goodsId: number
  goodsName: string
  purchasingCount: number
}

// 变量
const goodsList = ref<IGoods[]>([])
const goodsData = ref<IGoodsMsg[]>([])
const goodsMsg = ref<IGoodsMsg>({
  goodsId: 0,
  goodsName: '',
  purchasingCount: 1
})
const goodsMsgVisible = ref<boolean>(false)
const clientList = ref<IClient[]>([])
const employeeList = ref<IEmployee[]>([])
const contract = ref<IContractData>({
  clientId: 0,
  userId: 0,

  contractPic: "",
  goodsInfos: [],
  totalAmount: 0,
})

// 获取数据
// 获取客户信息列表
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
// 获取员工信息列表
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

// 图片上传相关
const handleAvatarSuccess = (response: any) => {
  contract.value.contractPic = (response as IRes).data.url
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    errorInfo('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    errorInfo('Avatar picture size can not exceed 10MB!')
    return false
  }
  return true
}

// 新增货物相关
const deleteRow = (index: number) => {
  // 要删除两处才行
  goodsData.value.splice(index, 1)
  contract.value.goodsInfos.splice(index, 1)
}
const onAddItem = () => {
  if (goodsList.value.length !== 0) {
    goodsMsg.value.goodsId = goodsList.value[0].id //默认选中第一个
  }
  // 开启弹窗
  goodsMsgVisible.value = true
}

// 对话框确认与取消
function cancel() {
  goodsMsg.value.goodsId = 0
  goodsMsg.value.goodsName = ''
  goodsMsg.value.purchasingCount = 0
  goodsMsgVisible.value = false
}
function sure() {
  //校验是否可以添加
  const g = goodsMsg.value
  if (g.goodsId === 0 || g.purchasingCount <= 0) {
    errorInfo('你尚未完成货物信息或填写信息有误, 不可以提交')
    return
  }
  const n = goodsData.value.length //数组长度
  for (let i = 0; i < n; i++) { //遍历数组
    if (goodsData.value[i].goodsId === g.goodsId) {
      errorInfo('重复选择了当前货品')
      return
    }
  }
  // 给货物写上名字
  for (let i = 0; i < goodsList.value.length; i++) {
    if (goodsMsg.value.goodsId === goodsList.value[i].id) {
      goodsMsg.value.goodsName = goodsList.value[i].goodsName
      break
    }
  }
  goodsData.value.push({
    goodsId: goodsMsg.value.goodsId,
    goodsName: goodsMsg.value.goodsName,
    purchasingCount: goodsMsg.value.purchasingCount
  })
  contract.value.goodsInfos.push({
    goodsId: goodsMsg.value.goodsId,
    purchasingCount: goodsMsg.value.purchasingCount
  })
  goodsMsgVisible.value = false // 关闭弹窗
}

// 提交合同
function uploadContractMsg() {
  //校验contract
  const c = contract.value
  if (c.contractPic === '' ||
      c.goodsInfos.length === 0 ||
      c.userId === 0 ||
      c.clientId === 0) {
    errorInfo('您还有信息尚未填写，提交失败!')
    return
  }
  //计算总金额
  for (let i = 0; i < c.goodsInfos.length; i++) {
    const g = c.goodsInfos[i]
    for (let j = 0; j < goodsList.value.length; j++) {
      if (g.goodsId === goodsList.value[j].id) {
        contract.value.totalAmount += goodsList.value[j].unitPrice*g.purchasingCount
        break
      }
    }
  }
  //提交
  postContract(contract.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    //清除数据
    goodsData.value = []
    contract.value = {
      clientId: contract.value.clientId,
      userId: contract.value.userId,

      contractPic: "",
      goodsInfos: [],
      totalAmount: 0,
    }
    goodsMsg.value = {
      goodsId: 0,
      goodsName: '',
      purchasingCount: 1
    }
  }).catch(err => {
    errorInfo(err)
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
  // 获取货物信息
  getAllGoodsInfo(()=>{
    if (goodsList.value.length === 0) {
      errorInfo('仓库无货')
      return
    }
  })
})

</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.bnt01 {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%);
}
.bnt02 {
  position: absolute;
  left: 5px;
  top: 5px;
}
</style>

<style>
.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader /*.el-upload:hover*/ {
  border-color: var(--el-color-primary);
}

/*.el-icon.avatar-uploader-icon {*/
/*  font-size: 28px;*/
/*  color: #8c939d;*/
/*  width: 178px;*/
/*  height: 178px;*/
/*  text-align: center;*/
/*}*/
</style>
