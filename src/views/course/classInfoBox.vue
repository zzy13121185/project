<template>
  <el-dialog
    title="课程详情"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" label-position="right">
      <el-form-item label="课程ID">
        {{ ruleForm.id }}
      </el-form-item>
      <el-form-item label="课程名称">
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item label="老师ID">
        {{ ruleForm.teacherId }}<el-button type="text" style="margin-left: 20px" @click="routerTo('teacher')">查看</el-button>
      </el-form-item>
      <el-form-item label="老师名称">
        {{ ruleForm.teacherName }}
      </el-form-item>
      <el-form-item label="添加时间">
        {{ ruleForm.createTime }}
      </el-form-item>
      <el-form-item label="课程描述">
        {{ ruleForm.desc }}
      </el-form-item>
      <el-form-item label="课程评分">
        {{ ruleForm.evaluateTotalScore }}
      </el-form-item>
      <el-form-item label="评分人数">
        {{ ruleForm.evaluateTotalCount }}
      </el-form-item>
      <el-form-item label="课程舞种">
        {{ ruleForm.danceType }}
      </el-form-item>
      <el-form-item label="课程难度">
        <el-rate v-model="ruleForm.difficulty" />
      </el-form-item>
      <el-form-item label="课程时长">
        {{ ruleForm.duration }}分钟
      </el-form-item>
      <el-form-item label="课程图片">
        <template v-if="ruleForm.imgs.length">
          <el-image v-for="(item) in ruleForm.imgs" :key="item" :src="item" fit="fill" class="image">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
        <template v-else>
          暂无图片
        </template>
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
    async routerTo() {
      this.$router.push({ name: 'teacher', query: { id: this.ruleForm.teacherId }})
    },
    handleShow(data) {
      console.log(data)
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

