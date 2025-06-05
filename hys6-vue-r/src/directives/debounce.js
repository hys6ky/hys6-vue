import Vue from "vue";

/**
 * 绑定方法
 * @param {Object} el - The element the directive is bound to.
 * @param {Object} binding - An vue directive object
 */
Vue.directive("debounce", {
  //防抖函数指令
  inserted(el, binding) {
    if (binding.value) {
      let [fn, event = "click", time = 300] = binding.value;
      let timer;
      let flag = true; //输入法标记
      if (event === "input") {
        el.addEventListener("compositionstart", () => {
          flag = false;
        });
        el.addEventListener("compositionend", () => {
          flag = true;
        });
      }
      el.addEventListener(event, () => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          if (flag) fn();
        }, time);
      });
    } else {
      el.addEventListener("click", (e) => {
        el.classList.add("is-disabled");
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
          el.classList.remove("is-disabled");
        }, 2000); //我这里设置的是2000毫秒也就是2秒
      });
    }
  },
});
