<template>
  <div class="standardSource h100 d-flex">
    <ByTree
      :data="treeData"
      :type="'datafenceng'"
      :default-props="treeProps"
      :default-checked-keys="expandedKeys"
      @contextmenu="terrCheck"
      @detail="detail"
      @addLog="addLog"
      @addStandard="addStandard"
      @logDetail="logDetail"
      @editLog="editLog"
      @delete="deleteById"
      ref="standardSourceTree"
    />
    <div class="flex-1 px-20 overflow-auto" v-if="isTarget">
      <el-tabs v-model="activeName">
        <el-tab-pane label="定义信息" name="first"></el-tab-pane>
        <el-tab-pane label="历史信息" name="second" v-if="false"></el-tab-pane>
        <el-tab-pane label="规则信息" name="third" v-if="false"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === 'first'">
        <div class="pt-20">
          <FormGroup
            :formData="formData"
            :formList="formList"
            :formConfig="formConfig"
            :formRules="formRules"
            :dataTypeList="data_type_list"
            :codetypeIdList="code_type_id_list"
            @updateValue="ret"
            @typeChange="typeChange"
            ref="check"
          >
            <template v-slot:viewCode="data">
              <el-link
                type="primary"
                class="linkTag"
                @click="ViewCodeHandler"
              >
                查看代码值
              </el-link>
            </template>
          </FormGroup>
        </div>
        <div class="pb-20 d-flex justify-content-end btns">
          <el-button @click="cancel">取消</el-button>
          <!--					<el-button type="primary" @click="edit" v-show="!isEdit">编辑1</el-button>-->
          <el-button type="primary" @click="save" v-show="isEdit"
            >保存</el-button
          >
        </div>
      </div>
      <div v-else-if="activeName === 'second'">
        <div style="margin-top: 16px" class="pb-20">
          <ByTable
            :tableData="historyTabelData"
            :columnArr="historyColumnArr"
            @linkTo="linkTo"
            :pagination="pagination"
          />
        </div>
      </div>
      <div v-else>
        <div class="pt-20">
          <FormGroup
            :formData="rulesFormData"
            :formList="rulesFormList"
            :formConfig="rulesFormConfig"
            @updateValue="ret"
          >
            <template slot="addRules">
              <div class="btns d-flex justify-content-end w100">
                <el-button type="primary" @click="addRulesHandler"
                  >新增规则</el-button
                >
              </div>
            </template>
          </FormGroup>
          <ByTable
            :tableData="rulesTableData"
            :columnArr="rulesColumnArr"
            @linkTo="linkToRules"
            :pagination="pagination"
            @operateItem="operateHandler"
          />
        </div>
      </div>
    </div>
    <div class="flex-1 px-20 overflow-auto" v-else>
      <ByQuickSearch
        :form-data="queryFrom"
        :formItems="catelogsFormItems"
        @search="search"
        @reset="reset"
      ></ByQuickSearch>
      <div class="mt-20">
        <ByContainerTitle title="标准列表"></ByContainerTitle>
        <div style="margin-top: 16px" class="pb-20">
          <ByTable
            :tableData="catelogsTableData"
            :columnArr="catelogsColumnArr"
            :pagination="pagination"
            @handleMultiple="handleMultipleMethod"
            @operateItem="operateItem"
            @sizeChange="sizeChange1"
            @currentChange="currentChange1"
          />
        </div>
      </div>
    </div>
    <ByModel
      :visible.sync="visible"
      :modelTitle="modelTitle"
      @close="dialogCancel"
    >
      <ByModelForm
        :formData="modelFormData"
        :formItems="modelFormItems"
        :formRules="modelFormRules"
        :formConfig="modelFormConfig"
        style="padding: 0 100px"
        ref="standardSource"
      />
      <template slot="modalFoot">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="confirm" v-debounce>确 定</el-button>
      </template>
    </ByModel>
    <ByModel
      :visible.sync="bulkImportVisible"
      modelTitle="批量导入"
      @close="handleClose1"
    >
      <el-row class="file">
        <el-col :span="24" :offset="1">
          <span v-if="fileList.length > 0"
            >确认导入: " {{ fileList[0].name }} "
          </span>
        </el-col>
      </el-row>
      <template slot="modalFoot">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="upFile()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
    <ByModel
      :visible.sync="viewCodeVisible"
      modelTitle="查看标准代码"
      :footerShow="false"
      modelWidth="820px"
      @close="handleClose1"
    >
      <div>
        <el-row :gutter="24" style="margin-bottom: 7px">
          <el-col :span="4"
            ><h4 style="color: #2e3033">标准代码编码:</h4></el-col
          >
          <el-col :span="15">{{ viewCodeItem.code_encode || "--" }}</el-col>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 7px">
          <el-col :span="4"
            ><h4 style="color: #2e3033">标准代码类名:</h4></el-col
          >
          <el-col :span="15">{{ viewCodeItem.code_type_name || "--" }}</el-col>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 7px">
          <el-col :span="4"><h4 style="color: #2e3033">标准描述:</h4></el-col>
          <el-col :span="15">{{ viewCodeItem.code_type_name || "--" }}</el-col>
        </el-row>
      </div>
      <ByContainerTitle title="代码列表" class="pt-20 bottomList">
      </ByContainerTitle>
      <ByTable
        :tableData="viewCodeTableData"
        :columnArr="viewCodeTableColumnArr"
        :pagination="codePagination"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        class="pt-20"
      />
    </ByModel>
    <ByDrawer :visible.sync="rulesVisible" :drawTitle="rulesModelTitle">
      <ByHeaderSlice title="规则信息" />
      <div class="mb-20" style="border-bottom: 1px solid #e3e4e5">
        <ByModelForm
          :formData="rulesModelFormData"
          :formItems="rulesModelFormItems"
          :formRules="rulesModelFormRules"
          :formConfig="rulesModelFormConfig"
          :gutter="0"
          ref="rulesDrawerForm"
        />
      </div>
      <ByHeaderSlice title="规则列表" />
      <ByQuickSearch
        :formItems="rulesModelSearchFormItems"
        @search="drawRulesSearch"
        @reset="drawRulesReset"
      ></ByQuickSearch>
      <div class="pt-20">
        <ByTable
          :tableData="rulesModelTableData"
          :columnArr="rulesModelCulumnArr"
          :pagination="pagination"
          @selectionChange="selectionChange"
        ></ByTable>
      </div>
      <template slot="drawFoot">
        <el-button @click="rulesVisible = false">取 消</el-button>
        <el-button type="primary" @click="drawRulesConfirm" v-debounce
          >保存</el-button
        >
      </template>
    </ByDrawer>
    <ByModel
      :visible.sync="importDataStandardsVisible"
      modelTitle="批量导入"
      @close="handleClose1"
      @closed="handleClosed"
    >
      <div>
        <div class="d-flex">
          <el-upload
            accept=".xls,.xlsx"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="exceedHandler"
            :limit="1"
            :fileList="fileList"
          >
            <el-button size="small" type="primary" style="margin-right: 20px">
              点击上传
            </el-button>
          </el-upload>
          <el-button
            type="primary"
            v-debounce
            @click="getDataStandardsTemplate"
          >
            模板下载
          </el-button>
        </div>
        <el-upload
          action=""
          :fileList="fileList"
          :on-remove="clearFileList"
          class="standardFileList"
        ></el-upload>
      </div>

      <template slot="modalFoot">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="upFile()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import FormGroup from "../standardSource/formGroup.vue";
