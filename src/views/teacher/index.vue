<template>
  <div class="mainTableContainer">
    <header class="headerStyle">
      <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="ID">
              <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="手机号">
              <el-input v-model="search.phone" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称">
              <el-input v-model="search.nickname" maxlength="20" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="查询时间">
              <el-date-picker
                v-model="time"
                class="input"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'time')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="营收流水">
              <el-col :span="11">
                <el-input v-model="search.billStart" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
              </el-col>
              <el-col class="line" :span="2">~</el-col>
              <el-col :span="11">
                <el-input v-model="search.billEnd" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最近活跃时间">
              <el-date-picker
                v-model="activeTime"
                class="input"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right"
                @change="val => selectTime(val,'activeTime')"
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
        v-for="col in tableCols"
        :key="col.key"
        align="center"
        :column-key="col.key"
        :label="col.name"
        :min-width="col.minWidth || ''"
        :prop="col.key"
        :width="col.width || ''"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="col.key==='avatar'">
            <!--            <el-avatar shape="square" size="large" :src="scope.row.pic" />-->
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.pic"
              :preview-src-list="[scope.row.pic]"
            />
          </template>
          <template v-else-if="col.key==='class'">
            <el-button type="text" @click="searchClass(scope.row)">查看</el-button>
          </template>
          <template v-else-if="col.key === 'order'">
            <el-button type="text" @click="searchOrder(scope.row)">查看</el-button>
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
          <el-button
            type="text"
            style="color: #F56C6C"
            @click="handleDelete(scope.row)"
          >取消资格</el-button>
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
    <searchBox v-if="showSearchBox" ref="searchBox" @handleClose="showSearchBox = false" @getTableData="getTableData" />
    <cancelBox v-if="showCancelBox" ref="cancelBox" @handleClose="showCancelBox = false" @getTableData="getTableData" />
  </div>
</template>

<script>
import { teacherList } from '@/api/teacher'
import { failMessage } from '@/utils/notice'
import { getRecentTime, setOriginTime } from '@/utils/time'
import { mapState } from 'vuex'
import cancelBox from './cancelBox.vue'
import { teacherCol } from './col'
import searchBox from './search.vue'

export default {
  name: 'Teacher',
  components: {
    // 引用外部组件
    searchBox,
    cancelBox
  },
  data() {
    // 数据定义
    return {
      pickerOptions: {
        shortcuts: getRecentTime(['month'])
      },
      tableData: [],
      time: [],
      activeTime: '',
      search: {
        page: 1,
        size: 10,
        id: null,
        nickname: null,
        phone: null,
        billStartTime: null,
        billEndTime: null,
        billStart: null,
        billEnd: null,
        startLastLoginTime: null,
        endLastLoginTime: null
      },
      tableCols: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10
      },
      showSearchBox: false,
      showCancelBox: false
    }
  },
  computed: {

    // 计算属性
    ...mapState({})
  },
  watch: {},
  created() {
    this.tableCols = teacherCol
  },
  mounted() {
    this.time = setOriginTime()
    this.search.billStartTime = setOriginTime()[0]
    this.search.billEndTime = setOriginTime()[1]
    this.search.id = this.$route.query.id || ''
    this.getTableData()
  },
  methods: {
    async handleAdd() {
      this.showSearchBox = true
      this.$nextTick(() => {
        this.$refs.searchBox.handleShow()
      })
    },
    async handleDelete(data) {
      this.showCancelBox = true
      await this.$nextTick()
      this.$refs.cancelBox.handleShow(data)
      // const { code } = await teacherCancel({ id })
      // if (code === 200) {
      //   successMessage(this, '取消成功！')
      //   await this.getTableData()
      // }
    },
    searchOrder({ id }) {
      this.$router.push({ name: 'order', query: { id: id }})
    },
    searchClass({ id }) {
      this.$router.push({ name: 'commencement', query: { id: id }})
    },
    selectTime(val, type) {
      if (type === 'time') {
        if (val && val.length) {
          [this.search.billStartTime, this.search.billEndTime] = val
        } else {
          [this.search.billStartTime, this.search.billEndTime] = [null, null]
        }
      } else {
        if (val && val.length) {
          [this.search.startLastLoginTime, this.search.endLastLoginTime] = val
        } else {
          [this.search.startLastLoginTime, this.search.endLastLoginTime] = [null, null]
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
      if (post.billStart > post.billEnd) {
        const billStart = post.billStart
        const billEnd = post.billEnd
        post.billStart = billEnd
        post.billEnd = billStart
      }

      try {
        const {
          data,
          code
        } = await teacherList(post)
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
