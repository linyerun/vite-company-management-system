import request from '../utils/request'

export interface IEmployee {
  id: number
  createdAt: string
  updatedAt: string
  username: string
  phoneNumber: string
  email: string
  identity: number
  employeeName: string
}

export interface IEmployeeData {
  email: string
  employeeName: string
  password: string
  phoneNumber: string
  username: string
}

export interface IEmployeeUpdateData extends IEmployeeData{
  id: number
}

export function getEmployees(name?: string) {
  return request({
    url: '/user/query',
    method: 'get',
    params: {
      name  // 这种不是一个对象的，不要省略params的{}
    }
  })
}

export function postEmployee(employeeData: IEmployeeData) {
  return request({
    url: '/user/register',
    method: 'post',
    data: employeeData
  })
}

export function updateEmployee(employeeUpdateData: IEmployeeUpdateData) {
  return request({
    method: 'put',
    url: '/user/update',
    data: employeeUpdateData
  })
}

export function getEmployeeById(empId: number) {
  return request({
    url: `/user/getEmployeeById/${empId}`,
    method: 'get'
  })
}
