<template>
  <div class="formTableRowValid">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <template v-for="(i, j) in columnArr">
        <el-table-column
          v-if="i.type === 'index'"
          :key="j"
          :label="i.label"
          type="index"
          :index="(index) => index + 1"
          width="100"
        >
        </el-table-column>
        <el-table-column
          v-else-if="i.type==='text'"
          :key="j"
          show-overflow-tooltip
          :label="i.label"
          :width="i.width"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[i.prop] | filterText }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="i.type==='input'"
          :key="j"
          show-overflow-tooltip
          :label="i.label"
          :width="i.width"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.isModified">{{ scope.row[i.prop] | filterText }}</span>
            <el-input
              v-else
              v-model="scope.row[i.prop]"
              size="mini"
              style="width: 100%"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="i.type==='cascader'"
          :key="j"
          show-overflow-tooltip
          :label="i.label"
          :width="i.width"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.isModified">{{ scope.row[i.prop] | filterText }}</span>
            <el-cascader
              v-else
              size="mini"
              v-model="scope.row[i.prop]"
              :options="i.options"
              :placeholder="i.placeholder||'请输入'"
              :props="i.props"
              filterable
              :ref="i.prop"
            >
              <template slot-scope="{ data }">
                <el-tooltip
                  effect="dark"
                  :content="data.label"
                  placement="top-start"
                  :disabled="tooltipFlag"
                >
                  <div
                    style="max-width:150px"
                    class="text-elipsis"
                    @mouseenter="visibilityChange($event)"
                    @mouseleave="closeVisible"
                  >
                    <span>{{ data.label }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-cascader>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="i.type==='operate'"
          :key="j"
          :label="i.label"
          :fixed="i.fixed"
        >
          <template slot-scope="scope">
            <div
              class="d-flex align-items-center"
              v-for="(operateItem, operateIndex) in i.operateArr.slice(0, 2)"
              :key="operateIndex"
            >
              <el-button
                v-if="scope.row.isModified===operateItem.show"
                size="mini"
                type="text"
                :icon="operateItem.icon"
                @click="operateItemHandler(operateItem.type, scope.row)"
              >
                {{ operateItem.label?operateItem.label:'' }}
              </el-button>
              <div
                class="ml-10"
                v-if="i.operateArr.length>2"
              >
                <el-dropdown @command="operateSelect">
                  <span class="el-dropdown-link d-block moreOperateIcon cursor-pointer">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(operateItem, operateIndex) in i.operateArr.slice(
                      2
                    )"
                      :key="operateIndex"
                      :command="{ type: operateItem.type, row: scope.row }"
                    >
                      {{ operateItem.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'FormTableRowValid',
  props: {
    columnArr: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data () {
    return {
      tooltipFlag: false,
    };
  },
  filters: {
    filterText: function (value) {
      return value && value.length > 0 ? value : "--";
    }
  },
  methods: {
    operateItemHandler (type, row) {
      console.log(type)
      if (type === 'edit') {
        row.isModified = true;
      } else if (type === 'confirm') {
        row.isModified = false;
      }
      this.$emit("operateItemHandler", type, row);
    },
    operateSelect ({ type, row }) {
      this.$emit("operateItemHandler", type, row);
    },
    visibilityChange (event) {
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      dom.offsetWidth <= dom.firstElementChild.offsetWidth ? this.tooltipFlag = false : this.tooltipFlag = true;
    },
    closeVisible () {
      this.tooltipFlag = true;
    }
  }
}
</script>

<style lang="less" scoped>
.formTableRowValid {
	.el-button--text {
		color: @primary-color;
		font-size: 14px;
		font-family: @pingfang;
	}
}
</style>