<template>
  <div>
    <el-row class="topTitle">
      <span>数据来源表</span>
      <el-button type="primary" @click="dialogFormVisibleAdd = true;departmentInfo()" size="small" style="float: right">
        添加数据源
      </el-button>
      <el-button type="primary" @click="dialogFormVisibleImport = true;searchDataCollectUser()" size="small"
                 style="float: right; margin-right: 8px">
        导入数据源
      </el-button>
      <el-button type="success" @click="excelImport()" size="small" style="float: right">
        Excel导入
      </el-button>
      <el-button type="success" @click="downloadExcel()" size="small" style="float: right">
        Excel模板下载
      </el-button>
    </el-row>

    <!-- 实现点击导入按钮进行页面数据导入-->
    <!-- 弹出表单 -->
    <el-dialog title="上传文件" :visible.sync="dialogFormVisibleImport" width="42%" :before-close="beforeClose">
      <el-form :model="formImport" ref="formImport">
        <el-form-item label="Agent IP地址" :label-width="formLabelWidth" prop="agent_ip"
                      :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-col :span="22">
            <el-input v-model="formImport.agent_ip" autocomplete="off" style="width:85%" placeholder=" Ip"></el-input>
          </el-col>
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="要上传的数据源下Agent的IP地址" placement="right">
              <i class="fa fa-question-circle" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item label="Agent 端口" :label-width="formLabelWidth" prop="agent_port"
                      :rules="filter_rules([{required: true,dataType: 'port_verification'}])">
          <el-col :span="22">
            <el-input v-model="formImport.agent_port" autocomplete="off" style="width:85%"
                      placeholder="Port"></el-input>
          </el-col>
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="要上传的数据源下Agent的端口" placement="right">
              <i class="fa fa-question-circle" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item label="数据采集用户" :label-width="formLabelWidth" prop="user_id" :rules="rule.selected">
          <el-select v-model="formImport.user_id" placeholder="请选择" style="width:78%">
            <el-option v-for="item in options" :key="item.dep_id" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传要导入的数据源" :label-width="formLabelWidth">
          <el-upload class="upload-demo" ref="upload" accept=".hrds" :fileList="fileList" action="" :auto-upload="false"
                     :on-change="handleChange">
            <el-button size="small" type="primary">选择上传文件</el-button>
            <el-tooltip class="item" effect="dark" content="在本系统中要上传的数据源，后缀名为hrds的加密文件"
                        placement="right">
              <i class="fa fa-question-circle " aria-hidden="true"></i>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelImport" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="upload('formImport')" size="mini">上传</el-button>
      </div>
    </el-dialog>
    <!-- 弹出表单 -->
    <el-dialog title="上传文件" :visible.sync="dialogFormExcelImport" width="42%" :before-close="beforeClose">
      <el-form :model="formExcelImport" ref="formExcelImport">
        <el-form-item label="上传要导入的数据源" :label-width="formLabelWidth">
          <el-upload class="upload-demo" ref="upload" :excelFileList="excelFileList" action="" :auto-upload="false"
                     :on-change="excelHandleChange">
            <el-button size="small" type="primary">选择上传文件</el-button>
            <el-tooltip class="item" effect="dark" content="上传在Excel中配置好的采集信息" placement="right">
              <i class="fa fa-question-circle " aria-hidden="true"></i>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelExcel" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="excelUpload(false)" size="mini">上传</el-button>
      </div>
    </el-dialog>

    <!-- 实现点击添加按钮进行页面数添加-->
    <!-- 添加的弹出表单 -->
    <el-dialog title="添加数据源" :visible.sync="dialogFormVisibleAdd" width="40%" :before-close="beforeClose">
      <el-form :model="formAdd" ref="formAdd">
        <el-form-item label=" 数据源编号" :label-width="formLabelWidth" prop="datasource_number"
                      :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])">
          <el-input v-model="formAdd.datasource_number" autocomplete="off" placeholder="数据源编号"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 数据源名称" :label-width="formLabelWidth" prop="datasource_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formAdd.datasource_name" autocomplete="off" placeholder="数据源名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 所属部门" :label-width="formLabelWidth" prop="depIds" :rules="rule.selected ">
          <el-select v-model="formAdd.depIds" filterable placeholder="请选择（可多选）" multiple style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.dep_name"
                       :value="item.dep_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 数据源详细描述" :label-width="formLabelWidth" prop="source_remark">
          <el-input type="textarea" v-model="formAdd.source_remark" autocomplete="off" placeholder="数据源详细描述"
                    style="width:284px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="add('formAdd')" size="mini">保存</el-button>
      </div>
    </el-dialog>
    <template v-if="dialogFormAudit">
      <audit :dialogFormAudit="dialogFormAudit" :excelAuditData="excelAuditData"/>
    </template>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import audit from "@/components/audit/index";

