<template>
  <div id="ruleInfo" class="px-20 codeManage box-sizing" style="width: 100%">
    <el-row class="mb-10">
      <span>{{ ruleTitle }}规则信息</span>
      <el-button type="primary" size="small" class="goIndex" @click="ret">
        返回规则配置
      </el-button>
      <el-button
        type="success"
        size="small"
        class="fr"
        style="margin-right: 5px"
        @click="saveRuleData('form_dq_data')"
      >
        保存
      </el-button>
    </el-row>
    <el-row>
      <el-form
        :model="form_dq_data"
        ref="form_dq_data"
        :inline="true"
        size="mini"
        label-position="lift"
        label-width="auto"
      >
        <el-collapse v-model="collapse_names">
          <el-collapse-item title="基本信息" name="基本信息">
            <div slot="title">
              <el-button type="text" class="el-icon-edit">基本信息</el-button>
            </div>
            <el-row>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则名称 :"
                  prop="reg_name"
                  :title="dq_help_info_map.regName"
                  :rules="rule.default"
                >
                  <el-input
                    v-model="form_dq_data.reg_name"
                    clearable
                    placeholder="规则名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则级别 :"
                  prop="flags"
                  :title="dq_help_info_map.flag"
                  :rules="rule.selected"
                >
                  <el-select
                    v-model="form_dq_data.flags"
                    filterable
                    placeholder="请选择"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="i in ed_rule_level_s"
                      :key="i.code"
                      :value="i.code"
                      :label="i.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则来源 :"
                  prop="rule_src"
                  :title="dq_help_info_map.ruleSrc"
                >
                  <el-input
                    v-model="form_dq_data.rule_src"
                    clearable
                    placeholder="规则来源"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="1">
                <el-form-item label="加载策略 :" prop="load_strategy">
                  <el-input
                    v-model="form_dq_data.load_strategy"
                    clearable
                    placeholder="加载策略"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item label="分组序号 :" prop="group_seq">
                  <el-input
                    v-model="form_dq_data.group_seq"
                    clearable
                    placeholder="分组序号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则标签 :"
                  prop="rule_tag"
                  :title="dq_help_info_map.ruleTag"
                >
                  <el-input
                    v-model="form_dq_data.rule_tag"
                    clearable
                    placeholder="规则标签"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="配置信息" name="配置信息">
            <div slot="title">
              <el-button type="text" class="el-icon-edit">配置信息</el-button>
            </div>
            <el-row v-if="form_dq_data.case_type !== 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则类型 :"
                  prop="case_type"
                  :title="dq_help_info_map.ruleType"
                  :rules="rule.selected"
                >
                  <el-select
                    v-model="form_dq_data.case_type"
                    clearable
                    :rules="filter_rules([{ required: true }])"
                    @change="caseTypeChange(form_dq_data.case_type)"
                    filterable
                    placeholder="请选择"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="i in dq_rule_def_s"
                      :key="i.case_type"
                      :value="i.case_type"
                      :label="i.case_type + ' : ' + i.case_type_desc"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <template v-if="!check_target_tab">
                  <el-form-item
                    label="目标表名 :"
                    prop="target_tab"
                    :title="dq_help_info_map.targTab"
                    :rules="rule.selected"
                  >
                    <el-input
                      v-model="form_dq_data.target_tab"
                      clearable
                      placeholder="目标表名"
                      :disabled="!check_target_tab"
                      style="10vw"
                    >
                      <el-button
                        @click="showDataSource('target_tab', check_target_tab)"
                        slot="append"
                        >数据源</el-button
                      >
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template v-if="!check_target_key_fields">
                  <el-form-item
                    label="目标字段 :"
                    prop="target_key_fields"
                    :title="dq_help_info_map.fields"
                    :rules="rule.selected"
                  >
                    <el-input
                      v-model="form_dq_data.target_key_fields"
                      clearable
                      placeholder="目标表字段"
                      :disabled="!check_target_key_fields"
                    >
                      <el-button
                        @click="
                          selectFieldClick(
                            'target_tab',
                            check_target_key_fields
                          )
                        "
                        slot="append"
                        >选择字段</el-button
                      >
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="form_dq_data.case_type !== 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <template v-if="!check_limit_condition">
                  <el-form-item
                    label="过滤条件 :"
                    prop="check_limit_condition"
                    :title="dq_help_info_map.limit"
                  >
                    <el-input
                      v-model="form_dq_data.check_limit_condition"
                      :disabled="check_limit_condition"
                      clearable
                      placeholder="过滤条件"
                    />
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7">
                <template v-if="!check_opposite_tab">
                  <el-form-item
                    label="比对表名 :"
                    prop="opposite_tab"
                    :title="dq_help_info_map.opTab"
                  >
                    <el-input
                      v-model="form_dq_data.opposite_tab"
                      :disabled="!check_opposite_tab"
                      clearable
                      placeholder="比对表名"
                    >
                      <el-button
                        slot="append"
                        @click="
                          showDataSource('opposite_tab', check_opposite_tab)
                        "
                      >
                        数据源
                      </el-button>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template v-if="!check_opposite_tab">
                  <el-form-item
                    label="比对字段 :"
                    prop="opposite_key_fields"
                    :title="dq_help_info_map.opField"
                  >
                    <el-input
                      v-model="form_dq_data.opposite_key_fields"
                      clearable
                      :disabled="!check_opposite_tab"
                      placeholder="比对字段"
                    >
                      <el-button
                        slot="append"
                        @click="
                          selectFieldClick('opposite_tab', check_opposite_tab)
                        "
                      >
                        选择字段
                      </el-button>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="form_dq_data.case_type !== 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <template v-if="!check_range_val">
                  <el-form-item
                    label="范围最小值 :"
                    prop="range_min_val"
                    :title="dq_help_info_map.min"
                    :rules="rule.default"
                  >
                    <el-input
                      v-model="form_dq_data.range_min_val"
                      placeholder="范围最小值"
                    />
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7">
                <template v-if="!check_range_val">
                  <el-form-item
                    label="范围最大值 :"
                    prop="range_max_val"
                    :title="dq_help_info_map.max"
                    :rules="rule.default"
                  >
                    <el-input
                      v-model="form_dq_data.range_max_val"
                      placeholder="范围最大值"
                    />
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template v-if="!check_list_vals">
                  <el-form-item
                    label="清单值域 :"
                    prop="list_vals"
                    :title="dq_help_info_map.listVals"
                    :rules="rule.default"
                  >
                    <el-input
                      v-model="form_dq_data.list_vals"
                      :disabled="check_list_vals"
                      clearable
                      placeholder="清单值域"
                    />
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="form_dq_data.case_type === 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="规则类型 :"
                  prop="case_type"
                  :title="dq_help_info_map.ruleType"
                  :rules="rule.selected"
                >
                  <el-select
                    v-model="form_dq_data.case_type"
                    clearable
                    :rules="filter_rules([{ required: true }])"
                    @change="caseTypeChange(form_dq_data.case_type)"
                    filterable
                    placeholder="请选择"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="i in dq_rule_def_s"
                      :key="i.case_type"
                      :value="i.case_type"
                      :label="i.case_type + ' : ' + i.case_type_desc"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <template v-if="!check_target_tab">
                  <el-form-item
                    label="总表表名 :"
                    prop="sum_table"
                    :title="dq_help_info_map.targTab"
                  >
                    <el-input
                      v-model="form_dq_data.sum_table"
                      clearable
                      placeholder="总表表名"
                      disabled
                    >
                      <el-button
                        @click="showDataSource('sum_table', check_target_tab)"
                        slot="append"
                      >
                        数据源
                      </el-button>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template v-if="!check_target_key_fields">
                  <el-form-item
                    label="总表校验字段 :"
                    prop="sum_fields"
                    :title="dq_help_info_map.fields"
                  >
                    <el-input
                      v-model="form_dq_data.sum_fields"
                      clearable
                      placeholder="总表校验字段"
                      disabled
                    >
                      <el-button
                        @click="
                          selectFieldClick('sum_table', check_target_key_fields)
                        "
                        slot="append"
                      >
                        选择字段
                      </el-button>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="form_dq_data.case_type === 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <template>
                  <el-form-item
                    label="总表关联字段 :"
                    prop="total_corr_fields"
                    :title="dq_help_info_map.fields"
                  >
                    <el-input
                      v-model="form_dq_data.total_corr_fields"
                      clearable
                      placeholder="总表关联字段"
                      disabled
                    >
                      <el-button
                        @click="
                          selectFieldClick(
                            'total_corr_fields',
                            check_target_key_fields
                          )
                        "
                        slot="append"
                      >
                        选择字段
                      </el-button>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template>
                  <el-form-item
                    label="总表过滤条件 :"
                    prop="total_filter_fields"
                    :title="dq_help_info_map.limit"
                  >
                    <el-input
                      v-model="form_dq_data.total_filter_fields"
                      clearable
                      placeholder="总表过滤条件"
                    />
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <template>
                  <el-form-item
                    label="分表表名 :"
                    prop="sub_table"
                    :title="dq_help_info_map.targTab"
                  >
                    <el-input
                      v-model="form_dq_data.sub_table"
                      clearable
                      placeholder="分表表名"
                      disabled
                    >
                      <el-button
                        @click="showDataSource('sub_table', check_target_tab)"
                        slot="append"
                        >数据源</el-button
                      >
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="form_dq_data.case_type === 'TOTAL SCORE'">
              <el-col :span="7" :offset="1">
                <template>
                  <el-form-item
                    label="分表校验字段 :"
                    prop="sub_fields"
                    :title="dq_help_info_map.fields"
                  >
                    <el-input
                      v-model="form_dq_data.sub_fields"
                      clearable
                      placeholder="分表校验字段"
                      disabled
                    >
                      <el-button
                        @click="
                          selectFieldClick(
                            'sub_fields',
                            check_target_key_fields
                          )
                        "
                        slot="append"
                        >选择字段</el-button
                      >
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>
              <el-col :span="7" :offset="1">
                <el-form-item
                  label="分表分组字段 :"
                  prop="sub_group_fields"
                  :title="dq_help_info_map.ruleType"
                >
                  <el-input
                    v-model="form_dq_data.sub_group_fields"
                    clearable
                    placeholder="分表分组字段"
                    disabled
                  >
                    <el-button
                      @click="
                        selectFieldClick(
                          'sub_group_fields',
                          check_target_key_fields
                        )
                      "
                      slot="append"
                      >选择字段</el-button
                    >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <template>
                  <el-form-item
                    label="分表过滤条件 :"
                    prop="sub_filter_fields"
                    :title="dq_help_info_map.limit"
                  >
                    <el-input
                      v-model="form_dq_data.sub_filter_fields"
                      clearable
                      placeholder="分表过滤条件"
                    />
                  </el-form-item>
                </template>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="结果信息" name="结果信息">
            <div slot="title">
              <el-button type="text" class="el-icon-edit">结果信息</el-button>
            </div>
            <div>
              <el-row style="margin-top: 10px; margin-bottom: 5px">
                <el-col :span="2" :offset="1">
                  <span :title="dq_help_info_map.sql"
                    >检测sql<i class="el-icon-warning"
                  /></span>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-checkbox
                    true-label="1"
                    false-label="0"
                    v-model="form_dq_data.is_saveindex1"
                  >
                    保存不在范围内的记录数
                  </el-checkbox>
                </el-col>
                <el-col :span="12" :offset="1">
                  <el-checkbox
                    v-if="
                      form_dq_data.case_type !== 'TAB NAN' &&
                      form_dq_data.case_type !== 'COL REGULAR'
                    "
                    true-label="1"
                    false-label="0"
                    v-model="form_dq_data.is_saveindex2"
                  >
                    保存检查总记录数
                  </el-checkbox>
                </el-col>
                <el-col :span="1" :offset="1">
                  <el-button
                    @click="specifySqlCheck(form_dq_data.specify_sql)"
                    size="mini"
                    type="primary"
                    round
                    >检测
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22" :offset="1">
                  <el-input
                    type="textarea"
                    autosize
                    :disabled="check_sql_input"
                    v-model="form_dq_data.specify_sql"
                  />
                </el-col>
              </el-row>
            </div>
            <div v-if="form_dq_data.case_type !== 'TAB NAN'">
              <el-row style="margin-top: 10px; margin-bottom: 5px">
                <el-col :span="3" :offset="1">
                  <span :title="dq_help_info_map.errSql"
                    >问题数据sql<i class="el-icon-warning"
                  /></span>
                </el-col>
                <el-col :span="16" :offset="1">
                  <el-checkbox
                    true-label="1"
                    false-label="0"
                    v-model="form_dq_data.is_saveindex3"
                  >
                    保存明细数据
                  </el-checkbox>
                </el-col>
                <el-col :span="1" :offset="1">
                  <el-button
                    @click="errDataSqlCheck(form_dq_data.err_data_sql)"
                    size="mini"
                    type="primary"
                    round
                    >检测
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22" :offset="1">
                  <el-input
                    type="textarea"
                    autosize
                    :disabled="problem_data_sql_input"
                    v-model="form_dq_data.err_data_sql"
                  />
                </el-col>
              </el-row>
            </div>
            <div>
              <el-row style="margin-top: 10px; margin-bottom: 5px">
                <el-col :span="7" :offset="1">
                  <span class="control-label" :title="dq_help_info_map.index1"
                    >检测指标1含义<i class="el-icon-warning"
                  /></span>
                  <el-input
                    :disabled="check_index_desc"
                    v-model="form_dq_data.index_desc1"
                  />
                </el-col>
                <el-col :span="7" :offset="1">
                  <span class="control-label" :title="dq_help_info_map.index2"
                    >检测指标2含义 <i class="el-icon-warning"
                  /></span>
                  <el-input
                    :disabled="check_index_desc"
                    v-model="form_dq_data.index_desc2"
                  />
                </el-col>
                <el-col :span="6" :offset="1">
                  <span class="control-label" :title="dq_help_info_map.index3"
                    >检测指标3含义 <i class="el-icon-warning"
                  /></span>
                  <el-input
                    :disabled="check_index_desc"
                    v-model="form_dq_data.index_desc3"
                  />
                </el-col>
              </el-row>
            </div>
            <div>
              <el-row style="margin-top: 10px; margin-bottom: 5px">
                <el-col :span="3" :offset="1">
                  <span>规则描述</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22" :offset="1">
                  <el-input
                    type="textarea"
                    autosize
                    v-model="form_dq_data.remark"
                  />
                </el-col>
              </el-row>
            </div>
            <div v-if="operation_type === 'edit'">
              <el-row style="margin-top: 10px; margin-bottom: 5px">
                <el-col :span="3" :offset="1">
                  <span>调度作业信息</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22" :offset="1"> </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-row>
    <!-- 弹出数据源选择模态框 start-->
    <el-dialog
      title="选择数据表"
      :visible.sync="data_source_dialog"
      :close-on-click-modal="false"
      width="80%"
    >
      <el-row :gutter="24">
        <el-col
          class="borderStyleTree"
          :span="9"
          style="margin-right: 10px; height: 60vh; overflow: auto"
        >
          <div style="height: 0.1px">&nbsp;</div>
          <Scrollbar style="padding-left: 10%">
            <div class="mytree">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" />
              <el-tree
                class="filter-tree"
                :data="dataSourceTreeData"
                :indent="0"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                ref="tree"
              >
                <span class="span-ellipsis" slot-scope="{ node, data }">
                  <span :title="data.description" v-if="data.file_id">
                    <i class="el-icon-document"></i>
                    <template v-if="data.original_name">{{
                      data.original_name
                    }}</template>
                    <template
                      v-else-if="
                        data.original_name === '' && data.table_name !== ''
                      "
                      >{{ data.table_name }}</template
                    >
                    <template v-else>{{ data.hyren_name }}</template>
                  </span>
                  <span :title="data.description" v-else>
                    <i class="el-icon-folder-opened"></i>{{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </Scrollbar>
        </el-col>
        <el-col
          class="borderStyleTabel"
          :span="14"
          style="margin-right: 10px; height: 60vh; overflow: auto"
        >
          <el-table
            :data="table_data"
            size="mini"
            style="margin-top: 20px"
            height="90%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            />
            <el-table-column
              prop="hyren_name"
              label="表英文名"
              align="center"
            />
            <el-table-column
              prop="original_name"
              label="表中文名"
              align="center"
            />
            <el-table-column prop="file_id" label="选择" align="center">
              <template slot-scope="scope">
                <el-radio v-model="table_data_radio" :label="scope.row">{{
                  ""
                }}</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <span style="float: right; margin-right: 10px">
          <el-button
            size="small"
            @click="data_source_dialog = false"
            style="margin-right: 5px"
          >
            取消
          </el-button>
          <el-button type="primary" size="small" @click="saveTableName">
            确定
          </el-button>
        </span>
      </el-row>
    </el-dialog>
    <!-- 弹出数据源选择模态框 end-->

    <!-- 弹出字段选择选择模态框 start-->
    <el-dialog
      title="选择数据表字段"
      :visible.sync="table_fields_dialog"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col style="min-height: 400px">
          <el-table
            :data="table_fields_info"
            @selection-change="handleFieldSelectionChange"
            >>
            <el-table-column
              type="selection"
              label="选择"
              width="70"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="column_name" label="字段名" align="center" />
            <el-table-column
              prop="column_ch_name"
              label="字段描述"
              align="center"
            />
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-button type="primary" class="goIndex" @click="saveTableFieldsInfo">
          确定
        </el-button>
        <el-button
          class="goIndex"
          size="small"
          @click="table_fields_dialog = false"
          style="margin-right: 5px"
          >取消
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 弹出字段选择选择模态框 end-->

    <!-- 弹出检测结果模态框 start-->
    <el-dialog
      title="检测结果展示"
      :visible.sync="test_result_dialog"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-table
          :data="sysVarCheckBean"
          @selection-change="handleFieldSelectionChange"
          >>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column prop="name" label="变量" align="center" />
          <el-table-column prop="value" label="变量值" align="center" />
          <el-table-column prop="isEff" label="是否有效" align="center" />
        </el-table>
      </el-row>
      <el-row style="margin-top: 5px">
        <i>执行结果 : {{ check_is_success }}</i>
      </el-row>
      <el-row>
        <el-button
          class="goIndex"
          size="mini"
          @click="test_result_dialog = false"
          style="margin-right: 5px; margin-top: 5px"
          >关闭
        </el-button>
      </el-row>
    </el-dialog>
    <!-- 弹出检测结果模态框 end-->
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

export default {
  name: "ruleInfo",
  props: {
    operation_type: {
      type: String,
      default: () => {
        return "";
      },
    },
    reg_num: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      filterText: "",
      //页面变量初始化
      rule: validator.default,
      isLoading: false,
      ruleTitle: "",
      // operation_type: '',
      collapse_names: ["基本信息", "配置信息", "结果信息"],
      form_dq_data: {
        specify_sql: "",
        err_data_sql: "",
        index_desc1: "",
        index_desc2: "",
        index_desc3: "",
        target_tab: "",
        opposite_tab: "",
        target_key_fields: "",
        opposite_key_fields: "",
        sum_table: "",
        sum_fields: "",
        total_filter_fields: "",
        sub_table: "",
        sub_filter_fields: "",
        sub_group_fields: "",
        total_corr_fields: "",
      },
      dq_rule_def_s: [{ case_type: "", case_type_desc: "" }],
      dq_rule_def_map: {},
      store_type_s: [],
      store_type_map: {},
      job_eff_flag_s: [],
      job_eff_flag_map: {},
      ed_rule_level_s: [],
      ed_rule_level_map: {},
      not_range_num: "",
      total_box: "",
      form_dq_data_reg_num: "",
      //存储层bean
      layer_bean: {},
      //系统帮助提示信息
      dq_help_info_s: [
        { help_info_id: "", help_info_desc: "", help_info_dtl: "" },
      ],
      dq_help_info_map: {},
      //数据源模态框相关
      data_source_dialog: false,
      table_fields_dialog: false,
      test_result_dialog: false,
      source_modal_box_type: "",
      field_modal_box_type: "",
      dataSourceTreeData: [],
      target_tab_info: {},
      opposite_tab_info: {},
      sum_table_info: {},
      sub_table_info: {},
      table_data: [],
      table_data_radio: "",
      table_fields_info: [],
      select_fields: [],
      sysVarCheckBean: { name: "", value: "", isEff: "" },
      check_is_success: "",
    };
  },
  created() {
    //获取操作类型 新增,编辑
    if ("edit" === this.operation_type) {
      this.ruleTitle = "编辑";
      // this.operation_type = this.operation_type;
    } else if ("add" === this.operation_type) {
      this.ruleTitle = "新增";
      // this.operation_type = this.$route.query.operation_type;
    } else {
      this.$Msg.customizTitle("操作类型错误!", "info");
    }
    //获取系统帮助提示信息
    this.getDqHelpInfo();
    //获取规则类型数据
    this.getDqRuleDef();
    //获取规则级别标志
    this.getEdRuleLevel();
    //获取存储层类型
    this.getStoreType();
  },
  mounted() {
    //获取页面初始化数据
    if ("" !== this.reg_num) {
      this.getDqDefinition(this.reg_num);
    } else {
      this.$set(this.form_dq_data, "flags", "0");
      // this.form_dq_data.flags = '0';
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      console.log(data.label);
      return data.label.indexOf(value) !== -1;
    },
    //返回上一级
    ret() {
      this.$emit("ret");
    },
    //获取系统帮助提示信息
    getDqHelpInfo() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleconfig/getDqHelpInfo"
        )
        .then((res) => {
          if (res && res.success) {
            this.dq_help_info_s = res.data;
            //处理系统帮助提示信息为map类型,显示
            this.dq_help_info_s.forEach((row) => {
              this.dq_help_info_map[row.help_info_id] = row.help_info_dtl;
            });
          }
        });
    },
    //获取规则类型信息
    getDqRuleDef() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleconfig/getDqRuleDef"
        )
        .then((res) => {
          if (res && res.success) {
            this.dq_rule_def_s = res.data;
            //处理规则类型信息为map类型,显示
            this.dq_rule_def_s.forEach((row) => {
              this.dq_rule_def_map[row.case_type] = row.case_type_desc;
            });
          }
        });
    },
    //获取规则级别标志
    getEdRuleLevel() {
      //获取规则级别标志
      this.$executeRequest
        .execPostByControllerAllMappingNameParams("/K/code/getCategoryItems", {
          category: "EdRuleLevel",
        })
        .then((res) => {
          if (res && res.success) {
            this.ed_rule_level_s = res.data;
            //处理规则级别标志信息为map类型,显示
            this.ed_rule_level_s.forEach((row) => {
              this.ed_rule_level_map[row.code] = row.value;
            });
          }
        });
    },
    //获取存储层类型
    getStoreType() {
      //获取存储层类型
      // this.$Code.getCategoryItems({ 'category': 'Store_type' }).then(res => {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams("/K/code/getCategoryItems", {
          category: "Store_type",
        })
        .then((res) => {
          if (res && res.success) {
            this.store_type_s = res.data;
            //处理存储层类型信息为map类型,显示
            this.store_type_s.forEach((row) => {
              this.store_type_map[row.code] = row.value;
            });
          }
        });
    },
    //规则类型改变事件
    caseTypeChange(case_type) {
      this.dq_rule_def_s.forEach((dq_rule_def) => {
        if (case_type === dq_rule_def.case_type) {
          this.form_dq_data.index_desc1 = dq_rule_def.index_desc1;
          this.form_dq_data.index_desc2 = dq_rule_def.index_desc2;
          this.form_dq_data.index_desc3 = dq_rule_def.index_desc3;
        }
      });
    },
    //获取页面初始化数据
    getDqDefinition(reg_num) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleconfig/getDqDefinition",
          { reg_num: reg_num }
        )
        .then((res) => {
          if (res && res.success) {
            // debugger
            if(res.data.specify_sql){
              res.data.specify_sql = this.$Secret.Decrypt(res.data.specify_sql);
            }
            if (res.data.err_data_sql){
              res.data.err_data_sql = this.$Secret.Decrypt(res.data.err_data_sql);
            }
            this.form_dq_data = res.data;
            //获取目标表所在存储层信息
            if (this.form_dq_data.target_tab) {
              this.getTableOneDSLInfo(this.form_dq_data.target_tab);
            }
            this.setTotalTypeData(1);
          }
        });
    },
    //点击数据源列表
    showDataSource(type, isShow) {
      //isShow为true,说明改规则不需要数据表信息
      if (isShow) {
        return false;
      }
      //设置模态框操作类型 target_tab:目标表,opposite_tab:对比表
      this.source_modal_box_type = type;
      //获取数据源树数据成功后再加载弹框
      this.isLoading = true;
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleconfig/getRuleConfigTreeData"
        )
        .then((res) => {
          if (res && res.success) {
            this.isLoading = false;
            this.dataSourceTreeData = res.data;
            this.data_source_dialog = true;
          } else {
            this.isLoading = false;
          }
        });
    },
    //树点击触发
    handleNodeClick(data) {
      this.table_data = [];
      //如果节点的file_id为未定义并且节点的分类id不为空并且节点分类不是未定义,代表该节点是分类信息,则添加分类下节点数据到展示区
      console.log(data);
      if (
        null === data.file_id &&
        data.classify_id !== "" &&
        null !== data.classify_id
      ) {
        //如果该节点的子节点信息不是未定义,则添加该节点下所有表信息
        if (data.children.length !== 0) {
          data.children.forEach((element) => {
            //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
            if (null !== typeof element.file_id && element.file_id !== "") {
              this.table_data.push(element);
            }
          });
        }
      }
      //如果数据层是DQC或者UDL,并且父id是DQC或者UDL则添加存储层下的表信息到展示区
      else if (
        (data.data_layer === "DQC" || data.data_layer === "UDL") &&
        (data.parent_id === "DQC" || data.parent_id === "UDL")
      ) {
        this.table_data = data.children;
      }
      //如果file_id不为空,代表该节点是表信息,添加表信息到展示区
      else if (null !== data.file_id && data.file_id !== "") {
        this.table_data.push(data);
      }
    },
    //保存表名
    saveTableName() {
      if (
        this.table_data_radio !== "" &&
        typeof this.table_data_radio !== "undefined"
      ) {
        //判断模态框操作类型 target_tab:目标表,opposite_tab:对比表,总表:sum_table,分表：sub_table
        if ("target_tab" === this.source_modal_box_type) {
          this.target_tab_info = this.table_data_radio;
          this.form_dq_data.target_tab = this.target_tab_info.hyren_name;
          this.form_dq_data.target_key_fields = "";
          //获取表对应的一个存储层信息
          this.getTableOneDSLInfo(this.form_dq_data.target_tab);
        } else if ("opposite_tab" === this.source_modal_box_type) {
          this.opposite_tab_info = this.table_data_radio;
          this.form_dq_data.opposite_tab = this.opposite_tab_info.hyren_name;
        } else if ("sum_table" === this.source_modal_box_type) {
          this.sum_table_info = this.table_data_radio;
          this.form_dq_data.sum_table = this.sum_table_info.hyren_name;
        } else if ("sub_table" === this.source_modal_box_type) {
          this.sub_tab_info = this.table_data_radio;
          this.form_dq_data.sub_table = this.sub_tab_info.hyren_name;
        }
        this.data_source_dialog = false;
      }
    },
    //获取表对应的一个存储层信息
    getTableOneDSLInfo(table_name) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleconfig/getTableOneDSLInfo",
          { table_name: table_name }
        )
        .then((res) => {
          if (res && res.success) {
            let base = this.$Secret.DecryptJSON(res.data);
            if (base.data) {
              this.layer_bean = base.data;
            } else {
              this.layer_bean = base;
            }
            console.log(this.$Secret.DecryptJSON(res.data), "base64解码 ");
          }
        });
    },
    //判断存储层类型设置不同sql语句关键字
    setRegexpSql(sql, fields, list_vals) {
      // debugger;
      let store_type_map = this.store_type_map;
      let layer_bean = this.layer_bean;
      // {"1":"关系型数据库","2":"hive","3":"Hbase","4":"solr","5":"ElasticSearch","6":"mongodb","7":"CarBonData"}
      //关系型数据库
      if (store_type_map[layer_bean.store_type] === "关系型数据库") {
        //{"10":"ApacheDerby","11":"Postgresql","12":"GBase","13":"TeraData","14":"Hive","01":"MYSQL","02":"Oracle9i及一下","03":"Oracle10g及以上",
        // "04":"SQLSERVER2000","05":"SQLSERVER2005","06":"DB2","07":"SybaseASE12.5及以上","08":"Informatic","09":"H2"}
        let database_type = layer_bean.layerAttr.database_type.toUpperCase();
        console.log(database_type)
        //Postgresql
        if (database_type.indexOf("POSTGRESQL") !== -1) {
          if (fields.length > 0) {
            fields.forEach((field) => {
              sql +=
                " NOT( regexp_match( CAST(" +
                field +
                " AS VARCHAR)," +
                list_vals +
                " ) IS NOT NULL) AND";
            });
          }
        }
        // Oracle10g及以上 Oracle9i及一下
        else if (
          database_type.indexOf("ORACLE10G") !== -1 ||
          database_type.indexOf("ORACLE9I") !== -1
        ) {
          if (fields.length > 0) {
            fields.forEach((field) => {
              sql +=
                " NOT( regexp_like ( " + field + ", " + list_vals + " )) AND";
            });
          }
        }else if (database_type.indexOf("MYSQL") !== -1){
          if (fields.length > 0) {
            fields.forEach((field) => {
              sql += " NOT(( " + field + " ) REGEXP ( " + list_vals + " )) AND";
            });
          }
        }
        // 其他数据库类型,默认值(标准sql)
        else {
          if (fields.length > 0) {
            fields.forEach((field) => {
              sql += " NOT(( " + field + " ) ~ ( " + list_vals + " )) AND";
            });
          }
        }
      }
      //hive Hbase
      else if (
        store_type_map[layer_bean.store_type] === "hive" ||
        store_type_map[layer_bean.store_type] === "Hbase"
      ) {
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql += " NOT(( " + field + " ) regexp ( " + list_vals + " )) AND";
          });
        }
      }
      //其他存储层类型,默认值(标准sql),同 Postgresql 库类型一样
      else {
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql += " NOT(( " + field + " ) ~ ( " + list_vals + " )) AND";
          });
        }
      }
      return sql;
    },
    //选择字段触发
    selectFieldClick(type, isShow) {
      //isShow为true,说明改规则不需要存储该字段
      if (isShow) {
        return false;
      }
      //设置字段模态框类型
      this.field_modal_box_type = type;
      //判断选中的字段框类型 target_tab:目标表,opposite_tab:对比表
      if ("target_tab" === type) {
        //校验目标表名
        if (
          "undefined" !== typeof this.form_dq_data.target_tab &&
          this.form_dq_data.target_tab.trim() !== ""
        ) {
          //根据目标表信息获取字段列表
          this.getTableColumns(this.form_dq_data.target_tab);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查目标表名合法性!", "warning");
        }
      } else if ("opposite_tab" === type) {
        //校验比对表名
        if (
          "undefined" !== typeof this.form_dq_data.opposite_tab &&
          this.form_dq_data.opposite_tab.trim() !== ""
        ) {
          //根据比对表信息获取字段列表
          this.getTableColumns(this.form_dq_data.opposite_tab);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查比对表名合法性!", "warning");
        }
      } else if ("sum_table" === type) {
        //校验总表表名
        if (
          "undefined" !== typeof this.form_dq_data.sum_table &&
          this.form_dq_data.sum_table.trim() !== ""
        ) {
          //根据比对表信息获取字段列表
          this.getTableColumns(this.form_dq_data.sum_table);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查总表表名合法性!", "warning");
        }
      } else if ("sub_fields" === type) {
        //校验分表校验字段
        if (
          "undefined" !== typeof this.form_dq_data.sub_table &&
          this.form_dq_data.sub_table.trim() !== ""
        ) {
          //根据分表信息获取字段列表
          this.getTableColumns(this.form_dq_data.sub_table);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查分表校验字段合法性!", "warning");
        }
      } else if ("total_corr_fields" === type) {
        //校验总表关联字段
        if (
          "undefined" !== typeof this.form_dq_data.sum_table &&
          this.form_dq_data.sum_table.trim() !== ""
        ) {
          //根据总表信息获取字段列表
          this.getTableColumns(this.form_dq_data.sum_table);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查总表关联字段合法性!", "warning");
        }
      } else if ("sub_group_fields" === type) {
        //校验分表分组字段
        if (
          "undefined" !== typeof this.form_dq_data.sub_table &&
          this.form_dq_data.sub_table.trim() !== ""
        ) {
          //根据比对表信息获取字段列表
          this.getTableColumns(this.form_dq_data.sub_table);
          this.table_fields_dialog = true;
        } else {
          this.$Msg.customizTitle("请检查分表分组字段合法性!", "warning");
        }
      }
    },
    //根据选中表名获取表字段信息
    getTableColumns(table_name) {
      this.table_fields_info = [];
      let params = {};
      params["table_name"] = table_name;
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleconfig/getColumnsByTableName",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.table_fields_info = res.data;
          }
        });
    },
    //处理字段多选
    handleFieldSelectionChange(val) {
      this.select_fields = val;
    },
    //保存选中字段
    saveTableFieldsInfo() {
      let fields_str = "";
      this.select_fields.forEach((field) => {
        fields_str = fields_str + "," + field.column_name;
      });
      fields_str = fields_str.substr(1, fields_str.length);
      if ("target_tab" === this.field_modal_box_type) {
        this.form_dq_data.target_key_fields = fields_str;
      } else if ("opposite_tab" === this.field_modal_box_type) {
        this.form_dq_data.opposite_key_fields = fields_str;
      } else if ("sum_table" === this.field_modal_box_type) {
        if (
          this.form_dq_data.case_type === "TOTAL SCORE" &&
          this.select_fields.length > 1
        ) {
          this.$Msg.customizTitle("总表校验字段只能选一个!", "warning");
        } else {
          this.form_dq_data.sum_fields = fields_str;
        }
      } else if ("sub_fields" === this.field_modal_box_type) {
        if (this.select_fields.length > 1) {
          this.$Msg.customizTitle("分表校验字段只能选一个!", "warning");
        } else {
          this.form_dq_data.sub_fields = fields_str;
        }
      } else if ("total_corr_fields" === this.field_modal_box_type) {
        if (this.select_fields.length > 1) {
          this.$Msg.customizTitle("总表关联字段只能选一个!", "warning");
        } else {
          this.form_dq_data.total_corr_fields = fields_str;
        }
      } else if ("sub_group_fields" === this.field_modal_box_type) {
        if (this.select_fields.length > 1) {
          this.$Msg.customizTitle("分表分组字段只能选一个!", "warning");
        } else {
          this.form_dq_data.sub_group_fields = fields_str;
        }
      }
      this.table_fields_dialog = false;
    },
    //保存规则信息
    saveRuleData(form_dq_data) {
      this.$refs[form_dq_data].validate((valid) => {
        if (valid && this.checkSql(this.form_dq_data)) {
          if(this.form_dq_data.case_type === 'TOTAL SCORE'){
              this.setTotalTypeData(0)
          }
          if (this.operation_type === "add") {
            this.$executeRequest
              .execPostByControllerAllMappingName(
                "/K/dm/ruleconfig/addDqDefinition",
                  this.form_dq_data
              )
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("规则添加成功!", "success");
                  //添加成功后跳转到规则配置页面
                  // this.$router.push({ name: 'ruleConfig', });
                  this.$emit("add");
                }
              });
          } else if (this.operation_type === "edit") {
            this.$executeRequest
              .execPostByControllerAllMappingName(
                "/K/dm/ruleconfig/updateDqDefinition",
                this.form_dq_data
              )
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("规则修改成功!", "success");
                  //添加成功后跳转到规则配置页面
                  this.$emit("edit");
                }
              });
          } else {
            this.$Msg.customizTitle("操作类型错误!", "info");
          }
        }
      });
    },
    setTotalTypeData(tag){
      if (this.form_dq_data.case_type === 'TOTAL SCORE'){
        // debugger
        if(tag === 0){
          // 保存时入库值
          this.form_dq_data.target_tab =   this.form_dq_data.sum_table;
          this.form_dq_data.target_key_fields =   this.form_dq_data.sum_fields;
          this.form_dq_data.opposite_tab =   this.form_dq_data.sub_table;
          this.form_dq_data.opposite_key_fields =   this.form_dq_data.sub_fields;
        }else {
          // 编辑时回显的值
          this.form_dq_data.sum_table =   this.form_dq_data.target_tab;
          this.form_dq_data.sum_fields =   this.form_dq_data.target_key_fields;
          this.form_dq_data.sub_table =   this.form_dq_data.opposite_tab;
          this.form_dq_data.sub_fields =   this.form_dq_data.opposite_key_fields;
        }
      }

    },
    checkSql(form_dq_data, is_check) {
      debugger
      if (!form_dq_data.err_data_sql && !form_dq_data.case_type === "TAB NAN" ) {
        this.$Msg.customizTitle("请输入问题数据sql!", "warning");
        return false;
      }
      if (!form_dq_data.specify_sql) {
        this.$Msg.customizTitle("请输入检测sql! ", "warning");
        return false;
      }
      return true;
    },
    //指定SQL（校验SQL）检查.
    specifySqlCheck() {
      this.sysVarCheckBean = [];
      this.form_dq_data.err_data_sql = this.$Secret.Encrypt(
        this.form_dq_data.err_data_sql || null
      );
      this.form_dq_data.specify_sql = this.$Secret.Encrypt(
        this.form_dq_data.specify_sql  || null
      );
      // rcFun.specifySqlCheck(this.form_dq_data).then(res => {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleconfig/specifySqlCheck",
          this.form_dq_data
        )
        .then((res) => {
          if (res && res.success) {
            this.test_result_dialog = true;
            this.sysVarCheckBean = res.data.sysVarCheckBean;
            this.check_is_success = res.data.check_is_success;
          }
        });
      if (this.form_dq_data.err_data_sql) {
        this.form_dq_data.err_data_sql = this.$Secret.Decrypt(
          this.form_dq_data.err_data_sql
        );
      }
      if (this.form_dq_data.specify_sql) {
        this.form_dq_data.specify_sql = this.$Secret.Decrypt(
          this.form_dq_data.specify_sql
        );
      }
      console.log(this.form_dq_data.specify_sql);
    },
    //问题数据sql明细检查
    errDataSqlCheck() {
      this.form_dq_data.err_data_sql = this.$Secret.Encrypt(
        this.form_dq_data.err_data_sql
      );
      this.form_dq_data.specify_sql = this.$Secret.Encrypt(
        this.form_dq_data.specify_sql
      );
      // rcFun.errDataSqlCheck(this.form_dq_data).then(res => {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleconfig/errDataSqlCheck",
          this.form_dq_data
        )
        .then((res) => {
          if (res && res.success) {
            this.test_result_dialog = true;
            this.sysVarCheckBean = res.data.sysVarCheckBean;
            this.check_is_success = res.data.check_is_success;
          }
        });
      this.form_dq_data.err_data_sql = this.$Secret.Decrypt(
        this.form_dq_data.err_data_sql
      );
      this.form_dq_data.specify_sql = this.$Secret.Decrypt(
        this.form_dq_data.specify_sql
      );
    },
  },
  computed: {
    //检测表名功能处理
    check_target_tab() {
      //如果选择的规则类型为 "" ,则不能选择数据源
      if ("" === this.form_dq_data.case_type) {
        this.form_dq_data.case_type = "";
        return true;
      } else if ("SQL" === this.form_dq_data.case_type) {
        this.form_dq_data.case_type = "SQL";
        return true;
      }
      return false;
    },
    //检测表关键字段功能处理
    check_target_key_fields() {
      let case_type = this.form_dq_data.case_type;
      //如果选择的规则类型为 "" | SQL | TAB NAN ,则不能选择字段信息
      return "" === case_type || "SQL" === case_type || "TAB NAN" === case_type;
    },
    //检测表过滤功能处理
    check_limit_condition() {
      let case_type = this.form_dq_data.case_type;
      return "" === case_type || "SQL" === case_type;
    },
    //比对表名功能处理
    check_opposite_tab() {
      let case_type = this.form_dq_data.case_type;
      return "COL FK" !== case_type;
    },
    //清单值域功能处理
    check_list_vals() {
      let case_type = this.form_dq_data.case_type;
      return !("COL ENUM" === case_type || "COL REGULAR" === case_type);
    },
    //范围区间最小/大值功能处理
    check_range_val() {
      let case_type = this.form_dq_data.case_type;
      return "COL RANG" !== case_type;
    },
    //检测sql功能处理
    check_sql_input() {
      let case_type = this.form_dq_data.case_type;
      let target_tab = this.form_dq_data.target_tab;
      let opposite_tab = this.form_dq_data.opposite_tab;
      let check_limit_condition = "";
      if (
        "undefined" !== typeof this.form_dq_data.check_limit_condition &&
        null !== this.form_dq_data.check_limit_condition
      ) {
        check_limit_condition = this.form_dq_data.check_limit_condition;
      }
      let list_vals = "";
      if ("undefined" !== typeof this.form_dq_data.list_vals) {
        list_vals = this.form_dq_data.list_vals;
      }
      let target_key_fields = "";
      if ("undefined" !== typeof this.form_dq_data.target_key_fields) {
        target_key_fields = this.form_dq_data.target_key_fields;
      }
      let opposite_key_fields = this.form_dq_data.opposite_key_fields;
      let range_min_val = this.form_dq_data.range_min_val;
      let range_max_val = this.form_dq_data.range_max_val;
      const fields = target_key_fields.split(",");
      //初始化sql
      let sql;
      //判断规则类型处理成不同的sql
      //字段枚举
      if ("COL ENUM" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\tCOUNT(1) AS index1\n FROM \n\t" +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql = sql + " " + field + " NOT IN (" + list_vals + ") AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
        sql += ";";
        //设置检查的总记录数
        sql += "\n\n SELECT \n\t COUNT(1) AS index2\n FROM \n\t " + target_tab;
        if ("" !== check_limit_condition) {
          sql = sql + "\n WHERE \n\t (" + check_limit_condition + ")";
        }
        sql += ";";
      }
      //字段外键检测
      else if ("COL FK" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t COUNT(1) AS index1\n FROM \n\t " +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql =
              sql +
              " " +
              field +
              " NOT IN (SELECT " +
              opposite_key_fields +
              " FROM " +
              opposite_tab +
              " T2) AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
        sql += ";";
        //设置检查的总记录数
        sql += "\n\n SELECT \n\t COUNT(1) AS index2 \n FROM \n\t " + target_tab;
        if ("" !== check_limit_condition) {
          sql = sql + "\n WHERE \n\t(" + check_limit_condition + ")";
        }
        sql += ";";
      }
      //字段主键检测
      else if ("COL PK" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t COUNT(1) AS index1\n FROM \n\t (SELECT " +
          target_key_fields +
          " FROM " +
          target_tab +
          " GROUP BY " +
          target_key_fields +
          " HAVING COUNT(1) > 1 ) T;";
        //设置检查的总记录数
        sql +=
          "\n\n SELECT \n\t COUNT(1) AS index2 \n FROM \n\t " +
          target_tab +
          " T";
        sql += ";";
      }
      //字段范围检测
      else if ("COL RANG" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t COUNT(1) AS index1\n FROM \n\t " +
          target_tab +
          " \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql =
              sql +
              " (" +
              field +
              " <= " +
              range_min_val +
              " OR " +
              field +
              " >= " +
              range_max_val +
              ") AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
        sql += ";";
        //设置检查的总记录数
        sql += "\n\n SELECT \n\t COUNT(1) AS index2 \n FROM \n\t " + target_tab;
        if ("" !== check_limit_condition) {
          sql = sql + "\n WHERE \n\t(" + check_limit_condition + ")";
        }
        sql += ";";
      }
      //字段正则表达式
      else if ("COL REGULAR" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t COUNT(1) AS index1\n FROM \n\t " +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        //根据存储层及数据库类型,类型设置正则sql的关键字
        sql = this.setRegexpSql(sql, fields, list_vals);
        sql = sql.substr(0, sql.length - 4);
        sql += ";";
        //设置检查的总记录数
      }
      //指定SQL
      else if ("SQL" === case_type) {
        return false;
      }
      //字段非空
      else if ("COL NAN" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t COUNT(1) AS index1\n FROM \n\t " +
          target_tab +
          " \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            if (
              this.layer_bean.data &&
              this.layer_bean.data.layerAttr.database_type
                .toUpperCase()
                .indexOf("SQLSERVER") !== -1
            ) {
              // sqlserver数据库
              sql +=
                "(" + field + " IS NULL OR LTRIM(RTRIM(" + field + "))='') AND";
            } else {
              // 非sqlserver数据库
              sql += "(" + field + " IS NULL OR TRIM(" + field + ")='') AND";
            }
          });
        }
        sql = sql.substr(0, sql.length - 4);
        sql += ";";
        //设置检查的总记录数
        sql += "\n\n SELECT \n\t COUNT(1) AS index2 \n FROM \n\t " + target_tab;
        if ("" !== check_limit_condition) {
          sql = sql + "\n WHERE \n\t (" + check_limit_condition + ")";
        }
        sql += ";";
      }
      //表非空
      else if ("TAB NAN" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql = " SELECT \n\t COUNT(1) AS index1 \n FROM \n\t " + target_tab;
        if ("" !== check_limit_condition) {
          sql = sql + "\n WHERE \n\t(" + check_limit_condition + ")";
        }
        sql += ";";
        //设置检查的总记录数
      }
      //总分校验检查
      else if ("TOTAL SCORE" === case_type) {
        //初始化sql
        sql = "";
        //设置总分校验检查sql
        const sumFields = this.form_dq_data.sum_fields;
        const total_corr_fields = this.form_dq_data.total_corr_fields;
        const subFields = this.form_dq_data.sub_fields;
        const sumTable = this.form_dq_data.sum_table;
        const subTable = this.form_dq_data.sub_table;
        const sub_group_fields = this.form_dq_data.sub_group_fields;
        let total_filter_fields = "";
        if ("undefined" !== typeof this.form_dq_data.total_filter_fields) {
          total_filter_fields = this.form_dq_data.total_filter_fields;
        }
        let sub_filter_fields = "";
        if ("undefined" !== typeof this.form_dq_data.sub_filter_fields) {
          sub_filter_fields = this.form_dq_data.sub_filter_fields;
        }
        // 第一个sql
        sql = " SELECT \n\t count(1) index1 \n FROM \n\t";
        sql =
          sql +
          " (SELECT " +
          total_corr_fields +
          ", " +
          sumFields +
          " FROM " +
          sumTable;
        if ("" !== total_filter_fields) {
          sql = sql + " WHERE " + total_filter_fields;
        }
        sql = sql + " ) T1\n\t JOIN \n\t";
        sql =
          sql +
          " (SELECT " +
          sub_group_fields +
          ", sum(" +
          subFields +
          ") sum_" +
          subFields +
          " FROM " +
          subTable;
        if ("" !== sub_filter_fields) {
          sql = sql + " WHERE " + sub_filter_fields;
        }
        sql =
          sql +
          " GROUP BY " +
          sub_group_fields +
          " ) T2 \n\t ON T1." +
          total_corr_fields +
          " = T2." +
          sub_group_fields;
        sql = sql + " \n WHERE T1." + sumFields + " <> sum_" + subFields;
        sql += ";";
        // 第二个sql
        sql += "\n\n SELECT \n\t COUNT(1) index2 \n FROM \n\t ";
        sql =
          sql +
          " (SELECT " +
          total_corr_fields +
          ", " +
          sumFields +
          " FROM " +
          sumTable;
        // if ("" !== total_filter_fields) {
        //   sql = sql + "\n WHERE \n\t(" + total_filter_fields + ")";
        // }
        if ("" !== total_filter_fields) {
          sql = sql + " WHERE " + total_filter_fields;
        }
        sql = sql + " ) T1\n\t JOIN \n\t";
        sql =
          sql +
          " (SELECT " +
          sub_group_fields +
          ", sum(" +
          subFields +
          ") sum_" +
          subFields +
          " FROM " +
          subTable;
        if ("" !== sub_filter_fields) {
          sql = sql + " WHERE " + sub_filter_fields;
        }
        sql =
          sql +
          " GROUP BY " +
          sub_group_fields +
          " ) T2 \n\t ON T1." +
          total_corr_fields +
          " = T2." +
          sub_group_fields;
        sql += ";";
      }
      this.form_dq_data.specify_sql = sql;
      return true;
    },
    //问题明细sql功能处理
    problem_data_sql_input() {
      let case_type = this.form_dq_data.case_type;
      let target_tab = this.form_dq_data.target_tab;
      let opposite_tab = this.form_dq_data.opposite_tab;
      let check_limit_condition = "";
      if (
        "undefined" !== typeof this.form_dq_data.check_limit_condition &&
        null !== this.form_dq_data.check_limit_condition
      ) {
        check_limit_condition = this.form_dq_data.check_limit_condition;
      }
      let list_vals = "";
      if ("undefined" !== typeof this.form_dq_data.list_vals) {
        list_vals = this.form_dq_data.list_vals;
      }
      let target_key_fields = "";
      if ("undefined" !== typeof this.form_dq_data.target_key_fields) {
        target_key_fields = this.form_dq_data.target_key_fields;
      }
      let opposite_key_fields = this.form_dq_data.opposite_key_fields;
      let range_min_val = this.form_dq_data.range_min_val;
      let range_max_val = this.form_dq_data.range_max_val;
      const fields = target_key_fields.split(",");
      //初始化sql
      let sql;
      //判断规则类型处理成不同的sql
      //字段枚举
      if ("COL ENUM" === case_type) {
        //初始化sql
        sql = "";
        //问题数据sql
        sql =
          " SELECT \n\t " +
          target_key_fields +
          " \n FROM \n\t " +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql = sql + " " + field + " NOT IN (" + list_vals + ") AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
      }
      //字段外键检测
      else if ("COL FK" === case_type) {
        //初始化sql
        sql = "";
        //问题数据sql
        sql =
          " SELECT \n\t " +
          target_key_fields +
          " \n FROM \n\t " +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql =
              sql +
              " " +
              field +
              " NOT IN (SELECT " +
              opposite_key_fields +
              " FROM " +
              opposite_tab +
              " T2) AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
      }
      //字段主键检测
      else if ("COL PK" === case_type) {
        //初始化sql
        sql = "";
        //问题数据sql
        sql =
          " SELECT \n\t" +
          target_key_fields +
          "\n FROM \n\t (SELECT " +
          target_key_fields +
          " FROM " +
          target_tab +
          " GROUP BY " +
          target_key_fields +
          " HAVING COUNT(1) > 1 ) T";
      }
      //字段范围检测
      else if ("COL RANG" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t " +
          target_key_fields +
          " \n FROM \n\t " +
          target_tab +
          " \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            sql =
              sql +
              " (" +
              field +
              " <= " +
              range_min_val +
              " OR " +
              field +
              " >= " +
              range_max_val +
              ") AND";
          });
        }
        sql = sql.substr(0, sql.length - 4);
      }
      //字段正则表达式
      else if ("COL REGULAR" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql =
          " SELECT \n\t " +
          target_key_fields +
          " \n FROM \n\t " +
          target_tab +
          " T1 \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        //根据存储层及数据库类型,类型设置正则sql的关键字
        sql = this.setRegexpSql(sql, fields, list_vals);
        sql = sql.substr(0, sql.length - 4);
      }
      //指定SQL
      else if ("SQL" === case_type) {
        sql = "";
        return false;
      }
      //字段非空
      else if ("COL NAN" === case_type) {
        //初始化sql
        sql = "";
        //设置不在范围内的记录数sql
        sql = " SELECT \n\t * \n FROM \n\t " + target_tab + " \n WHERE \n\t";
        if ("" !== check_limit_condition) {
          sql = sql + "(" + check_limit_condition + ") \n AND \n\t";
        }
        if (fields.length > 0) {
          fields.forEach((field) => {
            if (
              this.layer_bean.data &&
              this.layer_bean.data.layerAttr.database_type
                .toUpperCase()
                .indexOf("SQLSERVER") !== -1
            ) {
              // sqlserver数据库
              sql +=
                "(" + field + " IS NULL OR LTRIM(RTRIM(" + field + "))='') AND";
            } else {
              // 非sqlserver数据库
              sql += "(" + field + " IS NULL OR TRIM(" + field + ")='') AND";
            }
          });
        }
        sql = sql.substr(0, sql.length - 4);
      }
      //总分校验检查
      else if ("TOTAL SCORE" === case_type) {
        //初始化sql
        sql = "";
        //设置总分校验检查sql
        const sumFields = this.form_dq_data.sum_fields;
        const total_corr_fields = this.form_dq_data.total_corr_fields;
        const subFields = this.form_dq_data.sub_fields;
        const sumTable = this.form_dq_data.sum_table;
        const subTable = this.form_dq_data.sub_table;
        const sub_group_fields = this.form_dq_data.sub_group_fields;
        let total_filter_fields = "";
        if ("undefined" !== typeof this.form_dq_data.total_filter_fields) {
          total_filter_fields = this.form_dq_data.total_filter_fields;
        }
        let sub_filter_fields = "";
        if ("undefined" !== typeof this.form_dq_data.sub_filter_fields) {
          sub_filter_fields = this.form_dq_data.sub_filter_fields;
        }
        sql =
          " SELECT \n\t T1." +
          sumFields +
          ", T1." +
          total_corr_fields +
          ", sum_" +
          subFields +
          " \n FROM \n\t" +
          " (SELECT " +
          sumFields +
          ", " +
          total_corr_fields +
          " FROM " +
          sumTable;
        if ("" !== total_filter_fields) {
          sql = sql + " WHERE " + total_filter_fields;
        }
        sql = sql + " ) T1\n\t JOIN \n\t";
        sql =
          sql +
          " (SELECT " +
          sub_group_fields +
          ", sum(" +
          subFields +
          ") sum_" +
          subFields +
          " FROM " +
          subTable;
        if ("" !== sub_filter_fields) {
          sql = sql + " WHERE " + sub_filter_fields;
        }
        sql =
          sql +
          " GROUP BY " +
          sub_group_fields +
          " ) T2 \n\t ON T1." +
          total_corr_fields +
          " = T2." +
          sub_group_fields;
        sql = sql + " \n WHERE T1." + sumFields + " <> sum_" + subFields;
      }
      this.form_dq_data.err_data_sql = sql;
      return true;
    },
    //指标含义功能处理
    check_index_desc() {
      let case_type = this.form_dq_data.case_type;
      return "SQL" !== case_type;
    },
  },
};
</script>

