<template>
  <div class="container">
    <div class="btn">
      <el-button type="danger" @click="$router.push('/admin/contractRecord')">合同录入</el-button>
      <el-button type="warning" @click="stateVisible = true">合同查询</el-button>
    </div>
    <el-table :data="contractList" height="590px" border style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="createdAt" label="创建时间" width="220px" />
      <el-table-column prop="totalAmount" label="金额" />
      <el-table-column label="合同图片">
        <template #default="{ row }">
          <el-image @click="showBigImg(row.contractPic)" style="width: 100px; height: 100px" :src="row.contractPic" />
        </template>
      </el-table-column>
      <el-table-column label="合同状态">
        <template #default="{ row }">
          <el-tag v-if="row.contractState === 0" type="danger">尚未付款</el-tag>
          <el-tag v-else-if="row.contractState === 1" type="warning">已经付款</el-tag>
          <el-tag v-else type="success">合同执行完毕</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="信息查看" width="300px">
        <template #default="{row}">
          <el-button @click="showEmpInfo(row.userId)" type="danger" size="default">销售员工信息</el-button>
          <el-button @click="showCliInfo(row.clientId)" type="success" size="default">客户信息</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button @click="showContractUpdate(row)" v-if="row.contractState === 0" type="primary" size="small">修改</el-button>
          <el-tag v-else type="danger">不可修改</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--员工信息展示-->
  <el-dialog v-model="empVisible" title="展示员工信息">
    <el-form :model="empInfo" disabled>
      <el-form-item label="员工姓名" :label-width="'140px'">
        <el-input v-model="empInfo.employeeName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input v-model="empInfo.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input v-model="empInfo.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="员工账号" :label-width="'140px'">
        <el-input placeholder="长度不低于6" v-model="empInfo.username" autocomplete="off"/>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--展示客户信息-->
  <el-dialog v-model="cliVisible" title="客户信息展示">
    <el-form :model="cliInfo" disabled>
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input placeholder="请输入客户电话号码" v-model="cliInfo.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input placeholder="请输入客户电子邮件" v-model="cliInfo.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="客户姓名" :label-width="'140px'">
        <el-input placeholder="请输入客户姓名" v-model="cliInfo.clientName" autocomplete="off"/>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--查询合同-->
  <el-dialog v-model="stateVisible" title="查询合同">
    <el-form-item :model="contractState" label="合同查询条件选项">
      <el-select v-model="contractState" placeholder="请做出你的选择" default-first-option>
        <el-option label="全部合同" :value="{value: -1, label: '全部合同'}" />
        <el-option label="尚未付款" :value="{value: 0, label: '尚未付款'}" />
        <el-option label="已经付款" :value="{value: 1, label: '已经付款'}" />
        <el-option label="合同结束" :value="{value: 2, label: '合同结束'}" />
      </el-select>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="searchContract">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--修改合同-->
  <el-dialog v-model="updateVisible" title="修改合同">
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
      <!--<el-form-item label="合同照片" :label-width="'200px'">-->
      <!--  <el-upload-->
      <!--      class="avatar-uploader"-->
      <!--      :action=" baseURL+'/pic/upload' "-->
      <!--      :show-file-list="false"-->
      <!--      :on-success="handleAvatarSuccess"-->
      <!--      :before-upload="beforeAvatarUpload">-->
      <!--    <img v-if="contract.contractPic" :src="contract.contractPic" class="avatar"  alt=""/>-->
      <!--    <el-icon v-else class="avatar-uploader-icon">-->
      <!--      <Plus />-->
      <!--    </el-icon>-->
      <!--  </el-upload>-->
      <!--</el-form-item>-->
    </el-form>
    <!--<el-table :data="goodsData" style="width: 100%" max-height="250">-->
    <!--  <el-table-column prop="goodsId" label="ID" />-->
    <!--  <el-table-column prop="goodsName" label="货物名称"  />-->
    <!--  <el-table-column prop="purchasingCount" label="货物数量" />-->
    <!--  <el-table-column fixed="right" label="操作" width="120">-->
    <!--    <template #default="scope">-->
    <!--      <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">移除</el-button>-->
    <!--    </template>-->
    <!--  </el-table-column>-->
    <!--</el-table>-->
    <!--<el-button class="mt-4" style="width: 100%" @click="onAddItem">添加货物</el-button>-->
    <!--<el-button @click="uploadContractMsg" type="danger" class="bnt01">提交合同</el-button>-->
  </el-dialog>
  <!--展示图片放大-->
  <el-dialog v-model="picVisible" title="合同图片">
    <!--这样使用style来设置宽就可以撑满这个el-dialog了-->
    <img :src="picture" :alt="'合同图片'" style="width: 100%">
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getAllContract, IContract } from '../../../api/contract'
import { errorInfo, successInfo } from '../../../api/message'
import { getEmployeeById, IEmployee } from '../../../api/employee'
import { getClientById, IClient } from '../../../api/client'

