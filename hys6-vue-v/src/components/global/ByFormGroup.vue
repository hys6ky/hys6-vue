<template>
  <div class="formGroup">
    <el-form
      :label-width="formConfig.labelWidth"
      :model="formData"
      :rules="formRules"
      :ref="formConfig.ref"
    >
      <el-row v-for="(v, j) in formList" :key="j">
        <ByHeaderSlice
          :title="v.title"
          v-if="v.title"
          style="margin-bottom: 10px"
        />
        <el-col
          v-for="(item, index) in v.formItems"
          :key="index"
          :span="item.span"
        >
          <el-form-item
            :label="item.label ? item.label + '：' : ''"
            :prop="item.prop"
          >
            <el-input
              v-model="formData[item.prop]"
              v-if="item.type === 'input'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
              class="groupInput"
              @change="$emit('changeInput', item.prop, formData[item.prop])"
            ></el-input>
            <div v-else-if="item.type === 'inputDefined'" class="d-flex">
              <el-input
                v-model="formData[item.prop]"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
                class="groupInput"
              ></el-input>
              <slot :name="item.prop + 'Slot'"></slot>
            </div>
            <el-select
              v-model="formData[item.prop]"
              v-else-if="item.type === 'select'"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :multiple="item.multiple || false"
              class="groupInput"
              @change="$emit('changeSelect', item.prop, formData[item.prop])"
            >
              <el-option
                v-for="v in item.options"
                :key="v.value"
                :label="v.label"
                :value="v.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="formData[item.prop]"
              v-else-if="item.type === 'selectGroup'"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :multiple="item.multiple || false"
            >
              <el-option-group
                v-for="group in item.options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="v in group.options"
                  :key="v.value"
                  :label="v.label"
                  :value="v.value"
                >
                </el-option>
              </el-option-group>
            </el-select>
            <el-radio-group
              v-model="formData[item.prop]"
              v-else-if="item.type === 'radio'"
            >
              <el-radio
                v-for="radio in item.options"
                :key="radio.value"
                :label="radio.value"
                >{{ radio.label }}</el-radio
              >
            </el-radio-group>
            <el-input
              v-model="formData[item.prop]"
              :type="item.type"
              v-else-if="item.type === 'textarea'"
              :placeholder="item.placeholder || '请输入'"
              :rows="2"
              :autosize="item.autosize || false"
              :disabled="item.disabled"
              :readonly="item.readonly"
            ></el-input>
            <el-cascader
              v-model="formData[item.prop]"
              :options="item.options"
              v-else-if="item.type === 'cascader'"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :props="item.props"
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
            <el-date-picker
              style="width: 100%"
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              type="date"
              value-format="yyyyMMdd"
              :placeholder="item.placeholder || '请选择'"
              :pickerOptions="item.options || {}"
              clearable
            />
            <span
              v-else-if="item.type === 'text'"
              class="infoText"
              :class="item.class"
              >{{ formData[item.prop] }}</span
            >
            <div
              v-else-if="item.type === 'link'"
              class="d-flex align-items-center"
              style="height: 40px"
            >
              <slot :name="item.prop"></slot>
            </div>
            <slot
              :name="item.prop + 'Slot'"
              v-else-if="item.type === 'defined'"
            ></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import mixin from "@/mixins/formMixin";
import ByHeaderSlice from "./ByHeaderSlice.vue";
export default {
  name: "ByFormGroup",
  mixins: [mixin],
  props: {
    formList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ByHeaderSlice,
  },
};
</script>

<style lang="less" scoped>
.formGroup {
  .el-form-item {
    margin-bottom: 16px;
  }
  .infoText {
    color: #606266;
    line-height: 40px;
  }
  .successText {
    color: @success-color;
    // color:#E6515D;
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
  }
  ::v-deep .groupInput .el-input__inner {
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
}
</style>
