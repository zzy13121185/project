<template>
  <el-dialog
    title="开课信息"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" label-position="right">
      <el-form-item label="开课ID">
        {{ ruleForm.id }}
      </el-form-item>
      <el-form-item label="课程ID" @click="routerTo('teacher')">
        {{ ruleForm.courseId }}<el-button type="text" style="margin-left: 20px" @click="routerTo('course',ruleForm.courseId)">查看</el-button>
      </el-form-item>
      <el-form-item label="老师ID">
        {{ ruleForm.teacherId }}<el-button type="text" style="margin-left: 20px" @click="routerTo('teacher',ruleForm.teacherId)">查看</el-button>
      </el-form-item>
      <el-form-item label="场地名称">
        {{ ruleForm.siteName || '未绑定' }}
      </el-form-item>
      <el-form-item label="场地位置">
        {{ ruleForm.siteAddress }}
      </el-form-item>
      <el-form-item label="场地备注">
        {{ ruleForm.siteRemark }}
      </el-form-item>
      <el-form-item label="开课定价">
        {{ ruleForm.price }}
      </el-form-item>
      <el-form-item label="开课状态">
        {{ statusType[ruleForm.status] }}
      </el-form-item>
      <el-form-item label="开课时间">
        {{ ruleForm.createTime }}
      </el-form-item>
      <el-form-item label="上课时间">
        {{ ruleForm.attendClassTime }}
      </el-form-item>
      <el-form-item label="下课时间">
        {{ ruleForm.finishClassTime }}
      </el-form-item>
      <el-form-item label="开课班型">
        {{ ruleForm.number }}
      </el-form-item>
      <el-form-item label="体验评分">
        {{ ruleForm.evaluateScore }}
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      ruleForm: {},
      statusType: {
        CANCEL: '已取消',
        PENDING: '待开课',
        ING: '进行中',
        FINISH: '已结束'
      }
    }
  },
  computed: {

  },
  watch: {},
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    async routerTo(path, id) {
      this.$router.push({ name: path, query: { id: id }})
    },
    handleShow(data) {
      this.ruleForm = data
      this.dialogVisible = true
    },
    getPlace(data) {
      return `${data.province}${data.city}${data.county}${data.address}`
    },
    handleClose() {
      this.dialogVisible = false
      this.ruleForm = {}
      this.$emit('handleClose')
    }
  }
}

</script>

<style scoped lang="scss">
::v-deep{
  .el-form-item__content {
    text-align: right;
  }
}
</style>

