import { request } from '../utils/request'

export interface IPurchasingList {
  id: number
  createdAt: string
  updatedAt: string
  contractId: number
  address: string
}

export function getPurchasingLists() {
  return request({
    url: '/purchasingList/getIng',
    method: 'get'
  })
}
