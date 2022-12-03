import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Admin: typeof import('./src/components/admin/index.vue')['default']
    Aside: typeof import('./src/components/admin/Aside.vue')['default']
    Client: typeof import('./src/components/admin/msg/Client.vue')['default']
    Contract: typeof import('./src/components/admin/msg/Contract.vue')['default']
    ContractState: typeof import('./src/components/employee/ContractState.vue')['default']
    ElButton: typeof import('element-plus/es')['ElButton']
    ElDatePicker: typeof import('element-plus/es')['ElDatePicker']
    ElDialog: typeof import('element-plus/es')['ElDialog']
    ElDropdown: typeof import('element-plus/es')['ElDropdown']
    ElDropdownItem: typeof import('element-plus/es')['ElDropdownItem']
    ElDropdownMenu: typeof import('element-plus/es')['ElDropdownMenu']
    ElForm: typeof import('element-plus/es')['ElForm']
    ElFormItem: typeof import('element-plus/es')['ElFormItem']
    ElIcon: typeof import('element-plus/es')['ElIcon']
    ElInput: typeof import('element-plus/es')['ElInput']
    ElLink: typeof import('element-plus/es')['ElLink']
    ElMain: typeof import('element-plus/es')['ElMain']
    ElMenu: typeof import('element-plus/es')['ElMenu']
    ElMenuItem: typeof import('element-plus/es')['ElMenuItem']
    ElOption: typeof import('element-plus/es')['ElOption']
    ElPopover: typeof import('element-plus/es')['ElPopover']
    ElSelect: typeof import('element-plus/es')['ElSelect']
    ElSubMenu: typeof import('element-plus/es')['ElSubMenu']
    ElTable: typeof import('element-plus/es')['ElTable']
    ElTableColumn: typeof import('element-plus/es')['ElTableColumn']
    ElTag: typeof import('element-plus/es')['ElTag']
    Employee: typeof import('./src/components/employee/index.vue')['default']
    Header: typeof import('./src/components/common/Header.vue')['default']
    In: typeof import('./src/components/store/In.vue')['default']
    Login: typeof import('./src/components/common/login.vue')['default']
    Out: typeof import('./src/components/store/Out.vue')['default']
    Performance: typeof import('./src/components/employee/Performance.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    Store: typeof import('./src/components/store/index.vue')['default']
  }
}
