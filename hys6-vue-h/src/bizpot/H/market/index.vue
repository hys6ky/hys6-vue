<template>
  <div style="padding: 10px" class="h100 box-sizing">
    <div class="h100 d-flex">
      <ByTree
          :data="marketinfotreeTwo"
          class="h100"
          :defaultProps="defaultProps"
          @add="addProject"
          @contextmenu="contextmenu"
          @logDetail="logDetail"
      >
        <div slot="footer" class="mt-20">
          <el-upload
              accept=".hrds"
              action=""
              :show-file-list="false"
              :limit="1"
              :http-request="uploadFile"
              :before-upload="handleBeforeUpload"
              ref="upload"
          >
            <el-button size="small" type="primary">
              <i class="el-icon-upload"></i> 导入工程
            </el-button>
          </el-upload>
        </div>
      </ByTree>
      <div class="flex-1" style="padding-left: 10px">
        <el-card shadow="never">
          <div slot="header">
            <span>{{ treetitle }} </span>
            <el-row style="float: right">
              <el-button type="primary" @click="downloadExcel()" size="small">
                Excel模板下载
              </el-button>
              <el-button
                  type="success"
                  size="small"
                  v-if="isJob"
                  @click="excelExportBtn"
              >
                EXCEL数据导入
              </el-button>
              <el-button
                  @click="batchGenerateJobBtn()"
                  type="info"
                  size="small"
                  v-if="isJob"
              >
                批量生成作业
              </el-button>
              <el-button
                  @click="deleteAllTable()"
                  type="danger"
                  size="small"
                  v-if="isJob"
              >
                批量删除
              </el-button>
              <el-button
                  @click="addTable()"
                  type="primary"
                  size="small"
                  v-if="isJob"
              >
                新 增
              </el-button>
              <el-button
                  v-if="!isJob"
                  type="primary"
                  @click="gobackBtn()"
                  size="small"
              >返回
              </el-button
              >
            </el-row>
          </div>
          <!-- 表信息 -->
          <el-table
              :data="tableData"
              border
              stripe
              size="medium"
              style="width: 100%"
              v-if="isJob"
              @selection-change="handleSelectionChange"
          >
            <el-table-column
                type="selection"
                align="center"
                width="55"
            ></el-table-column>
            <el-table-column
                type="index"
                width="70"
                label="序号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="module_table_en_name"
                label="英文表名"
                show-overflow-tooltip
                align="left"
            >
            </el-table-column>
            <el-table-column
                prop="module_table_cn_name"
                label="中文表名"
                show-overflow-tooltip
                align="left"
            >
            </el-table-column>
            <el-table-column
                prop="module_table_c_date"
                label="创建日期"
                show-overflow-tooltip
                align="left"
            >
              <template slot-scope="scope">
                {{ $Date.dateFormat(scope.row.module_table_c_date) }}
              </template>
            </el-table-column>
            <el-table-column
                prop="jobNum"
                label="作业数"
                show-overflow-tooltip
                align="left"
                width="120"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" width="280">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="text" @click="viewModelTableData(scope.row)">预览
                 </el-button>-->

                <el-button
                    v-if="
                    scope.row.sql_engine === '3' || scope.row.sql_engine === '4'
                  "
                    size="mini"
                    class="issuecolor"
                    type="text"
                    @click="restartNow(scope.row)"
                >立即启动
                </el-button>
                <el-button
                    v-else
                    size="mini"
                    class="issuecolor"
                    type="text"
                    @click="generateMarketJobBtn(scope.row)"
                >生成作业
                </el-button>
                <el-button
                    size="mini"
                    type="text"
                    @click="compiletable(scope.row)"
                >编辑
                </el-button>
                <el-button
                    size="mini"
                    class="delcolor"
                    type="text"
                    @click="deletetable(scope.row)"
                >删除
                </el-button>
                <el-button
                    size="mini"
                    class="releasedowncolor"
                    type="text"
                    @click="jobdep(scope.row)"
                >
                  任务配置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 点击表显示作业信息 -->
          <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!isJob">
            <el-tab-pane label="基础配置" name="basicscon">
              <el-form
                  :model="dm_datatable"
                  ref="dm_datatable"
                  status-icon
                  label-width="90px"
                  class="demo-ruleForm"
                  :inline="true"
              >
                <el-row>
                  <el-col :span="10" :offset="2">
                    <el-form-item
                        label="集市"
                        prop="data_mart_id"
                        :rules="rule.default"
                    >
                      <el-select
                          v-model="dm_datatable.data_mart_id"
                          placeholder="请选择"
                          size="medium"
                          @change="oncategory(dm_datatable.data_mart_id)"
                          style="width: 206px"
                      >
                        <el-option
                            v-for="item in selectmarke"
                            :key="item.id"
                            :value="item.id"
                            :label="item.label"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item
                        label="选择分类"
                        prop="category_id"
                        :rules="rule.default"
                    >
                      <el-select
                          v-model="dm_datatable.category_id"
                          placeholder="请选择"
                          size="medium "
                          style="width: 206px"
                      >
                        <el-option
                            v-for="item in selectcategory"
                            :key="item.category_id"
                            :value="item.category_id"
                            :label="item.category_name"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10" :offset="2">
                    <el-form-item
                        label="表英文名"
                        prop="module_table_en_name"
                        :rules="
                        filter_rules([{ required: true, dataType: 'table' }])
                      "
                    >
                      <el-input
                          :disabled="updateFlag"
                          v-model="dm_datatable.module_table_en_name"
                          @change="checkrepeat()"
                          placeholder="表英文名"
                          size="medium "
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" :offset="2">
                    <el-form-item
                        label="表中文名"
                        prop="module_table_cn_name"
                        :rules="rule.default"
                    >
                      <el-input
                          :disabled="iflock"
                          v-model="dm_datatable.module_table_cn_name"
                          autocomplete="off"
                          placeholder="表中文名"
                          size="medium "
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <!--<el-col :span="10" :offset="2">
                    <el-form-item label="分区字段" prop="partition_fields">
                      <el-input :disabled="iflock" v-model="dm_datatable.partition_fields"
                                autocomplete="off" placeholder="分区字段,多个使用逗号分隔" size="medium "></el-input>
                    </el-form-item>
                  </el-col>-->
                  <el-col :span="10" :offset="2">
                    <el-form-item
                        label="对象类型"
                        prop="table_storage"
                        :rules="rule.selected"
                    >
                      <el-radio-group
                          :disabled="iflock"
                          v-model="dm_datatable.table_storage"
                      >
                        <el-radio
                            :disabled="iflock"
                            v-for="obj in objectType"
                            :key="obj.code"
                            :label="obj.code"
                        >
                          {{ obj.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22" :offset="2">
                    <el-form-item
                        label="执行引擎"
                        prop="sql_engine"
                        :rules="rule.selected"
                    >
                      <el-radio-group
                          :disabled="iflock"
                          v-model="dm_datatable.sql_engine"
                          @change="sqlEngineChange"
                      >
                        <el-radio
                            :disabled="iflock"
                            v-for="obj in allsqlengine"
                            :key="obj.code"
                            :label="obj.code"
                        >
                          {{ obj.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22" :offset="2">
                    <el-form-item
                        label="进数方式"
                        prop="storage_type"
                        :rules="rule.selected"
                        v-if="
                        dm_datatable.table_storage == '' ||
                        dm_datatable.table_storage == objectType1.ShuJuBiao
                      "
                    >
                      <el-radio-group
                          :disabled="iflock"
                          v-model="dm_datatable.storage_type"
                      >
                        <el-radio
                            :disabled="iflock"
                            v-for="item in allstoragetype"
                            :key="item.code"
                            :label="item.code"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10" :offset="2">
                    <el-form-item label="表描述" prop="remark">
                      <el-input
                          :disabled="iflock"
                          type="text"
                          v-model="dm_datatable.remark"
                          autocomplete="off"
                          placeholder="表描述"
                          size="medium "
                          style="width: 375%"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12" :offset="2">
                    <el-form-item
                      label="SQL"
                      prop="sqlMain"
                      v-if="dm_datatable.table_storage == objectType1.ShuJuShiTu"
                        :rules="rule.default">
                      <el-input
                        :disabled="iflock"
                        type="textarea"
                        v-model="dm_datatable.sqlMain"
                        autocomplete="off"
                        placeholder="SQL"
                        size="medium "
                        :rows="5"
                        style="width: 400%"
                      ></el-input>
                      <!-- <SqlEditor ref="sqleditorpre" :data="2" :value="preJobForm.sqlMain"
                          @changeTextarea="changeTextareaPreSql($event)" class='textasql' /> -->
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!--   存储层表格 -->
              <el-table :data="tableStorageData" border stripe size="medium">
                <el-table-column
                    property
                    label="选择"
                    type="index"
                    align="center"
                    width="80"
                >
                  <template slot-scope="scope">
                    <el-radio
                        :disabled="iflock"
                        v-model="dsl_id"
                        :label="scope.row.dsl_id"
                        @change="ondatabase(scope.row.dsl_id)"
                    >
                      &thinsp;
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="dsl_name"
                    label="名称"
                    show-overflow-tooltip
                    align="left"
                ></el-table-column>
                <el-table-column
                    prop="store_type"
                    label="存储类型"
                    show-overflow-tooltip
                    align="left"
                ></el-table-column>
                <el-table-column
                    prop="dsl_remark"
                    label="备注"
                    show-overflow-tooltip
                    align="left"
                ></el-table-column>
                <el-table-column
                    prop="store_type"
                    width="202"
                    label="数据存储层配置属性"
                    align="left"
                >
                  <template slot-scope="scope">
                    <el-button
                        type="info"
                        size="mini"
                        @click="
                        dataSaveConfigure = true;
                        searchDataStoreById(scope.row.dsl_id);
                      "
                    >
                      数据存储层配置详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 添加表字段 -->
              <el-row>
                <el-col>
                  <el-button
                      type="primary"
                      class="rightbtn"
                      @click="addcolumn()"
                      size="small"
                  >新增字段
                  </el-button>
                  <el-button
                      type="primary"
                      class="rightbtn"
                      @click="addDmDataTable()"
                      size="small"
                  >保 存
                  </el-button>
                </el-col>
              </el-row>
              <el-form :model="columnModel" ref="columnModel" class="fromTable">
                <el-table :data="columnModel.columnbysql" border size="mini">
                  <el-table-column
                      type="index"
                      label="序号"
                      width="70"
                      align="center"
                  ></el-table-column>
                  <el-table-column
                      prop="field_en_name"
                      label="字段英文名"
                      align="left"
                  >
                    <template slot-scope="scope">
                      <!-- <el-tooltip effect="dark" :content="scope.row.field_en_name" placement="top"
                      v-if="scope.row.field_en_name !== '' && scope.row.field_en_name !== undefined">
                      <el-input class="el-input__inner" :disabled="iflock"
                          v-model.lazy="scope.row.field_en_name" autocomplete="off" placeholder="英文名">
                  </el-tooltip> -->
                      <el-form-item
                          :prop="'columnbysql.' + scope.$index + '.field_en_name'"
                          :rules="filter_rules([{ required: true, dataType: 'table' }])"
                      >
                        <el-input
                            :disabled="iflock"
                            size="mini"
                            v-model="scope.row.field_en_name"
                            autocomplete="off"
                            placeholder="英文名"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column
                      prop="field_cn_name"
                      label="字段中文名"
                      align="left"
                  >
                    <template slot-scope="scope">
                      <!-- <el-tooltip effect="dark" :content="scope.row.field_cn_name" placement="top"
                      v-if="scope.row.field_cn_name !== '' && scope.row.field_cn_name !== undefined">
                      <el-input class="el-input__inner" :disabled="iflock"
                          v-model.lazy="scope.row.field_cn_name" autocomplete="off" placeholder="中文名">
                  </el-tooltip> v-else -->
                      <el-form-item
                          :prop="'columnbysql.' + scope.$index + '.field_cn_name'"
                          :rules="rule.default"
                      >
                        <el-input
                            :disabled="iflock"
                            size="mini"
                            v-model.lazy="scope.row.field_cn_name"
                            autocomplete="off"
                            placeholder="中文名"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!--处理方式-->
                  <!--<el-table-column prop="field_process" label="处理方式" align="left">
                    <template slot-scope="scope">
                      <el-form-item :prop="'columnbysql.' + scope.$index + '.field_process'"
                                    :rules="rule.default">
                        <el-select clearable allow-create filterable
                                   v-model="scope.row.field_process" placeholder="请选择" size="mini">
                          <el-option v-for="(item, index) in allfield_process" :key="index"
                                     :label="item.value" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>-->
                  <el-table-column
                      prop="field_type"
                      label="字段类型"
                      align="left"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                          :prop="'columnbysql.' + scope.$index + '.field_type'"
                          :rules="rule.default"
                      >
                        <el-select
                            clearable
                            allow-create
                            filterable
                            @change="setSelect(scope.$index)"
                            :disabled="iflock || scope.row.field_process === '2'"
                            v-model="scope.row.field_type"
                            placeholder="请选择"
                            size="mini"
                        >
                          <el-option
                              v-for="(item, index) in allfield_type"
                              :key="index"
                              :label="item"
                              :value="item"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="field_length"
                      label="字段长度"
                      align="left"
                      class="fieldDesc"
                  >
                    <!-- <template slot="header">
                字段长度
            </template> -->
                    <template slot-scope="scope">
                      <el-form-item
                          :prop="'columnbysql.' + scope.$index + '.field_length'"
                          v-if="
                          iflock ||
                          scope.row.field_process === '2' ||
                          (scope.row.field_type &&
                            numberTypes.includes(
                              scope.row.field_type.toUpperCase()
                            ))
                        "
                      >
                        <el-input
                            size="mini"
                            style="width: 80%"
                            disabled
                            v-model.lazy="scope.row.field_length"
                            autocomplete="off"
                            placeholder="长度"
                        />
                      </el-form-item>
                      <el-form-item
                          :prop="'columnbysql.' + scope.$index + '.field_length'"
                          v-else
                      >
                        <el-input
                            size="mini"
                            style="width: 80%"
                            v-model.lazy="scope.row.field_length"
                            autocomplete="off"
                            placeholder="长度"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 主键 -->
                  <el-table-column
                      v-for="(index, item) in columnmore"
                      :label="index.dsla_storelayer"
                      :key="item"
                      prop="index"
                      align="left"
                      width="70"
                  >
                    <template slot-scope="scope">
                      <el-checkbox
                          :disabled="iflock"
                          v-model="scope.row[scope.column.label]"
                          :checked="scope.row[scope.column.label]"
                      ></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="操 作" width="100" align="center">
                    <template slot-scope="scope">
                      <el-button
                          type="text"
                          @click="deletecolumn(scope.$index, scope.row)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="任务配置" name="jodcon" v-if="is_taskTag">
              <!-- 作业配置信息 -->
              <el-row>
                <el-col>
                  <el-button
                      class="els"
                      type="primary"
                      @click="addjob()"
                      size="small"
                  >新增任务
                  </el-button>
                </el-col>
              </el-row>
              <el-table
                  :data="jobData"
                  border
                  :header-cell-style="{ 'text-align': 'left' }"
                  :cell-style="{ 'text-align': 'left' }"
              >
                <el-table-column type="index" label="序号" width="70">
                </el-table-column>
                <el-table-column
                    prop="task_number"
                    show-overflow-tooltip
                    label="任务编号"
                >
                </el-table-column>
                <!-- <el-table-column prop="create_user" label="创建人" show-overflow-tooltip>
                 </el-table-column>-->
                <el-table-column
                    prop="task_create_date"
                    width="120"
                    label="创建日期"
                    show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{ $Date.dateFormat(scope.row.task_create_date) }}
                  </template>
                </el-table-column>
                <!--<el-table-column prop="run_batch_date" width="120" show-overflow-tooltip label="跑批日期">
                    <template slot-scope="scope">
                        {{ $Date.dateFormat(scope.row.run_batch_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="expiry_date" show-overflow-tooltip width="120" label="到期日期">
                    <template slot-scope="scope">
                        {{ $Date.dateFormat(scope.row.expiry_date) }}
                    </template>
                </el-table-column>-->
                <el-table-column label="操作" width="260">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        class="releasedowncolor"
                        type="text"
                        @click="addjobTable(scope.row)"
                    >作业详情
                    </el-button>
                    <el-button
                        size="mini"
                        class="editcolor"
                        type="text"
                        @click="updatajopdata(scope.row)"
                    >编辑
                    </el-button>
                    <el-button
                        size="mini"
                        class="delcolor"
                        type="text"
                        @click="deleteJobData(scope.row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>

    <!--左边树操作部分-->
    <ByModel
        :visible.sync="visible"
        :modelTitle="modelTitle"
        modelWidth="650px"
        @close="dialogCancel"
        @closed="dialogClosed"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
            :formData="modelFormData"
            :formItems="modelFormItems"
            :formRules="modelFormRules"
            :formConfig="modelFormConfig"
            ref="dataAdd"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="addDmInfo" v-debounce>
          保存
        </el-button
        >
      </template>
    </ByModel>
    <ByModel
        :visible.sync="visibleGroup"
        :modelTitle="modelTitleGroup"
        modelWidth="650px"
        @close="dialogCancelGroup"
        @closed="dialogClosedGroup"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
            :formData="modelFormGroupData"
            :formItems="modelFormGroupItems"
            :formRules="modelFormGroupRules"
            :formConfig="modelFormGroupConfig"
            ref="dataMarkGroup"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="dialogCancelGroup">取 消</el-button>
        <el-button type="primary" @click="addDmCategory" v-debounce>
          保存
        </el-button>
      </template>
    </ByModel>
    <ByModel
        :visible.sync="visibleGroupName"
        :modelTitle="modelTitleGroupName"
        modelWidth="650px"
        @close="dialogCancelGroupName"
        @closed="dialogClosedGroupName"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
            :formData="modelFormGroupNameData"
            :formItems="modelFormGroupNameItems"
            :formRules="modelFormGroupNameRules"
            :formConfig="modelFormGroupNameConfig"
            ref="dataMarkGroupName"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="dialogCancelGroupName">取 消</el-button>
        <el-button type="primary" @click="confirmGroupName" v-debounce>
          修改
        </el-button>
      </template>
    </ByModel>

    <!-- 数据存储层详细信息展示 -->
    <el-dialog
        title="数据存储层配置属性"
        :visible.sync="dataSaveConfigure"
        width="60%"
    >
      <el-form>
        <el-table :data="tableDataConfigure" border stripe size="medium">
          <el-table-column
              type="index"
              label="序号"
              width="70"
              align="center"
          ></el-table-column>

          <el-table-column
              prop="storage_property_key"
              show-overflow-tooltip
              label="key"
              align="center"
          ></el-table-column>

          <el-table-column
              prop="storage_property_val"
              show-overflow-tooltip
              label="value"
              align="center"
          ></el-table-column>

          <el-table-column
              prop="dsla_remark"
              label="描述"
              show-overflow-tooltip
              align="center"
          ></el-table-column>
        </el-table>
        <el-form-item label="附加信息">
          <el-checkbox-group v-model="form.dsla_storelayer" disabled>
            <el-checkbox
                v-for="item in checkboxType"
                :key="item.value"
                :label="item.value"
                :value="item.code"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataSaveConfigure = false" size="mini" type="danger"
        >关 闭
        </el-button
        >
      </div>
    </el-dialog>
    <!-- 批量新增任务 -->
    <el-dialog
        title="新增任务"
        :visible.sync="addjobdialogFormVisible"
        width="50%"
    >
      <el-row>
        <el-button class="els" type="primary" @click="addjobline()" size="small"
        >新增行
        </el-button
        >
      </el-row>
      <el-form :model="jobmodel" ref="jobdata">
        <el-table :data="jobmodel.addjobData">
          <el-table-column
              :render-header="addRedStar"
              prop="date"
              label="任务编号"
              align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                  :prop="'addjobData.' + scope.$index + '.task_number'"
                  :rules="rule.default"
                  size="mini"
              >
                <!--<span style="color: red;">*</span>-->
                <el-input
                    v-model="scope.row.task_number"
                    placeholder="请输入任务编号"
                    size="mini"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
              :render-header="addRedStar"
              prop="date"
              label="任务名称"
              align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                  :prop="'addjobData.' + scope.$index + '.task_name'"
                  :rules="rule.default"
                  size="mini"
              >
                <el-input
                    v-model="scope.row.task_name"
                    placeholder="请输入任务名称"
                    size="mini"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
              :render-header="addRedStar"
              prop="date"
              label="任务描述"
              align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                  :prop="'addjobData.' + scope.$index + '.task_desc'"
                  :rules="rule.default"
                  size="mini"
              >
                <el-input
                    v-model="scope.row.task_desc"
                    placeholder="请输入任务描述"
                    size="mini"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="备注" align="center">
            <template slot-scope="scope">
              <el-form-item
                  :prop="'addjobData.' + scope.$index + '.task_remark'"
                  size="mini"
              >
                <el-input
                    v-model="scope.row.task_remark"
                    placeholder="请输入备注"
                    size="mini"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操 作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  @click="deletejobline(scope.$index, scope.row)"
              >删除
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addjobdialogFormVisible = false" size="small"
        >取 消
        </el-button
        >
        <el-button type="primary" @click="saveJobData('jobdata')" size="small"
        >确 定
        </el-button
        >
      </div>
    </el-dialog>
    <!-- 修改任务信息 -->
    <el-dialog title="修改任务" :visible.sync="dialogFormVisible" width="50%">
      <el-form
          :model="jobmodel.upjobData"
          ref="upjobData"
          status-icon
          label-width="90px"
          class="demo-ruleForm"
          wieth="100%"
      >
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item
                label="任务编号"
                prop="task_number"
                :rules="rule.default"
            >
              <el-input
                  :disabled="iflock"
                  v-model="jobmodel.upjobData.task_number"
                  placeholder="任务编号"
                  size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item
                label="任务名称"
                prop="task_name"
                :rules="rule.default"
            >
              <el-input
                  :disabled="iflock"
                  v-model="jobmodel.upjobData.task_name"
                  placeholder="任务名称"
                  size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item
                label="任务描述"
                prop="task_desc"
                :rules="rule.default"
            >
              <el-input
                  :disabled="iflock"
                  v-model="jobmodel.upjobData.task_desc"
                  placeholder="任务描述"
                  size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="备注" prop="task_remark">
              <el-input
                  :disabled="iflock"
                  v-model="jobmodel.upjobData.task_remark"
                  placeholder="备注"
                  size="small"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small"
        >取 消
        </el-button
        >
        <el-button type="primary" @click="upjobData('upjobData')" size="small"
        >确 定
        </el-button
        >
      </div>
    </el-dialog>
    <!-- 生成作业信息 -->
    <el-dialog title="生成作业" :visible.sync="dialogEtlJobs" width="40%">
      <el-form
          ref="separatorData"
          :model="etlForm"
          label-width="240px"
          text-align="center"
      >
        <el-form-item label="选择系统" :rules="rule.default" prop="etl_sys_cd">
          <el-select
              placeholder="选择系统"
              v-model="etlForm.etl_sys_id"
              @change="getEtlSubSysData"
              size="medium"
          >
            <el-option
                v-for="(item, index) in etlSysData"
                :key="index"
                :label="item.etl_sys_cd"
                :value="item.etl_sys_id"
            >
              <span style="float: left">{{ item.etl_sys_cd }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.etl_sys_name
                }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            label="选择子系统"
            :rules="rule.default"
            prop="sub_sys_cd"
        >
          <el-select
              placeholder="选择子系统"
              v-model="etlForm.sub_sys_id"
              size="medium"
          >
            <el-option
                v-for="(item, index) in subSysData"
                :key="index"
                :label="item.sub_sys_cd"
                :value="item.sub_sys_id"
            >
              <span style="float: left">{{ item.sub_sys_cd }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.sub_sys_desc
                }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="批次调度时间" :rules="rule.default" prop="disp_time" clearable  size="medium">
            <el-time-picker placeholder="调度时间: HH:mm:ss"
                :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }" v-model="etlForm.disp_time"
                value-format="HH:mm:ss" format="HH:mm:ss" >
            </el-time-picker>
        </el-form-item> -->
        <el-form-item label="跑批日期" :rules="rule.selected" prop="etl_date">
          <el-select
              placeholder="跑批日期"
              v-model="etlForm.etl_date"
              size="medium"
              filterable
          >
            <el-option
                v-for="(item, index) in etlParams"
                :key="index"
                :label="item.title"
                :value="item.value"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.title
                }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
          class="demo-drawer__footer"
          style="margin-top: 15px; text-align: right"
      >
        <el-button type="danger" size="mini" @click="dialogEtlJobs = false"
        >取 消
        </el-button
        >
        <el-button
            type="primary"
            size="mini"
            @click="generateMarketJob('separatorData')"
        >生成作业
        </el-button
        >
      </div>
    </el-dialog>
    <!-- Excel数据导入 -->
    <el-dialog
        title="Excel数据导入"
        :visible.sync="dialogExcelJobs"
        width="40%"
    >
      <el-form
          ref="excelForm"
          :model="excelForm"
          label-width="240px"
          text-align="center"
      >
        <el-form-item label="选择集市" :rules="rule.selected">
          <el-select
              placeholder="选择集市"
              v-model="excelForm.data_mart_id"
              @change="oncategory(excelForm.data_mart_id)"
              style="width: 190px"
              size="medium"
          >
            <el-option
                v-for="(item, index) in marketinfotree"
                :key="index"
                :label="item.label"
                :value="item.id"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分类" :rules="rule.selected">
          <el-select
              placeholder="选择分类"
              v-model="excelForm.category_id"
              style="width: 190px"
              size="medium"
          >
            <el-option
                v-for="(item, index) in selectcategory"
                :key="index"
                :label="item.category_name"
                :value="item.category_id"
            >
              <span style="float: left">{{ item.category_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.category_num
                }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传EXCEL文件">
          <el-upload
              ref="upload"
              accept=".xlsx"
              :fileList="fileList"
              action=""
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleChange"
          >
            <el-button size="small" type="primary">选择上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
          class="demo-drawer__footer"
          style="margin-top: 15px; text-align: right"
      >
        <el-button
            type="danger"
            size="small"
            @click="dialogExcelJobs = false"
            style="margin-right: 5px"
        >取 消
        </el-button>
        <el-button
            type="primary"
            size="small"
            @click="uploadExcelFile"
            style="margin-right: 5px"
        >导 入
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="数据预览"
        :visible.sync="viewDialogFormVisble"
        width="60%"
    >
      <el-row>
        <el-table :data="viewTableData" border size="mini">
          <el-table-column
              v-for="(index, item) in viewTableData[0]"
              :key="item"
              :label="item"
              show-overflow-tooltip
              :prop="item"
          >
            <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button
            type="primary"
            size="medium"
            class="rightbtn"
            @click="viewDialogFormVisble = false"
        >
          确 定
        </el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="FlinkSql窗口" :visible.sync="flinkSqlVisible">
      <el-row>
        <el-form :model="windowFrom" :inline="true">
          <el-form-item label="窗口函数" size="small">
            <el-radio-group v-model="windowFrom.method">
              <el-radio label="滑动窗口"></el-radio>
              <el-radio label="滚动窗口"></el-radio>
              <el-radio label="会话窗口"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="windowFrom.method == '滑动窗口'">
        <el-form
            :model="slideWindow"
            :rules="slideRules"
            ref="slideWindow"
            :inline="true"
            class="demo-form-inline"
        >
          <el-form-item label="时间大小" prop="time_attr" size="small">
            <el-input v-model="slideWindow.time_attr"></el-input>
          </el-form-item>
          <el-form-item label="窗口大小" prop="windowSize" size="small">
            <el-input v-model="slideWindow.windowSize"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="windowFrom.method == '滚动窗口'">
        <el-form
            :model="rollWindow"
            :rules="rollRules"
            ref="rollWindow"
            :inline="true"
            class="demo-form-inline"
        >
          <el-form-item label="时间大小" prop="time_attr">
            <el-input v-model="rollWindow.time_attr" size="small"></el-input>
          </el-form-item>
          <el-form-item label="滑动步长" prop="slidingStep">
            <el-input v-model="rollWindow.slidingStep" size="small"></el-input>
          </el-form-item>
          <el-form-item label="窗口大小" prop="windowSize">
            <el-input v-model="windowFrom.windowSize" size="small"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="windowFrom.method == '会话窗口'">
        <el-form
            :model="sessionWindow"
            :rules="sessionRules"
            ref="sessionWindow"
            :inline="true"
            class="demo-form-inline"
        >
          <el-form-item label="时间大小" prop="time_attr">
            <el-input v-model="sessionWindow.time_attr" size="small"></el-input>
          </el-form-item>
          <el-form-item label="窗口大小" prop="windowSize">
            <el-input
                v-model="sessionWindow.windowSize"
                size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button
            type="primary"
            @click="submit('slideWindow')"
            v-if="windowFrom.method == '滑动窗口'"
        >确 定</el-button
        >
        <el-button
            type="primary"
            @click="submit('rollWindow')"
            v-else-if="windowFrom.method == '滚动窗口'"
        >确 定</el-button
        >
        <el-button type="primary" @click="submit('sessionWindow')" v-else
        >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import validator from "@/utils/validator";
import {
  modelFormConfig,
  modelFormData,
  modelFormGroupConfig,
  modelFormGroupData,
  modelFormGroupItems,
  modelFormGroupNameConfig,
  modelFormGroupNameData,
  modelFormGroupNameItems,
  modelFormGroupNameRules,
  modelFormGroupRules,
  modelFormItems,
  modelFormRules,
} from "./mock";
import {
  getFlatArr,
  parseSimpleTreeData,
  treeFindPath,
} from "@/utils/datahandler";
import ByModel from "@/components/global/ByModel.vue";
import { startSuccess } from "@/utils/message";

let arr = [];
export default {
  components: { ByModel },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      // 滑动窗口数据
      slideWindow: {
        time_attr: null,
        windowSize: null,
      },
      slideRules: {
        time_attr: [
          { required: true, message: "请输入时间大小", trigger: "blur" },
        ],
        windowSize: [
          { required: true, message: "请输入窗口大小", trigger: "blur" },
        ],
      },
      // 滚动窗口数据
      rollWindow: {
        time_attr: null,
        slidingStep: null,
        windowSize: null,
      },
      rollRules: {
        time_attr: [
          { required: true, message: "请输入时间大小", trigger: "blur" },
        ],
        slidingStep: [
          { required: true, message: "请输入滑动步长", trigger: "blur" },
        ],
        windowSize: [
          { required: true, message: "请输入窗口大小", trigger: "blur" },
        ],
      },
      // 会话窗口数据
      sessionWindow: {
        time_attr: null,
        windowSize: null,
      },
      sessionRules: {
        time_attr: [
          { required: true, message: "请输入时间大小", trigger: "blur" },
        ],
        windowSize: [
          { required: true, message: "请输入窗口大小", trigger: "blur" },
        ],
      },
      windowFrom: {
        method: null,
      },
      is_taskTag: true,
      flinkSqlVisible: false,
      updateFlag: false,
      visible: false,
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      modelFormItems,
      modelFormRules,
      modelFormConfig,
      modelTitle: "",
      //分类弹窗
      visibleGroup: false,
      modelTitleGroup: "",
      modelFormGroupData: JSON.parse(JSON.stringify(modelFormGroupData)),
      modelFormGroupItems,
      modelFormGroupRules,
      modelFormGroupConfig,
      optionTreeData: [], //上级分类option树
      //修改分类
      visibleGroupName: false,
      modelTitleGroupName: "修改分类",
      modelFormGroupNameData: JSON.parse(JSON.stringify(modelFormGroupData)),
      modelFormGroupNameItems,
      modelFormGroupNameRules,
      modelFormGroupNameConfig,

      etlParams: [
        {title: "当前跑批日", value: "#{txdate}"},
        {title: "前一天跑批日", value: "#{txdate_pre}"},
        {title: "后一天跑批日", value: "#{txdate_next}"},
      ],
      filterText: "",
      isJob: true,
      treeDataTable_id: [],
      iflock: false,
      form: [],
      // 表单验证
      tablefromName: ["dm_datatable", "columnModel"],
      item: "",
      dsl_id: null,
      // 集市ID
      market_id: "",
      // 系统id
      category_id: "",
      dataSaveConfigure: false,
      tableDataConfigure: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      dmInfoId: "", // 用于选中左侧树后点击添加，显示相关信息
      cateId: "", // 用于选中左侧树后点击添加，显示相关信息
      selectmarke: [],
      selectcategory: [],
      tableData: [],
      // 数据存储层所需信息
      tableStorageData: [],
      datatable_ids: [],
      treeparent: [],
      treetitle: "表信息",
      zkname: "分类",
      isFlag: [],
      isFlag1: [],
      marketinfotree: [],
      marketinfotreeTwo: [],
      activeName: "basicscon",
      columnModel: {
        columnbysql: [],
      },
      allfield_process: [],
      rule: validator,
      isObjectType: true,
      is_add: "",
      checkboxType: [],
      // preJobForm: {
      //   sqlMain: "",
      // },
      // 主键信息
      columnmore: [],
      // 字段类型
      allfield_type: [],
      dm_datatable: {
        partition_fields: "",
        data_mart_id: "",
        category_id: "",
        sqlMain: "",
      },
      // sql 执行引擎代码项
      allsqlengine: [],
      alldatatablelifecycle: [],
      // 作业
      jobData: [],
      allstoragetype: [],
      objectType: [],
      objectType1: [],
      // 新增作业所需数据
      dialogtitl: "",
      allstoragetype1: [],
      dialogFormVisible: false,
      addjobdialogFormVisible: false,
      dialogExcelJobs: false,
      jobmodel: {
        addjobData: [],
        upjobData: {},
      },
      dialogEtlJobs: false,
      etlForm: { etl_date: "#{txdate}" },
      excelForm: {
        category_id: "",
        data_mart_id: "",
      },
      categoryData: [],
      subSysData: [],
      etlSysData: [],
      params: {},
      numberTypes: ["INT", "BIGINT", "STRING", "FLOAT", "DOUBLE"],
      fileList: [],
      viewDialogFormVisble: false,
      viewTableData: [],
      isBatchJob: false,
      isTableChange: "0", // 0：表信息未发生变化，1：发生变化
      old_datatable_en_name: "",
      selectTree: {},
    };
  },
  mounted() {
    sessionStorage.removeItem("params");
    this.initTree();

    this.$Code
        .getCategoryItems({
          category: "IsFlag",
        })
        .then((res) => {
          this.isFlag = res.data;
        });
    this.$Code
        .getCodeItems({
          category: "IsFlag",
        })
        .then((res) => {
          this.isFlag1 = res.data;
        });
    this.$Code
        .getCodeItems({
          category: "ProcessType",
        })
        .then((res) => {
          this.processType = res.data;
        });
    this.echojobtable();
    this.getTreeDataInfo();
    // 获取默认存储层
    //this.getDefaultStoreLayer();
    // 获取存储层信息
    this.getdb();
    this.$Code
        .getCategoryItems({
          category: "StorageType",
        })
        .then((res) => {
          if (res && res.success) {
            for (let dataKey of res.data) {
              if (dataKey.code !== "5") {
                this.allstoragetype.push(dataKey);
              }
            }
          }
        });
    this.$Code
        .getCodeItems({
          category: "StorageType",
        })
        .then((res) => {
          this.allstoragetype1 = res.data;
        });
    /*this.$Code.getCodeItems({
        category: 'SqlEngine'
    }).then(res => {
        this.allsqlengine = res.data
    })*/
    this.$Code
        .getCategoryItems({
          category: "SqlEngine",
        })
        .then((res) => {
          if (res && res.success) {
            for (let dataKey of res.data) {
              this.allsqlengine.push(dataKey);
            }
          }
        });
    this.$Code
        .getCodeItems({
          category: "TableLifeCycle",
        })
        .then((res) => {
          this.alldatatablelifecycle = res.data;
        });
    this.$Code
        .getCodeItems({
          category: "TableStorage",
        })
        .then((res) => {
          this.objectType1 = res.data;
        });
    this.$Code
        .getCategoryItems({
          category: "TableStorage",
        })
        .then((res) => {
          this.objectType = res.data;
        });
    this.$Code
        .getCategoryItems({
          category: "ProcessType",
        })
        .then((res) => {
          this.allfield_process = res.data;
        });
  },
  methods: {
    //执行引擎选择Flink Sql 时调用的函数
    sqlEngineChange() {
      if (this.dm_datatable.sql_engine == 3) {
        this.flinkSqlVisible = true;
      }
    },
    //提交窗口函数配置信息
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.flinkSqlVisible = false;
          if (formName == "slideWindow") {
            //滑动窗口
            console.log(this.slideWindow, "this.slideWindow");
          } else if (formName == "rollWindow") {
            //滚动窗口
            console.log(this.rollWindow, "this.rollWindow");
          } else if (formName == "sessionWindow") {
            //会话窗口
            console.log(this.sessionWindow, "this.sessionWindow");
          }
        } else {
          console.log("error submit!!");
        }
      });
    },
    //取消窗口函数弹框
    cancel() {
      // this.$refs[formName].resetFields();
      // 滑动窗口数据
      this.slideWindow = {
        time_attr: null,
        windowSize: null,
      };
      // 滚动窗口数据
      this.rollWindow = {
        time_attr: null,
        slidingStep: null,
        windowSize: null,
      };
      // 会话窗口数据
      this.sessionWindow = {
        time_attr: null,
        windowSize: null,
      };
      this.windowFrom.method = null;
      this.flinkSqlVisible = false;
    },
    //树初始化
    initTree() {
      this.$executeRequest
          .execGetByModulName("/market/getMarketTreeData")
          .then((res) => {
            const list = res.data;
            let arr = getFlatArr(list);
            arr.map((item) => {
              item.showLable = item.label;
              item.type = "text";
              if (item.children?.length > 0) {
                item.expanded = false;
                item.children = [];
              }
              if (item.data_own_type === "Market") {
                item.dropList = [
                  {
                    label: "编辑工程",
                    type: "EDITPROJECT",
                  },
                  {
                    label: "添加分类",
                    type: "ADDGROUP",
                  },
                  {
                    label: "下载工程",
                    type: "DOWNLOADPROJECT",
                  },
                  {
                    label: "删除",
                    type: "DELETEPROJECT",
                  },
                ];
              } else {
                item.dropList = [
                  {
                    label: "添加同级分类",
                    type: "ADDSAMEGROUP",
                  },
                  {
                    label: "添加子集分类",
                    type: "ADDCHILDGROUP",
                  },
                  {
                    label: "修改分类",
                    type: "EDITGROUP",
                  },
                  {
                    label: "删除",
                    type: "DELETEGROUP",
                  },
                ];
              }
            });
            arr.unshift({
              id: 0,
              label: "添加工程",
              showLable: "添加工程",
              expanded: false,
              type: "add",
            });
            this.marketinfotreeTwo = parseSimpleTreeData(arr, "id", "parent_id");
            //上级分类option树
            this.initOptionList(list);
          });
    },
    //上级分类option树
    initOptionList(list) {
      let arr = getFlatArr(JSON.parse(JSON.stringify(list)));
      arr.map((item) => (item.parent_id = item.parent_id || 0));
      this.optionTreeData = parseSimpleTreeData(arr, "id", "parent_id");
      this.modelFormGroupItems.map((item) => {
        if (item.prop == "parent_category_id") {
          item.options = this.optionTreeData;
        }
      });
    },
    addProject() {
      this.modelTitle = "新增集市";
      this.visible = true;
    },
    logDetail(data, reload = false) {
      this.selectTree = data;
      this.isJob = true;
      /* let params;
       if (data.data_own_type == "Market") {
         params = {
           data_mart_id: data.id,
         };
       } else {
         let list = treeFindPath(
             this.optionTreeData,
             (val) => val.id === data.id,
             "id"
         );
         params = {
           data_mart_id: list[0],
           category_id: data.id,
         };
       }*/
      /*if (this.currentId !== data.id || reload) {
        this.currentId = data.id;
        this.currentData = data;
        this.data_mart_id = params.data_mart_id;
      }*/
      this.dmInfoId = null;
      this.cateId = null;
      if (data.parent_id == null) {
        this.dmInfoId = data.id;
      } else {
        this.dmInfoId = data.parent_id;
        this.cateId = data.id;
      }
      // this.dmInfoId = data.parent_id;
      // this.cateId = data.id;
      this.getDmDataTableByDmCategory(this.dmInfoId, this.cateId);
    },
    contextmenu(val) {
      switch (val.command) {
        case "EDITPROJECT":
          this.editProject(val.data.id);
          break;
        case "ADDGROUP":
          this.addGroup(val.data.id);
          break;
        case "ADDSAMEGROUP":
          this.addSameOrChildGroup(val.data.parent_id);
          break;
        case "ADDCHILDGROUP":
          this.addSameOrChildGroup(val.data.id);
          break;
        case "DELETEPROJECT":
          this.deleteProject(val.data);
          break;
        case "DOWNLOADPROJECT":
          this.downloadProject(val.data);
          break;
        case "EDITGROUP":
          this.editGroup(val.data);
          break;
        case "DELETEGROUP":
          this.deleteGroup(val.data);
          break;
        default:
          break;
      }
    },
    //编辑工程
    editProject(id) {
      this.$executeRequest
          .execGetByModulName("/market/dmInfo/findDmInfoById", {
            dmInfoId: id,
          })
          .then((res) => {
            this.modelFormData = res.data;
            this.modelTitle = "编辑工程";
            this.visible = true;
          });

      this.modelTitle = "编辑工程";
      this.visible = true;
    },
    //新建分类
    addGroup(id) {
      this.modelTitleGroup = "新建分类";
      this.modelFormGroupData.parent_category_id = [id];
      this.visibleGroup = true;
    },
    //新建同级分类
    addSameOrChildGroup(id) {
      this.modelTitleGroup = "新建分类";
      const list = treeFindPath(
          this.optionTreeData,
          (data) => data.id === id,
          "id"
      );
      this.modelFormGroupData.parent_category_id = list;
      this.visibleGroup = true;
    },
    //删除工程
    deleteProject(data) {
      this.$Msg
          .confirmMsg("确定删除 " + data.label + " 吗")
          .then(() => {
            this.$executeRequest
                .execGetByModulName("/market/dmInfo/delDmInfo", {
                  dmInfoId: data.id,
                })
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.customizTitle("删除成功", "success");
                    this.initTree();
                  }
                });
          })
          .catch(() => {
          });
    },
    //下载工程
    downloadProject(data) {
      this.$Msg
        .confirmMsg("确定导出 " + data.label + " 吗")
        .then((res) => {
          this.$executeRequest
            .downloadFile("/H/market/downloadMart", { data_mart_id: data.id })
            .then((res) => {
              let fileName = data.label + ".hrds";
              this.$FileOperations.fileDownload(res, fileName);
            });
        })
        .catch(() => {});
    },
    //编辑分类
    editGroup(data) {
      this.modelTitleGroupName = "编辑分类";
      const obj = {
        category_name: data.label,
        category_id: data.id,
      };
      this.modelFormGroupNameData = JSON.parse(JSON.stringify(obj));
      this.visibleGroupName = true;
    },
    //删除分类
    deleteGroup(data) {
      this.$Msg
          .confirmMsg("确定删除 " + data.label + " 吗")
          .then((res) => {
            this.$executeRequest
                .execGetByModulName("/market/dmCategory/delDmCategory", {
                  categoryId: data.id,
                })
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.customizTitle("删除成功", "success");
                    this.initTree();
                  }
                });
          })
          .catch(() => {
          });
    },
    dialogCancel() {
      this.visible = false;
    },
    //工程弹窗关闭之后
    dialogClosed() {
      this.modelFormData = JSON.parse(JSON.stringify(modelFormData));
      this.$refs.dataAdd.$refs[this.modelFormConfig.ref].resetFields();
    },
    //关闭新增分类弹窗
    dialogCancelGroup() {
      this.visibleGroup = false;
    },
    //分类弹窗关闭之后
    dialogClosedGroup() {
      this.modelFormGroupData = JSON.parse(JSON.stringify(modelFormGroupData));
      this.$refs.dataMarkGroup.$refs[
          this.modelFormGroupConfig.ref
          ].resetFields();
    },
    //关闭编辑分类弹窗
    dialogCancelGroupName() {
      this.visibleGroupName = false;
    },
    //关闭编辑分类弹窗之后
    dialogClosedGroupName() {
      this.modelFormGroupNameData = JSON.parse(
          JSON.stringify(modelFormGroupNameData)
      );
      this.$refs.dataMarkGroupName.$refs[
          this.modelFormGroupNameConfig.ref
          ].resetFields();
    },
    //编辑分类
    confirmGroupName() {
      this.$refs.dataMarkGroupName.$refs[
          this.modelFormGroupNameConfig.ref
          ].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.modelFormGroupNameData);
          this.$executeRequest
              .execPostByModulName("/market/dmCategory/updateDmCategory", params)
              .then((res) => {
                if (res && res.success) {
                  this.$message({
                    type: "success",
                    message: "保存成功",
                  });
                  this.initTree();
                  this.visibleGroupName = false;
                }
              });
        }
      });
    },
    //新增分类
    addDmCategory() {
      this.$refs.dataMarkGroup.$refs[this.modelFormGroupConfig.ref].validate(
          (valid) => {
            if (valid) {
              const obj = Object.assign({}, this.modelFormGroupData, {
                parent_category_id:
                    this.modelFormGroupData.parent_category_id[
                    this.modelFormGroupData.parent_category_id.length - 1
                        ],
                data_mart_id: this.modelFormGroupData.parent_category_id[0],
                category_id: null,
              });
              const params = Object.assign({}, obj);
              this.$executeRequest
                  .execPostByModulName("/market/dmCategory/addDmCategory", params)
                  .then((res) => {
                    if (res && res.success) {
                      this.$message({
                        type: "success",
                        message: "保存成功",
                      });
                      this.initTree();
                      this.visibleGroup = false;
                    }
                  });
            }
          }
      );
    },
    addDmInfo() {
      this.$refs.dataAdd.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.modelFormData);
          this.$executeRequest
              .execPostByModulName("/market/dmInfo/addDmInfo", params)
              .then((res) => {
                if (res && res.success) {
                  this.$message({
                    type: "success",
                    message: "保存成功",
                  });
                  this.initTree();
                  this.visible = false;
                }
              });
        }
      });
    },
    //导入工程上传成功
    uploadFile(file) {
      let param = new FormData(); // 创建form对象
      param.append("file", file.file);
      this.$executeRequest
          .uploadModuleFile("/market/getImportFilePath", param)
          .then((res) => {
            this.isLoading = false;
            this.dialogImportData = false;
            this.fileList = [];
            location.reload();
          });
    },
    //导入工程上传之前
    handleBeforeUpload(file) {
      const isHrds = file.name.split(".")[1] === "hrds";
      if (!isHrds) {
        this.$message.error("请上传hrds文件");
        return false;
      } else {
        return new Promise((resolve, reject) => {
          this.$confirm(`确认导入“${file.name}”`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
              .then(() => {
                resolve();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消上传",
                });
                reject();
              });
        });
      }
    },
    // 表 字段 内容回显
    echotable(datatable_id) {
      this.columnmore = [];
      this.getcolumnfromdatabase(datatable_id);
      this.queryDMDataTableByDataTableId(datatable_id);
    },
    // 递归函数
    platform(node) {
      if (!node.parent) {
        // 若无父节点，则直接返回
        return;
      }
      this.treeparent.push({
        id: node.data.id,
        label: node.data.label,
      });
      //调用递归
      this.platform(node.parent);
    },
    gettreetitle() {
      for (let index = this.treeparent.length - 1; index >= 0; index--) {
        if (index == 0) {
          this.treetitle += this.treeparent[index].label;
        } else {
          this.treetitle += this.treeparent[index].label + " - ";
        }
      }
    },
    // 新增字段
    addcolumn() {
      let param = {
        field_process: "3",
        field_length: "",
      };
      this.columnModel.columnbysql.push(param);
    },
    // 删除字段
    deletecolumn(index, row) {
      this.columnModel.columnbysql.splice(index, 1);
    },
    // 根据选择的数据库,设置字段类型
    ondatabase(dsl_id) {
      this.$executeRequest
          .execGetByModulName("/market/getAllFieldType", {
            dslId: dsl_id,
          })
          .then((res) => {
            //这里对查询到的字段类型进行处理,替换掉类型中的 "(" 和 ")",并过滤掉重复的字段
            const typeSet = new Set();
            res.data.forEach((item) => {
              typeSet.add(item.replace("(", "").replace(")", ""));
            });
            this.allfield_type = [...typeSet];
          });
      // 获取数据存储层附件信息
      this.$executeRequest
          .execGetByModulName("/market/getColumnDslMore", {
            dslId: dsl_id,
          })
          .then((res) => {
            this.columnmore = res.data || [];
            res.data.forEach((item) => {
              this.$Code
                  .getValue({
                    category: "StoreLayerAdded",
                    code: item.dsla_storelayer,
                  })
                  .then((res) => {
                    item.dsla_storelayer = res.data;
                  });
            });
            this.columnmore = res.data || [];
          });
    },
    // tabs 点击事件
    handleClick(tab, event) {
      if (tab.name === "jodcon") {
        if (this.dm_datatable.module_table_id) {
          this.getTempJobData(this.dm_datatable.module_table_id);
        }
      }
    },
    //  数据存储层配置信息
    getdb() {
      this.$executeRequest
          .execGetByModulName("/market/searchDataStore", null)
          .then((res) => {
            if (res && res.success) {
              res.data.forEach((item) => {
                this.$Code
                    .getValue({
                      category: "IsFlag",
                      code: item.is_hadoopclient,
                    })
                    .then((res) => {
                      item.is_hadoopclient = res.data;
                    });
                this.$Code
                    .getValue({
                      category: "Store_type",
                      code: item.store_type,
                    })
                    .then((res) => {
                      item.store_type = res.data;
                    });
              });
              this.tableStorageData = res.data;
            }
          });
    },
    getDmDataTableByDmCategory(data_mart_id, category_id) {
      //获取所有信息表通过节点
      // if (data_mart_id == null) {
      //   this.tableData = []
      // }
      this.$executeRequest
          .execGetByModulName(
              "/market/dmModuleTable/findDmModuleTablesByDmInfoIdAndCateId",
              {
                dmInfoId: data_mart_id,
                cateId: category_id,
              }
          )
          .then((res) => {
            // 给表信息赋值
            this.tableData = res.data;
            // 把表的子节点添加到树形结构上
            /* res.data.forEach((table, index) => {
             // 设置作业数
             if (table.datatable_id) {
               functionAll.getTempJobData({
                 datatable_id: table.datatable_id
               }).then(job => {
                 this.$set(table, 'jobNum', job.data.length || 0)
               })
             }
           })*/
          });
    },

    // 任务保存
    saveJobData(jobdata) {
      this.$refs[jobdata].validate((valid) => {
        if (valid) {
          // console.log("asdas" + JSON.stringify(this.jobmodel.addjobData))
          this.$executeRequest
              .execPostByModulName(
                  "/market/dmTaskInfo/addDmTaskInfos",
                  this.jobmodel.addjobData
              )
              .then((res) => {
                if (res.success) {
                  this.$Msg.customizTitle("添加成功!", "success");
                  this.addjobdialogFormVisible = false;
                  this.getTempJobData(this.dm_datatable.module_table_id);
                }
              });
        }
      });
    },
    // 任务修改
    upjobData(jobdata) {
      this.$executeRequest
          .execPostByModulName(
              "/market/dmTaskInfo/updateDmTaskInfo",
              this.jobmodel.upjobData
          )
          .then((res) => {
            if (res.success) {
              this.dialogFormVisible = false;
              this.getTempJobData(this.dm_datatable.module_table_id);
              this.$Msg.customizTitle("更新成功!", "success");
            }
          });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setSelect(index) {
      this.columnModel.columnbysql[index].field_length = "";
    },
    // 增加作业表
    addjobTable(row) {
      sessionStorage.setItem(
          "params",
          JSON.stringify({
            task_id: row.task_id,
            category_id: this.dm_datatable.category_id,
            data_mart_id: this.dm_datatable.data_mart_id,
            datatable_id: this.dm_datatable.module_table_id,
            module_table_default_name: this.dm_datatable.module_table_en_name,
            dsl_id: this.dsl_id,
          })
      );
      this.$router.push({
        name: "jobDetail",
      });
    },
    // 删除作业
    deleteJobData(row) {
      this.$Msg
          .confirmMsg("确认删除" + row.task_number + "吗？")
          .then((res) => {
            this.$executeRequest
                .execGetByModulName(
                    "/market/dmJobTableInfo/findDmJobTableInfoByTaskId",
                    {taskId: row.task_id}
                )
                .then((res) => {
                  if (res && res.success) {
                    if (res.data.length != 0) {
                      this.$Msg.customizTitle(
                          "此任务下有作业存在，请先删除作业！",
                          "info"
                      );
                    } else {
                      this.$executeRequest
                          .execGetByModulName("/market/dmTaskInfo/delDmTaskInfo", {
                            dmTaskInfoId: row.task_id,
                          })
                          .then((res) => {
                            if (res && res.success) {
                              this.$Msg.customizTitle("删除任务成功", "success");
                              this.getTempJobData(this.dm_datatable.module_table_id);
                            }
                          });
                    }
                  }
                });
          })
          .catch(() => {
            this.$Msg.customizTitle("已取消删除", "info");
          });
    },
    // 新增作业行
    addjobline() {
      let line = {
        module_table_id: this.dm_datatable.module_table_id,
      };
      this.jobmodel.addjobData.push(line);
    },
    // 修改作业
    updatajopdata(row) {
      this.is_taskTag = true;
      this.jobmodel.upjobData = {};
      this.dialogFormVisible = true;
      this.jobmodel.upjobData = row;
    },
    deletejobline(index, row) {
      // 先判断字段是否存在id..
      this.jobmodel.addjobData.splice(index, 1);
    },
    // 查询所以作业
    getTempJobData(datatable_id) {
      this.$executeRequest
          .execGetByModulName("/market/dmTaskInfo/findDmTaskInfosByTableId", {
            dataTableId: datatable_id,
          })
          .then((res) => {
            this.jobData = res.data;
          });
    },
    // 表新增
    addTable() {
      this.is_taskTag = false;
      this.updateFlag = false;
      this.treetitle = "新增-创建表";
      this.activeName = "basicscon";
      this.is_add = "0";
      this.isJob = false;
      this.dm_datatable = {};
      // this.dm_datatable.data_mart_id = data.label
      this.getTreeDataInfo();
      //获取存储层
      this.getdb();
      this.columnModel.columnbysql = [];
      // this.ondatabase(this.dsl_id)

      if (this.selectTree) {
        if (this.selectTree.parent_id == null) {
          // Object.assign(this.dm_datatable.data_mart_id,this.selectTree.showLable)
          this.$set(this.dm_datatable, "data_mart_id", this.selectTree.id);
          this.oncategory(this.selectTree.id);
        } else {
          this.$set(
              this.dm_datatable,
              "data_mart_id",
              this.selectTree.parent_id
          );
          this.oncategory(this.selectTree.parent_id);
          this.$set(this.dm_datatable, "category_id", this.selectTree.id);
        }
      }
    },
    // 批量删除
    deleteAllTable() {
      this.$confirm("确认批量删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            if (this.datatable_ids.length === 0) {
              this.$Msg.customizTitle("请至少选择一条数据删除！", "warning");
              return;
            }
            let arr = [];
            this.datatable_ids.forEach((item) => {
              arr.push(item.datatable_id);
            });
            /*let params = new FormData();
          params.append("datatable_ids", JSON.stringify(arr));*/
            this.$executeRequest
                .execPostByModulName("/market/dmDataTable/delDmDataTableByIds", {
                  ids: arr,
                })
                .then((res) => {
                  if (res && res.success) {
                    this.getDmDataTableByDmCategory(
                        this.dm_datatable.data_mart_id,
                        this.dm_datatable.category_id
                    );
                    this.$Msg.customizTitle("批量删除成功", "success");
                  }
                });
          })
          .catch(() => {
            this.$Msg.customizTitle("已取消批量删除", "info");
          });
    },
    // 批量生成作业
    batchGenerateJobBtn() {
      if (this.datatable_ids.length === 0) {
        this.$Msg.customizTitle("请至少选择一条数据删除！", "warning");
        return;
      }
      // 打开生成作业dialog时清空dialog
      this.etlForm = { etl_date: "#{txdate}" };
      this.dialogEtlJobs = true;
      this.isBatchJob = true;
      this.queryAllEtlSys();
    },
    // 验证表名是否存在
    checkrepeat() {
      let param = {
        tableName: this.dm_datatable.module_table_en_name,
        //"datatable_id": this.dm_datatable.datatable_id,
      };
      if (this.dm_datatable.module_table_en_name === "") {
        return false;
      }
      this.$executeRequest
          .execGetByModulName("/market/dmModuleTable/checkTableName", param)
          .then((res) => {
            if (res && res.success) {
              if (res.data === false) {
                // this.echotable(res.data.datatable_id)
                // this.dm_datatable.datatable_id = res.data.datatable_id
                this.is_add = "1";
                this.$message.warning("数据表已存在,请重新输入表名称");
                this.dm_datatable.module_table_en_name = "";
              } else {
                if (this.dm_datatable.module_table_id) {
                  this.is_add = "1";
                } else {
                  this.is_add = "0";
                }
              }
            }
          });
    },
    checkModuleTableIsRun(module_table_id) {
      this.updateFlag = false;
      this.$executeRequest
          .execGetByModulName("/market/dmModuleTable/checkModuleTableIsRun", {
            moduleTableId: module_table_id,
          })
          .then((res) => {
            if (res.data) {
              this.updateFlag = true;
            }
          });
    },
    // 编辑
    compiletable(row) {
      this.is_taskTag = true;
      this.checkModuleTableIsRun(row.module_table_id);
      this.treetitle = "编辑-编辑表";
      this.is_add = "1";
      this.isJob = false;
      this.activeName = "basicscon";
      this.echotable(row.module_table_id);
      this.oncategory(row.data_mart_id);
    },
    jobdep(row) {
      this.is_taskTag = true;
      this.checkModuleTableIsRun(row.module_table_id);
      this.treetitle = "编辑-编辑表";
      this.is_add = "1";
      this.isJob = false;
      this.activeName = "jodcon";
      this.getTempJobData(row.module_table_id);
      //console.log("row.datatable_id" + row.module_table_id)
      this.echotable(row.module_table_id);
      this.oncategory(this.dmInfoId);
    },
    // 预览模型表数据
    viewModelTableData(row) {
      // TODO 目前预留，先写死测试
      //const name = row.datatable_en_name;
      const name = "dm_category";
      this.$executeRequest
          .execGetByModulName("/market/dmDataTable/findDataByDmTableName", {
            dmTableName: name,
          })
          .then((res) => {
            if (res && res.success) {
              this.viewDialogFormVisble = true;
              this.viewTableData = res.data;
            }
          });
    },
    // 查看表信息
    queryDMDataTableByDataTableId(datatable_id) {
      this.getdb();
      this.$executeRequest
          .execGetByModulName(
              "/market/dmModuleTable/queryDmModuleTableByDataTableId",
              {dmDatatableId: datatable_id}
          )
          .then((res) => {
            if (res && res.success) {
              this.dm_datatable = res.data[0];
              //console.log(this.dm_datatable)
              this.dsl_id = this.dm_datatable.dsl_id;
              //console.log(this.dsl_id + "dsdsdsd")
              this.ondatabase(this.dsl_id);
            } else {
              this.$emit(res.message);
            }
          });
    },
    // 保存
    addDmDataTable() {
      this.is_taskTag = true;
      var dslValid = false;
      var columnsValid = false;
      // 表信息表单的校验
      this.$refs.dm_datatable.validate(async (valid) =>{
        dslValid = valid;
      });
      // 字段列表的校验
      this.$refs.columnModel.validate(async (valid)=>{
        columnsValid = valid
      })
      // console.log("dslValid："+dslValid);
      // console.log("columnsValid："+columnsValid);
      // 全部通过校验才继续保存
      if(!(dslValid && columnsValid)){
        return ;
      }
      if (this.dm_datatable.table_storage === this.objectType1.ShuJuShiTu) {
        // if (this.preJobForm.sqlMain === "" || this.preJobForm.sqlMain == null) {
        if (this.dm_datatable.sqlMain === "" || this.dm_datatable.sqlMain == null) {
          this.$Msg.customizTitle("SQL语句为空请输入SQL语句", "warning");
          return false;
        }
      } else {
        // this.preJobForm.sqlMain = "";
        this.dm_datatable.sqlMain = "";
      }
      if (this.dsl_id == null || this.dsl_id == "") {
        this.$Msg.customizTitle("请选择存储目的地", "warning");
        return false;
      }

      //判断是否为oracle
      let isorclaeok = true;
      this.$executeRequest.execGetByModulName("/market/checkOracle", {
        dsl_id: this.dsl_id,
        datatable_en_name: this.dm_datatable.module_table_en_name,
      })
      .then((res) => {
        if (res && res.success) {
          isorclaeok = res.data;
          if (!res.data) {
            this.$Msg.customizTitle(
              "选择存储目的地为oracle,且表名长度大于26，请修改表名!",
              "warning"
            );
            return false;
          }
          this.market_id = this.dm_datatable.data_mart_id;
          this.category_id = this.dm_datatable.category_id;
          if (this.is_add === "0") {
            //this.dm_datatable.sql_engine = this.allsqlengine.SPARK;
            this.dm_datatable.module_table_life_cycle = this.alldatatablelifecycle.YongJiu;
            this.dm_datatable.repeat_flag = this.isFlag1.Fou;
            this.dm_datatable.dsl_id = this.dsl_id;
            if (
              this.dm_datatable.table_storage !== this.objectType1.ShuJuBiao
            ) {
              // 数据视图保存时数据信息
              this.dm_datatable.storage_type = this.allstoragetype1.UpSet;
            }
              this.$executeRequest
                .execPostByModulName(
                  "/market/dmModuleTable/addDmModuleTable/" + this.dsl_id,
                  this.dm_datatable
                )
                .then((res) => {
                  // this.isLoading = false;
                  if (res && res.success) {
                    // 保存
                    this.datatable_id = res.data;
                    this.dm_datatable.module_table_id = res.data;
                    // 保存字段信息
                    this.savecolumn();
                    //表格信息
                    this.getTreeDataInfo(); //刷新树形结构数据
                    this.activeName = "jodcon";
                    this.$Msg.customizTitle("添加成功", "success");
                  }
                });
            }
            //更新
            else {
              this.dm_datatable.dsl_id = this.dsl_id;
              this.$executeRequest
                .execPostByModulName(
                  "/market/dmModuleTable/updateDmModuleTable/" + this.dsl_id,
                  this.dm_datatable
                )
                .then((res) => {
                  if (res && res.success) {
                    //this.datatable_id = res.data.datatable_id
                    //this.dm_datatable.datatable_id = res.data.datatable_id
                    //this.isTableChange = res.data.isTableChange
                    //this.old_datatable_en_name = res.data.datatable_en_name;
                    // 保存字段信息
                    this.savecolumn();
                    // this.getDmDataTableByDmCategory(this.market_id, this.category_id) //表格信息
                    this.getTreeDataInfo(); //刷新树形结构数据
                    this.treetitle = "";
                    this.gettreetitle();
                    this.is_add = "1";
                    this.treeDataTable_id = this.dm_datatable.module_table_id;
                    this.$Msg.customizTitle("修改成功", "success");
                    //location.reload();
                  }
                });
            }
            this.getDmDataTableByDmCategory(this.dmInfoId, this.cateId);
          } else {
            this.$emit(res.message);
          }
        });
    },
    //返回
    gobackBtn() {
      this.isJob = true;
      this.getDmDataTableByDmCategory(this.dmInfoId, this.cateId);
    },
    // 新增作业
    addjob() {
      // 设置弹出框新增作业信息
      this.addjobdialogFormVisible = true;
      this.jobmodel.addjobData = [];
    },
    // 保存字段信息
    savecolumn() {
      let querysql = [];
      this.columnModel.columnbysql.forEach((item) => {
        if (item.field_en_name) querysql.push(item.field_en_name);
      });
      if (querysql.length === 0) {
        this.$Msg.customizTitle("字段新为空", "error");
      }
      let sql =
          "SELECT " +
          querysql.join(",") +
          " FROM " +
          this.dm_datatable.module_table_en_name;
      let dm_column_storage = [];
      for (var i = 0; i < this.columnmore.length; i++) {
        var dslad_id = this.columnmore[i].dslad_id;
        var dsla_storelayer = this.columnmore[i].dsla_storelayer;
        for (var j = 0; j < this.columnModel.columnbysql.length; j++) {
          var everydatatable_field_info = this.columnModel.columnbysql[j];
          if (everydatatable_field_info.hasOwnProperty(dsla_storelayer)) {
            if (everydatatable_field_info[dsla_storelayer] === true) {
              dm_column_storage.push({
                csi_number: j,
                dslad_id: dslad_id,
              });
            }
          }
        }
      }
      if (this.dm_datatable.table_storage !== this.objectType1.ShuJuBiao) {
        // 数据视图保存时数据信息
        // sql = this.preJobForm.sqlMain;
        sql = this.dm_datatable.sqlMain;
      }

      //确定字段顺序
      let dataTableInfos = [].concat(this.columnModel.columnbysql);
      for (let i = 0; i < this.columnModel.columnbysql.length; i++) {
        dataTableInfos[i].csi_number = i;
      }
      let param = {
        datatableFieldInfos: JSON.stringify(dataTableInfos),
        datatable_id: this.dm_datatable.module_table_id,
        dcolRelationStores: JSON.stringify(dm_column_storage),
        dsl_id: this.dsl_id
      };
      this.$executeRequest.execPostByModulName("/market/addDmModuleTableFields", param).then((res) => {
        if (res && res.success) {
          this.$Msg.customizTitle("保存成功", "success");
          this.is_add = "1";
          // 重新查询表字段信息
          this.getcolumnfromdatabase(this.dm_datatable.module_table_id);
        }
      });
    },
    // 字段回显信息
    getcolumnfromdatabase(datatable_id) {
      this.$executeRequest.execGetByModulName("/market/moduleTableField/findModuleTableFieldInfos",
              {dataTableId: datatable_id}
      ).then((res) => {
        if (res && res.success) {
          for (const obj of res.data) {
            if (obj.field_length == undefined) {
              obj.field_length = "";
            }
          }
        }
        this.columnModel.columnbysql = res.data;
      });
    },
    /*handleEdit(index, row) {
      this.searchDataStoreById(row.dsl_id);
    },*/
    // sql
    changeTextareaPreSql(val) {
      // this.$set(this.preJobForm, "sqlMain", val);
      this.$set(this.dm_datatable, "sqlMain", val);
    },
    // 查看数据存储层配置配置属性
    searchDataStoreById(dsl_id) {
      this.checkboxType = [];
      this.$executeRequest
          .execGetByModulName("/market/searchDataStoreById", {
            dsl_id: dsl_id,
          })
          .then((rs) => {
            let res = this.$Secret.DecryptJSON(rs.data);
            this.tableDataConfigure = res.data.layerAndAttr;
            this.form.dsl_name = res.data.dsl_name;
            this.form.store_type = res.data.store_type;
            res.data.layerAndAdded.forEach((item) => {
              this.$Code
                  .getValue({
                    category: "StoreLayerAdded",
                    code: item.dsla_storelayer,
                  })
                  .then((res) => {
                    this.checkboxType.push({
                      value: res.data,
                      code: item.dsla_storelayer,
                    });
                    this.form.dsla_storelayer = true;
                  });
            });
          });
    },
    // 获取集市和分类信息
    oncategory(dmInfoId) {
      if(dmInfoId && dmInfoId !== ""){
        // 获取分类信息
        this.$executeRequest.execGetByModulName("/market/dmCategory/findDmCategorysByDmInfoId", {
            data_mart_id: dmInfoId,
          }).then((res) => {
            this.selectcategory = res.data;
          });
      }
    },
    // 表删除
    deletetable(row) {
      this.$confirm(
          "确认删除" + row.module_table_en_name + "数据表吗?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then((result) => {
            if (row.jobNum != 0) {
              this.$Msg.customizTitle(
                  "此数据表下有作业存在，请先删除作业！",
                  "info"
              );
            } else {
              this.$executeRequest
                  .execGetByModulName("/market/dmModuleTable/delDmModuleTable", {
                    dmDatatableId: row.module_table_id,
                  })
                  .then((res) => {
                    if (res && res.success) {
                      this.$message({
                        message: "删除成功",
                        type: "success",
                      });
                      this.getDmDataTableByDmCategory(this.dmInfoId, this.cateId); //表格信息
                      this.getTreeDataInfo(); //刷新树形结构数据
                      // location.reload();
                    }
                  });
            }
          })
          .catch((err) => {
            this.$Msg.customizTitle("已取消", "info");
          });
    },
    // 作业信息回显
    echojobtable() {
      this.params = JSON.parse(sessionStorage.getItem("params"));
      if (this.params !== null) {
        this.dsl_id = this.params.dsl_id;
        if (
            this.params.data_mart_id !== undefined &&
            this.params.data_mart_id
        ) {
          this.oncategory(this.params.data_mart_id);
        }
        if (
            this.params.datatable_id !== undefined &&
            this.params.datatable_id
        ) {
          this.is_add = "1";
          this.isJob = false;
          this.activeName = "jodcon";
          this.treeDataTable_id = this.params.datatable_id;
          this.echotable(this.params.datatable_id);
          this.getTempJobData(this.params.datatable_id);
        }
      }
    },
    // 获取集市信息  树结构信息
    getTreeDataInfo() {
      this.$executeRequest
          .execGetByModulName("/market/dmInfo/findDmInfos")
          .then((res) => {
            this.marketinfotree = res.data;
            let marke = [];
            res.data.forEach((item) => {
              marke.push({
                label: item.mart_name,
                id: item.data_mart_id,
              });
            });
            this.selectmarke = marke;
          });
    },
    // 生成作业按钮
    generateMarketJobBtn(row) {
      // 打开生成作业dialog时清空dialog
      this.etlForm = { etl_date: "#{txdate}" };
      this.dialogEtlJobs = true;
      // console.log("row" + JSON.stringify(row))
      this.datatable_id = row.module_table_id;
      this.queryAllEtlSys();
    },
    //立即启动
    restartNow(row) {
      var data = {
        module_table_id: row.module_table_id,
      };
      this.$executeRequest
          .execGetByModulName("/market/startTask", data)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("启动成功", "success");
            } else {
              this.$Msg.customizTitle("启动失败", "fail");
            }
          });
    },
    // 查询所有系统
    queryAllEtlSys() {
      this.$executeRequest
          .execGetByModulName("/market/getEtlSysData", null)
          .then((res) => {
            if (res && res.success) {
              this.etlSysData = res.data;
            }
          });
    },
    // 根据系统编号获取子系统信息
    getEtlSubSysData(etl_sys_id) {
      this.$set(this.etlForm, "sub_sys_cd", "");
      // console.log("etl_sys_id" + etl_sys_id);
      this.$executeRequest
          .execGetByModulName("/market/getEtlSubSysData", {
            etl_sys_id: etl_sys_id,
          })
          .then((res) => {
            if (res && res.success) {
              this.subSysData = res.data;
            }
          });
    },
    // 生成加工作业
    generateMarketJob(separatorData) {
      /*this.$refs[separatorData].validate((valid) => {
        if (valid) {

        }
      })*/
      if (this.isBatchJob) {
        let arr = [];
        this.datatable_ids.forEach((item) => {
          arr.push(item.module_table_id);
        });
        let param = {
          module_table_ids: arr,
          etl_sys_id: this.etlForm.etl_sys_id,
          sub_sys_id: this.etlForm.sub_sys_id,
          etl_date: this.etlForm.etl_date,
          disp_time: this.etlForm.disp_time,
        };
        // 批量生成作业
        this.$executeRequest
            .execPostByModulName("/market/manyMarketJobs", param)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("批量生成加工作业成功", "success");
                this.dialogEtlJobs = false;
                this.isBatchJob = false;
              }
            });
      } else {
        // 单作业生成
        this.etlForm["module_table_id"] = this.datatable_id;
        // console.log("this.etlForm" + JSON.stringify(this.etlForm));
        this.$executeRequest
            .execPostByModulName("/market/generateSingleMarketJob", this.etlForm)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("生成加工作业成功", "success");
                this.dialogEtlJobs = false;
              }
            });
      }
    },
    //下载Excel模板
    downloadExcel() {
      this.$executeRequest.downloadModulMenuFile("/downloadMarketExcel").then(res => {
        let filename = "dmModuleImportExcel.xlsx";
        this.$FileOperations.fileDownload(res,filename)
      })
    },
    excelExportBtn() {
      this.fileList = [];
      this.excelForm = [];
      this.dialogExcelJobs = true;
      this.$executeRequest
          .execGetByModulName("/market/dmInfo/findDmInfos")
          .then((res) => {
            //this.marketinfotree = res.data;
            let marke = [];
            res.data.forEach((item) => {
              marke.push({
                label: item.mart_name,
                id: item.data_mart_id,
              });
            });
            this.marketinfotree = marke;
          });
    },
    // excel数据导入
    uploadExcelFile() {
      if (this.excelForm.data_mart_id == null) {
        this.$Msg.customizTitle("请选择集市", "warning");
        return;
      }
      if (this.excelForm.category_id == null) {
        this.$Msg.customizTitle("请选择集市分类", "warning");
        return;
      }
      let param = new FormData(); // 创建form对象
      param.append("file", this.fileList[0].raw);
      param.append("data_mart_id", this.excelForm.data_mart_id);
      param.append("category_id", this.excelForm.category_id);
      this.$executeRequest
          .execPostByModulName("/market/uploadExcelFile", param)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("数据导入成功", "success");
              this.dialogExcelJobs = false;
              if (
                  this.excelForm.data_mart_id !== undefined &&
                  this.excelForm.category_id !== undefined
              ) {
                this.getDmDataTableByDmCategory(
                    this.excelForm.data_mart_id,
                    this.excelForm.category_id
                );
              }
            }
          });
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");
    },
    //取消数据导入
    cancelImportData() {
      this.fileList = [];
      this.$Msg.customizTitle("已取消导入数据", "info");
    },
    //选中的数据
    handleSelectionChange(val) {
      this.datatable_ids = val;
    },
    // 给表头加必填符号*
    addRedStar(h, {column}) {
      return [
        h("span", {style: "color: red"}, "*"),
        h("span", " " + column.label),
      ];
    },
  },
  // destroyed() {
  //   // 清空数据
  //   if (this.$route.path !== "/processingManagement" && this.$route.path !== "/addJob" && this.$route.path !== "/tempTable") {
  //     sessionStorage.clear();
  //   }
  // },
};
</script>

<style lang="less" scoped>
/* button样式设置 */
.els {
  float: right;
  margin: 3px 0 5px 0;
}

.rightbtn {
  margin-top: 12px;
  float: right;
  margin: 10px;
  margin-bottom: 10px;
}

.card_style {
  /* // overflow: scroll;	// 横竖轴同时添加 */
  /* overflow-y: auto;		 */
  overflow-x: auto;
}

// .mytree {
//   display: flex;
//   white-space: nowrap;
//   margin-top: 15px;
// }

// .el-tree-node__children {
//   margin-left: 20px;
//   margin-top: 5px;
// }
</style>