import {
  formList,
  formItem1,
  formData,
  formConfig,
  formRules,
  modelFormConfig,
  modelFormData,
  modelFormRules,
  modelFormItems,
  catelogsFormItems,
  catelogsColumnArr,
  historyColumnArr,
  historyTabelData,
  treeData,
  viewCodeColumnArr,
  viewCodeItem,
  viewCodeTableColumnArr,
  viewCodeTableData,
  rulesFormList,
  rulesFormData,
  rulesFormConfig,
  rulesColumnArr,
  rulesTableData,
  rulesModelFormItems,
  rulesModelFormData,
  rulesModelFormRules,
  rulesModelFormConfig,
  rulesModelCulumnArr,
  rulesModelTableData,
  rulesModelSearchFormItems,
} from "./mock.js";
import ByTree from "@/components/global/ByTree.vue";
import { downloadGetFileAllMappingNameParams } from "@/utils/executeRequest";
export default {
  name: "standardSource",
  components: { ByTree, FormGroup },
  data() {
    return {
      expandedKeys: [],
      stendType: "",
      fileList: [],
      treeData: [],
      dbmDataType: [],
      unitCode: [],
      queryFrom: {},
      treeProps: {
        children: "children",
        label: "label",
      },
      dropList: [
        {
          type: "EDIT",
          label: "编辑目录",
        },
        {
          type: "DEL",
          label: "删除目录",
        },
        {
          type: "PEER",
          label: "添加同级目录",
        },
        {
          type: "SUB",
          label: "添加子目录",
        },
        {
          type: "STANDARD",
          label: "添加标准",
        },
      ],
      sort_id: "",
      isFlag: [],
      type: "",
      basic_id: "",
      visible: false,
      modelTitle: "新增目录",
      formList: JSON.parse(JSON.stringify(formList)),
      formData,
      formConfig,
      formRules,
      activeName: "first",
      isTarget: false,
      isEdit: false,
      modelFormConfig,
      modelFormData,
      modelFormRules,
      modelFormItems,
      catelogsFormItems, //目录表格筛选条件
      catelogsColumnArr, //目录表格列
      catelogsTableData: [], //目录表格数据
      batchIssueData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      codePagination: {
        total: 0,
        codePageNum: 1,
        codePageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      formItem1,
      fromTreeData: {},
      historyColumnArr, //历史表格列
      historyTabelData, //历史表格数据
      treeDataFilter: treeData,
      bulkImportVisible: false,
      importDataStandardsVisible: false,
      viewCodeVisible: false,
      viewCodeItem,
      viewCodeColumnArr,
      viewCodeTableColumnArr,
      viewCodeTableData,
      rulesFormList,
      rulesFormData,
      rulesFormConfig,
      rulesColumnArr,
      rulesTableData,
      rulesVisible: false,
      rulesModelFormItems,
      rulesModelFormData,
      rulesModelFormRules,
      rulesModelTitle: "新建规则",
      rulesModelFormConfig,
      rulesModelCulumnArr,
      rulesModelTableData,
      rulesModelSearchFormItems,
      data_type_list: [], //数据类型options
      code_type_id_list: [], //所属代码options
      isTag : '1',
    };
  },
  typeChange(type) {
    if (!this.isEdit) {
      return false;
    }
    if (type === "code") {
      //编码类不展示小数长度
      this.formList[2].formItems.map((item) => {
        item.disabled = false;
        item.prop === "decimal_point" ? (item.disabled = true) : "";
      });
      this.formData.decimal_point = "";
    } else if (type === "textDate") {
      //文本日期不展示小数长度
      this.formList[2].formItems.map((item) => {
        item.disabled = false;
        item.prop === "decimal_point" ? (item.disabled = true) : "";
        item.prop === "code_type_id" ? (item.disabled = true) : "";
        item.prop === "viewCode" ? (item.disabled = true) : "";
      });
      this.formData.decimal_point = "";
      this.formData.code_type_id = "";
    } else if (type === "number") {
      this.formList[2].formItems.map((item) => {
        item.disabled = false;
        item.prop === "code_type_id" ? (item.disabled = true) : "";
        item.prop === "viewCode" ? (item.disabled = true) : "";
      });
      this.formData.code_type_id = "";
    }
  },
  mounted() {
    this.dbmDataType = this.getCategoryItems("DbmDataType");
    this.isFlag = this.getCategoryItems("IsFlag");
    this.getDbmCodeTypeIdAndNameInfo();
    this.getDbmSortInfoTreeData();
    this.getDbmNormbasicInfo();
    this.getDbmNormbasicIdAndNameInfo();
    // this.setOptions('dataType',this.dbmDataType);
  },
  methods: {
    handleClose1() {
      this.viewCodeVisible = false;
      this.importDataStandardsVisible = false;
    },
    handleClosed() {
      this.fileList = [];
    },
    exceedHandler() {
      this.$Msg.customizTitle("只能导入一篇", "error");
    },
    clearFileList(file, fileList) {
      this.fileList = fileList;
    },
    importDataStandards() {
      this.fileList = [];
      this.importDataStandardsVisible = true;
    },

    getDbmSortInfoTreeData() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/tree/getDbmSortInfoTreeData"
        )
        .then((res) => {
          if (res && res.success) {
            this.treeData = [];
            // this.treeData.push({
            //   id: 0,
            //   label: "添加目录",
            //   expanded: false,
            //   type: "add",
            // });
            res.data.dbmSortInfoTreeDataList.forEach((data) => {
              this.treeData.push(data);
            });
            this.setOptions("attribute", res.data.dbmSortInfoTreeDataList);
            this.setOptions("belongsClass", res.data.dbmSortInfoTreeDataList);
            this.setOptions("parent", res.data.dbmSortInfoTreeDataList);
          }
        });
    },
    async getCategoryItems(category) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams("/K/code/getCategoryItems", {
          category: category,
        })
        .then((res) => {
          if (res && res.success) {
            if (category === "DbmDataType") {
              res.data.forEach((item) => {
                item.key = item.code;
                item.label = item.value;
                item.value = item.code;
              });
              this.data_type_list = res.data;
              this.setOptions("data_type", res.data);
            }
            return res.data;
          }
        });
    },
    // 获取所属代码
    async getDbmCodeTypeIdAndNameInfo() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/codetypeinfo/getDbmCodeTypeIdAndNameInfo"
        )
        .then((res) => {
          if (res && res.success) {
            res.data.dbmCodeTypeInfos.map((type) => {
              type.value = type.code_type_id;
              type.label = type.code_type_name;
              type.label1 = type.code_encode;
              type.key = type.code_type_id;
            });
            this.unitCode = res.data;
            this.code_type_id_list = res.data.dbmCodeTypeInfos;
            this.setOptions("code_type_id", res.data.dbmCodeTypeInfos);
          }
        });
    },
    async setOptions(prop, data) {
      this.formList.map((from) => {
        from.formItems.map((item) => {
          item.prop === prop && (item.options = data);
        });
      });
      if (prop == "parent") {
        this.catelogsFormItems.forEach((item) => {
          if (item.prop === "parent") {
            item.options = data;
          }
        });
      }
      if (prop == "attribute") {
        this.modelFormItems.map((item) => {
          item.prop === "attribute" && (item.options = data);
        });
      }
    },

    handleClose() {
      this.visible = false;
    },
    batchDelete(params) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/batchDeleteDbmNormbasic",
          { basic_id_s: params }
        )
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("批量删除成功", "success");
            this.isTarget = false;
            if (this.sort_id) {
              this.getDbmNormbasicInfoBySortId(this.sort_id);
            } else {
              this.getDbmNormbasicInfo();
            }
          }
        });
    },
    add(node) {
      this.modelFormData = {};
      console.log(this.modelFormData);
      this.modelTitle = "新增目录";
      (this.stendType = "1"),
        this.modelFormItems.map((item) => (item.disabled = false));
      this.visible = true;
    },
    terrCheck(val) {
      if (val.command == "SUB" || val.command == "PEER") {
        this.addLog(val);
      } else if (val.command == "DEL") {
        this.deleteById(val);
      } else if (val.command == "EDIT") {
        this.editLog(val);
      } else if (val.command == "STANDARD") {
        this.addStandard();
      }
    },
    //增加目录
    addLog(data) {
      this.expandedKeys = [];
      this.modelFormData = {};
      this.stendType = "1";
      let ids = [];
      this.nodeParentId(data.node, ids);
      if (data.command == "SUB") {
        var reverse = ids.reverse();
        this.modelFormData.attribute = reverse;
        this.expandedKeys = reverse;
      } else if (data.command == "PEER") {
        var spliceID = ids.splice(1).reverse();
        this.modelFormData.attribute = spliceID;
        this.expandedKeys = spliceID;
      }
      this.modelTitle = "新增目录";
      this.modelFormItems.map(
        (item) => item.prop === "attribute" && (item.disabled = true)
      );
      this.visible = true;
    },
    deleteById(data) {
      let ids = [];
      this.nodeParentId(data.node, ids);
      var spliceID = ids.splice(1).reverse();
      this.expandedKeys = spliceID;
      this.diaglogDelete(data.data.id);
    },
    //编辑目录
    editLog(data) {
      this.expandedKeys = [];
      console.log(data);
      let ids = [];
      this.nodeParentId(data.node, ids);
      this.getDbmSortInfoById(data.data.id, ids);
      this.modelTitle = "编辑目录";
      this.modelFormItems.map(
        (item) => item.prop === "attribute" && (item.disabled = true)
      );
      console.log(this.modelFormData);
    },
    //
    nodeParentId(node, ids) {
      if (node.data.parent_id !== "0") {
        ids.push(node.data.id);
        this.nodeParentId(node.parent, ids);
      } else {
        ids.push(node.data.id);
      }
    },
    ret() {
      if (this.type == "2") {
        this.getDbmNormbasicInfoById(this.basic_id);
        this.formList.map((items) => {
          items.formItems.map((item) => {
            item.disabled = true;
          });
        });
        this.$nextTick(() => {
          this.$refs.check.$refs[this.formConfig.ref].resetFields();
        });
        this.isTarget = false;
      } else if (this.type == "1" && this.sort_id) {
        this.isTarget = false;
        this.getDbmNormbasicInfoBySortId(this.sort_id);
      } else {
        this.getDbmNormbasicInfo();
        this.isTarget = false;
      }
    },
    //增加指标
    addStandard(data) {
      // alert("增加指标")
      // console.log(data)
      this.isTarget = true;
      this.$nextTick(() => {
        this.$refs.standardSourceTree.currentId = ""; //删除高亮
        this.$refs.standardSourceTree.$refs.tree.setCurrentKey(null); //清空树的选中状态
        this.$refs.check.$refs[this.formConfig.ref].resetFields(); //清空表单及验证状态
        const currentNode =
          this.$refs.standardSourceTree.$refs.tree.getCurrentKey();
        console.log(currentNode);
      });
      this.formData = {
        // norm_code: '',
        norm_cname: "",
        norm_ename: "",
        norm_aname: "",
        belongsClass: "",
        data_type: "",
        col_len: "",
        decimal_point: "",
        code_type_id: "",
        business_def: "",
        business_rule: "",
        norm_basis: "",
        dbm_domain: "",
        manage_department: "",
        relevant_department: "",
        norm_status: "",
        origin_system: "",
        // related_system: '',
        formulator: "",
      };
      // this.getDbmSortInfoTreeData()
      this.formList.map((items) => {
        items.formItems.map((item) => {
          item.disabled = false;
        });
      });
      this.isTarget = true;
      this.isEdit = true;
      this.type = "1";
    },

    //点击新建添加指标
    addTarget() {
      this.formData = {
        // norm_code: '',
        norm_cname: "",
        norm_ename: "",
        norm_aname: "",
        belongsClass: "",
        data_type: "",
        col_len: "",
        decimal_point: "",
        code_type_id: "",
        business_def: "",
        business_rule: "",
        norm_basis: "",
        dbm_domain: "",
        manage_department: "",
        relevant_department: "",
        norm_status: "",
        origin_system: "",
        // related_system: '',
        formulator: "",
      };
      // this.getDbmSortInfoTreeData()
      this.formList.map((items) => {
        items.formItems.map((item) => {
          item.disabled = false;
        });
      });
      this.isTarget = true;
      this.isEdit = true;
      this.type = "1";
    },
    //点击指标
    detail(node) {
      // alert("点击指标")
      // console.log(node)
      // this.$nextTick(() => {
      //   this.$refs.check.$refs[this.formConfig.ref].resetFields()
      // })
      // this.formList.map(items => {
      //   items.formItems.map(item => {
      //     item.disabled = true
      //   })
      // })
      // this.isTarget = true;
      // this.isEdit = false;
      this.sort_id = node.id;
      this.isTarget = false;
      console.log(this.expandedKeys);
      this.pagination.pageNum = 1;
      this.pagination.pageSize = 10;
      this.getDbmNormbasicInfoBySortId(node.id);
    },
    //点击目录
    logDetail(node) {
      this.sort_id = node.id;
      // alert("点击目录")
      this.isTarget = false;
      console.log(node);
      this.getDbmNormbasicInfoBySortId(node.id);
    },
    edit() {
      this.formList.map((items) => {
        items.formItems.map((item) => {
          item.disabled = false;
        });
      });
      this.isEdit = true;
      this.type = "2";
    },
    cancel() {
      if (this.type == "2") {
        this.getDbmNormbasicInfoById(this.basic_id);
        this.formList.map((items) => {
          items.formItems.map((item) => {
            item.disabled = true;
          });
        });
        this.$nextTick(() => {
          this.$refs.check.$refs[this.formConfig.ref].resetFields();
        });
        this.isTarget = false;
      } else if (this.type == "1" && this.sort_id) {
        this.isTag = '1';
        this.isTarget = false;
        this.getDbmNormbasicInfoBySortId(this.sort_id);
      } else {
        this.getDbmNormbasicInfo();
        this.isTarget = false;
      }
    },
    save() {
      console.log(this.formData);
      let is_check = false;
      this.$refs.check
        .transferData()
        .then((data) => {
          is_check = true;
          if (is_check) {
            this.$Msg
              .confirmMsg("确认变更该标准吗？变更后将生成新的版本。")
              .then(() => {
                console.log(this.$refs);
                console.log(data, "*****");
                if (this.type == "1") {
                  // 新增代码操作
                  var sort_id = "";
                  if (data.belongsClass) {
                    sort_id = data.belongsClass[data.belongsClass.length - 1];
                  }
                  let param = {
                    // norm_code: data.norm_code,
                    sort_id: sort_id,
                    norm_cname: data.norm_cname,
                    norm_ename: data.norm_ename,
                    norm_aname: data.norm_aname,
                    business_def: data.business_def,
                    business_rule: data.business_rule,
                    dbm_domain: data.dbm_domain,
                    norm_basis: data.norm_basis,
                    data_type: data.data_type,
                    code_type_id: data.code_type_id,
                    col_len: data.col_len,
                    decimal_point: data.decimal_point ? data.decimal_point : 0,
                    manage_department: data.manage_department,
                    relevant_department: data.relevant_department,
                    origin_system: data.origin_system,
                    // related_system: data.related_system,
                    formulator: data.formulator,
                    norm_status: data.norm_status,
                  };
                  this.$executeRequest
                    .execPostByControllerAllMappingNameParams(
                      "/K/dbm/normbasic/addDbmNormbasicInfo",
                      param
                    )
                    .then((res) => {
                      if (res && res.success) {
                        this.$Msg.customizTitle("保存成功");
                        this.$nextTick(() => {
                          this.$refs.check.$refs[
                            this.formConfig.ref
                          ].resetFields();
                        });
                        this.isTarget = false;
                        if (this.sort_id) {
                          this.getDbmNormbasicInfoBySortId(this.sort_id);
                        } else {
                          this.getDbmNormbasicInfo();
                        }
                      }
                    });
                } else {
                  // 编辑代码操作
                  var sort_id = "";
                  if (data.belongsClass !== data.sort_id) {
                    sort_id = data.belongsClass[data.belongsClass.length - 1];
                  } else {
                    sort_id = data.sort_id;
                  }
                  console.log(data);
                  let param = {
                    basic_id: data.basic_id,
                    // norm_code: data.norm_code,
                    sort_id: sort_id,
                    norm_cname: data.norm_cname,
                    norm_ename: data.norm_ename,
                    norm_aname: data.norm_aname,
                    business_def: data.business_def,
                    business_rule: data.business_rule,
                    dbm_domain: data.dbm_domain,
                    norm_basis: data.norm_basis,
                    data_type: data.data_type,
                    code_type_id: data.code_type_id,
                    col_len: data.col_len,
                    decimal_point: data.decimal_point,
                    manage_department: data.manage_department,
                    relevant_department: data.relevant_department,
                    origin_system: data.origin_system,
                    // related_system: data.related_system,
                    formulator: data.formulator,
                    norm_status: data.norm_status,
                  };
                  this.$executeRequest
                    .execPostByControllerAllMappingNameParams(
                      "/K/dbm/normbasic/updateDbmNormbasicInfo",
                      param
                    )
                    .then((res) => {
                      if (res && res.success) {
                        this.$Msg.customizTitle("修改成功");
                        this.isTarget = false;
                        if (this.sort_id) {
                          this.getDbmNormbasicInfoBySortId(this.sort_id);
                        } else {
                          this.getDbmNormbasicInfo();
                        }
                      }
                    });
                }
              })
              .catch((res) => {
                this.$message({
                  message: "已取消",
                  type: "info",
                });
              });
          }
        })
        .catch((err) => {
          is_check = false;
        });
    },
    //弹窗取消
    dialogCancel() {
      this.visible = false;
    },
    exportDataStandards() {
      if (this.queryFrom.createTime) {
        var startDate = this.queryFrom.createTime.replaceAll("-", "");
        var endDate = "99991231";
      }
      let sort_id = "";
      console.log(this.queryFrom.parent);
      if (
        this.queryFrom.parent !== undefined &&
        this.queryFrom.parent !== null
      ) {
        sort_id = this.queryFrom.parent[this.queryFrom.parent.length - 1];
      }
      let param = {
        search_cond: this.queryFrom.search_cond || "",
        status: this.queryFrom.status || "",
        sort_id: sort_id,
        startDate: startDate || "",
        endDate: endDate || "",
        basic_id_s: this.batchIssueData.toString(),
      };
      this.$executeRequest
        .downloadGetFileAllMappingNameParams(
          "/K/dbm/dataimport/exportDataStandards",
          param
        )
        .then((res) => {
          // if (res ){
          const blob = res;
          let fileName = "标准元信息.xlsx";
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
          // }
        });
    },
    batchDel() {
      if (this.batchIssueData.length !== 0) {
        this.$confirm("是否批量删除 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((res) => {
            this.batchDelete(this.batchIssueData.toString());
          })
          .catch((eer) => {
            this.$message({
              message: "已取消",
              type: "info",
            });
          });
      } else {
        this.$message({
          message: "批量删除信息不能为空",
          type: "warning",
        });
      }
    },
    // 批量发布
    batchData() {
      if (this.batchIssueData.length !== 0) {
        this.$confirm("是否批量发布 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((res) => {
            this.batchReleaseDbmNormbasic(this.batchIssueData.toString());
          })
          .catch((eer) => {
            this.$message({
              message: "已取消",
              type: "info",
            });
          });
      } else {
        this.$message({
          message: "批量发布信息不能为空",
          type: "warning",
        });
      }
    },
    //弹窗确认
    confirm() {
      console.log(this.modelFormData);
      this.$refs.standardSource
        .transferData()
        .then((data) => {
          //验证表单
          if (this.stendType == "1") {
            console.log(this.modelFormData.attribute);
            var parent_id = 0;
            var num = 0;
            if (
              this.modelFormData.attribute !== undefined &&
              this.modelFormData.attribute !== null &&
              this.modelFormData.attribute.length !== 0
            ) {
              num = this.modelFormData.attribute.length || 0;
              parent_id = this.modelFormData.attribute[num - 1];
            }
            let param = {
              parent_id: parent_id,
              sort_level_num: num,
              sort_name: this.modelFormData.sort_name,
              sort_remark: this.modelFormData.sort_remark,
              sort_status: this.modelFormData.sort_status,
            };
            this.$executeRequest
              .execPostByControllerAllMappingNameParams(
                "/K/dbm/sortinfo/addDbmSortInfo",
                param
              )
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("添加成功");
                  this.visible = false;
                  this.getDbmSortInfoTreeData();
                }
              });
          } else {
            let params = {
              sort_id: this.modelFormData.sort_id,
              parent_id: this.modelFormData.parent_id,
              sort_level_num: this.modelFormData.sort_level_num,
              sort_name: this.modelFormData.sort_name,
              sort_remark: this.modelFormData.sort_remark,
              sort_status: this.modelFormData.sort_status,
              create_user: this.modelFormData.create_user,
              create_date: this.modelFormData.create_date,
              create_time: this.modelFormData.create_time,
            };
            this.$executeRequest
              .execPostByControllerAllMappingNameParams(
                "/K/dbm/sortinfo/updateDbmSortInfo",
                params
              )
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("修改成功", "success");
                  this.visible = false;
                  this.expandedKeys.push(this.modelFormData.sort_id);
                  this.getDbmSortInfoTreeData();
                }
              });
          }
        })
        .catch((err) => {});
    },
    // 标准元模板下载
    getDataStandardsTemplate() {
      this.$executeRequest
        .downloadGetFileAllMappingNameParams(
          "/K/dbm/dataimport/getDataStandardsTemplate"
        )
        .then((res) => {
          // if (res ){
          const blob = res;
          let fileName = "标准元信息模板.xlsx";
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
          // }
        });
    },
    // 批量发布
    batchReleaseDbmNormbasic(basic_ids) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/batchReleaseDbmNormbasic",
          { basic_id_s: basic_ids }
        )
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("批量发布成功");
            this.batchIssueData = [];
            if (this.sort_id) {
              this.getDbmNormbasicInfoBySortId(this.sort_id);
            } else {
              this.getDbmNormbasicInfo();
            }
          }
        });
    },
    //弹窗删除目录
    diaglogDelete(id) {
      this.$Msg
        .confirmMsg("确认删除该目录？")
        .then(() => {
          this.$executeRequest
            .execPostByControllerAllMappingNameParams(
              "/K/dbm/sortinfo/deleteDbmSortInfo",
              { sort_id: id }
            )
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("删除成功");
                this.visible = false;
                this.getDbmSortInfoTreeData();
              }
            });
        })
        .catch((err) => {
          this.$message({
            message: "已取消",
            type: "info",
          });
        });
    },
    //目录查询
    search(val) {
      this.pagination.pageNum = 1;
      this.queryFrom = val;
      this.isTag = "2";
      this.searchDbmNormbasic();
    },
    //目录重置
    reset(val) {
      console.log(val, "重置");
    },
    //表格操作
    operateItem(type, row) {
      // console.log(type, row)
      if (type === "check") {
        console.log(row);
        this.basic_id = row.basic_id;
        this.getDbmNormbasicInfoById(row.basic_id);
        this.formList.map((items) => {
          items.formItems.map((item) => {
            item.disabled = true;
          });
        });
        debugger
        console.log( this.formList)
        this.isTarget = true;
        this.isEdit = false;
      }
      // else if (type === "del") {
      //   console.log(row);
      //   this.deleteDbmNormbasicInfo(row.basic_id);
      // } else if (type === "edit") {
      //   console.log(row);
      //   this.basic_id = row.basic_id;
      //   this.getDbmNormbasicInfoById(row.basic_id);
      //   this.formList.map((items) => {
      //     items.formItems.map((item) => {
      //       item.disabled = true;
      //     });
      //   });
      //   this.isTarget = true;
      //   // this.isEdit = false;
      //   this.edit();
      // } else if (type === "issue") {
      //   console.log(row);
      //   let ids = [];
      //   ids.push(row.basic_id);
      //   this.$confirm("是否发布 ?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then((res) => {
      //       this.batchReleaseDbmNormbasic(ids.toString());
      //     })
      //     .catch((eer) => {
      //       this.$message({
      //         message: "已取消",
      //         type: "info",
      //       });
      //     });
      // }
    },
    //查看代码值
    ViewCodeHandler() {
      if (this.formData.code_type_id) {
        this.getCodeData(this.formData.code_type_id);
        this.editEchoData(this.formData.code_type_id);
        this.viewCodeVisible = true;
      } else {
        this.$Msg.customizTitle("请先选择所属代码", "warning");
      }
    },
    //代码项 编辑数据回显
    editEchoData(code_type_id) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/getDbmCodeTypeInfoById?code_type_id=" +
            code_type_id
        )
        .then((res) => {
          if (res && res.success) {
            this.viewCodeItem = res.data;
            // console.log(this.modelFormData, "回显数据");
          }
        });
    },
    //批量导入
    bulkImportHandler() {
      this.fileList = [];
      this.bulkImportVisible = true;
    },
    linkTo(row) {
      console.log(row);
    },
    //新增规则
    addRulesHandler() {
      this.getDbmSortInfoTreeData();
      // this.rulesVisible=true
    },
    //引用规则
    linkToRules(val) {
      console.log(val);
    },
    //规则抽屉表格单选
    selectionChange(value) {
      this.rulesModelTableData.map(
        (item) => (item.checked = item.id === value.id)
      );
    },
    //抽屉确认
    drawRulesConfirm() {
      this.$refs.rulesDrawerForm.transferData().then((data) => {
        console.log(data);
        this.rulesVisible = false;
      });
    },
    operateHandler(type, row) {
      type === "edit" ? (this.rulesVisible = true) : "";
    },
    //
    drawRulesSearch() {},
    drawRulesReset() {},

    handleMultipleMethod(val) {
      console.log(val);
      this.batchIssueData = [];
      val.forEach((data) => {
        this.batchIssueData.push(data.basic_id);
      });
    },
    getDbmNormbasicInfoBySortId(id) {
      let params = {
        sort_id: id,
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      let param = {
        search_cond:  "",
        status: "1",
        sort_id: id,
        startDate:  "",
        endDate: "99991231",
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dbm/normbasic/searchDbmNormbasic",
              param
          )
          .then((res) => {
            if (res && res.success) {
              res.data.dbmNormbasicInfos.forEach((item) => {
                if ("0" == item.norm_status) {
                  item.status = "未发布";
                } else {
                  item.status = "已发布";
                }
                item.createDateTime =
                    this.$dateconversion.dateFormat(item.create_date) +
                    " " +
                    this.$dateconversion.hourFormat(item.create_time);
              });

              this.catelogsTableData = res.data.dbmNormbasicInfos;
              this.pagination.total = res.data.totalSize;
            }
          });
    },
    // 获取全部标准信息
    getDbmNormbasicInfo() {
      let param = {
        search_cond:  "",
        status: "1",
        sort_id: "",
        startDate: "",
        endDate: "99991231",
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dbm/normbasic/searchDbmNormbasic",
              param
          )
          .then((res) => {
            if (res && res.success) {
              res.data.dbmNormbasicInfos.forEach((item) => {
                if ("0" == item.norm_status) {
                  item.status = "未发布";
                } else {
                  item.status = "已发布";
                }
                item.createDateTime =
                    this.$dateconversion.dateFormat(item.create_date) +
                    " " +
                    this.$dateconversion.hourFormat(item.create_time);
              });

              this.catelogsTableData = res.data.dbmNormbasicInfos;
              this.pagination.total = res.data.totalSize;
            }
          });
    },

    //获取列表信息
    getCodeData(code_type_id) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",
          { code_type_id: code_type_id }
        )
        .then((res) => {
          if (res && res.success) {
            this.viewCodeTableData = res.data.dbmCodeItemInfos;
          }
        });
    },
    upFile() {
      let is_check = true;
      if (this.fileList.length === 0) {
        this.$Msg.customizTitle("上传文件不能为空", "warning");
        is_check = false;
      }
      let param = new FormData();
      if (this.fileList.length !== 0 && this.fileList[0].raw) {
        param.append("file", this.fileList[0].raw);
      }
      if (is_check) {
        this.$executeRequest
          .uploadFileAllMappingName(
            "/K/dbm/dataimport/importDataStandards",
            param
          )
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("批量导入成功", "success");
              this.importDataStandardsVisible = false;
              // console.log("")
              if (this.sort_id) {
                this.getDbmNormbasicInfoBySortId(this.sort_id);
                this.getDbmCodeTypeIdAndNameInfo();
                this.getDbmSortInfoTreeData();
                this.getDbmNormbasicInfo();
                this.getDbmNormbasicIdAndNameInfo();
              } else {
                this.getDbmCodeTypeIdAndNameInfo();
                this.getDbmSortInfoTreeData();
                this.getDbmNormbasicIdAndNameInfo();
                this.getDbmNormbasicInfo();
              }
            }
          });
      }
    },
    searchDbmNormbasic() {
      console.log(this.queryFrom);
      if (this.queryFrom.createTime) {
        var startDate = this.queryFrom.createTime.replaceAll("-", "");
        // var startDate = this.queryFrom.createTime[0].replaceAll("-",'');
        // var endDate = this.queryFrom.createTime[1].replaceAll("-",'');
      }
      let param = {
        search_cond: this.queryFrom.search_cond || "",
        status: "1",
        sort_id: this.queryFrom.parent[this.queryFrom.parent.length - 1] || "",
        startDate: startDate || "",
        endDate: "99991231",
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/searchDbmNormbasic",
          param
        )
        .then((res) => {
          if (res && res.success) {
            res.data.dbmNormbasicInfos.forEach((item) => {
              if ("0" == item.norm_status) {
                item.status = "未发布";
              } else {
                item.status = "已发布";
              }
              item.createDateTime =
                this.$dateconversion.dateFormat(item.create_date) +
                " " +
                this.$dateconversion.hourFormat(item.create_time);
            });

            this.catelogsTableData = res.data.dbmNormbasicInfos;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      const extension = file.name.split(".").pop().toLowerCase();
      const isExcel = extension === "xls" || extension === "xlsx";
      if (!isExcel) {
        this.$Msg.customizTitle("上传文件只能是 xls/xlsx 格式!", "error");
        return;
      }
      this.fileList = fileList;
      // if (fileList.length != 0) {
      //   this.bulkImportVisible = true;
      // } else {
      //   this.bulkImportVisible = false;
      // }
    },
    beforeRemove(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList);
    },
    getDbmNormbasicIdAndNameInfo() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/getDbmNormbasicIdAndNameInfo"
        )
        .then((res) => {
          if (res && res.success) {
            // this.related_system = res.dbmNormbasicInfos;
            res.data.dbmNormbasicInfos.forEach((item) => {
              item.label = item.norm_cname;
              item.value = item.basic_id;
              item.key = item.basic_id;
            });
            // this.setOptions("related_system",res.data.dbmNormbasicInfos);
          }
        });
    },
    getDbmNormbasicInfoById(basic_id) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/getDbmNormbasicInfoById",
          { basic_id: basic_id }
        )
        .then((res) => {
          if (res && res.success) {
            res.data.belongsClass = res.data.sort_id;
            if (res.data.norm_status == "0") {
              res.data.status = "未发布";
            } else {
              res.data.status = "已发布";
            }
            this.formData = res.data;
          }
        });
    },
    //分页
    currentChange(val) {
      this.codePagination.codePageNum = val;
      //调用接口
      this.getCodeData();
    },

    sizeChange(val) {
      this.codePagination.codePageNum = 1;
      this.codePagination.codePageSize = val;
      //调用接口
      this.getCodeData();
    },

    //分页
    currentChange1(val) {
      this.pagination.pageNum = val;
      //调用接口
      if(this.isTag == '1'){
        //调用接口
        if (this.sort_id) {
          this.getDbmNormbasicInfoBySortId(this.sort_id);
        } else {
          this.getDbmNormbasicInfo();
        }
      }else {
        this.searchDbmNormbasic();
      }

    },

    sizeChange1(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      if(this.isTag == '1'){
        //调用接口
        if (this.sort_id) {
          this.getDbmNormbasicInfoBySortId(this.sort_id);
        } else {
          this.getDbmNormbasicInfo();
        }
      }else {
        this.searchDbmNormbasic();
      }
    },
    async getDbmSortInfoById(sort_id, ids) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/sortinfo/getDbmSortInfoById",
          { sort_id: sort_id }
        )
        .then((res) => {
          if (res && res.success) {
            // this.$set(this.modelFormData,res.data)
            this.modelFormData = res.data;
            (this.stendType = "2"),
              // this.modelFormData.attribute = ids.reverse();
              this.$set(this.modelFormData, "attribute", ids.reverse());
            this.visible = true;
          }
        });
    },
    // 删除标准源
    deleteDbmNormbasicInfo(basic_id) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/deleteDbmNormbasicInfo",
          { basic_id: basic_id }
        )
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("删除成功", "success");
            this.isTarget = false;
            if (this.sort_id) {
              this.getDbmNormbasicInfoBySortId(this.sort_id);
            } else {
              this.getDbmNormbasicInfo();
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.standardSource {
  .btns {
    .el-button {
      width: 82px;
      height: 32px;
      padding: 8px 0;
    }
  }
  .linkTag {
    margin-left: -90px;
    height: 20px;
  }
  .bottomList {
    border-top: @border-common;
  }
  ::v-deep .standardFileList .el-upload {
    display: none;
  }
}
</style>
