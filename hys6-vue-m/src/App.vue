<template>
  <div id="indexapp">
    <router-view />
    <Loading />
  </div>
</template>
<script>
import Loading from "@/components/loading";
export default {
  name: "indexApp",
  data() {
    return {
      prefix: window.__MICRO_APP_BASE_ROUTE__ || "",
    };
  },
  components: {
    Loading,
  },
  methods: {
    dataListener(data) {
      // if (data.path && data.path != this.$route.path) {
      //   this.$router.push(data.path);
      //   alert("1");
      // }
    },
  },
  created() {
    // alert("开始");
    /** 绑定数据【data属性】监听事件 */
    if (window.__MICRO_APP_ENVIRONMENT__) {
      const data = window.microApp.getData(); // 返回基座下发的data数据
      this.$store.dispatch("setRequestPath", `/${data.serveURL.split("/")[1]}`);
    }
    // window.__MICRO_APP_ENVIRONMENT__ &&
    //   window.microApp.addDataListener(this.dataListener(), true);
  },
  destroyed() {
    // alert("销毁");
    /** 移除数据【data属性】监听事件 */
    // window.__MICRO_APP_ENVIRONMENT__ &&
    //   window.microApp.removeDataListener(this.dataListener);
  },
};
</script>

<style lang="less">
#indexapp {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol,
dl,
dd,
input,
textarea,
select,
td,
th {
  margin: 0;
  padding: 0;
}

.el-message--error .el-message__content {
  line-height: 20px;
}
ul li {
  list-style: none;
}
.mytree /deep/ {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  /*  .el-tree-node__expand-icon.is-leaf {
              display: none;
          } */

  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }

  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    font-size: 14px;
  }
}
</style>
