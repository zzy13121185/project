<template>
  <div class="mainTableContainer">
    <header class="headerStyle">
      <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="开课ID">
              <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="课程ID">
              <el-input v-model="search.courseId" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="老师ID">
              <el-input v-model="search.teacherId" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="学生ID">
              <el-input v-model="search.studentId" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="场地ID">
              <el-input v-model="search.siteId" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="开课状态">
              <el-select v-model="search.status" placeholder="请选择开课状态" clearable>
                <el-option v-for="(value, key, index) in statusList" :key="key" :label="value" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上课时间">
              <el-date-picker
                v-model="classTime"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                :picker-options="pickerOptionsDay"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'classTime')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开课时间">
              <el-date-picker
                v-model="addTime"
                type="datetimerange"
                range-separator="-"
                :picker-options="pickerOptionsYear"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'addTime')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <el-table
      ref="ruleTable"
      border
      stripe
      :data="tableData"
      height="calc(100% - 200px)"
      tooltip-effect="dark"
    >
      <el-table-column
        v-for="(col,index) in tableCols"
        :key="col.key+index"
        align="center"
        :column-key="col.key"
        :label="col.name"
        :min-width="col.minWidth || ''"
        :prop="col.key"
        :width="col.width || ''"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="col.key==='data'">
            <el-button type="text" @click="viewInfo(scope.row)">查看</el-button>
          </template>
          <template v-else-if="col.key==='status'">
            {{ statusList[scope.row.status] }}
          </template>
          <template v-else-if="col.key==='recordCount'">
            <el-button type="text" @click="view('book',scope.row)">{{ scope.row.recordCount }}人</el-button>
          </template>
          <template v-else-if="col.key==='subscribeCount'">
            <el-button type="text" @click="view('line',scope.row)">{{ scope.row.subscribeCount }}人</el-button>
          </template>
          <template v-else>
            <span v-if="scope.row[col.key] || scope.row[col.key]===0">
              {{ scope.row[col.key] }}
            </span>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">取消资格</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot-pager">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-pagination
            :current-page="queryForm.page"
            :page-size="queryForm.size"
            :page-sizes="[10, 20, 30, 60, 100]"
            :total="total"
            background
            class="foot-pagination"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="(val) => handleCurrentChange(val, 'size')"
            @current-change="handleCurrentChange"
            @prev-click="handleCurrentChange"
            @next-click="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
    <bookClassInfoBox v-if="showBookClassInfoBox" ref="bookClassInfoBox" @handleClose="showBookClassInfoBox = false" />
    <openClassInfoBox v-if="showOpenClassInfoBox" ref="openClassInfoBox" @handleClose="showOpenClassInfoBox = false" />
  </div>
</template>

<script>
import { openClassCol } from './col'
import { courseCancel, courseList } from '@/api/course'
import { failMessage, successMessage } from '@/utils/notice'
import bookClassInfoBox from '@/views/commencement/bookClassInfoBox.vue'
import { getRecentTime } from '@/utils/time'
import openClassInfoBox from '@/views/commencement/openClassInfoBox.vue'

export default {
  name: 'Commencement',
  components: {
    bookClassInfoBox,
    openClassInfoBox
  },
  data() {
    // 数据定义
    return {
      pickerOptionsYear: {
        shortcuts: getRecentTime(['year'])
      },
      pickerOptionsDay: {
        shortcuts: getRecentTime(['day'])
      },
      tableData: [],
      showBookClassInfoBox: false,
      showOpenClassInfoBox: false,
      classTime: '',
      addTime: '',
      statusList: {
        CANCEL: '已取消',
        PENDING: '待开课',
        ING: '进行中',
        FINISH: '已结束'
      },
      search: {
        id: null,
        courseId: null,
        teacherId: null,
        studentId: null,
        status: null,
        siteId: null,
        attendClassStartTime: null,
        attendClassEndTime: null,
        createStartTime: null,
        createEndTime: null
      },
      tableCols: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10
      }
    }
  },
  watch: {},
  created() {
    this.tableCols = openClassCol
  },
  mounted() {
    this.search.courseId = this.$route.query.id || null
    this.getTableData()
  },
  methods: {
    async viewInfo(data) {
      this.showOpenClassInfoBox = true
      await this.$nextTick()
      await this.$refs.openClassInfoBox.handleShow(data)
    },
    async view(type, foo) {
      this.showBookClassInfoBox = true
      await this.$nextTick()
      await this.$refs.bookClassInfoBox.handleShow(type, foo)
    },
    selectTime(val, type) {
      if (type === 'classTime') {
        if (val && val.length) {
          [this.search.attendClassStartTime, this.search.attendClassEndTime] = val
        } else {
          [this.search.attendClassStartTime, this.search.attendClassEndTime] = [null, null]
        }
      } else {
        if (val && val.length) {
          [this.search.createStartTime, this.search.createEndTime] = val
        } else {
          [this.search.createStartTime, this.search.createEndTime] = [null, null]
        }
      }
    },
    async handleDelete(data) {
      const msg = `当前已有${data.recordCount}人约课成功，${data.subscribeCount}人排队成功，累计营收${data.totalMoney}元`
      this.$confirm(msg, '确定要取消该课程吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseCancel({ id: data.id }).then(result => {
          if (result.code === 200) {
            successMessage(this, '操作成功！')
            this.handleSearch()
          } else {
            failMessage(this, '操作失败！')
          }
        })
      }).catch(() => {

      })
    },

    // async getFilterList(filters) {
    //   const key = Object.keys(filters)[0]
    //   const value = filters[key].join(',')
    //   await this.getTableData()
    // },
    handleSearch() {
      this.queryForm.page = 1
      this.getTableData()
    },
    // 加载表格数据
    async getTableData() {
      this.$newLoading(true)
      const post = { ...this.queryForm, ...this.search }

      try {
        const {
          data,
          code
        } = await courseList(post)
        if (code === 200 && data) {
          this.tableData = data.content
          this.total = data.total
          this.$newLoading(false)
        } else {
          this.$newLoading(false)
          failMessage(this, '获取失败！')
        }
      } catch (e) {
        this.$newLoading(false)
        failMessage(this, '获取失败！')
      }
    },
    // 分页
    handleCurrentChange(val, size = '') {
      if (size === 'size') {
        this.queryForm.size = val
        this.queryForm.page = 1
      } else {
        this.queryForm.page = val
      }
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
