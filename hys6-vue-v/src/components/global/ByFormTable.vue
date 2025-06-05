<template>
  <div class="byFormTable">
    <el-form :ref="formTableRef" :model="formData">
      <el-table :data="formData.tableData" stripe style="width: 100%" border>
        <template v-for="(i, j) in columnArr">
          <el-table-column
            v-if="i.type === 'index'"
            :key="j"
            :label="i.label"
            type="index"
            :width="i.width || '80px'"
            :min-width="i.minWidth"
            :index="(index) => index + 1"
          >
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'input'"
            :key="j"
            :label="i.label"
            :width="i.width"
            :min-width="i.minWidth"
            :prop="i.prop"
          >
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <el-tooltip
                  :content="row[i.prop]"
                  placement="top"
                  :disabled="isshowtip"
                >
                  <el-input
                    v-model="row[i.prop]"
                    :placeholder="i.placeholder || '请输入'"
                    :disabled="i.disabled"
                    size="small"
                    @mouseover.native="inputOnMouseOver($event)"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'select'"
            :key="j"
            :label="i.label"
            :width="i.width"
            :min-width="i.minWidth"
            :prop="i.prop"
          >
            <template #header>
              <span v-if="i.headerToolTip">
                {{ i.label }}
                <el-tooltip class="tooltipHelp" effect="dark" placement="top">
                  <div
                    slot="content"
                    v-html="i.headerToolTip"
                    style="white-space: pre-wrap"
                  ></div>
                  <i class="el-icon-question" aria-hidden="true"></i>
                </el-tooltip>
              </span>
              <span v-else>
                {{ i.label }}
              </span>
            </template>
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <el-select
                  v-model="row[i.prop]"
                  :placeholder="i.placeholder || '请选择'"
                  :disabled="i.disabled"
                  :allow-create="i.allowCreate || false"
                  :filterable="i.filterable || false"
                  size="small"
                >
                  <el-option
                    v-for="item in i.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'check'"
            :key="j"
            :label="i.label"
            :width="i.width"
            :min-width="i.minWidth"
            :prop="i.prop"
          >
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <el-checkbox
                  :disabled="i.disabled"
                  v-model="row[i.prop]"
                  :checked="row[i.prop]"
                ></el-checkbox>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'definedInput'"
            :key="j"
            :label="i.label"
            :width="i.width"
            :min-width="i.minWidth"
            :prop="i.prop"
          >
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <slot :name="i.prop" :row="row" :i="i"></slot>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'text'"
            :key="j"
            show-overflow-tooltip
            :label="i.label"
            :width="i.width"
            :header-align="i.align || 'left'"
            :align="i.align || 'left'"
            :min-width="i.minWidth"
            :fixed="i.fixed || false"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[i.prop] | filterText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="i.type === 'operate'"
            :key="j"
            :label="i.label"
            :fixed="i.fixed || 'right'"
            :width="i.width || 'auto'"
            :header-align="i.align || 'left'"
            :align="i.align || 'left'"
          >
            <template #default="{ row, $index }">
              <div class="d-flex align-items-center">
                <span
                  v-for="(operateItem, operateIndex) in i.operateArr.filter(
                    (item) => (item.hide ? item.hide(row) : item)
                  )"
                  :key="operateIndex"
                  class="btnList"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="operateItemHandler(operateItem.type, row, $index)"
                  >
                    {{ operateItem.label }}
                  </el-button>
                </span>
                <div class="ml-10" v-if="i.more ? i.more(row) : false">
                  <el-dropdown @command="operateSelect">
                    <span
                      class="el-dropdown-link d-block moreOperateIcon cursor-pointer"
                    >
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(operateItem, operateIndex) in i.moreItem"
                        :key="operateIndex"
                        :command="{ type: operateItem.type, row: row }"
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
        <el-table-column
          label="操作"
          prop="name"
          fixed="right"
          width="120px"
          v-if="operate"
        >
          <template #default="{ row, $index }">
            <el-button size="mini" type="text" @click="addRow(row, $index)"
              >添加</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="removeRow($index)"
              v-if="formData.tableData.length > 1"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ByFormTable",
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          tableData: [],
        };
      },
    },
    columnArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formTableRef: {
      type: String,
      default: "",
    },
    operate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isshowtip: false,
    };
  },
  filters: {
    filterText: function (value) {
      return value && value.length > 0 ? value : "--";
    },
  },
  methods: {
    operateItemHandler(type, row, index) {
      this.$emit("operateItem", type, row, index);
    },
    inputOnMouseOver(event) {
      const target = event.target;
      if (target.offsetWidth < target.scrollWidth) {
        this.isshowtip = false;
      } else {
        this.isshowtip = true;
      }
    },
    addRow(row, index) {
      this.$refs[this.formTableRef].clearValidate();
      this.formData.tableData.splice(index + 1, 0, {});
    },
    removeRow(index) {
      this.$refs[this.formTableRef].clearValidate();
      this.formData.tableData.splice(index, 1);
    },
    transferData() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formTableRef].validate((valid) => {
          if (valid) {
            resolve(this.formData);
          } else {
            reject("err");
          }
        });
      });
      // this.$refs.form.validate((res, obj) => {
      //   console.log(res, obj)
      //   // const index = Number(obj.split('.')[1])
      //   // this.validate.push(index)
      // })
    },
  },
};
</script>

<style lang="less" scoped>
.byFormTable {
  .el-form-item {
    margin-bottom: 0px;
  }
  /deep/ .el-table td.el-table__cell {
    padding: 3px 10px;
  }

  ::v-deep .el-input__inner {
    padding: 0 10px;
  }
  ::v-deep .el-input__suffix {
    height: 32px;
  }
}
.btnList:not(:first-child) {
  .el-button {
    margin-left: 10px;
  }
}
.el-button--text {
  color: @primary-color;
  font-family: @pingfang;
}
</style>
