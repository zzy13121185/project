<template>
  <div class="mainTableContainer">
    <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="场地ID">
            <el-input v-model="search.siteId" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="教室ID">
            <el-input v-model="search.id" maxlength="20" clearable oninput="value=value.replace(/[^\d.]/g,'')" />
          </el-form-item>
        </el-col>

        <el-col :span="16" style="display: flex;flex-direction: row;justify-content: space-between">
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
          <div>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </div>
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
          <template v-if="col.key==='openTime'">
            openTime
          </template>
          <template v-else>
            <span v-if="scope.row[col.key] || scope.row[col.key]===0">
              {{ scope.row[col.key] }}
            </span>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="预约信息" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="routerTo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
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
    <createRoomBox
      v-if="showCreateBox"
      ref="createRoomBox"
      @handleClose="showCreateBox = false"
      @getTableData="getTableData"
    />
  </div>
</template>
<script>
import { roomDelete, roomList } from '@/api/site'
import { failMessage, successMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'
import { roomCol } from '@/views/place/col'
import createRoomBox from '@/views/place/roomComponent/createRoomBox.vue'

export default {

  name: 'Room',
  components: {
    // 引用外部组件
    createRoomBox
  },
  data() {
    return {
      showCreateBox: false,
      pickerOptions: {
        shortcuts: getRecentTime(['day', 'month', 'year'])
      },
      time: '',
      search: {
        id: null,
        siteId: null,
        billStartTime: null,
        billEndTime: null
      },
      tableCols: [],
      tableData: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10
      }
    }
  },
  mounted() {
    this.search.siteId = this.$route.query.siteId || null
    this.getTableData()
  },
  created() {
    this.tableCols = roomCol
  },
  methods: {
    async handleDelete({ id }) {
      const { code } = await roomDelete(id)
      if (code === 200) {
        successMessage(this, '删除成功！')
        await this.getTableData()
      } else {
        failMessage(this, '删除失败！')
      }
    },
    routerTo({ id }) {
      this.$router.push({
        name: 'booking',
        query: { id: id }
      })
    },
    async handleAdd() {
      this.showCreateBox = true
      await this.$nextTick()
      await this.$refs.createRoomBox.handleShow(null, '新增教室')
    },
    async handleUpdate(data) {
      this.showCreateBox = true
      await this.$nextTick()
      await this.$refs.createRoomBox.handleShow(data, '编辑教室')
    },
    selectTime(val) {
      [this.search.billStartTime, this.search.billEndTime] = val
    },
    handleSearch() {
      this.queryForm.page = 1
      this.getTableData()
    },
    async getTableData() {
      this.$newLoading(true)
      const post = { ...this.queryForm, ...this.search }
      try {
        const {
          data,
          code
        } = await roomList(post)
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
