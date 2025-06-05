<template>
  <div>
    <!-- 数据来源标题 -->
    <el-row class="topTitle">
      <span>数据源Agent列表</span>
      <router-link :to="{name: 'dataCollectionM'}">
        <el-button type="primary" size="small" class="goIndex">
          <i class="fa fa-home fa-lg"></i>返回首页
        </el-button>
      </router-link>
    </el-row>
<!--    <div class="lines"></div>-->
    <!-- 列表内容 -->
    <el-row>
      <div class="boxAgent">
        <div class="listContent">
          <div class="listPic" @click="tapDifferentType(1)">
            <img src="../../../../assets/images/anaylize_sql.png" alt="数据图片"/>
          </div>
          <h3>数据库 Agent</h3>
          <p>数据库 Agent 是用于采集结构化数据（RDBMS Etc）的Agent，只需要一个Agent就可以采集同一数据源中的不同源数据</p>
        </div>

        <div class="listContent">
          <div class="listPic" @click="tapDifferentType(4)">
            <img src="../../../../assets/images/a1.png" alt="数据图片"/>
          </div>
          <h3>数据库文件 Agent</h3>
          <p>数据文件 Agent
            是用于对各种关系型存储的数据文件进行数据采集的组件，例如从RDBMS数据库中卸载的CSV或各种自定义格式的数据文件，以EXCEL存储的行列关系的数据文件</p>
        </div>

        <div class="listContent">
          <div class="listPic" @click="tapDifferentType(5)">
            <img src="../../../../assets/images/object.png" alt="数据图片"/>
          </div>
          <h3>半结构化 Agent</h3>
          <p>半结构化 Agent 是用于采集各种半结构化数据的组件，例如XML、JSON等储存在文件系统之上的数据文件。</p>
        </div>

        <div class="listContent">
          <div class="listPic" @click="tapDifferentType(2)">
            <img src="../../../../assets/images/filesource.png" alt="数据图片"/>
          </div>
          <h3>非结构化 Agent</h3>
          <p>非结构化 Agent
            是用于采集各种半结构化或非结构化数据的组件，例如Word、PDF、图片文件等存储在文件系统之上的数据文件。</p>
        </div>

        <div class="listContent listContentlast">
          <div class="listPic" @click="tapDifferentType(3)">
            <img src="../../../../assets/images/ftp.png" alt="数据图片"/>
          </div>
          <h3>FTP Agent</h3>
          <p>FTP Agent 是用于将系统之上的数据文件使用SFTP的方式将数据拉取到指定的系统盘之上的组件，多用于数据分发等。</p>
        </div>

        <div class="listContent">
          <div class="listPic" @click="tapDifferentType(6)">
            <img src="../../../../assets/images/datasource.png" alt="数据图片"/>
          </div>
          <h3>文本流 Agent</h3>
          <p>文件内容流Agent是用于采集各种类型的文件数据的组件，它可以实时的读取文件夹下的内容，对文件进行解析让文件数据发送到流服务主机，它支持固定分隔符、JSON等储存在文件系统之上的数据文件。</p>
        </div>

        <div class="listContent listContentlast">
          <div class="listPic" @click="tapDifferentType(7)">
            <img src="../../../../assets/images/a1.png" alt="数据图片"/>
          </div>
          <h3>消息流 Agent</h3>
          <p>数据消息流Agent是用于接收通过http协议过来的消息流数据的组件，它提供了rest服务，实时接收数据到流服务主机</p>
        </div>
      </div>
    </el-row>

    <!-- 数据类型标题 -->
    <h4>
      当前所属数据源为：
      <strong>{{ this.datasource_name }}</strong>
    </h4>
    <!-- 数据表格标题 -->
    <div class="tableList">
      <el-row style="line-height: 58px;padding: 0 10px">
        <!-- <i class="fa text-warning fa-database blue"></i> -->
        <span v-if="sourceAgent">数据源Agent</span>
        <span v-if="dataFile">数据文件 Agent</span>
        <span v-if="semiStructure">半结构化 Agent</span>
        <span v-if="nonStructural">非结构化 Agent</span>
        <span v-if="ftpAgent">FTP Agent</span>
        <span v-if="wenbenliu">文本流 Agent</span>
        <span v-if="xiaoxiliu">消息流 Agent</span>
        <!-- 添加数据表单弹出框  -->
        <el-button type="success" class="addAgent" size="small" v-if="sourceAgent"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增数据库Agent
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="dataFile"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增数据库文件Agent
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="semiStructure"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增半结构化 Agent
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="nonStructural"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增非结构化 Agent
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="ftpAgent"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增FTP Agent采集数据
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="wenbenliu"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增文本流 Agent采集数据
        </el-button>
        <el-button type="success" class="addAgent" size="small" v-if="xiaoxiliu"
                   @click="dialogFormVisible = true;dataCollectInfo()" style="margin-bottom: 8px">新增消息流 Agent采集数据
        </el-button>
      </el-row>
      <!-- 表格内容 -->
      <el-table stripe :data="tableData" border>
        <el-table-column prop="agent_name" label="Agent名称" align="center"></el-table-column>
        <el-table-column prop="agent_ip" label="Agent所在服务器IP" align="center"></el-table-column>
        <el-table-column prop="agent_port" label="Agent 连接端口" align="center"></el-table-column>
        <el-table-column prop="user_name" label="数据采集用户" align="center"></el-table-column>
        <el-table-column label="操作" width="190" align="center">
          <template v-slot="scope">
            <el-button size="mini" v-if="scope.row.agent_status ==='已连接'" type="success"
                       @click="dialogFormVisibleView = true;handleEdit(scope.$index, scope.row);dataCollectInfo()">查看
            </el-button>
            <el-button size="mini" v-else type="primary"
                       @click="dialogFormVisibleView = true;handleEdit(scope.$index, scope.row);dataCollectInfo()">编辑
            </el-button>
            <el-button size="mini" type="danger" @click="deleteThisData();handleEdit(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="lines"></div>
    </div>
    <!-- 点击新增数据库按钮弹出框 -->
    <el-dialog :title="dialogName" :visible.sync="dialogFormVisible" width="30%" :before-close="beforeClose">
      <el-form :model="formAdd" ref="formAdd">
        <el-form-item label=" Agent名称" :label-width="formLabelWidth" prop="agent_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formAdd.agent_name" autocomplete="off" placeholder="Agent名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" Agent所在服务器ip" :label-width="formLabelWidth" prop="agent_ip"
                      :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-input v-model="formAdd.agent_ip" autocomplete="off" placeholder="例如 127.9.08.7"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" Agent 连接端口" :label-width="formLabelWidth" prop="agent_port"
                      :rules="filter_rules([{required: true,dataType: 'port_verification'}])">
          <el-input v-model="formAdd.agent_port" autocomplete="off" placeholder="端口范围1204-65535"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 数据采集用户" :label-width="formLabelWidth" prop="user_id" :rules="rule.selected">
          <el-select v-model="formAdd.user_id" filterable placeholder="请选择" style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('0')" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="add('formAdd')" size="mini">保存</el-button>
      </div>
    </el-dialog>
    <!-- 点击编辑按钮编辑信息弹出框 -->
    <el-dialog title="编辑 Agent" :visible.sync="dialogFormVisibleView" width="30%" :before-close="beforeCloseView">
      <el-form :model="form" ref="form">
        <el-form-item label=" Agent名称" :label-width="formLabelWidth" prop="agent_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="form.agent_name" :disabled="disabled" autocomplete="off" style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" Agent所在服务器ip" :label-width="formLabelWidth" prop="agent_ip"
                      :rules="filter_rules([{required: true,dataType: 'ip_verification'}])">
          <el-input v-model="form.agent_ip" :disabled="disabled" autocomplete="off" style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" Agent 连接端口" :label-width="formLabelWidth" prop="agent_port"
                      :rules="filter_rules([{required: true,dataType: 'port_verification'}])">
          <el-input v-model="form.agent_port" :disabled="disabled" autocomplete="off" style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 数据采集用户" :label-width="formLabelWidth" prop="user_id" :rules="rule.selected">
          <el-select v-model="form.user_id" :disabled="disabled" filterable placeholder="请选择" style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.user_name"
                       :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('1')" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="updateAgent('form')" :disabled="disabled" size="mini">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

