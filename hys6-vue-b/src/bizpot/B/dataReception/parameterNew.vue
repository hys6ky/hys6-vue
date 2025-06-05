<template>
  <div class="dataDistribution">
    <div class="d-flex px-10 mb-20 justify-content-between">
      <ByHeaderSlice title="数据参数"/>
      <div>
        <!--<el-button type="primary" size="medium" @click="addReception">添加参数</el-button>-->
        <el-button type="primary" size="medium" @click="addCanShu()"
        >添加参数
        </el-button
        >
        <el-button type="primary" size="medium" @click="getWebSQLTreeData"
        >获取样例解析
        </el-button
        >
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="mytree" hight="200">
          <!--          <el-tree-->
          <!--              class="filter-tree"-->
          <!--              :data="initTree"-->
          <!--              :props="defaultProps"-->
          <!--              show-checkbox-->
          <!--              node-key="id"-->
          <!--              ref="tree"-->
          <!--              @node-click="handleNodeClick"-->
          <!--              @check-change="handleTreeNodeChecked"-->
          <!--          ></el-tree>-->
          <ByTree
              class="h100"
              :data="initTree"
              type="dataSource"
              ref="tree"
              @detail="toTarget"
              @checkChange="handleTreeNodeChecked"
          />
        </div>
      </el-col>

      <el-col :span="18">
        <el-form
            ref="showDailogForm"
            :model="showDailogForm"
            label-width="130px"
            size="medium"
        >
          <el-row :gutter="20">
            <el-form-item
                label="任务名称"
                :rules="filter_rules([{ required: true }])"
            >
              <el-input
                  v-model="showDailogForm.dr_task_name"
                  style="width: 230px"
              ></el-input>
            </el-form-item>
            <el-form-item
                label="输入格式"
                :rules="filter_rules([{ required: true }])"
            >
              <el-input
                  :disabled="true"
                  v-model="showDailogForm.dr_format"
                  style="width: 230px"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item
                label="URL地址"
                :rules="filter_rules([{ required: true }])"
            >
              <el-select
                  v-model="showDailogForm.dr_request_method"
                  placeholder="请选择请求方式"
                  style="width: 230px"
              >
                <el-option
                    v-for="item in type"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                >
                </el-option>
              </el-select>
              <el-input
                  v-if="showDailogForm.dr_request_method.length > 0"
                  placeholder="请输入地址"
                  v-model="showDailogForm.dr_url"
                  style="width: 350px; margin-left: 10px"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item
                v-if="showCanShu"
                v-for="(domain, index) in drParamsDefList"
                :label="'参数信息'"
            >
              <template slot-scope="{}" slot="label">
                <span>参数信息</span>
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <i
                      class="el-icon-question"
                      style="font-size: 14px; vertical-align: middle"
                  ></i>
                  <div slot="content">
                    如果value使用占位符,请使用#{key}进行替换,例如#{abc};参数处填写abc=123,多个参数时,中间用`@^隔开
                  </div>
                </el-tooltip>
              </template>
              <el-input
                  v-model="domain.param_key"
                  placeholder="请输入参数名"
                  style="width: 230px"
              ></el-input>
              <el-input
                  v-model="domain.params_value"
                  placeholder="请输入参数值"
                  style="width: 250px; margin-left: 10px"
              ></el-input>
              <el-button
                  type="danger"
                  size="medium"
                  @click.prevent="removeDomain(domain)"
                  style="margin-left: 10px"
              >
                删除
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>

        <ByTable
            style="height: calc(100% - 60px)"
            height="100%"
            :tableData="tableData"
            :columnArr="columnArr"
            @operateItem="operateItem"
            @handleInputChange="handleInputChange"
            @handleSelectChange="handleSelectChange"
            @handleMultiple="handleMultiple"
        />

        <el-form ref="form" :model="form" label-width="130px" size="medium">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                  label="文件名称"
                  prop="dr_file_name"
                  :rules="filter_rules([{ required: true }])"
              >
                <el-input
                    placeholder="请输入文件名称"
                    v-model="form.dr_file_name"
                    style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  label="数据落地目录"
                  prop="dr_plane_url"
                  :rules="filter_rules([{ required: true }])"
                  style="width: 100%"
              >
                <el-input
                    placeholder="请输入数据落地目录"
                    v-model="form.dr_plane_url"
                    style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                  label="文件后缀"
                  prop="dr_file_suffix"
                  :rules="filter_rules([{ required: true }])"
              >
                <el-input
                    placeholder="请输入文件后缀"
                    v-model="form.dr_file_suffix"
                    style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  label="行分隔符"
                  prop="dr_row_separator"
                  :rules="filter_rules([{ required: true }])"
              >
                <el-select
                    v-model="form.dr_row_separator"
                    placeholder="请选择行分隔符"
                >
                  <el-option
                      v-for="item in rowList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                  label="列分割符"
                  prop="dr_database_separator"
                  :rules="filter_rules([{ required: true }])"
              >
                <el-input
                    v-model="form.dr_database_separator"
                    placeholder="请输入列分隔符"
                    style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  label="数据编码格式"
                  prop="dr_database_code"
                  :rules="filter_rules([{ required: true }])"
              >
                <el-select
                    v-model="form.dr_database_code"
                    placeholder="请选择数据编码格式"
                    style="width: 300px"
                >
                  <el-option
                      v-for="item in dataBaseCode"
                      :key="item.value"
                      :label="item.value"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否有表头" prop="is_header">
                <el-radio-group v-model="form.is_header">
                  <el-radio
                      v-for="(item, index) in isFlag"
                      :key="index"
                      :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否标识文件" prop="is_flag">
                <el-radio-group v-model="form.dr_is_flag">
                  <el-radio
                      v-for="(item, index) in isFlag"
                      :key="index"
                      :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文件格式" prop="dbfile_format">
                <el-select
                    v-model="form.dbfile_format"
                    placeholder="文件格式"
                    style="width: 300px"
                    disabled
                >
                  <el-option
                      v-for="item in fileFormat"
                      :key="item.value"
                      :label="item.value"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="df_remark">
                <el-input
                    type="textarea"
                    v-model="form.df_remark"
                    placeholder="备注"
                    style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-button
              type="primary"
              class="rightbtn"
              @click="saveDistributeData(form)"
              size="medium"
          >下一步
          </el-button>
          <el-button
              type="primary"
              class="rightbtn"
              @click="returnPage()"
              size="medium"
          >返 回
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import {getFlatArr, parseSimpleTreeData} from "@/utils/datahandler";
import {columnArr} from "./mock";
import {v4 as uuidv4} from "uuid";

