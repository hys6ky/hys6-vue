<template>
  <div class="agentList">
    <!-- 数据来源标题 -->
    <el-row class="agentListrow">
      <span>数据源Agent列表</span>
<!--      <router-link :to="{name:'realtimeCollectManagement'}">-->
<!--        <el-button type="primary" size="small" class="goIndex">-->
<!--          <i class="el-icon-s-home" style="font-size: 14px"></i>返回首页-->
<!--        </el-button>-->
<!--      </router-link>-->
    </el-row>
    <div class="lines"></div>
    <el-row class="tableCenter">
      <div class="listContent">
        <div class="listPic" @click="tapDifferentType(1)">
          <img src="@/assets/images/datasource.png" alt="数据图片"/>
        </div>
        <h3>文件内容流Agent</h3>
        <p>
          文件内容流Agent是用于采集各种类型的文件数据的组件，它可以实时的读取文件夹下的内容，对文件进行解析让文件数据发送到流服务主机，它支持固定分隔符、JSON等储存在文件系统之上的数据文件。</p>
      </div>

      <div class="listContent">
        <div class="listPic" @click="tapDifferentType(2)">
          <img src="@/assets/images/a1.png" alt="数据图片"/>
        </div>
        <h3>数据消息流Agent</h3>
        <p>数据消息流Agent是用于接收通过http协议过来的消息流数据的组件，它提供了rest服务，实时接收数据到流服务主机。</p>
      </div>
    </el-row>
    <h4>
      当前所属数据源为：
      <strong>{{ this.sdm_source_name }}</strong>
    </h4>

    <!-- 数据表格标题 -->
    <div class="tableList">
      <el-row>
        <span v-if="fileAgent">文件内容流Agent</span>
        <span v-if="restAgent">数据消息流Agent</span>
        <!-- 添加数据表单弹出框  -->
        <el-button type="success" class="addAgent" size="small" v-if="restAgent"
                   @click="dialogFormVisible = true;searchUser()">新增数据消息流Agentt
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="fileAgent"
                   @click="dialogFormVisible = true;searchUser()">新增文件内容流Agent
        </el-button>
      </el-row>
      <!-- 表格内容 -->
      <el-table stripe :data="tableData" border>
        <el-table-column prop="sdm_agent_name" label="Agent名称" align="center"></el-table-column>
        <el-table-column prop="sdm_agent_ip" label="Agent所在服务器IP" align="center"></el-table-column>
        <el-table-column prop="sdm_agent_port" label="Agent 连接端口" align="center"></el-table-column>
        <el-table-column prop="user_name" label="流数据操作用户" align="center"></el-table-column>
        <el-table-column label="操作" width="190" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="dialogFormVisibleUpdate = true;handleEdit(scope.$index, scope.row);searchUser();">编辑
            </el-button>
            <el-button size="mini" type="danger"
                       @click="deleteSdmAgent();handleEdit(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 点击新增agent按钮弹出框 -->
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" width="40%" :before-close="beforeClose">
      <el-form :model="formAdd" ref="formAdd">
        <el-form-item label=" Agent名称" :label-width="formLabelWidth" prop="sdm_agent_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formAdd.sdm_agent_name" autocomplete="off" placeholder="Agent名称"
                    style="width:284px">
          </el-input>
        </el-form-item>
        <el-form-item label=" Agent所在服务器ip" :label-width="formLabelWidth" prop="sdm_agent_ip"
                      :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-input v-model="formAdd.sdm_agent_ip" autocomplete="off" placeholder="例如 127.9.08.7"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" Agent 连接端口" :label-width="formLabelWidth" prop="sdm_agent_port"
                      :rules="filter_rules([{required: true,dataType: 'port_verification'}])">
          <el-input v-model="formAdd.sdm_agent_port" autocomplete="off" placeholder="端口范围1204-65535"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 流数据操作用户" :label-width="formLabelWidth" prop="user_id">
          <el-select v-model="formAdd.user_id" filterable placeholder="请选择" style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd('1')" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="saveSdmAgentInfo('formAdd')" size="mini">保存</el-button>
      </div>
    </el-dialog>
    <!-- 点击编辑按钮编辑信息弹出框 -->
    <el-dialog title="编辑Agent" :visible.sync="dialogFormVisibleUpdate" width="40%" :before-close="beforeCloseview">
      <el-form :model="form" ref="form">
        <el-form-item label=" Agent名称" :label-width="formLabelWidth" prop="sdm_agent_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="form.sdm_agent_name" :disabled="disabled" autocomplete="off" style="width:284px">
          </el-input>
        </el-form-item>
        <el-form-item label=" Agent所在服务器ip" :label-width="formLabelWidth" prop="sdm_agent_ip"
                      :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-input v-model="form.sdm_agent_ip" :disabled="disabled" autocomplete="off" style="width:284px">
          </el-input>
        </el-form-item>
        <el-form-item label=" Agent 连接端口" :label-width="formLabelWidth" prop="sdm_agent_port"
                      :rules="filter_rules([{required: true,dataType: 'port_verification'}])">
          <el-input v-model="form.sdm_agent_port" :disabled="disabled" autocomplete="off" style="width:284px">
          </el-input>
        </el-form-item>
        <el-form-item label=" 流数据操作用户" :label-width="formLabelWidth" prop="user_id" :rules="rule.selected">
          <el-select v-model="form.user_id" filterable placeholder="请选择" style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd('2')" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="updateSdmAgent('form')" :disabled="disabled" size="mini">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as validator from "@/utils/validator";

