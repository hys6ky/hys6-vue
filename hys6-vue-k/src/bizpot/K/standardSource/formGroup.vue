<template>
  <div class="formGroup">
    <el-form
      :label-width="formConfig.labelWidth"
      :model="formData"
      :rules="formRules"
      :ref="formConfig.ref"
    >
      <div class="fr">
        <el-button type="primary" @click="historyVersion" v-if="false"> 历史版本 </el-button>
        <el-button type="primary" @click="addRulesHandler" v-if="tagRule">新增规则</el-button>
        <el-button
          style="
            height: 32px;
            padding: 0 14px;
            margin-right: 10px;
            overflow: auto;
          "
          type="primary"
          @click.native="ret"
        >
          返 回
        </el-button>

      </div>
      <el-row v-for="(v, j) in formList" :key="j" style="overflow: auto">
        <ByHeaderSlice :title="v.title" v-if="v.title" />
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
            ></el-input>
            <el-input
              v-model.number="formData[item.prop]"
              v-else-if="item.type === 'number'"
              :placeholder="item.placeholder || '请输入'"
              :disabled="item.disabled"
            ></el-input>
            <el-select
              v-model="formData[item.prop]"
              v-else-if="item.type === 'select'"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :filterable="item.filterable"
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
            <el-input
              v-model="formData[item.prop]"
              :type="item.type"
              v-else-if="item.type === 'textarea'"
              :placeholder="item.placeholder || '请输入'"
              :row="item.row || 2"
              :disabled="item.disabled"
            ></el-input>
            <el-cascader
              v-model="formData[item.prop]"
              :options="item.options"
              v-else-if="item.type === 'cascader'"
              :placeholder="item.placeholder || '请选择'"
              :disabled="item.disabled"
              :props="item.props"
              :show-all-levels="item.levels ? item.levels : false"
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
              <slot :name="item.prop" :disabled="item.disabled"></slot>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ByModel
      :visible.sync="compareModel"
      modelTitle="历史版本对比"
      modelWidth="1200px"
      @close="compareModel = false"
      @closed="compareModelClosed"
    >
      <div style="padding: 0 20px 0 20px" class="compareBox">
        <div class="d-flex justify-content-between">
          <div class="d-flex font-12 align-items-center">
            <span class="fontweight-600">版本：</span>
            <el-checkbox-group v-model="compareListChoice">
              <el-checkbox
                v-for="item in compareList"
                :key="item.label"
                :label="item.label"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div>
            <el-button type="primary" @click="getCompareData(select_obj_id)">
              对比
            </el-button>
            <el-button type="primary" @click="compareDownLoad">
              对比下载
            </el-button>
          </div>
        </div>
        <div style="overflow-x: auto" v-if="compreListFilter.length > 0">
          <div
            class="d-flex font-12 py-10 compareTitle"
            style="margin-left: 70px"
          >
            <span
              v-for="(item, index) in compreListFilter"
              :key="item.label"
              class="contentWidth"
              :style="{ marginLeft: index !== 0 ? '30px' : '' }"
            >
              {{ item.label }}
            </span>
          </div>
          <div class="pb-10">
            <CompareContent :content="compreListFilter" />
          </div>
        </div>
        <div v-else>
          <ByEmpty />
        </div>
      </div>
      <template slot="modalFoot">
        <el-button @click="compareModel = false">取 消</el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import mixin from "@/mixins/formMixin";
