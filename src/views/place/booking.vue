<template>
  <div class="mainTableContainer">
    <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="场地ID">
            <el-input v-model="search.siteId" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="教室ID">
            <el-input
                v-model="search.danceRoomId"
                maxlength="20"
                clearable
                oninput="value=value.replace(/[^\d.]/g,'')"
            />
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
                @change="selectTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="开课状态">
            <el-select v-model="search.status" placeholder="请选择时段状态" clearable>
              <el-option v-for="(value, key, index) in statusList" :key="key" :label="value" :value="key"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
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
          <template v-if="col.key==='status'">
            {{ statusList[scope.row.status] }}
          </template>
          <template v-else-if="col.key==='siteId'">
            <el-button type="text" @click="routerTo(scope.row.siteId,'/place/index')">{{ scope.row.siteId }}</el-button>
          </template>
          <template v-else-if="col.key==='ownerId'">
            <el-button
                v-if="scope.row.ownerId"
                type="text"
                @click="routerTo(scope.row.ownerId,'/student')"
            >{{ scope.row.ownerId }}
            </el-button>
            <span v-if="!scope.row.ownerId">-</span>
          </template>
          <template v-else-if="col.key==='openClassId'">
            <el-button
                v-if="scope.row.openClassId"
                type="text"
                @click="routerTo(scope.row.openClassId,'/commencement')"
            >{{ scope.row.openClassId }}
            </el-button>
            <span v-if="!scope.row.openClassId">-</span>
          </template>
          <template v-else-if="col.key==='unitPrice'">
            {{ scope.row.unitPrice }}/小时
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
              v-if="scope.row.status === 'FREE'"
              type="text"
              @click="handleSwitch(scope.row.id,'close')"
          >关闭时段
          </el-button>
          <el-button
              v-if="scope.row.status === 'NON_DUE'"
              type="text"
              @click="handleSwitch(scope.row.id,'open')"
          >开放时段
          </el-button>
          <el-button v-if="scope.row.status === 'BOOKED'" type="text">已预定</el-button>
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
import { bookList, closeTimeRange, openTimeRange } from '@/api/site'
import { failMessage, successMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'
import { bookingCol } from '@/views/place/col'

export default {

  name: 'Room',
  components: {
    // 引用外部组件
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: getRecentTime(['day'])
      },
      time: '',
      search: {
        danceRoomId: null,
        siteId: null,
        startTime: null,
        endTime: null,
        status: null
      },
      tableCols: [],
      tableData: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10
      },
      statusList: {
        BOOKED: '已预定',
        NON_DUE: '不可预定',
        FREE: '空闲'
      }
    }
  },
  mounted () {
    this.search.id = this.$route.query.id || null
    this.getTableData()
  },
  created () {
    this.tableCols = bookingCol
  },
  methods: {
    async handleSwitch (id, flag) {
      const api = flag === 'open' ? openTimeRange : closeTimeRange
      const { code } = await api({ id: id })
      if (code === 200) {
        successMessage(this, '操作成功！')
        await this.getTableData()
      } else {
        failMessage(this, '操作失败！')
      }
    },
    routerTo (id, path) {
      this.$router.push({
        path: path,
        query: { id: id }
      })
    },
    selectTime (val) {
      if (val && val.length) {
        [this.search.startTime, this.search.endTime] = val
      } else {
        this.search.startTime = null
        this.search.endTime = null
      }
    },
    handleSearch () {
      this.queryForm.page = 1
      this.getTableData()
    },
    async getTableData () {
      this.$newLoading(true)
      for (const postKey in this.search) {
        this.search[postKey] = this.search[postKey] ? this.search[postKey] : null
      }
      const post = { ...this.queryForm, ...this.search }
      try {
        const {
          data,
          code
        } = await bookList(post)
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
    handleCurrentChange (val, size = '') {
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