let agentTupe;
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisibleUpdate: false,
      tableData: [],
      options: [],
      sdm_source_id: "",
      sdm_agent_id: "",
      sdm_agent_type: "",
      dataAll: {},
      sdm_source_name: "",
      dialogName: "",
      fileAgent: true,
      restAgent: false,
      disabled: false,
      formAdd: {
        agent_name: "",
        agent_ip: "",
        agent_port: "",
        user_id: ""
      },
      form: {
        agent_name: "",
        agent_ip: "",
        agent_port: "",
        user_id: ""
      },
      rule: validator.default,
      formLabelWidth: "150px",
      result: []
    };
  },
  created() {
    this.searchSdmDatasourceAndSdmAgentInfo();
  },
  methods: {
    // 获取用户信息
    searchUser() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/usermanage/searchUser', {}).then(res => {
        this.options = res.data;
        console.info(res.data);
      })
    },
    // 获取页面初始值
    searchSdmDatasourceAndSdmAgentInfo() {
      // 发送请求获取数据
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/agent/searchSdmDatasourceAndSdmAgentInfo', {
        sdm_source_id: this.$route.query.sdm_source_id
      }).then(res => {
        this.sdm_source_name = res.data.sdm_source_name
        this.tableData = res.data.fileSystemAgent;
        this.showViewOrHandles(this.result, this.tableData);
        this.dialogName = "添加文件内容流Agent";
        this.sdm_agent_type = 1;
        agentTupe = 1;
        this.dataAll = res.data;
      });
    },
    // 新增Agent
    saveSdmAgentInfo(formName) {
      // 调用添加方法
      this.formAdd["sdm_source_id"] = this.$route.query.sdm_source_id;
      this.formAdd["sdm_agent_type"] = this.sdm_agent_type;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/agent/saveSdmAgentInfo', this.formAdd).then(response => {
            if (response && response.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              // 隐藏对话框
              this.dialogFormVisible = false;
              this.$refs.formAdd.resetFields();
              this.searchSdmDatasourceAndSdmAgentInfo();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除agent信息
    deleteSdmAgent() {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/agent/deleteSdmAgent', {
          sdm_agent_id: this.sdm_agent_id,
          sdm_agent_type: agentTupe,
          sdm_source_id: this.$route.query.sdm_source_id
        }).then(res => {
          if (res && res.success) {
            this.$Msg.customizTitle('删除成功', 'success');
            this.searchSdmDatasourceAndSdmAgentInfo();
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 点击编辑的保存按钮更新数据
    updateSdmAgent(formName) {
      this.form["sdm_source_id"] = this.$route.query.sdm_source_id;
      this.form["sdm_agent_type"] = this.sdm_agent_type;
      this.form["sdm_agent_id"] = this.sdm_agent_id;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/agent/updateSdmAgent', this.form).then(response => {
            if (response && response.success) {
              this.$Msg.customizTitle('更新成功', 'success')
              // 隐藏对话框
              this.dialogFormVisibleUpdate = false;
              this.searchSdmDatasourceAndSdmAgentInfo();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击编辑获取当前数据赋给表单
    handleEdit(index, row) {
      this.form = Object.assign({}, row);
      this.sdm_agent_id = row.sdm_agent_id;
      this.sdm_agent_type = agentTupe;
      this.sdm_source_id = row.sdm_source_id;
    },
    // 点击不同的数据类型获取不同的数据
    tapDifferentType(e) {
      switch (e) {
        case 1:
          this.dialogName = "添加文件内容流Agent";
          agentTupe = e;
          this.sdm_agent_type = e;
          this.tableData = this.dataAll.fileSystemAgent;
          this.showViewOrHandles(this.result, this.tableData);
          this.fileAgent = true;
          this.restAgent = false;
          break;
        case 2:
          this.dialogName = "添加数据消息流Agent";
          agentTupe = e;
          this.sdm_agent_type = e;
          this.tableData = this.dataAll.restAgentList;
          this.showViewOrHandles(this.result, this.tableData);
          this.fileAgent = false;
          this.restAgent = true;
          break;
      }
    },
    showViewOrHandles(result, tableData) {
      result.forEach(item => {
        let name;
        tableData.forEach(val => {
          if (item.code == val.sdm_agent_status) {
            name = item.value;
            val.sdm_agent_status = item.value;
            if (name == "已连接") {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
          }
        })
      })
    },
    // 点击取消按钮
    cancleAdd(val) {
      if (val == "1") {
        // 隐藏对话框
        this.dialogFormVisible = false;
        // 表单清空
        this.$refs.formAdd.resetFields();
      } else if (val == "2") {
        this.dialogFormVisibleUpdate = false;
        this.$refs.form.resetFields();
      }
    },
    // 关闭弹出框之前触发事件
    beforeCloseview() {
      this.dialogFormVisibleUpdate = false;
      this.$refs.form.resetFields();
    },
    beforeClose() {
      this.dialogFormVisible = false;
      this.$refs.formAdd.resetFields();
    },
  },
};
</script>
<style scoped>
.agentList {
  margin-left: 8px;
  width: 100%;
}

/* 图标字体设置 */
.el-row {
  width: 100%;
  height: 64px;
  line-height: 64px;
}

.agentListrow {
  width: 100%;
  height: 40px;
  line-height: 40px;
}

.el-row span {
  color: #2196f3;
  font-size: 18px;
}

/* 字体小图标样式设置 */
.fa-desktop {
  color: #2196f3;
  margin-right: 5px;
}

.fa-database {
  color: #2196f3;
  margin-right: 5px;
}

.fa-home {
  margin-right: 5px;
}

/* button样式设置 */
.goIndex {
  float: right;
  margin-top: 3px;
  margin-right: 14px;
}

.addAgent {
  background: #5cb85c;
  float: right;
  margin-top: 18px;
  margin-right: 14px;
}

/* 下划线样式 */
.lines {
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
  margin-top: 8px;
}

/* 列表内容 */
.listContent {
  width: 25%;
  padding: 10px 10px 0 10px;
  border: 1px solid #cccccc;
  height: 310px;
  overflow: auto;
  //margin-bottom: 20px;
  //margin-right: 2%;
  float: left;
  border-radius: 4px;
}

.listContentlast {
  margin-right: 0%;
}

.listPic {
  width: 50%;
  border: 1px solid #cccccc;
  height: 50%;
  margin: 0 auto;
  //margin-left: 18%;
  //padding: 1px 5px;
  //margin-bottom: 22px;
}

.listPic:hover {
  cursor: pointer;
  background: #e6e6e6;
}

.listPic img {
  width: 100%;
  height: 100%;
}

.listContent h3 {
  text-align: center;
  font-size: 19px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}

.listContent p {
  font-size: 13px;
  line-height: 17px;
}

/* 数据类型标题 */
h4 {
  height: 39px;
  line-height: 39px;
  clear: left;
  font-size: 18px;
  font-weight: normal;
}

h4 strong {
  font-size: 18px;
  color: red;
}

/* 表格数据 */
.tableList {
  width: 98%;
  min-height: 132px;
  border: 1px solid #cccccc;
  padding: 0 1%;
}

.tableCenter {
  display: flex;
  border: 1px solid #e6e6e6;
  height: 380px;
  justify-content: space-between;
  /*垂直居中*/
  align-items: center;
  /*水平居中*/
}
</style>