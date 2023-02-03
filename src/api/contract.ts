import request from "../utils/request"

export interface IContract {
    id: number
    createdAt: string
    updatedAt: string
    clientId: number
    userId: number
    totalAmount: number
    contractPic: string
    contractState: number
}

export interface IContractData {
    clientId: number
    contractPic: string
    goodsInfos: IGoodsInfo[]
    totalAmount: number
    userId: number
}

export interface IGoodsInfo {
    goodsId: number
    purchasingCount: number
}

export function getContractsState() {
    return request({
        method: 'get',
        url: `/contract/getState`
    })
}

export function getEmpSum(startTime: string, endTime: string) {
    return request({
        method: 'get',
        url: '/contract/empSum/get',
        params: {
            startTime,
            endTime
        }
    })
}

export function getDeliverMsgByContractId(contractId: number) {
    return request({
        url: `/contract/clientInfo/get/${contractId}`,
        method: 'get'
    })
}

export function getCompanySumByTime(startTime: string, endTime: string) {
    return request({
        url: '/contract/getSumByTime',
        method: 'get',
        params: {
            startTime,
            endTime
        }
    })
}

export function getSumByClientId(clientId: number) {
    return request({
        url: `/contract/getSumByClientId/${clientId}`,
        method: 'get'
    })
}

export function getAllContract() {
    return request({
        url: '/contract/getAllContract',
        method: 'get'
    })
}

export function postContract(contract: IContractData) {
    return request({
        url: '/contract/record',
        method: 'post',
        data: contract
    })
}

export function updateClient(cliId: number, contractId: number) {
    return request({
        url: `/contract/update/client/${cliId}/${contractId}`,
        method: 'put',
    })
}

export function updateEmployee(empId: number, contractId: number) {
    return request({
        url: `/contract/update/employee/${empId}/${contractId}`,
        method: 'put',
    })
}

export function updatePicture(contractId: number, picURL: string) {
    return request({
        url: `/contract/update/pic/${contractId}`,
        method: 'put',
        data: {url: picURL}
    })
}
