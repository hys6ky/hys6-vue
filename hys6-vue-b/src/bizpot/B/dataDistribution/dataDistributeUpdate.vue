<template>
  <div class="dataDistribution">
    <el-row class="topTitle">
      <span class="el-icon-s-data">数据分发</span>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="mytree" hight="200">
          <el-tree
            class="filter-tree"
            :data="treeData"
            :indent="0"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleNodeClick"
          >
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="data.description" v-if="data.file_id">
                <i class="el-icon-document"></i>
                <template v-if="data.original_name">{{
                    data.original_name
                  }}</template>
                <template v-else-if="data.table_name">{{
                    data.table_name
                  }}</template>
                <template v-else>{{ data.hyren_name }}</template>
              </span>
              <span :title="data.description" v-else>
                <i class="el-icon-folder-opened"></i>{{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!-- 编辑数据分发配置 -->
      <el-col
        :span="18"
        style="border-left: 1px #e0dcdc dashed; min-height: 400px"
      >
        <el-input
          placeholder="SQL中使用#{}进行替换，例如#{abc};参数处填写abc=123,多个参数时,中间用`@^隔开"
          size="mini"
          style="float: right; width: 50%; margin-bottom: 10px"
        >
        </el-input>
        <el-form
          ref="formUpdate"
          :model="formUpdate"
          label-width="130px"
          size="medium"
        >
          <el-row :gutter="20">
            <el-form-item
              label="sql语句"
              prop="sql_table"
              :rules="filter_rules([{ required: true }])"
              style="margin-right: 10px"
            >
              <SqlEditor
                ref="sqleditorTwo"
                :value="formUpdate.sql_table"
                @changeTextarea="changeTextarea($event)"
              />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="文件名称"
                prop="file_name"
                :rules="filter_rules([{ required: true }])"
              >
                <el-input
                  placeholder="请输入文件名称"
                  v-model="formUpdate.file_name"
                  style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据落地目录" prop="plane_url">
                <el-input
                  placeholder="请输入数据落地目录"
                  v-model="formUpdate.plane_url"
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
                prop="file_suffix"
                :rules="filter_rules([{ required: true }])"
              >
                <el-input
                  placeholder="请输入文件后缀"
                  v-model="formUpdate.file_suffix"
                  style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行分隔符" prop="row_separator">
                <el-input
                  v-model="formUpdate.row_separator"
                  placeholder="请输入行分隔符"
                  style="width: 300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="列分割符" prop="database_separatorr">
                <el-input
                  v-model="formUpdate.database_separatorr"
                  placeholder="请输入列分隔符"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="数据编码格式"
                prop="database_code"
                :rules="rule.selected"
              >
                <el-select
                  v-model="formUpdate.database_code"
                  placeholder="数据字符编码"
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
                <el-radio-group v-model="formUpdate.is_header">
                  <el-radio
                    v-for="(item, index) in isFlag"
                    :key="index"
                    :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否压缩" prop="is_compress">
                <el-radio-group v-model="formUpdate.is_compress">
                  <el-radio
                    v-for="(item, index) in isFlag"
                    :key="index"
                    :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文件名是否大写" prop="is_upper">
                <el-radio-group v-model="formUpdate.is_upper">
                  <el-radio
                    v-for="(item, index) in isFlag"
                    :key="index"
                    :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否标识文件" prop="is_flag">
                <el-radio-group v-model="formUpdate.is_flag">
                  <el-radio
                    v-for="(item, index) in isFlag"
                    :key="index"
                    :label="item.code"
                  >
                    {{ item.value }}
                  </el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否发布" prop="is_release" hidden>
                <el-input v-model="formUpdate.is_release" value="0"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文件格式" prop="dbfile_format">
                <el-select
                  v-model="formUpdate.dbfile_format"
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
              <el-form-item label="备注" prop="dd_remark">
                <el-input
                  type="textarea"
                  v-model="formUpdate.dd_remark"
                  placeholder="备注"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-button
            type="primary"
            class="rightbtn"
            @click="updateDistributeData('formUpdate')"
            size="medium"
          >更 新
          </el-button>
          <el-button
            type="primary"
            class="rightbtn"
            @click="returnPage()"
            size="medium"
          >返 回
          </el-button
          >
          <el-button
            type="primary"
            size="medium"
            class="rightbtn"
            @click="formaterSql(formUpdate.sql_table)"
          >格式化sql
          </el-button
          >
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      title="表字段"
      :visible.sync="iftablecolumn"
      width="50%"
      class="data_edit"
    >
      <el-row>
        <el-table
          :data="tablecolumn"
          border
          size="mini"
          ref="filterTable"
          height="400"
          @selection-change="handleSelectionColumn"
        >
          <el-table-column width="70" align="center" type="selection"/>
          <el-table-column type="index" width="70" label="序号" align="center"/>
          <el-table-column
            prop="column_name"
            label="字段英文名"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column prop="data_type" label="字段类型" align="center"/>
          <el-table-column prop="data_len" label="长度" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.data_type === 'numeric'"
              >{{ scope.row.data_len }},{{ scope.row.decimal_point }}</span
              >
              <span v-else>{{ scope.row.data_len }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button
          type="primary"
          size="mini"
          class="rightbtn"
          @click="changesql()"
        >确定
        </el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="rightbtn"
          @click="dismissiftablecolumn()"
        >取消
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import SqlEditor from "@/components/global/SqlEditor.vue";

export default {
  name: "dataDistributeUpdate",
  components: {SqlEditor},
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      treeData: [],
      dicList: [],
      filterText: "",
      fileFormat: "",
      page: "1",
      size: "10",
      dd_id: "",
      distributeData: {},
      multipleSelection: [],
      formUpdate: {
        sql_table: "",
      },
      dataBaseCode: [],
      tablecolumn: [],
      isFlag: [],
      iftablecolumn: false,
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
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.dd_id = this.$route.query.dd_id;
    this.getDataInfoMsg(this.dd_id);
    this.$Code
      .getCategoryItems({
        category: "DataBaseCode",
      })
      .then((res) => {
        if (res && res.success) {
          this.dataBaseCode = res.data;
        }
      });
    this.$Code
      .getCategoryItems({
        category: "IsFlag",
      })
      .then((res) => {
        if (res && res.success) {
          this.isFlag = res.data;
        }
      });
    this.$Code
      .getCategoryItems({
        category: "FileFormat",
      })
      .then((res) => {
        if (res && res.success) {
          this.fileFormat = res.data;
        }
      });
    this.getWebSQLTreeData();
  },

  methods: {
    // 展示树数据
    getWebSQLTreeData() {
      this.$executeRequest
        .execByUrlFullPathRequest(
          this.$executeRequest.getGateWayPrefix() + "/Q/sqlConsole/websqlquery/getWebSQLTreeData"
        ).then(
        (res) => {
          if (res.success) {
            this.treeData = res.data;
          }
        }
      );
    },
    // 树节点触发
    handleNodeClick(data) {
      this.tableData = [];
      //如果节点的file_id为未定义并且节点的分类id不为空并且节点分类不是未定义,代表该节点是分类信息,则添加分类下节点数据到展示区
      if (
        "object" === typeof data.file_id &&
        data.classify_id !== "" &&
        "object" !== typeof data.classify_id
      ) {
        //如果该节点的子节点信息不是未定义,则添加该节点下所有表信息
        if (typeof data.children !== "object") {
          data.children.forEach((element) => {
            //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
            if ("object" !== typeof element.file_id && element.file_id !== "") {
              this.tableData.push(element);
            }
          });
        }
      }
      //如果数据层是DQC或者UDL,并且父id是DQC或者UDL则添加存储层下的表信息到展示区
      else if (
        (data.data_layer === "DQC" || data.data_layer === "UDL") &&
        (data.parent_id === "DQC" || data.parent_id === "UDL")
      ) {
        this.tableData = data.children;
      }
      //如果file_id不为空,代表该节点是表信息,添加表信息到展示区
      else if ("object" !== typeof data.file_id && data.file_id !== "") {
        this.tableData.push(data);
      }
      this.totalSize = this.tableData.length;
      if (data.file_id && data.file_id.length > 0) {
        this.formUpdate.sql_table = data.hyren_name;
      }
      if ("object" !== typeof data.file_id && data.file_id != "") {
        this.$executeRequest
          .execGetByPostModuleUrl(
            "/dataDistribution/queryAllColumnOnTableName",
            {
              source: data.data_layer,
              id: data.file_id,
            }
          )
          .then((res) => {
            console.info(res);
            this.tablecolumn = res.data.column_info_list;
            this.sqltablename = res.data.hyren_name;
            this.iftablecolumn = true;
            this.Allis_selectionstate = false;
          });
      }
    },
    // 搜索过滤节点
    filterNode(value, data) {
      // 如果检索内容为空,直接返回
      if (!value) return true;
      // 如果传入的value和data中的name相同说明是匹配到了,匹配时转小写匹配
      // 检索内容为 original_name table_name hyren_name
      if ("undefined" !== typeof data.file_id && data.file_id !== "") {
        return (
          ("undefined" !== typeof data.original_name &&
            data.original_name !== "" &&
            data.original_name.indexOf(value) !== -1) ||
          ("undefined" !== typeof data.table_name &&
            data.table_name !== "" &&
            data.table_name.toLowerCase().indexOf(value.toLowerCase()) !==
            -1) ||
          ("undefined" !== typeof data.hyren_name &&
            data.hyren_name !== "" &&
            data.hyren_name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        );
      }
    },
    changeTextarea(val) {
      this.$set(this.formUpdate, "sql_table", val);
    },
    formaterSql(val) {
      this.$refs.sqleditorTwo.sqlFormatter();
    },
    changesql() {
      let sql = "select ";
      for (let i = 0; i < this.multipleSelection.length; i++) {
        sql += this.multipleSelection[i].column_name + ",";
      }
      sql = sql.substr(0, sql.length - 1);
      sql += " from " + this.sqltablename;
      this.$refs.sqleditorTwo.setmVal(sql);
      this.formUpdate.sql_table = sql;
      this.iftablecolumn = false;
    },
    returnPage() {
      this.$router.push({
        name: "dataDistribution",
      });
    },
    getDataInfoMsg(val) {
      var data = {dd_id: this.dd_id};
      this.$executeRequest
        .execGetByPostModuleUrl("/dataDistribution/getDataInfoMsg", data)
        .then((res) => {
          if (res && res.success) {
            this.$refs.sqleditorTwo.setmVal(res.data.sql_table);
            this.formUpdate = res.data;
            this.formUpdate.sql_table = res.data.sql_table;
          }
        });
    },
    dismissiftablecolumn() {
      this.iftablecolumn = false;
    },
    // 选择列触发事件
    handleSelectionColumn(row) {
      this.multipleSelection = row;
    },
    updateDistributeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/dataDistribution/updateDistributeData",
              this.formUpdate
            )
            .then((res) => {
              if (res && res.success) {
                this.$message({
                  type: "success",
                  message: "更新成功!",
                });
                this.formUpdate = {};
              }
            });
          this.$router.push({
            name: "dataDistribution",
          });
        } else {
          return false;
        }
      });
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

/* 按钮样式 */
.elButton {
  float: right;
  margin-bottom: 10px;
}

/* 按钮样式 */
.elButton {
  float: right;
  margin-bottom: 10px;
}
</style>