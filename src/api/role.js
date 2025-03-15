import request from '@/utils/request'

export function addRole(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/system/role/update`,
    method: 'post',
    data
  })
}

// export function deleteRole(id) {
//   return request({
//     url: `/vue-element-admin/role/${id}`,
//     method: 'delete'
//   })
// }
export function updateRolePermission(data) {
  return request({
    url: `/system/role/update-permissions`,
    method: 'post',
    data
  })
}

export function roleList(data) {
  return request({
    url: `/system/role/list`,
    method: 'get',
    params: data
  })
}