const contractList = ref<IContract[]>([])
const empInfo = ref<IEmployee>({
  id: 0,
  createdAt: "",
  updatedAt: "",
  username: "",
  phoneNumber: "",
  email: "",
  identity: -1,
  employeeName: ""
})
const cliInfo = ref<IClient>({
  id: 0,
  createdAt: "",
  updatedAt: "",
  phoneNumber: "",
  email: "",
  clientName: ""
})
const contractState = ref<{value: number, label: string}>({value: -1, label: '全部合同'})
const cliVisible = ref<boolean>(false)
const empVisible = ref<boolean>(false)
const stateVisible = ref(false)
const updateVisible = ref<boolean>(false)
const contract = ref<IContract>({
  id: 0,
  createdAt: '',
  updatedAt: '',
  clientId: 0,
  userId: 0,
  totalAmount: 0,
  contractPic: '',
  contractState: 0
})
const picture = ref<string>('')
const picVisible = ref<boolean>(false)
const clientList = ref<IClient[]>([])
const employeeList = ref<IEmployee[]>([])

// 获取合同列表
function getContractList(f: Function) {
  getAllContract().then(res => {
    if (res.code !== 200) {
      successInfo(res.msg)
      return
    }
    contractList.value = res.data as IContract[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
// 获取销售员工信息 By ID
function getEmpInfoById(empId: number, f: Function) {
  getEmployeeById(empId).then(res => {
    if (res.code !== 200) {
      successInfo(res.msg)
      return
    }
    empInfo.value = res.data as IEmployee
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
// 获取客户信息    By ID
function getCliInfoById(cliId: number, f: Function) {
  getClientById(cliId).then(res => {
    if (res.code !== 200) {
      successInfo(res.msg)
      return
    }
    cliInfo.value = res.data as IClient
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
// 展示
function showEmpInfo(empId: number) {
  getEmpInfoById(empId, ()=>{
    empVisible.value = true
  })
}
function showCliInfo(cliId: number) {
  getCliInfoById(cliId, ()=>{
    cliVisible.value = true
  })
}
function searchContract() {
  if (contractState.value.value === -1) {
    getContractList(()=>{stateVisible.value = false})
  }else {
    getContractList(()=>{
      contractList.value = contractList.value.filter(val => val.contractState === contractState.value.value)
      stateVisible.value = false
    })
  }
}
function showContractUpdate(c: IContract) {
  contract.value = {
    id: c.id,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    clientId: c.clientId,
    userId: c.userId,
    totalAmount: c.totalAmount,
    contractPic: c.contractPic,
    contractState: c.contractState
  }
  updateVisible.value = true
}
function showBigImg(img: string) {
  picture.value = img
  picVisible.value = true
}

// 生命周期函数
onBeforeMount(()=>{
  getContractList(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
.btn {
  display: flex;
  justify-content: space-around;

  margin: 10px 0;
  width: 100%;
}
</style>
