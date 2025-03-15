import request from '@/utils/request'

export function courseList(data) {
  return request({
    url: '/open-class/list',
    method: 'post',
    data
  })
}

export function courseRecordList(data) {
  return request({
    url: '/open-class/list-subscribe-record',
    method: 'post',
    data
  })
}

export function courseRecordInfoList(data) {
  return request({
    url: '/open-class/list-record',
    method: 'post',
    data
  })
}

export function courseCancel(data) {
  return request({
    url: '/open-class/cancel',
    method: 'get',
    params: data
  })
}

export function classList(data) {
  return request({
    url: '/course/list',
    method: 'post',
    data
  })
}

export function classCancel(data) {
  return request({
    url: '/course/cancel',
    method: 'get',
    params: data
  })
}

export function orderList(data) {
  return request({
    url: '/business-order/list',
    method: 'post',
    data
  })
}
