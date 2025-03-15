<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
      top="5vh"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item v-if="ruleForm.id" label="教室ID">
          <el-input v-model="ruleForm.id" disabled />
        </el-form-item>
        <el-form-item label="教室名称" prop="name">
          <el-input v-model="ruleForm.name" clearable maxlength="20" />
        </el-form-item>
        <el-form-item label="场地ID" prop="siteId">
          <el-input v-model="ruleForm.siteId" oninput="value=value.replace(/[^\d.]/g,'')" clearable maxlength="20" />
        </el-form-item>
        <!--      1-500-->
        <el-form-item label="最大人数" prop="maxNumber">
          <el-input-number v-model="ruleForm.maxNumber" controls-position="right" :min="1" :max="500" />
        </el-form-item>
        <el-form-item label="舞蹈阵型">
          <el-row>
            <el-col :span="3">行</el-col>
            <!--        1-100-->
            <el-col :span="9">
              <el-input-number v-model="ruleForm.rowNumber" controls-position="right" :min="1" :max="100" />
            </el-col>
            <el-col :span="3">列</el-col>
            <el-col :span="9">
              <el-input-number v-model="ruleForm.columnNumber" controls-position="right" :min="1" :max="100" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="正常时间" prop="normalTimeUnitPrice">
          <el-input-number v-model="ruleForm.normalTimeUnitPrice" controls-position="right" :min="1" :max="100000" /> (元/小时)
        </el-form-item>
        <el-form-item label="黄金时间">
          <el-input-number v-model="ruleForm.goldTimeUnitPrice" controls-position="right" :min="0" :max="100000" /> (元/小时)
        </el-form-item>
        <el-form-item label="优惠时间">
          <el-input-number v-model="ruleForm.discountTimeUnitPrice" controls-position="right" :min="0" :max="100000" /> (元/小时)
        </el-form-item>
        <div style="padding: 10px; background: #F2F6FC">
          <el-form-item label="营业时间" />
          <el-form-item label="工作日" required>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="weekdayStartTime">
                  <el-time-select
                      v-model="ruleForm.weekdayStartTime"
                      style="width: 100%"
                      placeholder="起始时间"
                      :editable="false"
                      :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                      maxTime: ruleForm.weekdayEndTime
                    }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center">~</el-col>
              <el-col :span="11">
                <el-form-item prop="weekdayEndTime">
                  <el-time-select
                      v-model="ruleForm.weekdayEndTime"
                      style="width: 100%"
                      placeholder="结束时间"
                      :editable="false"
                      :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                      minTime: ruleForm.weekdayStartTime
                    }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="周末节假日" required>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="restdayStartTime">
                  <el-time-select
                    v-model="ruleForm.restdayStartTime"
                    style="width: 100%"
                    placeholder="起始时间"
                    :editable="false"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                      maxTime: ruleForm.restdayEndTime
                    }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center">~</el-col>
              <el-col :span="11">
                <el-form-item prop="restdayEndTime">
                  <el-time-select
                    v-model="ruleForm.restdayEndTime"
                    style="width: 100%"
                    placeholder="结束时间"
                    :editable="false"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                      minTime: ruleForm.restdayStartTime
                    }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

        </div>

        <div style="padding: 10px; background: #F2F6FC ;margin: 20px 0">
          <el-form-item label="工作日"/>
          <el-form-item label="正常时间">
            <el-tag
              v-for="(tag,index) in normalTimeWeek"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleBoxCloseWeek(tag,'normal')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeWeekRange" @click="addWeek('normal')">编辑</el-button>
          </el-form-item>
          <el-form-item label="黄金时间">
            <el-tag
              v-for="(tag,index) in goldTimeWeek"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleBoxCloseWeek(tag,'gold')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeWeekRange" @click="addWeek('gold')">编辑</el-button>
          </el-form-item>
          <el-form-item label="优惠时间">
            <el-tag
              v-for="(tag,index) in freeTimeWeek"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleBoxCloseWeek(tag,'free')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeWeekRange" @click="addWeek('free')">编辑</el-button>
          </el-form-item>
          <el-form-item label="禁用时间">
            <template v-for="(tag) in restTimeListWeek">
              <el-tag
                  v-if="getValueByIndex(tag[0]) !== getValueByIndex(tag[1])"
                  :disable-transitions="false"
                  type="danger"
              >
                {{ getValueByIndex(tag[0]) }}~{{ getValueByIndex(tag[1]) }}
              </el-tag>
            </template>
          </el-form-item>
        </div>
        <div style="padding: 10px; background: #F2F6FC ;margin-top: 20px">
          <el-form-item label="周末节假日"/>
          <el-form-item label="正常时间">
            <el-tag
                v-for="(tag,index) in normalTime"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleBoxClose(tag,'normal')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeNormalRange" @click="add('normal')">编辑</el-button>
          </el-form-item>
          <el-form-item label="黄金时间">
            <el-tag
                v-for="(tag,index) in goldTime"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,'gold')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeNormalRange" @click="add('gold')">编辑</el-button>
          </el-form-item>
          <el-form-item label="优惠时间">
            <el-tag
                v-for="(tag,index) in freeTime"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(tag,'free')"
            >
              {{ tag.value }}
            </el-tag>
            <el-button type="primary" :disabled="!timeNormalRange" @click="add('free')">编辑</el-button>
          </el-form-item>
          <el-form-item label="禁用时间">
            <template v-for="(tag) in restTimeList">
              <el-tag
                  v-if="getValueByIndex(tag[0]) !== getValueByIndex(tag[1])"
                  :disable-transitions="false"
                  type="danger"
              >
                {{ getValueByIndex(tag[0]) }}~{{ getValueByIndex(tag[1]) }}
              </el-tag>
            </template>
          </el-form-item>
        </div>
        <el-form-item label="场地图片" style="margin-top: 20px">
          <uploadImg ref="upload" @uploadSuccess="uploadPicSuccess" />
        </el-form-item>
      </el-form>

      <el-row style="margin-top: 20px;text-align: center">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
      </el-row>

    </el-dialog>
    <el-dialog
      ref="connectDeviceDialog"
      title="选择时间"
      :visible.sync="dialogSelect"
      append-to-body
      width="500px"
    >
      <el-row>
        <el-col :span="24">
          <el-time-select
            v-model="startSelect"
            placeholder="起始时间"
            :editable="false"
            :picker-options="{
              start: ruleForm.restdayStartTime,
              step: '00:30',
              end: ruleForm.restdayEndTime,
              maxTime: ruleForm.restdayEndTime
            }"
          />
          ~
          <el-time-select
            v-model="endSelect"
            placeholder="结束时间"
            :editable="false"
            :picker-options="{
              start: ruleForm.restdayStartTime,
              step: '00:30',
              end: ruleForm.restdayEndTime,
              minTime: ruleForm.restdayStartTime
            }"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;text-align: center">
        <el-button type="primary" @click="confirmTime()">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      ref="connectDeviceDialog"
      title="选择时间"
      :visible.sync="dialogSelectWeek"
      append-to-body
      width="500px"
    >
      <el-row>
        <el-col :span="24">
          <el-time-select
            v-model="startSelectWeek"
            placeholder="起始时间"
            :editable="false"
            :picker-options="{
              start: ruleForm.weekdayStartTime,
              step: '00:30',
              end: ruleForm.weekdayEndTime,
              maxTime: ruleForm.weekdayEndTime
            }"
          />
          ~
          <el-time-select
            v-model="endSelectWeek"
            placeholder="结束时间"
            :editable="false"
            :picker-options="{
              start: ruleForm.weekdayStartTime,
              step: '00:30',
              end: ruleForm.weekdayEndTime,
              minTime: ruleForm.weekdayStartTime
            }"
          />
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;text-align: center">
        <el-button type="primary" @click="confirmTimeWeek()">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { roomAdd, roomUpdate } from '@/api/site'
