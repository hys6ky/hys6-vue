<template>
  <div id="dbmFkInfoTab">
    <el-row class='topTitle'>
      <el-col :span="12">
        <span>表外键关联</span>
      </el-col>
      <el-col :span="11" style="text-align: right;margin-top: -5px">
        <el-button type="danger" @click="$router.go(-1)" size="medium">返 回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="borderStyle" :span="7" style="margin-right: 10px;height:60vh;overflow:auto">
        <!--树菜单-->
        <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText"/>
        <div class='mytree'>
          <el-tree class="filter-tree" ref="tree" :data="treedata" :indent="0" :filter-node-method="filterNode" @node-contextmenu="rightClick">
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="data.description" v-if="data.file_id !== '' && data.file_id !== null">
                <el-checkbox @change="choiceTable($event,data)" v-model="data.checkbox" ></el-checkbox>
                <i class=" el-icon-document"></i>
                <template v-if="'undefined' !== typeof data.original_name && data.original_name !== '' && data.original_name !== null">
                  {{ data.original_name }}
                </template>
                <template v-else-if="data.original_name === '' && data.table_name!=='' && data.table_name !== null">
                  {{ data.table_name }}
                </template>
                <template v-else>{{ data.hyren_name }}</template>
              </span>
              <!-- <span :title="data.description" v-else-if="data.classify_id !== '' && data.classify_id != null "> -->
              <span :title="data.description" v-else="">
                <el-checkbox v-if="data.classify_id && data.classify_id != ''" @change="choiceAllTable($event,data)" v-model="data.checkbox"></el-checkbox>
                <i class="el-icon-folder-opened"/>{{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-form ref="sqlRelationForm">
            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="21">
                  <el-select v-model="sqlRelationForm.tableNames" disabled multiple
                             placeholder="请从左边树选择需要获取外键关联关系表" style="width: 100%;">
                    <el-option v-for="item in tableData" :key="item.file_id" :label="item.hyren_name"
                               :value="item.hyren_name">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" size="medium" @click="getRelationByTableNames()">获取关联关系</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="sqlRelationForm.relationSqlPart[0]">
              <el-select v-model="sqlRelationForm.selectColumns" multiple :collapse-tags="collapseTags" clearable
                         filterable
                         placeholder="请选择SELECT字段" style="width: 100%">
                <el-row>
                  <el-checkbox v-model="checked" style="float: right;padding-right: 20px;" @change="selectAll">
                    全选
                  </el-checkbox>
                </el-row>
                <el-row>
                  <el-option v-for="item in sqlSelectColumns" :key="item.column_name" :label="item.column_name"
                             :value="item.column_name">
                    <span style="float: left">{{ item.column_name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.table_name }}</span>
                  </el-option>
                </el-row>
              </el-select>
            </el-form-item>
            <el-form-item v-if="sqlRelationForm.relationSqlPart[0]">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input
                      v-model="sqlRelationForm.relationSqlPart[0].mainTableAlias" disabled></el-input>
                </el-col>
                <el-col :span="16">
                  <el-row :gutter="10" v-for="item in sqlRelationForm.relationSqlPart" style="margin-bottom: 5px;">
                    <el-col :span="5">
                      <el-select v-model="item.joinType">
                        <el-option v-for="join in joinTypeOptions" :label="join.lable" :value="join.value"/>
                      </el-select>
                    </el-col>
                    <el-col :span="9">
                      <el-input v-model="item.tableAlias" disabled></el-input>
                    </el-col>
                    <el-col :span="1">ON</el-col>
                    <el-col :span="9">
                      <el-input v-model="item.onCond"></el-input>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-input placeholder="WHERE过滤条件" v-model="sqlRelationForm.whereColumns"
                              style="margin-bottom: 5px;"></el-input>
                  </el-row>
                  <el-row>
                    <el-input placeholder="GROUP BY分组字段" v-model="sqlRelationForm.groupColumns"
                              style="margin-bottom: 5px;"></el-input>
                  </el-row>
                  <el-row>
                    <el-input placeholder="ORDER BY排序表达式" v-model="sqlRelationForm.orderColumns"
                              style="margin-bottom: 5px;"></el-input>
                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <el-dialog title="关联SQL" :visible.sync="dialogRelationSqlVisible" width="70%">
            <el-table :data="sqlRelations.slice((sqlCurrPage - 1) * sqlPageSize,sqlCurrPage*sqlPageSize)" border
                      size="medium">
              <el-table-column property label="选择" width="60px" type="index" align="center">
                <template slot-scope="scope">
                  <el-radio v-model="currentSqlRow" :label="scope.row.relationSqlPart">&thinsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column property="relationSqlPart" label="关联SQL片段">
                <!--                    <template slot-scope="scope">-->
                <!--&lt;!&ndash;                      <span v-html="highLight(scope.row.relationSqlPart)"></span>&ndash;&gt;-->
                <!--                    </template>-->
              </el-table-column>
            </el-table>
            <!-- 分页内容 -->
            <el-row class="pagination">
              <el-pagination @current-change="handleSqlCurrentChange" :current-page="sqlCurrPage"
                             @size-change="handleSqlSizeChange" :page-sizes="[5, 10, 50, 100,500]"
                             :page-size="sqlPageSize" layout=" total,sizes,prev, pager, next,jumper"
                             :total="sqlTotalSize"
                             class='locationcenter'/>
            </el-row>
            <el-row slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogRelationSqlVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="handleCurrentRowChange" size="mini">确 认</el-button>
            </el-row>
          </el-dialog>
        </el-row>
        <!-- SQL查询 -->
        <el-row>
          <el-col :span="2">
            <span>SQL查询</span>
          </el-col>
          <el-col :span="10">
            <el-input placeholder="SQL中使用#{}进行替换，例如#{abc};参数处填写abc=123,多个参数时,中间用分号;隔开" size="mini"
                      v-model="sqlparameter">
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="formaterSql(sqlMain)" size="mini"
                       style="float:right;margin-left: 10px;">
              格式化sql
            </el-button>
            <el-button :disabled="iflock" type="primary" @click="getcolumnbysql()" size="mini" style="float:right;">
              确定
            </el-button>
            <el-button type="primary" @click="getdatabysql()" size="mini" style="float:right;">查询</el-button>
            <el-button type="primary" @click="previewSql()" size="mini" style="float:right;">SQL预览</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <div style="border:1px solid #ccc;">
            <SqlEditor ref="sqleditormain" :data="1" :value="sqlMain"
                       @changeTextarea="changeTextareaQuerySql($event)" class='textasql'/>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <!--按钮组-->
    <!-- <el-row style="margin-top: 20px;">
      <el-col :span='2' style="float:right">
        <el-button :disabled="iflock" class="elButton" type="primary" @click="addcolumn()" size="medium">
          新增字段
        </el-button>
      </el-col>
      <el-col v-if="ifhbase" :span='2' style="float:right;margin-right:10px;width:360px;">
        <el-input v-model="pre_partition" prop="pre_partition" placeholder="请输入预分区键，如 a,b,c 或者是预分区数，如 10" clearable>
        </el-input>
      </el-col>
      <el-col v-show="ifRelationDatabase" :span='2' style="float:left">
        <el-button class="elButton" type="primary" @click="showprejob()" size="medium">前置作业
        </el-button>
      </el-col>
      <el-col :span='2' style="float:left;margin-left:10px">
        <el-button class="elButton" type="primary" @click="showafterjob()" size="medium">后置作业
        </el-button>
      </el-col>
    </el-row> -->
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
    <!-- sql字段结果展示 -->
    <el-row>
      <el-table :data="formData.tableData" border size="mini">
        <el-table-column type="index" label="序号" width="60" align='center'></el-table-column>
        <el-table-column prop="field_en_name" label="字段英文名" show-overflow-tooltip align="center" width="200px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.field_en_name" placement="top"
                        v-if="scope.row.field_en_name !== '' && scope.row.field_en_name !== undefined">
              <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_en_name"
                     autocomplete="off" placeholder="英文名">
            </el-tooltip>
            <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_en_name"
                   v-else autocomplete="off" placeholder="英文名">
          </template>
        </el-table-column>
        <el-table-column prop="field_cn_name" label="字段中文名" align="center" width="200px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.field_cn_name" placement="top"
                        v-if="scope.row.field_cn_name !== '' && scope.row.field_cn_name !== undefined">
              <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_cn_name"
                     autocomplete="off" placeholder="中文名">
            </el-tooltip>
            <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_cn_name"
                   v-else autocomplete="off" placeholder="中文名">
          </template>
        </el-table-column>
        <el-table-column prop="field_type" label="字段类型" width="130" align="center">
          <template slot-scope="scope" width="100">
            <el-select clearable allow-create filterable :disabled="iflock || scope.row.field_process  === '2'"
                       v-model.lazy="scope.row.field_type" placeholder="请选择">
              <el-option v-for="(item,index) in allfield_type" :key="index" :label="item.target_type"
                         :value="item.target_type"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="field_length" label="字段长度" width="130" align="center" class="fieldDesc">
          <template slot-scope="scope">
            <input class="el-input__inner" style="width:80%"
                   :disabled="iflock || scope.row.field_process === '2' || scope.row.field_type==='int'"
                   v-model.lazy="scope.row.field_length" autocomplete="off" placeholder="长度">
            <el-tooltip v-if="scope.row.field_type === 'NUMERIC' || scope.row.field_type === 'numeric'"
                        class="tooltipHelp" effect="dark" placement="top">
              <div slot="content">
                　　说明: NUMERIC [ ( precision [ , scale ] ) ] ,写法如 : 15,3<br/>
                　　 precision 一个在 1 到 127 范围内（含 1 和 127）的整数表达式，指定表达式中的位数。缺省设置为 30。<br/>
                　　 scale 一个在 0 到 127 范围内（含 1 和 127）的整数表达式，指定小数点后的位数。小数位数值应始终小于或等于精度值。缺省设置为 6。 <br/>
              </div>
              <i class="fa fa-question-circle " aria-hidden="true"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="field_process" label="处理方式" width="130" align="center">
          <template slot="header">
            处理方式
            <el-tooltip class="tooltipHelp" effect="dark" placement="top">
              <div slot="content">
                映射仅赋值：源表字段的值直接给模型表；<br/>
                映射且修改：源表的值通过写映射规则进行修改，改变后的值给模型表；<br/>
                分组映射：源表字段的值直接给模型表，同时映射规则填写模型表的字段=某个类别，如type=1的格式进行分组（横表转竖表时用）
              </div>
              <i class="fa fa-question-circle " aria-hidden="true"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-select :disabled="iflock" v-model="scope.row.field_process"
                       @change="changecolumnfiledproccess(scope.row)" placeholder="请选择">
              <el-option v-for="(item,index) in allfield_process" :key="index" :label="item.value"
                         :value="item.code"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="process_para" label="来源值" min-width="500px" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.field_process !==  '5'">
              <el-input v-if="scope.row.field_process === '3'" readonly v-model="scope.row.process_mapping">
                <el-button slot="append" @click="showTableColumns(scope.row)">列选择</el-button>
              </el-input>
              <el-input :disabled="iflock" v-else-if="scope.row.field_process !==  '4'"
                        v-model="scope.row.process_mapping" autocomplete="off" placeholder="处理方式参数"></el-input>
              <el-input v-if="scope.row.field_process === '4'" :title="scope.row.process_mapping" :clearable="true"
                        placeholder="映射规则" v-model="scope.row.process_mapping">
                <el-button slot="append" @click="settingRule(scope.$index)">设置</el-button>
              </el-input>
            </div>
            <div v-if="scope.row.field_process === '5'">
              <el-input placeholder="请输入内容" readonly v-model="scope.row.process_mapping" style="width:260px">
                <el-button slot="append" @click="showTableColumns(scope.row)">列选择</el-button>
              </el-input>
              <el-input style="width:220px" v-model="scope.row.group_mapping" autocomplete="off"
                        placeholder="分组映射填写"></el-input>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-for="(index,item) in columnmore" :label="index.dsla_storelayer" :key="item" prop="index"
                         align="center" width="70">
          <template slot-scope="scope">
            <el-checkbox :disabled="iflock" v-model="scope.row[scope.column.label]"
                         :checked="scope.row[scope.column.label]"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="field_desc" label="描述" width="180" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.field_desc" placement="top"
                        v-if="scope.row.field_desc !== '' && scope.row.field_desc !== undefined">
              <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_desc"
                     autocomplete="off" placeholder="描述">
            </el-tooltip>
            <input class="el-input__inner" :disabled="iflock" v-model.lazy="scope.row.field_desc"
                   v-else autocomplete="off" placeholder="描述">
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center" width="160">
          <template slot-scope="scope">
            <el-button :disabled="iflock" size="mini" icon="el-icon-arrow-up" title="上移"
                       @click="upcolumn(scope.$index,scope.row)" circle type="primary">
            </el-button>
            <el-button :disabled="iflock" size="mini" icon="el-icon-arrow-down" title="下移"
                       @click="downcolumn(scope.$index,scope.row)" circle type="primary">
            </el-button>
            <el-button :disabled="iflock" size="mini" icon="el-icon-delete" title="删除"
                       @click="deletecolumn(scope.$index)" circle type="primary">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="medium" class="rightbtn" style="margin-top: 10px;"
                 @click="prenext('dm_datatable')">下一步
      </el-button>
    </el-row>
    
    <!-- sql查询数据结果展示 -->
    <el-dialog title="查询数据" :visible.sync="querydatadialogshow" width="60%">
      <el-row>
        <el-table :data="databysql" border size="mini">
          <el-table-column v-for="(index, item) in databysql[0]" :key="item" :label="item" show-overflow-tooltip
                           :prop="item">
            <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
            <template slot-scope="scope">{{ scope.row[scope.column.property] }}</template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button :disabled="iflock" type="primary" size="mini" class="rightbtn" style="margin:5px 0 0 5px;"
                   @click="querydatadialogshow = false ; getcolumnbysql()">确定
        </el-button>
        <el-button type="primary" size="mini" class="rightbtn" style="margin:5px 0 0 5px;"
                   @click="querydatadialogshow = false">
          取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- Hbase的Rowkey排序 -->
    <el-dialog title="Hbase的Rowkey排序" :visible.sync="ifhbasesort" width="30%" class='data_edit'>
      <el-row>
        <el-table :data="hbasesort" border size="mini">
          <el-table-column type="index" label="序号" width="70px" align='center'></el-table-column>
          <el-table-column prop="field_en_name" label="字段英文名" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.field_en_name" autocomplete="off" placeholder="字段英文名"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="medium" @click="hbaseupcolumn(scope.$index,scope.row)">上移
              </el-button>
              <el-button type="primary" size="medium" @click="hbasedowncolumn(scope.$index,scope.row)">下移
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-row>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="next()">确定</el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="dismissifhbasesort()">取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 表字段 -->
    <el-dialog title="表字段" :visible.sync="iftablecolumn" width="50%" class='data_edit'>
      <el-row>
        <el-table :data="tablecolumn" border size="mini" ref="filterTable" height="400"
                  @selection-change="handleSelectionColumn">
          <el-table-column width="50" align="center" type="selection">
          </el-table-column>
          <el-table-column type="index" label="序号" align='center'></el-table-column>
          <el-table-column prop="column_name" label="字段英文名" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="data_type" label="字段类型" align="center"/>
          <el-table-column prop="data_len" label="长度" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.data_type==='numeric'">{{ scope.row.data_len }},{{ scope.row.decimal_point }}</span>
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
    <!-- 前置作业 -->
    <el-dialog title="前置作业" :visible.sync="ifprejob" width="80%">
        <span>
            只能修改本集市表的数据(Update、Delete、Insert),多个SQL用;;隔开 表名为：{{ tablename }}
        </span>
      <el-row>
        <el-tabs type="card">
          <el-row>
            <div style="border:1px solid #ccc;">
              <SqlEditor ref="sqleditorpre" :data="2" :value="preJobForm.sqlMain"
                         @changeTextarea="changeTextareaPreSql($event)" class='textasql'/>
            </div>
          </el-row>
        </el-tabs>
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="savePreJob()">确定
        </el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="cancelprejob()">取消</el-button>
      </el-row>
    </el-dialog>
    <!-- 后置作业 -->
    <el-dialog title="后置作业" :visible.sync="ifafterjob" width="80%">
        <span>
            只能修改本集市表的数据(Update、Delete、Insert),多个SQL用;;隔开 表名为：{{ tablename }}
        </span>
      <el-row>
        <el-tabs type="card">
          <el-row>
            <div style="border:1px solid #ccc;">
              <SqlEditor ref="sqleditorafter" :data="3" :value="afterJobForm.sqlMain"
                         @changeTextarea="changeTextareaAfterSql($event)" class='textasql'/>
            </div>
          </el-row>
        </el-tabs>
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-button type="primary" size="mini" class="rightbtn" @click="saveAfterJob()">确定
        </el-button>
        <el-button type="primary" size="mini" class="rightbtn" @click="cancelafterjob()">取消
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
                <i>描述</i> <span style="float:right;"><el-input v-model="search" size="mini" :key="scope.row"
                                                               placeholder="输入函数名或者列子进行搜索"/></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <code>规则设置(请填写处理函数,如果使用跑批日期则填写:#{txdate}(跑批日期),#{txdate_pre}(跑批日期 - 1),#{txdate_next}(跑批日期 +
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
    <template v-if="allfromcolumn.length > 0">
      <el-dialog title="字段列表" :visible.sync="isShowColumns" width="50%">
        <el-table
            :data="allfromcolumn.filter(data => !columnSearch || data.value.toLowerCase().includes(columnSearch.toLowerCase()))"
            size="mini" height="400">
          <el-table-column type="index" label="序号" align='center'></el-table-column>
          <el-table-column prop="value" label="字段英文名" show-overflow-tooltip align="left">
          </el-table-column>
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
    <!-- 复制小提示框 -->
    <span v-show="menuVisible" id="menu" class="menu" @mouseleave="foo" @click="copydatas">复制表名</span>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import SqlEditor from "./SqlEditor.vue";
import sqlFormatter from "sql-formatter";
import {
  sqlColumnArr
} from "../mock";

export default {
  components: {
    SqlEditor,
  },
  data() {
    return {
      tableData: [],
      search: '',
      ruleDialog: false,
      menuVisible: false,
      tableDatalist: {},
      setRow: {},
      ruleStr: '',
      presql: "",
      aftersql: "",
      ifprejob: false,
      ifafterjob: false,
      treedata: [],
      active: 1,
      rule: validator.default,
      data_mart_id: this.$route.query.data_mart_id,
      // is_add: this.$route.query.is_add,
      operation: this.$route.query.operation,
      datatable_id: this.$route.query.datatable_id,
      ifrepeat: this.$route.query.ifrepeat,
      querydatadialogshow: false,
      filterText: '',
      formData:{
        // columnbysql: [],
        tableData: [],
      },
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
      selectTableVisible: false,
      labelPosition: 'right',
      currPage: 1,
      pageSize: 10,
      totalSize: 0,
      sqlMain:'',
      // basicInfoForm: {
      //   sqlMain: ''
      // },
      preJobForm: {
        sqlMain: ''
      },
      afterJobForm: {
        sqlMain: ''
      },
      radioSelect: '',
      reSelectColumns: '',
      selectColumns1: '',
      tableNameList: [],
      tableNameListString: "a,b,c,d,e,",
      checkColumnData: ['varchar', 'varchar2', 'text', 'char', 'string'],
      activeName: '',
      tablename: '',
      ifRelationDatabase: false,
      pre_partition: '',
      isShowColumns: false,
      selectColumn: {},
      columnSearch: '',
      sqlRelationForm: {
        tableNames: [],
        selectColumns: [],
        currentSqlRow: '',
        whereColumns: '',
        groupColumns: '',
        orderColumns: '',
        relationSqlPart: [],
      },
      joinTypeOptions: [
        {label: "INNER JOIN", value: ' INNER JOIN '},
        {label: "LEFT JOIN", value: ' LEFT JOIN '},
        {label: "RIGHT JOIN", value: ' RIGHT JOIN '},
      ],
      sqlSelectColumns: [],
      sqlRelations: [],
      dialogRelationSqlVisible: false,
      sqlCurrPage: 1,
      sqlPageSize: 5,
      sqlTotalSize: 0,
      currentSqlRow: '',
      sqlRelationSelectTableVisible: false,
      checked: false,
      collapseTags: false,
    };
  },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // 选择列个数
    "sqlRelationForm.selectColumns": {
      handler() {
        this.collapseTags = this.sqlRelationForm.selectColumns.length > 6;
      }
    }
  },
  created() {
    this.gettreeData();
    this.getallfield_type();
    this.getallfield_process();
    this.getcolumnmore();
    this.getcolumnfromdatabase(this.datatable_id);
    this.getifhbase();
    this.getfromcolumnlist(this.datatable_id);
  },
  mounted() {
    this.checkifrepeat();
    this.getquerysql();
    this.gettablename();
    this.getifrelationdatabase2()
  },
  methods: {
    back() {
      this.$router.push(
          {
            path: 'addMartTable_2', query: {
              data_mart_id: this.$route.query.data_mart_id,
              // is_add: this.$route.query.is_add,
              operation: this.$route.query.operation,
              datatable_id: this.$route.query.datatable_id,
              ifrepeat: this.$route.query.ifrepeat
            }
          })
    },
    checktablenode() {
      return true;
    },
    getifrelationdatabase() {
      // this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      let param = new FormData();
      param.append("datatable_id", this.datatable_id);
      // param.append("sql", this.basicInfoForm.sqlMain);
      param.append("sql", this.sqlMain);
      this.$executeRequest.uploadFile('/H/market/getIfRelationDatabase',param).then(((res) => {
        this.ifRelationDatabase = res.data;
      }))
    },
    getifrelationdatabase2() {
      this.$executeRequest.execGetByModulName('/market/getIfRelationDatabase2',{
        "datatable_id": this.datatable_id,
      }).then(((res) => {
        if(res && res.success){
          this.ifRelationDatabase = res.data;
        }
      }))
    },
    gettablename() {
      this.$executeRequest.execGetByModulName('/market/getTableName',{
        "datatable_id": this.datatable_id
      }).then(((res) => {
        if(res && res.success){
          this.tablename = res.data.datatable_en_name;
          this.pre_partition = res.data.pre_partition;
        }
      }))
    },
    checkifrepeat() {
      if (this.ifrepeat === "true" || this.ifrepeat === true) {
        this.$executeRequest.execGetByModulName('/market/getTableIdFromSameNameTableId',{
          "datatable_id": this.datatable_id
        }).then((res) => {
          if(res && res.success){
            let tmpdatatable_id = res.data[0].datatable_id;
            this.getcolumnfromdatabase(tmpdatatable_id);
            this.getfromcolumnlist(tmpdatatable_id);
            this.iflock = true;
          }
        });
      }
    },
    getifhbase() {
      this.$executeRequest.execGetByModulName('/market/getIfHbase',{
        "datatable_id": this.datatable_id
      }).then(((res) => {
        if(res && res.success){
          this.ifhbase = res.data;
        }
      }))
    },
    gettreeData() {
      this.$executeRequest.execGetByModulName('/market/getTreeDataInfo').then(res => {
        if(res && res.success){
          this.setCheckboxFalse(res.data);
          this.treedata = res.data;
          console.log(res.data)
        }
      });
    },
    setCheckboxFalse(list){
      for(var i =0 ;i < list.length;i++){
        list[i].checkbox = false;
        if(list[i].children &&list[i].children.length>0){
          this.setCheckboxFalse(list[i].children);
        }
      }
    },
    getquerysql() {
      let params = {
        "datatable_id": this.datatable_id,
      };
      this.$executeRequest.execGetByModulName('/market/getQuerySql',params).then((res) => {
        if(res && res.success){
          this.$refs.sqleditormain.editor.setValue(this.$Secret.Decrypt(res.data))

          this.formaterSql(res.data)
          this.sqlMain = res.data
        }
      })
    },
    getcolumnfromdatabase(datatable_id) {
      let params = {
        "datatable_id": datatable_id,
      };
      this.$executeRequest.execGetByModulName('/market/getColumnFromDatabase',params).then((res) => {
        if(res && res.success){
          // this.columnbysql = res.data;
          this.formData.tableData = res.data;
        }
      })
    },
    getfromcolumnlist(datatable_id) {
      let params = {
        "datatable_id": datatable_id,
      };
      this.$executeRequest.execGetByModulName('/market/getFromColumnList',params).then((res) => {
        if(res && res.success){
          this.allfromcolumn = res.data;
        }
      })
    },
    getcolumnbysql() {
      // this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      const sqlMainCopy = JSON.parse(JSON.stringify(this.sqlMain));
      if (sqlMainCopy === '') {
        this.$Msg.customizTitle('查询sql不能为空!', 'warning');
      } else {
        let param = new FormData();
        param.append("querysql", this.sqlMain);
        param.append("datatable_id", this.datatable_id);
        param.append("sqlparameter", this.sqlparameter);
        this.$executeRequest.uploadFile('/H/market/getColumnBySql',param).then(((res) => {
          if (res && res.success) {
            this.allfromcolumn = res.data.columnlist;
            // this.columnbysql = res.data.result;
            this.formData.tableData= res.data.result;
            let tmp_field_type = this.formData.tableData[0].field_type;
            let flag = true;
            //向allfield_type放入默认选中的类型
            for (var i = 0; i < this.allfield_type.length; i++) {
              if (tmp_field_type === this.allfield_type[i].target_type) {
                flag = false;
                break;
              }
            }
            if (flag) {
              this.allfield_type.push({
                "target_type": tmp_field_type
              });
            }
          }
        }))
        this.getifrelationdatabase();
      }
    },
    // 根据SQL查询数据
    getdatabysql() {
      // this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      const sqlMainCopy = JSON.parse(JSON.stringify(this.sqlMain));
      if (sqlMainCopy === '') {
        this.$Msg.customizTitle('查询sql不能为空,请先点击sql预览!', 'warning');
      } else {
        this.databysql = [];
        let param = new FormData();
        param.append("querysql", this.$Secret.Encrypt(this.sqlMain));
        param.append("sqlparameter", this.sqlparameter);
        this.$executeRequest.uploadFile('/H/market/getDataBySQL',param).then((res) => {
          if(res && res.success){
            this.querydatadialogshow = true;
            this.databysql = res.data;
          }
        });
      }
    },
    getcolumnmore() {
      this.$executeRequest.execGetByModulName('/market/getColumnMore',{
        "datatable_id": this.datatable_id
      }).then((res) => {
        if(res && res.success){
          this.columnmore = res.data;
          res.data.forEach((item) => {
            this.$Code.getValue({
              category: "StoreLayerAdded",
              code: item.dsla_storelayer,
            }).then((res) => {
              item.dsla_storelayer = res.data;
            });
          });
          this.columnmore = res.data;
        }
      });
    },
    changecolumnfiledproccess(row) {
      if (row.field_process !== '3') {
        row.process_para = "";
      } else {
        row.process_para = 0;
      }
    },
    getallfield_type() {
      this.$executeRequest.execGetByModulName('/market/getAllField_Type',{
        "datatable_id": this.datatable_id
      }).then((res) => {
        if(res && res.success){
          this.allfield_type = res.data;
        }
      });
    },
    getallfield_process() {
      this.$Code.getCategoryItems({
        'category': 'ProcessType'
      }).then(res => {
        this.allfield_process = res.data
      })
    },
    prenext() {
      this.hbasesort = [];
      let ifhasrowkeyflag = false;
      if (this.ifhbase) {
        // for (var i = 0; i < this.columnbysql.length; i++) {
        for(var i = 0;i < this.formData.tableData.length;i++){
          // var everyrow = this.columnbysql[i];
          var everyrow = this.formData.tableData[i];
          if (everyrow.hasOwnProperty("rowkey") && everyrow.rowkey === true) {
            ifhasrowkeyflag = true;
            this.hbasesort.push({
              "field_en_name": everyrow.field_en_name
            })
          }
        }
        if (!ifhasrowkeyflag) {
          this.$Msg.confirmMsg('目的地为Hbase,但没有选择rowkey,默认rowkey为全字段的MD5').then(res => {
            this.next();
          }).catch(() => {
          })
        } else {
          this.$executeRequest.execGetByModulName('/market/sortHbae',{
            "hbasesort": JSON.stringify(this.hbasesort),
            "datatable_id": this.datatable_id
          }).then((res) => {
            if(res && res.success){
              this.hbasesort = res.data;
            }
          });
          this.ifhbasesort = true;
        }
      } else {
        // 如果存储层不是hbase,那么预分区键设置为''
        this.pre_partition = '';
        this.next();
      }
    },
    next() {
      let process_mapping;
      let i;
      // this.basicInfoForm.sqlMain = this.$refs.sqleditormain.getmVal();
      if (this.sqlMain === "") {
        this.$Msg.customizTitle('请填写sql!', 'warning');
        return false;
      }
      // if (this.columnbysql.length === 0) {
      if(this.formData.tableData.length === 0){
        this.$Msg.customizTitle('请先点击确定 生成字段', 'warning');
        return false;
      }
      for (i = 0; i < this.formData.tableData.length; i++) {
        const field_en_name = this.formData.tableData[i].field_en_name;
        if (field_en_name.toUpperCase() === 'HYREN_S_DATE' ||
            field_en_name.toUpperCase() === 'HYREN_E_DATE' ||
            field_en_name.toUpperCase() === 'HYREN_MD5_VAL') {
          this.$Msg.customizTitle("请检查最终表中是否存在HYREN字段,如存在,请过滤掉相应HYREN字段", 'warning');
          return false;
        }
        if (field_en_name === "" || field_en_name === undefined) {
          this.$Msg.customizTitle("第" + (i + 1) + "行字段英文名为空", 'warning');
          return false;
        }
        const field_cn_name = this.formData.tableData[i].field_cn_name;
        if (field_cn_name === "" || field_cn_name === undefined) {
          this.$Msg.customizTitle("第" + (i + 1) + "行字段中文名为空", 'warning');
          return false;
        }
        let field_type = this.formData.tableData[i].field_type;

        if (field_type === "" || field_type === undefined) {
          this.$Msg.customizTitle("第" + (i + 1) + "行字段类型名为空", 'warning');
          return false;
        }
        const field_process = this.formData.tableData[i].field_process;
        if (field_process === "" || field_process === undefined) {
          this.$Msg.customizTitle("第" + (i + 1) + "行字段处理方式为空", 'warning');
          return false;
        }

        if (field_process === '4') {
          process_mapping = this.formData.tableData[i].process_mapping;
          if (process_mapping === '' || process_mapping === undefined) {
            this.$Msg.customizTitle("第" + (i + 1) + "行函数映射为空", 'warning');
            return false;
          }
        } else if (field_process === '2') {
          //不进行验证
        } else {
          process_mapping = this.formData.tableData[i].process_mapping;
          let regx = /^\'(\S*)\'$/;
          if (this.checkColumnData.includes(field_type.toLowerCase()) && field_process === '1') {
            if (!regx.test(process_mapping)) {
              this.$Msg.customizTitle("第" + (i + 1) + "行来源值为空填写不正确,请将值使用单引号包裹...", 'warning');
              return false;
            }
          } else {
            if (process_mapping === '' || process_mapping === undefined) {
              this.$Msg.customizTitle("第" + (i + 1) + "行来源值为空", 'warning');
              return false;
            }
          }

        }

        if (field_process === '5') {
          const group_mapping = this.formData.tableData[i].group_mapping;
          if (group_mapping === '' || group_mapping === undefined) {
            this.$Msg.customizTitle("第" + (i + 1) + "行分组映射为空", 'warning');
            return false;
          }
        }

        field_type = this.formData.tableData[i].field_type;
        if (field_type === "decimal" || field_type === "varchar") {
          if (!this.formData.tableData[i].hasOwnProperty("field_length")) {
            this.$Msg.customizTitle("第" + (i + 1) + "行字段类型为" + field_type + "且没有长度，请填写长度", 'warning');
            return false;
          } else {
            var field_length = this.formData.tableData[i].field_length;
            if (field_length === "") {
              this.$Msg.customizTitle("第" + (i + 1) + "行字段类型为" + field_type + "且没有长度，请填写长度", 'warning');
              return false;
            }
          }
        }

      }
      let dm_column_storage = [];
      for (i = 0; i < this.columnmore.length; i++) {
        var dslad_id = this.columnmore[i].dslad_id;
        var dsla_storelayer = this.columnmore[i].dsla_storelayer;
        for (var j = 0; j < this.formData.tableData.length; j++) {
          var everydatatable_field_info = this.formData.tableData[j];
          if (everydatatable_field_info.hasOwnProperty(dsla_storelayer)) {
            if (everydatatable_field_info[dsla_storelayer] === true) {
              dm_column_storage.push({
                "csi_number": j,
                "dslad_id": dslad_id
              })
            }
          }
        }
      }
      let param = {
        datatable_field_info: JSON.stringify(this.formData.tableData),
        datatable_id: this.datatable_id,
        dm_column_storage: JSON.stringify(dm_column_storage),
        querysql: this.sqlMain,
        hbasesort: JSON.stringify(this.hbasesort),
        pre_partition: this.pre_partition,
        
        uuid: this.$route.query.uuid,
        category: this.$route.query.category
      };
      this.$executeRequest.execPostByModulName('/market/addDFInfo',param).then((res) => {
        if (res && res.success) {
          this.$Msg.customizTitle("保存成功", 'success');
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
      })
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
      this.formData.tableData.push(param);
    },
    hbasedowncolumn(val, data) {
      if (val + 1 === this.hbasesort.length) {
        this.$Msg.customizTitle("已经是最后一条，不可下移", 'warning');
      } else {
        let downDate = this.hbasesort[val + 1];
        this.hbasesort.splice(val + 1, 1);
        this.hbasesort.splice(val, 0, downDate);
      }
    },
    hbaseupcolumn(val, data) {
      if (val > 0) {
        let upDate = this.hbasesort[val - 1];
        this.hbasesort.splice(val - 1, 1);
        this.hbasesort.splice(val, 0, upDate);
      } else {
        this.$Msg.customizTitle("已经是第一条，不可上移", 'warning');
      }
    },
    deletecolumn(row) {
      this.formData.tableData.splice(row, 1);
    },
    downcolumn(val, data) {
      if (val + 1 === this.formData.tableData.length) {
        this.$Msg.customizTitle("已经是最后一条，不可下移", 'warning');
      } else {
        let downDate = this.formData.tableData[val + 1];
        this.formData.tableData.splice(val + 1, 1);
        this.formData.tableData.splice(val, 0, downDate);
      }
    },
    upcolumn(val, data) {
      if (val > 0) {
        let upDate = this.formData.tableData[val - 1];
        this.formData.tableData.splice(val - 1, 1);
        this.formData.tableData.splice(val, 0, upDate);
      } else {
        this.$Msg.customizTitle("已经是第一条，不可上移", 'warning');
      }
    },
    dismissifhbasesort() {
      this.ifhbasesort = false;
    },
    changesql() {
      let sql = "select ";
      for (let i = 0; i < this.tablecolumn.length; i++) {
        if (this.tablecolumn[i].selectionstate === true) {
          sql += this.tablecolumn[i].column_name + ","
        }
      }
      sql = sql.substr(0, sql.length - 1);
      sql += " from " + this.sqltablename;
      this.sqlMain = sql;
      // this.$refs.sqleditormain.setmVal(this.$Secret.Decrypt(res.data))
      // this.formaterSql(res.data)
      // this.basicInfoForm.sqlMain = res.data
      
      // const formatter = sqlFormatter.format(this.$Secret.Decrypt(res.data));
      // let dom = this.$refs.sqleditor;
      // dom.editor.setValue(formatter);
      // this.sqlMain = formatter;
      // this.$refs.sqleditormain.setmVal(sqlRelation)
      // this.$refs.sqleditormain.setmVal(sqlRelation)
      // this.$refs.sqleditormain.setmVal(sql)
      this.$refs.sqleditormain.editor.setValue(sqlRelation);
      this.$refs.sqleditormain.editor.setValue(sql);

      this.formaterSql(sql)
      this.iftablecolumn = false;
      this.Allis_selectionstate = false;
    },
    dismissiftablecolumn() {
      this.iftablecolumn = false;
      this.Allis_selectionstate = false;
    },
    Allis_selectionstateFun() {
      if (this.Allis_selectionstate) {
        this.tablecolumn.forEach(data => {
          data.selectionstate = true;
        });
      } else {
        this.tablecolumn.forEach(data => {
          data.selectionstate = false;
        });
      }
    },
    evercheck(val, name) {
      let count = 0
      if (this.Allis_selectionstate === true) {
        for (let i = 0; i < this.tablecolumn.length; i++) {
          if (this.tablecolumn[i].selectionstate === true) {
            count++
          }
        }
        this.Allis_selectionstate = count === this.tablecolumn.length;
      } else {
        this.Allis_selectionstate = false;
      }
    },
    getpreandafterjob() {
      this.$executeRequest.execGetByModulName('/market/getPreAndAfterJob',{
        "datatable_id": this.datatable_id
      }).then((res) => {
        if (res && res.success) {
          if (res.data.post_work && res.data.post_work !== '') {
            this.afterJobForm.sqlMain = res.data.post_work;
            // this.$refs.sqleditormain.setmVal(this.$Secret.Decrypt(res.data))
            // this.formaterSql(res.data)
            // this.basicInfoForm.sqlMain = res.data
            
            // const formatter = sqlFormatter.format(this.$Secret.Decrypt(res.data));
            // let dom = this.$refs.sqleditor;
            // dom.editor.setValue(formatter);
            // this.sqlMain = formatter;
            // this.$refs.sqleditormain.setmVal(sqlRelation)
            // this.$refs.sqleditorafter.setmVal(this.afterJobForm.sqlMain)
            this.$refs.sqleditorafter.editor.setValue(this.afterJobForm.sqlMain);
          }
          if (res.data.pre_work &&res.data.pre_work !== '') {
            this.preJobForm.sqlMain = res.data.pre_work;
            // this.$refs.sqleditormain.setmVal(this.$Secret.Decrypt(res.data))
            // this.formaterSql(res.data)
            // this.basicInfoForm.sqlMain = res.data
            
            // const formatter = sqlFormatter.format(this.$Secret.Decrypt(res.data));
            // let dom = this.$refs.sqleditor;
            // dom.editor.setValue(formatter);
            // this.sqlMain = formatter;
            // this.$refs.sqleditormain.setmVal(sqlRelation)
            // this.$refs.sqleditorpre.setmVal(this.preJobForm.sqlMain)
            this.$refs.sqleditorpre.editor.setValue(this.repJobForm.sqlMain);
          }
        }
      });
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
      if (this.$refs.sqleditorpre !== undefined && this.$refs.sqleditorpre !== '') {
        this.preJobForm.sqlMain = this.$refs.sqleditorpre.getmVal();
      }
      this.$executeRequest.execGetByModulName('/market/savePreJob',{
        "pre_work": this.$Secret.Encrypt(this.preJobForm.sqlMain),
        "datatable_id": this.datatable_id
      }).then((res) => {
        if (res && res.success) {
          this.ifprejob = false;
        }
      });
    },
    // 保存后置作业
    saveAfterJob() {
      if (this.$refs.sqleditorafter !== undefined && this.$refs.sqleditorafter !== '') {
        this.afterJobForm.sqlMain = this.$refs.sqleditorafter.getmVal();
      }
      this.$executeRequest.execGetByModulName('/market/saveAfterJob',{
        "post_work": this.$Secret.Encrypt(this.afterJobForm.sqlMain),
        "datatable_id": this.datatable_id
      }).then((res) => {
        if (res && res.success) {
          this.ifafterjob = false;
        }
      });
    },
    // 选择列触发事件
    handleSelectionColumn(row) {
      row.forEach(itme => {
        itme['selectionstate'] = true
      })
    },
    changeTextareaQuerySql(val) {
      this.sqlMain = val;
      // this.$set(this.basicInfoForm, 'sqlMain', val)
    },
    changeTextareaAfterSql(val) {
      this.$set(this.afterJobForm, 'sqlMain', val)
    },
    changeTextareaPreSql(val) {
      this.$set(this.preJobForm, 'sqlMain', val)
    },
    // 格式化sql
    formaterSql(val) {
      // this.$refs.sqleditormain.sqlFormatter()
      let dom = this.$refs.sqleditormain;
      dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
    },
    // 树选择表显示
    choiceTable(e, data) {
      if (e) {
        var flag = true;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].file_id === data.file_id) {
            flag = false;
            console.log("this.tableData[i].file_id === data.file_id")
            console.log(this.tableData[i].file_id)
            console.log(data.file_id)
            break;
          }
        }
        if(flag){
          this.tableData.push(data)
        }
      } else {
        if (this.tableData.length > 0) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].file_id === data.file_id) {
              this.tableData.splice(i, 1)
              break;
            }
          }
        }
      }
      console.log("data.checkbox = "+e)
      data.checkbox = e;
      let arr = [];
      this.tableData.forEach(item => arr.push(item.hyren_name));
      this.sqlRelationForm.tableNames = arr;
    },
    // 选择所有表
    choiceAllTable(e, data) {
      console.log("choiceAllTable")
      console.log(e)
      console.log(data)
      console.log(data.table_name+","+data.label+",")
      if(data.children && data.children.length>0){
        data.children.forEach(node=>{
          //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
          if(node.file_id && node.file_id != ''){
            this.choiceTable(e,node);
          }else{
            this.choiceAllTable(e,node);
            node.checkbox = e;
          }
        })
      }
      // if (e) {
      //   if (data.children != null && data.children.length >0) {
      //     data.children.forEach(node => {
      //       console.log(node)
      //       //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
      //       if (node.file_id && node.file_id != "") {
      //         // this.tableData.push(element);
      //         this.choiceTable(e,node)
      //       }else{
      //         this.choiceAllTable(e,node);
      //       }
      //     });
      //   }
      // } else {
      //   if (this.tableData.length > 0) {
      //     var intersection = [];
      //     for (let i = 0; i < this.tableData.length; i++) {
      //       if (data.children != null && data.children.length >0 ) {
      //         data.children.forEach(node => {
      //           //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点从数据展示区删除
      //           if (node.file_id !=null && node.file_id != "") {
      //             // if (this.tableData[i].file_id == node.file_id) {
      //             //   // this.tableData.splice(i, 1)
      //             // }
      //             this.choiceAllTable(e,node);
      //           }else{
      //             this.choiceTable(e,intersection[i]);
                  
      //           }
      //         });
      //       }
      //     }
      //     // intersection.push(node);
      //     // for(var i = 0 ;i<intersection.length;i++){
      //     // }
      //   }
      // }
      let arr = [];
      this.tableData.forEach(item => arr.push(item.hyren_name));
      this.sqlRelationForm.tableNames = arr;
    },
    // 树右键复制代码
    rightClick(MouseEvent, object, Node, element) {
      if (Node.data.file_id.length > 0) {
        this.copydata = Node.label;
        this.menuVisible = false;
        this.menuVisible = true;
        const menu = document.querySelector('#menu');
        document.addEventListener('click', this.foo);
        menu.style.display = "block";
        menu.style.left = MouseEvent.pageX + 20 + 'px';
        menu.style.top = MouseEvent.pageY - 8 + 'px';
      } else {
        return false;
      }
    },
    // 复制代码
    copydatas() {
      let tableName = this.copydata;
      let oInput = document.createElement('input');
      oInput.value = tableName;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.remove();
    },
    // 右键复制事件监听
    foo() {
      this.menuVisible = false
      document.removeEventListener('click', this.foo) //关闭事件监听
    },
    // 节点搜索
    filterNode(value, data) {
      // 如果检索内容为空,直接返回
      if (!value) return true;
      // 如果传入的value和data中的name相同说明是匹配到了,匹配时转小写匹配
      // 检索内容为 original_name table_name hyren_name
      if (data.file_id && data.file_id !== '') {
        return (
            (data.original_name && data.original_name !== '' && data.original_name.indexOf(value) !== -1) ||
            (data.table_name && data.table_name !== '' && data.table_name.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
            (data.hyren_name && data.hyren_name !== '' && data.hyren_name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        )

      }
    },
    settingRule(index) {
      this.setRow = this.formData.tableData[index]
      this.$executeRequest.execGetByModulName('/market/getSparkSqlGram').then(res => {
        if(res && res.success){
          this.tableDatalist = res.data
          this.activeName = this.tableDatalist.classify[0]
          this.ruleDialog = true
        }
      })
    },
    saveSetRule() {
      this.setRow['process_mapping'] = this.ruleStr
      this.formData.tableData.slice(this.setRow, 1)
      this.ruleDialog = false
    },
    handleClick(row) {
      this.selectColumn['process_mapping'] = row.value
      this.isShowColumns = false
    },
    showTableColumns(row) {
      this.selectColumn = row;
      this.isShowColumns = true
    },
    // 根据表名获取关联sql信息
    getRelationByTableNames() {
      if (this.sqlRelationForm.tableNames.length === 0) {
        this.$Msg.customizTitle("请先从左侧树选择表", "warning");
        return;
      }
      let param  = this.sqlRelationForm.tableNames;
      this.$executeRequest.execPostByModulName('/market/getRelationByTableNames',param).then(res => {
        if (res && res.success) {
          this.sqlRelations = [];
          this.sqlSelectColumns = res.data.columnList;
          if (res.data.sqlRelations !== '') {
            res.data.sqlRelations.forEach((item) => {
              this.sqlRelations.push({
                'relationSqlPart': item
              });
            })
            this.sqlTotalSize = res.data.sqlRelations.length;
          }
          this.dialogRelationSqlVisible = true;
        }
      })
    },
    //高亮函数
    // highLight(relationSqlPart) {
    //   //根据检索sql关键字进行高亮
    //   let sqlKeyWords = ['INNER', 'JOIN', 'ON', 'LEFT', 'RIGHT','AND','OR'];
    //   sqlKeyWords.forEach(sqlKeyWord => {
    //     if (relationSqlPart && relationSqlPart.length > 0) {
    //       if (!this.containSpecial(sqlKeyWord)) {
    //         const re = new RegExp(sqlKeyWord, "g");
    //         relationSqlPart = relationSqlPart.replace(re, "<b style='color:red'>" + sqlKeyWord + "</b>");
    //       }
    //     }
    //   })
    //   return relationSqlPart;
    // },
    //判断是否包含特殊字符
    containSpecial(sqlKeyWord) {
      const containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\,)(\.)(\/)(\<)(\>)(\?)(\)(\')(\")]+/);
      return (containSpecial.test(sqlKeyWord));
    },
    // 下拉框全选
    selectAll() {
      if (this.checked) {
        let arr = [];
        this.sqlSelectColumns.forEach(item => arr.push(item.column_name));
        this.sqlRelationForm.selectColumns = arr;
      } else {
        this.sqlRelationForm.selectColumns = "";
      }
    },
    // sql预览
    previewSql() {
      if (this.sqlRelationForm.tableNames.length === 0) {
        this.$Msg.customizTitle("请先获取关联关系", "warning");
        return;
      }
      let sqlRelation = "SELECT "
      let selectColumns = this.sqlRelationForm.selectColumns;
      if (selectColumns === '' || selectColumns.length === 0) {
        this.$Msg.customizTitle("请先选择SELECT查询列", "warning");
        return;
      } else {
        sqlRelation = sqlRelation + selectColumns.join(",", selectColumns) + " FROM ";
      }
      if (this.sqlRelationForm.relationSqlPart.length === 0) {
        this.$Msg.customizTitle("请选择至少一个关联sql", "warning");
        return;
      }
      sqlRelation = sqlRelation + this.sqlRelationForm.relationSqlPart[0].mainTableAlias;
      for (let relationSqlPart of this.sqlRelationForm.relationSqlPart) {
        sqlRelation = sqlRelation + relationSqlPart.joinType + relationSqlPart.tableAlias + " ON " + relationSqlPart.onCond;
      }
      if (this.sqlRelationForm.whereColumns !== '') {
        if (this.sqlRelationForm.whereColumns.toUpperCase().indexOf("WHERE") === -1) {
          sqlRelation = sqlRelation + " WHERE " + this.sqlRelationForm.whereColumns + " "
        } else {
          sqlRelation = sqlRelation + this.sqlRelationForm.whereColumns + " "
        }
      }
      if (this.sqlRelationForm.groupColumns !== '') {
        if (this.sqlRelationForm.groupColumns.toUpperCase().indexOf("GROUP BY") === -1) {
          sqlRelation = sqlRelation + " GROUP BY " + this.sqlRelationForm.groupColumns + " "
        } else {
          sqlRelation = sqlRelation + this.sqlRelationForm.groupColumns + " "
        }
      }
      if (this.sqlRelationForm.orderColumns !== '') {
        if (this.sqlRelationForm.orderColumns.toUpperCase().indexOf("ORDER BY") === -1) {
          sqlRelation = sqlRelation + " ORDER BY " + this.sqlRelationForm.orderColumns + " "
        } else {
          sqlRelation = sqlRelation + this.sqlRelationForm.orderColumns + " "
        }
      }
      // this.$refs.sqleditormain.setmVal(this.$Secret.Decrypt(res.data))
      // this.formaterSql(res.data)
      // this.basicInfoForm.sqlMain = res.data
      
      // const formatter = sqlFormatter.format(this.$Secret.Decrypt(res.data));
      // let dom = this.$refs.sqleditor;
      // dom.editor.setValue(formatter);
      // this.sqlMain = formatter;
      // this.$refs.sqleditormain.setmVal(sqlRelation)
      this.$refs.sqleditormain.editor.setValue(sqlRelation)
      this.sqlMain = sqlRelation;
    },
    //关联sql实现分页功能
    handleSqlCurrentChange(currPage) {
      //把val赋给当前页面
      this.sqlCurrPage = currPage;
    },
    // 关联sql改变每页显示条数
    handleSqlSizeChange(pageSize) {
      this.sqlPageSize = pageSize;
    },
    // sql关联表格单选行
    handleCurrentRowChange() {
      this.checked = false;
      this.sqlRelationForm.selectColumns = [];
      this.sqlRelationForm.currentSqlRow = this.currentSqlRow;
      this.sqlRelationForm.relationSqlPart = [];
      let separator = " INNER JOIN ";
      let split = this.currentSqlRow.split(separator);
      let arr = [];
      for (let i = 0; i < split.length; i++) {
        let split1 = split[i].split(" ON ");
        for (let s of split1) {
          arr.push(s);
        }
      }
      let tables = []
      for (let i = 0; i < arr.length; i++) {
        if (i === 0 || i % 2 !== 0) {
          // 按空格分割表名与表别名
          tables.push(arr[i].split(" ")[0]);
        }
      }
      let columnList = [];
      for (let column of this.sqlSelectColumns) {
        if (tables.indexOf(column.table_name) !== -1) {
          columnList.push(column);
        }
      }
      let sqlPart = {};
      sqlPart['mainTableAlias'] = arr[0];
      sqlPart['tableAlias'] = arr[1];
      sqlPart['onCond'] = arr[2];
      sqlPart['joinType'] = separator;
      this.sqlRelationForm.relationSqlPart.push(sqlPart);
      if (arr.length > 3) {
        const number = (arr.length - 3) / 2;
        for (let i = 0; i < number; i++) {
          let sqlPart = {};
          sqlPart['tableAlias'] = arr[2 * i + 3];
          sqlPart['onCond'] = arr[2 * i + 4];
          sqlPart['joinType'] = separator;
          this.sqlRelationForm.relationSqlPart.push(sqlPart);
        }
      }
      this.sqlSelectColumns = columnList;
      this.dialogRelationSqlVisible = false
    },
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 5px;
}

.textasql >>> .CodeMirror {
  height: 200px !important;
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

.rightbtn {
  float: right;
}

.leftbtn {
  float: left;
  margin-bottom: 10px;
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
#dbmFkInfoTab .tooltipHelp {
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
  left: 0;
  top: 0;
  font-size: 14px;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  z-index: 100;
  cursor: pointer;
}

::v-deep .el-tree-node {
  position: relative;
  /* padding-left: 20px; */
}
::v-deep .el-tree-node__children {
  padding-left: 16px;
  overflow: visible;
  .el-tree-node {
    &:nth-child(1)::before {
      content: "";
      height: 54%;
      width: 1px;
      position: absolute;
      left: -3px;
      top: -1px;
      border-width: 1px;
      border-left: 1px solid #ccc;
    }
  }
  .is-expanded::before {
    height: 100% !important;
  }
}


</style>
