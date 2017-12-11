<template>
  <md-layout md-align="end">
    <label class="switch">
      <input type="checkbox" v-model="checked" @click="handleClick">
      <span class="slider round" :class="theme"></span>
    </label>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-switch',
  props: ['initial', 'theme'],
  computed: {
    checked () {
      return this.initial
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  width: 37px;
  height: 18px;
  margin-right: 5px;
}

/* Hide default HTML checkbox */
.switch input {
  display:none;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #101929;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: white;
}

input:checked + .slider.white {
  background-color: #FAD232;
}

input:focus + .slider {
  box-shadow: 0 0 1px white;
}

input:checked + .slider:before {
  -webkit-transform: translateX(19px);
  -ms-transform: translateX(19px);
  transform: translateX(19px);
  background-color: #FAD232;
}

input:checked + .slider.white:before {
  background-color: white;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>

