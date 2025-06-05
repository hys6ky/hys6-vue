<template>
  <div id="addMartable2" style="padding: 10px">
    <el-form :model="ruleForm" status-icon inline ref="tableRule" size="small" label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="模型表名" prop="module_table_default_name">
        <el-input v-model="ruleForm.module_table_default_name" disabled/>
      </el-form-item>
      <el-form-item label="临时表" prop="is_temp">
        <el-checkbox :false-label="isFlag.Fou" v-model="ruleForm.is_temp" :true-label="isFlag.Shi"
                     @change="changeTempTable"></el-checkbox>
      </el-form-item>
      <el-form-item label="表英文名称" prop="module_table_en_name"
                    :rules="filter_rules([{ required: true, dataType: 'table' }])">
        <el-input v-model="ruleForm.module_table_en_name" :disabled="ruleForm.is_temp === isFlag.Fou"
                  placeholder="请填写表英文名称" @change="checkTabName">
        </el-input>
      </el-form-item>
      <el-form-item label="表中文名称" prop="module_table_cn_name" :rules="rule.default">
        <el-input :disabled="ruleForm.is_temp === isFlag.Fou" v-model="ruleForm.module_table_cn_name"
                  placeholder="请填写表中文名称">
        </el-input>
      </el-form-item>
      <el-form-item label="步骤序号" prop="step_number">
        <el-input disabled v-model.number="ruleForm.step_number" placeholder="请填写步骤序号"></el-input>
      </el-form-item>
      <!--<el-form-item style="float: right;">
        <el-col>
          <el-button type="primary" @click="SQLhistoryWay()"> 查看历史</el-button>
        </el-col>
      </el-form-item>-->
    </el-form>
    <el-row>
      <el-col class="borderStyle" :span="6" style="height: 440px; overflow: auto">
        <!--树菜单-->
        <!--<el-input placeholder="输入关键字进行过滤" v-model="filterText"/>-->
        <div class="mytree">
          <el-tree class="filter-tree" :data="treedata" :indent="15" @node-click="showTableColumn"
                   @node-contextmenu="rightClick" node-key="file_id" :filter-node-method="filterNode"
                   ref="tree">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="data.description" v-if="data.file_id">
                                <i class="el-icon-document"></i>
                                <template v-if="data.original_name">{{
                                    data.hyren_name
                                  }}【{{ data.original_name }}】</template>
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
      <el-col :span="18" style="padding: 0px 10px">
        <el-tabs type="card">
          <el-row>
            <span style="font-weight: bold;padding-left: 5px;">处理SQL</span>
            <el-col :span="10" style="float: right; width: 40%; margin-bottom: 10px">
              <el-input placeholder="SQL中使用#{}进行替换，例如#{abc};参数处填写abc=123,多个参数时,中间用分号;隔开"
                        size="mini" v-model="sqlparameter">
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <div style="border: 1px solid #ccc ; height: 400px;">
              <SqlEditor ref="sqleditormain" :data="1" :value="basicInfoForm.sqlMain"
                         @changeTextarea="changeTextareaQuerySql($event)" style="height: 400px;" class="textasql"/>
            </div>
          </el-row>
          <el-row class="partFour">
            <div class="elButton">
              <!--<el-button type="primary" size="medium" class="sql-btn"-->
              <!--    @click="formaterSql(basicInfoForm.sqlMain)">格式化SQL-->
              <!--</el-button>-->
              <el-button type="primary" @click="getDataBySQL()" size="medium">数据预览</el-button>
              <el-button :disabled="iflock" type="primary" @click="getColumnBySql()" size="medium">解析输出字段
              </el-button>
            </div>
          </el-row>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 复制小提示框 -->
    <div v-show="menuVisible" @click="foo">
      <span id="menu" class="menu" @click="copydatas">复制名称</span>
      <!--<span v-show="deleteVisible" id="menu1" class="menu" @click="deleteTable">删除表</span>-->
    </div>
    <div v-show="deletePitchOn" @click="foo">
      <span id="menu2" class="menu" @click="deletePitchOn1()">删除选中的表</span>
    </div>
    <el-row>
      <el-button type="primary" size="medium" class="rightbtn" @click="prenext('tableRule')">保存
      </el-button>
      <el-button type="primary" size="medium" class="rightbtn" @click="back()">退出</el-button>
      <el-table :data="columnbysql" border size="mini">
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column prop="field_en_name" label="字段英文名" align="center">
          <template slot-scope="scope">
            <!--<el-tooltip effect="dark" :content="scope.row.field_en_name" placement="top" v-if="-->
            <!--                scope.row.field_en_name !== '' &&-->
            <!--                scope.row.field_en_name !== undefined-->
            <!--            ">-->
            <!--  <input class="el-input__inner" :disabled="iflock || ruleForm.is_temp === isFlag.Fou"-->
            <!--         v-model.lazy="scope.row.field_en_name" autocomplete="off" placeholder="英文名"/>-->
            <!--</el-tooltip>-->
            <input class="el-input__inner" :disabled="iflock || ruleForm.is_temp === isFlag.Fou"
                   v-model.lazy="scope.row.field_en_name" autocomplete="off" placeholder="英文名"/>
          </template>
        </el-table-column>

        <el-table-column prop="field_cn_name" label="字段中文名" align="center">
          <template slot-scope="scope">
            <!--<el-tooltip effect="dark" :content="scope.row.field_cn_name" placement="top" v-if="-->
            <!--                scope.row.field_cn_name !== '' &&-->
            <!--                scope.row.field_cn_name !== undefined-->
            <!--            ">-->
            <!--  <input class="el-input__inner" :disabled="iflock || ruleForm.is_temp === isFlag.Fou"-->
            <!--         v-model.lazy="scope.row.field_cn_name" autocomplete="off" placeholder="中文名"/>-->
            <!--</el-tooltip>-->
            <input class="el-input__inner" :disabled="iflock || ruleForm.is_temp === isFlag.Fou"
                   v-model.lazy="scope.row.field_cn_name" autocomplete="off" placeholder="中文名"/>
          </template>
        </el-table-column>
        <!--处理方式-->
        <el-table-column prop="field_process" label="处理方式" width="150" align="center">
          <template slot="header">
            处理方式
            <el-tooltip class="tooltipHelp" effect="light" placement="top">
              <div slot="content">
                映射赋值：源表字段的值直接给模型表；<br/>
                函数映射：源表的值通过写映射规则进行修改，改变后的值给模型表；<br/>
                分组映射：源表字段的值直接给模型表，同时映射规则填写模型表的字段=某个类别，如type=1的格式进行分组（横表转竖表时用）
              </div>
              <i class="el-icon-warning-outline" aria-hidden="true" style="font-size: 14px"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-select clearable allow-create filterable v-model="scope.row.field_process"
                       @change="changecolumnfiledproccess(scope.row)" placeholder="请选择">
              <el-option v-for="(item, index) in allfield_process" :key="index" :label="item.value"
                         :value="item.code"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="field_type" label="字段类型" width="130" align="center">
          <template slot-scope="scope">
            <el-select clearable allow-create filterable
                       :disabled="iflock || scope.row.field_process === '2' || ruleForm.is_temp === isFlag.Fou"
                       v-model.lazy="scope.row.field_type" placeholder="请选择">
              <!-- <el-option v-for="(item, index) in allfield_type" :key="index" :label="item.target_type"
                  :value="item.target_type"></el-option> -->
              <el-option v-for="(item, index) in allfield_type" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="field_length" label="字段长度" width="130" align="center" class="fieldDesc">
          <template slot-scope="scope">
            <el-input :disabled="iflock || scope.row.field_process === '2'
                         || (scope.row.field_type && numberTypes.includes(scope.row.field_type.toUpperCase()))"
                      v-model.lazy="scope.row.field_length" autocomplete="off" placeholder="长度"/>
            <el-tooltip v-if="scope.row.field_type && scope.row.field_type.toUpperCase() === 'NUMERIC'"
                        class="tooltipHelp" effect="dark" placement="top">
              <div slot="content">
                　　说明: NUMERIC [ ( precision [ , scale ] ) ] ,写法如 : 15,3<br/>
                　　 precision 一个在 1 到 127 范围内（含 1 和 127）的整数表达式，指定表达式中的位数。缺省设置为 30。<br/>
                　　 scale 一个在 0 到 127 范围内（含 1 和 127）的整数表达式，指定小数点后的位数。小数位数值应始终小于或等于精度值。缺省设置为
                6。 <br/>
              </div>
              <i class="el-icon-warning-outline" aria-hidden="true"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="process_para" label="来源值" width="400px" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.field_process !== '5'">

              <el-input v-if="scope.row.field_process === '3'" readonly v-model="scope.row.process_mapping">
                <el-button slot="append" @click="showTableColumns(scope.row)">列选择</el-button>
              </el-input>
              <el-input :disabled="iflock" v-else-if="scope.row.field_process != '4'"
                        v-model="scope.row.process_mapping" autocomplete="off" placeholder="处理方式参数"></el-input>
              <el-input v-if="scope.row.field_process == '4'" :title="scope.row.process_mapping" :clearable="true"
                        placeholder="映射规则" v-model="scope.row.process_mapping">
                <el-button slot="append" @click="settingRule(scope.$index)">设置</el-button>
              </el-input>

              <!--<el-select v-model="scope.row.process_mapping" placeholder="请选择">-->
              <!--    <el-option v-for="item in allfromcolumn" :key="item.value" :label="item.value" :value="item.value">-->
              <!--    </el-option>-->
              <!--</el-select>-->
            </div>
            <div v-if="scope.row.field_process === '5'">
              <el-input placeholder="请输入内容" readonly v-model="scope.row.process_mapping" style="width: 260px">
                <el-button slot="append" @click="showTableColumns(scope.row)">列选择</el-button>
              </el-input>
              <el-input style="width: 220px" v-model="scope.row.group_mapping" autocomplete="off"
                        placeholder="分组映射填写"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="(index, item) in columnmore" v-if="ruleForm.is_temp !== isFlag.Shi"
                         :label="index.dsla_storelayer" :key="item" prop="index"
                         align="center" width="70">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row[scope.column.label]"
                         :checked="scope.row[scope.column.label]" :disabled="updateflag"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="数据预览" :visible.sync="querydatadialogshow" width="60%">
      <el-row>
        <el-table :data="databysql" border size="mini">
          <el-table-column v-for="(index, item) in databysql[0]" :key="item" :label="item"
                           show-overflow-tooltip
                           :prop="item">
            <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button v-if="!iflock || ruleForm.is_temp === isFlag.Shi" type="primary" size="medium"
                   class="rightbtn"
                   @click="querydatadialogshow = false;getColumnBySql()">确 定
        </el-button>
        <el-button type="primary" size="medium" class="rightbtn" @click="querydatadialogshow = false">
          取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 查看历史信息 -->
    <el-dialog title="历史信息" :visible.sync="SQLhistory" width="50%" class="data_edit">
      <el-table :data="SQLHistoryData" height="500" border style="width: 100%">
        <el-table-column prop="update_name" label="修改人">
        </el-table-column>
        <el-table-column prop="start_daratime" label="创建日期">
          <template slot-scope="scope">
            {{ $Date.dateToMilldate(scope.row.start_daratime) }}
          </template>
        </el-table-column>
        <el-table-column prop="stop_daratime" label="修改日期">
          <template slot-scope="scope">
            {{ $Date.dateToMilldate(scope.row.stop_daratime) }}
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="lookHisSQL(scope.row)">查看SQL</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看SQL信息 -->
      <el-dialog width="80%" title="历史信息" :visible.sync="lookSQLhistory" append-to-body>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-card shadow="never">
              <el-row>
                <el-col :span="4">
                  <span>修改前的SQL</span>
                </el-col>
                <el-col :span="4">
                  <span type="text" class="el-button1 editcolor" @click="copyHisSql('ago_update_sql')">复制SQL</span>
                </el-col>
              </el-row>
              <el-input id="ago_update_sql" type="textarea" :rows="24" v-model="hisSql.ago_update_sql"></el-input>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <el-row>
                <el-col :span="4">
                  <!-- <el-button  type="text"></el-button>  -->
                  <span>修改后的SQL</span>
                </el-col>
                <el-col :span="4">
                  <span type="text" class="el-button1 editcolor" @click="copyHisSql('loter_update_sql')">复制SQL</span>
                </el-col>
              </el-row>
              <el-input id="loter_update_sql" type="textarea" :rows="24" v-model="hisSql.loter_update_sql"></el-input>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" size="medium" class="rightbtn" @click="lookSQLhistory = false">取消</el-button>
        </el-row>
      </el-dialog>
      <el-row>
        <el-button type="primary" size="medium" class="rightbtn" @click="SQLhistory = false">取消</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="表字段" :visible.sync="iftablecolumn" width="50%" class="data_edit">
      <el-row>
        <el-table :data="tablecolumn" border size="mini" ref="filterTable" height="400"
                  @selection-change="handleSelectionColumn">
          <el-table-column width="70" align="center" type="selection">
          </el-table-column>
          <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
          <el-table-column prop="column_name" label="字段英文名" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="column_ch_name" label="字段英文名" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="data_type" label="字段类型" align="center"/>
          <el-table-column prop="data_len" label="长度" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.data_type === 'numeric'">{{ scope.row.data_len }},{{
                  scope.row.decimal_point
                }}</span>
              <span v-else>{{ scope.row.data_len }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="changesql()">确定</el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="dismissiftablecolumn()">取消
        </el-button>
      </el-row>
    </el-dialog>
    <!--规则显示-->
    <el-dialog title="函数速查表" :visible.sync="ruleDialog" width="80%" top="3%">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tableDatalist.classify" :key="item" :label="item" :name="item">
          <el-table stripe
                    :data="tableDatalist[item].filter(data => !search || (data.function_name.toLowerCase().includes(search.toLowerCase()))||data.function_example.toLowerCase().includes(search.toLowerCase()))"
                    size="medium" height="400">
            <el-table-column prop="function_name" label="函数名" show-overflow-tooltip align="left"
                             min-width="30px;"></el-table-column>
            <el-table-column prop="function_example" label="例子" align="left" show-overflow-tooltip
                             min-width="60px;"></el-table-column>
            <el-table-column prop="function_desc" label="描述" align="left" show-overflow-tooltip>
              <template slot="header" slot-scope="scope">
                <i>描述</i>
                <span style="float:right;"><el-input v-model="search" size="mini" :key="scope.row"
                                                     placeholder="输入函数名或者列子进行搜索"/></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <code>规则设置(请填写处理函数,如果使用跑批日期则填写:#{txdate}(跑批日期),#{txdate_pre}(跑批日期 -
        1),#{txdate_next}(跑批日期 +
        1))</code>
      <el-input v-model="ruleStr" type="textarea"></el-input>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="saveSetRule">确定
        </el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="ruleDialog=false">取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 字段列表-->
    <template v-if="isShowColumns == true">
      <el-dialog title="字段列表" :visible.sync="isShowColumns" width="50%">
        <el-table
            :data="allfromcolumn.filter(data => !columnSearch || data.value.toLowerCase().includes(columnSearch.toLowerCase()))"
            size="mini" height="400">
          <el-table-column type="index" label="序号" align='center' width="70"></el-table-column>
          <el-table-column prop="value" label="字段英文名" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column label="操作">
            <template slot="header" slot-scope="scope">
              <el-input v-model="columnSearch" :prop="scope.row" size="mini" placeholder="输入列名搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import rulesData from '@/utils/validator';
