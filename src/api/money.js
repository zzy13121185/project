import request from '@/utils/request'

export function rechargeList(data) {
  return request({
    url: '/recharge/list',
    method: 'post',
    data
  })
}

export function depositList(data) {
  return request({
    url: '/withdraw-deposit/list',
    method: 'post',
    data
  })
}

export function depositRefuse(data) {
  return request({
    url: '/withdraw-deposit/refuse',
    method: 'get',
    params: data
  })
}

export function depositPass(data) {
  return request({
    url: '/withdraw-deposit/pass',
    method: 'get',
    params: data
  })
}