import uploadImg from '@/components/uploadImg/index.vue'
import { successMessage, warningMessage } from '@/utils/notice'
import { pcaTextArr } from 'element-china-area-data'

export default {
  components: { uploadImg },
  data() {
    return {
      dialogSelect: false,
      dialogSelectWeek: false,
      startSelect: '',
      endSelect: '',
      startSelectWeek: '',
      endSelectWeek: '',
      dialogVisible: false,
      title: '新增场地',
      currentApi: null,
      pcaTextArr,
      ruleForm: {
        name: '',
        siteId: '',
        maxNumber: 1,
        rowNumber: 1,
        columnNumber: 1,
        normalTimeUnitPrice: 1,
        goldTimeUnitPrice: 0,
        discountTimeUnitPrice: 0,
        restdayStartTime: '',
        restdayEndTime: '',
        weekdayStartTime: '',
        weekdayEndTime: '',
        id: null,
        imgs: []
      },
      rules: {
        restdayStartTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        restdayEndTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ],
        weekdayStartTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        weekdayEndTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入场地名称',
            trigger: 'blur'
          }
        ],
        siteId: [
          {
            required: true,
            message: '请输入场地ID',
            trigger: 'blur'
          }
        ]
      },
      usedTime: [],
      normalTime: [],
      goldTime: [],
      freeTime: [],
      currentType: '',
      keyList: {
        normal: 'normalTime',
        gold: 'goldTime',
        free: 'freeTime'
      },
      restTimeList: [],
      usedTimeWeek: [],
      normalTimeWeek: [],
      goldTimeWeek: [],
      freeTimeWeek: [],
      currentTypeWeek: '',
      keyListWeek: {
        normal: 'normalTimeWeek',
        gold: 'goldTimeWeek',
        free: 'freeTimeWeek'
      },
      restTimeListWeek: [],
      fileList: [],
      fileName: ''
    }
  },
  computed: {
    timeNormalRange() {
      if (this.ruleForm.restdayStartTime && this.ruleForm.restdayEndTime) {
        return [this.getIndex(this.ruleForm.restdayStartTime), this.getIndex(this.ruleForm.restdayEndTime)]
      } else {
        return null
      }
    },
    timeWeekRange() {
      if (this.ruleForm.weekdayStartTime && this.ruleForm.weekdayEndTime) {
        return [this.getIndex(this.ruleForm.weekdayStartTime), this.getIndex(this.ruleForm.weekdayEndTime)]
      } else {
        return null
      }
    }
  },
  methods: {
    uploadPicSuccess(picList) {
      this.fileList = picList.map(o => {
        return o.url
      })
    },
    getValueByIndex(index) {
      let hour, min
      if (index % 2 === 0) {
        min = '00'
      } else {
        min = '30'
      }
      hour = Math.floor(index / 2)
      hour = hour < 10 ? '0' + hour : hour
      return `${hour}:${min}`
    },
    getRestTimeWeek() {
      if (this.usedTimeWeek.length === 0) {
        this.restTimeListWeek = [[this.getIndex(this.ruleForm.weekdayStartTime), this.getIndex(this.ruleForm.weekdayEndTime)]]
      } else {
        const rest = []
        let all = this.getNumberList(this.timeWeekRange)
        for (const site of this.usedTimeWeek) {
          if (site[0] === all[0]) {
            all = all.filter(o => {
              return o >= site[1]
            })
          } else if (site[0] > all[0]) {
            rest.push([all[0], site[0]])
            all = all.filter(o => {
              return o >= site[1]
            })
          }
        }
        if (all.length) {
          rest.push([all[0], all[all.length - 1]])
        }
        this.restTimeListWeek = rest
        console.log(rest)
      }
    },
    getRestTime() {
      console.log(this.usedTime, '!!!!!!!')
      if (this.usedTime.length === 0) {
        this.restTimeList = [[this.getIndex(this.ruleForm.restdayStartTime), this.getIndex(this.ruleForm.restdayEndTime)]]
      } else {
        const rest = []
        let all = this.getNumberList(this.timeNormalRange)
        for (const site of this.usedTime) {
          if (site[0] === all[0]) {
            all = all.filter(o => {
              return o >= site[1]
            })
          } else if (site[0] > all[0]) {
            rest.push([all[0], site[0]])
            all = all.filter(o => {
              return o >= site[1]
            })
          }
        }
        if (all.length) {
          rest.push([all[0], all[all.length - 1]])
        }
        if (rest.length === 1 && rest[0][0] === rest[0][1]) {

        } else {
          this.restTimeList = rest
        }

        console.log(rest)
      }
    },
    getNumberList([start, end]) {
      const addList = []
      for (let i = start; i < end + 1; i++) {
        addList.push(i)
      }
      return addList
    },
    hasError(start, end) {
      const newList = this.getNumberList([this.getIndex(start), this.getIndex(end)])
      let result = false
      for (const foo of this.usedTime) {
        const current = this.getNumberList(foo)
        let merged = [...newList, ...current]
        merged = Array.from(new Set(merged))
        if (merged.length < newList.length + current.length - 1) {
          result = true
        }
      }
      return result
    },
    hasErrorWeek(start, end) {
      const newList = this.getNumberList([this.getIndex(start), this.getIndex(end)])
      let result = false
      for (const foo of this.usedTimeWeek) {
        const current = this.getNumberList(foo)
        let merged = [...newList, ...current]
        merged = Array.from(new Set(merged))
        if (merged.length < newList.length + current.length - 1) {
          result = true
        }
      }
      return result
    },
    getIndex(value) {
      const [hour, min] = value.split(':')
      const minCount = min === '00' ? 0 : 1
      return Number(hour) * 2 + minCount
    },
    confirmTimeWeek() {
      const start = this.startSelectWeek
      const end = this.endSelectWeek
      if (this.hasErrorWeek(start, end)) {
        warningMessage(this, '存在时间交叉！')
      } else {
        this.dialogSelectWeek = false
        const key = this.keyListWeek[this.currentTypeWeek]
        this[key].push({
          start,
          end,
          value: `${start}~${end}`
        })
        this.usedTimeWeek.push([this.getIndex(start), this.getIndex(end)])
        this.usedTimeWeek = this.usedTimeWeek.sort((a, b) => {
          return a[0] - b[0]
        })
        this.startSelectWeek = ''
        this.endSelectWeek = ''
        this.getRestTimeWeek()
      }
    },
    confirmTime() {
      const start = this.startSelect
      const end = this.endSelect
      let aa = start.substring(3, 5)
      let bb = end.substring(3, 5)
      if (this.hasError(start, end)) {
        warningMessage(this, '存在时间交叉！')
      } else {
        if (aa !== bb || start === end) {
          warningMessage(this, '时段的选择最小选择是1小时！')
        } else {
          this.dialogSelect = false
          const key = this.keyList[this.currentType]
          this[key].push({
            start,
            end,
            value: `${start}~${end}`
          })
          this.usedTime.push([this.getIndex(start), this.getIndex(end)])
          this.usedTime = this.usedTime.sort((a, b) => {
            return a[0] - b[0]
          })
          this.startSelect = ''
          this.endSelect = ''
          this.getRestTime()
        }
      }
    },
    handleBoxCloseWeek(tag, type) {
      const {
        start,
        end
      } = tag
      for (let i = 0; i < this.usedTimeWeek.length; i++) {
        if (this.usedTimeWeek[i][0] === this.getIndex(start) && this.usedTimeWeek[i][1] === this.getIndex(end)) {
          this.usedTimeWeek.splice(i, 1)
        }
      }
      const key = this.keyListWeek[type]
      this[key].splice(this[key].indexOf(tag), 1)
      this.getRestTimeWeek()
    },
    handleBoxClose(tag, type) {
      const {
        start,
        end
      } = tag
      for (let i = 0; i < this.usedTime.length; i++) {
        if (this.usedTime[i][0] === this.getIndex(start) && this.usedTime[i][1] === this.getIndex(end)) {
          this.usedTime.splice(i, 1)
        }
      }
      const key = this.keyList[type]
      this[key].splice(this[key].indexOf(tag), 1)
      this.getRestTime()
    },
    add(type) {
      this.currentType = type
      this.dialogSelect = true
    },
    addWeek(type) {
      this.currentTypeWeek = type
      this.dialogSelectWeek = true
    },
    addSecond(val) {
      if (val.length >= 8) {
        return `${val}`
      } else {
        return `${val}:00`
      }

    },
    getTimesDTO() {
      const timesDTO = []
      for (const foo of this.normalTime) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'RESTDAY',
          timeType: 'NORMAL',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.goldTime) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'RESTDAY',
          timeType: 'GOLD',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.freeTime) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'RESTDAY',
          timeType: 'DISCOUNT',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.normalTimeWeek) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'WEEK',
          timeType: 'NORMAL',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.goldTimeWeek) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'WEEK',
          timeType: 'GOLD',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.freeTimeWeek) {
        const start = foo.start
        const end = foo.end
        timesDTO.push({
          dayType: 'WEEK',
          timeType: 'DISCOUNT',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.restTimeList) {
        const start = this.getValueByIndex(foo[0])
        const end = this.getValueByIndex(foo[1])
        timesDTO.push({
          dayType: 'RESTDAY',
          timeType: 'NON_DUE',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      for (const foo of this.restTimeListWeek) {
        const start = this.getValueByIndex(foo[0])
        const end = this.getValueByIndex(foo[1])
        timesDTO.push({
          dayType: 'WEEK',
          timeType: 'NON_DUE',
          startTime: this.addSecond(start),
          endTime: this.addSecond(end)
        })
      }
      return timesDTO
    },
    async commit() {
      const post = Object.assign({}, this.ruleForm)
      post.restdayEndTime = this.addSecond(post.restdayEndTime)
      post.restdayStartTime = this.addSecond(post.restdayStartTime)
      post.weekdayStartTime = this.addSecond(post.weekdayStartTime)
      post.weekdayEndTime = this.addSecond(post.weekdayEndTime)
      post.timesDTO = this.getTimesDTO()
      post.imgs = this.fileList
      const { code, message } = await this.currentApi(post)
      if (code === 200) {
        this.handleClose()
        successMessage(this, '操作成功！')
        this.$emit('getTableData')
      } else {
        warningMessage(this, message)
      }
    },
    handleClose() {
      this.$emit('handleClose')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.commit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleShow(data, title) {
      this.title = title
      if (data === null) {
        this.currentApi = roomAdd
      } else {
        const timeList = ['restdayEndTime', 'restdayStartTime', 'weekdayEndTime', 'weekdayStartTime']
        for (const dataKey in this.ruleForm) {
          if (timeList.includes(dataKey)) {
            if (data[dataKey].length > 5) {
              this.ruleForm[dataKey] = data[dataKey].slice(0, 5)
            } else {
              this.ruleForm[dataKey] = data[dataKey]
            }
          } else {
            this.ruleForm[dataKey] = data[dataKey]
          }
        }
        for (const foo of data.timesVO) {
          const startTime = foo.startTime.length > 5 ? foo.startTime.slice(0, 5) : foo.startTime
          const endTime = foo.endTime.length > 5 ? foo.endTime.slice(0, 5) : foo.endTime
          const obj = {
            start: foo.startTime,
            end: foo.endTime,
            value: `${startTime}~${endTime}`
          }
          if (foo.dayType === 'RESTDAY') {
            if (foo.timeType === 'NORMAL') {
              this.normalTime.push(obj)
            } else if (foo.timeType === 'GOLD') {
              this.goldTime.push(obj)
            } else if (foo.timeType === 'DISCOUNT') {
              this.freeTime.push(obj)
            } else if (foo.timeType === 'NON_DUE') {
              this.restTimeList.push([this.getIndex(startTime), this.getIndex(endTime)])
            }
          } else {
            if (foo.timeType === 'NORMAL') {
              this.normalTimeWeek.push(obj)
            } else if (foo.timeType === 'GOLD') {
              this.goldTimeWeek.push(obj)
            } else if (foo.timeType === 'DISCOUNT') {
              this.freeTimeWeek.push(obj)
            } else if (foo.timeType === 'NON_DUE') {
              this.restTimeListWeek.push([this.getIndex(startTime), this.getIndex(endTime)])
            }
          }
        }
        this.currentApi = roomUpdate
      }
      this.dialogVisible = true
      await this.$nextTick()
      if (data.imgs?.length) {
        this.$refs.upload.setImage(data.imgs)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
}

::v-deep {
  .el-input-number--medium {
    width: 120px;
  }
}

.line {
  width: 100%;
  height: auto;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .title {
    width: 30%;
    text-align: right;
    padding-right: 20px;
  }

  .content {
    padding-left: 20px;
    flex: 1;
    text-align: left;
  }
}
</style>
