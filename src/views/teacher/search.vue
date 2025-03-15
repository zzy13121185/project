<template>
  <el-dialog
    title="新增老师认证"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <template v-if="currentStep === 1">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="ID/手机号" prop="param">
          <el-input v-model="ruleForm.param" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
        </el-form-item>
        <el-form-item label="分成比例" prop="settleRatio">
          <el-input-number v-model="ruleForm.settleRatio" controls-position="right" :min="0" :max="100" style="margin-right: 10px" />%
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <div class="line">
        <div class="title">ID</div>
        <div class="content">{{ userInfo.id }}</div>
      </div>
      <div class="line">
        <div class="title">昵称</div>
        <div class="content">{{ userInfo.nickname }}</div>
      </div>
      <div class="line">
        <div class="title">头像</div>
        <div class="content">
          <el-image
            style="width: 50px; height: 50px"
            :src="userInfo.pic"
            :preview-src-list="[userInfo.pic]"
          />
        </div>
      </div>
      <div class="line">
        <div class="title">手机号</div>
        <div class="content">{{ userInfo.phone }}</div>
      </div>
      <div class="line">
        <div class="title">注册时间</div>
        <div class="content">{{ userInfo.createTime }}</div>
      </div>
      <div class="line">
        <div class="title">分成比列</div>
        <div class="content">
          <el-input-number v-model="ruleForm.settleRatio" controls-position="right" :min="0" :max="100" style="margin-right: 10px" />%
        </div>
      </div>
      <el-row style="margin-top: 20px;text-align: center">
        <el-button type="primary" style="margin-right: 40px" @click="currentStep = 1">重新输入</el-button>
        <el-button type="primary" @click="commit">确认</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { searchUser } from '@/api/user'
import { successMessage, warningMessage } from '@/utils/notice'
import { teacherAdd } from '@/api/teacher'
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        param: null,
        settleRatio: 0
      },
      rules: {
        param: [
          {
            required: true,
            message: '请输入 ID/手机号',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
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
      },
      userInfo: {},
      currentStep: 1
    }
  },
  methods: {
    async commit() {
      const post = {
        settleRatio: this.ruleForm.settleRatio,
        userId: this.userInfo.id
      }
      const { code } = await teacherAdd(post)
      if (code === 200) {
        this.handleClose()
        successMessage(this, '认证成功！')
        this.$emit('getTableData')
      }
    },
    handleClose() {
      this.ruleForm.param = null
      this.ruleForm.settleRatio = 0
      this.currentStep = 1
      this.$emit('handleClose')
    },
    async searchTeacher() {
      const post = {
        settleRatio: this.ruleForm.settleRatio,
        param: this.ruleForm.param
      }
      const {
        data,
        code
      } = await searchUser(post)
      if (data && code === 200) {
        this.userInfo = data
        this.currentStep = 2
      } else {
        warningMessage(this, '未查询到用户，请重新输入！')
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.searchTeacher()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleShow() {
      this.dialogVisible = true
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
