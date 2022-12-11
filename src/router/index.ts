import {createRouter, createWebHistory} from 'vue-router'
import EmployeeIndex from '../components/employee/index.vue'
import AdminIndex from '../components/admin/index.vue'
import StoreIndex from '../components/store/index.vue'
import Login from '../components/common/login.vue'
import ContractState from '../components/employee/ContractState.vue'
import Performance from '../components/employee/Performance.vue'
import In from '../components/store/In.vue'
import Out from '../components/store/Out.vue'
import Client from '../components/admin/msg/Client.vue'
import Employee from '../components/admin/msg/Employee.vue'
import Contract from '../components/admin/msg/Contract.vue'
import Sum from '../components/admin/data/Sum.vue'
import ClientSum from '../components/admin/data/ClientSum.vue'
import GoodsSum from '../components/admin/data/GoodsSum.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/emp',
    name: 'EmployeeIndex',
    component: EmployeeIndex,
    children: [
      {
        path: 'contractState',
        name: 'ContractState',
        component: ContractState
      },
      {
        path: 'performance',
        name: 'Performance',
        component: Performance
      }
    ]
  },
  {
    path: '/store',
    name: 'StoreIndex',
    component: StoreIndex,
    children: [
      {
        path: 'in',
        name: 'In',
        component: In
      },
      {
        path: 'out',
        name: 'Out',
        component: Out
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminIndex',
    component: AdminIndex,
    children: [
      {
        path: 'client',
        name: 'Client',
        component: Client
      },
      {
        path: 'employee',
        name: 'Employee',
        component: Employee
      },
      {
        path: 'contract',
        name: 'Contract',
        component: Contract
      },
      {
        path: 'sum',
        name: 'Sum',
        component: Sum
      },
      {
        path: 'goodsSum',
        name: 'GoodsSum',
        component: GoodsSum
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 做一个页面跳转守门员
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (token === null) return next('/login')
  next() // 允许通过
})

export default router
