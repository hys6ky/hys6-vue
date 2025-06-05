<template>
  <div class="quickSearch box-sizing overflow-hidden">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="auto"
      class="demoForm"
      inline
      :rules="formRules"
      @submit.native.prevent
    >
      <el-row
        v-show="flag || index === 0"
        v-for="(formItem, index) in multiline ? formItems : [formItems]"
        :key="index"
      >
        <el-form-item
          v-for="item in formItem"
          :label-width="
            item.labelWidth ||
            (item.label && item.label.length * 14 + 26 + 'px')
          "
          :label="item.label ? `${item.label}:` : ''"
          :prop="item.prop"
          :key="item.prop"
          class="form-item"
        >
          <el-col :span="24">
            <el-input
              :style="item.width ? `width: ${item.width}px` : 'width: 200px'"
              v-if="item.type === 'input'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请输入'"
              :maxlength="item.maxLength ? item.maxLength : ''"
              :disabled="item.disabled"
              class="inputBox"
            ></el-input>
            <el-select
              style="width: 200px"
              v-else-if="item.type === 'select1'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请选择'"
              filterable
              @change="chh"
              clearable
              :multiple="item.multiple"
              :disabled="item.disabled"
              class="inputBox"
            >
              <el-option
                v-for="i in item.options"
                :key="i.key || i.value"
                :value="i.value"
                :label="i.label"
              >
                <span style="float: left">{{ i.label }}</span>
                <span
                  v-if="i.color"
                  class="d-block fr"
                  :style="{
                    width: '20px',
                    height: '20px',
                    background: i.color,
                    borderRadius: '4px',
                    marginTop: '7px',
                  }"
                ></span>
              </el-option>
            </el-select>
            <el-select
              style="width: 200px"
              v-else-if="item.type === 'select'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请选择'"
              filterable
              clearable
              :multiple="item.multiple"
              :disabled="item.disabled"
              class="inputBox"
            >
              <el-option
                v-for="i in item.options"
                :key="i.key || i.value"
                :value="i.value"
                :label="i.label"
              >
                <span style="float: left">{{ i.label }}</span>
                <span
                  v-if="i.color"
                  class="d-block fr"
                  :style="{
                    width: '20px',
                    height: '20px',
                    background: i.color,
                    borderRadius: '4px',
                    marginTop: '7px',
                  }"
                ></span>
              </el-option>
            </el-select>
            <el-select
              style="width: 200px"
              v-else-if="item.type === 'selectLabel'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请选择'"
              filterable
              clearable
              :multiple="item.multiple"
              :disabled="item.disabled"
              class="inputBox"
            >
              <el-option
                v-for="v in item.options"
                :key="v.value"
                :label="v.label"
                :value="v.value"
              >
                <span style="float: left">{{
                  v.label ? v.label : v.value
                }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  v.label1
                }}</span>
              </el-option>
            </el-select>
            <el-cascader
              style="width: 200px"
              v-else-if="item.type === 'cascader'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请选择'"
              :options="item.options"
              :props="item.props"
              filterable
              clearable
            >
              <template slot-scope="{ data }">
                <el-tooltip
                  effect="dark"
                  :content="data.label"
                  placement="top-start"
                  :disabled="tooltipFlag"
                >
                  <div
                    style="max-width: 150px"
                    class="text-elipsis"
                    @mouseenter="visibilityChange($event)"
                    @mouseleave="closeVisible"
                  >
                    <span>{{ data.label }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-cascader>
            <el-date-picker
              style="width: 200px"
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              type="date"
              editable
              value-format="yyyy-MM-dd"
              :placeholder="item.placeholder || '请选择'"
              :pickerOptions="item.options || {}"
              clearable
            />
            <el-date-picker
              style="width: 220px"
              v-else-if="item.type === 'daterange'"
              v-model="formData[item.prop]"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="~"
              :start-placeholder="
                (item.placeholder && item.placeholder[0]) || '开始日期'
              "
              :end-placeholder="
                (item.placeholder && item.placeholder[1]) || '结束日期'
              "
              :pickerOptions="item.options || {}"
              clearable
            />
            <el-select
              v-else-if="item.type === 'selectTree'"
              v-model="selectValue"
              placeholder="请选择"
              :popper-append-to-body="false"
            >
              <el-option :value="selectTree">
                <el-tree
                  :data="item.treeData"
                  show-checkbox
                  node-key="id"
                  :props="defaultProps"
                  ref="SelectTree"
                  default-expand-all
                  @check-change="handleNodeClick($event, item)"
                  @check="changeNode"
                ></el-tree>
              </el-option>
            </el-select>
            <el-radio-group
              v-model="formData[item.prop]"
              v-else-if="item.type === 'radio'"
            >
              <el-radio
                v-for="(item, index) in item.options"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-col>
        </el-form-item>
        <div class="fr" v-if="!showMore">
          <el-button type="primary" @click="search" v-debounce>查询</el-button>
          <el-button type="major" @click="reset" v-debounce>重置</el-button>
          <el-button
            v-for="(item, index) in extraButton"
            :key="index"
            type="major"
            v-debounce
            @click="btnClick(item)"
          >
            {{ item.label }}
          </el-button>
        </div>
        <div v-else class="fr">
          <slot></slot>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ByQuickSearch",
  props: {
    formItems: {
      type: Array,
      default: () => [],
    },
    formRules: {
      type: Object,
      default: () => {},
    },
    multiline: {
      type: Boolean,
      default: () => false,
    },
    extraButton: {
      type: Array,
      default: () => [],
    },
    showMore: {
      type: Boolean,
      default: () => false,
    },
    // formData: {
    //   type: Object,
    //   default: () => {},
    // }
  },
  data() {
    return {
      formData: {},
      flag: false,
      defaultProps: {
        //tree配置项
        children: "children",
        label: "name",
      },
      selectTree: [], //选中的提醒范围
      selectValue: "", //下拉框绑定的提醒范围
      tooltipFlag: false, //是否显示tooltip
    };
  },
  watch: {
    formItems: {
      handler(val) {
        const formData = {};
        const formItems = this.multiline ? val : [val];
        formItems.forEach((items) => {
          items.forEach((item) => {
            formData[item.prop] = item.value || "";
          });
        });
        this.formData = formData;
      },
      deep: true,
    },
  },
  created() {
    const formData = {};
    const formItems = this.multiline
      ? this.$props.formItems
      : [this.$props.formItems];
    formItems.forEach((items) => {
      items.forEach((item) => {
        formData[item.prop] = item.value || "";
      });
    });
    this.formData = formData;
  },
  methods: {
    chh(val){
      console.log(val);
      this.$emit('change',val)
    },
    handleNodeClick(data, item) {
      let datalist = this.$refs.SelectTree[0].getCheckedNodes();
      // console.log(datalist)
      const parentName = item.treeData[0].name;
      this.selectTree = []; //置空
      this.selectValue = "";
      if (datalist.length === 1) {
        this.selectTree.push({ id: datalist[0].id, label: datalist[0].name });
        this.selectValue = `${parentName}/${datalist[0].name}`;
        this.formData[item.prop] = datalist[0].id;
      }
    },
    //tree只能单选
    changeNode(data) {
      this.$refs.SelectTree[0].setCheckedKeys([data.id]);
    },
    reset() {
      this.$refs.form.clearValidate();
      const findItem = this.formItems.find((item) => item.disabled);
      if (findItem) {
        const formData = {};
        const formItems = this.multiline
          ? this.$props.formItems
          : [this.$props.formItems];
        formItems.forEach((items) => {
          items.forEach((item) => {
            formData[item.prop] = item.value || "";
          });
        });
        this.formData = formData;
      } else {
        this.$refs.form.resetFields();
      }
      this.selectTree = []; //置空
      this.selectValue = "";
      this.$refs.SelectTree && this.$refs.SelectTree[0].setCheckedKeys([]); //清空tree
      this.$emit("reset", this.formData);
    },
    search() {
      this.$refs["form"].validate
        ? this.$refs["form"].validate(async (valid) => {
            if (valid) {
              this.$emit("search", this.formData);
            }
          })
        : this.$emit("search", this.formData);
    },
    btnClick(item) {
      this.$emit("btnClick", item.prop);
    },
    onEmit(e, method) {
      if (method) {
        this.$emit(method, e);
      }
    },
    more() {
      this.flag = !this.flag;
      this.$emit("more", this.flag);
    },
    visibilityChange(event) {
      this.tooltipFlag = true;
      const dom = event.currentTarget;
      // dom.offsetWidth <= dom.firstElementChild.offsetWidth
      //   ? (this.tooltipFlag = false)
      //   : (this.tooltipFlag = true);
    },
    closeVisible() {
      this.tooltipFlag = true;
    },
  },
};
</script>

