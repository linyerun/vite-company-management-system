import request from '../utils/request'

export function getGoodsInfoById(goodId: number) {
  return request({
    url: `/goods/get/${goodId}`,
    method: 'get'
  })
}
