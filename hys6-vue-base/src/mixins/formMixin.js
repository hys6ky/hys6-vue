export default {
  props: {
    formRules: {
      type: Object,
      default: () => {},
    },
    formConfig: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tooltipFlag: false,
    };
  },
  methods: {
    // 从外部验证表单是否必填项满足条件
    validated(callback) {
      this.$refs[this.formConfig.ref].validate((valid) => {
        callback();
      });
    },
    // 将子组件的表单内容传递给父表单
    transferData() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formConfig.ref].validate((valid) => {
          if (valid) {
            resolve(this.formData);
          } else {
            reject("err");
          }
        });
      });
    },
    visibilityChange(event) {
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      dom.offsetWidth <= dom.firstElementChild.offsetWidth
        ? (this.tooltipFlag = false)
        : (this.tooltipFlag = true);
    },
    closeVisible() {
      this.tooltipFlag = true;
    },
  },
};
