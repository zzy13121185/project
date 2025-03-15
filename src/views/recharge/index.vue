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
            <el-form-item label="充值时间">
              <el-date-picker
                v-model="rechargeTime"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                :picker-options="pickerOptionsDay"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="selectTime"
              />
            </el-form-item>
          </el-col>

          <!--          <el-col :span="4">-->
          <!--            <el-form-item label="充值类型">-->
          <!--              <el-select v-model="search.type" placeholder="请选择充值类型" clearable>-->
          <!--                <el-option v-for="(value, key, index) in typeList" :key="key" :label="value" :value="key" />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
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
            <el-button type="text" @click="routerTo('student',scope.row.userId)">{{ scope.row.userId }}</el-button>
          </template>
          <template v-else-if="col.key==='id'">
            <el-button type="text" @click="routerTo('order',scope.row.userId)">{{ scope.row.toId }}</el-button>
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
  </div>
</template>

<script>
import { rechargeList } from '@/api/money'
import { failMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'
import { openClassCol } from './col'

export default {
  name: 'Recharge',
  components: {
  },
  data() {
    // 数据定义
    return {
      pickerOptionsDay: {
        shortcuts: getRecentTime(['day'])
      },
      tableData: [],
      rechargeTime: '',

      typeList: {
        BUY_SITE: '场地订单',
        BUY_CLASS: '课程订单'
      },
      search: {
        id: null,
        userId: null,
        createTimeStartTime: null,
        createTimeEndTime: null
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
    routerTo(path, id) {
      this.$router.push({ name: path, query: { id: id }})
    },
    selectTime(val, type) {
      if (val && val.length) {
        [this.search.createTimeStartTime, this.search.createTimeEndTime] = val
      } else {
        [this.search.createTimeStartTime, this.search.createTimeEndTime] = [null, null]
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
        } = await rechargeList(post)
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
