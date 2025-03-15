/**
 * @method submit successfully
 * @param vThis Object
 * @param info String
 * */
function successMessage(vThis, info, offset) {
  vThis.$message({
    message: info,
    dangerouslyUseHTMLString: true,
    type: 'success',
    offset: offset
  })
}
/**
 * @method submit failed
 * @param vThis Object
 * @param info String
 * */
function failMessage(vThis, info) {
  vThis.$message.error({
    message: info,
    type: 'error',
    dangerouslyUseHTMLString: true,
    customClass: 'global-message'
  })
}
/**
 * @method submit warning
 * @param vThis Object
 * @param info String
 * */
function warningMessage(vThis, info) {
  vThis.$message({
    message: info,
    dangerouslyUseHTMLString: true,
    type: 'warning'
  })
}
/**
 * @method primary warning
 * @param vThis Object
 * @param info String
 * */
function primaryMessage(vThis, info) {
  vThis.$message({
    message: info,
    dangerouslyUseHTMLString: true
  })
}
/**
 * @method submit successNotice
 * @param vThis Object
 * @param title String
 * @param info String
 * */
function successNotice(vThis, title, info) {
  vThis.$notify({
    title: title,
    offset: 35,
    message: info,
    dangerouslyUseHTMLString: true,
    type: 'success'
  })
}
/**
 * @method submit alarmNotice
 * @param vThis Object
 * @param title String
 * @param info String
 * */
function alarmNotice(vThis, title, info) {
  vThis.$notify.error({
    title: title,
    dangerouslyUseHTMLString: true,
    message: info
  })
}
/**
 * @method submit warningNotice
 * @param vThis Object
 * @param title String
 * @param info String
 * */
function warningNotice(vThis, title, info) {
  vThis.$notify({
    title: title,
    offset: 35,
    message: info,
    duration: 5000,
    showClose: false,
    dangerouslyUseHTMLString: true,
    type: 'warning'
  })
}
/**
 * @method confirmNotice
 * @param vThis Object
 * @param title String
 * @param info String
 * @param sureBtnInfo
 * @param cancelBtnInfo
 * @param callSuccessInfo
 * @param callFailInfo
 * */
function confirmNotice(vThis, title, info, sureBtnInfo, cancelBtnInfo, callSuccessInfo, callFailInfo) {
  vThis.$confirm(info, title, {
    confirmButtonText: sureBtnInfo,
    cancelButtonText: cancelBtnInfo,
    type: 'warning'
  }).then(() => {
    vThis.$message({
      type: 'success',
      dangerouslyUseHTMLString: true,
      message: callSuccessInfo
    })
  }).catch(() => {
    vThis.$message({
      type: 'info',
      dangerouslyUseHTMLString: true,
      message: callFailInfo
    })
  })
}

/**
 * @method confirmNoticeCb
 * @param vThis Object
 * @param title String
 * @param info String
 * @param sureBtnInfo
 * @param cancelBtnInfo
 * @param cbSuccess
 * @param cbFail
 * */
function confirmNoticeCb({
  vThis,
  title = '提示',
  info,
  sureBtnInfo = '确定',
  cancelBtnInfo = '取消',
  cbSuccess,
  cbFail
}) {
  vThis.$confirm(info, title, {
    confirmButtonText: sureBtnInfo,
    cancelButtonText: cancelBtnInfo,
    type: 'warning'
  }).then(() => {
    typeof cbSuccess === 'function' && cbSuccess()
  }).catch(() => {
    typeof cbFail === 'function' && cbFail()
  })
}

/**
 * @Description: loading
 * @Params: vThis {vueComponent} Vue
 * @Params: target {element} 目标元素
 * @Params: text {string} 描述文字
 * @Params: body {boolean} 是否插入body
 * @Params: cla {string} 自定义类名
 * @Author: @8313
 * @Date: 2021/7/15 9:45
 */
let loading = null

function loadingNotice() {
  const { vThis, target, text = 'loading...', body = true, cla } = arguments[0]
  loading = vThis.$loading({
    target: document.querySelector(target),
    lock: true,
    body: body,
    text: text,
    background: 'rgba(0, 0, 0, 0.3)',
    spinner: 'el-icon-loading',
    customClass: cla
  })
}

function loadingNoticeClose() {
  if (loading) {
    loading.close()
  }
}

export {
  successMessage,
  failMessage,
  warningMessage,
  primaryMessage,
  successNotice,
  alarmNotice,
  warningNotice,
  confirmNotice,
  confirmNoticeCb,
  loadingNotice,
  loadingNoticeClose
}
