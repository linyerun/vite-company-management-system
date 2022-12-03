<template>
  <div class="container">
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
  <el-dialog v-model="formVisible" title="修改客户信息">
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
import {ref, onBeforeMount} from 'vue'
import {getClients, updateClient} from '../../../api/client'
import {errorInfo} from '../../../api/message'

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
const updateClientInfo = () => {

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

}

onBeforeMount(()=>{
  getClientsInfo(()=>{})
})

</script>

<style scoped>
.container {
  width: 100%;
}
</style>
