export function toTime(timeStamp) {
  let month = timeStamp.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = timeStamp.getDate()
  day = day < 10 ? '0' + day : day
  return `${timeStamp.getFullYear()}-${month}-${day}`
}

export function setOriginTime(num = 7) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
  return [`${toTime(start)} 00:00:00`, `${toTime(end)} 23:59:59`]
}

export function getRecentTime(list = ['day', 'week', 'month', 'year']) {
  const typeList = {
    day: {
      name: '最近一天',
      count: 1
    },
    week: {
      name: '最近一周',
      count: 7
    },
    month: {
      name: '最近一月',
      count: 30
    },
    year: {
      name: '最近一年',
      count: 365
    }
  }
  const returnList = []
  for (const listElement of list) {
    returnList.push({
      text: typeList[listElement].name,
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * (typeList[listElement].count))
        picker.$emit('pick', [start, end])
      }
    })
  }
  return returnList
}
