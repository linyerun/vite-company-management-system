import request from '../utils/request'

interface IDataInfo {
  purchaseOrderId: number
  unitPrice: number
  commentInfo: string
}

export interface IPurchaseOrderInfo {
  goodsCount: number
  goodsId: number
}

export function getOrderList() {
  return request({
    url: '/purchaseOrder/get',
    method: 'get'
  })
}

export function updateState(goodsId: number, goodsCount: number, purchaseOrderInfoData: IDataInfo) {
  return request({
    url: `/purchaseOrder/update/${goodsId}/${goodsCount}`,
    method: 'put',
    data: purchaseOrderInfoData
  })
}

export function postPurchaseOrder(purchaseOrder: IPurchaseOrderInfo) {
  return request({
    url: `/purchaseOrder/post`,
    method: 'post',
    data: purchaseOrder,
  })
}
