import { ElNotification } from 'element-plus'

export function errorInfo (msg: string) {
    ElNotification({
        title: 'Error',
        message: msg,
        type: 'error'
    })
}