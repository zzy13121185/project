<template>
  <el-dialog
    title="确定要取消该老师的资格吗？"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-row>
      当前老师有4门课程，解除资格后课程将自动解散
      <el-button type="primary" style="margin-left: 20px" @click="gotoClass">查看课程</el-button>
    </el-row>
    <template>
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
        <div class="title">营收流水</div>
        <div class="content">{{ userInfo.totalOrderMoney }}元</div>
      </div>
      <div class="line">
        <div class="title">分成比列</div>
        <div class="content">
          {{ userInfo.settleRatio }}%
        </div>
      </div>
      <el-row style="margin-top: 20px;text-align: center">
        <el-button type="primary" style="margin-right: 40px" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="commit">确认</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { teacherCancel } from '@/api/teacher'
import { successMessage, warningMessage } from '@/utils/notice'

export default {
  data() {
    return {
      dialogVisible: false,
      userInfo: {}
    }
  },
  methods: {
    async commit() {
      const { code } = await teacherCancel({ id: this.userInfo.id })
      if (code === 200) {
        this.handleClose()
        successMessage(this, '取消成功！')
        this.$emit('getTableData')
      } else {
        warningMessage(this, '操作失败！')
      }
    },
    handleClose() {
      this.$emit('handleClose')
    },
    handleShow(data) {
      this.dialogVisible = true
      this.userInfo = data
    },
    gotoClass() {
      this.handleClose()
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
