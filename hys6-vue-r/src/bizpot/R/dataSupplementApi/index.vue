<template>
  <div>
    <ByContainerTitle
      title="API列表"
    >
      <el-button
          type="primary"
          size="small"
          style="margin:10px 0px"
          @click="add">添加接口</el-button>
    </ByContainerTitle>
<!--    <el-form :inline="true">-->
<!--      <el-form-item style="float: right">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          style="margin-top: 20px; float:right"-->
<!--          size="small"-->
<!--          @click="add"-->
<!--          >添加接口</el-button-->
<!--        >-->
<!--      </el-form-item>-->
<!--      <el-form-item> </el-form-item>-->
<!--    </el-form>-->
    <ByTable
      :tableData="tableData"
      :columnArr="columnArr"
      :pagination="pagination"
      @operateItem="operateItem"
      @sizeChange="pageSizeChange"
      @currentChange="pageCurrentChange"
    ></ByTable>
<!--    <el-table :data="tableData" border style="width: 100%">-->
<!--      <el-table-column prop="api_id" v-if="false"></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="dsl_name"-->
<!--        label="数据源名称"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="api_type"-->
<!--        label="类型"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="api_cn_name"-->
<!--        label="接口中文名称"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="api_name"-->
<!--        label="接口名称"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="table_name"-->
<!--        label="表名"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--        width="150px"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="api_ip"-->
<!--        label="接口IP"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="api_port"-->
<!--        label="接口端口"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--        width="100px"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="create_time"-->
<!--        label="创建时间"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      ></el-table-column>-->
<!--      <el-table-column prop="api_remarks" label="接口描述"></el-table-column>-->
<!--      <el-table-column-->
<!--        prop="status"-->
<!--        label="状态"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--        width="70px"-->
<!--      ></el-table-column>-->
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        fixed="right"-->
<!--        width="250"-->
<!--        show-overflow-tooltip-->
<!--        align="center"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="primary"-->
<!--            @click="edit(scope.row)"-->
<!--            v-if="scope.row.status == '有效'"-->
<!--            >编辑</el-button-->
<!--          >-->
<!--          <el-button size="mini" @click="details(scope.$index, scope.row)"-->
<!--            >详情</el-button-->
<!--          >-->
<!--          <el-button size="mini" type="danger" @click="remove(scope.$index)"-->
<!--            v-if="scope.row.status == '有效'">删除</el-button-->
<!--          >-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <div class="block">-->
<!--      <el-pagination-->
<!--        style="text-align: center"-->
<!--        @size-change="pageSizeChange"-->
<!--        @current-change="pageCurrentChange"-->
<!--        :current-page="page.current"-->
<!--        :page-sizes="page.pageSizes"-->
<!--        :page-size="page.pageSize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="page.total"-->
<!--      >-->
<!--      </el-pagination>-->
<!--    </div>-->
    <el-dialog :visible.sync="dialogVisible" title="添加/编辑接口" width="80%">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="选择项目" prop="df_pid" v-if="isAdd">
          <el-select
            v-model="form.df_pid"
            placeholder="请选择"
            style="width: 100%"
            @change="proChange()"
          >
            <el-option
              v-for="item in dfProInfoData"
              :key="item.df_pid"
              :label="item.pro_name"
              :value="item.df_pid"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.pro_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源id" prop="dsl_id" v-if="false">
          <el-input v-model="form.dsl_id"></el-input>
        </el-form-item>
        <el-form-item label="数据源名称" prop="dsl_name" v-if="isAdd">
          <el-input v-model="form.dsl_name"></el-input>
        </el-form-item>
        <el-form-item label="接口中文名称" prop="api_cn_name">
          <el-input v-model="form.api_cn_name"></el-input>
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name" :rules="filter_rules([{required: true,dataType: 'enAndNum'}])">
          <el-input v-model="form.api_name"></el-input>
        </el-form-item>
        <el-form-item label="接口IP" prop="api_ip" :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-input v-model="form.api_ip"></el-input>
        </el-form-item>
        <el-form-item label="接口端口" prop="api_port" :rules="filter_rules([{required: true,dataType:'number'}])">
          <el-input v-model="form.api_port"></el-input>
        </el-form-item>
        <el-form-item label="选择数据表" prop="table_id" v-if="isAdd">
          <el-select
            v-model="form.table_id"
            placeholder="请选择"
            style="width: 100%"
            @change="tableChange()"
          >
            <el-option
              v-for="(item, index) in optionsTableName"
              :key="index"
              :label="item.hyren_name"
              :value="item.table_id"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.hyren_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择字段" prop="dda_col" v-if="isAdd">
          <el-row>
            <el-col :span="24">
              <el-table :data="formColumnTable.data" :row-key="(row) => row.id">
                <el-table-column show-overflow-tooltip align="center" border>
                  <template slot="header">
                    <el-checkbox
                      @change="isUseAllChange"
                      :indeterminate="formColumnTable.isAllUseIndeterminate"
                      v-model="formColumnTable.isAllUse"
                    ></el-checkbox>
                    <span style="margin-left: 5px">是否使用</span>
                  </template>
                  <template slot-scope="{ row }">
                    <el-checkbox
                      v-model="row.isUse"
                      @change="refreshIsAllUse"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center">
                  <template slot="header">
                    <el-checkbox
                      @change="isSelectedAllChange"
                      :indeterminate="formColumnTable.isAllSelectIndeterminate"
                      v-model="formColumnTable.isAllSelect"
                    ></el-checkbox>
                    <span style="margin-left: 5px">是否主键</span>
                  </template>
                  <template slot-scope="{ row }">
                    <el-checkbox
                      v-model="row.isSelected"
                      @change="refreshIsAllSelected"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="dda_col"
                  label="表英文名"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="data_type"
                  label="字段类型"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="column_ch_name"
                  label="表中文名"
                  show-overflow-tooltip
                  align="center"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="api_remarks">
          <el-input v-model="form.api_remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disappear">取 消</el-button>
        <el-button type="primary" @click="save" v-if="isAdd">确 定</el-button>
        <el-button type="primary" @click="update" v-if="isUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailsVisible" width="70%">
      <el-descriptions
        title="API详情页面"
        direction="vertical"
        :column="2"
        border>
        <el-descriptions-item label="项目">{{
          detailsForm.pro_name
        }}</el-descriptions-item>
        <el-descriptions-item label="数据源">
          {{ detailsForm.dsl_name }}</el-descriptions-item
        >
        <el-descriptions-item label="接口中文名">
           {{ detailsForm.api_cn_name }}</el-descriptions-item
        >
        <el-descriptions-item label="接口名称">
           {{ detailsForm.api_name }}</el-descriptions-item
        >
        <el-descriptions-item label="接口IP">
          {{ detailsForm.api_ip }}</el-descriptions-item
        >
        <el-descriptions-item label="接口端口">
           {{ detailsForm.api_port }}</el-descriptions-item
        >
        <el-descriptions-item label="数据表">
          {{ detailsForm.table_name }}  <el-button
            type="primary"
            @click="innerDetailsVisible = true"
            size="small"
          >
            查看字段</el-button
          ></el-descriptions-item
        >
        <el-descriptions-item label="备注">
          {{ detailsForm.api_remarks }}
        </el-descriptions-item>
      </el-descriptions>
         <el-dialog
          width="60%"
          title="表字段"
          :visible.sync="innerDetailsVisible"
          append-to-body
        >
          <div>
            <el-table :data="columnDeatilsData" border style="width: 100%">
              <el-table-column
                prop="is_primarykey"
                label="是否主键"
                :formatter="formatIsPrimaryKey"
              ></el-table-column>
              <el-table-column
                prop="dda_col"
                label="字段名称"
              ></el-table-column>
              <el-table-column
                prop="column_ch_name"
                label="字段中文名"
              ></el-table-column>
              <el-table-column
                prop="data_type"
                label="字段类型"
              ></el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCloseDialog">取 消</el-button>
          </div>
        </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="disappear">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ByTable from "@/components/global/ByTable.vue";
