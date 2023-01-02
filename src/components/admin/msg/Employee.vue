<template>
  <div class="container">
    <div class="d1">
      <el-button type="success" @click="showInsertForm">新增</el-button>
      <el-button type="success" @click="showSearchForm">搜索</el-button>
    </div>
    <el-table :data="employeeList" border style="width: 100%">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="employeeName" label="员工姓名"/>
      <el-table-column prop="username" label="员工账号"/>
      <el-table-column prop="phoneNumber" label="电话号码"/>
      <el-table-column prop="email" label="电子邮件"/>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="showUpdateForm(row)" type="primary">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--修改员工信息-->
  <el-dialog v-model="updateFormVisible" title="修改员工信息">
    <el-form :model="employeeUpdateData">
      <el-form-item label="员工姓名" :label-width="'140px'">
        <el-input v-model="employeeUpdateData.employeeName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input v-model="employeeUpdateData.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input v-model="employeeUpdateData.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="员工账号" :label-width="'140px'">
        <el-input placeholder="长度不低于6" v-model="employeeUpdateData.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="员工密码" :label-width="'140px'">
        <el-input placeholder="长度不低于6" v-model="employeeUpdateData.password" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelUpdate">取消</el-button>
        <el-button type="primary" @click="sureUpdate">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增员工信息-->
  <el-dialog v-model="insertFormVisible" title="新增员工信息">
    <el-form :model="employeeData">
      <el-form-item label="员工姓名" :label-width="'140px'">
        <el-input placeholder="请输入员工姓名" v-model="employeeData.employeeName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="'140px'">
        <el-input placeholder="请输入电话号码" v-model="employeeData.phoneNumber" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="电子邮件" :label-width="'140px'">
        <el-input placeholder="请输入电子邮件" v-model="employeeData.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="员工账号" :label-width="'140px'">
        <el-input placeholder="长度不低于6" v-model="employeeData.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="员工密码" :label-width="'140px'">
        <el-input placeholder="长度不低于6" v-model="employeeData.password" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelInsert">取消</el-button>
        <el-button type="primary" @click="sureInsert">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!--搜索员工信息-->
  <el-dialog v-model="searchFormVisible" title="搜索员工信息">
    <el-form :model="employeeSearchData">
      <el-form-item label="员工姓名" :label-width="'140px'">
        <el-input placeholder="请输入员工姓名(支持模糊查询)" v-model="employeeSearchData.employeeName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSearch">取消</el-button>
        <el-button type="primary" @click="sureSearch">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {getEmployees, postEmployee, updateEmployee, IEmployeeData, IEmployeeUpdateData, IEmployee} from '../../../api/employee'
import {errorInfo, successInfo} from '../../../api/message'
import {ref, onBeforeMount} from 'vue'

// 员工列表
const employeeList = ref<IEmployee[]>([])
// 员工新增
const employeeData = ref<IEmployeeData>({
  "email": "",
  "employeeName": "",
  "password": "",
  "phoneNumber": "",
  "username": ""
})
// 员工更新
const employeeUpdateData = ref<IEmployeeUpdateData>({
  "email": "",
  "employeeName": "",
  "id": 0,
  "password": "",
  "phoneNumber": "",
  "username": ""
})
// 员工搜索
const employeeSearchData = ref<{employeeName: string}>({
  employeeName: ''
})
// 弹出更新页面
const updateFormVisible = ref<boolean>(false)
const insertFormVisible = ref<boolean>(false)
const searchFormVisible = ref<boolean>(false)

// 后端接口封装
const getEmployeeByName = (f: Function, name?: string) => {
  getEmployees(name).then(res => {
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
const postEmployeeData = (f: Function) => {
  postEmployee(employeeData.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    errorInfo('请求发送失败')
    console.log(err)
  })
}
const updateEmployeeData = (f: Function) => {
  updateEmployee(employeeUpdateData.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    successInfo(res.msg)
    f()
  }).catch(err => {
    errorInfo('发送请求失败')
    console.log(err)
  })
}
// 展示逻辑封装
//  ==> 修改
const showUpdateForm = (employee: IEmployee) => {
  employeeUpdateData.value = {
    id: employee.id,
    employeeName: employee.employeeName,
    username: employee.username,
    password: '',
    email: employee.email,
    phoneNumber: employee.phoneNumber
  }
  updateFormVisible.value = true
}
// 确认/取消
const cancelUpdate = () => {
  // 恢复初始化
  employeeUpdateData.value = {
    "email": "",
    "employeeName": "",
    "id": 0,
    "password": "",
    "phoneNumber": "",
    "username": ""
  }
  updateFormVisible.value = false
}
const sureUpdate = () => {
  // cancelUpdate 是把数据初始化回去
  updateEmployeeData(()=>{cancelUpdate()})
}
//  ==> 新增
const showInsertForm = () => {
  employeeData.value = {
    "email": "",
    "employeeName": "",
    "password": "",
    "phoneNumber": "",
    "username": ""
  }
  insertFormVisible.value = true
}
// 确认/取消
const cancelInsert = () => {
  employeeData.value = {
    "email": "",
    "employeeName": "",
    "password": "",
    "phoneNumber": "",
    "username": ""
  }
  insertFormVisible.value = false
}
const sureInsert = () => {
  postEmployeeData(()=>{
    getEmployeeByName(() => {
      cancelInsert()
    })
  })
}
// ==> 搜索
const showSearchForm = () => {
  employeeSearchData.value = {
    employeeName: ''
  }
  searchFormVisible.value = true
}
const cancelSearch = () => {
  employeeSearchData.value = {
    employeeName: ''
  }
  searchFormVisible.value = false
}
const sureSearch = () => {
  getEmployeeByName(()=>{
    cancelSearch()
  }, employeeSearchData.value.employeeName)
}


// 生命周期函数
onBeforeMount(() => {
  getEmployeeByName(() => {
  })
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
