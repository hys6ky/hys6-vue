<template>
  <div class="webSqlConsole h100 d-flex">
    <div class="h100">
      <by-tree
        class="h100"
        :data="webSqlTreeData"
        type="configSQL"
        :filter-node-method="filterNode"
        @logDetail="handleNodeClick"
        @contextmenu="handelMedth"
        ref="tree"
      />
    </div>
    <div
      class="flex-1 overflow-y-auto h100 px-20"
      style="width: calc(100% - 275px)"
    >
      <by-header-slice title="SQL 操作台" class="mx-10 mt-10" />
      <el-tabs v-model="activeName" @tab-click="tabClick()">
        <el-tab-pane label="表查询" name="tableQuery"> </el-tab-pane>
        <el-tab-pane label="Sql查询" name="sqlQuery"> </el-tab-pane>
      </el-tabs>
      <div style="height: calc(100% - 70px)" v-if="activeName === 'tableQuery'">
        <div
          v-if="dataByTableName.length > 0"
          class="pt-20"
          style="height: calc(100% - 40px)"
        >
          <ByTable
            :tableData="dataByTableName"
            :columnArr="columnArr"
            :header-cell-style="thStyleFun"
            :cell-style="cellStyleFun"
          />
        </div>
        <div v-else class="pt-20" style="height: calc(100% - 40px)">
          <ByEmpty />
        </div>
      </div>
      <div style="height: calc(100% - 70px)" v-else>
        <el-row class="my-10">
          <el-button
            class="query-sql-btn"
            style="float: right"
            type="primary"
            @click="getDataBySQL()"
            size="small"
            >查询
          </el-button>
          <el-button
            type="primary"
            style="float: right"
            size="small"
            @click="formaterSql(basicInfoForm.sqlMain)"
            >格式化sql</el-button
          >
        </el-row>
        <el-row>
          <el-col>
            <div>
              <SqlEditor
                ref="sqleditor"
                :data="1"
                :value="basicInfoForm.sqlMain"
                @changeTextarea="changeTextarea($event)"
              />
            </div>
          </el-col>
        </el-row>
        <div
          v-if="dataBySQL.length > 0"
          class="pt-20"
          style="height: calc(100% - 40px)"
        >
          <ByTable
            :tableData="dataBySQL"
            :columnArr="columnArr"
            :header-cell-style="thStyleFun"
            :cell-style="cellStyleFun"
          />
        </div>
        <!--          <div v-else class="pt-20" style="height: calc(100% - 57px)">-->
        <!--            <ByEmpty />-->
        <!--          </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import Scrollbar from "@/components/global/Scrollbar.vue";
import SqlEditor from "@/components/global/SqlEditor.vue";
import ByTree from "@/components/global/ByTree";
import {getFlatArr, parseSimpleTreeData} from "@/utils/datahandler.js";
import ByHeaderSlice from "@/components/global/ByHeaderSlice";

