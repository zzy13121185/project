<template>
  <el-dialog
    title="确认要取消该课程吗？"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
    top="5vh"
  >
    <el-row>
      当前有4节课已开课，解除资格后将自动解散
      <el-button type="primary" style="margin-left: 30px" @click="routerTo('class')">查看课程</el-button>
    </el-row>
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" label-position="right" style="background: #EBEEF5;padding: 8px;margin-top: 8px">
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
    <el-row style="margin-top: 20px;text-align: center">
      <el-button type="primary" style="margin-right: 40px" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="commit">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { classCancel } from '@/api/course'
import { failMessage, successMessage } from '@/utils/notice'

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
    async commit() {
      const { code, message } = await classCancel({ id: this.ruleForm.id })
      if (code === 200) {
        successMessage(this, '操作成功！')
        this.$emit('getData')
        this.$emit('handleClose')
      } else {
        failMessage(this, message)
      }
    },
    async routerTo(type) {
      if (type === 'class') {
        this.$router.push({
          name: 'commencement',
          query: { id: this.ruleForm.id }
        })
      } else {
        this.$router.push({ name: 'teacher', query: { id: this.ruleForm.teacherId }})
      }
    },
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
::v-deep{
  .el-form-item__content {
    text-align: right;
  }
}
</style>