import CompareContent from "./components/compareContent.vue";
export default {
  name: "formGroup",
  mixins: [mixin],
  components: {
    CompareContent,
  },
  props: {
    formList: {
      type: Array,
      default: () => [],
    },
    dataTypeList: {
      type: Array,
      default: () => [],
    },
    codetypeIdList: {
      type: Array,
      default: () => [],
    },
    tagRule: {
      type: Boolean,
      default: () =>false,
    }
  },
  watch: {
    "formData.data_type": {
      handler(val) {
        let type = "";
        if (this.codeList.includes(val)) {
          type = "code";
        } else if (this.textDateList.includes(val)) {
          type = "textDate";
        } else if (this.numList.includes(val)) {
          type = "number";
        }
        this.$emit("typeChange", type);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      compareModel: false,
      select_obj_id: "", //选中的obj_id
      compareList: [], //对比版本列表
      compreListFilter: [], //对比列表
      compareListChoice: [], //对比列表选中
      codeList: ["101", "102", "103"], //代码列表
      textDateList: ["105", "106", "107", "109"], //不需要数字的列表
      numList: ["104", "108"], //需要数字的列表
    };
  },
  methods: {
    //返回数据需求
    ret() {
      this.$emit("updateValue");
    },
    addRulesHandler(){
      this.$emit("addRulesHandler");
    },
    //历史版本
    historyVersion() {
      const { basic_id } = this.formData;
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "K/dbm/normbasic/getCurrentAndHisData",
          { basic_id }
        )
        .then((res) => {
          if (res.code === 999) {
            let list = [];
            res.data.currentData.data_type =
              this.dataTypeList.find(
                (item) => item.value === res.data.currentData.data_type
              )?.label || res.data.currentData.data_type.toString();
            res.data.currentData.code_type_id =
              this.codetypeIdList.find(
                (item) => item.value === res.data.currentData.code_type_id
              )?.label || res.data.currentData.code_type_id.toString();
            list.push({
              label: "当前版本",
              value: res.data.currentData,
            });
            Object.keys(res.data.hisData).forEach((item) => {
              res.data.hisData[item][0].data_type =
                this.dataTypeList.find(
                  (v) => v.value === res.data.hisData[item][0].data_type
                )?.label || res.data.hisData[item][0].data_type.toString();
              res.data.hisData[item][0].code_type_id =
                this.codetypeIdList.find(
                  (v) => v.value === res.data.hisData[item][0].code_type_id
                )?.label || res.data.hisData[item][0].code_type_id.toString();
              list.push({
                label: `版本${res.data.hisData[item][0].version}`,
                value: res.data.hisData[item][0],
              });
            });
            this.compareList = list;
            this.compreListFilter = [];
            this.compareModel = true;
          }
        });
    },
    getCompareData() {
      // console.log(this.compareListChoice);
      this.compreListFilter = this.compareList.filter((item) =>
        this.compareListChoice.includes(item.label)
      );
    },
    compareModelClosed() {
      this.compareListChoice = [];
      this.compareList = [];
      this.compreListFilter = [];
    },
    compareDownLoad() {
      if (this.compareListChoice.length === 0) {
        this.$Msg.customizTitle("请选择历史对比版本", "warning");
        return;
      }
      const version_s = this.compareList
        .filter(
          (item) =>
            this.compareListChoice.includes(item.label) &&
            item.label !== "当前版本"
        )
        .map((item) => item.value.version);
      const params = new FormData();
      params.append("basic_id", this.formData.basic_id);
      params.append("version_s", version_s);
      this.$executeRequest
        .downloadPostFileAllMappingNameParams(
          "K/dbm/normbasic/exportExcel",
          params
        )
        .then((res) => {
          const blob = res;
          let fileName = `${this.compareList[0].value.norm_cname}历史版本对比.xlsx`;
          if (window.navigator.msSaveOrOpenBlob) {
            // 兼容IE10
            navigator.msSaveBlob(blob, fileName);
          } else {
            //  chrome/firefox
            let aTag = document.createElement("a");
            // document.body.appendChild(aTag);
            aTag.download = fileName;
            aTag.href = URL.createObjectURL(blob);
            if (aTag.all) {
              aTag.click();
            } else {
              //  兼容firefox
              const evt = document.createEvent("MouseEvents");
              evt.initEvent("click", true, true);
              aTag.dispatchEvent(evt);
            }
            URL.revokeObjectURL(aTag.href);
          }
        });
    },
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
  .widthFrom {
    width: 50%;
  }
  // padding:0 100px;
  ::v-deep .el-form-item__label {
    color: @titletxt-color;
  }
  ::v-deep .el-input__inner {
    padding: 10px;
    height: 32px;
    font-size: 14px;
    color: @tiptxt-color;
  }
  ::v-deep .el-textarea__inner {
    font-family: @pingfang;
    padding: 10px;
    font-size: 14px;
    color: @tiptxt-color;
  }
  ::v-deep .el-select,
  ::v-deep .el-cascader {
    width: 100%;
  }
  .compareBox {
    /deep/.el-checkbox__inner {
      width: 12px;
      height: 12px;
    }
    /deep/ .el-checkbox__label {
      font-size: 12px;
    }
    /deep/.el-checkbox__inner::after {
      top: 0;
    }
    .compareTitle {
      border-bottom: @border-common;
      width: fit-content;
      min-width: calc(100% - 100px);
    }
    .contentWidth {
      min-width: 120px;
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
}
</style>
