<template>
  <div class="byTable">
    <el-table ref="table" :data="tableData" stripe @row-click="rowClick" style="width: 100%" border
      @selection-change="handleMultiple">
      <template v-for="(i, j) in columnArr">
        <el-table-column v-if="i.type === 'index'" :key="j" :label="i.label" :align="i.align || 'left'" type="index"
          :width="i.width" :index="(index) => index + 1" :fixed="i.fixed || false"></el-table-column>
        <el-table-column v-else-if="i.type === 'selection'" :key="j" type="selection" :width="i.width"
          :align="i.align || 'left'"></el-table-column>
        <el-table-column v-else-if="i.type === 'radio'" :label="i.label" :key="j" :width="i.width">
          <template slot-scope="scope">
            <el-checkbox @change.native="handleSelectionChange(scope.row)" v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'input'" :label="i.label" :key="j" :align="i.align || 'left'"
          :width="i.width" :min-width="i.minWidth">
          <template slot-scope="scope">
            <el-input @change.native="$emit('handleInputChange', i.prop, scope.row)" v-model="scope.row[i.prop]"
              :placeholder="i.placeholder || '请输入'"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'select'" :label="i.label" :key="j" :width="i.width"
          :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <el-select @change="handleSelectChange(i.prop, scope.row, scope.$index)" v-model="scope.row[i.prop]"
              filterable :multiple="i.multiple || false" :placeholder="i.placeholder || '请选择'"
              :disabled="i.disabled ? i.disabled(scope.row) : false">
              <el-option v-for="v in i.options" :key="v.value" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'cascader'" :label="i.label" :key="j" :width="i.width"
          :min-width="i.minWidth">
          <template slot-scope="scope">
            <el-cascader @change="$emit('handleCascaderChange', i.prop, scope.row, $event)" v-model="scope.row[i.prop]"
              :props="i.props || {}" :options="i.options" filterable :placeholder="i.placeholder || '请选择'"
              :disabled="i.disabled ? i.disabled(scope.row) : false"></el-cascader>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'tag'" :key="j" :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <div class="d-flex align-items-center justifycontent-center">
              <span class="d-block tagTip" :style="{ background: scope.row[i.prop].color }"></span>&nbsp;
              <span :style="{ color: scope.row[i.prop].color }">{{
                scope.row[i.prop].text || "--"
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'tag1'" :key="j" :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <div class="d-flex align-items-center justifycontent-center">
              <span v-if="scope.row[i.prop] === '1'">待盘点</span>
              <span v-else-if="scope.row[i.prop] === '2'">临时保存</span>
              <span v-else-if="scope.row[i.prop] === '3'">已完成登记</span>
            </div>

          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'tag2'" :key="j" :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <div class="d-flex align-items-center justifycontent-center">
              <span v-if="scope.row[i.prop] === '1'">已发布</span>
              <span v-else-if="scope.row[i.prop] === '2'">
                未发布 
              </span>
            </div>

          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'text'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <span>{{ scope.row[i.prop] | filterText }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'text1'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <span v-if="scope.row[i.prop] === '1'">表</span>
            <span v-else-if="scope.row[i.prop] === '2'">视图</span>
            <span v-else-if="scope.row[i.prop] === '3'">视图</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'popover'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth">
          <template slot-scope="scope">
            <el-popover placement="top" width="350" trigger="click">
              <el-table 
              :data="data">
                <el-table-column width="150" property="code_item_name" label="码值项名称"></el-table-column>
                <el-table-column width="200" property="code_item_id" label="码值"></el-table-column>
              </el-table>
              <span  slot="reference">{{ scope.row[i.prop] | filterText }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'date'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row[i.prop]) | filterText }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'time'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <span>{{ hourFormat(scope.row[i.prop]) | filterText }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'dateTime'" :key="j" show-overflow-tooltip :label="i.label"
          :width="i.width" :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth"
          :fixed="i.fixed || false">
          <template slot-scope="scope">
            <span>{{ dateToMilldate(scope.row[i.prop]) | filterText }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'tagColor'" :key="j" show-overflow-tooltip :label="i.label"
          :width="i.width" :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth"
          :fixed="i.fixed || false">
          <template slot-scope="scope">
            <div class="d-flex align-items-center">
              <span class="d-inline-block tagColorBox mr-5" :style="{ background: scope.row[i.prop] }"></span>
              <span>{{ scope.row[i.prop] | filterText }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'link'" :key="j" show-overflow-tooltip :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :min-width="i.minWidth">
          <template slot-scope="scope">
            <el-link type="primary" @click="$emit('linkTo', scope.row)">{{
              scope.row[i.prop] | filterText
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'operText'" :key="j" :label="i.label" :width="i.width"
          :header-align="i.align || 'left'" :align="i.align || 'left'" :fixed="i.fixed || false">
          <template slot-scope="scope">
            <div class="d-flex">
              <OverflowTooltip :content="scope.row[i.prop] | filterText" :max-width="i.width - 80" />
              <div class="fr">
                <el-button size="mini" type="text" v-for="(btnItem, btnIndex) in i.btnList" :key="btnIndex"
                  @click="$emit('btnItemHandler', btnItem.type, scope.row)">
                  {{ btnItem.label }}
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="i.type === 'operate'" :key="j" :fixed="i.fixed || 'right'" :width="i.width || 'auto'"
          :header-align="i.align || 'left'" :align="i.align || 'left'">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" :placeholder="i.placeholder || '请输入关键字搜索'" v-if="i.filter"
              @change="$emit('handleFilter', search)" />
            <span v-else>{{ i.label || "操作" }}</span>
          </template>

          <template slot-scope="scope">
            <div class="align-items-center">
              <span v-for="(operateItem, operateIndex) in i.operateArr.filter(
                (item) => (item.hide ? item.hide(scope.row) : item)
              )" :key="operateIndex" class="btnList">
                <el-popconfirm confirmButtonText="删除" cancelButtonText="取消" icon="el-icon-info" iconColor="red"
                  title="确定删除吗？" v-if="operateItem.type === 'del'"
                  @confirm="operateItemHandler(operateItem.type, scope.row)">
                  <el-button size="mini" type="text" slot="reference" :disabled="operateItem.disabled
                      ? operateItem.disabled(scope.row)
                      : false
                    ">
                    {{ operateItem.label }}
                  </el-button>
                </el-popconfirm>
                <el-button v-else size="mini" type="text" @click="operateItemHandler(operateItem.type, scope.row)"
                  :disabled="operateItem.disabled
                      ? operateItem.disabled(scope.row)
                      : false
                    ">
                  <span v-if="operateItem.required" style="color: red">*</span>
                  <span>{{ operateItem.label }}</span>
                </el-button>
              </span>
              <span class="ml-10" v-if="i.more ? i.more(scope.row) : false">
                <el-dropdown @command="operateSelect">
                  <span class="el-dropdown-link d-block moreOperateIcon cursor-pointer">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(operateItem, operateIndex) in i.moreItem" :key="operateIndex"
                      :command="{ type: operateItem.type, row: scope.row }" :disabled="operateItem.disabled
                          ? operateItem.disabled(scope.row)
                          : false
                        ">
                      {{ operateItem.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="byTable-bottom d-flex align-items-center justify-content-between">
      <div class="font-14 totalPageTip" v-if="pagination && pagination.total > 0">
        共&nbsp;{{ pagination.total }}项数据
      </div>
      <el-pagination v-if="pagination && pagination.total > 0" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize" layout=" prev, pager, next, sizes,jumper" :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from "@/components/overflowTooltip";
import { dateFormat, dateToMilldate, hourFormat } from "@/utils/dateconversion";
export default {
  name: "ByTable",
  props: {
    columnArr: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    pagination: {
      type: Object,
      default: () => {
        return {};
      },
    },
    height: {
      type: [Number, String],
      default: "auto",
    },
  },
  components: {
    OverflowTooltip,
  },
  data() {
    return {
      tagColor: ["#3BC698", "#165DDF", "#E6515D", "#F1C526", "#666666"],
      seleted: "",
      search: "",
    };
  },
  mounted() {
    let pageText = document.getElementsByClassName("el-pagination__jump")[0];
    if (pageText) {
      //可能存在不显示页码的情况，所以最好判断一下避免报错~
      pageText.childNodes[0].nodeValue = "跳至";
    }
  },
  filters: {
    filterText: function (value) {
      return value && value.toString().length > 0 ? value.toString() : "--";
    },
  },
  methods: {
    dateFormat,
    dateToMilldate,
    hourFormat,
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event)
    },
    fabu(val){
      this.$emit('fabu', val)
    },
    operateItemHandler(type, row) {
      console.log(type, row);
      this.$emit("operateItem", type, row);
    },
    operateSelect(val) {
      console.log(val);
      this.$emit("operateItem", val.type, val.row);
    },
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("currentChange", val);
    },
    handleSelectionChange(val) {
      if (val) {
        this.$emit("selectionChange", val);
      }
    },
    handleSelectionChange1(val) {
      if (val) {
        this.$emit("selectionChange1", val);
      }
    },
    handleSelectChange(prop, row, index) {
      this.$forceUpdate();
      this.$emit("handleSelectChange", prop, row, index);
    },
    handleMultiple(val) {
      this.$emit("handleMultiple", val);
    },
  },
};
</script>

<style lang="less" scoped>
.byTable {
  .tagTip {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  .tagTip1 {
    cursor: pointer;
    text-align: center;
    line-height: 5px;
    margin-left: 5px;
    width: 10px;
    height: 5px;
    border-radius: 5px;
  }

  .tagColorBox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
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

  .moreOperateIcon {
    color: @primary-color;

    i {
      transform: rotate(90deg);
    }
  }

  &-bottom {
    margin-top: 16px;

    .totalPageTip {
      color: @label-color;
      font-family: @hansan;
    }
  }

  /deep/ .el-table th.gutter {
    display: none;
    width: 0;
  }

  /deep/ .el-table colgroup col[name="gutter"] {
    display: none;
    width: 0;
  }

  /deep/ .el-table__body {
    width: 100% !important;
  }

  /deep/.my-el-table {
    overflow-x: hidden;

    .el-table__header-wrapper {
      .el-table__header {
        width: calc(100% + 32px) !important;
      }
    }

    .el-table__body-wrapper {
      width: calc(100% + 16px) !important;

      .el-table__body {
        width: calc(100% + 16px) !important;
      }
    }
  }

  ::v-deep .el-input__inner {
    height: 32px;
    // font-family: @pingfang;
    font-size: 12px;
    color: @titletxt-color;
    padding: 0 10px;
  }

  ::v-deep .el-input__icon {
    line-height: 32px;
  }
}
</style>