import {
  columnArr
} from './mock'
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";
export default {
  data() {
    return {
      columnArr,
      // 查询参数
      query: {},
      page: {
        current: 1,
        pageSizes: [10, 50, 100, 200],
        pageSize: 10,
        total: 0,
      },
      pagination: {
        current: 1,
        pageSizes: [10, 50, 100, 200],
        pageSize: 10,
        total: 0,
      },
      position: "left",
      innerVisible: false,
      dialogDetailsVisible: false,
      innerDetailsVisible: false,
      dfApiDef: {},
      dfApiDefUpdate: {},
      isAdd: false,
      isUpdate: false,
      selectData: [],
      primaryKeys: [],
      columnDeatilsData: [],
      nonPrimaryKeys: [],
      columnData: [],
      dfApiAttr: [],
      dfApiAttrUpdate: [],
      tableData: [],
      api_type: "API接口",
      optionsDsl: [],
      optionsTableName: [],
      optionsColumn: [],
      dfProInfoData: [],
      dialogVisible: false,
      // 表单中 column 表格相关属性
      formColumnTable: {
        // 数据
        data: [],
        // 是否使用
        isAllUse: false,
        // 是否主键
        isAllSelect: false,
        // 是否使用-半选
        isAllUseIndeterminate: false,
        // 是否主键-半选
        isAllSelectIndeterminate: false,
      },
      apiOptions: [
        {
          value: "T",
          label: "有效",
        },
        {
          value: "F",
          label: "失效",
        },
      ],
      detailsForm: {},
      form: { dda_col: null },
      rules: {
        df_pid: [
          { required: true, message: "请选择项目信息", trigger: "blur" },
        ],
        api_cn_name: [
          { required: true, message: "请输入接口中文名称", trigger: "blur" },
        ],
        api_name: [
          { required: true,dataType: 'number', message: "请输入接口名称", trigger: "blur" },
        ],
        table_name: [
          { required: true, message: "请输入表名", trigger: "blur" },
        ],
        api_ip: [{ required: true, message: "请输入接口IP", trigger: "blur" }],
        api_port: [
          { required: true, message: "请输入接口端口", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getTableData();
  },
  components: {ByContainerTitle, ByHeaderSlice, ByTable},
  computed: {},
  mounted() {
    //获取数据补录项目信息
    this.getDfProInfo();
  },
  methods: {
    operateItem(type,row,index){
      if (type == 'edit'){
          this.edit(row)
      } else if (type == 'details'){
          this.details(index,row)
      } else if (type == 'delete'){
          this.remove(index)
      }
    },
    // 清空表单中列表
    clearFormColumnTable() {
      this.formColumnTable = {
        data: [],
        isAllUse: false,
        isAllSelect: false,
        isAllUseIndeterminate: false,
        isAllSelectIndeterminate: false,
      };
    },
    // 初始化表单中 字段的表格
    initFormColumnTable(data) {
      console.log(data);
      if (data != null) {
        var ddd = data.map(function (t) {
          return {
            column_ch_name: t.column_ch_name,
            data_type: t.data_type,
            dda_col: t.dda_col,
            dda_remarks:t.dda_remarks,
            isSelected: t.is_primarykey == "1",
            isUse: false,
          };
        });
        this.formColumnTable.data = ddd;
      }
      this.refreshIsAllSelected();
    },
    // 修改全选主键
    isSelectedAllChange() {
      this.formColumnTable.isAllSelect = !this.formColumnTable.isAllSelect;
      this.formColumnTable.data = this.formColumnTable.data.map((d) => ({
        column_ch_name: d.column_ch_name,
        data_type: d.data_type,
        dda_col: d.dda_col,
        dda_remarks:d.dda_remarks,
        isSelected: this.formColumnTable.isAllSelect,
        isUse: d.isUse,
      }));
    },
    // 修改全选使用
    isUseAllChange() {
      console.log(this.formColumnTable.isAllUse);
      this.formColumnTable.isAllUse = !this.formColumnTable.isAllUse;
      console.log(this.formColumnTable.isAllUse);
      this.formColumnTable.data = this.formColumnTable.data.map((d) => ({
        column_ch_name: d.column_ch_name,
        data_type: d.data_type,
        dda_col: d.dda_col,
        isSelected: d.isSelected,
         dda_remarks:d.dda_remarks,
        isUse: this.formColumnTable.isAllUse,
      }));
    },
    // 刷新主键全选复选框
    refreshIsAllSelected() {
      var data = this.formColumnTable.data;
      var trueNum = 0;
      var falseNum = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].isSelected == true) {
          trueNum++;
        } else {
          falseNum++;
        }
      }
      if (trueNum == data.length) {
        this.formColumnTable.isAllSelectIndeterminate = false;
        this.formColumnTable.isAllSelect = true;
      } else if (falseNum == data.length) {
        this.formColumnTable.isAllSelectIndeterminate = false;
        this.formColumnTable.isAllSelect = false;
      } else {
        this.formColumnTable.isAllSelectIndeterminate = true;
        this.formColumnTable.isAllSelect = false;
      }
    },
    // 刷新使用全选复选框
    refreshIsAllUse() {
      var data = this.formColumnTable.data;
      var trueNum = 0;
      var falseNum = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].isUse) {
          trueNum++;
        } else {
          falseNum++;
        }
      }
      if (trueNum == data.length) {
        this.formColumnTable.isAllUseIndeterminate = false;
        this.formColumnTable.isAllUse = true;
      } else if (falseNum == data.length) {
        this.formColumnTable.isAllUseIndeterminate = false;
        this.formColumnTable.isAllUse = false;
      } else {
        this.formColumnTable.isAllUseIndeterminate = true;
        this.formColumnTable.isAllUse = false;
      }
    },
    disappear() {
      this.dialogDetailsVisible = false;
      this.dialogVisible = false;
      this.isAdd = false;
      this.isUpdate = false;
      this.clearFormColumnTable();
    },
    formatIsPrimaryKey(row) {
      return row.is_primarykey === "1" ? "是" : "否";
    },
    handleCloseDialog() {
      this.innerVisible = false;
      (this.innerDetailsVisible = false),
        // 清空选中项
        this.clearForm();
    },
    clearForm() {
      this.columnData = [];
      this.selectedNum = 0;
      this.selectData = [];
      this.form = {
        df_pid: null,
        dsl_id: null,
        dsl_name: null,
        api_cn_name: null,
        api_name: null,
        api_ip: null,
        api_port: null,
        table_id: null,
         dda_col: [],
        api_remarks: null
      };
    },
    choose() {
      this.innerVisible = true;
    },
    // 分页大小变更事件
    pageSizeChange(val) {
      this.page.pageSize = val;
      this.page.current = 1;
      this.getTableData();
    },
    // 分页当前页变更事件
    pageCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    // 查询所有api定义列表信息
    getTableData() {
      var page = {
        pageSize: this.page.pageSize,
        currPage: this.page.current,
      };
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/getApiList",page).then(res =>{
        this.tableData = res.data.dfApiList;
        console.log(res.data);
        for (var index in this.tableData) {
          this.tableData[index].api_type = "API接口";
        }
        for (var index in this.tableData) {
          this.tableData[index].create_time = this.$Date.dateToMilldate(
              this.tableData[index].api_create_date +
              this.tableData[index].api_create_time
          );
        }
        console.log(this.tableData);
        for (var index in this.tableData) {
          if (this.tableData[index].api_state == "T") {
            this.tableData[index].status = "有效";
          } else {
            this.tableData[index].status = "失效";
          }
        }
        this.page.total = res.data.totalSize;
        this.pagination.total = res.data.totalSize;
      })
    },
    add() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.form = {
        df_pid: null,
        dsl_id: null,
        dsl_name: null,
        api_cn_name: null,
        api_name: null,
        api_ip: null,
        api_port: null,
        table_id: null,
        dda_col: [],
        api_remarks: null
      };
    },
    edit(row) {
      this.isUpdate = true;
      this.dialogVisible = true;
      this.form = Object.assign({}, row);
      console.log(this.form);
      this.form.apply_tab_id = "";
      this.form.dsl_id = "";
    },
    saveColumn() {
      this.innerVisible = false;
    },
    // 新增Api
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.isAdd = false;
          const { dda_col, ...rest } = this.form;
          this.dfApiDef = rest;
          // form 表单中 列的数据
          var data = this.formColumnTable.data;
          var selectData = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].isUse == true) {
              selectData.push({
                dda_col: data[i].dda_col,
                data_type: data[i].data_type,
                dda_remarks:data[i].dda_remarks,
                column_ch_name: data[i].column_ch_name,
                is_primarykey: data[i].isSelected,
              });
            }
          }
          this.clearFormColumnTable();
          this.$executeRequest.execPostByModuleUrl("/dataSupplementApi/addApi",{
            dfApiDef: this.dfApiDef,
            dfApiAttr: selectData,
          }).then(res =>{
            if (res && res.success) {
              this.$Msg.saveSuccess(res);
              this.$refs.form.resetFields();
              this.dialogFormVisibleAdd = false;
              this.clearFormColumnTable();
              this.getTableData();
            } else {
              if (res && res.data) {
                this.$Msg.customizTitle({
                  message: res.$message,
                  type: "error",
                });
                this.getTableData();
              }
            }
          })
          // functionAll
          //   .saveApi({
          //     dfApiDef: this.dfApiDef,
          //     dfApiAttr: selectData,
          //   })
          //   .then((res) => {
          //     if (res && res.success) {
          //       this.$Msg.saveSuccess(res);
          //       this.$refs.form.resetFields();
          //       this.dialogFormVisibleAdd = false;
          //       this.clearFormColumnTable();
          //       this.getTableData();
          //     } else {
          //       if (res && res.data) {
          //         this.$Msg.customizTitle({
          //           message: res.$message,
          //           type: "error",
          //         });
          //         this.getTableData();
          //       }
          //     }
          //   });
        }
      });
    },
    // 编辑api
    update() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.isUpdate = false;
          const { dda_col, ...rest } = this.form;
          this.dfApiDefUpdate = rest;
          console.log(this.dfApiDefUpdate);
          this.$executeRequest.execPostByModuleUrl("/dataSupplementApi/updateApi",{
            dfApiDefUpdate: this.dfApiDefUpdate
          }).then(res =>{
            if (res && res.success) {
              this.$Msg.updateSuccess(res);
              this.$refs.form.resetFields();
              this.dialogFormVisibleAdd = false;
              this.getTableData();
            }
          })
          // functionAll
          //   .updateApi({
          //     dfApiDefUpdate: this.dfApiDefUpdate,
          //   })
          //   .then((res) => {
          //     if (res && res.success) {
          //       this.$Msg.updateSuccess(res);
          //       this.$refs.form.resetFields();
          //       this.dialogFormVisibleAdd = false;
          //       this.getTableData();
          //     }
          //   });
        }
      });
    },
    // 删除Api
    remove(index) {
      this.$confirm("确定删除吗?")
        .then(async () => {
          this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/deleteApi",{
            apiId: this.tableData[index].api_id
          }).then(res => {
            if (res && res.success) {
              this.$message.success("删除成功");
              this.$refs.form.resetFields();
              this.getTableData();
            }
          })
          // functionAll
          //   .deleteApi({
          //     apiId: this.tableData[index].api_id,
          //   })
          //   .then((res) => {
          //     if (res && res.success) {
          //       this.$message.success("删除成功");
          //       this.$refs.form.resetFields();
          //       this.getTableData();
          //     }
          //   });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    //获取详情
    details(index) {
      this.dialogDetailsVisible = true;
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/getApiDetils",{
        apiId: this.tableData[index].api_id
      }).then(res => {
        if (res && res.success) {
          this.detailsForm = res.data;
          console.log(this.detailsForm);
          this.columnDeatilsData = res.data.dfAttr;
          console.log(this.columnDeatilsData);
        }
      })
    },
    getDfProInfo() {
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/getDfProInfoList").then(res => {
        this.dfProInfoData = res.data;
      })
      // functionAll.getDfProInfo().then((res) => {
      //   this.dfProInfoData = res.data;
      // });
    },
    getDslName() {
      let param = { df_pid: this.form.df_pid };
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/getTableLayerByDfPId",param).then(res =>{
        this.form.dsl_id = res.data.dsl_id;
        this.form.dsl_name = res.data.dsl_name;
        this.getTableName();
      })
      // functionAll.getDslName(param).then((res) => {
      //   this.form.dsl_id = res.data.dsl_id;
      //   this.form.dsl_name = res.data.dsl_name;
      //   this.getTableName();
      // });
    },
    getTableName() {
      let param = { df_pid: this.form.df_pid };
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/getTableApplyList",param).then(res =>{
        this.optionsTableName = res.data;
      })
      // functionAll.getTableName(param).then((res) => {
      //   this.optionsTableName = res.data;
      // });
    },
    proChange() {
      this.optionsDsl = [];
      this.getDslName();
    },
    // dslChange() {
    //   this.optionsTableName = [];
    //   this.getTableName();
    // },
    tableChange() {
      this.optionsColumn = [];
      let param = { table_id: this.form.table_id };
      this.$executeRequest.execGetByPostModuleUrl("/dataSupplementApi/queryDataBasedOnApplyTabId",param).then(res =>{
        console.log(res);
        this.optionsColumn = res.data;
        this.primaryKeys = res.data.filter((item) => item.is_primarykey == "1");
        this.nonPrimaryKeys = res.data.filter(
            (item) => item.is_primarykey != "1"
        );
        this.initFormColumnTable(res.data);
        for (var index in res.data) {
          if (res.data[index].is_primarykey == "1") {
            this.form.dda_col.push(res.data[index].dda_col);
          }
        }
      })
      // functionAll.getTableNameColumn(param).then((res) => {
      //   console.log(res);
      //   this.optionsColumn = res.data;
      //   this.primaryKeys = res.data.filter((item) => item.is_primarykey == "1");
      //   this.nonPrimaryKeys = res.data.filter(
      //     (item) => item.is_primarykey != "1"
      //   );
      //   this.initFormColumnTable(res.data);
      //   for (var index in res.data) {
      //     if (res.data[index].is_primarykey == "1") {
      //       this.form.dda_col.push(res.data[index].dda_col);
      //     }
      //   }
      // });
    },
    columnChange() {
      let columnAll = [];
      this.columnData = [];
      this.columnAll = this.optionsColumn.filter((item) => {
        return this.form.dda_col.includes(item.dda_col);
      });
      this.columnData = this.columnAll.map((item) => ({
        dda_col: item.dda_col,
        data_type: item.data_type,
        column_ch_name: item.column_ch_name,
        is_primarykey: item.is_primarykey,
      }));
    },
  },
};
</script>

<style>
</style>