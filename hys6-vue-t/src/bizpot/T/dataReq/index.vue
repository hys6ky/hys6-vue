<template>
  <div class="dataReq px-20 pb-20" v-if="taskDecomposition">
    <span v-if="biz_id">
      <div style="margin-top: 15px"></div>
      <ByHeaderSlice title="分解的业务需求基本信息"></ByHeaderSlice>
      <span style="height: 32px; margin-bottom: 10px">
        <el-button
          style="float: right; height: 32px; padding: 0 14px"
          type="primary"
          size="mini"
          @click="retBizReq"
          >返回业务需求</el-button
        >
      </span>
      <div style="font-size: 14px; margin-top: 20px">
        <span style="margin: 0 20px">业务需求编号: {{ from.biz_id }}</span>
        <span style="margin: 0 20px">业务需求名称: {{ from.biz_name }}</span>
        <span style="margin: 0 20px">创建日期: {{ from.created_time }}</span>
      </div>
      <hr />
    </span>
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
    <div class="d-flex mt-20 justify-content-between">
      <ByHeaderSlice title="数据需求" />
      <div style="height: 32px; margin-bottom: 10px">
        <div>
          <el-button
            v-if="this.from.biz_status == 3 ? false : biz_id"
            type="primary"
            @click="addWindows"
          >
            新增数据需求
          </el-button>
          <el-button
            type="primary"
            v-if="!(this.from.biz_status == 3)"
            @click="batchDelete"
            >批量删除</el-button
          >
        </div>
      </div>
    </div>

    <div class="mt-20">
      <ByTable
        :columnArr="columnArr"
        :tableData="tableData"
        :pagination="pagination"
        @handleMultiple="handleMultipleMethod"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @operateItem="operateItem"
      />
    </div>
    <ByModel
      :visible.sync="visible"
      @close="handleClose()"
      :modelTitle="modelTitle"
      modelWidth="50%"
    >
      <ByModelForm :form-data="formValue" :form-items="dataItems" :form-config="dataConfig" :form-rules="formRules" @onlineDate="validateOnlineTimeBlur()" ref="dataFrom"></ByModelForm>
      <template slot="modalFoot">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="confirm('formValue')"  v-show="modelTitle == '编辑' || modelTitle == '新增'" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
    <el-dialog title="表资源分配" :visible.sync="dialogTableVisible" width="90%" :before-close="cloneDoalog">
      <el-row :gutter="24">
        <el-col class="borderStyleTree" :span="9" style="margin-right: 10px; height: 60vh; overflow: auto">
          <!--树菜单-->
          <el-input placeholder="输入关键字进行过滤"  v-model="filterText" />
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="源系统表资源" name="metaRes" :disabled="metaResDis"/>
            <el-tab-pane label="数据中心表资源" name="systemRes" :disabled="systemResDis" />
            <el-tab-pane label="数据资产表资源" name="dataAsset" v-if="false"/>
          </el-tabs>
          <div class="mytree" v-if="activeName === 'systemRes'">
            <el-tree
                class="filter-tree" :data="treedata" :default-expanded-keys="treekeys" :default-checked-keys="treekeys" :show-checkbox="!(this.fenpei1 == 3)" node-key="file_id"
                @check="checkTableData" :filter-node-method="filterNode" ref="tree">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="data.description" v-if="data.file_id">
                                <i class="el-icon-document"></i>
                                <template v-if="data.original_name">{{ data.hyren_name }}【{{data.original_name}}】</template>
                                <template v-else-if="data.original_name === '' && data.table_name !== ''">
                                  {{ data.hyren_name }}{{ data.table_name }}
                                </template>
                                <template v-else>{{ data.hyren_name }}</template>
                            </span>
                            <span :title="data.description" v-else>
                                <i class="el-icon-folder-opened"></i>{{ node.label }}
                            </span>
                        </span>
            </el-tree>
          </div>
          <div class="mytree" v-if="activeName === 'metaRes'">
            <el-tree
                class="filter-tree" :data="treedata" :default-expanded-keys="treekeys" :default-checked-keys="treekeys" :show-checkbox="!(this.fenpei1 == 3)" node-key="file_id"
                @check="checkTableData1" :filter-node-method="filterNode" ref="tree">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="data.description" v-if="data.file_id">
                                <i class="el-icon-document"></i>
                                <template v-if="data.original_name">{{ data.hyren_name }}【{{data.original_name}}】</template>
                                <template v-else-if="data.original_name === '' && data.table_name !== ''">
                                  {{ data.hyren_name }}{{ data.table_name }}
                                </template>
                                <template v-else>{{ data.hyren_name }}</template>
                            </span>
                            <span :title="data.description" v-else>
                                <i class="el-icon-folder-opened"></i>{{ node.label }}
                            </span>
                        </span>
            </el-tree>
          </div>
        </el-col>
        <el-col class="borderStyleTabel" :span="14"  style="margin-right: 10px; height: 60vh; overflow: auto">
          <template>
            <el-table :data="showTableData" stripe height="100%" border style="width: 100% ">
              <el-table-column type="index" width="70"  align="center" label="序号">
              </el-table-column>
              <el-table-column prop="tbl_name" label="表名" >
              </el-table-column>
              <el-table-column prop="tbl_en_name" label="表中文名">
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveTable()" v-if="!(this.fenpei1 == 3)">保 存</el-button>
          <el-button @click="cloneDoalog()">取 消</el-button>
      </span>
    </el-dialog>


