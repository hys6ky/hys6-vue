<template>
  <div>
    <div class="d-flex justify-content-between">
      <ByHeaderSlice title="配置Sql" />
      <div>
        <el-button type="primary" size="medium" @click="toDbmFkInfoTab">表外键关联</el-button>
        <el-button type="primary" @click="selectTableCreateVisible = true">
          选择表创建
        </el-button>
      </div>
    </div>
    <div class="main mt-10 d-flex">
      <ByTree :data="treeData" class="h100" :defaultProps="treeProps" type="configStep2" @detail="showtablecolumnPre"
        @rightClick="rightClick" />
      <div class="flex-1 p5 d-flex flex-column">
        <el-row>
          <el-col :span="8">
            <ByContainerTitle title="SQL查询" style="height: 28px; line-height: 28px" />
          </el-col>
          <el-col :span="16">
            <el-input v-model="sqlparameter" size="mini"
              placeholder="SQL中使用#{}进行替换，例如#{abc};参数处填写abc=123,多个参数时,中间用分号;隔开"></el-input>
          </el-col>
        </el-row>
        <div class="pt-5 box-sizing" style="height: calc(100% - 28px)">
          <div class="sqlToolBar">
            <el-tooltip content="查询" :enterable="false" placement="top">
              <i class="el-icon-search" @click="getdatabysql()"></i>
            </el-tooltip>
            <el-tooltip content="确定" :enterable="false" placement="top">
              <i class="el-icon-s-management" @click="getcolumnbysql" v-if="!iflock"></i>
            </el-tooltip>
            <el-tooltip content="格式化SQL" :enterable="false" placement="top">
              <i class="el-icon-magic-stick" @click="formaterSql"></i>
            </el-tooltip>
          </div>
          <SqlEditor ref="sqleditor" :value.sync="sqlMain" @changeTextarea="changeTextarea($event)" @editing="editing"
            style="height: calc(100% - 21px)" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-10">
      <div>
        <el-button type="primary" v-show="ifRelationDatabase" @click="showprejob">
          前置作业
        </el-button>
        <el-button type="primary" @click="showafterjob">后置作业</el-button>
      </div>
      <div class="d-flex">
        <el-button type="primary" @click="addcolumn" v-if="!iflock">
          新增字段
        </el-button>
        <div class="ml-10" v-if="ifhbase">
          <el-input v-model="pre_partition" prop="pre_partition" placeholder="请输入预分区键，如 a,b,c 或者是预分区数，如 10" clearable
            size="small" style="width: 500px">
          </el-input>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <ByFormTable :formData="formTableData" :columnArr="sqlColumnArr" @operateItem="operateItem">
        <template v-slot:process_mapping="sc">
          <div v-if="sc.row.field_process === '3'">
            <el-input v-model="sc.row[sc.i.prop]" readonly size="small" style="margin-top: 5px">
              <el-button slot="append" @click="showTableColumns(sc.row)">
                列选择
              </el-button>
            </el-input>
          </div>
          <div v-else-if="sc.row.field_process === '4'">
            <el-input v-model="sc.row[sc.i.prop]" size="small" :clearable="true" placeholder="映射规则"
              style="margin-top: 5px">
              <el-button slot="append" @click="settingRule(sc.$index)">设置</el-button>
            </el-input>
          </div>
          <div v-else-if="sc.row.field_process === '5'">
            <el-input v-model="sc.row[sc.i.prop]" readonly size="small" style="width: 50%; margin-top: 5px">
              <el-button slot="append" @click="showTableColumns(sc.row)">
                列选择
              </el-button>
            </el-input>
            <el-input v-model="sc.row.group_mapping" autocomplete="off" placeholder="分组映射填写" size="small"
              style="width: 50%"></el-input>
          </div>
          <div v-else>
            <el-input v-model="sc.row[sc.i.prop]" size="small" autocomplete="off" placeholder="处理方式参数">
            </el-input>
          </div>
        </template>
        <template v-slot:field_length="sc">
          <div class="d-flex align-items-center">
            <el-input v-model="sc.row[sc.i.prop]" placeholder="长度" size="small" :disabled="iflock ||
              sc.row.field_process === '2' ||
              sc.row.field_type == 'int'
              ">
            </el-input>
            <el-tooltip v-if="sc.row.field_type == 'NUMERIC' || sc.row.field_type == 'numeric'
              " class="tooltipHelp" effect="dark" placement="top">
              <div slot="content">
                　　说明: NUMERIC [ ( precision [ , scale ] ) ] ,写法如 :
                15,3<br />
                　　 precision 一个在 1 到 127 范围内（含 1 和
                127）的整数表达式，指定表达式中的位数。缺省设置为 30。<br />
                　　 scale 一个在 0 到 127 范围内（含 1 和
                127）的整数表达式，指定小数点后的位数。小数位数值应始终小于或等于精度值。缺省设置为
                6。 <br />
              </div>
              <i class="el-icon-question" aria-hidden="true"></i>
            </el-tooltip>
          </div>
        </template>
      </ByFormTable>
    </div>
    <div class="mt-10 d-flex justify-content-between pb-20">
      <el-button type="primary" @click="previous">上一步</el-button>
      <el-button type="primary" @click="prenext">下一步</el-button>
    </div>
    <ByModel :visible.sync="databysqlVisible" modelTitle="查询数据" modelWidth="800px" @close="databysqlVisible = false"
      @closed="databysqlClosed">
      <ByTable :tableData="databysql" :columnArr="databyColumnArr"></ByTable>
      <template slot="modalFoot">
        <el-button type="primary" @click="
          databysqlVisible = false;
        getcolumnbysql();
        ">
          确定
        </el-button>
        <el-button type="danger" @click="databysqlVisible = false">
          关闭
        </el-button>
      </template>
    </ByModel>
    <ByModel :visible.sync="columnVisible" modelTitle="字段列表" modelWidth="800px" @close="columnVisible = false">
      <ByTable :tableData="columnData" :columnArr="columnTableArr" @handleFilter="handleFilter"
        @operateItem="operateItemColumn"></ByTable>
      <template slot="modalFoot">
        <el-button type="danger" @click="columnVisible = false">
          关闭
        </el-button>
      </template>
    </ByModel>
    <ByModel :visible.sync="iftablecolumn" modelTitle="表字段" modelWidth="1100px" @close="iftablecolumn = false">
      <ByTable :tableData="tablecolumn" :columnArr="tablecolumnArr" @handleMultiple="handleSelectionColumn"></ByTable>
      <template slot="modalFoot">
        <el-button type="primary" @click="changesql" v-if="tablecolumnType === 0">
          确定
        </el-button>
        <el-button type="primary" v-else @click="changesql1"> 确定 </el-button>
        <el-button type="danger" @click="iftablecolumn = false">
          取消
        </el-button>
      </template>
    </ByModel>
    <!-- 复制小提示框 -->
    <span v-show="menuVisible" id="menu" class="menu" @mouseleave="foo" @click="copydatas">
      复制表名
    </span>
    <!-- 前置作业 -->
    <ByModel :visible.sync="ifprejob" modelTitle="前置作业" modelWidth="800px" @close="cancelprejob">
      <span>
        只能修改本集市表的数据(Update、Delete、Insert),多个SQL用;;隔开
        表名为：{{ tablename }}
      </span>
      <div class="sqlBox mt-5">
        <SqlEditor ref="sqleditorpre" :value.sync="sqlMainpre" @changeTextarea="changeTextareaPre($event)"
          @editing="editingpre" style="height: 300px" />
      </div>
      <template slot="modalFoot">
        <el-button @click="cancelprejob"> 取消 </el-button>
        <el-button type="primary" @click="savePreJob"> 确定 </el-button>
      </template>
    </ByModel>
    <!-- 后置作业 -->
    <ByModel :visible.sync="ifafterjob" modelTitle="后置作业" modelWidth="800px" @close="cancelafterjob">
      <span>
        只能修改本集市表的数据(Update、Delete、Insert),多个SQL用;;隔开
        表名为：{{ tablename }}
      </span>
      <div class="sqlBox mt-5">
        <SqlEditor ref="sqleditorafter" :value.sync="sqlMainafter" @changeTextarea="changeTextareaAfter($event)"
          @editing="editingafter" style="height: 300px" />
      </div>
      <template slot="modalFoot">
        <el-button @click="cancelafterjob"> 取消 </el-button>
        <el-button type="primary" @click="saveAfterJob"> 确定 </el-button>
      </template>
    </ByModel>
    <!-- 选择表创建 -->
    <ByModel :visible.sync="selectTableCreateVisible" modelTitle="选择表创建" modelWidth="1200px"
      @close="selectTableCreateVisible = false" @closed="selectTableCreateClosed">
      <ByModelForm :formData="selectTableCreateFormData" :formItems="selectTableCreateFormItems"
        :formConfig="selectTableCreateConfig">
        <el-button slot="table_nameSlot" @click="getTableTreeData(-1)">
          选择表
        </el-button>
        <div slot="addRelationTableSlot" style="margin-left: -100px" class="formSlot">
          <span>T1</span>
          <el-button type="primary" @click="relationNums.push({})">
            添加关联表
          </el-button>
        </div>
        <div slot="relationNumsSlot">
          <div v-for="(item, index) in relationNums" :key="index" class="d-flex">
            <el-form-item label="JOIN 条件">
              <el-select v-model="selectTableCreateFormData['joinCondition' + index]" placeholder="请选择join条件"
                style="width: 160px">
                <el-option label="LEFT JOIN" value="LEFT JOIN" />
                <el-option label="RIGHT JOIN" value="RIGHT JOIN" />
                <el-option label="FULL JOIN" value="FULL JOIN" />
                <el-option label="INNER JOIN" value="INNER JOIN" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联表" label-width="70px" class="formWrap">
              <el-input v-model="selectTableCreateFormData['tableName' + index]" placeholder="关联表表名称"
                style="width: 350px">
                <el-button slot="append" @click="getTableTreeData(index)">
                  选择表
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item :label="`T${index + 2}`" label-width="40px"></el-form-item>
            <el-form-item label="ON" label-width="50px" class="formWrap">
              <el-input type="textarea" v-model="selectTableCreateFormData['onCondition' + index]" placeholder="关联条件" />
            </el-form-item>
            <el-form-item label-width="10px">
              <el-button type="danger" @click="deleteRelation(index)" size="medium">
                删除
              </el-button>
            </el-form-item>
          </div>
        </div>
      </ByModelForm>
      <template slot="modalFoot">
        <el-button @click="selectTableCreateVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="addSql"> 确定 </el-button>
      </template>
    </ByModel>
    <el-dialog title="函数速查表" :visible.sync="ruleDialog" width="80%" top="3%">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tableDatalist.classify" :key="item" :label="item" :name="item">
          <el-table stripe :data="tableDatalist[item].filter(
            (data) =>
              !search ||
              data.function_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              data.function_example
                .toLowerCase()
                .includes(search.toLowerCase())
          )
            " size="medium" height="400">
            <el-table-column prop="function_name" label="函数名" show-overflow-tooltip align="left"
              min-width="30px;"></el-table-column>
            <el-table-column prop="function_example" label="例子" align="left" show-overflow-tooltip
              min-width="60px;"></el-table-column>
            <el-table-column prop="function_desc" label="描述" align="left" show-overflow-tooltip>
              <template slot="header" slot-scope="scope">
                <i>描述</i>
                <span style="float: right"><el-input v-model="search" size="mini" :key="scope.row"
                    placeholder="输入函数名或者列子进行搜索" /></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <code>规则设置(请填写处理函数,如果使用跑批日期则填写:#{txdate}(跑批日期),#{txdate_pre}(跑批日期
          - 1),#{txdate_next}(跑批日期 + 1))</code>
      <el-input v-model="ruleStr" type="textarea"></el-input>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="saveSetRule">确定
        </el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="ruleDialog = false">取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 选择表 -->
    <ByModel modelTitle="选择表" modelWidth="1200px" :visible.sync="selectTableVisible" @close="selectTableVisible = false"
      @closed="selectTableClosed">
      <div class="d-flex">
        <ByTree :data="treeData" class="h100" :defaultProps="treeProps" type="configStep2" @logDetail="handleNodeClick"
          @detail="handleNodeClick" style="padding-top: 0" />
        <div class="flex-1">
          <ByTable :tableData="tableDataShow" :columnArr="selectTablecolumnArr" :pagination="selectTablePagination"
            @currentChange="selectTabelCurrentChange" @sizeChange="selectTabelSizeChange"
            @operateItem="selectTableOperate" @selectionChange="selectTableSelectionChange" />
        </div>
      </div>
      <template slot="modalFoot">
        <el-button @click="selectTableVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="addTable"> 确定 </el-button>
      </template>
    </ByModel>
    <ByModel modelTitle="Hbase的Rowkey排序" :visible.sync="ifhbasesort" width="660px" @close="ifhbasesort = false">
      <ByFormTable :columnArr="hbasesortColumnArr" :formData="hbasesort" @operateItem="hbasesortOperate" />
      <template slot="modalFoot">
        <el-button @click="ifhbasesort = false"> 取消 </el-button>
        <el-button type="primary" @click="next"> 确定 </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import { getFlatArr, parseSimpleTreeData } from "@/utils/datahandler.js";
