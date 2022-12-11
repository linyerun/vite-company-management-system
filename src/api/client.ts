import request from '../utils/request'

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
