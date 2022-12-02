import request from "../utils/request";

interface IPostData {
  clientEmail: string
  courierNumber: string
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
