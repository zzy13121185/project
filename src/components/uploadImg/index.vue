<template>
  <div class="upload-wrap">
    <el-upload
      :action="upload_qiniu_area"
      :auto-upload="true"
      :limit="9"
      accept="image/jpg,image/png,image/jpeg"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="picCardPreview"
      :before-upload="beforePicUpload"
      :on-exceed="handleExceed"
      :on-remove="removePic"
      :http-request="uploadQiniu"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import { getUploadToken } from '@/api/upload'
import * as qiniu from 'qiniu-js'

export default {
  name: 'UploadPicture',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      upload_qiniu_area: 'https://up-z0.qiniup.com', // 七牛云上传储存区域的上传域名
      token: '',
      domain: '',
      fileKey: ''
    }
  },
  created() {

  },
  methods: {
    setImage(list) {
      this.fileList = list.map(o => {
        return {
          url: o
        }
      })
      this.$emit('uploadSuccess', this.fileList)
    },
    picCardPreview(file) { // 上传图预览
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforePicUpload(file) { // 图片校验
      const limitPic = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'
      if (!limitPic) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png,image/jpg,image/jpeg的图片'
        })
      }
      const limitSize = file.size / 1024 / 1024 / 2 < 5
      if (!limitSize) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于5M'
        })
      }
      return limitPic && limitSize
    },
    removePic(file, fileList) { // 移除图片
      this.fileList = fileList
      this.$emit('uploadSuccess', this.fileList)
    },
    handleExceed() { // 文件超出个数限制
      this.$notify.warning({
        title: '警告',
        message: '一次只能上传9张图片',
        duration: 2000
      })
    },
    uploadQiniu(uploadInfo) { // 上传七牛
      console.log(uploadInfo, '!!!!!!!!!!!')
      const _that = this
      const type = uploadInfo.file.type.split('/')[1]
      const post = {
        channel: 'site',
        type: 'image',
        suffix: type
      }
      getUploadToken(post).then(result => {
        this.token = result.data.token
        this.fileKey = result.data.fileKey
        this.domain = result.data.domain
        const observer = {
          error(err) {
            console.log(err)
          },
          complete(res) {
            const url = `${_that.domain}/${_that.fileKey}`
            const file_data = {
              url: url
            }
            _that.fileList.push(file_data)
            _that.$emit('uploadSuccess', _that.fileList)
          }
        }
        const observable = qiniu.upload(uploadInfo.file, this.fileKey, this.token, {}, {})
        observable.subscribe(observer) // 上传开始
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
</style>
