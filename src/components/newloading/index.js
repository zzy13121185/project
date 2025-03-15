import Vue from 'vue'
import newloading from './index.vue'
const loadingBox = Vue.extend(newloading)
const newLoading = {
  install: (visible) => {
    let instance
    const removeObj = document.getElementById('imloading')
    if (visible === true) {
      if (removeObj === null) {
        instance = new loadingBox({
          data: {
            visible: true
          }
        }).$mount()
        document.body.appendChild(instance.$el)
      } else {
        document.body.removeChild(document.getElementById('imloading'))
      }
    } else if (visible === false) {
      if (removeObj) {
        document.body.removeChild(document.getElementById('imloading'))
      }
    }
  }
}
Vue.prototype.$newLoading = newLoading.install

export default newLoading
