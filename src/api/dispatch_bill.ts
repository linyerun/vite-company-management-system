import request from "../utils/request";

interface IPostData {
  clientEmail: string
  courierNumber: string
}

export interface IDispatchBillInfo {
  contractId: number
  goodsCount: number
  goodsId: number
  purchasingGoodsId: number
}

export function getIngDispatchBill() {
  return request({
    url: '/dispatchBill/get',
    method: 'get'
  })
}

export function postCourierNumber(dispatchBillId: number, postData: IPostData) {
  return request({
    url: `/dispatchBill/postCourierNumber/${dispatchBillId}`,
    method: 'post',
    data: postData
  })
}

export function generateDispatchBill(dispatchBillInfo: IDispatchBillInfo) {
  return request({
    url: `/dispatchBill/post`,
    method: 'post',
    data: dispatchBillInfo
  })
}