<style lang="less">
#ruleInfo {
  .el-input--mini .el-input__inner {
    height: 28px;
    padding: 0 10px;
    width: 10vw;
  }
  .el-input__inner {
    padding: 0 10px;
  }
  .el-textarea__inner {
    padding: 0 10px;
  }
  .mytree /deep/ {
    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }

    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    /*  .el-tree-node__expand-icon.is-leaf {
                display: none;
            } */

    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node :last-child:before {
      height: 38px;
    }

    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node:before {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      border-left: 1px dashed #4386c6;
      bottom: 0;
      height: 100%;
      top: -26px;
      width: 1px;
    }

    .el-tree-node__content {
      padding: 0 !important;
    }

    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0;
    }

    .el-tree-node:after {
      border-top: 1px dashed #4386c6;
      height: 20px;
      top: 12px;
      width: 24px;
    }
  }

  .title {
    color: #2196f3;
    line-height: 30px;
    padding-bottom: 10px;
    font-size: 18px;
  }

  .dialog-footer {
    float: right;
    margin-top: 10px;
  }

  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    font-size: 14px;
  }

  .scrollbar-wrap {
    width: 24% !important;
    position: absolute;
  }

  .scrollbar__track {
    width: 4px;
  }

  .locationcenter {
    text-align: center;
    margin-top: 5px;
  }
  .el-collapse-item__wrap {
    overflow: visible;
  }
  .el-scrollbar__thumb {
    background-color: transparent;
  }
  .el-dialog__body .el-button {
    padding: 8px 25px;
  }
}
</style>
