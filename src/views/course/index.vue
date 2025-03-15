<template>
  <div class="mainTableContainer">
    <header class="headerStyle">
      <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="课程ID">
              <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="老师ID">
              <el-input v-model="search.teacherId" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
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
            <el-button type="text" @click="view(scope.row)">查看</el-button>
          </template>
          <template v-else-if="col.key==='info'">
            <el-button type="text" @click="viewInfo(scope.row)">查看</el-button>
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
          <el-button type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
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
    <classInfoBox v-if="showClassInfoBox" ref="classInfoBox" @handleClose="showClassInfoBox = false" />
    <cancelBox v-if="showCancelBox" ref="cancelBox" @handleClose="showCancelBox = false" @getData="getTableData" />

  </div>
</template>

<script>
import { courseCol } from './col'
import { classList } from '@/api/course'
import { failMessage } from '@/utils/notice'
import classInfoBox from '@/views/course/classInfoBox.vue'
import cancelBox from '@/views/course/cancelBox.vue'

export default {
  name: 'CourseManagement',
  components: {
    classInfoBox,
    cancelBox
  },
  data() {
    // 数据定义
    return {
      tableData: [],
      showClassInfoBox: false,
      showCancelBox: false,
      search: {
        id: null,
        teacherId: null
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
    this.tableCols = courseCol
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async viewInfo(data) {
      this.showClassInfoBox = true
      await this.$nextTick()
      await this.$refs.classInfoBox.handleShow(data)
    },
    async view({ id }) {
      this.$router.push({
        name: 'commencement',
        query: { id: id }
      })
    },
    async handleDelete(data) {
      this.showCancelBox = true
      await this.$nextTick()
      await this.$refs.cancelBox.handleShow(data)
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
      for (const postKey in this.search) {
        this.search[postKey] = this.search[postKey] ? this.search[postKey] : null
      }
      const post = { ...this.queryForm, ...this.search }

      try {
        const {
          data,
          code
        } = await classList(post)
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
