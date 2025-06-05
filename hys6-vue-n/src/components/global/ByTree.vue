<template>
  <div class="bytree box-sizing d-flex flex-column">
    <el-input placeholder="请搜索" v-model="filterText"> </el-input>
    <div
        class="mt-20 flex-1 overflow-auto d-flex flex-column justify-content-between"
        id="treeWrap"
    >
      <el-tree
          :indent="0"
          :default-expand-all="expandAll"
          class="tree-line"
          :class="type"
          :data="data"
          :props="defaultProps"
          :draggable="draggable"
          :filter-node-method="filterNode"
          :default-checked-keys="defaultCheckedKeys"
          :load="loadNode"
          :lazy="lazy"
          :default-expanded-keys = "expandedKeys"
          node-key="id"
          ref="tree"
          @node-click="handleNodeClick"
          @node-contextmenu="handContextmenu"
          @node-expand="handExpand"
          @node-collapse="handCollapse"
          :show-checkbox="checkFlag"
          @check-change="handleCheckChange"
      >
        <span
            slot-scope="{ node, data }"
            class="nodetip"
            v-if="data.type === 'text' || (!data.type && type === 'datafenceng')"
            @click="delContextmenu(data.id)"
        >
          <el-dropdown
              :ref="'Contextmenu' + data.id"
              :hide-on-click="true"
              trigger="click"
              @command="handleCommand"
          >
            <el-tooltip
                effect="dark"
                :disabled="tooltipFlag"
                placement="top-start"
                :content="data.label"
            >
              <span
                  @mouseenter="visibilityChange($event, data)"
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
                    v-else-if="data.children.length >= 0"
                ></i>
                <span
                    v-html="node.label"
                    :class="
                    currentTarget === data.id && !data.children && 'currentNode'
                  "
                ></span>
              </span>
            </el-tooltip>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                  v-for="(item, index) in dropList"
                  :key="index"
                  :command="beforeHandleCommand(node, data, item.type)"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span
            slot-scope="{ node, data }"
            class="nodetip"
            v-else-if="data.type === 'text1' || (!data.type && type === 'datafenceng')"
            @click="delContextmenu(data.id)"
        >
          <el-dropdown
              :ref="'Contextmenu' + data.id"
              :hide-on-click="true"
              trigger="click"
              @command="handleCommand"
          >
            <el-tooltip
                effect="dark"
                :disabled="tooltipFlag"
                placement="top-start"
                :content="data.label"
            >
              <span
                  @mouseenter="visibilityChange($event, data)"
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
                      ? 'el-icon-tickets'
                      : 'el-icon-tickets'
                  "
                    v-else-if="data.children.length >= 0"
                ></i>
                <span
                    v-html="node.label"
                    :class="
                    currentTarget === data.id && !data.children && 'currentNode'
                  "
                ></span>
              </span>
            </el-tooltip>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                  v-for="(item, index) in dropList"
                  :key="index"
                  :command="beforeHandleCommand(node, data, item.type)"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span
            slot-scope="{ node, data }"
            class="nodetip"
            v-else-if="
            data.type === 'text' || (!data.type && type === 'groupIndex')
          "
        >
          <el-tooltip
              effect="dark"
              :disabled="tooltipFlag"
              placement="top-start"
          >
            <div slot="content">
              <div
                  v-if="type === 'configStep2' && !data.children"
                  v-html="getValue(data.description)"
              ></div>
              <div v-else>{{ data.labelText }}</div>
            </div>
            <span
                @mouseenter="visibilityChange($event, data)"
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
                  v-else-if="data.children.length >= 0"
              ></i>
              <draggable
                  v-model="data.children"
                  v-bind="{
                  group: { name: 'groupIndex', pull: 'clone', put: false },
                  sort: true,
                }"
                  animation="300"
                  style="display: inline-block"
                  @end="$emit('dragEnd', $event, data)"
              >
                <span v-html="node.label"></span>
              </draggable>
            </span>
          </el-tooltip>
        </span>
        <span
            slot-scope="{ node, data }"
            class="nodetip"
            v-else-if="data.type === 'text'"
        >
          <el-tooltip
              effect="dark"
              :disabled="tooltipFlag"
              placement="top-start"
          >
            <div slot="content">
              <div
                  v-if="type === 'configStep2' && !data.children"
                  v-html="getValue(data.description)"
              ></div>
              <div v-else>{{ data.labelText }}</div>
            </div>
            <span
                @mouseenter="visibilityChange($event, data)"
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
                  v-else-if="data.children.length >= 0"
              ></i>
              <span
                  v-html="node.label"
                  :class="
                  currentTarget === data.id && !data.children && 'currentNode'
                "
              ></span>
            </span>
          </el-tooltip>
        </span>
        <span
            slot-scope="{ node, data }"
            v-else-if="data.type === 'add'"
            class="w100"
        >
          <div>
            <i class="el-icon-plus mr-10 treeNodeIcon"></i>
            <span class="d-inline-block addNode">{{ node.label }}</span>
          </div>
        </span>
      </el-tree>
      <div class="d-flex justify-content-center">
        <slot name="footer"></slot>
      </div>
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
    expandedKeys: {
      type: Array,
      default: () => []
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
    checkFlag: {
      type: Boolean,
      default: false,
    },
    dropList: {
      type: Array,
      default: () => [],
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterText: "",
      tooltipFlag: true,
      currentId: "",
      currentTarget: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getValue(value) {
      let checkOption = value.replace(/\n/g, "<br/>");
      return checkOption;
    },
    filterNode(value, data, node) {
      console.log(value, data, node, "value");
      data.showLable = data.label;
      if (!value) return true;
      if (
          data.showLable.includes(value) ||
          data.showLable.toUpperCase().includes(value.toUpperCase())
      ) {
        let reg = new RegExp(value, "g");
        let replaceString = `<span style="color:#407FFF">${value.trim()}</span>`;
        if (reg.test(data.showLable)) {
          data.showLable = data.showLable.replace(reg, replaceString);
        }
      }
      return (
          data.label.indexOf(value) !== -1 ||
          (node.parent.data.label && node.parent.data.label.indexOf(value) !== -1)
      );
    },
    handleNodeClick(obj, node, data) {
      if (obj.children && obj.children.length > 0) {
        this.$emit("logDetail", obj);
      } else if (obj.children && obj.children.length === 0) {
        this.currentId = obj.id;
        this.$emit("logDetail", obj);
      } else {
        if (obj.type === "add") {
          this.$emit("add", obj);
        } else {
          this.currentTarget = obj.id;
          this.$emit("detail", obj);
        }
      }
    },
    handCollapse(obj, node, data) {
      this.currentId = "";
      this.$emit('handCollapse',obj.id,node)
    },
    handExpand(obj, node, data) {
      this.currentId = obj.id;
    },
    visibilityChange(event, data) {
      //指标定义title是自定义的
      if (this.type === "configStep2" && !data.children) {
        this.tooltipFlag = false;
        return;
      }
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      if (data?.children?.length > 0) {
        if (dom.lastElementChild.offsetWidth > dom.offsetWidth - 14) {
          this.tooltipFlag = false;
        } else {
          this.tooltipFlag = true;
        }
      } else {
        if (dom.lastElementChild.offsetWidth > dom.offsetWidth - 24) {
          this.tooltipFlag = false;
        } else {
          this.tooltipFlag = true;
        }
      }
    },
    closeVisible() {
      this.tooltipFlag = true;
    },
    delContextmenu(id) {
      let drop = this.$refs["Contextmenu" + id];
      drop.visible = false;
      drop.hide();
    },
    handContextmenu(event, data, node) {
      if (
          (data.children && data.children.length >= 0) ||
          data.children === null ||
          1 == 1
      ) {
        let drop = this.$refs["Contextmenu" + data.id];
        if (drop) {
          drop.visible = true;
          drop.show();
        }
        this.$refs.tree.setCurrentKey(data.id);
      }
      if (this.type === "configStep2" && !data.children) {
        this.$emit("rightClick", event, data);
      }
    },
    beforeHandleCommand(node, data, command) {
      return {
        node,
        data,
        command,
      };
    },
    handleCommand(val) {
      this.$emit("contextmenu", val);
    },
    /**复选框节点选择 */
    handleCheckChange(data, checked, indeterminate) {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.$emit("checkChange", checkedNodes);
    },
    loadNode(node, resolve) {
      this.$emit("loadNode", node, resolve);
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
      // padding-left: 0px;
      // padding-right: 10px;
      padding: 0;
    }
    ::v-deep .el-tree-node__content .el-tree-node__expand-icon::before {
      // font-size: 14px;
      // content: "\e78a";
      // color: @primary-color;
      display: none;
    }
    ::v-deep .el-tree-node__content {
      // min-width: 80px;
      display: inline-block;
      min-width: 100%;
      height: fit-content;
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
      // width: calc(100% - 30px);
      // div {
      //   width: 100%;
      //   overflow: hidden;
      //   white-space: nowrap;
      //   text-overflow: ellipsis;
      // }
      line-height: 26px;
      display: inline-flex;
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
      overflow: visible;
      .el-tree-node {
        &:nth-child(1)::before {
          content: "";
          height: 54%;
          width: 1px;
          position: absolute;
          left: -3px;
          top: -1px;
          border-width: 1px;
          border-left: 1px solid #ccc;
        }
      }
      .is-expanded::before {
        height: 100% !important;
      }
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
  .groupIndex,
  .taskTest {
    // 竖线
    ::v-deep .el-tree-node::before {
      content: "";
      height: 100%;
      width: 1px;
      position: absolute;
      left: -3px;
      top: -13px;
      border-width: 1px;
      border-left: 1px solid #ccc;
    }
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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
<style>
/* 在两条信息交替悬浮的时候, 导致一瞬间有一个纵向的滚动条*/
.el-tooltip__popper.is-dark {
  top: -500px;
}
</style>
