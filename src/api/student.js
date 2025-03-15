import request from '@/utils/request'

export function studentList(data) {
  return request({
    url: '/student/list',
    method: 'post',
    data
  })
}
