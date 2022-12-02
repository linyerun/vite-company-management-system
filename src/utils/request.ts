import axios from 'axios'
import { errorInfo } from '../api/message'
import router from '../router/index'

interface IData {
    code: number
    msg: string
    data: any
}

interface IOptions {
  url?: string
  method?: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
}

export  const request =(options: IOptions)=> {
  return new Promise<IData>((resolve, reject) => {

    // 创建一个axios实例
    const service = axios.create({
      baseURL: 'http://localhost:8888/company_sales_management_system',
      timeout: 60000
    })

    // 请求拦截器
    service.interceptors.request.use(
      (config:any) => {
        //从sessionStorage获取token
        const token =sessionStorage.getItem('token')
        if(token) {
          config.headers['token'] = token
         }
        return config
      },
      error => {
        console.log("出错啦", error) // for debug
        Promise.reject(error).then(r => {console.log(r)})
      }
    )

    // 响应拦截器
    service.interceptors.response.use(
       (response:any) => {
        // token出问题的时候
        if( response.data.code === 601 ) {
          errorInfo('token失效,请重新进行登录!')
          router.push('/login').then(r => console.log(r))
        }
        return response.data
      },
      error => {
        console.log('err' + error) // for debug
        if(error.response.status == 403){
          errorInfo('错了')
        }else{
          errorInfo('服务器请求错误，请稍后再试')
        }
        return Promise.reject(error)
      }
    )

    // 请求处理
    service(options)
      .then((res) => {
        resolve(res as any)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default request
