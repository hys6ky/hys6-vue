<template>
  <div class="px-20">
    <div v-if="this.biz_id" class="datas">
      <ByHeaderSlice title="分解的数据需求基本信息"></ByHeaderSlice>
      <span style="height: 32px; margin-bottom: 10px">
        <el-button
          style="float: right; height: 32px; padding: 0 14px"
          type="primary"
          size="mini"
          @click="retBizReq"
          >返回数据需求</el-button
        >
      </span>
      <div style="font-size: 14px; margin-top: 20px">
        <span style="margin: 0 20px"
          >数据需求编号: {{ formVaue.data_req_id }}</span
        >
        <span style="margin: 0 20px"
          >数据需求名称: {{ formVaue.data_req_name }}</span
        >
        <span style="margin: 0 20px"
          >创建时间: {{ formVaue.created_time }}</span
        >
      </div>
      <hr />
    </div>
    <ByQuickSearch
      :formItems="formItems"
      :formData="formData"
      @search="search"
      @reset="reset"
    />

    <div class="container mt-10">
      <div class="d-flex mt-20 justify-content-between">
        <ByHeaderSlice title="任务开发" />
        <div style="height: 32px; margin-bottom: 20px">
          <el-button
            type="primary"
            @click="addWindows"
            v-if="this.formVaue.req_status == 3 ? false : data_req_id"
            >新增任务</el-button
          >
          <el-button
            type="primary"
            @click="batDelete"
            v-if="!(this.formVaue.req_status == 3)"
            >批量删除</el-button
          >
        </div>
      </div>
      <ByTable
        :tableData="tableData"
        :columnArr="columnArr"
        :pagination="pagination"
        @handleMultiple="handleMultipleMethod"
        @operateItem="operate"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></ByTable>
    </div>
    <!-- 弹窗 -->
    <ByModel
      :visible.sync="visible"
      :modelTitle="mode == 0 ? '新增任务' : mode == 1 ? '编辑页面' : '查看页面'"
      modelWidth="50%"
      @close="handleClose()"
    >
      <ByModelForm :form-data="form" :form-items="taskItems" :form-rules="formRules" :form-config="taskConfig" ref="taskFrom"
        @startDate="validateOnlineTimeBlur()"  ></ByModelForm>
      <template slot="modalFoot">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" v-if="mode !== 2" @click="confirm()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
    <!-- 状态变更弹窗 -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialog"
      width="30%"
      :before-close="handleClose"
    >
      <span class="select-title">任务状态</span>
      <el-select
        v-model="statusValue"
        clearable
        placeholder="请选择"
        :style="{ width: '80%' }"
      >
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.label"
          :value="{ value: item.value, label: item.label }"
        >
        </el-option>
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="statuChange()">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  tableData,
  columnArr,
  formItems,
  formData,
  form,
  taskConfig,
  taskItems,
} from "./mock";
import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  name: "taskDev",
  components: {ByModelForm},
  data() {
    return {
      taskItems,
      taskConfig,
      biz_id: this.formVaue.biz_id || "",
      data_req_id: this.formVaue.data_req_id || "",
      mode: 0,
      statusOption: [],
      statusValue: "",
      selectedRows: [],
      dialog: false,
      form,
      task_id: "",
      categoryLabel: "",
      options: [],
      options1: [],
      tableData,
      columnArr,
      formItems,
      status: "",
      formData,
      formRules: {
        task_name: [
          { required: true, message: "请输任务名称", trigger: "blur" },
        ],
        start_date: [
          {
            required: true,
            validator: this.validateStartTime,
            trigger: "blur",
          },
        ],
        end_date: [
          {
            required: true,
            validator: this.validateEndTime,
            trigger: "blur",
            // message: "结束时间不能小于开始时间",
          },
        ],
        owner_name: [
          { required: true, message: "请选择开发人员", trigger: "blur" },
        ],

        task_category: [
          { required: true, message: "请选择任务类别", trigger: "blur" },
        ],
      },

      pagination: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      isInput: false,
      visible: false,
    };
  },
  props: {
    formVaue: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.developmentStatus();
    this.getPeople();
    this.taskType();
    this.getData();
  },
  methods: {
    //返回数据需求
    retBizReq() {
      this.$emit("updateValue");
    },
    //状态获取
    async developmentStatus() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "TaskStatusEnum",
        })
        .then((res) => {
          if (res && res.message === "Success") {
            res.data.map((item) => {
              item.label = item.value,
              item.value = item.code
            });
            this.statusOption = res.data;
            this.formItems.forEach((item) => {
              if (item.prop == "task_status") {
                item.options = res.data;
              }
            });
          }
        });
    },
    setOptions(prop,data){
      this.taskItems.forEach(item =>{
        if (item.prop === prop){
          item.options = data;
        }
      })
    },
    //负责人名称
    filterData() {
      this.form.owner_id = [];
      this.form.owner_name.forEach((item) => {
        this.options.forEach((opt) => {
          if (opt.value == item) {
            this.form.owner_id.push(opt.user_id);
          }
        });
      });
    },
    //开始时间小于结束时间校验
    validateStartTime(rule, value, callback) {
      const currentData = new Date();
      if (!value) {
        callback(new Error("请选择开始时间"));
      } else {
        callback();
      }
    },
    validateOnlineTimeBlur() {
      const selectedDate = new Date(this.form.start_date);
      if (selectedDate <= new Date() - 8.64e7) {
        this.$message({
          message: '上线日期晚于当前日期',
          type: 'warning'
        });
      }
    },

    validateEndTime(rule, value, callback) {
      if (!value) {
        callback(new Error("请选择结束日期"));
      } else {
        if (!this.form.start_date) {
          callback(new Error("请选择开始日期"));
        } else if (
          Date.parse(this.form.start_date) - 8.64e7 >=
          Date.parse(value)
        ) {
          callback(new Error("结束日期必须大于开始日期"));
        } else {
          callback();
        }
      }
    },
    showMessage(message) {
      this.$message({
        message: message,
        type: "warning",
      });
    },

    //获取表格数据
    async getData() {
      const params = {
        task_name: this.formData.task_name,
        task_status: this.formData.task_status ? this.formData.task_status.toString() : '',
        start_date: this.formData.start_date,
        task_category: this.formData.task_category ? this.formData.task_category.toString() : '', //有问题
        end_date: this.formData.end_date,
        owner_id: this.formData.owner_id ? this.formData.owner_id.toString() : '',
        biz_id: this.biz_id,
        data_req_id: this.data_req_id,
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      console.log(params)
      this.$executeRequest
        .execGetByControllerAllMappingName("/T/taskDev", params)
        .then((res) => {
          if (res && res.success) {
            const list = res.data.pageList;
            list.map((item) => {
              this.statusOption.forEach((data) => {
                if (item.task_status == data.value) {
                  item.task_status_txt = data.label;
                }
              });
              this.options1.forEach((data) => {
                if (item.task_category == data.value) {
                  item.task_category_txt = data.label;
                }
              });
              // switch (item.task_status) {
              //   case "0":
              //     item.task_status = "待开发";
              //     break;
              //   case "1":
              //     item.task_status = "开发中";
              //     break;
              //   case "2":
              //     item.task_status = "已完成";
              //     break;
              // }
            });
            this.pagination.total = Number(res.data.totalSize);
            this.tableData = list;
          } else {
            this.tableData = [];
            this.pagination.total = 0;
          }
        });
    },

    //查询功能
    search(val) {
      this.formData = val;
      this.pagination.pageNum =  1;
      this.getData();
    },

    //重置功能
    reset(val) {
      console.log(val);
    },

    //获取需求分析人列表
    async getPeople() {
      this.$executeRequest.execGetByUrl("/Base/sysUser/getAllSysUserWithOperator").then((res) => {
        if (res && res.success) {
          console.log("sysUsers: "+JSON.stringify(res.data))
          res.data.forEach((item) => {
            item.label =  item.user_name,
            item.value = item.user_name,
            item.key = item.user_name
          });
          this.setOptions('owner_name',res.data)
          this.options = res.data;
          this.formItems.forEach((item) => {
            if (item.prop === "owner_name") {
              item.options = res.data;
            }
          });
        }
      });
    },

    // 修正 删除 新增
    operate(type, row) {
      if (type === "del") {
        this.deleteTask(row);
      } else if (type === "edit") {
        this.setDisabled(false);
        this.mode = 1;
        if (this.mode === 1) {
          this.editEchoData(row);
          this.task_id = row.task_id;
        }
        this.visible = true;
      } else if (type === "changeStatus") {
        //变更状态接口
        this.status = row.task_id;
        this.statusChange();
      } else if (type === "check") {
        this.setDisabled(true);
        this.mode = 2;
        //数据回显
        this.editEchoData(row);
        this.isInput = true;
        this.visible = true;
      }else if(type === "assetsInventory"){
        // alert("跳转到资产盘点");
        const data = window.microApp.getData();
        data.baseRouer.push({
          path: "/N/N1002",
          query: {
            id: row.data_req_id,
          },
        });

      }
    },

    //新增项目
    addWindows() {
      this.setDisabled(false);
      this.visible = true;
      this.mode = 0;
      if (this.mode === 0) {
        this.form = {};
      }
    },

    //新增弹窗-接口
    addDatas() {
      this.filterData()
      console.log(this.form)
      const params = {
        task_name: this.form.task_name,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        owner_id: this.form.owner_id.toString(),
        owner_name: this.form.owner_name.toString(),
        task_desc: this.form.task_desc,
        task_category: this.form.task_category,
        biz_id: this.biz_id,
        data_req_id: this.data_req_id,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName("/T/taskDev", params)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("新增成功");
            this.getData();
          }
        });
    },

    //编辑弹窗-接口
    edditDatas() {
      debugger
      console.log(this.form)
      this.filterData()
      const params = {
        task_name: this.form.task_name,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        owner_id: this.form.owner_id.toString(),
        owner_name: this.form.owner_name.toString(),
        task_desc: this.form.task_desc,
        task_category: this.form.task_category,
        task_id: this.task_id,
        biz_id: this.biz_id,
        data_req_id: this.data_req_id,
      };
      this.$executeRequest
        .execPutByControllerAllMappingName("/T/taskDev", params)
        .then((res) => {
          if (res.message == "Success") {
            this.$Msg.customizTitle("编辑成功");
            this.getData();
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("编辑失败", "info");
        });
    },

    //任务类型
    async taskType() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "TskCategoryEnum",
        })
        .then((res) => {
          if (res && res.success) {
            let opt = [];
            res.data.map((item) => {
              opt.push({
                label: item.value,
                value: item.code,
              });
            });
            this.setOptions("task_category",opt)
            this.options1 = opt;
            this.formItems.forEach((item) => {
              if (item.prop == "task_category") {
                item.options = opt;
              }
            });
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
    setDisabled(boolean){
      this.taskItems.forEach(item =>{
        item.disabled = boolean;
      })
    },
    //编辑回显
    editEchoData(row) {
      this.$executeRequest
        .execGetByControllerAllMappingName(`/T/taskDev/${row.task_id}`)
        .then((res) => {
          if (res && res.success) {
            this.form.task_name = res.data.task_name;
            this.form.start_date = res.data.start_date;
            this.form.end_date = res.data.end_date;
            if (res.data.owner_name.length > 1){
              this.form.owner_name = [];
              this.form.owner_name.push(res.data.owner_name)
            }else {
              this.form.owner_name = res.data.owner_name.split(",");
            }
            // this.form.owner_name = res.data.owner_name.split(",");
            this.form.task_desc = res.data.task_desc;
            this.form.task_category = res.data.task_category;
          }
        });
    },

    // 删除任务
    deleteTask(row) {
      this.$executeRequest
        .execDelByControllerAllMappingName(`/T/taskDev/${row.task_id}`)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("删除成功");
            this.getData();
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("删除失败", "info");
        });
    },

    //获取多选 行的数据
    handleMultipleMethod(val) {
      let rows = [];
      val.forEach((item) => {
        if (rows.indexOf(item.task_id) == -1) {
          rows.push(item.task_id);
        }
      });
      this.selectedRows = rows;
    },

    //批量删除
    batDelete() {
      if(this.selectedRows.length !== 0){
        const params = this.selectedRows.toString();
        this.$executeRequest
            .execDelByControllerAllMappingName("/T/taskDev/batch?ids=" + params)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("删除成功");
                this.getData();
              }
            })
            .catch(() => {
              this.$Msg.customizTitle("删除失败", "info");
            });
      }else {
        this.$message({
          message: '批量删除信息不能为空',
          type: 'warning'
        });
      }

    },

    //弹窗确定按钮
    confirm() {
        this.$refs.taskFrom.transferData().then((data) => {//验证表单
          if (this.mode === 0) {
            this.addDatas();
            this.visible = false;
          }else if (this.mode === 1) {
            this.edditDatas();
            this.visible = false;
          } else {
            this.isInput = false;
            this.visible = false;
          }
        }).catch(err =>{

        });
    },
    // 弹窗关闭
    handleClose() {
      this.dialog = false;
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
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      //调用接口
      this.getData();
    },

    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      this.getData();
    },

    //状态变更接口
    statusChange() {
      // const params = {
      //   taskStatus: this.statusValue.value,
      //   id: this.status,
      //   code: "2",
      // };

      this.$confirm("是否提交测试?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$executeRequest
          .execPutByControllerAllMappingName(
            "/T/taskDev/status?id=" + this.status + "&taskStatus=" + "2"
          )
          .then((res) => {
            if (res.message === "Success") {
              this.getData();
              this.$Msg.customizTitle("提交测试成功");
            }
          });
      });
    },
    // 状态变更弹窗确定按钮
    // statuChange() {
    //   this.dialog = false;

    // },
  },
};
</script>

<style lang="less" scoped>
::v-deep .form .el-input {
  width: 300px;
}
::v-deep .el-dialog .el-form-item__label {
  width: 100px;
}
::v-deep .el-dialog .el-dialog__body .el-textarea__inner {
  padding: 0 10px;
  margin: 0 !important;
}

::v-deep .el-dialog .el-dialog__body .el-input__inner {
  padding: 0 10px;
}
::v-deep .el-dialog .el-dialog__body {
  padding: 30px 60px !important;
}
::v-deep .el-dialog__body .el-input--prefix .el-input__inner {
  padding: 0 30px;
}
::v-deep .el-form-item__error {
  margin-left: 0 !important;
}
.datas {
  margin-top: 20px;
}
.select-title {
  padding-right: 5px;
}
</style>
