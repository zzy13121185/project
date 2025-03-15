<template>
  <div class="mainTableContainer">
    <header class="headerStyle">
      <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="用户ID">
              <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提现时间">
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
            <el-form-item label="处理时间">
              <el-date-picker
                v-model="addTime"
                type="datetimerange"
                range-separator="-"
                :picker-options="pickerOptionsDay"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'addTime')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="提取状态">
              <el-select v-model="search.state" placeholder="请选择提取状态" clearable>
                <el-option v-for="(value, key, index) in statusList" :key="key" :label="value" :value="key" />
              </el-select>
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
          <template v-if="col.key==='userId'">
            <el-button type="text">{{ scope.row.userId }}</el-button>
          </template>
          <template v-else-if="col.key==='toId'">
            <el-button type="text">{{ scope.row.toId }}</el-button>
          </template>
          <template v-else-if="col.key==='backInfo'">
            <el-button type="text" @click="view('book',scope.row)">查看</el-button>
          </template>
          <template v-else-if="col.key==='businessId'">
            <el-button type="text" @click="view('line',scope.row)">查看</el-button>
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
          <el-button type="text" @click="pass(scope.row.id)">通过</el-button>
          <el-button type="text" style="color: #F56C6C" @click="refuse(scope.row.id)">拒绝</el-button>
          <el-button type="text" @click="view('order',scope.row.id)">查看流水</el-button>
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
  </div>
</template>

<script>
import { openClassCol } from './col'
import { depositList, depositPass, depositRefuse } from '@/api/money'
import { failMessage, successMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'

export default {
  name: 'Deposit',
  components: {
  },
  data() {
    // 数据定义
    return {
      pickerOptionsDay: {
        shortcuts: getRecentTime(['day'])
      },
      tableData: [],
      classTime: '',
      addTime: '',
      statusList: {
        UNDER_REVIEW: '待处理',
        PASS: '通过',
        REFUSE: '拒绝',
        FAIL: '失败',
        SUCCESS: '成功'
      },
      search: {
        userId: null,
        state: null,
        createTimeStartTime: null,
        createTimeEndTime: null,
        disposeTimeStartTime: null,
        disposeTimeEndTime: null
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
    this.getTableData()
  },
  methods: {
    async pass(id) {
      const { code, message } = await depositPass({ id: id })
      if (code === 200) {
        successMessage(this, '操作成功!')
        await this.getTableData()
      } else {
        failMessage(this, message)
      }
    },
    async refuse(id) {
      const { code, message } = await depositRefuse({ id: id })
      if (code === 200) {
        successMessage(this, '操作成功!')
        await this.getTableData()
      } else {
        failMessage(this, message)
      }
    },
    view(path, id) {
      this.$router.push({ name: path, query: { id: id }})
    },
    selectTime(val, type) {
      if (type === 'classTime') {
        if (val && val.length) {
          [this.search.createTimeStartTime, this.search.createTimeEndTime] = val
        } else {
          [this.search.createTimeStartTime, this.search.createTimeEndTime] = [null, null]
        }
      } else {
        if (val && val.length) {
          [this.search.disposeTimeStartTime, this.search.disposeTimeEndTime] = val
        } else {
          [this.search.disposeTimeStartTime, this.search.disposeTimeEndTime] = [null, null]
        }
      }
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
        } = await depositList(post)
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
