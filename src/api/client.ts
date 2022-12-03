import request from '../utils/request'

interface IClientInfo {
  address: string
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
