<template>
	<div class="bytree box-sizing d-flex flex-column">
		<el-input placeholder="请搜索" v-model="filterText"> </el-input>
		<div class="mt-20 flex-1 overflow-x-hidden overflow-y-auto">
			<el-tree   :default-expand-all="expandAll" :indent="0" class="tree-line" :data="data" :props="defaultProps" :default-expanded-keys = "expandedKeys" :filter-node-method="filterNode" node-key="id" ref="tree" @node-click="handleNodeClick">
				<span slot-scope="{ node, data }" class="nodetip" v-if="data.type === 'text' || !data.type  && type === 'standardSource'" @contextmenu.prevent="handContextmenu(data)" @click="delContextmenu(data.id)">
					<el-dropdown :ref="'Contextmenu' + data.id" :hide-on-click="true" trigger="click" @command="handleCommand">
						<el-tooltip effect="dark" :content="data.label" placement="top-start" :disabled="tooltipFlag">
							<div>
								<i class="el-icon-folder mr-10 treeNodeIcon" v-if="!data.children"></i>
                <i class="mr-10 treeNodeIcon" :class="currentId !== data.id ? 'el-icon-folder-opened' : 'el-icon-folder'" v-else></i>
								<span v-html="node.label" @mouseenter="visibilityChange($event)" @mouseleave="closeVisible"  ></span>
							</div>
						</el-tooltip>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="beforeHandleCommand(data,node, 'PEER')">添加一级目录</el-dropdown-item>
							<el-dropdown-item :command="beforeHandleCommand(data,node, 'SUB')">添加子目录</el-dropdown-item>
							<el-dropdown-item :command="beforeHandleCommand(data,node, 'BM')">编码管理</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
				<!-- <span slot-scope="{ node, data }" class="nodetip" v-else-if="data.type === 'text' && type === 'testTask'">
					<el-tooltip effect="dark" :content="data.label" placement="top-start" :disabled="tooltipFlag" v-if="data.children && data.children.length > 0">
						<div>
							<i class="el-icon-document mr-10 treeNodeIcon" v-if="!data.children"></i>
							<i class="mr-10 treeNodeIcon" :class="currentId === data.id ? 'el-icon-folder-opened' : 'el-icon-folder'" v-else-if="data.children.length === 0"></i>
							<span v-html="node.label" @mouseenter="visibilityChange($event)" @mouseleave="closeVisible" :class="currentId === data.id && !data.children && 'currentNode'"></span>
						</div>
					</el-tooltip> 
					<el-tooltip effect="dark" :content="data.label" placement="top-start" :disabled="tooltipFlag" v-else>
						<draggable @end="end" @start="move" v-bind="draggableOptions" v-model="data.children">
							<div>
								<i class="el-icon-document mr-10 treeNodeIcon" v-if="!data.children"></i>
								<i class="mr-10 treeNodeIcon" :class="currentId === data.id ? 'el-icon-folder-opened' : 'el-icon-folder'" v-else-if="data.children.length === 0"></i>
								<span v-html="node.label" @mouseenter="visibilityChange($event)" @mouseleave="closeVisible" :class="currentId === data.id && !data.children && 'currentNode'"></span>
							</div>
						</draggable>
					</el-tooltip>
				</span> -->
				<span slot-scope="{ data }" v-else-if="data.type === 'add'" class="ml-5 w100">
					<div>
						<i class="el-icon-plus mr-10 treeNodeIcon"></i>
						<span @mouseenter="visibilityChange($event)" @mouseleave="closeVisible" class="d-inline-block addNode">{{ data.label }}</span>
					</div>
				</span>
			</el-tree>
		</div>
	</div>
</template>

<script>
// import draggable from "vuedraggable";
import { getFlatArr } from '@/utils/datahandler.js'
var mousePosition = {
  left: -1,
  top: -1
};
export default {
  name: "ByStandardTree",
  props: {
    data: {
      type: Array,
      default: () => []
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
      })
    },
    type: {
      type: String,
      default: ""
    },
		expandAll: {
      type: Boolean,
      default: false,
    },
  },
  // components: {
  //   draggable
  // },
  data () {
    return {
      filterText: "",
      tooltipFlag: true,
      currentId: "",
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        // 不使用H5原生的配置
        forceFallback: true
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      nodeMenu: {}
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    /**拖拽事件 */
    dragstart (event, data, dataId, model) {
      event.dataTransfer.setData("item", data);
      event.dataTransfer.setData("dataId", dataId);
      event.dataTransfer.setData("type", model);
    },
    // 拖拽开始时触发
    move (evt) {
      const type = evt.item.outerText.trim().split(" ")[0];
      let list = getFlatArr(this.data)
      this.nodeMenu = list.find(item => item.label === type)
    },
    // 拖拽结束时触发
    end (evt, e) {
      if (this.nodeMenu && !this.nodeMenu.children) {
        this.$emit("addNode", evt, this.nodeMenu, mousePosition);
      }
    },
    filterNode (value, data, node) {
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
    handleNodeClick (obj, node, data) {
      // console.log(obj);
      if (obj.children && obj.children.length > 0) {
        this.$emit('logDetail', obj)
      } else if (obj.children && obj.children.length === 0) {
        this.currentId = obj.id
        this.$emit('logDetail', obj)
      } else {
        if (obj.type === 'add') {
          this.$emit('add', obj)
        } else {
          this.currentId = obj.id
          this.$emit('detail', obj)
        }
      }
    },
    visibilityChange (event) {
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      dom.offsetWidth <= dom.parentElement.offsetWidth ? this.tooltipFlag = true : this.tooltipFlag = false;
    },
    closeVisible () {
      this.tooltipFlag = true;
    },
    delContextmenu (id) {
      const drop = this.$refs["Contextmenu" + id];
      drop.visible = false;
      drop.hide();
    },
    handContextmenu (data) {
      // if (data.children && data.children.length > 0) {
        const drop = this.$refs["Contextmenu" + data.id];
        drop.visible = true;
        drop.show();
      // }
    },
    beforeHandleCommand (data,node,command) {
      return {
        data,
        node,
        command
      }
    },
    handleCommand (val) {
      console.log(val, '*****')
      if (val.command === 'PEER' || val.command === 'SUB' || val.command === 'BM' ) {
        this.$emit('addLog', val)
      } else if (val.command === 'EDIT') {
        this.$emit('editLog', val)
      } else if (val.command === 'STANDARD') {
        this.$emit('addStandard', val)
      }else if (val.command === 'DEL') {
        this.$emit('delete', val)
      }
    }
  },


};
</script>
<style lang="less" scoped>
.bytree {
	width: 295px;
	padding: 24px 20px;
	border-right: @border-common;
	/deep/.el-input .el-input__inner {
		height: 32px !important;
		line-height: 32px !important;
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
			// content: '\e78a';
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
			content: '\e784';
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
			// 	width: 100%;
			// 	overflow: hidden;
			// 	white-space: nowrap;
			// 	text-overflow: ellipsis;
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
					content: '';
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
			content: '';
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
			content: '';
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
			content: '';
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
		border-radius: 8px;
	}
	/* 滚动条滑块 */
	::-webkit-scrollbar-thumb {
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.1);
	}
}
</style>
