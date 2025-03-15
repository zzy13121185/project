<template>
  <div>
    <el-dialog
      title="约课信息"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-table
        ref="ruleTable"
        border
        stripe
        :data="tableData"
        height="500px"
        tooltip-effect="dark"
      >
        <el-table-column align="center" label="学生昵称" prop="studentName" show-overflow-tooltip />
        <el-table-column align="center" label="学生ID" prop="studentId" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="routerToStudent(scope.row.studentId)">{{ scope.row.studentId }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单ID" prop="orderId" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="routerToOrder(scope.row.orderId)">{{ scope.row.orderId }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="约课时间" prop="createTime" show-overflow-tooltip />
        <el-table-column v-if="type === 'book'" align="center" label="约课位置" prop="place" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'line'" align="center" label="排队序号" prop="place" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { courseRecordInfoList, courseRecordList } from '@/api/course'
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      type: 'book'
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
    routerToStudent(id) {
      this.$router.push({ name: 'student', query: { id: id }})
    },
    routerToOrder(id) {
      this.$router.push({ name: 'order', query: { id: id }})
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async handleShow(type, foo) {
      this.type = type
      // this.$newLoading(true)
      await this.getData(foo)
      this.dialogVisible = true
      // this.$newLoading(false)
    },
    async getData(foo) {
      console.log(this.type)
      let api = ''
      let post = {}
      if (this.type === 'book') {
        api = courseRecordInfoList
        post = {
          classId: foo.courseId,
          page: 1,
          size: foo.recordCount
        }
      } else {
        api = courseRecordList
        post = {
          classId: foo.courseId,
          page: 1,
          size: foo.subscribeCount
        }
      }
      const result = await api(post)
      console.log(result)
    }
  }
}

</script>

<style scoped lang="scss">

</style>

