<template>
  <div class="mainTableContainer">
    <el-form ref="form" :model="search" label-width="80px" style="width: 100%;" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="场地ID">
            <el-input v-model="search.id" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="场地昵称">
            <el-input v-model="search.name" maxlength="20" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="场主ID">
            <el-input v-model="search.farmersId" maxlength="20" oninput="value=value.replace(/[^\d.]/g,'')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="display: flex;flex-direction: row;justify-content: space-between">
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
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="省市区">
            <el-cascader
              v-model="selectedOptions"
              style="width: 260px"
              size="large"
              :options="pcaTextArr"
              @change="selectArea"
            />
          </el-form-item>
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
          <template v-if="col.key==='place'">
            {{ getPlace(scope.row) }}
          </template>
          <template v-else>
            <span v-if="scope.row[col.key] || scope.row[col.key]===0">
              {{ scope.row[col.key] }}
            </span>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="场地信息" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGetDetail(scope.row)">查看</el-button>
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="舞室管理" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="routerTo(scope.row)">查看</el-button>
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
    <createBox v-if="showCreateBox" ref="createBox" @handleClose="showCreateBox = false" @getTableData="getTableData" />
    <placeInfoBox v-if="showPlaceInfoBox" ref="placeInfoBox" @handleClose="showPlaceInfoBox = false" />
  </div>
</template>
<script>
import { siteCancel, siteList } from '@/api/site'
import { failMessage, successMessage } from '@/utils/notice'
import { getRecentTime } from '@/utils/time'
import { placeCol } from '@/views/place/col'
import createBox from '@/views/place/createBox.vue'
import placeInfoBox from '@/views/place/placeInfoBox.vue'
import { pcaTextArr, regionData } from 'element-china-area-data'

export default {

  name: 'Main',
  components: {
    // 引用外部组件
    createBox,
    placeInfoBox
  },
  data() {
    return {
      showCreateBox: false,
      showPlaceInfoBox: false,
      pickerOptions: {
        shortcuts: getRecentTime(['day', 'month', 'year'])
      },
      name: 'info',
      regionData,
      pcaTextArr,
      time: '',
      tableCols: [],
      tableData: [],
      total: 0,
      queryForm: {
        page: 1,
        size: 10
      },
      selectedOptions: [],
      search: {
        id: null,
        name: null,
        farmersId: null,
        billStartTime: null,
        billEndTime: null
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.search.id = this.$route.query.id
    }
    this.getTableData()
  },
  created() {
    this.tableCols = placeCol
  },
  methods: {
    routerTo({ id }) {
      this.$router.push({ name: 'room', query: { siteId: id }})
    },
    async handleGetDetail(data) {
      this.showPlaceInfoBox = true
      await this.$nextTick()
      this.$refs.placeInfoBox.handleShow(data)
    },
    getPlace(data) {
      return `${data.province}${data.city}${data.county}${data.address}`
    },
    async handleAdd() {
      this.showCreateBox = true
      await this.$nextTick()
      await this.$refs.createBox.handleShow(null, '新增场地')
    },
    async edit(data) {
      this.showCreateBox = true
      await this.$nextTick()
      await this.$refs.createBox.handleShow(data, '编辑场地')
    },
    selectArea(val) {
      console.log(val)
    },
    selectTime(val) {
      console.log(val)
    },
    handleSearch() {
      this.queryForm.page = 1
      this.getTableData()
    },
    async handleDelete({ id }) {
      const { code } = await siteCancel({ id })
      if (code === 200) {
        successMessage(this, '操作成功！')
        await this.getTableData()
      } else {
        failMessage(this, '操作失败！')
      }
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
        } = await siteList(post)
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
