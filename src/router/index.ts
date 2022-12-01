import { createRouter, createWebHistory} from 'vue-router'
import EmployeeIndex from '../components/employee/index.vue'
import AdminIndex from '../components/admin/index.vue'
import StoreIndex from '../components/store/index.vue'
import Login from '../components/common/login.vue'
import ContractState from '../components/employee/ContractState.vue'
import Performance from '../components/employee/Performance.vue'

const routes = [
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
        path: '/admin',
        name: 'AdminIndex',
        component: AdminIndex
    },
    {
        path: '/store',
        name: 'StoreIndex',
        component: StoreIndex
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
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
