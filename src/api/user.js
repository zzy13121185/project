import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/system/user/current-login',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
export function update(data) {
  return request({
    url: '/system/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/system/user/delete?${id}`,
    method: 'post'
  })
}

export function create(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

export function userList(data) {
  return request({
    url: '/system/user/add',
    method: 'get',
    params: data
  })
}
export function searchUser(data) {
  return request({
    url: '/user/get-user-by-id-or-phone',
    method: 'get',
    params: data
  })
}

