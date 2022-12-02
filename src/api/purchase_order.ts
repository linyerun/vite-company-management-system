import request from '../utils/request'

export function getOrderList() {
  return request({
    url: '/purchaseOrder/get',
    method: 'get'
  })
}
