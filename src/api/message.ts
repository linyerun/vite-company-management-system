import { ElNotification, ElMessage } from 'element-plus'

export function errorInfo (msg: string) {
    ElNotification({
        title: 'Error',
        message: msg,
        type: 'error'
    })
}

export function successInfo(msg: string) {
    ElMessage({
        message: msg,
        type: 'success',
    })
}