export default {
  name: "dataDistributeAdd",
  //写定义的变量数据方法等
  data() {
    return {
      columnArr,
      addFilag: false,
      rule: validator.default,
      showDailog: false,
      showCanShu: false,
      showDailogForm: {
        dr_task_name: "",
        dr_format: "REST服务",
        dr_request_method: [],
        dr_url: "",
      },
      type: [],
      drParamsDefList: [],  // 添加参数
      drAnalyses: [],
      tableData: [],
      treeData: [],
      defaultProps: {
        label: "label",
        children: "children",
      },
      parsedData: [],
      initTree: [],
      form: {
        dr_file_name: "",
        dr_plane_url: "",
        dr_file_suffix: "",
        dr_row_separator: "",
        dr_database_separator: "",
        dr_database_code: "",
        is_header: "0",
        dr_is_flag:"0",
        dbfile_format: "1",
        df_remark: "",

        // sql_table: "",
        // is_upper: "0",
        // is_reduce: "0",
        // is_mark_file: "0",
        // is_compress: "0",
        // is_flag: "0",
        // is_release: "0",
        // basicInfoForm: {
        //     sqlMain: ''
        // },
      },
      isFlag: [],
      fileFormat: "1",
      dicList: [],
      filterText: "",
      dd_id: "",
      multipleSelection: [],
      rowList: [
        // 行分隔符
        {
          value: "\\n",
          label: "\\n",
        },
        {
          value: "\\r",
          label: "\\r",
        },
        {
          value: "\\n\\r",
          label: "\\r\\n",
        },
      ],
      dataBaseCode: [], // 编码格式
      tablecolumn: [],
      iftablecolumn: false,
      formUpdate: {},
      distributeData: {},
      newlineCharacter: [
        {
          value: "\\n",
          code: "1",
          title: "\\n  (Linux、Unix换行符)",
        },
        {
          value: "\\r",
          code: "2",
          title: "\\r  (Mac OS换行符)",
        },
        {
          value: "\\r\\n",
          code: "3",
          title: "\\r\\n  (windows换行符)",
        },
      ],
    };
  },
  computed: {},
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.drParamsDefList = [];
    // console.log(this.$route.query.paramList.length)
    // console.log(this.$route.query.paramList)
    this.addFilag = this.$route.query.isAdd === true
    // console.log(this.addFilag)
    const isEdit = this.$route.query.isEdit === true;
    if (isEdit) {
      this.showDailogForm = {
        dr_task_name: this.$route.query.drTask.dr_task_name,
        dr_format: "REST服务",
        dr_request_method: this.$route.query.drTask.dr_request_method,
        dr_url: this.$route.query.drTask.dr_url,
      };
      for (let i = 0; i < this.$route.query.paramList.length; i++) {
        this.showCanShu = true;
        // console.log(this.$route.query.paramList[i])
        this.drParamsDefList.push(this.$route.query.paramList[i])
      }
      (this.type = this.$route.query.drTask.type),
          (this.form = {
            dr_file_name: this.$route.query.fileDef.dr_file_name,
            dr_plane_url: this.$route.query.fileDef.dr_plane_url,
            dr_file_suffix: this.$route.query.fileDef.dr_file_suffix,
            dr_row_separator: this.$route.query.fileDef.dr_row_separator,
            dr_database_separator:
            this.$route.query.fileDef.dr_database_separator,
            dr_database_code: this.$route.query.fileDef.dr_database_code,
            is_header: this.$route.query.fileDef.is_header,
            dbfile_format: this.$route.query.fileDef.dbfile_format,
            df_remark: this.$route.query.fileDef.df_remark,
            dr_is_flag:  this.$route.query.fileDef.dr_is_flag,     //是否是标识文件
          }),
          (this.tableData = this.$route.query.drAnalyses);
      this.getTreeData();
    }
  },
  mounted() {
    this.getCategoryItems(); // 获取代码项
    this.getCodeFormat(); // 获取数据编码格式
    this.getFileFormat(); // 获取文件格式
    this.getTableTop(); // 获取表头
  },
  methods: {
    // 获取数据编码格式
    getCodeFormat() {
      this.$Code.getCategoryItems({category: "DataBaseCode"}).then((res) => {
          this.dataBaseCode = res.data;
      });
    },
    // 获取代码项
    getCategoryItems() {
      this.$Code.getCategoryItems({category: "RequestMethod"}).then((res) => {
        this.type = res.data;
      });
    },
    // 获取文件格式
    getFileFormat() {
      this.$Code.getCategoryItems({category: "FileFormat"}).then((res) => {
        this.fileFormat = res.data;
      });
    },
    // 获取表头
    getTableTop() {
      this.$Code.getCategoryItems({category: "IsFlag"}).then((res) => {
        this.isFlag = res.data;
      });
    },
    // 添加参数
    addCanShu() {
      // this.drAnalyses = []
      this.showCanShu = true;
      const newDataObject = {
        param_id: null,
        drTask_id: null,
        param_key: "",
        params_value: "",
      };
      this.drParamsDefList.push(newDataObject);
    },
    // 删除行参数
    removeDomain(item) {
      var index = this.drParamsDefList.indexOf(item);
      this.drParamsDefList.splice(index, 1);
    },

    // 展示解析的数据到表中显示
    handleTreeNodeChecked(checkedNodes) {
      // console.log(checkedNodes, "checkedNodes选中的节点");
      const selectedNodes = [];
      for (const node of checkedNodes) {
        this.getParentNodes(node, selectedNodes);
      }

      // console.log(selectedNodes, "selectedNodes");
    },
    getParentNodes(node, selectedNodes) {
      selectedNodes.push(node);
      if (node.parent) {
        this.getParentNodes(node.parent, selectedNodes);
      }
    },
    // 获取样例接口参数并展示树形数据
    getWebSQLTreeData() {
      this.$refs.showDailogForm.validate((valid) => {
        if (valid) {
          this.getTreeData();
        }
      });
    },
    getTreeData(){
      const data = {
        drTask: {
          dr_task_id: null,
          dr_task_name: this.showDailogForm.dr_task_name,
          dr_format: "REST服务",
          dr_request_method: this.showDailogForm.dr_request_method,
          dr_url: this.showDailogForm.dr_url,
        },
        drParamsDefList: this.drParamsDefList,
      };
      this.$executeRequest
          .execPostByMenuUrl("/ObtainSampleData", data)
          .then((res) => {
            this.parsedData = JSON.parse(res.data);
            const list = JSON.parse(res.data);
            if (Array.isArray(list)){
              list.map((item) => {
                let obj = this.listTransTree(item);
                this.initTree = obj;
              });
            } else {
              let aaa = [];
              aaa.push(list)
              aaa.map((item) => {
                let obj = this.listTransTree(item);
                this.initTree = obj;
              });
            }
          });
    },
    listTransTree(item) {
      let obj = Object.keys(item).map((key) => {
        if (typeof item[key] === "string" || typeof item[key] === "number") {
          return {
            label: key,
            showLable: key,
            labelText: key,
            type: "text",
            id: uuidv4(),
          };
        } else {
          return {
            label: key,
            showLable: key,
            labelText: key,
            type: "text",
            id: uuidv4(),
            children: this.listTransTree(item[key]),
          };
        }
      });
      return obj;
    },


    // 返回按钮
    returnPage() {
      this.$router.push({
        name: "dataReception",
      });
    },
    // 下一步
    saveDistributeData(formName) {
      if (this.addFilag) {
        let saveData = {
          drTask: {
            dr_task_id: null,
            dr_task_name: this.showDailogForm.dr_task_name,
            dr_format: "REST服务",
            dr_request_method: this.showDailogForm.dr_request_method,
            dr_url: this.showDailogForm.dr_url,
          },
          fileDef: {
            dr_file_id: null, //文件ID
            dr_task_id: null, //任务ID
            dr_file_name: formName.dr_file_name, //文件名称
            dr_file_suffix: formName.dr_file_suffix, //文件后缀
            dr_row_separator: formName.dr_row_separator, //行分隔符
            dr_database_separator: formName.dr_database_separator, //列分隔符
            dr_database_code: formName.dr_database_code, //编码格式
            dr_plane_url: formName.dr_plane_url, //数据落地目录
            dbfile_format: formName.dbfile_format, //文件格式
            is_header: formName.is_header, //是否需要表头
            dr_is_flag: formName.dr_is_flag,     //是否是标识文件
            df_remark:formName.df_remark,   //备注
          },
          drAnalyses: this.tableData,
          drParamsDefList: this.drParamsDefList
        };
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$executeRequest
                .execPostByMenuUrl("/saveTask", saveData)
                .then((res) => {
                  if (res && res.success) {
                    // this.$Msg.customizTitle("添加成功", "success");
                    this.$router.push({
                      name: "dataReceptionJob",
                      query:{
                        task_id :res.data,
                      }
                    });
                  }
                });
          }
        });
      }
      if (this.$route.query.drTask.dr_task_id != null) {
        let editData = {
          drTask: {
            dr_task_id: this.$route.query.drTask.dr_task_id,
            dr_task_name: this.showDailogForm.dr_task_name,
            dr_format: "REST服务",
            dr_request_method: this.showDailogForm.dr_request_method,
            dr_url: this.showDailogForm.dr_url,
          },
          fileDef: {
            dr_file_id: this.$route.query.fileDef.dr_file_id, //文件ID
            dr_task_id: this.$route.query.fileDef.dr_task_id, //任务ID
            dr_file_name: formName.dr_file_name, //文件名称
            dr_file_suffix: formName.dr_file_suffix, //文件后缀
            dr_row_separator: formName.dr_row_separator, //行分隔符
            dr_database_separator: formName.dr_database_separator, //列分隔符
            dr_database_code: formName.dr_database_code, //编码格式
            dr_plane_url: formName.dr_plane_url, //数据落地目录
            dbfile_format: formName.dbfile_format, //文件格式
            is_header: formName.is_header, //是否需要表头
            dr_is_flag: formName.dr_is_flag,     //是否是标识文件
            df_remark:formName.df_remark,   //备注
          },
          drAnalyses: this.tableData,
          drParamsDefList: this.drParamsDefList
        };
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$executeRequest
                .execPostByMenuUrl("/updateExecuteTask", editData)
                .then((res) => {
                  if (res && res.success) {
                    // this.$Msg.customizTitle("修改成功", "success");
                    this.$router.push({
                      name: "dataReceptionJob",
                      query:{
                        task_id :res.data
                      }
                    });
                  }
                });
          }
        });
      }
    },

    // 树节点触发
    handleNodeClick(data) {
      // console.log(data,'data数据')
    },
    dismissiftablecolumn() {
      this.iftablecolumn = false;
    },
    // 搜索过滤节点
    filterNode(value, data) {
      // 如果检索内容为空,直接返回
      if (!value) return true;
      // 如果传入的value和data中的name相同说明是匹配到了,匹配时转小写匹配
      // 检索内容为 original_name table_name hyren_name
      if ("object" !== typeof data.file_id && data.file_id !== "") {
        return (
            ("object" !== typeof data.original_name &&
                data.original_name !== "" &&
                data.original_name.indexOf(value) !== -1) ||
            ("object" !== typeof data.table_name &&
                data.table_name !== "" &&
                data.table_name.toLowerCase().indexOf(value.toLowerCase()) !==
                -1) ||
            ("object" !== typeof data.hyren_name &&
                data.hyren_name !== "" &&
                data.hyren_name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        );
      }
    },
    // 选择列触发事件
    handleSelectionColumn(row) {
      this.multipleSelection = row;
    },

    // 点击树形节点最后一级
    toTarget(node, treeNode) {
      const parentNodes = [];
      let keyValue = {};
      keyValue.id = node.id;
      keyValue.label = node.label;
      parentNodes.push(keyValue);
      this.childrenNode(treeNode, parentNodes);
      // console.log(parentNodes,"parentNodes");
      if (parentNodes.length == 1) {
        let param = {};
        param.dr_anal_name = parentNodes[0].label;
        param.dr_anal = parentNodes[0].label;
        this.tableData.push(param)
      } else if (parentNodes.length > 1) {
        var result = '';
        for (let i = 0; i < parentNodes.length; i++) {
          result += parentNodes[i].label;
          if (i < parentNodes.length - 1) {
            result += '.'; // 在除最后一个元素外的元素后添加逗号和空格
          }
        }
        var strings = result.split(".");
        var reversedStr = '';
        for (let i = strings.length - 1; i >= 0; i--) {
          reversedStr += strings[i] + ".";
        }
        var s = reversedStr.slice(0, reversedStr.length - 1);
        let param = {};
        param.dr_anal_name = parentNodes[0].label;
        param.dr_anal = s;
        this.tableData.push(param)
      }
      var uniqueArr = Array.from(new Set(this.tableData.map(JSON.stringify)), JSON.parse);
      this.tableData = uniqueArr;
      // this.analData.push(parentNodes);
      // console.log(this.analData,"analData")
    },
    childrenNode(treeNode, parentNodes) {
      // console.log(treeNode,"treeNode")
      // console.log(parentNode,"parentNode")
      let parentNode = treeNode.parent;
      if (parentNode.data.id && parentNode.data.label) {
        let keyValue = {};
        keyValue.id = parentNode.data.id;
        keyValue.label = parentNode.data.label;
        parentNodes.push(keyValue);
        this.childrenNode(parentNode, parentNodes);
      }
    },
    //点击其它属性
    operateItem(type, row,index) {
      // console.log(type,'dayingcanshu');
      // console.log(row,'row参数');
      // console.log(index,'索引')
      if (type === 'del') {
        this.tableData.splice(index,1);
      }
    },
    // 表格输入框变化
    handleInputChange(prop, row) {
      // console.log(prop, row);
    },
    // 表格下拉框变化
    handleSelectChange(prop, row, index) {
      // console.log(row);
    },
    //表格多选
    handleMultiple(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang="less">
.fontStyle {
  margin-top: 5px;
  color: #2196f3;
  font-size: 18px;
}

.saveButton {
  margin-top: 5px;
  float: right;
}

.rightbtn {
  margin-top: 12px;
  float: right;
  margin: 10px;
  margin-bottom: 10px;
}
</style>
