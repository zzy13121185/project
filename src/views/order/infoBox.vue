<template>
  <el-dialog
    title="退款信息"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" label-position="left">
      <el-form-item label="订单金额">
        {{ ruleForm.id }}
      </el-form-item>
      <el-form-item label="订单状态">
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item label="退款原因">
        {{ ruleForm.farmersId }}
      </el-form-item>
      <el-form-item label="退款渠道">
        {{ ruleForm.farmersName }}
      </el-form-item>
      <el-form-item label="退款时间">
        {{ ruleForm.id }}
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
      ruleForm: {}
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    handleShow(data) {
      this.ruleForm = data
      this.dialogVisible = true
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

</style>