let agentType;
export default {
  props:{
    id:{
      type: String,
      required: true,
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisibleView: false,
      options: [],
      tableData: [],
      getAgentData: {},
      source_id: "",
      agentId: "",
      agent_type: "1",
      dataAll: {},
      datasource_name: "",
      dialogName: "",
      sourceAgent: true,
      dataFile: false,
      semiStructure: false,
      nonStructural: false,
      ftpAgent: false,
      disabled: false,
      wenbenliu: false,
      xiaoxiliu: false,
      formAdd: {
        agent_name: "",
        agent_ip: "",
        agent_port: "",
        user_id: [],
      },
      form: {
        agent_name: "",
        agent_ip: "",
        agent_port: "",
        user_id: [],
      },
      rule: validator.default,
      formLabelWidth: "150px",
      result: []
    };
  },
  mounted() {
    this.id = this.$route.query.source_id;
    this.getAgentStatusItems();
    this.searchDatasourceAndAgentInfos();
  },
  methods: {
    // 获取页面初始值
    searchDatasourceAndAgentInfos() {
      // 发送请求获取数据
      let params = {source_id: this.id};
      this.$executeRequest.execGetByModuleUrl("/dataCollectionM/agentInfo/searchDatasourceAndAgentInfo", params).then(res => {
        if (res && res.success) {
          // 传参
          this.datasource_name = res.data.datasource_name
          // 默认展示数据库agent
          if (res.data.agentInfoList && res.data.agentInfoList !== '' && Object.keys(res.data.agentInfoList).length !== 0) {
            this.tableData = res.data.agentInfoList[1];
            this.showViewOrHandles(this.result, this.tableData);
            this.dialogName = "添加数据库 Agent";
            this.agent_type = 1;
            agentType = 1;
          }
          this.dataAll = res.data;
        }
      });
    },
    // 获取代码项信息
    getAgentStatusItems() {
      this.$Code.getCategoryItems({
        category: 'AgentStatus'
      }).then(res => {
        this.result = res.data;
      })
    },
    // 获取agent数据内容方法
    getAgentAllData(e) {
      // 发送请求获取数据
      let params = {
        source_id: this.id,
        datasource_name: this.$route.query.datasource_name
      };
      this.$executeRequest.execGetByModuleUrl("/dataCollectionM/agentInfo/searchDatasourceAndAgentInfo", params).then(res => {
        if (res && res.success) {
          // 传参
          this.dataAll = res.data;
          if (res.data.agentInfoList && res.data.agentInfoList !== '' && Object.keys(res.data.agentInfoList).length !== 0) {
            this.tableData = this.dataAll.agentInfoList[e];
            this.showViewOrHandles(this.result, this.tableData);
          }
        }
      });
    },
    // 点击查看获取数据采集信息
    dataCollectInfo() {
      this.$executeRequest.execPostByModuleUrl("/dataCollectionM/searchDataCollectUser").then(res => {
        if (res && res.success) {
          this.options = res.data;
        }
      });
    },
    // 点击编辑获取当前数据赋给表单
    handleEdit(index, row) {
      this.form = Object.assign({}, row);
      this.agentId = row.agent_id;
      this.agent_type = agentType;
      this.source_id = row.source_id;
    },
    // 新增数据库Agent
    add(formName) {
      // 调用添加方法
      this.formAdd["source_id"] = this.id;
      this.formAdd["agent_type"] = this.agent_type;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execGetByModuleUrl("/dataCollectionM/agentInfo/saveAgent", this.formAdd).then(response => {
            if (response && response.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              // 隐藏对话框
              this.dialogFormVisible = false;
              this.getAgentAllData(this.agent_type);
              this.$refs.formAdd.resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击取消按钮
    cancelAdd(val) {
      if (val === "0") {
        // 隐藏对话框
        this.dialogFormVisible = false;
        // 表单清空
        this.$refs.formAdd.resetFields();
      } else if (val === "1") {
        this.dialogFormVisibleView = false;
        this.$refs.form.resetFields();
      }
    },
    // 关闭弹出框之前触发事件
    beforeCloseView() {
      this.dialogFormVisibleView = false;
      this.$refs.form.resetFields();
    },
    beforeClose() {
      this.dialogFormVisible = false;
      this.$refs.formAdd.resetFields();
    },
    showViewOrHandles(result, tableData) {
      result.forEach(item => {
        let name;
        if (tableData && tableData.length.length > 0) {
          tableData.forEach(val => {
            if (item.code === val.agent_status) {
              name = item.value;
              val.agent_status = item.value;
              this.disabled = name === "已连接";
            }
          })
        }
      })
    },
    // 点击不同的数据类型获取不同的数据
    tapDifferentType(e) {
      this.tableData = this.dataAll.agentInfoList[e];
      this.dataCollectInfo();
      switch (e) {
        case 1:
          this.agent_type = e;
          agentType = e;
          // 给tableData渲染对应的数组，先看上面能不能拿到；
          this.dialogName = "添加数据库 Agent";
          this.showViewOrHandles(this.result, this.tableData);
          this.sourceAgent = true;
          this.nonStructural = false;
          this.ftpAgent = false;
          this.dataFile = false;
          this.semiStructure = false;
          this.wenbenliu = false;
          this.xiaoxiliu = false;
          break;
        case 2:
          this.dialogName = "添加非结构化 Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.nonStructural = true;
          this.ftpAgent = false;
          this.dataFile = false;
          this.semiStructure = false;
          this.sourceAgent = false;
          this.wenbenliu = false;
          this.xiaoxiliu = false;
          break;
        case 3:
          this.dialogName = "添加ftp Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.ftpAgent = true;
          this.dataFile = false;
          this.semiStructure = false;
          this.sourceAgent = false;
          this.nonStructural = false;
          this.wenbenliu = false;
          this.xiaoxiliu = false;
          break;
        case 4:
          this.dialogName = "添加数据库文件 Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.dataFile = true;
          this.semiStructure = false;
          this.sourceAgent = false;
          this.nonStructural = false;
          this.ftpAgent = false;
          this.wenbenliu = false;
          this.xiaoxiliu = false;
          break;
        case 5:
          this.dialogName = "添加半结构化 Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.semiStructure = true;
          this.sourceAgent = false;
          this.nonStructural = false;
          this.ftpAgent = false;
          this.dataFile = false;
          this.wenbenliu = false;
          this.xiaoxiliu = false;
          break;
        case 6:
          this.dialogName = "文本流 Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.semiStructure = false;
          this.sourceAgent = false;
          this.nonStructural = false;
          this.ftpAgent = false;
          this.dataFile = false;
          this.wenbenliu = true;
          this.xiaoxiliu = false;
          break;
        case 7:
          this.dialogName = "消息流 Agent";
          agentType = e;
          this.agent_type = e;
          this.showViewOrHandles(this.result, this.tableData);
          this.semiStructure = false;
          this.sourceAgent = false;
          this.nonStructural = false;
          this.ftpAgent = false;
          this.dataFile = false;
          this.wenbenliu = false;
          this.xiaoxiliu = true;
          break;
      }

    },
    // 点击编辑的保存按钮更新数据
    updateAgent(formName) {
      this.form["source_id"] = this.id;
      this.form["agent_id"] = this.agentId;
      this.form["agent_type"] = agentType;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execGetByModuleUrl("/dataCollectionM/agentInfo/updateAgent", this.form).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle("更新成功", 'success')
              // 重新渲染页面
              this.getAgentAllData(agentType);
              // 隐藏对话框
              this.dialogFormVisibleView = false;

            }
          });
        } else {
          return false;
        }
      });

    },
    // 点击删除数据
    deleteThisData() {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {
          agent_id: this.agentId,
          agent_type: agentType,
          source_id: this.id
        };
        this.$executeRequest.execGetByModuleUrl("/dataCollectionM/agentInfo/deleteAgent", params).then(res => {
          if (res && res.success) {
            this.$Msg.customizTitle('删除成功', 'success')
            // 表单清空
            this.form = {
              agent_name: "",
              agent_ip: "",
              agent_port: "",
            }
            // 重新渲染页面
            this.getAgentAllData(agentType);
          }
        })
      })
    }
  }
};
</script>

<style scoped>

.el-row span {
  color: #2196f3;
  font-size: 18px;
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

.boxAgent{
  /* 将展示样式设置为 flex 即可启用弹性布局 */
  display: flex;
  /* 设置主轴方向和是否自动换行 */
  flex-flow: row wrap;
  /* 主轴水平居中 */
  justify-content: center;
  /* 设置侧轴多行元素对齐 */
  align-content: flex-start;
  /* 布局宽度 500 像素 */
  width: 100%;
  /* 布局高度 500 像素 */
  height: 100%;
}

/* 列表内容 */
.listContent {
  width: 20%;
  margin: 10px;
  padding: 10px;
  border: 1px solid #cccccc;
  height: 280px;
  overflow: auto;
  //margin-bottom: 20px;
  //margin-right: 2%;
  float: left;
  border-radius: 4px;
}

.listPic {
  width: 35%;
  border: 1px solid #cccccc;
  height: 35%;
  margin-left: 35%;
  //padding: 1px 5px;
  margin-bottom: 5px;
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
  font-size: 15px;
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
  width: 96%;
  min-height: 132px;
  border: 1px solid #cccccc;
  //padding: 0 1%;
}
</style>