export default {
  name: "sqlConsole",
  components: { ByHeaderSlice, SqlEditor, Scrollbar, ByTree },
  data() {
    return {
      isLoading: false,
      menuVisible: false,
      showOrhidden: false,
      querySQL: "",
      filterText: "",
      activeName: "tableQuery",
      filterNodeData: [],
      dataByTableName: [],
      dataBySQL: [],
      copydata: "",
      basicInfoForm: {
        sqlMain: "",
      },
      index1: 1,
      webSqlTreeData: [],
      columnArr: [],
    };
  },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getWebSQLTreeData();
  },
  methods: {
    //表头居中
    thStyleFun() {
      return "text-align:center";
    },
    //数据居中
    cellStyleFun() {
      return "text-align:center";
    },
    //表头自适应
    labelHead: function (h, { column, index }) {
      let l = column.label.length;
      let f = 14; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * l; //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h("div", { class: "table-head", style: { width: "100%" } }, [
        column.label,
      ]);
    },
    //点击标签触发
    tabClick() {
      if (this.activeName == "sqlQuery") {
        // this.$nextTick(() => {
        //     // this.$refs.sqleditor.refresh();
        // });
      }
    },
    // 节点搜索
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
    //获取数据回收站树信息
    getWebSQLTreeData() {
      this.$executeRequest.execPostByMenuUrl("/websqlquery/getWebSQLTreeData").then((res) => {
          if (res.success) {
            //this.webSqlTreeData = res.data;
            const tree = getFlatArr(res.data);
            tree.map((item) => {
              if (item.children?.length > 0) {
                item.children = [];
              } else {
                item.dropList = [{ label: "复制表名", type: "copy" }];
              }
              item.showLable = item.label;
              item.type = "text";
              item.expanded = true;
            });
            this.webSqlTreeData = parseSimpleTreeData(tree, "id", "parent_id");
          }
        });
    },
    //树点击触发
    handleNodeClick(data) {
      this.isLoading = true;
      if ("object" !== typeof data.file_id && data.file_id !== "") {
        // 查询数据
        this.dataByTableName = [];
        this.columnArr = [];
        let param = {table_name: data.hyren_name};
        this.$executeRequest.execGetByMenuUrl("/websqlquery/queryDataBasedOnTableName", param).then((res) => {
            if (res && res.success) {
              if (res.success) {
                this.isLoading = false;
                this.dataByTableName = res.data;
                this.getColumnArr(this.dataByTableName);
              } else {
                this.isLoading = false;
              }
            }
          });
      }
    },
    // 根据SQL查询数据
    getDataBySQL() {
      let querySQL = this.$refs.sqleditor.getmVal();
      // let querySQL = this.basicInfoForm.sqlMain;
      if (querySQL === "") {
        this.$Msg.customizTitle("查询sql不能为空", "warning");
      } else {
        this.dataBySQL = [];
        this.columnArr = [];
        let param = {querySQL: this.$Secret.Encrypt(querySQL),};
        this.$executeRequest.execGetByMenuUrl("/websqlquery/queryDataBasedOnSql", param).then((res) => {
            if (res.success) {
              this.showOrhidden = true;
              this.dataBySQL = res.data;
              this.getColumnArr(this.dataBySQL);
            }
          });
      }
    },
    getColumnArr(data) {
      if (data.length > 0) {
        const firstRowData = data[0];
        this.columnArr = Object.keys(firstRowData).map((key) => ({
          prop: key,
          label: key,
          type: "text",
          minWidth: 14 * key.length,
          align: "center",
          showOverflowTooltip: true,
          // 其他列配置属性可以根据需要添加
        }));
      }
    },
    handelMedth(val) {
      if (val.command === "copy") {
        this.copydata = val.id.label;
        this.copydatas();
      }
    },
    // 树右键复制代码
    rightClick(MouseEvent, object, Node, element) {
      if (Node.level === 3 || Node.level === 5 || Node.level === 4) {
        this.copydata = Node.label;
        this.menuVisible = false;
        this.menuVisible = true;
        var menu = document.querySelector("#menu");
        document.addEventListener("click", this.foo);
        menu.style.display = "block";
        menu.style.left = MouseEvent.pageX + 20 + "px";
        menu.style.top = MouseEvent.pageY - 8 + "px";
        this.node_data = object;
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

    changeTextarea(val) {
      this.$set(this.basicInfoForm, "sqlMain", val);
    },
    formaterSql(val) {
      // let dom = this.$refs.sqleditor
      // dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()))
      this.$refs.sqleditor.sqlFormatter();
    },
  },
};
</script>

<style scoped>
.borderStyle {
  border: 1px solid #e6e6e6;
  padding: 1%;
}

/* 查询sql按钮*/
.query-sql-btn {
  margin-left: 2%;
}

.webSqlConsole .menu {
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

.webSqlConsole >>> .CodeMirror {
  width: 100%;
  border: 1px solid #ddd;
  height: 60px;
  background: #fff;
  margin-bottom: 10px;
}

.textasql >>> .CodeMirror {
  height: 200px !important;
  /* width:200px !important; */
}

.sql-btn {
  margin-bottom: 5px;
}

.scrollbar-wrap {
  width: 24% !important;
  position: absolute;
}

.scrollbar__track {
  width: 4px;
}
</style>
