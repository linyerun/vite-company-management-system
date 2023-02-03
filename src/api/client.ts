import request from '../utils/request'

export interface IClient {
  id: number
  createdAt: string
  updatedAt: string
  phoneNumber: string
  email: string
  clientName: string
}

interface IClientInfo {
  clientName: string
  email: string
  phoneNumber: string
}

export function getClients(phoneNumber?: string, email?: string, clientName?: string) {
  return request({
    url: '/client/getClients',
    params: {
      phoneNumber,
      email,
      clientName
    }
  })
}

export function updateClient(cliInfo: IClientInfo, clientId: number) {
  return request({
    url: `client/update/${clientId}`,
    method: 'put',
    data: cliInfo
  })
}

export function addClient(cliInfo: IClientInfo) {
  return request({
    url: '/client/add',
    method: 'post',
    data: cliInfo
  })
}

export function getClientById(cliId: number) {
  return request({
    url: `/client/getClientById/${cliId}`,
    method: 'get'
  })
}

export function getAllClients() {
  return request({
    url: '/client/getClients',
    method: 'get'
  })
}
