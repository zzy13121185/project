<template>
  <div
    v-if="visible"
    id="imloading"
    class="contain"
  >
    <lottie
      :anim-created="handleAnimation"
      :height="200"
      :options="options"
      :width="300"
      class="item"
    />
  </div>
</template>
<script>
import * as animation from '../../../public/lib/loading/data.json'
export default {
  data() {
    return {
      visible: false,
      options: { animationData: animation.default },
      animationSpeed: 4,
      anim: {}
    }
  },
  methods: {
    // eslint-disable-next-line object-curly-spacing
    handleAnimation: function(anim) {
      this.anim = anim
    }
  }
}
</script>
<style lang="scss" scoped>
.contain {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  // @include ftLayout(row);
  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -100px !important;
    margin-left: -150px !important;
  }
}
</style>
