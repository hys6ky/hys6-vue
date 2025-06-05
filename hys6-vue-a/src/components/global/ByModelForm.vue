<template>
  <div class="byModelForm">
    <el-form
      :label-width="formConfig.labelWidth"
      :model="formData"
      :rules="formRules"
      :ref="formConfig.ref"
      :style="formConfig.width ? 'width: ' + formConfig.width + 'px' : ''"
    >
      <el-row :gutter="gutter">
        <el-col
          v-for="(item, index) in formItems"
          :key="index"
          :span="item.span"
        >
          <el-form-item :label="item.label + '：'" :prop="item.prop">
            <el-input
              v-model="formData[item.prop]"
              v-if="item.type === 'input'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
            ></el-input>
            <el-input
              v-model="formData[item.prop]"
              v-else-if="item.type === 'password'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              type="password"
              show-password
              auto-complete="new-password"
            ></el-input>
            <div v-else-if="item.type === 'icon'">
              <el-input
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
                :suffix-icon="formData[item.prop]"
                @focus="showIconPicker = true"
                readonly
              ></el-input>
              <iconPicker
                v-if="showIconPicker"
                :icon="formData[item.prop]"
                @select="iconSelect"
                @close="showIconPicker = false"
              />
            </div>
            <el-select
              v-model="formData[item.prop]"
              v-else-if="item.type === 'select'"
              :multiple="item.multiple || false"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
            >
              <el-option
                v-for="v in item.options"
                :key="v.value"
                :label="v.label"
                :value="v.value"
              >
                <span style="float: left">{{ v.label }}</span>
                <span
                  v-if="v.color"
                  class="d-block fr"
                  :style="{
                    width: '20px',
                    height: '20px',
                    background: v.color,
                    borderRadius: '4px',
                    marginTop: '7px',
                  }"
                ></span>
              </el-option>
            </el-select>
            <el-input
              v-model="formData[item.prop]"
              :type="item.type"
              v-else-if="item.type === 'textarea'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              :row="2"
            ></el-input>
            <el-radio-group
              v-model="formData[item.prop]"
              v-else-if="item.type === 'radio'"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="(item, index) in item.options"
                :key="index"
                :label="item.value"
                @change="radioChange"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <el-switch
              v-else-if="item.type === 'switch'"
              v-model="formData[item.prop]"
              :active-color="item.activeColor || '#ff4949'"
              :active-text="item.activeText || '不允许'"
              :active-value="item.activeValue || '0'"
              :inactive-text="item.inactiveText || '允许'"
              :inactive-value="item.inactiveValue || '1'"
              :inactive-color="item.inactiveColor || '#13ce66'"
            ></el-switch>
            <el-cascader
              v-model="formData[item.prop]"
              :options="item.options"
              :props="item.props || {}"
              v-else-if="item.type === 'cascader'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              filterable
              :ref="item.prop"
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
            <el-color-picker
              v-model="formData[item.prop]"
              v-else-if="item.type === 'colorPicker'"
              :disabled="item.disabled"
            ></el-color-picker>
            <el-row v-else-if="item.type === 'tag'" :gutter="24">
              <div
                v-for="(v, j) in formData[item.prop]"
                :key="j"
                class="d-inline-block mr-5"
              >
                <el-tag :color="v.tagColor">{{ v.tagName }}</el-tag>
              </div>
            </el-row>
            <el-row v-else-if="item.type === 'table'">
              <ByTable
                :columnArr="item.columnArr"
                :tableData="formData[item.prop]"
              ></ByTable>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import mixin from "@/mixins/formMixin.js";
import ByTable from "./ByTable.vue";
import iconPicker from "../iconPicker.vue";
export default {
  name: "ByModelForm",
  mixins: [mixin],
  components: {
    ByTable,
    iconPicker,
  },
  props: {
    formItems: {
      type: Array,
      default: () => [],
    },
    gutter: {
      type: Number,
      default: () => 20,
    },
  },
  data() {
    return {
      showIconPicker: false,
    };
  },
  methods: {
    iconSelect(icon) {
      this.showIconPicker = false;
      this.$emit("iconSelect", icon);
    },
    radioChange(val){
      this.$emit("radioChange",val)
    }
  },
};
</script>

<style lang="less" scoped>
.byModelForm {
  .el-form-item {
    margin-bottom: 20px;
  }
  // padding:0 100px;
  ::v-deep .el-form-item__label {
    font-family: @pingfang;
    color: @titletxt-color;
  }
  ::v-deep .el-input__inner {
    height: 32px;
    font-family: @pingfang;
    font-size: 14px;
    color: @titletxt-color;
    padding: 0 10px;
  }
  ::v-deep .el-textarea__inner {
    font-family: @pingfang;
    font-size: 14px;
    color: @titletxt-color;
    padding: 0 10px;
  }
  ::v-deep .el-select,
  ::v-deep .el-cascader {
    width: 100%;
  }
  ::v-deep .el-date-picker{
    height: 32px;
    font-family: @pingfang;
    font-size: 14px;
    color: @thbg-color;
    padding: 0 2px;
  }
}
</style>
