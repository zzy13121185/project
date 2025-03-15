import request from '@/utils/request'

export function getUploadToken(data) {
  return request({
    url: '/common/upload-token',
    method: 'post',
    data
  })
}