import SqlEditor from "@/components/global/SqlEditor.vue";

export default {
  components: {
    SqlEditor,
  },
  data() {
    return {
      isFlag: {},
      ruleForm: {
        module_table_cn_name: '',
        module_table_en_name: '',
      },
      // fromData: ["dm_datatable", "ruleForm"],
      search: "",
      ruleDialog: false,
      menuVisible: false,
      menuVisible1: false,
      deleteVisible: false,
      deletePitchOn: false,
      tableDatalist: {},
      setRow: {},
      ruleStr: "",
      presql: "",
      aftersql: "",
      ifprejob: false,
      ifafterjob: false,
      treedata: [],
      rule: rulesData,
      data_mart_id: '',
      id: null,
      job_id: null,
      category_id: null,
      is_add: this.$route.query.is_add,
      dsl_id: null,
      datatable_id: null,// 作业步骤表id
      sourceDataTable_id: null,// 模型表id
      ifrepeat: this.$route.query.ifrepeat,
      querydatadialogshow: false,
      filterText: "",
      columnbysql: [],
      filterNodeData: [],
      columnmore: [],
      allfield_type: [],
      allfield_process: [],
      allfromcolumn: [],
      databysql: [],
      ifhbase: false,
      ifhbasesort: false,
      sqlparameter: "",
      hbasesort: [],
      iftablecolumn: false,
      tablecolumn: [],
      Allis_selectionstate: false,
      sqltablename: "",
      iflock: false,
      multipleSelection: [],
      formInline: {
        table_name: "",
        selectColumns: "",
        whereColumns: "",
        groupColumns: "",
      },
      relationTableList: [],
      relationTableAttr: {},
      selectTableVisible: false,
      SQLhistory: false,
      lookSQLhistory: false,
      hisSql: {},
      SQLHistoryData: [],
      selectTableCreateVisible: false,
      relationTableVisible: false,
      labelPosition: "right",
      currPage: 1,
      pageSize: 10,
      totalSize: 0,
      selectRow: {},
      tableData: [],
      relationNums: [],
      relationIndex: 1,
      basicInfoForm: {
        sqlMain: "",
      },
      preJobForm: {
        sqlMain: "",
      },
      afterJobForm: {
        sqlMain: "",
      },
      radioSelect: "",
      reSelectColumns: "",
      selectColumns1: "",
      tableNameList: [],
      tableNameListString: "a,b,c,d,e,",
      checkColumnData: ["varchar", "varchar2", "text", "char", "string"],
      activeName: "",
      tablename: "",
      ifRelationDatabase: false,
      pre_partition: "",
      isShowColumns: false,
      selectColumn: {},
      columnSearch: "",
      tempTable: {},
      params: {},
      numberTypes: ["INT", "BIGINT", "STRING", "FLOAT", "DOUBLE"],
      allFromSqlColumns: [],
      batchList: [],
      is_change_temp: false,
      // 需要删除的表数据信息
      deleteData: {},
      CheckedNodes: [],
      jobtab_id: '',
      updateflag: false,
      tmp_field_type: ""
    };
  },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getAllfield_process();
    this.repJodData();
    this.checkUpdate();
    this.getTreeData();
    this.ondatabase();
    this.getColumnMore();
    if (this.datatable_id) {
      // 编辑
      this.getColumnFromDatabase(this.datatable_id);
      // this.getFromColumnList(this.datatable_id);
    } else {
      // 新增
      this.getColumnFromDatabase(this.sourceDataTable_id);
      //this.getFromColumnList(this.sourceDataTable_id);
    }
    this.getIfHbase();
    this.$Code.getCodeItems({
      category: "IsFlag",
    }).then((res) => {
      this.isFlag = res.data;
    });
  },
  mounted() {
    this.checkIfRepeat();
    //this.getQuerySql();
    // this.getIfRelationDatabase2();
    this.getToday()
  },
  methods: {
    checkUpdate() {
      this.$executeRequest.execGetByModulName("/market/dmModuleTable/checkModuleTableFields", {moduleTableId: this.sourceDataTable_id}).then(res => {
        if (res.data) {
          this.updateflag = true;
        }
      })
    },
    getToday() {
      let today = new Date(); // 获取当前日期和时间
      let year = today.getFullYear().toString(); // 获取年份
      let month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1).toString() : (today.getMonth() + 1).toString(); // 获取月份，需要加1，因为getMonth()返回的是0到11
      let day = today.getDate() < 10 ? '0' + today.getDate().toString() : today.getDate().toString(); // 获取日期
      this.sqlparameter = "txdate=" + year + '-' + month + '-' + day;
    },
    changeTempTable() {
      this.is_change_temp = true;
      if (this.ruleForm.is_temp === this.isFlag.Fou) {
        // 模型表
        this.getJobDataInfoById();
        // this.getColumnFromDatabase(this.sourceDataTable_id);
        //this.getFromColumnList(this.sourceDataTable_id);
      } else {
        // 临时表
        if (this.datatable_id) {
          this.getJobStepTableDataById();
        } else {
          this.ruleForm.module_table_en_name = '';
          this.ruleForm.module_table_cn_name = '';
          this.columnbysql = [];
        }
      }
    },
    getCheckedNodes() {
      var nodeArray = this.$refs.tree.getCheckedNodes();
      this.tableNameList = [];
      this.relationTableList_1 = [];
      this.tableNameListString = "";
      for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        var table_name = node.table_name;
        var children = node.children;
        if (children.length === 0 && table_name !== undefined) {
          this.tableNameList.push(table_name);
          this.tableNameListString += table_name + ",";
        }
      }
      if (nodeArray.length === 0) {
        this.$Msg.customizTitle("请勾选左侧树形菜单上的表", "warning");
        return;
      }
      this.tableNameListString = this.tableNameListString.substring(
          0,
          this.tableNameListString.length - 1
      );
      // functionAll.getRelationTable({
      //   tableNameListString: this.tableNameListString,
      // }).then((res) => {
      //   this.relationTableVisible = true;
      // });
    },
    getIfRelationDatabase() {
      // 通过 DOM API 更新文本
      this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      let param = new FormData();
      param.append("datatable_id", this.datatable_id);
      param.append("sql", this.basicInfoForm.sqlMain);
      // functionAll.getIfRelationDatabase(param).then((res) => {
      //   this.ifRelationDatabase = res.data;
      // });
    },
    // 选择数据库
    ondatabase() {
      this.$executeRequest.execGetByModulName("/market/getAllFieldTypeByTableId", {"tab_id": this.sourceDataTable_id}).then((res) => {
        if (res.data.length > 0) {
          const typeSet = new Set();
          res.data.forEach((item) => {
            typeSet.add(item.replace("(", "").replace(")", ""));
          });
          this.allfield_type = [...typeSet];
        } else {
          this.allfield_type.push(this.tmp_field_type)
        }
      });
    },
    getTableName() {
      // functionAll.getTableName({
      //   datatable_id: this.datatable_id,
      // }).then((res) => {
      //   this.tablename = res.data.datatable_en_name;
      //   this.pre_partition = res.data.pre_partition;
      // });
    },
    checkIfRepeat() {
      if (this.ifrepeat === "true" || this.ifrepeat === true) {
        this.$executeRequest.execGetByModulName("/market/getTableIdFromSameNameTableId", {
          dmDataTableId: this.datatable_id,
        }).then((res) => {
          let tmpDatatable_id = res.data[0].datatable_id;
          this.getColumnFromDatabase(tmpDatatable_id);
          this.getFromColumnList(tmpDatatable_id);
          this.iflock = true;
        });
      }
    },
    showTableColumn(data, index) {
      this.index = index;
      if (data.file_id  && data.file_id !== "") {
        this.$executeRequest.execGetByModulName("/market/queryAllColumnOnTableName", {
          source: data.data_layer,
          id: data.file_id,
        }).then((res) => {
          this.tablecolumn = res.data.column_info_list;
          this.sqltablename = res.data.hyren_name;
          this.iftablecolumn = true;
          this.Allis_selectionstate = false;
        });
      }
    },
    getIfHbase() {
      if (this.datatable_id !== undefined && this.datatable_id) {
        this.$executeRequest.execGetByModulName("/market/getIfHbase", {dmDataTableId: this.datatable_id}).then((res) => {
          if (res && res.success) {
            this.ifhbase = res.data;
          }
        });
      }
    },
    getTreeData() {
      this.$executeRequest.execGetByModulName("/market/getTreeDataInfo").then((res) => {
        this.treedata = res.data;
        //是临时表的时候左边树填充临时表   临时表不存在，根本不需要展示
        /*if (this.sourceDataTable_id != null ) {
          this.$executeRequest.execGetByModulName("/market/getTempTable",
                  {dmDataTableId: this.sourceDataTable_id}).then(res => {
            res.data.forEach(tempTable => {
              this.treedata.push(tempTable)
            })
          })
        }*/
      });
    },
    // getQuerySql() {
    //   if (this.jobtab_id !== "") {
    //     this.$executeRequest.execGetByModulName("/market/getQuerySql", {jobtab_id: this.jobtab_id}).then((res) => {
    //       if (res && res.success) {
    //         let sql = this.$Secret.Decrypt(res.data);
    //         // 通过 DOM API 更新文本
    //         this.$refs.sqleditormain.setmVal(sql);
    //         this.basicInfoForm.sqlMain = sql;
    //       }
    //     });
    //   }
    // },
    getColumnFromDatabase(datatable_id) {
      this.$executeRequest.execGetByModulName("/market/getColumnFromDatabase", {
        dmDataTableId: datatable_id,
        is_temp: this.params.is_temp,
        jobTableId: this.jobtab_id
      }).then((res) => {
        let allfromcolumn = [];
        this.allfromcolumn.forEach(e => {
          allfromcolumn.push(e.value);
        });
        let result = res.data;
        if (result.length !== 0) {
          res.data.forEach(columnItem => {
            if (!columnItem.field_process) {
              columnItem['field_process'] = "3";
            }
            if (!columnItem.process_mapping) {
              columnItem['process_mapping'] = "";
            }
            //比较解析出的字段是否和模型表一致，一致就保存，不一致就为空
            if (allfromcolumn.length != 0) {
              if (allfromcolumn.indexOf(columnItem.field_en_name) == -1) {
                columnItem.process_mapping = '';
              }
            }
          });
          this.columnbysql = result;
        }
        if (res && res.success) {
          //这个先别删，这个是解析sql时将解析出的字段和模型表字段取并集
          /*const arr = this.columnbysql;
          for (let i = 0; i < arr.length; i++) {
              if (typeof arr[i]["module_field_id"] != "undefined") {
                  for (let j = 0; j < arr.length; j++) {
                      if (typeof arr[i] != "undefined" && typeof arr[j] != "undefined") {
                          if (arr[i]["field_en_name"] === arr[j]["field_en_name"]) {
                              if (typeof arr[j]["module_field_id"] == "undefined") {
                                  arr.splice(j, 1);
                              }
                          }
                      }
                  }
              } else {
                  for (let j = 0; j < arr.length; j++) {
                      if (typeof arr[i] != "undefined" && typeof arr[j] != "undefined") {
                          if (arr[i]["field_en_name"] === arr[j]["field_en_name"]) {
                              if (typeof arr[j]["module_field_id"] != "undefined") {
                                  arr.splice(i, 1);
                              }
                          }
                      }
                  }
              }
          }*/
          //确定字段顺序
          let dataTableInfos = [].concat(this.columnbysql);
          for (let i = 0; i < this.columnbysql.length; i++) {
            dataTableInfos[i].csi_number = i;
          }
          this.columnbysql = dataTableInfos;
        }
      });
    },
    getFromColumnList(datatable_id) {
      this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      let param = new FormData() // 创建form对象
      param.append('querysql', this.basicInfoForm.sqlMain);
      param.append('datatable_id', this.datatable_id ? this.datatable_id : this.sourceDataTable_id);
      param.append('sqlparameter', this.sqlparameter);
      this.$executeRequest.execPostByModulName("/market/dmJobTableInfo/getColumnBySql", param).then(res => {
        if (res.success) {
          this.allfromcolumn = res.data.columnlist;
        }
      })
    },
    // 解析输出字段
    getColumnBySql() {
      // 通过 DOM API 更新文本
      this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      if (this.basicInfoForm.sqlMain === "") {
        this.$Msg.customizTitle("查询sql不能为空!", "warning");
      } else {
        let param = new FormData() // 创建form对象
        param.append('querysql', this.basicInfoForm.sqlMain);
        param.append('datatable_id', this.datatable_id ? this.datatable_id : this.sourceDataTable_id);
        param.append('sqlparameter', this.sqlparameter);
        this.$executeRequest.execPostByModulName("/market/dmJobTableInfo/getColumnBySql", param).then((res) => {
          if (res && res.data) {
            this.allfromcolumn = res.data.columnlist;
            // this.tmp_field_type = "";
            for (let i = 0; i < res.data.result.length; i++) {
              res.data.result[i].field_process = this.allfield_process[2].code
            }
            if (this.ruleForm.is_temp === this.isFlag.Shi) {
              // 临时表
              this.tmp_field_type = this.columnbysql[0].field_type;
              this.columnbysql = res.data.result;
              // this.getColumnFromDatabase(this.datatable_id);
            } else {
              // 模型表
              // this.getColumnFromDatabase(this.params.sourceDataTable_id)

            }
            // let flag = true;
            // this.allfield_type = [];
            // //向allfield_type放入默认选中的类型
            // for (var i = 0; i < this.allfield_type.length; i++) {
            //   if (tmp_field_type === this.allfield_type[i].target_type) {
            //     flag = false;
            //     break;
            //   }
            // }
            // if (flag) {
            //   this.allfield_type.push(tmp_field_type);
            // }
          }
        });
        this.getIfRelationDatabase();
      }
    },
    // 数据预览，根据SQL查询数据
    getDataBySQL() {
      // 通过 DOM API 更新文本
      this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      if (this.basicInfoForm.sqlMain === "") {
        this.$Msg.customizTitle("查询sql不能为空!", "warning");
      } else {
        this.databysql = [];
        /*let param = new FormData();
        param.append(
            "querysql",
            this.$Secret.Encrypt(this.basicInfoForm.sqlMain)
        );*/
        let param = new FormData() // 创建form对象
        param.append('querysql', this.basicInfoForm.sqlMain);
        param.append('sqlparameter', this.sqlparameter);
        // param.append("sqlparameter", this.sqlparameter);
        this.$executeRequest.execPostByModulName("/market/dmJobTableInfo/getDataBySQL", param).then((res) => {
          if (res && res.success) {
            this.querydatadialogshow = true;
            this.databysql = res.data;
          }
        });
      }
    },
    getColumnMore() {
      if (this.ruleForm.is_temp === "0") {
        // 模型表
        this.$executeRequest.execGetByModulName("/market/getColumnMore", {
          dmDataTableId: this.sourceDataTable_id,
        }).then((res) => {
          this.columnmore = [];
          if (res && res.success) {
            res.data.forEach((item) => {
              this.$Code.getValue({
                category: "StoreLayerAdded",
                code: item.dsla_storelayer
              }).then((res) => {
                item.dsla_storelayer = res.data;
              });
            });
            this.columnmore = res.data;
          }
        });
      } else {
        // 临时表
        this.$executeRequest.execGetByModulName("/market/getColumnMore", {
          dmDataTableId: this.datatable_id,
        }).then((res) => {
          this.columnmore = [];
          if (res && res.success) {
            res.data.forEach((item) => {
              this.$Code.getValue({
                category: "StoreLayerAdded",
                code: item.dsla_storelayer
              }).then((res) => {
                item.dsla_storelayer = res.data;
              });
            });
            this.columnmore = res.data;
          }
        });
      }
    },
    changecolumnfiledproccess(row) {
      if (row.field_process != "3") {
        row.process_para = "";
      } else {
        row.process_para = 0;
      }
    },
    getAllfield_process() {
      this.$Code.getCategoryItems({
        category: "ProcessType",
      }).then((res) => {
        this.allfield_process = res.data;
      });
    },
    back() {
      // 标识1 位返回,不做任何修改 0 位保存
      sessionStorage.setItem("params", JSON.stringify({
        // dsl_id: this.dsl_id,
        data_mart_id: this.data_mart_id,
        category_id: this.category_id,
        datatable_id: this.datatable_id,
        sourceDataTable_id: this.sourceDataTable_id,
        module_table_default_name: this.ruleForm.module_table_default_name,
        task_id: this.params.task_id,
        //datatable_en_name: this.params.datatable_en_name,
        // datatable_cn_name: this.params.datatable_cn_name,
      }));
      this.$router.push({
        name: "jobDetail",
      })
      // this.saveStepJobTable("1")
    },
    prenext(tableRule) {
      this.hbasesort = [];
      let ifhasrowkeyflag = false;
      if (this.ifhbase) {
        for (var i = 0; i < this.columnbysql.length; i++) {
          var everyrow = this.columnbysql[i];
          if (everyrow.hasOwnProperty("rowkey") && everyrow.rowkey == true) {
            ifhasrowkeyflag = true;
            this.hbasesort.push({
              field_en_name: everyrow.field_en_name,
            });
          }
        }
        if (!ifhasrowkeyflag) {
          this.$Msg.confirmMsg("目的地为Hbase,但没有选择rowkey,默认rowkey为全字段的MD5").then((res) => {
            this.next();
          }).catch(() => {
          });
        } else {
          // functionAll.sortHbae({
          //   hbasesort: JSON.stringify(this.hbasesort),
          //   datatable_id: this.datatable_id,
          // }).then((res) => {
          //   this.hbasesort = res.data;
          // });
          this.ifhbasesort = true;
        }
      } else {
        // 如果存储层不是hbase,那么预分区键设置为''
        this.pre_partition = "";
        this.next();
      }
    },
    next() {
      this.$refs.tableRule.validate(async (valid) => {
        if (valid) {
          // 通过 DOM API 更新文本
          this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
          if (this.basicInfoForm.sqlMain === "") {
            this.$Msg.customizTitle("请填写sql!", "warning");
            return false;
          }
          if (this.columnbysql.length === 0) {
            this.$Msg.customizTitle("请先点击确定 生成字段", "warning");
            return false;
          }
          // 获取sql中的所有字段
          let param = new FormData();
          param.append("querySql", this.basicInfoForm.sqlMain)
          this.$executeRequest.execPostByModulName("/market/getAllFromSqlColumns", param).then((res) => {
            if (res && res.success) {
              this.allFromSqlColumns = res.data;
              for (let i = 0; i < this.columnbysql.length; i++) {
                const field_en_name = this.columnbysql[i].field_en_name;
                if (
                    field_en_name.toUpperCase() === "HYREN_S_DATE" ||
                    field_en_name.toUpperCase() === "HYREN_E_DATE" ||
                    field_en_name.toUpperCase() === "HYREN_MD5_VAL"
                ) {
                  this.$Msg.customizTitle(
                      "请检查最终表中是否存在HYREN字段,如存在,请过滤掉相应HYREN字段",
                      "warning"
                  );
                  return false;
                }
                if (field_en_name === "" || field_en_name === undefined) {
                  this.$Msg.customizTitle(
                      "第" + (i + 1) + "行字段英文名为空",
                      "warning"
                  );
                  return false;
                }
                const field_cn_name = this.columnbysql[i].field_cn_name;
                if (field_cn_name === "" || field_cn_name === undefined) {
                  this.$Msg.customizTitle(
                      "第" + (i + 1) + "行字段中文名为空",
                      "warning"
                  );
                  return false;
                }
                const field_type = this.columnbysql[i].field_type;
                if (field_type === "" || field_type === undefined) {
                  this.$Msg.customizTitle(
                      "第" + (i + 1) + "行字段类型名为空",
                      "warning"
                  );
                  return false;
                }
                const field_process = this.columnbysql[i].field_process;
                if (field_process === "" || field_process === undefined) {
                  this.$Msg.customizTitle(
                      "第" + (i + 1) + "行字段处理方式为空",
                      "warning"
                  );
                  return false;
                }
                const process_mapping = this.columnbysql[i].process_mapping;
                if (field_process === "4") {
                  if (process_mapping === "" || process_mapping === undefined) {
                    this.$Msg.customizTitle(
                        "第" + (i + 1) + "行函数映射为空",
                        "warning"
                    );
                    return false;
                  }
                } else if (field_process === "2") {
                  //不进行验证
                } else {
                  let regx = /^\'(\S*)\'$/;
                  if (this.checkColumnData.includes(field_type.toLowerCase()) && field_process === "1") {
                    if (!regx.test(process_mapping)) {
                      this.$Msg.customizTitle(
                          "第" +
                          (i + 1) +
                          "行来源值为空填写不正确,请将值使用单引号包裹...",
                          "warning"
                      );
                      return false;
                    }
                  } else {
                    if (process_mapping === "" || process_mapping === undefined) {
                      this.$Msg.customizTitle(
                          "第" + (i + 1) + "行来源值为空",
                          "warning"
                      );
                      return false;
                    }
                    // 映射赋值或者分组映射的时候判断
                    if (this.allFromSqlColumns.length > 0 && (field_process === "3" || field_process === "5")) {
                      const flag = this.allFromSqlColumns.some(item => item && item.includes(process_mapping));
                      if (!flag) {
                        this.$Msg.customizTitle(
                            "第" + (i + 1) + "行来源值不属于sql字段",
                            "warning"
                        );
                        return false;
                      }
                    }
                  }
                }
                if (field_process === "5") {
                  const group_mapping = this.columnbysql[i].group_mapping;
                  if (group_mapping === "" || group_mapping === undefined) {
                    this.$Msg.customizTitle(
                        "第" + (i + 1) + "行分组映射为空",
                        "warning"
                    );
                    return false;
                  }
                }
                if (field_type === "decimal" || field_type === "varchar") {
                  if (!this.columnbysql[i].hasOwnProperty("field_length")) {
                    this.$Msg.customizTitle(
                        "第" +
                        (i + 1) +
                        "行字段类型为" +
                        field_type +
                        "且没有长度，请填写长度",
                        "warning"
                    );
                    return false;
                  } else {
                    const field_length = this.columnbysql[i].field_length;
                    if (field_length === "") {
                      this.$Msg.customizTitle(
                          "第" +
                          (i + 1) +
                          "行字段类型为" +
                          field_type +
                          "且没有长度，请填写长度",
                          "warning"
                      );
                      return false;
                    }
                  }
                }
              }
              let dm_column_storage = [];
              const fieldList = this.columnbysql;
              for (let n = 0; n < this.columnmore.length; n++) {
                const dslad_id = this.columnmore[n].dslad_id;
                const dsla_storelayer = this.columnmore[n].dsla_storelayer;
                for (let j = 0; j < fieldList.length; j++) {
                  const everydatatable_field_info = fieldList[j];
                  if (everydatatable_field_info.hasOwnProperty(dsla_storelayer)) {
                    fieldList[j].keyType = dsla_storelayer;
                    fieldList[j].dslad_id = dslad_id;
                    fieldList[j].csi_number = j;
                    if (everydatatable_field_info[dsla_storelayer] === true) {
                      dm_column_storage.push({
                        csi_number: j,
                        dslad_id: dslad_id,
                      });
                    }
                  }
                }
              }
              let tableName = '';
              if (this.ruleForm.is_temp === "1") {
                //如果是临时表，就将表名换成模型表_临时表
                tableName = this.ruleForm.module_table_default_name + "_temp_" + this.ruleForm.module_table_en_name;
              } else {
                tableName = this.ruleForm.module_table_default_name;
              }
              let jobData = {
                "jobtab_id": this.jobtab_id,
                "module_table_field_info": JSON.stringify(fieldList),
                "dm_column_storage": JSON.stringify(dm_column_storage),
                "job_table_view_sql": this.basicInfoForm.sqlMain,
                "hbasesort": JSON.stringify(this.hbasesort),
                "pre_partition": this.pre_partition,
                "data_mart_id": this.data_mart_id,
                "category_id": this.category_id,
                //"module_table_id": this.ruleForm.is_temp === "1" ? this.datatable_id : this.sourceDataTable_id,
                "module_table_id": this.sourceDataTable_id,
                "task_id": this.task_id,
                "dsl_id": this.dsl_id,
                "id": this.id,
                "is_temp": this.ruleForm.is_temp,
                "step_number": this.ruleForm.step_number,
                "module_table_en_name": tableName,
                "module_table_cn_name": this.ruleForm.module_table_cn_name,
              };
              // 标识1 位返回,不做任何修改 0 位保存
              // this.saveStepJobTable("0", param)
              this.$executeRequest.execPostByModulName("/market/addTaskDataTableAndField", jobData).then(res => {
                if (res.success) {
                  sessionStorage.setItem("params", JSON.stringify({
                    dsl_id: this.dsl_id,
                    data_mart_id: this.data_mart_id,
                    category_id: this.category_id,
                    datatable_id: this.datatable_id,
                    sourceDataTable_id: this.sourceDataTable_id,
                    module_table_default_name: this.ruleForm.module_table_default_name,
                    task_id: this.params.task_id,
                    //datatable_en_name: this.params.datatable_en_name,
                    //datatable_cn_name: this.params.datatable_cn_name,
                  }));
                  this.$router.push({
                    name: 'jobDetail'
                  });
                }
              })
            }
          })
        }
      });
    },
    // 获取历史SQL
    getHistorySql(datatable_en_name) {
      // functionAll.getHistorySql({
      //   datatable_en_name: datatable_en_name
      // }).then(res => {
      //   this.SQLHistoryData = res.data || [];
      // })
    },
    // 查看sql信息
    lookHisSQL(row) {
      this.lookSQLhistory = true;
      this.hisSql.ago_update_sql = row.ago_update_sql;
      this.hisSql.loter_update_sql = row.loter_update_sql;
    },
    // 复制sql
    copyHisSql(sql) {
      let oInput = document.getElementById(sql);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message.success('复制成功')
    },
    addcolumn() {
      let param = {
        field_en_name: "",
        field_cn_name: "",
        field_type: this.allfield_type[0].target_type,
        field_length: "",
        field_process: this.allfield_process[0].code,
        process_para: "",
        field_desc: "",
      };
      this.columnbysql.push(param);
    },
    deletecolumn(row) {
      this.columnbysql.splice(row, 1);
    },
    hbasedowncolumn(val, data) {
      if (val + 1 === this.hbasesort.length) {
        this.$Msg.customizTitle("已经是最后一条，不可下移", "warning");
      } else {
        let downDate = this.hbasesort[val + 1];
        this.hbasesort.splice(val + 1, 1);
        this.hbasesort.splice(val, 0, downDate);
      }
    },
    downcolumn(val, data) {
      if (val + 1 === this.columnbysql.length) {
        this.$Msg.customizTitle("已经是最后一条，不可下移", "warning");
      } else {
        let downDate = this.columnbysql[val + 1];
        this.columnbysql.splice(val + 1, 1);
        this.columnbysql.splice(val, 0, downDate);
      }
    },
    hbaseupcolumn(val, data) {
      if (val > 0) {
        let upDate = this.hbasesort[val - 1];
        this.hbasesort.splice(val - 1, 1);
        this.hbasesort.splice(val, 0, upDate);
      } else {
        this.$Msg.customizTitle("已经是第一条，不可上移", "warning");
      }
    },
    upcolumn(val, data) {
      if (val > 0) {
        let upDate = this.columnbysql[val - 1];
        this.columnbysql.splice(val - 1, 1);
        this.columnbysql.splice(val, 0, upDate);
      } else {
        this.$Msg.customizTitle("已经是第一条，不可上移", "warning");
      }
    },
    dismissifhbasesort() {
      this.ifhbasesort = false;
    },
    syncColumn(tableColumn) {
      let column = {};
      column['field_cn_name'] = tableColumn['column_ch_name'];
      column['field_en_name'] = tableColumn['column_name'];
      column['field_length'] = tableColumn['data_len'];
      column['field_type'] = tableColumn['data_type'];
      column['process_mapping'] = tableColumn['column_name'];
      column['field_process'] = '3';
      this.columnbysql.push(column);
    },
    changesql() {
      let sql = "select ";
      //重复点击时清空
      // 通过 DOM API 更新文本
      this.$refs.sqleditormain.setmVal("");

      for (let i = 0; i < this.tablecolumn.length; i++) {
        if (this.tablecolumn[i].selectionstate === true) {
          sql += this.tablecolumn[i].column_name + ",";
        }
      }
      //将选中的列同步到下方
      if (this.ruleForm.is_temp === this.isFlag.Shi) {
        this.columnbysql = [];
        for (let i = 0; i < this.tablecolumn.length; i++) {
          if (this.tablecolumn[i].selectionstate === true) {
            //sql += this.tablecolumn[i].column_name + ",";
            this.syncColumn(this.tablecolumn[i]);
          }
        }
      }
      sql = sql.substr(0, sql.length - 1);
      sql += " from " + this.sqltablename;
      let mVal = this.$refs.sqleditormain.getmVal();
      if (mVal !== "" && mVal.length > 0) {
        sql = mVal + "\n\n\n" + sql;
      }
      this.basicInfoForm.sqlMain = sql;
      // 通过 DOM API 更新文本
      this.$refs.sqleditormain.setmVal(sql);
      // this.formaterSql(sql);
      this.iftablecolumn = false;
      this.Allis_selectionstate = false;
    },
    dismissiftablecolumn() {
      this.iftablecolumn = false;
      this.Allis_selectionstate = false;
    },
    Allis_selectionstateFun() {
      if (this.Allis_selectionstate) {
        this.tablecolumn.forEach((data) => {
          data.selectionstate = true;
        });
      } else {
        this.tablecolumn.forEach((data) => {
          data.selectionstate = false;
        });
      }
    },
    evercheck(val, name) {
      let count = 0;
      if (this.Allis_selectionstate === true) {
        for (let i = 0; i < this.tablecolumn.length; i++) {
          if (this.tablecolumn[i].selectionstate === true) {
            count++;
          }
        }
        this.Allis_selectionstate = count === this.tablecolumn.length;
      } else {
        this.Allis_selectionstate = false;
      }
    },
    getpreandafterjob() {
      // functionAll.getPreAndAfterJob({
      //   datatable_id: this.datatable_id,
      // }).then((res) => {
      //   if (res && res.success) {
      //     if (typeof res.data.post_work != "undefined") {
      //       this.afterJobForm.sqlMain = res.data.post_work;
      //       this.$refs.sqleditorafter.setmVal(this.afterJobForm.sqlMain);
      //     }
      //     if (typeof res.data.pre_work != "undefined") {
      //       this.preJobForm.sqlMain = res.data.pre_work;
      //       this.$refs.sqleditorpre.setmVal(this.preJobForm.sqlMain);
      //     }
      //   }
      // });
    },
    showprejob() {
      this.ifprejob = true;
      this.getpreandafterjob();
    },
    cancelprejob() {
      this.ifprejob = false;
    },
    showafterjob() {
      this.ifafterjob = true;
      this.getpreandafterjob();
    },
    cancelafterjob() {
      this.ifafterjob = false;
    },
    // 保存前置作业
    savePreJob() {
      if (
          this.$refs.sqleditorpre !== undefined &&
          this.$refs.sqleditorpre !== ""
      ) {
        this.preJobForm.sqlMain = this.$refs.sqleditorpre.getmVal();
      }
      // functionAll.savePreJob({
      //   pre_work: this.$Secret.Encrypt(this.preJobForm.sqlMain),
      //   datatable_id: this.datatable_id,
      // }).then((res) => {
      //   if (res && res.success) {
      //     this.ifprejob = false;
      //   }
      // });
    },
    // 保存后置作业
    saveAfterJob() {
      if (
          this.$refs.sqleditorafter !== undefined &&
          this.$refs.sqleditorafter !== ""
      ) {
        this.afterJobForm.sqlMain = this.$refs.sqleditorafter.getmVal();
      }
      // functionAll.saveAfterJob({
      //   post_work: this.$Secret.Encrypt(this.afterJobForm.sqlMain),
      //   datatable_id: this.datatable_id,
      // }).then((res) => {
      //   if (res && res.success) {
      //     this.ifafterjob = false;
      //   }
      // });
    },
    // 树节点触发
    handleNodeClick(data) {
      this.tableData = [];
      //如果节点的file_id为未定义并且节点的分类id不为空并且节点分类不是未定义,代表该节点是分类信息,则添加分类下节点数据到展示区
      if ("undefined" === typeof data.file_id && data.classify_id !== "" && "undefined" !== typeof data.classify_id) {
        //如果该节点的子节点信息不是未定义,则添加该节点下所有表信息
        if (typeof data.children !== "undefined") {
          data.children.forEach((element) => {
            //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
            if ("undefined" !== typeof element.file_id && element.file_id !== "") {
              this.tableData.push(element);
            }
          });
        }
      }
      //如果数据层是DQC或者UDL,并且父id是DQC或者UDL则添加存储层下的表信息到展示区
      else if ((data.data_layer === "DQC" || data.data_layer === "UDL") && (data.parent_id === "DQC" || data.parent_id === "UDL")) {
        this.tableData = data.children;
      }
      //如果file_id不为空,代表该节点是表信息,添加表信息到展示区
      else if ("undefined" !== typeof data.file_id && data.file_id !== "") {
        this.tableData.push(data);
      }
      this.totalSize = this.tableData.length;
    },
    // 树右键复制代码
    rightClick(MouseEvent, object, Node, element) {
      this.deletePitchOn = false;
      this.menuVisible = false;
      this.deleteVisible = false;
      var dataList = this.$refs.tree.getCheckedNodes();
      this.CheckedNodes = [];
      dataList.forEach(itme => {
        if (itme.file_id && itme.agent_id) {
          this.CheckedNodes.push(itme.file_id)
        }
      })
      if (!!this.CheckedNodes && this.CheckedNodes.length == 0) {
        if (Node.data.data_layer || Node.data.file_id && Node.data.file_id.length > 0) {
          this.copydata = Node.label;
          this.menuVisible = false;
          this.menuVisible = true;
          var menu = document.querySelector("#menu");
          document.addEventListener("click", this.foo);
          document.addEventListener("wheel", this.foo);
          document.addEventListener("mouseup", this.foo);
          menu.style.display = "block";
          menu.style.left = MouseEvent.pageX + 1 + "px";
          menu.style.top = MouseEvent.pageY - 8 + "px";
          // 清空数据
          this.deleteData = {};
          if (Node.data.data_layer === "DCL") {
            this.deleteVisible = true;
            var menu1 = document.querySelector("#menu1");
            menu1.style.display = "block";
            menu1.style.left = MouseEvent.pageX + 1 + "px";
            menu1.style.top = MouseEvent.pageY + 16 + "px";
            this.deleteData = Node.data;
          } else {
            this.deleteVisible = false;
          }
        } else {
          this.deleteData = {};
          return false;
        }
      } else {
        if (Node.data.data_layer === "DCL") {
          this.menuVisible = false;
          this.deletePitchOn = true;
          var menu1 = document.querySelector("#menu2");
          document.addEventListener("click", this.foo);
          document.addEventListener("wheel", this.foo);
          document.addEventListener("mouseup", this.foo);
          menu1.style.display = "block";
          menu1.style.left = MouseEvent.pageX + 20 + "px";
          menu1.style.top = MouseEvent.pageY - 8 + "px";
        } else {
          this.deletePitchOn = false;
          this.menuVisible = true;
          this.copydata = Node.label;
          this.menuVisible = false;
          this.menuVisible = true;
          var menu = document.querySelector("#menu");
          document.addEventListener("click", this.foo);
          document.addEventListener("wheel", this.foo);
          document.addEventListener("mouseup", this.foo);
          // document.addEventListener("mouseover", this.foo);
          menu.style.display = "block";
          menu.style.left = MouseEvent.pageX + 20 + "px";
          menu.style.top = MouseEvent.pageY - 8 + "px";
        }
      }
    },
    foo() {
      this.menuVisible = false;
      this.deletePitchOn = false;
      document.removeEventListener("click", this.foo); //关闭事件监听
      document.removeEventListener("wheel", this.foo);
      document.addEventListener("mouseup", this.foo);
      // document.removeEventListener("mouseover", this.foo);
    },
    // 删除选中的贴源层字段信息
    deletePitchOn1() {
      this.$confirm('确认要删除已选中的表吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((result) => {
        // functionAll.DeletePitchOnDataStoreReg({
        //   file_id: this.CheckedNodes
        // }).then(res => {
        //   if (res.success) {
        //     this.getTreeData();
        //     this.$Msg.customizTitle("删除成功", "success");
        //   }
        // })
      });
    },
    // 复制代码
    copydatas() {
      let tableName = this.copydata;
      let oInput = document.createElement("input");
      oInput.value = tableName;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.remove();
    },
    //表数据实现分页功能
    handleCurrentChangeList(currPage) {
      //把val赋给当前页面
      this.currPage = currPage;
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    // 选择表单选
    handleSelectionChange(row) {
      if (row) {
        this.selectRow = row;
      }
    },
    // 选择列触发事件
    handleSelectionColumn(row) {
      this.tablecolumn.forEach((item) => {
        item["selectionstate"] = false;
      });
      row.forEach((itme) => {
        itme["selectionstate"] = true;
      });
    },
    chooseone(row) {
      this.radio = row.classify_id;
    },
    changeTextareaQuerySql(val) {
      this.$set(this.basicInfoForm, "sqlMain", val);
    },
    changeTextareaAfterSql(val) {
      this.$set(this.afterJobForm, "sqlMain", val);
    },
    changeTextareaPreSql(val) {
      this.$set(this.preJobForm, "sqlMain", val);
    },
    formaterSql(val) {
      // let dom = this.$refs.sqleditor
      // dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()))
      this.$refs.sqleditormain.sqlFormatter();
    },
    addSql() {
      // 提示信息
      let sql =
          "select " +
          this.formInline.selectColumns +
          " from " +
          this.formInline.table_name +
          " T1 ";
      if (this.relationNums.length !== 0) {
        for (let i = 0; i < this.relationNums.length; i++) {
          if (this.formInline["onCondition" + i] === undefined && this.formInline["onCondition" + i] === "") {
            this.$Msg.customizTitle("请输入ON条件", "warning");
            return;
          }
          if (this.formInline["joinCondition" + i] === undefined && this.formInline["joinCondition" + i] === "") {
            this.$Msg.customizTitle("请选择JOIN条件", "warning");
            return;
          }
          sql = sql + this.formInline["joinCondition" + i] + " " + this.formInline["tableName" + i] + " T" + (i + 2) + " ON " + this.formInline["onCondition" + i];
        }
        if (this.formInline.whereColumns !== undefined && this.formInline.whereColumns !== "") {
          sql = sql + " where " + this.formInline.whereColumns;
        }
      } else if (this.formInline.groupColumns !== undefined && this.formInline.groupColumns !== "") {
        sql = sql + " group by " + this.formInline.groupColumns;
      }
      // 通过 DOM API 更新文本
      this.$refs.sqleditormain.setmVal(sql);
      this.selectTableVisible = false;
      this.selectTableCreateVisible = false;
      this.formInline = {};
    },
    // 添加关联表
    addRelationTable() {
      this.relationNums.push({});
    },
    // 删除关联表
    deleteRelation(index) {
      this.relationNums.splice(index, 1);
      this.formInline["joinCondition" + index] = "";
      this.formInline["onCondition" + index] = "";
      if (this.formInline.selectColumns.length !== 0) {
        let columns = this.formInline.selectColumns.split(",");
        for (let i = 0; i < columns.length; i++) {
          let arr = columns[i].split(".");
          if (arr[0] === "T" + this.relationIndex) {
            let indexof = columns.indexOf(columns[i]);
            if (indexof !== -1) {
              columns.splice(indexof, 1);
            }
          }
        }
        this.formInline.selectColumns = columns.join(",");
      }
    },
    // 节点搜索
    filterNode(value, data) {
      // 如果检索内容为空,直接返回
      if (!value) return true;
      // 如果传入的value和data中的name相同说明是匹配到了,匹配时转小写匹配
      // 检索内容为 original_name table_name hyren_name
      if ("undefined" !== typeof data.file_id && data.file_id !== "") {
        return (("undefined" !== typeof data.original_name && data.original_name !== "" && data.original_name.indexOf(value) !== -1) || ("undefined" !== typeof data.table_name && data.table_name !== "" && data.table_name.toLowerCase().indexOf(value.toLowerCase()) !== -1) || ("undefined" !== typeof data.hyren_name && data.hyren_name !== "" && data.hyren_name.toLowerCase().indexOf(value.toLowerCase()) !== -1));
      }
    },
    // 查询加工历史信息
    SQLhistoryWay() {
      if (this.ruleForm.datatable_en_name) {
        this.getHistorySql(this.ruleForm.datatable_en_name)
        this.SQLhistory = true;
      } else {
        this.$Msg.customizTitle("请先输入表名", "warning");
      }
    },
    // 选择表
    getTableTreeData(index) {
      this.relationIndex = index + 2;
      this.selectTableVisible = true;
      this.getTreeData();
    },
    // 确认
    addTable() {
      let selectColumns = "";
      if (this.relationIndex === 1) {
        // 选择表
        this.formInline.table_name = this.selectRow.hyren_name;
        this.selectColumns1 = "";
        for (let i = 0; i < this.tablecolumn.length; i++) {
          if (this.tablecolumn[i].selectionstate === true) {
            selectColumns += "T1." + this.tablecolumn[i].column_name + ",";
          }
        }
        this.selectColumns1 = selectColumns.substr(0, selectColumns.length - 1);
      } else {
        // 选择关联表
        this.formInline["tableName" + (this.relationIndex - 2)] = this.selectRow.hyren_name;
        for (let i = 0; i < this.tablecolumn.length; i++) {
          if (this.tablecolumn[i].selectionstate === true) {
            selectColumns += "T" + this.relationIndex + "." + this.tablecolumn[i].column_name + ",";
          }
        }
        // 如果选择列中已经出现当前表的字段，则先删除
        if (this.formInline.selectColumns.length !== 0) {
          let columns = this.formInline.selectColumns.split(",");
          for (let i = 0; i < columns.length; i++) {
            let arr = columns[i].split(".");
            if (arr[0] === "T" + this.relationIndex) {
              let indexof = columns.indexOf(columns[i]);
              if (indexof !== -1) {
                columns.splice(indexof, 1);
              }
            }
          }
          this.formInline.selectColumns = columns.join(",");
        }
        this.reSelectColumns = selectColumns.substr(
            0,
            selectColumns.length - 1
        );
      }
      if (this.reSelectColumns.length === 0) {
        // 选择表
        this.formInline.selectColumns = this.selectColumns1;
      } else {
        // 选择关联表
        if (this.formInline.selectColumns.length !== 0) {
          this.formInline.selectColumns = this.formInline.selectColumns + "," + this.reSelectColumns;
        } else {
          this.formInline.selectColumns = this.reSelectColumns;
        }
      }
      this.selectTableVisible = false;
      this.tableData = [];
      this.$refs.multipleTable.clearSelection();
    },
    settingRule(index) {
      this.setRow = this.columnbysql[index];
      this.$executeRequest.execPostByModulName("/market/getSparkSqlGram").then((res) => {
        if (res && res.success) {
          this.tableDatalist = res.data;
          this.activeName = this.tableDatalist.classify[0];
          this.ruleDialog = true;
        }
      })
    },
    saveSetRule() {
      this.setRow["process_mapping"] = this.ruleStr;
      this.columnbysql.slice(this.setRow, 1);
      this.ruleDialog = false;
    },
    handleClick(row) {
      this.selectColumn["process_mapping"] = row.value;
      this.isShowColumns = false;
    },
    showTableColumns(row) {
      this.getFromColumnList()
      this.selectColumn = row;
      this.isShowColumns = true;
    },
    // 接受页面跳转数据
    repJodData() {
      this.params = JSON.parse(sessionStorage.getItem("params"));
      this.dsl_id = this.params.dsl_id;
      this.datatable_id = this.params.datatable_id;  //新增时这个是空的
      this.sourceDataTable_id = this.params.sourceDataTable_id;
      //this.data_mart_id = this.params.dsl_id;
      this.category_id = this.params.category_id;
      this.data_mart_id = this.params.data_mart_id;
      this.ruleForm.module_table_default_name = this.params.module_table_default_name;
      //this.id = this.params.id;  //这个跳转新增时跳转未体现是什么
      this.task_id = this.params.task_id;
      this.ruleForm.step_number = this.params.step_number;
      this.is_change_temp = false;
      if (this.params.is_temp != null) { //编辑时进入
        this.ruleForm.is_temp = this.params.is_temp;
      }
      if (this.datatable_id != null) {
        // 编辑查询当前作业步骤表信息
        this.jobtab_id = this.params.job_table_id;
        let sql = this.params.job_table_view_sql;
        this.$nextTick(() => {
          // 通过 DOM API 更新文本
          this.$refs.sqleditormain.setmVal(sql);
        });
        this.ruleForm.module_table_en_name = this.params.job_table_en_name;
        this.ruleForm.module_table_cn_name = this.params.job_table_cn_name;
        if (this.params.is_temp === '1') {
          let temp = this.params.job_table_en_name.replace(this.ruleForm.module_table_default_name + "_temp_", "");
          this.ruleForm.module_table_en_name = temp;
        }
        //this.getJobStepTableDataById();
      } else {
        this.getJobDataInfoById();
      }
    },
    // 获取作业步骤表数据信息
    getJobStepTableDataById() {
      //作业相关表信息跳转携带，字段信息查询下
      this.$executeRequest.execGetByModulName("/market/dmJobTableInfo/findDmTaskDataTableByTaskId",
          {job_table_id: this.jobtab_id}).then((res) => {
        if (res && res.success) {
          if (this.is_change_temp) {
            // 说明页面手动切换是否临时表
            if (res.data.jobtab_is_temp === this.ruleForm.is_temp) {
              // 手动切换回显成编辑时的数据回显
              this.ruleForm.is_temp = res.data.jobtab_is_temp;
              this.ruleForm.step_number = res.data.jobtab_step_number;
              this.ruleForm.module_table_en_name = res.data.jobtab_en_name;
              this.ruleForm.module_table_cn_name = res.data.jobtab_cn_name;
              this.$refs.sqleditormain.setmVal(res.data.jobtab_view_sql)
              this.basicInfoForm.sqlMain = res.data.jobtab_view_sql;
            } else {
              // 手动切换清空非编辑数据
              //this.ruleForm.step_number = null;
              this.ruleForm.module_table_en_name = "";
              this.ruleForm.module_table_cn_name = "";
              if (this.ruleForm.is_temp === this.isFlag.Shi) {
                // 临时表
                // this.columnbysql = [];
                // this.$refs.sqleditormain.setmVal("");
                // this.basicInfoForm.sqlMain = "";
                this.getColumnBySql()
              } else {
                this.$refs.sqleditormain.setmVal(res.data.view_sql)
                this.basicInfoForm.sqlMain = res.data.view_sql;
              }
            }
          } else {
            // 数据回显
            this.ruleForm.is_temp = "0";
            this.ruleForm.step_number = res.data.jobtab_step_number;
            this.ruleForm.module_table_en_name = res.data.jobtab_en_name;
            this.ruleForm.module_table_cn_name = res.data.jobtab_cn_name;
          }
        }
      });
    },
    // 获取作业与模型表信息
    getJobDataInfoById() {
      this.ruleForm['is_temp'] = '0'; // 这里确认已经不是临时表
      this.$executeRequest.execGetByModulName("/market/getJobDataInfoById", {
        task_id: this.params.task_id,
        datatable_id: this.params.sourceDataTable_id
      }).then((res) => {
        if (res && res.success) {
          this.ruleForm.task_number = res.data.task_number;
          this.ruleForm.module_table_en_name = res.data.module_table_en_name;
          this.ruleForm.module_table_cn_name = res.data.module_table_cn_name;
          this.ruleForm.task_name = res.data.task_name;
          // this.columnbysql = []
          this.$executeRequest.execGetByModulName("/market/moduleTableField/findModuleTableFieldInfos", {dataTableId: this.params.sourceDataTable_id})
              .then((res) => {
                if (res && res.success) {
                  this.columnbysql = res.data;
                  for (let i = 0; i < this.columnbysql.length; i++) {
                    this.columnbysql[i].field_process = this.allfield_process[2].code
                  }
                }
              });
          if (res.data.module_table_en_name && this.ruleForm.is_temp === this.isFlag.Fou) {
            if (this.params.task_id) {
              let params = {
                jobtab_id: this.jobtab_id,
              };
              this.$executeRequest.execGetByModulName("/market/getQuerySql", params).then((res) => {
                if (res && res.success) {
                  let sql = this.$Secret.Decrypt(res.data);
                  // // 通过 DOM API 更新文本
                  this.$refs.sqleditormain.setmVal(sql);
                  this.basicInfoForm.sqlMain = sql;
                }
              });

            }
          } else {
            // 通过 DOM API 更新文本
            this.$refs.sqleditormain.setmVal("");
            this.basicInfoForm.sqlMain = "";
          }

        }
      });
    },
    //临时表名称校验,不能出现同一张模型表下的作业有两个同名临时表
    checkTabName() {
      let param = {
        tableName: this.ruleForm.module_table_en_name,
        moduleTableId: this.sourceDataTable_id
      };
      this.$executeRequest.execGetByModulName("/market/dmJobTableInfo/checkTableName", param).then((res) => {
        if (!res.success) {
          this.$Msg.customizTitle(res.message, "warning");
          this.ruleForm.module_table_en_name = ""
        }
      })
    }
  },
  // destroyed() {
  //   // 清空数据
  //   if (this.$route.path !== "/processingManagement" && this.$route.path !== "/addJob" && this.$route.path !== "/tempTable") {
  //     sessionStorage.clear();
  //   }
  // },

};
</script>

<style scoped>
.textasql >>> .CodeMirror {
  height: 400px !important;
  /* width:200px !important; */
}

/* 按钮样式 */
.elButton {
  float: right;
  margin-bottom: 10px;
}

.borderStyle {
  border: 1px solid #e6e6e6;
  padding: 1%;
}

.partFour {
  margin-top: 10px;
}

.rightbtn {
  margin-top: 12px;
  float: right;
  margin: 10px;
  margin-bottom: 10px;
}

.el-button1 {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  /* padding: 12px 20px; */
  font-size: 14px;
  border-radius: 4px;
}

/*滚动条样式*/

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(193, 193, 193);
  background: rgba(193, 193, 193);
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(241, 241, 241);
  border-radius: 0;
  background: rgb(241, 241, 241);
}

/* 提示信息样式 */
#addMartable2 .tooltipHelp {
  padding: 0 4px !important;
}

.fieldDesc >>> el-input {
  width: 80% !important;
}

.menu {
  display: inline-block;
  text-align: center;
  height: 20px;
  line-height: 20px;
  width: 80px;
  left: 0px;
  top: 0px;
  font-size: 14px;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  z-index: 100;
  cursor: pointer;
}
</style>
