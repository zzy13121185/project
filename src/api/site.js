import request from '@/utils/request'

export function siteUpdate(data) {
  return request({
    url: '/site/update',
    method: 'post',
    data
  })
}

export function siteAdd(data) {
  return request({
    url: '/site/add',
    method: 'post',
    data
  })
}

export function siteCancel(data) {
  return request({
    url: '/site/cancel',
    method: 'get',
    params: data
  })
}

export function siteList(data) {
  return request({
    url: '/site/list',
    method: 'post',
    data
  })
}

export function roomList(data) {
  return request({
    url: '/danceRoom/list',
    method: 'post',
    data
  })
}

export function roomAdd(data) {
  return request({
    url: '/danceRoom/add',
    method: 'post',
    data
  })
}

export function roomUpdate(data) {
  return request({
    url: '/danceRoom/update',
    method: 'post',
    data
  })
}

export function roomDelete(data) {
  return request({
    url: '/danceRoom/cancel?id=' + data,
    method: 'get'
  })
}

export function bookList(data) {
  return request({
    url: '/danceRoom/time/list',
    method: 'post',
    data
  })
}

export function openTimeRange(data) {
  return request({
    url: '/danceRoom/time/open',
    method: 'get',
    params: data
  })
}

export function closeTimeRange(data) {
  return request({
    url: '/danceRoom/time/close',
    method: 'get',
    params: data
  })
}