<style lang="less" scoped>
.quickSearch {
  border-bottom: @border-common;
  min-height: 80px;
  padding: 8px 0px 24px;
  .el-form-item {
    margin-bottom: 0px;
    margin-right: 30px;
    margin-top: 16px;
  }
  .demoForm {
    margin-left: 8px;
  }
  /deep/ .el-form-item__label {
    color: @label-color;
    padding-right: 8px;
    line-height: 32px;
  }
  /deep/ .el-form-item__content {
    line-height: 30px;
  }
  /deep/.el-input__inner {
    height: 32px;
    padding: 0 10px;
  }
  ///deep/ .inputBox .el-input__inner {
  //  padding: 0 10px;
  //}
  /deep/.el-input__icon {
    line-height: 32px;
  }
  /deep/.el-cascader {
    line-height: 32px;
    height: 32px;
    margin-top: -2px;
  }
  /deep/.el-range-editor.el-input__inner {
    height: 32px;
    padding: 0 5px;
  }

  /deep/.el-date-editor .el-range-separator,
  .el-date-editor .el-range__icon {
    line-height: 30px;
  }
  .el-button + .el-button {
    margin-left: 8px;
  }

  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  /deep/.el-button {
    min-width: 80px;
    height: 32px;
    padding: 8px 25px;
    // font-family: @hansan;
    margin-top: 14px;
  }
}
</style>
