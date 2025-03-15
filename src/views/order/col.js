export const openClassCol = [
  { name: '订单ID', key: 'id' },
  { name: '订单类型', key: 'orderType' },
  { name: '下单时间', key: 'createTime', width: 180 },
  { name: '订单生效时间', key: 'entryIntoForceTime', width: 180 },
  { name: '下单用户ID', key: 'userId' },
  { name: '收款用户ID', key: 'toId' },
  { name: '订单金额（元）', key: 'orderMoney' },
  { name: '平台抽佣（元）', key: 'platformSettleRatio' },
  { name: '支付方式', key: 'payType' },
  { name: '订单状态', key: 'state' },
  { name: '退款信息', key: 'backInfo' },
  // 具体业务的标识id 当是场地订单时：场地id 当是课程订单时：开课id
  { name: '开课/场地ID', key: 'businessId' }
]
