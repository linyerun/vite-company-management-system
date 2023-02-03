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
      <div style="display: flex;justify-content: space-between;">
        <el-form-item label="客户姓名" :label-width="'200px'">
          <el-select v-model="contract.clientId" >
            <el-option v-for="item in clientList" :key="item.id" :label="item.clientName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-button size="small" type="danger" @click="changeClient">修改客户姓名</el-button>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <el-form-item label="销售员工" :label-width="'200px'">
          <el-select v-model="contract.userId">
            <el-option v-for="item in employeeList" :key="item.id" :label="item.employeeName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-button size="small" type="danger" @click="changeEmployee">修改员工姓名</el-button>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <el-form-item label="合同照片" :label-width="'200px'">
          <el-upload
              class="avatar-uploader"
              :action=" baseURL+'/pic/upload' "
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img style="width: 400px" v-if="contract.contractPic" :src="contract.contractPic" class="avatar"  alt=""/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-button size="small" type="danger" @click="changePicture">修改合同图片</el-button>
      </div>
      <div>
        <el-table :data="goodsData" style="width: 100%" max-height="250">
          <el-table-column prop="goodId" label="货物ID" />
          <el-table-column prop="goodsName" label="货物名称"  />
          <el-table-column prop="purchasingCount" label="货物数量" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="mt-4" style="width: 100%" @click="onAddItem">添加货物</el-button>
      </div>
    </el-form>
  </el-dialog>
  <!--新增商品的-->
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
  <!--展示图片放大-->
  <el-dialog v-model="picVisible" title="合同图片">
    <!--这样使用style来设置宽就可以撑满这个el-dialog了-->
    <img :src="picture" :alt="'合同图片'" style="width: 100%">
  </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getAllContract, IContract, updateClient, updateEmployee, updatePicture } from '../../../api/contract'
import { errorInfo, successInfo } from '../../../api/message'
import { getEmployeeById, getEmployees, IEmployee } from '../../../api/employee'
import { getAllClients, getClientById, IClient } from '../../../api/client'
import { baseURL } from '../../../api/oss'
import { UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getPurchasingGoodsListByContractId, deletePGListByCtsId, postPGByContractId, IPurchasingGoods } from '../../../api/purchasing_goods'
import { getAllGoods, IGoods } from '../../../api/goods'

// 接口
interface IData {
  url: string
}
interface IRes {
  code: number
  msg: string
  data: IData
}
interface IGoodsMsg {
  goodsId: number
  goodsName: string
  purchasingCount: number
}


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
const goodsData = ref<IPurchasingGoods[]>([])
const goodsMsgVisible = ref<boolean>(false)
const goodsMsg = ref<IGoodsMsg>({
  goodsId: 0,
  goodsName: '',
  purchasingCount: 1,
})
const goodsList = ref<IGoods[]>([])

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
  getPurchasingGoodsListByContractId(c.id).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    goodsData.value = res.data as IPurchasingGoods[]
  }).catch(err => {
    errorInfo(err)
  })
  updateVisible.value = true
}
function showBigImg(img: string) {
  picture.value = img
  picVisible.value = true
}

// 修改操作
function changeClient() {
  updateClient(contract.value.clientId, contract.value.id).then(res => {
    if (res.code != 200) {
      errorInfo(res.msg)
      return
    }
    // 修改列表中contract值
    for (let i = 0; i < contractList.value.length; i++) {
      if (contractList.value[i].id == contract.value.id) {
        contractList.value[i].clientId = contract.value.clientId
        break
      }
    }
    successInfo(res.msg)
  }).catch(err => {
    errorInfo(err)
  })
}
function changeEmployee() {
  updateEmployee(contract.value.userId, contract.value.id).then(res => {
    if (res.code != 200) {
      errorInfo(res.msg)
      return
    }
    // 修改列表中contract值
    for (let i = 0; i < contractList.value.length; i++) {
      if (contractList.value[i].id == contract.value.id) {
        contractList.value[i].userId = contract.value.userId
        break
      }
    }
    successInfo(res.msg)
  }).catch(err => {
    errorInfo(err)
  })
}
function changePicture() {
  updatePicture(contract.value.id, contract.value.contractPic).then(res => {
    if (res.code != 200) {
      errorInfo(res.msg)
      return
    }
    // 修改列表中contract值
    for (let i = 0; i < contractList.value.length; i++) {
      if (contractList.value[i].id == contract.value.id) {
        contractList.value[i].contractPic = contract.value.contractPic
        break
      }
    }
    successInfo(res.msg)
  }).catch(err => {
    errorInfo(err)
  })
}

// 生命周期函数
onBeforeMount(()=>{
  getContractList(()=>{})
  getClientList(()=>{})
  getEmployeeList(()=>{})
})

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
// 修改客户商品订单相关
const deleteRow = (index: number) => {
  // 要删除两处才行
  // 1. 从数据库删除这个订单
  deletePGListByCtsId(contract.value.id, goodsData.value[index].purchasingGoodsId).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    // 2. 从当前列表删除订单
    goodsData.value.splice(index, 1)
    successInfo(res.msg)
  }).catch(err => {
    errorInfo(err)
  })

}
// 新增客户购买的商品
const onAddItem = () => {
  getAllGoodsInfo(()=>{
    if (goodsList.value.length !== 0) {
      goodsMsg.value.goodsId = goodsList.value[0].id //默认选中第一个
    }
    // 开启弹窗
    goodsMsgVisible.value = true
  })
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
    if (goodsData.value[i].goodId === g.goodsId) {
      errorInfo('重复选择了当前货品')
      return
    }
  }

  postPGByContractId(contract.value.id,g.goodsId, g.purchasingCount).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    // 提交成功之后，直接更新列表
    // 重新获取列表数据
    getPurchasingGoodsListByContractId(contract.value.id).then(res => {
      if (res.code !== 200) {
        errorInfo(res.msg)
        return
      }
      goodsData.value = res.data as IPurchasingGoods[]
    }).catch(err => {
      errorInfo(err)
    })
    goodsMsgVisible.value = false // 关闭弹窗
  }).catch(err => {
    errorInfo(err)
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
