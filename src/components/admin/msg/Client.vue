<template>
  <div class="container">
    <div class="d1">
      <el-button type="primary" @click="showAddClient">新增</el-button>
      <el-button type="primary" @click="searchFormVisible = true">搜索</el-button>
    </div>
    <el-table :data="clientsInfo" border style="width: 100%">
      <el-table-column prop="id" label="客户ID" />
      <el-table-column prop="clientName" label="客户姓名" />
      <el-table-column prop="phoneNumber" label="电话号码" />
      <el-table-column prop="email" label="电子邮件" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="showUpdateClientForm(row)" type="success">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--表单填写-->
  <el-dialog v-model="formVisible" title="客户信息填写">
    <el-form :model="clientData">
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input placeholder="请输入客户电话号码" v-model="clientData.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input placeholder="请输入客户电子邮件" v-model="clientData.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="客户姓名" :label-width="'140px'">
        <el-input placeholder="请输入客户姓名" v-model="clientData.clientName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--搜索信息填写-->
  <el-dialog v-model="searchFormVisible" title="搜索客户信息">
    <el-form :model="clientData">
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input placeholder="请输入客户电话号码" v-model="clientData.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input placeholder="请输入客户电子邮件" v-model="clientData.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="客户姓名" :label-width="'140px'">
        <el-input placeholder="请输入客户姓名(支持模糊查询)" v-model="clientData.clientName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="searchCancel">取消</el-button>
        <el-button type="primary" @click="showSearchData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onBeforeMount} from 'vue'
import {getClients, updateClient, addClient} from '../../../api/client'
import {errorInfo, successInfo} from '../../../api/message'

interface IClient {
  id: number
  createdAt: string
  updatedAt: string
  phoneNumber: string
  email: string
  clientName: string
}

const clientsInfo = ref<IClient[]>([])
const clientData = ref<IClient>({
  id: 0,
  createdAt: '',
  updatedAt: '',
  phoneNumber: '',
  email: '',
  clientName: ''
})
const formVisible = ref<boolean>(false)
const searchFormVisible = ref<boolean>(false)

// 后台接口封装
const getClientsInfo = (f: Function, phoneNumber?: string, email?: string, clientName?: string) => {
  getClients(phoneNumber, email, clientName).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    clientsInfo.value = res.data as IClient[]
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
const updateClientInfo = (f: Function) => {
  updateClient({
    clientName: clientData.value.clientName,
    email: clientData.value.email,
    phoneNumber: clientData.value.phoneNumber
  }, clientData.value.id).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    errorInfo('请求出现异常')
    console.log(err)
  })
}
const addClientInfo = (f: Function) => {
  addClient({
    clientName: clientData.value.clientName,
    email: clientData.value.email,
    phoneNumber: clientData.value.phoneNumber
  }).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    errorInfo('请求出现异常')
    console.log(err)
  })
}
// 数据展示
const showUpdateClientForm = (cli: IClient) => {
  clientData.value = cli
  formVisible.value = true
}
const cancel = () => {
  clientData.value = {
    id: 0,
    createdAt: '',
    updatedAt: '',
    phoneNumber: '',
    email: '',
    clientName: ''
  }
  formVisible.value = false
}
const sure = () => {
  if (clientData.value.id !== 0) {
    updateClientInfo(()=>{formVisible.value = false})
    return
  }
  // 添加客户，并重新获取客户信息
  addClientInfo(() => {getClientsInfo(()=>{formVisible.value = false})})
}
const showAddClient = () => {
  clientData.value = {
    id: 0,
    createdAt: '',
    updatedAt: '',
    phoneNumber: '',
    email: '',
    clientName: ''
  }
  formVisible.value = true
}
const showSearchData = () => {
  getClientsInfo(
      ()=>{searchFormVisible.value = false},
      clientData.value.phoneNumber,
      clientData.value.email,
      clientData.value.clientName
  )
}
const searchCancel = () => {
  clientData.value = {
    id: 0,
    createdAt: '',
    updatedAt: '',
    phoneNumber: '',
    email: '',
    clientName: ''
  }
  searchFormVisible.value = false
}

onBeforeMount(()=>{
  getClientsInfo(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
.container .d1 {
  display: flex;
  justify-content: space-around;

  margin: 10px 0;
  width: 100%;
}
</style>
