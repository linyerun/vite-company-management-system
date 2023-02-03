<template>
  <div class="container">
    <div class="middlePlace" style="width: 500px;margin: 0 auto">
      <el-form :model="goodsInfo">
        <el-form-item label="商品名称" :label-width="'200px'">
          <el-input v-model="goodsInfo.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品售价" :label-width="'200px'">
          <el-input v-model="goodsInfo.unitPrice" placeholder="请输入商品售价" />
        </el-form-item>
        <el-form-item label="是否提交" :label-width="'200px'">
          <el-button type="danger" size="default" @click="postGoodsForm">确认提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IGoodsInfo, postGoodsInfo } from '../../../api/goods'
import { ref } from 'vue'
import { errorInfo, successInfo } from '../../../api/message'

const goodsInfo = ref<IGoodsInfo>({
  goodsCount: 0,
  goodsName: '',
  unitPrice: 0
})

function postGoodsForm() {
  if (goodsInfo.value.goodsName.length === 0) {
    errorInfo('商品名称不能为空')
    return
  }
  postGoodsInfo(goodsInfo.value).then(res => {
    if (res.code !== 200) {
      errorInfo(res.msg)
      return
    }
    // 清除表单数据
    goodsInfo.value = {
      goodsCount: 0,
      goodsName: '',
      unitPrice: 0
    }
    successInfo(res.msg)
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