<!--    <el-dialog-->
<!--      title="表资源分配"-->
<!--      :visible.sync="dialogTableVisible"-->
<!--      width="90%"-->
<!--    >-->
<!--      <el-row :gutter="20">-->
<!--        <el-col-->
<!--          class="borderStyleTree"-->
<!--          :span="7"-->
<!--          style="margin-right: 10px; height: 60vh; overflow: auto"-->
<!--        >-->
<!--          &lt;!&ndash;树菜单&ndash;&gt;-->
<!--          <el-input placeholder="输入关键字进行过滤" v-model="filterText" />-->
<!--          <div class="mytree">-->
<!--            <el-tree-->
<!--              class="filter-tree"-->
<!--              :data="treedata"-->
<!--              :default-expanded-keys="treekeys"-->
<!--              :default-checked-keys="treekeys"-->
<!--              :show-checkbox="!(this.fenpei1 == 3)"-->
<!--              node-key="file_id"-->
<!--              @check="checkTableData"-->
<!--              :filter-node-method="filterNode"-->
<!--              ref="tree"-->
<!--            >-->
<!--              &lt;!&ndash;            <el-tree class="filter-tree" :data="treedata" :indent="0" @node-click="showTableColumn"&ndash;&gt;-->
<!--              &lt;!&ndash;                     @node-contextmenu="rightClick" show-checkbox node-key="file_id" :filter-node-method="filterNode" ref="tree">&ndash;&gt;-->
<!--              <span class="span-ellipsis" slot-scope="{ node, data }">-->
<!--                <span :title="data.description" v-if="data.file_id">-->
<!--                  <i class="el-icon-document"></i>-->
<!--                  <template v-if="data.original_name"-->
<!--                    >{{ data.hyren_name }}【{{ data.original_name }}】</template-->
<!--                  >-->
<!--                  <template-->
<!--                    v-else-if="-->
<!--                      data.original_name === '' && data.table_name !== ''-->
<!--                    "-->
<!--                  >-->
<!--                    {{ data.hyren_name }}{{ data.table_name }}-->
<!--                  </template>-->
<!--                  <template v-else>{{ data.hyren_name }}</template>-->
<!--                </span>-->
<!--                <span :title="data.description" v-else>-->
<!--                  <i class="el-icon-folder-opened"></i>{{ node.label }}-->
<!--                </span>-->
<!--              </span>-->
<!--            </el-tree>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col-->
<!--          class="borderStyleTabel"-->
<!--          :span="10"-->
<!--          style="margin-right: 10px; height: 60vh; overflow: auto"-->
<!--        >-->
<!--          <template>-->
<!--            <el-table-->
<!--              :data="showTableData"-->
<!--              stripe-->
<!--              height="100%"-->
<!--              border-->
<!--              style="width: 100%"-->
<!--            >-->
<!--              <el-table-column type="index" width="70" align="center" label="序号">-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="tbl_name" label="表名"> </el-table-column>-->
<!--              <el-table-column prop="tbl_en_name" label="表中文名">-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </template>-->
<!--        </el-col>-->
<!--      </el-row>-->

