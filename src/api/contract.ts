import request from "../utils/request"

export function getContractsState() {
    return request({
        method: 'get',
        url: `/contract/getState`
    })
}