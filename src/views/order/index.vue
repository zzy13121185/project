<template>
  <div class="mainTableContainer">
    <header class="headerStyle">
      <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="订单ID">
              <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="下单ID">
              <el-input v-model="search.userId" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="收款ID">
              <el-input v-model="search.toId" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单状态">
              <el-select v-model="search.state" placeholder="请选择订单状态" clearable>
                <el-option v-for="(value, key, index) in statusList" :key="key" :label="value" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单类型">
              <el-select v-model="search.type" placeholder="请选择订单类型" clearable>
                <el-option v-for="(value, key, index) in typeList" :key="key" :label="value" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="classTime"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                :picker-options="pickerOptionsMonth"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'classTime')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单生效时间">
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
            <el-button type="text" @click="view(scope.row)">查看</el-button>
          </template>
          <template v-else>
            <span v-if="scope.row[col.key] || scope.row[col.key]===0">
              {{ scope.row[col.key] }}
            </span>
            <span v-else>-</span>
          </template>
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
    <infoBox v-if="showInfoBox" ref="infoBox" @handleClose="showInfoBox = false" />
  </div>
</template>

<script>
import { openClassCol } from './col'
import { orderList } from '@/api/course'
import { failMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'
import infoBox from '@/views/order/infoBox.vue'

export default {
  name: 'Commencement',
  components: {
    infoBox
  },
  data() {
    // 数据定义
    return {
      pickerOptionsMonth: {
        shortcuts: getRecentTime(['month'])
      },
      pickerOptionsDay: {
        shortcuts: getRecentTime(['day'])
      },
      tableData: [],
      showInfoBox: false,
      classTime: '',
      addTime: '',
      statusList: {
        PLACE_ORDER: '已下单',
        FINISH: '已完成',
        REFUNDED: '已退款'
      },
      typeList: {
        BUY_SITE: '场地订单',
        BUY_CLASS: '课程订单'
      },
      search: {
        id: null,
        userId: null,
        toId: null,
        state: null,
        type: null,
        createTimeStartTime: null,
        createTimeEndTime: null,
        entryIntoForceTimeStartTime: null,
        entryIntoForceTimeEndTime: null
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
    async view(foo) {
      this.showInfoBox = true
      await this.$nextTick()
      await this.$refs.infoBox.handleShow(foo)
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
          [this.search.entryIntoForceTimeStartTime, this.search.entryIntoForceTimeEndTime] = val
        } else {
          [this.search.entryIntoForceTimeStartTime, this.search.entryIntoForceTimeEndTime] = [null, null]
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
        } = await orderList(post)
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
