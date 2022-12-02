import request from "../utils/request"

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
