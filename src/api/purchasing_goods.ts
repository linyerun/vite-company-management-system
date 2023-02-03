import request from "../utils/request"

export interface IPurchasingGoods {
  goodId: number
  goodsName: string
  unitPrice: number
  purchasingGoodsId: number
  purchasingCount: number
}

export function getPurchasingGoodsListByContractId(contractId: number) {
  return request({
    url: `/purchasingGoods/get/${contractId}`,
    method: 'get',
  })
}

export function deletePGListByCtsId(contractId: number, pgId: number) {
  return request({
    url: `/purchasingGoods/delete/${contractId}/${pgId}`,
    method: 'delete',
  })
}

export function postPGByContractId(contractId: number, goodsId: number, purchasingCount: number) {
  return request({
    url: `/purchasingGoods/post/${contractId}`,
    method: 'post',
    data: {goodsId: goodsId, purchasingCount: purchasingCount},
  })
}
