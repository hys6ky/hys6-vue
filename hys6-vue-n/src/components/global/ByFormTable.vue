<template>
  <div class="byFormTable">
    <el-form :ref="formTableRef" :model="formData" :disabled="onlyRead">
      <el-table :cell-class-name="cellstyle" :data="formData.tableData" style="width: 100%" border>
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
            <template #header>
              <span style="color: red">*</span>
              {{ i.label }}
            </template>
            <template #default="{ row, $index }">
              <el-form-item
                :prop="'tableData.' + $index + '.' + [i.prop]"
                :rules="rules[i.prop] || i.rules"
              >
                <el-input
                  v-model="row[i.prop]"
                  placeholder=""
                  size="small"
                  class="inputForm"
                  :validate-event="false"
                  autocomplete="off"
                  :validate-on-rule-change="false"
                />
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
                <el-select
                  v-model="row[i.prop]"
                  placeholder=""
                  size="small"
                  class="inputForm"
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
                    @click="
                      operateItemHandler(
                        operateItem.type,
                        scope.row,
                        scope.$index
                      )
                    "
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
          <el-table-column v-else-if="i.type === 'slot'" :key="j" :label="i.label" :width="i.width" :min-width="i.minWidth" :prop="i.prop">
						<template #default="{ row, $index }">
							<el-form-item :prop="'tableData.' + $index + '.' + [i.prop]" :rules="rules[i.prop]">
								<!-- {{ i.prop }} -->
								<!-- <el-input v-model="row[i.prop]" :placeholder="row[i.placeholder] || ''" size="small" /> -->
								<slot :name="i.prop" :row="row"></slot>
							</el-form-item>
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
    columnArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    lb: {
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
  computed: {
		
		myLb() {
			return this.lb
		},

	},
  methods: {
    cellstyle({ row, column, rowIndex, columnIndex }){
      console.log(row, column, rowIndex, columnIndex,this.lb);
     if(this.lb.indexOf(row.mdata_col_id) !== -1){
      return "waring";
     }
     
    },
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
    operateItemHandler(type, row, index) {
      this.$emit("operateItem", type, row, index);
    },
  },
 watch :{
  myLb: {
			handler(val) {
				console.log(val);
			},
			deep: true,
      immediate : true
    
		},
 }
};
</script>

<style lang="less" scoped>
 /deep/ .waring{
    color: red !important;
    div{
    color: red !important;
    }
    .el-input__inner{
    color: red !important;
    }
    span{
    color: red !important;

    }
  }
.byFormTable {

  .el-form-item {
    margin-bottom: 0px ;
  }
  /deep/ .el-table td.el-table__cell {
    padding: 0px 10px;
  }
  .el-button--text {
    color: @primary-color;
    font-size: 12px;
    font-family: @pingfang;
  }
  .btnList:not(:first-child) {
    .el-button {
      margin-left: 10px;
    }
  }
  .inputForm /deep/ .el-input__inner {
    height: 32px;
    // font-family: @pingfang;
    font-size: 12px;
    color: @titletxt-color;
    padding: 0 10px;
  }
}
</style>