export default {
  components: {
    audit
  },
  data() {
    return {
      options: [],
      fileList: [],
      dialogFormVisibleImport: false,
      dialogFormVisibleAdd: false,
      dialogFormAudit: false,
      rule: validator.default,
      // 添加数据与导入源字段
      formAdd: {
        datasource_number: "",
        datasource_name: "",
        source_remark: "",
        depIds: [],
      },
      formImport: {
        agent_ip: "",
        agent_port: "",
        user_id: ""
      },
      formExcelImport: {},
      dialogFormExcelImport: false,
      importFileUrl: "",
      formLabelWidth: "150px",
      excelFileList: [],
      excelAuditData: {}
    };
  },
  methods: {
    // 点击添加按钮获取部门信息
    departmentInfo() {
      this.$executeRequest.execByControllerMappingName("/searchDepartmentInfo").then(res => {
        if (res && res.success) {
          this.options = res.data;
        }
      });
    },
    // 添加数据来源表一条数据
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用添加方法
          let params = {};
          params['dataSource'] = this.formAdd;
          params["depIds"] = this.formAdd.depIds;
          this.$executeRequest.execPostByControllerMappingName("/saveDataSource", params).then(response => {
            if (response && response.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormVisibleAdd = false;
              // 表单清空
              this.formAdd = {};
            } else {

            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击导入按钮获取数据采集信息
    searchDataCollectUser() {
      this.$executeRequest.execByControllerMappingName("/searchDataCollectUser").then(res => {
        if (res && res.success) {
          this.options = res.data;
        }
      });
    },
    excelImport() {
      this.dialogFormExcelImport = true
      this.excelAuditData = {}
      this.dialogFormAudit = false
    },
    // 获取上传的文件详情excelHandleChange
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    // 获取Excel上传的文件详情
    excelHandleChange(file, excelFileList) {
      if (excelFileList.length > 0) {
        this.excelFileList = [excelFileList[excelFileList.length - 1]]
      }
    },
    // 点击上传数据
    upload(formName) {
      if (this.fileList === 0) {
        this.$Msg.customizTitle("请上传文件", 'warning')
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = new FormData() // 创建form对象
          param.append('file', this.fileList[0].raw);
          param.append('agent_ip', this.formImport.agent_ip);
          param.append('agent_port', this.formImport.agent_port);
          param.append('user_id', this.formImport.user_id);
          this.$executeRequest.execUploadFileByMenuUrl("/uploadFile", param).then(res => {
            this.$emit("addEvent");
            this.dialogFormVisibleImport = false;
            this.formImport = {};
          });
        }
      })
    },
    // Excel点击上传数据
    excelUpload(upload) {
      if (this.excelFileList === 0) {
        this.$Msg.customizTitle("请上传文件", 'warning')
        return;
      }
      this.dialogFormAudit = false
      this.$refs['formExcelImport'].validate(valid => {
        if (valid) {
          let param = new FormData() // 创建form对象
          param.append('file', this.excelFileList[0].raw);
          param.append('upload', upload);
          this.$executeRequest.execUploadFileByMenuUrl("/importExcel/importDatabaseByExcel", param).then(res => {
            if (res && res.success) {
              this.excelAuditData = res.data
              this.dialogFormAudit = !upload
              this.$emit("addEvent");
              this.dialogFormExcelImport = false;
              this.formExcelImport = {};
            }
          });
        }
      })
    },
    // 点击导入弹出框的取消按钮
    cancelImport() {
      this.formImport = {};
      this.dialogFormVisibleImport = false;
      this.$refs.formImport.resetFields();
    },
    // 点击添加弹出框的取消按钮
    cancelAdd() {
      // 表单清空
      this.formAdd = {};
      // 隐藏对话框
      this.dialogFormVisibleAdd = false;
      this.$refs.formAdd.resetFields();
    },
    // 关闭弹框之前
    beforeClose() {
      this.formAdd = {};
      this.dialogFormVisibleAdd = false;
      this.formImport = {};
      this.dialogFormVisibleImport = false;
      this.$refs.formAdd.resetFields();
    },
    //取消Excel上传
    cancelExcel() {
      this.dialogFormAudit = false
      this.dialogFormExcelImport = false
    },
    //下载Excel模板
    downloadExcel() {
      this.$executeRequest.execDownloadFileByMenuUrl("/importExcel/downloadExcel").then(res => {
        let filename = "importExcel.xlsx";
        this.$FileOperations.fileDownload(res,filename)
      })
    }
  },
};
</script>

<style scoped>

.el-row span {
  color: #2196f3;
  font-size: 18px;
}

.fa-question-circle {
  margin-left: 40px;
  margin-right: 25px;
}

.item {
  float: right;
}

.upload-demo {
  float: left;
}

.fa-question-circle {
  margin-top: 12px;
}

</style>
