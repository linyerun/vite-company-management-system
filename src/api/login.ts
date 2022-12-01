import {request} from '../utils/request'

export function login(username: string, password: string) {
    return request({
        method: 'post',
        url: '/user/login',
        data: {
            username,
            password
        }
    })
}