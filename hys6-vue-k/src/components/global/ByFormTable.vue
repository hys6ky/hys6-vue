<template>
  <div class="byFormTable">
    <el-form :ref="formTableRef" :model="formData" :disabled="onlyRead">
      <el-table
        :data="formData.tableData"
        style="width: 100%"
        :max-height="maxHeight"
        border
      >
        <template v-for="(i, j) in columnArr">
          <el-table-column
            v-if="i.type === 'index'"
            :key="j"
            :label="i.label"
            type="index"
            :align="i.align || 'left'"
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
            <template #header v-if="!(i.prop === 'code_remark')">
              <span style="color: red">*</span>
              {{ i.label }}
            </template>
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <el-input v-model="row[i.prop]" placeholder="" size="small" />
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
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop]"
              >
                <el-select v-model="row[i.prop]" placeholder="" size="small">
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
            <template slot-scope="scope">
              <div class="d-flex align-items-center">
                <span
                  v-for="(operateItem, operateIndex) in i.operateArr.filter(
                    (item) => (item.hide ? item.hide(scope.row) : item)
                  )"
                  :key="operateIndex"
                  class="btnList"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="operateItemHandler(operateItem.type, scope.row)"
                  >
                    {{ operateItem.label }}
                  </el-button>
                </span>
                <div class="ml-10" v-if="i.more ? i.more(scope.row) : false">
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

        <el-table-column
          label="操作"
          prop="name"
          fixed="right"
          width="120px"
          v-if="operate"
        >
          <template #default="{ row, $index }">
            <!-- <el-button size="mini" type="text" @click="addRow(row, $index)"
              >添加</el-button
            > -->
            <el-button size="mini" type="text" @click="removeRow($index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div
          class="byTable-bottom d-flex align-items-center justify-content-between pb-20"
      >
        <div
            class="font-14 totalPageTip"
            v-if="pagination && pagination.total > 0"
        >
          共&nbsp;{{ pagination.total }}项数据
        </div>
        <el-pagination
            v-if="pagination && pagination.total > 0"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNum"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize"
            layout=" prev, pager, next, sizes,jumper"
            :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-form>
    <!-- <el-button @click="submit">提交</el-button> -->
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
    pagination: {
      type: Object,
      default: () => {
        return {};
      },
    },
    maxHeight:{
      type: String,
      default: () => {
        return '200px';
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
      default: true,
    },
    onlyRead: {
      Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  filters: {
    filterText: function (value) {
      return value && value.length > 0 ? value : "--";
    },
  },
  methods: {
    addRow() {
      this.$refs[this.formTableRef].clearValidate();
      let obj = {
        code_remark: "",
        code_item_name: "",
        dbm_level: "",
        code_encode: "",
      };
      this.formData.tableData.push(obj);
    },
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("currentChange", val);
    },
    removeRow(index) {
      this.$refs[this.formTableRef].clearValidate();
      this.formData.tableData.splice(index, 1);
      this.$emit("removeRow",index)
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
  &-bottom {
    margin-top: 16px;
    .totalPageTip {
      color: @label-color;
      font-family: @hansan;
    }
  }
  /deep/ .el-table td.el-table__cell {
    padding: 0px 10px;
  }
  .el-button--text {
    color: @primary-color;
    font-size: 14px;
    font-family: @pingfang;
  }
}
</style>