import SqlEditor from "./SqlEditor.vue";
import sqlFormatter from "sql-formatter";
import {
  sqlColumnArr,
  databyColumnArr,
  columnTableArr,
  tablecolumnArr,
  selectTableCreateFormItems,
  selectTableCreateConfig,
  selectTablecolumnArr,
  hbasesortColumnArr,
} from "../mock";
export default {
  data() {
    return {
      search: "",
      ruleStr: "",
      ruleDialog: false,
      setRow: {},
      tableDatalist: {},
      columnbysql: [],
      treeData: [],
      treeProps: {
        children: "children",
        label: "showLable",
      },
      iflock: false,
      sqlparameter: "",
      sqlMain: "",
      formTableData: {
        tableData: [],
      },
      sqlColumnArr: JSON.parse(JSON.stringify(sqlColumnArr)),
      columnmore: [],
      allfield_type: [],
      allfield_process: [],
      data_mart_id: this.$route.query.data_mart_id,
      operation: this.$route.query.operation,//新增or编辑
      // is_add: this.$route.query.is_add,
      datatable_id: this.$route.query.datatable_id,
      ifrepeat: this.$route.query.ifrepeat,
      //查询sql弹窗
      databysqlVisible: false,
      databysql: [],
      databyColumnArr: JSON.parse(JSON.stringify(databyColumnArr)),
      //列查询弹窗
      columnVisible: false,
      columnData: [],
      selectColumn: {}, //当前选择列
      columnTableArr,
      columnDataInit: [],
      //前置作业按钮是否显示
      ifRelationDatabase: false,
      //左侧树节点点击表字段弹窗
      tablecolumn: [],
      tablecolumnType: 0, //0:左侧树点击 1:选择字段弹窗点击
      sqltablename: "",
      iftablecolumn: false,
      tablecolumnArr,
      //---------节点复制小tip------------
      copydata: "", //节点复制字段
      menuVisible: false,
      //----------前置作业&后置作业---------
      ifprejob: false,
      ifafterjob: false,
      tablename: "",
      sqlMainpre: "",
      sqlMainafter: "",
      activeName: "",
      //--------选择表创建------------
      selectTableCreateVisible: false,
      selectTableCreateFormItems,
      selectTableCreateFormData: {
        selectColumns: "",
        table_name: "",
        relationNums: [],
        whereColumns: "",
        groupByColumns: "",
      },
      selectTableCreateConfig,
      relationNums: [],
      relationIndex: 1,
      selectTableVisible: false,
      tableData: [],
      tableDataShow: [],
      selectTablecolumnArr,
      selectTablePagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      selectSqlArr: [],
      //------Hbase的Rowkey排序弹窗--------
      ifhbasesort: false,
      // hbasesort: {
      hbasesort: [],
      // },
      //弹窗表格
      ifhbase: false,
      pre_partition: "",
      checkColumnData: ["varchar", "varchar2", "text", "char", "string"],
      hbasesortColumnArr,
    };
  },
  components: {
    SqlEditor,
  },
  computed: {
    sqlTableData() {
      return JSON.parse(JSON.stringify(this.formTableData.tableData));
    },
  },
  watch: {
    sqlTableData: {
      handler(val, oldVal) {
        const findItem = val.find((item) => item.field_process === "2");
        if (findItem) {
          this.sqlColumnArr.map((item) => {
            if (item.prop === "field_type" || item.prop === "field_length") {
              item.disabled = true;
            }
          });
        } else {
          this.sqlColumnArr.map((item) => {
            if (item.prop === "field_type" || item.prop === "field_length") {
              item.disabled = false;
            }
          });
        }
      },
      deep: true,
    },
    tableData: {
      handler(val) {
        let arr = JSON.parse(
          JSON.stringify(
            val.slice(
              (this.selectTablePagination.pageNum - 1) *
              this.selectTablePagination.pageSize,
              this.selectTablePagination.pageNum *
              this.selectTablePagination.pageSize
            )
          )
        );
        arr.map((item) => {
          item.checked = false;
        });
        this.tableDataShow = arr;
      },
      deep: true,
    },
  },
  created() {
    this.gettreeData();
    this.getcolumnmore(); //表格更多列
    this.getallfield_type(); //获取处理方式
    this.getallfield_process(); //获取字段类型
    this.getTable(this.datatable_id); //获取表格
    this.getfromcolumnlist(this.datatable_id); //获取列选择表格
    this.getifhbase(); //获取是否是hbase
  },
  mounted() {
    this.checkifrepeat();
    this.getquerysql();
    this.getifrelationdatabase2();
    this.gettablename();
  },
  methods: {
    settingRule(index) {
      this.setRow = this.columnbysql[index];
      this.$executeRequest.execGetByModulName("/market/getSparkSqlGram")
        .then((res) => {
          this.tableDatalist = res.data;
          this.activeName = this.tableDatalist.classify[0];
          this.ruleDialog = true;
        });
    },
    saveSetRule() {
      this.setRow = {};
      this.setRow["process_mapping"] = this.ruleStr;
      this.columnbysql.slice(this.setRow, 1);
      this.ruleDialog = false;
    },
    checkifrepeat() {
      if (this.ifrepeat == "true" || this.ifrepeat == true) {
        this.$executeRequest.execGetByModulName("/market/getTableIdFromSameNameTableId", {
          datatable_id: this.datatable_id,
        })
          .then((res) => {
            let tmpdatatable_id = res.data[0].datatable_id;
            this.getTable(tmpdatatable_id);
            this.getfromcolumnlist(tmpdatatable_id);
            this.iflock = true;
            this.sqlColumnArr.map((item) => {
              if (
                item.type === "input" ||
                item.type === "select" ||
                item.type === "check"
              ) {
                item.disabled = true;
              }
            });
            this.sqlColumnArr.pop();
          });
      }
    },
    //点击左侧树的节点
    showtablecolumnPre(data) {
      this.tablecolumnType = 0;
      this.showtablecolumn(data);
    },
    showtablecolumn(data) {
      if ("undefined" !== typeof data.file_id && data.file_id != "") {
        this.$executeRequest.execGetByModulName("/market/queryAllColumnOnTableName", {
          source: data.data_layer,
          id: data.file_id,
        })
          .then((res) => {
            if (res && res.success && res.data.column_info_list.length > 0) {
              const list = res.data.column_info_list;
              list.map((item) => {
                if (item.data_type === "numeric") {
                  item.data_len = item.data_len + "," + item.decimal_point;
                }
              });
              this.tablecolumn = list;
              this.sqltablename = res.data.hyren_name;
              this.iftablecolumn = true;
            }
          });
      }
    },
    //左侧树节点点击表字段弹窗 表格勾选
    handleSelectionColumn(row) {
      row.forEach((itme) => {
        itme["selectionstate"] = true;
      });
    },
    //左侧树节点点击表字段弹窗 确定
    changesql() {
      let sql = "select ";
      for (let i = 0; i < this.tablecolumn.length; i++) {
        if (this.tablecolumn[i].selectionstate == true) {
          sql += this.tablecolumn[i].column_name + ",";
        }
      }
      sql = sql.substr(0, sql.length - 1);
      sql += " from " + this.sqltablename;
      this.sqlMain = sql;
      let dom = this.$refs.sqleditor;
      dom.editor.setValue(sql);
      dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
      this.iftablecolumn = false;
    },
    changesql1() {
      this.selectSqlArr = [];
      this.tablecolumn.map((item) => {
        if (item.selectionstate == true) {
          const obj = {
            str: `T${this.relationIndex}.${item.column_name}`,
            index: this.relationIndex,
          };
          this.selectSqlArr.push(obj);
        }
      });
      this.iftablecolumn = false;
    },
    //左侧树节点复制
    rightClick(MouseEvent, data) {
      if (data.file_id.length > 0) {
        this.copydata = data.label;
        this.menuVisible = false;
        this.menuVisible = true;
        var menu = document.querySelector("#menu");
        document.addEventListener("click", this.foo);
        menu.style.display = "block";
        menu.style.left = MouseEvent.pageX + 20 + "px";
        menu.style.top = MouseEvent.pageY - 8 + "px";
      } else {
        return false;
      }
    },
    foo() {
      this.menuVisible = false;
      document.removeEventListener("click", this.foo); //关闭事件监听
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
    //获取sql树
    gettreeData() {
      this.$executeRequest.execGetByModulName("/market/getTreeDataInfo")
        .then((res) => {
          const list = getFlatArr(res.data);
          list.map((item) => {
            item.type = "text";
            if (item.file_id) {
              delete item.children;
              if (item.original_name) {
                item.label = item.original_name;
                item.labelText = item.original_name;
                item.showLable = item.original_name;
              } else if (item.original_name === "" && item.table_name !== "") {
                item.label = item.table_name;
                item.labelText = item.table_name;
                item.showLable = item.table_name;
              } else {
                item.label = item.hyren_name;
                item.labelText = item.hyren_name;
                item.showLable = item.hyren_name;
              }
            } else {
              item.labelText = item.label;
              item.showLable = item.label;
              item.expanded = false;
              item.children = [];
            }
          });
          this.treeData = parseSimpleTreeData(list, "id", "parent_id");
        });
    },
    //获取sql
    getquerysql() {
      let params = {
        datatable_id: this.datatable_id,
      };
      this.$executeRequest.execGetByModulName("/market/getQuerySql", params)
        .then((res) => {
          const formatter = sqlFormatter.format(this.$Secret.Decrypt(res.data));
          let dom = this.$refs.sqleditor;
          dom.editor.setValue(formatter);
          this.sqlMain = formatter;
        });
    },
    //改变sql内容
    changeTextarea(val) {
      this.sqlMain = val;
    },
    editing(val) {
      this.sqlMain = val;
    },
    //格式化sql
    formaterSql() {
      let dom = this.$refs.sqleditor;
      dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
    },
    // 查询sql
    getdatabysql() {
      const sqlMainCopy = JSON.parse(JSON.stringify(this.sqlMain));
      if (sqlMainCopy === "") {
        this.$Msg.customizTitle("查询sql不能为空!", "warning");
      } else {
        let param = new FormData();
        param.append("querysql", this.$Secret.Encrypt(sqlMainCopy));
        param.append("sqlparameter", this.sqlparameter);
        this.$executeRequest.uploadFile("/H/market/getDataBySQL", param)
          .then((res) => {
            if (res.data.length === 0) {
              this.$Msg.customizTitle("查询结果为空!", "warning");
              return false;
            }
            Object.keys(res.data[0]).forEach((key) => {
              this.databyColumnArr.push({
                prop: key,
                label: key,
                type: "text",
                minWidth: "120",
              });
            });
            this.databysqlVisible = true;
            this.databysql = res.data;
          });
      }
    },
    //确认sql
    getcolumnbysql() {
      const sqlMainCopy = JSON.parse(JSON.stringify(this.sqlMain));
      if (sqlMainCopy === "") {
        this.$Msg.customizTitle("查询sql不能为空!", "warning");
      } else {
        let param = new FormData();
        param.append("querysql", sqlMainCopy);
        param.append("datatable_id", this.datatable_id);
        param.append("sqlparameter", this.sqlparameter);
        this.$executeRequest.uploadModuleFile("/market/getColumnBySql", param)
          .then((res) => {
            if (
              res &&
              res.success &&
              res.data.columnlist.length > 0 &&
              res.data.result.length > 0
            ) {
              this.formTableData.tableData = res.data.result;
              this.columnData = res.data.columnlist;
              this.columnDataInit = JSON.parse(
                JSON.stringify(res.data.columnlist)
              );
              let tmp_field_type = this.formTableData.tableData[0].field_type;
              let flag = true;
              //向allfield_type放入默认选中的类型
              let allfield_type = [];
              this.sqlColumnArr.map((item) => {
                if (item.prop === "field_type") {
                  allfield_type = item.options;
                }
              });
              for (var i = 0; i < allfield_type.length; i++) {
                if (tmp_field_type === allfield_type[i].value) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                allfield_type.push({
                  target_type: tmp_field_type,
                });
              }
            }
          });
        this.getifrelationdatabase();
      }
    },
    getifrelationdatabase() {
      let param = new FormData();
      param.append("datatable_id", this.datatable_id);
      param.append("sql", this.sqlMain);
      this.$executeRequest.uploadModuleFile("/market/getIfRelationDatabase", param)
        .then((res) => {
          if (res && res.success) {
            this.ifRelationDatabase = res.data;
          }
        });
    },
    getifrelationdatabase2() {
      this.$executeRequest.execGetByModulName("/market/getIfRelationDatabase2", {
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          if (res && res.success) {
            this.ifRelationDatabase = res.data;
          }
        });
    },
    //查询sql弹窗关闭
    databysqlClosed() {
      this.databysql = [];
      this.databyColumnArr = JSON.parse(JSON.stringify(databyColumnArr));
    },
    //获取主键等信息
    getcolumnmore() {
      this.$executeRequest.execGetByModulName("/market/getColumnMore", {
        datatable_id: this.datatable_id,
      })
        .then(async (res) => {
          let list = [];
          await Promise.all(
            res.data.map(async (item) => {
              await this.$Code
                .getValue({
                  category: "StoreLayerAdded",
                  code: item.dsla_storelayer,
                })
                .then(async (res) => {
                  item.dsla_storelayer = res.data;
                  let obj = {
                    prop: item.dsla_storelayer,
                    label: item.dsla_storelayer,
                    type: "check",
                    minWidth: 100,
                  };
                  if (this.iflock) {
                    obj.disabled = true;
                  }
                  list.push(obj);
                });
            })
          );
          this.columnmore = list;
          this.sqlColumnArr.splice(7, 0, ...list);
        });
    },
    //获取表格
    getTable(datatable_id) {
      let params = {
        datatable_id,
      };
      this.$executeRequest.execGetByModulName("/market/getColumnFromDatabase", params)
        .then((res) => {
          if (res && res.success) {
            this.formTableData.tableData = res.data;
          }
        });
    },
    //获取处理方式
    getallfield_process() {
      this.$Code
        .getCategoryItems({
          category: "ProcessType",
        })
        .then((res) => {
          let list = [];
          res.data.map((item) => {
            list.push({
              value: item.code,
              label: item.value,
            });
          });
          this.allfield_process = list;
          this.sqlColumnArr.map((item) => {
            if (item.prop === "field_process") {
              item.options = list;
            }
          });
        });
    },
    //获取字段类型
    getallfield_type() {
      this.$executeRequest.execGetByModulName("/market/getAllField_Type", {
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          let list = [];
          res.data.map((item) => {
            list.push({
              value: item.target_type,
              label: item.target_type,
            });
          });
          this.allfield_type = list;
          this.sqlColumnArr.map((item) => {
            if (item.prop === "field_type") {
              item.options = list;
            }
          });
        });
    },
    //表格处理
    operateItem(type, row, index) {
      if (type === "up") {
        this.upcolumn(index, row);
      } else if (type === "down") {
        this.downcolumn(index, row);
      } else if (type === "delete") {
        this.deletecolumn(index, row);
      }
    },
    addcolumn() {
      let param = {
        field_en_name: "",
        field_cn_name: "",
        field_type: this.allfield_type[0].value,
        field_length: "",
        field_process: this.allfield_process[0].value,
        process_para: "",
        field_desc: "",
      };
      this.formTableData.tableData.push(param);
    },
    //上移
    upcolumn(val, data) {
      if (val > 0) {
        let upDate = this.formTableData.tableData[val - 1];
        this.formTableData.tableData.splice(val - 1, 1);
        this.formTableData.tableData.splice(val, 0, upDate);
      } else {
        this.$Msg.customizTitle("已经是第一条，不可上移", "warning");
      }
    },
    //下移
    downcolumn(val, data) {
      if (val + 1 === this.formTableData.tableData.length) {
        this.$Msg.customizTitle("已经是最后一条，不可下移", "warning");
      } else {
        let downDate = this.formTableData.tableData[val + 1];
        this.formTableData.tableData.splice(val + 1, 1);
        this.formTableData.tableData.splice(val, 0, downDate);
      }
    },
    //删除
    deletecolumn(row) {
      this.$Msg.confirmMsg("确定删除吗").then(() => {
        this.formTableData.tableData.splice(row, 1);
      });
    },
    //列选择
    showTableColumns(row) {
      this.selectColumn = row;
      this.columnVisible = true;
    },
    //获取列选择表格
    getfromcolumnlist(datatable_id) {
      let params = {
        datatable_id,
      };
      this.$executeRequest.execGetByModulName("/market/getFromColumnList", params)
        .then((res) => {
          this.columnData = res.data;
          this.columnDataInit = JSON.parse(JSON.stringify(res.data));
        });
    },
    getifhbase() {
      this.$executeRequest.execGetByModulName("/market/getIfHbase", {
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          this.ifhbase = res.data;
        });
    },
    //列选择 弹窗表格筛选
    handleFilter(val) {
      this.columnData = this.columnDataInit.filter((item) => {
        return item.value.toLowerCase().includes(val.toLowerCase());
      });
    },
    //列选择 弹窗表格操作
    operateItemColumn(type, row) {
      if (type === "select") {
        this.selectColumn["process_mapping"] = row.value;
        this.columnVisible = false;
      }
    },
    //---------------------------------------前置作业 & 后置作业----------------------------------------------
    showprejob() {
      this.ifprejob = true;
      this.getpreandafterjob();
    },
    showafterjob() {
      this.ifafterjob = true;
      this.getpreandafterjob();
    },
    cancelprejob() {
      this.sqlMainpre = "";
      this.$refs.sqleditorpre.editor.setValue("");
      this.ifprejob = false;
    },
    cancelafterjob() {
      this.sqlMainafter = "";
      this.$refs.sqleditorafter.editor.setValue("");
      this.ifafterjob = false;
    },
    //获取前置作业后置作业sql
    getpreandafterjob() {
      this.$executeRequest.execGetByModulName("/market/getPreAndAfterJob", {
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          if (res && res.success) {
            if (typeof res.data.post_work != "undefined") {
              this.sqlMainafter = res.data.post_work;
              this.$refs.sqleditorafter.setValue(
                sqlFormatter.format(this.sqlMainafter)
              );
            }
            if (typeof res.data.pre_work != "undefined") {
              this.sqlMainpre = res.data.pre_work;
              this.$refs.sqleditorpre.setValue(
                sqlFormatter.format(this.sqlMainpre)
              );
            }
          }
        });
    },
    // 保存前置作业
    savePreJob() {
      if (
        this.$refs.sqleditorpre !== undefined &&
        this.$refs.sqleditorpre !== ""
      ) {
        this.sqlMainpre = this.$refs.sqleditorpre.editor.getValue();
      }
      this.$executeRequest.execGetByModulName("/market/savePreJob", {
        pre_work: this.$Secret.Encrypt(this.sqlMainpre),
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          if (res && res.success) {
            this.ifprejob = false;
          }
        });
    },
    // 保存后置作业
    saveAfterJob() {
      if (
        this.$refs.sqleditorafter !== undefined &&
        this.$refs.sqleditorafter !== ""
      ) {
        this.sqlMainafter = this.$refs.sqleditorafter.editor.getValue();
      }
      this.$executeRequest.execGetByModulName("/market/saveAfterJob", {
        post_work: this.$Secret.Encrypt(this.sqlMainafter),
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          if (res && res.success) {
            this.ifafterjob = false;
          }
        });
    },
    gettablename() {
      this.$executeRequest.execGetByModulName("/market/getTableName", {
        datatable_id: this.datatable_id,
      })
        .then((res) => {
          this.tablename = res.data.datatable_en_name;
          this.pre_partition = res.data.pre_partition;
        });
    },
    //改变前置后置sql内容
    changeTextareaPre(val) {
      this.sqlMainpre = val;
    },
    editingpre(val) {
      this.sqlMainpre = val;
    },
    changeTextareaAfter(val) {
      this.sqlMainafter = val;
    },
    editingafter(val) {
      this.sqlMainafter = val;
    },
    //---------------------------------选择表创建---------------------------------
    getTableTreeData(index) {
      this.relationIndex = index + 2;
      this.selectTableVisible = true;
      // this.gettreeData();
    },
    deleteRelation(index) {
      this.relationNums.splice(index, 1);
    },
    selectTableCreateClosed() {
      this.selectTableCreateFormData = {
        selectColumns: "",
        table_name: "",
        relationNums: [],
        whereColumns: "",
        groupByColumns: "",
      };
      this.relationNums = [];
    },
    //弹窗确认
    addSql() {
      // 提示信息
      let sql =
        "select " +
        this.selectTableCreateFormData.selectColumns +
        " from " +
        this.selectTableCreateFormData.table_name +
        " T1 ";
      if (this.relationNums.length !== 0) {
        for (let i = 0; i < this.relationNums.length; i++) {
          sql =
            sql +
            this.selectTableCreateFormData["joinCondition" + i] +
            " " +
            this.selectTableCreateFormData["tableName" + i] +
            " T" +
            (i + 2) +
            " ON " +
            this.selectTableCreateFormData["onCondition" + i];
        }
      } 
      if (
        this.selectTableCreateFormData.whereColumns !== undefined &&
        this.selectTableCreateFormData.whereColumns !== ""
      ) {
        sql = sql + " where " + this.selectTableCreateFormData.whereColumns;
      }
      if (
        this.selectTableCreateFormData.groupByColumns !== undefined &&
        this.selectTableCreateFormData.groupByColumns !== ""
      ) {
        sql = sql + " group by " + this.selectTableCreateFormData.groupByColumns;
      }
      this.sqlMain = sql;
      this.$refs.sqleditor.editor.setValue(sqlFormatter.format(sql));
      this.selectTableVisible = false;
      this.selectTableCreateVisible = false;
    },
    //点击选择表左侧树获取表格
    handleNodeClick(data) {
      this.tableData = [];
      if (data.file_id && !data.children) {
        this.tableData.push(data);
      } else if (data.classify_id && data.children?.length > 0) {
        this.tableData = data.children;
      }
      this.selectTablePagination.total = this.tableData.length;
    },
    //选择表右侧表格分页
    selectTabelCurrentChange(val) {
      this.selectTablePagination.pageNum = val;
    },
    selectTabelSizeChange(val) {
      this.selectTablePagination.pageSize = val;
      this.selectTablePagination.pageNum = 1;
    },
    //选择表弹窗关闭
    selectTableClosed() {
      this.tableData = [];
      this.selectTablePagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      };
      // this.selectTableCreateFormData = {
      //   selectColumns: "",
      //   table_name: "",
      //   relationNums: [],
      //   whereColumns: "",
      //   groupByColumns: "",
      // };
    },
    //选择字段
    selectTableOperate(type, row) {
      if (type === "select") {
        this.tablecolumnType = 1;
        this.showtablecolumn(row);
      }
    },
    //单选选择表名
    selectTableSelectionChange(val) {
      this.tableDataShow.map((item) => {
        if (item.id === val.id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    //选择表的确认
    addTable() {
      let table = this.tableDataShow.filter((item) => item.checked);
      if (table.length === 0) {
        this.$Msg.customizTitle("请选择表!", "warning");
        return;
      }
      if (this.relationIndex === 1) {
        this.selectTableCreateFormData.table_name = table[0].hyren_name;
        if (this.selectTableCreateFormData.selectColumns?.length === 0) {
          let selectColumns = "";
          this.selectSqlArr.map((item) => {
            selectColumns += item.str + ",";
          });
          this.selectTableCreateFormData.selectColumns = selectColumns;
        } else {
          let selectColumnsArr = JSON.parse(
            JSON.stringify(
              this.selectTableCreateFormData.selectColumns.split(",")
            )
          );
          let arr = [];
          this.selectSqlArr.map((item) => {
            arr.push(item.str);
          });
          const filterArr = selectColumnsArr.filter((item) => {
            return item.indexOf("T1.") === -1;
          });
          filterArr.unshift(...arr);
          this.selectTableCreateFormData.selectColumns = filterArr.join(",");
        }
      } else {
        this.selectTableCreateFormData[`tableName${this.relationIndex - 2}`] =
          table[0].hyren_name;
        if (this.selectTableCreateFormData.selectColumns?.length === 0) {
          let selectColumns = "";
          this.selectSqlArr.map((item) => {
            selectColumns += item.str + ",";
          });
          this.selectTableCreateFormData.selectColumns = selectColumns;
        } else {
          let selectColumnsArr = JSON.parse(
            JSON.stringify(
              this.selectTableCreateFormData.selectColumns.split(",")
            )
          );
          let arr = [];
          this.selectSqlArr.map((item) => {
            arr.push(item.str);
          });
          const filterArr = selectColumnsArr.filter((item) => {
            return (
              item.indexOf(`T${this.relationIndex - 2}.`) === -1 &&
              item.length > 0
            );
          });
          const findItemIndex = filterArr.findIndex((item, index) => {
            let num = item.split(".")[0].split("")[1];
            return num > this.relationIndex;
          });
          if (findItemIndex > -1) {
            const filterArr = filterArr.splice(findItemIndex, 0, ...arr);
          } else {
            filterArr.push(...arr);
          }
          this.selectTableCreateFormData.selectColumns = filterArr.join(",");
        }
      }
      this.selectTableVisible = false;
    },
    previous() {
      // $router.go(-1)
      // this.$router.push({
      //   name: "marketTable",
      //   query: {
      //     data_mart_id: this.data_mart_id,
      //     // is_add: "1",
      //     operation: "update",
      //     datatable_id: id,
      //     active: "0", //跳转到作业
      //   },
      // });
      this.$router.push({
        name: "marketTable",
        query: {
          data_mart_id: this.data_mart_id,
          datatable_id: this.datatable_id,
          // is_add: 1,
          operation: "update",
          // ifrepeat: this.ifrepeat,
          active: "0",
          // 外部跳转相关
          source: this.$route.query.source,
          // uuid: this.$route.query.uuid,
          // category: this.$route.query.category,
          task_is_first: 1
        },
      });

    },
    //下一步pre的检查
    prenext() {
      this.hbasesort.tableData = [];
      let ifhasrowkeyflag = false;
      if (this.ifhbase) {
        for (var i = 0; i < this.formTableData.tableData.length; i++) {
          var everyrow = this.formTableData.tableData[i];
          if (everyrow.hasOwnProperty("rowkey") && everyrow.rowkey == true) {
            ifhasrowkeyflag = true;
            this.hbasesort.tableData.push({
              field_en_name: everyrow.field_en_name,
            });
          }
        }
        if (!ifhasrowkeyflag) {
          this.$Msg
            .confirmMsg(
              "目的地为Hbase,但没有选择rowkey,默认rowkey为全字段的MD5"
            )
            .then((res) => {
              this.next();
            })
            .catch(() => { });
        } else {
          // this.$executeRequest.execPostByModulName("/market/sortHbae", {
          //     hbasesort: this.hbasesort.tableData,
          //     datatable_id: this.datatable_id,
          //   })
          //   .then((res) => {
          //     this.hbasesort.tableData = res.data;
          //   });
          this.ifhbasesort = true;
        }
      } else {
        // 如果存储层不是hbase,那么预分区键设置为''
        this.pre_partition = "";
        this.next();
      }
    },
    next() {
      if (this.sqlMain === "") {
        this.$Msg.customizTitle("请填写sql!", "warning");
        return;
      }
      if (this.formTableData.tableData.length == 0) {
        this.$Msg.customizTitle("请先点击确定 生成字段", "warning");
        return false;
      }
      let list = this.formTableData.tableData;
      for (var i = 0; i < list.length; i++) {
        var field_en_name = list[i].field_en_name;
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
        if (field_en_name === "" || field_en_name == undefined) {
          this.$Msg.customizTitle(
            "第" + (i + 1) + "行字段英文名为空",
            "warning"
          );
          return false;
        }
        var field_cn_name = list[i].field_cn_name;
        if (field_cn_name === "" || field_cn_name == undefined) {
          this.$Msg.customizTitle(
            "第" + (i + 1) + "行字段中文名为空",
            "warning"
          );
          return false;
        }
        var field_type = list[i].field_type;
        if (field_type === "" || field_type == undefined) {
          this.$Msg.customizTitle(
            "第" + (i + 1) + "行字段类型名为空",
            "warning"
          );
          return false;
        }
        var field_process = list[i].field_process;
        if (field_process === "" || field_process == undefined) {
          this.$Msg.customizTitle(
            "第" + (i + 1) + "行字段处理方式为空",
            "warning"
          );
          return false;
        }
        if (field_process == "4") {
          var process_mapping = list[i].process_mapping;
          if (process_mapping === "" || process_mapping == undefined) {
            this.$Msg.customizTitle(
              "第" + (i + 1) + "行函数映射为空",
              "warning"
            );
            return false;
          }
        } else if (field_process == "2") {
          //不进行验证
        } else if (field_process == "5") {
          var group_mapping = list[i].group_mapping;
          if (group_mapping === "" || group_mapping == undefined) {
            this.$Msg.customizTitle(
              "第" + (i + 1) + "行分组映射为空",
              "warning"
            );
            return false;
          }
        } else {
          var process_mapping = list[i].process_mapping;
          let regx = /^\'(\S*)\'$/;
          if (
            this.checkColumnData.includes(field_type.toLowerCase()) &&
            field_process == "1"
          ) {
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
            if (process_mapping === "" || process_mapping == undefined) {
              this.$Msg.customizTitle(
                "第" + (i + 1) + "行来源值为空",
                "warning"
              );
              return false;
            }
          }
        }
        var field_type = list[i].field_type;
        if (field_type == "decimal" || field_type == "varchar") {
          if (!list[i].hasOwnProperty("field_length")) {
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
            var field_length = list[i].field_length;
            if (field_length == "") {
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
      for (var i = 0; i < list.length; i++) {
        var dslad_id = list.dslad_id;
        var dsla_storelayer = list.dsla_storelayer;
        for (var j = 0; j < list.length; j++) {
          var everydatatable_field_info = list[j];
          if (everydatatable_field_info.hasOwnProperty(dsla_storelayer)) {
            if (everydatatable_field_info[dsla_storelayer] == true) {
              dm_column_storage.push({
                csi_number: j,
                dslad_id: dslad_id,
              });
            }
          }
        }
      }
      let params = {
        datatable_field_info: this.formTableData.tableData,
        datatable_id: this.datatable_id,
        dm_column_storage: dm_column_storage,
        querysql: this.sqlMain,
        hbasesort: this.hbasesort,
        pre_partition: this.pre_partition,

        uuid: this.$route.query.uuid,
        category: this.$route.query.category
      };
      this.$executeRequest.execPostByModulName("/market/addDFInfo", params)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("保存成功", "success");
            this.ifhbasesort = false;
            this.$router.push({
              name: "marketTable",
              query: {
                data_mart_id: this.data_mart_id,
                datatable_id: this.datatable_id,
                operation: "update",
                // is_add: 1,
                ifrepeat: this.ifrepeat,
                active: "2",
                // 外部跳转相关
                source: this.$route.query.source,
                uuid: this.$route.query.uuid,
                category: this.$route.query.category,
                task_is_first: 1
              },
            });
          }
        });
    },
    //hbase排序表格上移、下移
    hbasesortOperate(type, row, index) {
      if (type === "up") {
        this.hbaseupcolumn(index);
      } else if (type === "down") {
        this.hbasedowncolumn(index);
      }
    },
    hbaseupcolumn(index) {
      if (index === 0) {
        this.$Msg.customizTitle("已经是第一行了", "warning");
        return;
      }
      let temp = this.hbasesort[index];
      this.hbasesort.tableData.splice(index, 1);
      this.hbasesort.tableData.splice(index - 1, 0, temp);
    },
    hbasedowncolumn(index) {
      if (index === this.hbasesort.tableData.length - 1) {
        this.$Msg.customizTitle("已经是最后一行了", "warning");
        return;
      }
      let temp = this.hbasesort.tableData[index];
      this.hbasesort.tableData.splice(index, 1);
      this.hbasesort.tableData.splice(index + 1, 0, temp);
    },
    // 跳转到表外键关联页面
    toDbmFkInfoTab(){
      this.$router.push({
        name: "marketTable",
        query: {
          data_mart_id: this.data_mart_id,
          datatable_id: this.datatable_id,
          operation: "update",
          ifrepeat: this.ifrepeat,
          active: "20",
          source : this.$route.query.source,
          uuid: this.$route.query.uuid,
          category: this.$route.query.category,
          task_is_first : 1
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.el-button {
  width: 100px;
  height: 32px;
  padding: 8px 0;
}

.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.main {
  border-top: @border-common;
  height: 300px;
  border-bottom: @border-common;
}

.sqlBox {
  border: @border-common;
}

::v-deep .el-input--mini .el-input__inner,
::v-deep .el-input--small .el-input__inner {
  padding: 0 10px;
}

.sqlToolBar {
  background: #f7f7f7;
  font-size: 16px;

  i {
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
    color: #5c5f66;
  }
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
  position: fixed;
  border-radius: 5px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  z-index: 100;
  cursor: pointer;
}

.formSlot {
  margin-left: -100px;
  height: 32px;
  line-height: 32px;

  span {
    margin-right: 10px;
  }
}

/* 提示信息样式 */
.tooltipHelp {
  padding: 0 4px !important;
}
</style>
