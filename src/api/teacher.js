import request from '@/utils/request'

export function teacherList(data) {
  return request({
    url: '/teacher/list',
    method: 'post',
    data
  })
}

export function teacherAdd(data) {
  return request({
    url: '/teacher/add',
    method: 'post',
    data
  })
}

export function teacherCancel(data) {
  return request({
    url: '/teacher/cancel',
    method: 'get',
    params: data
  })
}
