<template>
  <div class="bytree box-sizing d-flex flex-column">
    <el-input placeholder="请搜索" v-model="filterText"> </el-input>
    <div class="mt-20 flex-1 overflow-x-hidden overflow-y-auto" id="treeWrap">
      <el-tree
        :indent="0"
        :default-expand-all="expandAll"
        class="tree-line"
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        node-key="id"
        ref="tree"
        @node-click="handleNodeClick"
      >
        <span
          slot-scope="{ node, data }"
          class="nodetip"
          v-if="data.type === 'text'"
        >
          <el-tooltip
            effect="dark"
            :disabled="tooltipFlag"
            placement="top-start"
          >
            <div slot="content">
              <div
                v-if="type === 'indexDefine'"
                v-html="getValue(data.description)"
              ></div>
              <div v-else>{{ data.labelText }}</div>
            </div>
            <div
              @mouseenter="visibilityChange($event)"
              @mouseleave="closeVisible"
            >
              <i
                class="el-icon-document mr-10 treeNodeIcon"
                v-if="!data.children"
              ></i>
              <i
                class="mr-10 treeNodeIcon"
                :class="
                  currentId === data.id
                    ? 'el-icon-folder-opened'
                    : 'el-icon-folder'
                "
                v-else-if="data.children.length === 0"
              ></i>
              <span
                v-if="type === 'groupIndex'"
                @dragstart="dragstart($event, data.label, data.id)"
              >
                <span draggable="true" v-html="node.label"></span>
              </span>
              <span
                v-else
                v-html="node.label"
                :class="
                  currentId === data.id && !data.children && 'currentNode'
                "
              ></span>
            </div>
          </el-tooltip>
        </span>
        <span
          slot-scope="{ node, data }"
          v-else-if="data.type === 'add'"
          class="ml-5 w100"
        >
          <div>
            <i class="el-icon-plus mr-10 treeNodeIcon"></i>
            <span
              @mouseenter="visibilityChange($event)"
              @mouseleave="closeVisible"
              class="d-inline-block addNode"
              >{{ node.label }}</span
            >
          </div>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "ByTree",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "showLable",
      }),
    },
    type: {
      type: String,
      default: "",
    },
    expandAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterText: "",
      tooltipFlag: true,
      currentId: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getValue(value) {
      return value.replace(/\n/g, "<br/>");
    },
    filterNode(value, data, node) {
      data.showLable = data.label;
      if (!value) return true;
      if (data.showLable.includes(value) || data.showLable.toUpperCase().includes(value.toUpperCase())) {
        let reg = new RegExp(value, "g");
        let replaceString = `<span style="color:#407FFF">${value.trim()}</span>`;
        if (reg.test(data.showLable)) {
          data.showLable = data.showLable.replace(reg, replaceString);
        }
      }
      return (data.label.indexOf(value) !== -1 || (node.parent.data.label && node.parent.data.label.indexOf(value) !== -1));
    },
    handleNodeClick(obj, node, data) {
      // console.log(obj);
      if (obj.children && obj.children.length > 0) {
        this.$emit("logDetail", obj);
      } else if (obj.children && obj.children.length === 0) {
        this.currentId = obj.id;
        this.$emit("logDetail", obj);
      } else {
        if (obj.type === "add") {
          this.$emit("add", obj);
        } else {
          this.currentId = obj.id;
          this.$emit("detail", obj);
        }
      }
    },
    visibilityChange(event) {
      //指标定义title是自定义的
      if (this.type === "indexDefine") {
        this.tooltipFlag = false;
        return;
      }
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      if (dom.firstElementChild.offsetWidth > dom.offsetWidth) {
        this.tooltipFlag = false;
      } else {
        this.tooltipFlag = true;
      }
    },
    closeVisible() {
      this.tooltipFlag = true;
    },
    delContextmenu(id) {
      const drop = this.$refs["Contextmenu" + id];
      drop.visible = false;
      drop.hide();
    },
    handContextmenu(data) {
      if (data.children && data.children.length > 0) {
        const drop = this.$refs["Contextmenu" + data.id];
        drop.visible = true;
        drop.show();
      }
    },
    beforeHandleCommand(id, command) {
      return {
        id,
        command,
      };
    },
    handleCommand(val) {
      if (val.command === "PEER" || val.command === "SUB") {
        this.$emit("addLog", val.id);
      } else if (val.command === "EDIT") {
        this.$emit("editLog", val.id);
      } else if (val.command === "STANDARD") {
        this.$emit("addStandard", val.id);
      }
    },
    /**拖拽事件 */
    dragstart(event, data, dataId) {
      event.dataTransfer.setData("item", data);
      event.dataTransfer.setData("dataId", dataId);
    },
    dragend(event) {
      event.dataTransfer.clearData();
    },
  },
};
</script>
<style lang="less" scoped>
.bytree {
  width: 295px;
  padding: 24px 20px 24px 20px;
  border-right: @border-common;
  /deep/.el-input .el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 15px;
  }
  // 树样式
  .tree-line {
    margin-left: -16px;
    font-size: 14px;
    color: @tree-color;
    font-family: @hansan;
    ::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
      padding-left: 0px;
      padding-right: 10px;
    }
    ::v-deep .el-tree-node__content .el-tree-node__expand-icon::before {
      font-size: 14px;
      content: "\e78a";
      color: @primary-color;
    }
    ::v-deep .el-tree-node__content .expanded::before {
      content: "\e784";
    }
    ::v-deep .treeNodeIcon {
      color: @primary-color;
    }
    ::v-deep .addNode {
      cursor: pointer;
      width: calc(100% - 25px);
    }
    ::v-deep .currentNode {
      color: @primary-color;
    }
    ::v-deep .is-current > .el-tree-node__content,
    ::v-deep .el-tree-node__content:hover {
      background: @thbg-color;
    }
    ::v-deep .nodetip {
      width: calc(100% - 30px);
      div {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    ::v-deep .el-tree-node__expand-icon.expanded {
      transform: none;
    }
    ::v-deep .el-tree-node {
      position: relative;
      padding-left: 20px; // 缩进量
    }
    ::v-deep .el-tree-node__children {
      padding-left: 16px; // 缩进量
    }
    // 竖线
    ::v-deep .el-tree-node::before {
      content: "";
      height: 100%;
      width: 1px;
      position: absolute;
      left: -3px;
      top: -26px;
      border-width: 1px;
      border-left: 1px solid #ccc;
    }
    // 当前层最后⼀个节点的竖线⾼度固定
    ::v-deep .el-tree-node:last-child::before {
      height: 38px; // 可以⾃⼰调节到合适数值
    }
    // 横线
    ::v-deep .el-tree-node::after {
      content: "";
      width: 24px;
      height: 20px;
      position: absolute;
      left: -3px;
      top: 12px;
      border-width: 1px;
      border-top: 1px solid #ccc;
    }
    // 去掉最顶层的虚线，放最下⾯样式才不会被上⾯的覆盖了
    & > ::v-deep .el-tree-node::after {
      border-top: none;
    }
    & > ::v-deep .el-tree-node::before {
      border-left: none;
    }
    // 展开关闭的icon
    ::v-deep .el-tree-node__expand-icon {
      // 叶⼦节点（⽆⼦节点）
      &.is-leaf {
        // color: transparent;
        display: none; // 也可以去掉
      }
    }
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }
}
</style>
