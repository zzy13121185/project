<template>
  <el-dialog
    title="场地信息"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px" label-position="left">
      <el-form-item label="场地ID">
        {{ ruleForm.id }} <el-button type="text" style="margin-left: 20px" @click="routerTo('teacher')">查看</el-button>
      </el-form-item>
      <el-form-item label="场地名称">
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item label="场主ID">
        {{ ruleForm.farmersId }}
      </el-form-item>
      <el-form-item label="场主名称">
        {{ ruleForm.farmersName }}
      </el-form-item>
      <el-form-item label="省-市-区县">
        {{ getPlace(ruleForm) }}
      </el-form-item>
      <el-form-item label="位置">
        {{ ruleForm.address }}
      </el-form-item>
      <el-form-item label="营业时间">
        {{ ruleForm.businessTime }}
      </el-form-item>
      <el-form-item label="描述">
        {{ ruleForm.desc }}
      </el-form-item>
      <el-form-item label="分成比例">
        {{ ruleForm.settleRatio }}%
      </el-form-item>
      <el-form-item label="教室数">
        {{ ruleForm.totalIncome }}<el-button type="text" style="margin-left: 20px" @click="routerTo('room')">查看</el-button>
      </el-form-item>
      <el-form-item label="场地图片">
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
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    async routerTo(flag) {
      const { farmersId, id } = this.ruleForm
      await this.handleClose()
      if (flag === 'teacher') {
        this.$router.push({ name: 'teacher', query: { id: farmersId }})
      } else {
        this.$router.push({ name: 'room', query: { siteId: id }})
      }
    },
    handleShow(data) {
      this.ruleForm = data
      this.dialogVisible = true
    },
    getPlace(data) {
      return `${data.province}${data.city}${data.county}`
    },
    handleClose() {
      this.ruleForm = {}
      this.$emit('handleClose')
    }
  }
}

</script>

<style scoped lang="scss">

</style>

