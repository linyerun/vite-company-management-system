import request from '../utils/request'

export function getGoodsInfoById(goodId: number) {
  return request({
    url: `/goods/get/${goodId}`,
    method: 'get'
  })
}

export interface IGoods {
  id: number
  goodsName: string
  goodsCount: number
  unitPrice: number
}

export function getAllGoods() {
  return request({
    url: '/goods/getAll',
    method: 'get'
  })
}

export function getGoodsSumById(goodsId: number) {
  return request({
    url: `/goods/getSum/${goodsId}`,
    method: 'get'
  })
}
