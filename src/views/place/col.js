export const placeCol = [
  { name: '场地ID', key: 'id' },
  { name: '场地名称', key: 'name' },
  { name: '场主ID', key: 'farmersId' },
  { name: '场主昵称', key: 'farmersName' },
  { name: '营收流水(元)', key: 'totalIncome' },
  { name: '分成比列(%)', key: 'integralGetTotal' },
  { name: '位置', key: 'place' }
]
export const roomCol = [
  { name: '场地ID', key: 'siteId' },
  { name: '场地名称', key: 'siteName' },
  { name: '教室ID', key: 'id' },
  { name: '教室名称', key: 'name' },
  { name: '最大人数', key: 'maxNumber' },
  { name: '累计收入(元)', key: 'totalOrderMoney' },
  { name: '开放时间', key: 'openTime' }
]

export const bookingCol = [
  {
    name: '教室ID',
    key: 'danceRoomId'
  },
  {
    name: '教室名称',
    key: 'danceRoomName'
  },
  {
    name: '日期',
    key: 'date'
  },
  {
    name: '时段',
    key: 'times'
  },
  {
    name: '时段状态',
    key: 'status'
  },
  {
    name: '预约人',
    key: 'ownerId'
  },
  {
    name: '开课信息',
    key: 'openClassId'
  },
  { name: '场地ID', key: 'siteId' },
  { name: '场地名称', key: 'siteName' },
  { name: '最大人数', key: 'maxNumber' },
  {
    name: '时段价格',
    key: 'unitPrice'
  }
]
