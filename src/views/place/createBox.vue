<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="场地名称"
        prop="name"
      >
        <el-input
          v-model="ruleForm.name"
          clearable
          maxlength="20"
        />
      </el-form-item>
      <el-form-item
        label="场主ID"
        prop="farmersId"
      >
        <!--        <el-input v-model="ruleForm.farmersId" oninput="value=value.replace(/[^\d.]/g,'')" clearable maxlength="20" />-->
        <el-autocomplete
          v-model="ruleForm.farmersId"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          value-key="nickname"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item
        label="地址"
        prop="selectedOptions"
      >
        <el-cascader
          v-model="ruleForm.selectedOptions"
          style="width: 260px"
          size="large"
          :options="pcaTextArr"
          @change="selectPlace"
        />
      </el-form-item>
      <el-form-item
        label="详细位置"
        prop="address"
      >
        <el-input
          v-model="ruleForm.address"
          clearable
          type="textarea"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="营业时间"
        prop="businessTime"
      >
        <el-input
          v-model="ruleForm.businessTime"
          clearable
          type="textarea"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="描述"
        prop="desc"
      >
        <el-input
          v-model="ruleForm.desc"
          clearable
          type="textarea"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="分成比例">
        <el-input-number
          v-model="ruleForm.settleRatio"
          controls-position="right"
          :min="0"
          :max="100"
          style="margin-right: 10px"
        />%
      </el-form-item>
      <el-form-item label="场地图片">
        <uploadImg
          ref="upload"
          @uploadSuccess="uploadPicSuccess"
        />
      </el-form-item>
    </el-form>

    <el-row style="margin-top: 20px;text-align: center">
      <el-button
        type="primary"
        @click="handleClose"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >确认</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { siteAdd, siteUpdate } from '@/api/site'
import { searchUser } from '@/api/user'
import uploadImg from '@/components/uploadImg/index.vue'
import { successMessage, warningMessage } from '@/utils/notice'
import { pcaTextArr } from 'element-china-area-data'
// https://up-z0.qiniup.com
export default {
  components: { uploadImg },
  data() {
    return {
      fileList: [],
      fileName: '',
      dialogVisible: false,
      title: '新增场地',
      currentApi: null,
      pcaTextArr,
      ruleForm: {
        selectedOptions: [],
        name: '',
        address: '',
        settleRatio: 0,
        farmersId: '',
        businessTime: '',
        desc: '',
        id: null,
        imgs: []
      },
      rules: {
        address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ],
        businessTime: [
          {
            required: true,
            message: '请输入营业时间',
            trigger: 'blur'
          }
        ],
        selectedOptions: [
          {
            required: true,
            message: '请选择地址',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入场地名称',
            trigger: 'blur'
          }
        ],
        farmersId: [
          {
            required: true,
            message: '请输入场主ID',
            trigger: 'blur'
          }
        ],
        settleRatio: [
          {
            required: true,
            message: '请输入分成比例',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    selectPlace(val) {
      console.log(val)
    },
    uploadPicSuccess(picList) {
      this.fileList = picList.map(o => {
        return o.url
      })
    },
    async querySearchAsync(queryString, cb) {
      const {
        code,
        data
      } = await searchUser({ param: queryString })
      if (code === 200) {
        // data.value = data.nickname
        data.id = String(data.id)
        const list = [data]
        const results = queryString ? list.filter(this.createStateFilter(queryString)) : list
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return ((String(state.id)).indexOf(String(queryString)) === 0)
      }
    },
    handleSelect(item) {
      this.ruleForm.farmersId = item.id
    },
    open() {
      this.$confirm('当前场地未添加教室，添加场地后可开放营业?', '场地添加成功', {
        confirmButtonText: '去添加',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {

      })
    },
    async commit() {
      // await this.uploadImageList()
      const post = Object.assign({}, this.ruleForm)
      if (this.ruleForm.selectedOptions[1] === '市辖区') {
        post.city = this.ruleForm.selectedOptions[0]
      } else {
        post.city = this.ruleForm.selectedOptions[1]
      }
      post.province = this.ruleForm.selectedOptions[0]

      post.county = this.ruleForm.selectedOptions[2]
      post.farmersId = Number(post.farmersId)
      post.imgs = this.fileList

      Reflect.deleteProperty(post, 'selectedOptions')
      const { code } = await this.currentApi(post)
      if (code === 200) {
        this.handleClose()
        successMessage(this, '操作成功！')
        this.$emit('getTableData')
        if (this.title === '新增场地') {
          this.open()
        }
      } else {
        warningMessage(this, '操作失败！')
      }
    },
    handleClose() {
      this.ruleForm = {
        selectedOptions: [],
        name: '',
        address: '',
        settleRatio: 0,
        farmersId: null,
        businessTime: '',
        desc: '',
        id: null
      }
      this.$emit('handleClose')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleShow(data, title) {
      this.title = title
      if (data === null) {
        this.currentApi = siteAdd
      } else {
        for (const dataKey in this.ruleForm) {
          this.ruleForm[dataKey] = data[dataKey]
        }
        this.ruleForm.farmersId = String(data.farmersId)
        let city
        if (data.province === data.city) {
          city = '市辖区'
        } else {
          city = data.city
        }
        this.ruleForm.selectedOptions = [data.province, city, data.county]
        this.currentApi = siteUpdate
      }
      this.dialogVisible = true
      await this.$nextTick()
      if (data.imgs?.length) {
        this.$refs.upload.setImage(data.imgs)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  height: auto;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .title {
    width: 30%;
    text-align: right;
    padding-right: 20px;
  }

  .content {
    padding-left: 20px;
    flex: 1;
    text-align: left;
  }
}
</style>