<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button-->
<!--          v-if="!(this.fenpei1 == 3)"-->
<!--          type="primary"-->
<!--          @click="saveTable()"-->
<!--          >保 存</el-button-->
<!--        >-->
<!--        <el-button @click="dialogTableVisible = false">取 消</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </div>

  <div class="dataReq px-20 pb-20" v-else>
    <taskDev
      :formVaue="form1"
      @updateValue="updateTaskDecomposition()"
    ></taskDev>
  </div>
</template>

<script>
import { formItems, columnArr, formValue,dataItems,dataConfig, formRules } from "./mock";
import taskDev from "@/bizpot/T/taskDev";
import { execGetByControllerAllMappingName } from "@/utils/executeRequest";
export default {
  components: {
    taskDev,
  },
  name: "DataReq",
  props: {
    from: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      data_type: '',
      activeName: "metaRes",
      metaResDis: false,
      systemResDis: false,
      dataConfig,
      dataItems,
      selectedRows: [],
      form1: {},
      fenpei1: "",
      row: "",
      isHide: "",
      formValue,
      dataOption: [],
      formItems,
      filterText: "",
      treekeys: [],
      showTableData: [],
      formData: {
        data_req_name: "",
        req_status: "",
        created_time: "",
        owner_id: "",
      },
      //规则
      formRules: {
        data_req_name: [
          { required: true, message: "请输入数据需求名称", trigger: "blur" },
        ],
        data_req_desc: [
          { required: true, message: "请输入数据需求描述", trigger: "blur" },
        ],
        dept: [{ required: true, message: "需求提出部门", trigger: "blur" }],
        online_date: [
          {
            required: true,
            validator: this.validateOnlineTime,
            trigger: "blur",
          },
        ],
      },
      category_id: "",
      options: [],
      columnArr,
      tableData: [],
      errorShow: false,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      treedata: [],
      dialogTableVisible: false,
      isInput: false,
      visible: false,
      taskDecomposition: true,
      modelTitle: "",
      biz_id: this.from.biz_id || "",
    };
  },
  mounted() {
    this.dataStatus();
    this.getTableData();
  },
  // computed: {
  //   //表格弹窗通过value获取label
  //   idValue() {
  //     let id = [];
  //     let arr = this.formValue.owner_name;

  //     arr.forEach((item) => {
  //       id.push(item.lab);
  //     });
  //     return id.join(",");
  //   },
  //   nameValue() {
  //     let name = [];
  //     let arr = this.formValue.owner_name;

  //     arr.forEach((item) => {
  //       name.push(item.value);
  //     });
  //     return name.join(",");
  //   },
  // },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleClick(tab, event) {
      this.showTableData = [];
      this.treekeys  =[];
      console.log(tab, event);
      // 0 数据中心表资源 1 源系统表资源
      if (tab.name === "systemRes"){
        this.getTreeData();
        this.data_type = "0";
      }else if (tab.name === "metaRes") {
        this.getMetaTreeDataInfo("1");
        this.data_type = "1";
      }
    },
    getMetaTreeDataInfo(isPrco){
      this.$executeRequest.execGetByControllerAllMappingName("/T/bizReq/getMetaTreeDataInfo",{isPrco: isPrco}).then(res =>{
        if(res.success){
          this.treedata = res.data || []
          console.log(this.treedata)
        }
      })
    },
    cloneDoalog(){
      this.dialogTableVisible = false
    },
    checkTableData1(node, checkedNodes){
      this.showTableData = [];
      checkedNodes.checkedNodes.forEach(res =>{
        if (res.file_id && res.hyren_name )
          this.showTableData.push({
            category_id: this.category_id,
            tbl_id : res.file_id,
            tbl_name : res.hyren_name,
            tbl_en_name : res.original_name || '',
          })
      })
    },
    //返回数据需求
    retBizReq() {
      this.$emit("updateValue");
    },
    updateTaskDecomposition() {
      this.taskDecomposition = !this.taskDecomposition;
      this.getTableData();
    },
    //上线日期晚于当前日期
    validateOnlineTime(rule, value, callback) {
      const currentDate = new Date();
      if (!value) {
        callback(new Error("请选择上线日期"));
      } else {
        callback();
      }
    },
    validateOnlineTimeBlur() {
      const selectedDate = new Date(this.formValue.online_date);
      if (selectedDate <= new Date() - 8.64e7) {
        this.$message({
          message: "上线日期需要晚于当前日期",
          type: "warning",
        });
      }
    },
    showMessage(message) {
      this.$message({
        message: message,
        type: "warning",
      });
    },
    //查询功能
    search(val) {
      this.formData = val;
      this.getTableData(1);
    },
    //重置功能
    reset(val) {
      this.formData = val;
      this.getTableData();
    },

    //获取列表数据
    getTableData(curr = this.pagination.pageNum) {
      const params = {
        data_req_name: this.formData.data_req_name,
        req_status: this.formData.req_status.toString(),
        created_time: this.formData.created_time,
        owner_id: this.formData.owner_id,
        biz_id: this.biz_id,
        currPage: curr,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execGetByControllerAllMappingName("/T/dataReq", params)
        .then((res) => {
          if (res && res.success && res.message === "Success") {
            const list = res.data.pageList;
            list.map((item) => {
              item.task_num = item.task_num.toString();
              // console.log(this.dataOption, "数据数据");
              this.dataOption.forEach((data) => {
                if (item.req_status == data.value) {
                  // console.log(item.req_status, data.value, "item,item");
                  item.req_status_txt = data.label;
                  // console.log(item.res_status_txt, data.label, "item,item");
                }
              });
            });

            // list.map((item) => {
            //   switch (item.req_status) {
            //     case "0":
            //       item.req_status_txt = "待开发";
            //       break;
            //     case "1":
            //       item.req_status_txt = "开发中";
            //       break;
            //     case "3":
            //       item.req_status_txt = "已结项";
            //       break;
            //   }
            // });
            this.pagination.total = res.data.totalSize;
            this.tableData = list;
          }
        });
    },
    handleMultipleMethod(val) {
      let rows = [];
      val.forEach((item) => {
        if (rows.indexOf(item.data_req_id) == -1) {
          rows.push(item.data_req_id);
        }
      });
      this.selectedRows = rows;
      console.log(this.selectedRows, "数据id");
    },
    //删除
    deleteTask(item) {
      this.$executeRequest
        .execDelByControllerAllMappingName(`/T/dataReq/${item.data_req_id}`)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("删除成功");
            this.getTableData();
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("删除失败", "info");
        });
    },
    //批量删除
    batchDelete() {
      if (this.selectedRows){
        this.$message({
          message: '批量删除信息不能为空',
          type: 'warning'
        });
      }else{
        const params = this.selectedRows.toString();
        this.$executeRequest
            .execDelByControllerAllMappingName("/T/dataReq/batch?ids=" + params)
            .then((res) => {
              // console.log(res, "11223344");
              if (res && res.success) {
                this.$Msg.customizTitle("删除成功");
                this.getTableData();
              }
            });
      }

    },
    //分页
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableData();
    },

    operateItem(type, item) {
      if (type === "edit") {
        this.setDisabled(false);
        this.row = item;
        this.modelTitle = "编辑";
        this.editEchoData(item);

        //select多选 数据回显
        // let str = item.owner_name;
        // const arr = Array.isArray(str) ? str : str.split(",");
        // this.formValue = item;
        // this.formValue.owner_name = arr;

        this.visible = true;
      } else if (type === "del") {
        this.deleteTask(item);
      } else if (type === "fenpei") {
        this.fenpei1 = item.req_status;
        this.category_id = item.data_req_id;
        this.treekeys = [];
        // console.log(item, "-----111----");
        this.setTblDis(true);
        // // 设置回显信息
        console.log(item.data_type)
        if (item.data_type === '0'){
          this.data_type = "0";
          this.activeName = "systemRes";
          this.getTreeData();
          this.systemResDis = false;
        }else if (item.data_type === "1"){
          this.data_type = "1";
          this.getMetaTreeDataInfo("1");
          this.activeName = 'metaRes';
          this.metaResDis = false;
        }else {
          this.getMetaTreeDataInfo("1");
          this.activeName = 'metaRes';
          this.setTblDis(false);
          this.data_type = "1";
        }
        this.getTbl(item.data_req_id);
        this.dialogTableVisible = true;
      } else if (type === "cengjiqueren") {
        this.taskDecomposition = false;
        // debugger;
        // const data = window.microApp.getData();
        // data.baseRouer.push({
        //   path: "/T/taskDev",
        //   query: {
        //     biz_id: item.biz_id,
        //     data_req_id: item.data_req_id,
        //   },
        // });
        this.form1 = item;
      } else if (type === "close") {
        //关闭按钮
        this.stopState(item);
      } else if (type === "check") {
        this.setDisabled(true);
        //数据回显
        this.editEchoData(item);
        this.modelTitle = "查看";
        this.visible = true;
        this.isInput = true;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setTblDis(boole){
      this.metaResDis = boole;
      this.systemResDis = boole;
    },
    //状态获取
    dataStatus() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "ReqStatusEnum",
        })
        .then((res) => {
          if (res.message === "Success") {
            let options = [];
            res.data.map((item) => {
              options.push({
                label: item.value,
                value: item.code,
              });
            });
            this.dataOption = options;
            this.formItems.forEach((item) => {
              if (item.prop == "req_status") {
                item.options = options;
              }
            });
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
    //新增按钮
    addWindows() {
      this.setDisabled(false);
      this.modelTitle = "新增";
      this.formValue = {};
      this.visible = true;
    },
    //新增
    addItem() {
      const params = {
        // owner_id: this.idValue,
        // owner_name: this.nameValue,
        data_req_name: this.formValue.data_req_name,
        data_req_desc: this.formValue.data_req_desc,
        online_date: this.formValue.online_date,
        dept: this.formValue.dept,
        biz_id: this.biz_id,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName("/T/dataReq", params)
        .then((res) => {
          if (res.message === "Success") {
            this.$Msg.customizTitle("新增成功");
            this.getTableData();
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
    //编辑回显
    editEchoData(item) {
      this.$executeRequest
        .execGetByControllerAllMappingName(`/T/dataReq/${item.data_req_id}`)
        .then((res) => {
          if (res && res.success) {
            this.formValue = res.data;
          }
        });
    },

    //编辑
    editItem() {
      const params = {
        data_req_name: this.formValue.data_req_name,
        data_req_desc: this.formValue.data_req_desc,
        online_date: this.formValue.online_date,
        dept: this.formValue.dept,
        biz_id: this.biz_id,
        data_req_id: this.row.data_req_id,
      };
      this.$executeRequest
        .execPutByControllerAllMappingName("/T/dataReq/", params)
        .then((res) => {
          // console.log(res);
          if (res && res.success && res.message === "Success") {
            this.$Msg.customizTitle("编辑成功");
            this.getTableData();
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("编辑失败", "info");
        });
    },

    getTbl(id) {
      // 设置回显信息
      this.$executeRequest
        .execGetByControllerAllMappingName("/T/dataReq/assign/tbl", { id })
        .then((res) => {
          this.treekeys = [];
          if (res && res.success) {
            this.showTableData = res.data;
            if (this.showTableData) {
              this.showTableData.forEach((data) => {
                this.treekeys.push(data.tbl_id);
              });
              console.log(this.treekeys)
            }
          }
        });
    },

    //资源弹窗保存按钮
    saveTable() {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/dataReq/assign/tbl/"+this.data_type,
          this.showTableData
        )
        .then((res) => {
          if (res && res.success) {
            this.dialogTableVisible = false;
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.getTableData();
          }
        });
    },

    checkTableData(node, checkedNodes) {
      this.showTableData = [];
      checkedNodes.checkedNodes.forEach((res) => {
        if (res.file_id && res.hyren_name )
          this.showTableData.push({
            category_id: this.category_id,
            tbl_id: res.file_id,
            tbl_name: res.hyren_name,
            tbl_en_name: res.original_name,
          });
      });
    },

    //获取树结构数据
    getTreeData() {
      this.$executeRequest.execGetByControllerAllMappingName("/T/bizReq/getTreeDataInfo").then(res =>{
        if(res.success){
          this.treedata = res.data || []
          console.log(this.treedata)
        }
      })
    },

    //弹窗确定
    confirm(formValue) {
        this.$refs.dataFrom.transferData().then((data) => {//验证表单
          if (this.modelTitle == "新增") {
            this.addItem();
            this.visible = false;
            console.log(this.formValue, "][]");
          } else if (this.modelTitle == "编辑") {
                this.editItem();
                this.visible = false;
          } else {
            this.isInput = false;
            this.visible = false;
          }
        }).catch(err =>{

        });
    },
    setDisabled(boolean){
      this.dataItems.forEach(item =>{
        item.disabled = boolean;
      })
    },
    // 弹窗关闭
    handleClose() {
      this.visible = false;
      this.$nextTick(() => {
        this.isInput = false;
      });
    },
    //弹窗取消
    handleCancel() {
      this.visible = false;
      this.$nextTick(() => {
        this.isInput = false;
      });
    },

    //关闭功能
    stopState(item) {
      this.$confirm("是否关闭该需求?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$executeRequest
            .execPutByControllerAllMappingName(
              "/T/dataReq/status?id=" + item.data_req_id + "&status=" + 3
            )
            .then((res) => {
              if (res && res.success) {
                this.getTableData();
                this.$message({
                  message: "关闭成功",
                  type: "success",
                });
              }
            });
        })
        .catch(() => {
          this.$Msg.customizTitle("已取消关闭", "info");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.dataReq {
  .el-button {
    height: 32px;
    padding: 8px 10px;
    width: auto;
  }
}
.form {
  margin-top: 30px;
  margin-left: 10px;
}
::v-deep .el-dialog el-dialog__body {
  padding-left: 50px;
}
.borderStyleTree {
  width: 40%;
  border: 1px solid #e6e6e6;
  padding: 1%;
}
.borderStyleTabel {
  width: 56%;
  border: 1px solid #e6e6e6;
  padding: 1%;
}
.el-form .el-row {
  margin: 8px 0;
}
::v-deep .el-dialog .el-dialog__flooter {
  text-align: center;
}
// ::v-deep .el-dialog .el-form-item__label {
//   width: 160px;
// }
::v-deep .form .el-input {
  width: 300px;
}
::v-deep .el-dialog__body .el-input__inner {
  padding: 0 10px;
}
::v-deep .el-dialog__body .el-input--prefix .el-input__inner {
  padding: 0 30px;
}
::v-deep .el-dialog .el-dialog__body .el-textarea__inner {
  padding: 0 10px;
  //width: 82%;
}
</style>
