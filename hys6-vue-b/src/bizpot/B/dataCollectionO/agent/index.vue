<template>
  <div>
    <Step :active="active" v-show="activeNames=='first'"></Step>
    <StepColl :active="active" v-show="activeNames=='third'"></StepColl>
    <StepColl1 :active="active" v-show="activeNames=='fourth'"></StepColl1>
    <div v-if="isshow=='all'">
      <el-tabs v-model="activeNames" type="border-card" key='1' @tab-click="tabClick">
        <el-tab-pane label="数据库抽数" name="first">
          <div id="dataAcquisition">
            <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="30%"
                     class="demo-ruleForm ruleFormSe">
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据采集任务名" prop="task_name"
                                :rules="filter_rules([{required: true}])">
                    <el-col :span="16">
                      <el-input v-model="ruleForm.task_name" size="medium"
                                placeholder="数据采集任务名"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="作业编号" prop="database_number">
                    <el-col :span="16">
                      <el-input v-model="ruleForm.database_number" size="medium" v-if="show==true"
                                disabled placeholder="作业编号"></el-input>
                      <el-input v-model="ruleForm.database_number" size="medium" v-else
                                placeholder="作业编号"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-left: 4px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="分类编号" prop="classify_num"
                                :rules="filter_rules([{required: true,dataType:'compositions'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleForm.classify_num" size="medium" disabled
                                placeholder="分类编号">
                        <el-button slot="append" icon="el-icon-zoom-in"
                                   @click="collTaskClassFun('1');outerVisible = true">设置分类
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                    <el-col :span="16">
                      <el-input v-model="ruleForm.classify_name" size="medium" disabled
                                placeholder="分类名称"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据源" prop="sourceName">
                    <el-col :span="16">
                      <el-input v-model="sourceName" size="medium" disabled></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10" prop="fetch_size">
                  <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleForm.fetch_size" size="medium"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-top:12px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">存储层</span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}">
              <el-table-column width="55" align="center" prop="selectionState">
                <template slot-scope="scope">
                  <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                               @change="handleCheckboxChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope">
                  <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column property="dsl_name" label="存储名称" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column property="store_type" label="存储类型" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="详情" width="160px" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="24" class="delbtn">
                      <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                        查看详情
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="Alldestination_handleSizeChange"
                           @current-change="Alldestination_handleCurrentChange"
                           :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                           layout="total, prev, pager, next" :total="AlldestinationData.length"
                           class="locationcenter"></el-pagination>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="数据库采集" name="third">
          <div>
            <el-row style="margin-left:3%;">
              <el-form :model="ruleFormThird" status-icon ref="ruleFormThird" label-width="30%"
                       class="demo-ruleForm ruleFormSe">
                <el-row type="flex" justify="start">
                  <el-col :span="10">
                    <el-form-item label="数据采集任务名" prop="task_name"
                                  :rules="filter_rules([{required: true}])">
                      <el-col :span="16">
                        <el-input v-model="ruleFormThird.task_name" size="medium"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="作业编号" prop="database_number">
                      <el-col :span="16">
                        <el-input v-model="ruleFormThird.database_number" size="medium"
                                  v-if="show==true" disabled placeholder="作业编号"></el-input>
                        <el-input v-model="ruleFormThird.database_number" size="medium" v-else
                                  placeholder="作业编号"></el-input>
                      </el-col>
                      <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用"
                                  placement="right">
                        <i class="el-icon-question" aria-hidden="true"
                           style="margin-left: 4px;"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="start">
                  <el-col :span="10">
                    <el-form-item label="分类编号" prop="classify_num"
                                  :rules="filter_rules([{required: true,dataType:'compositions'}])">
                      <el-col :span="16">
                        <el-input v-model="ruleFormThird.classify_num" size="medium" disabled
                                  placeholder="分类编号">
                          <el-button slot="append" icon="el-icon-zoom-in"
                                     @click="collTaskClassFun('3');outerVisible = true">设置分类
                          </el-button>
                        </el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                      <el-col :span="16">
                        <el-input v-model="ruleFormThird.classify_name" size="medium" disabled
                                  placeholder="分类名称"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="start">
                  <el-col :span="10">
                    <el-form-item label="数据源" prop="sourceName">
                      <el-col :span="16">
                        <el-input v-model="sourceName" size="medium" disabled></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" prop="fetch_size">
                    <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                  :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                      <el-col :span="16">
                        <el-input v-model="ruleFormThird.fetch_size" size="medium"></el-input>
                      </el-col>
                      <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                  placement="right">
                        <i class="el-icon-question" aria-hidden="true"
                           style="margin-top:12px;"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">存储层</span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}">
              <el-table-column width="55" align="center" prop="selectionState">
                <template slot-scope="scope">
                  <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                               @change="handleCheckboxChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope">
                  <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column property="dsl_name" label="存储名称" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column property="store_type" label="存储类型" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="详情" width="160px" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="24" class="delbtn">
                      <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                        查看详情
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="Alldestination_handleSizeChange"
                           @current-change="Alldestination_handleCurrentChange"
                           :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                           layout="total, prev, pager, next" :total="AlldestinationData.length"
                           class="locationcenter"></el-pagination>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="实时采集" name="fourth">
          <div>
            <el-form :model="ruleFormFourTh" status-icon ref="ruleFormFourTh" label-width="30%"
                     class="demo-ruleForm ruleFormSe">
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据采集任务名" prop="task_name"
                                :rules="filter_rules([{required: true}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.task_name" size="medium"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="作业编号" prop="database_number">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.database_number" size="medium"
                                v-if="show==true" disabled placeholder="作业编号"></el-input>
                      <el-input v-model="ruleFormFourTh.database_number" size="medium" v-else
                                placeholder="作业编号"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-left: 4px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="分类编号" prop="classify_num"
                                :rules="filter_rules([{required: true,dataType:'compositions'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.classify_num" size="medium" disabled
                                placeholder="分类编号">
                        <el-button slot="append" icon="el-icon-zoom-in"
                                   @click="collTaskClassFun('4');outerVisible = true">设置分类
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.classify_name" size="medium" disabled
                                placeholder="分类名称"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据源" prop="sourceName">
                    <el-col :span="16">
                      <el-input v-model="sourceName" size="medium" disabled></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10" prop="fetch_size">
                  <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.fetch_size" size="medium"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-top:12px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">存储层</span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}">
              <el-table-column width="55" align="center" prop="selectionState">
                <template slot-scope="scope">
                  <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                               @change="handleCheckboxChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="center" width="70">
                <template slot-scope="scope">
                  <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column property="dsl_name" label="存储名称" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column property="store_type" label="存储类型" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="详情" width="160px" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="24" class="delbtn">
                      <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                        查看详情
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="Alldestination_handleSizeChange"
                           @current-change="Alldestination_handleCurrentChange"
                           :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                           layout="total, prev, pager, next" :total="AlldestinationData.length"
                           class="locationcenter"></el-pagination>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isshow=='first'">
      <el-tabs v-model="activeNames" type="border-card" key='2'>
        <el-tab-pane id='first' label="数据库抽数" name="first">
          <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="30%"
                   class="demo-ruleForm ruleFormSe">
            <el-row type="flex" justify="start">
              <el-col :span="10">
                <el-form-item label="数据采集任务名" prop="task_name"
                              :rules="filter_rules([{required: true}])">
                  <el-col :span="16">
                    <el-input v-model="ruleForm.task_name" size="medium"
                              placeholder="数据采集任务名"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="作业编号" prop="database_number">
                  <el-col :span="16">
                    <el-input v-model="ruleForm.database_number" size="medium" v-if="show==true"
                              disabled placeholder="作业编号"></el-input>
                    <el-input v-model="ruleForm.database_number" size="medium" v-else
                              placeholder="作业编号"></el-input>
                  </el-col>
                  <el-tooltip class="item" effect="dark" content="手动执行脚本时,此参数可作为第一个参数"
                              placement="right">
                    <i class="el-icon-question" aria-hidden="true"
                       style="margin-left: 4px;"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <el-col :span="10">
                <el-form-item label="分类编号" prop="classify_num"
                              :rules="filter_rules([{required: true,dataType:'compositions'}])">
                  <el-col :span="16">
                    <el-input v-model="ruleForm.classify_num" size="medium" disabled
                              placeholder="分类编号">
                      <el-button slot="append" icon="el-icon-zoom-in"
                                 @click="collTaskClassFun('1');outerVisible = true">设置分类
                      </el-button>
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                  <el-col :span="16">
                    <el-input v-model="ruleForm.classify_name" size="medium" disabled
                              placeholder="分类名称"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <el-col :span="10">
                <el-form-item label="数据源" prop="sourceName">
                  <el-col :span="16">
                    <el-input v-model="sourceName" size="medium" disabled></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="10" prop="fetch_size">
                <el-form-item label="FETCH_SIZE" prop="fetch_size"
                              :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                  <el-col :span="16">
                    <el-input v-model="ruleForm.fetch_size" size="medium"></el-input>
                  </el-col>
                  <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                              placement="right">
                    <i class="el-icon-question" aria-hidden="true"
                       style="margin-top:12px;"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">存储层</span>
          </div>
          <el-table stripe
                    :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                    border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                    :row-key="(row)=>{ return row.dsl_id}">
            <el-table-column width="55" align="center" prop="selectionState">
              <template slot-scope="scope">
                <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                             @change="handleCheckboxChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="序号" align="center" width="70">
              <template slot-scope="scope">
                <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column property="dsl_name" label="存储名称" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="store_type" label="存储类型" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="详情" width="160px" align="center">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="24" class="delbtn">
                    <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                      查看详情
                    </el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="Alldestination_handleSizeChange"
                         @current-change="Alldestination_handleCurrentChange"
                         :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                         layout="total, prev, pager, next" :total="AlldestinationData.length"
                         class="locationcenter"></el-pagination>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isshow=='third'">
      <el-tabs v-model="activeNames" type="border-card" key='3'>
        <el-tab-pane label="数据库采集" name="third">
          <div>
            <el-form :model="ruleFormThird" status-icon ref="ruleFormThird" label-width="30%"
                     class="demo-ruleForm ruleFormSe">
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据采集任务名" prop="task_name"
                                :rules="filter_rules([{required: true}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormThird.task_name" size="medium"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="作业编号" prop="database_number">
                    <el-col :span="16">
                      <el-input v-model="ruleFormThird.database_number" size="medium"
                                v-if="show==true" disabled placeholder="作业编号"></el-input>
                      <el-input v-model="ruleFormThird.database_number" size="medium" v-else
                                placeholder="作业编号"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-left: 4px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="分类编号" prop="classify_num"
                                :rules="filter_rules([{required: true,dataType:'compositions'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormThird.classify_num" size="medium" disabled
                                placeholder="分类编号">
                        <el-button slot="append" icon="el-icon-zoom-in"
                                   @click="collTaskClassFun('3');outerVisible = true">设置分类
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                    <el-col :span="16">
                      <el-input v-model="ruleFormThird.classify_name" size="medium" disabled
                                placeholder="分类名称"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据源" prop="sourceName">
                    <el-col :span="16">
                      <el-input v-model="sourceName" size="medium" disabled></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10" prop="fetch_size">
                  <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormThird.fetch_size" size="medium"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-top:12px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">存储层</span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}">
              <el-table-column width="55" align="center" prop="selectionState">
                <template slot-scope="scope">
                  <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                               @change="handleCheckboxChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column property="dsl_name" label="存储名称" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column property="store_type" label="存储类型" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="详情" width="160px" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="24" class="delbtn">
                      <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                        查看详情
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="Alldestination_handleSizeChange"
                           @current-change="Alldestination_handleCurrentChange"
                           :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                           layout="total, prev, pager, next" :total="AlldestinationData.length"
                           class="locationcenter"></el-pagination>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isshow=='fourth'">
      <el-tabs v-model="activeNames" type="border-card" key='4'>
        <el-tab-pane label="实时采集" name="fourth">
          <div>
            <el-form :model="ruleFormFourTh" status-icon ref="ruleFormFourTh" label-width="30%"
                     class="demo-ruleForm ruleFormSe">
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据采集任务名" prop="task_name"
                                :rules="filter_rules([{required: true}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.task_name" size="medium"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="作业编号" prop="database_number">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.database_number" size="medium"
                                v-if="show==true" disabled placeholder="作业编号"></el-input>
                      <el-input v-model="ruleFormFourTh.database_number" size="medium" v-else
                                placeholder="作业编号"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-left: 4px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="分类编号" prop="classify_num"
                                :rules="filter_rules([{required: true,dataType:'compositions'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.classify_num" size="medium" disabled
                                placeholder="分类编号">
                        <el-button slot="append" icon="el-icon-zoom-in"
                                   @click="collTaskClassFun('4');outerVisible = true">设置分类
                        </el-button>
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.classify_name" size="medium" disabled
                                placeholder="分类名称"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start">
                <el-col :span="10">
                  <el-form-item label="数据源" prop="sourceName">
                    <el-col :span="16">
                      <el-input v-model="sourceName" size="medium" disabled></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="10" prop="fetch_size">
                  <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                    <el-col :span="16">
                      <el-input v-model="ruleFormFourTh.fetch_size" size="medium"></el-input>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                placement="right">
                      <i class="el-icon-question" aria-hidden="true"
                         style="margin-top:12px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">存储层</span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}">
              <el-table-column width="55" align="center" prop="selectionState">
                <template slot-scope="scope">
                  <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                               @change="handleCheckboxChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="序号" align="center" width="100px">
                <template slot-scope="scope">
                  <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column property="dsl_name" label="存储名称" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column property="store_type" label="存储类型" align="center"
                               :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="详情" width="160px" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="24" class="delbtn">
                      <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                        查看详情
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @size-change="Alldestination_handleSizeChange"
                           @current-change="Alldestination_handleCurrentChange"
                           :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                           layout="total, prev, pager, next" :total="AlldestinationData.length"
                           class="locationcenter"></el-pagination>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" style="text-align:right;">
              <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                         size="mini">测试连接
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" size="medium" class="leftbtn" @click="backFun()">返回</el-button>
      </el-col>
      <el-col :span="12">
        <el-button v-if="activeNames=='first'" type="primary" size="medium" class='rightbtn'
                   @click="next('ruleForm')">下一步
        </el-button>
        <el-button v-else-if="activeNames=='third'" type="primary" size="medium" class='rightbtn'
                   @click="next('ruleFormThird')">下一步
        </el-button>
        <el-button v-else-if="activeNames=='fourth'" type="primary" size="medium" class='rightbtn'
                   @click="next('ruleFormFourTh')">下一步
        </el-button>
        <el-button v-else type="primary" size="medium" class='rightbtn' @click="next('ruleFormSecond')">下一步
        </el-button>
        <el-button type="primary" size="medium" class='rightbtn' disabled>上一步</el-button>
      </el-col>
    </el-row>
    <!-- 分类编号弹层-->
    <el-dialog title="采集任务分类" :visible.sync="outerVisible" class="collTask" width="60%">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">采集任务分类</span>
      </div>
      <el-dialog width="40%" title="新增采集任务分类" :visible.sync="innerVisible" append-to-body>
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">新增采集任务分类</span>
        </div>
        <el-form :model="addClassTask" ref="addClassTask">
          <el-form-item label=" 分类编号" prop="class_num"
                        :rules="filter_rules([{required: true,dataType:'compositions'}])"
                        :label-width="formLabelWidth">
            <el-input v-model="addClassTask.class_num" style="width:284px"></el-input>
          </el-form-item>
          <el-form-item label=" 分类名称" prop="class_name" :rules="rule.default" :label-width="formLabelWidth">
            <el-input v-model="addClassTask.class_name" style="width:284px"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="class_des" :label-width="formLabelWidth">
            <el-input v-model="addClassTask.class_des" type="textarea" style="width:284px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" type="danger" @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="innerVisible = false;addClassTaskFun(addClassTask)">
            保存
          </el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-table stripe :data="CollTaskData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
                  size="medium" highlight-current-row @current-change="handleSelectionChange"
                  @row-click="chooseone" style="width: 100%;">
          <el-table-column property label="选择" width="80px" type="index" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.row.classify_id" v-if="activeNames=='first'">
                &thinsp;
              </el-radio>
              <el-radio v-model="radio3" :label="scope.row.classify_id" v-if="activeNames=='third'">
                &thinsp;
              </el-radio>
              <el-radio v-model="radio4" :label="scope.row.classify_id" v-if="activeNames=='fourth'">
                &thinsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column property label="序号" width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + (currentPage - 1) * pagesize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column property="classify_num" label="分类编号" align="center" min-width="180px"></el-table-column>
          <el-table-column property="classify_name" label="分类名称" min-width="180px"
                           align="center"></el-table-column>
          <el-table-column property="remark" label="描述" min-width="150px" align="center"></el-table-column>
          <el-table-column label="操作" min-width="150px" align="center">
            <template slot-scope="scope">
                <el-button class='editcolor' type="text" size="small" @click="colltaskEditBtn(scope.row)">
                  编辑
                </el-button>
                <el-button class='delcolor' type="text" size="small" @click="colltaskDeleBtn(scope.row)"
                           @row-click="chooseone">删除
                </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                       :total="CollTaskData.length"></el-pagination>
        <div class="btntop">
          <el-button @click="cancelClassNumBtn()" type="danger" size="mini">取 消</el-button>
          <el-button @click="addClassNumBtn();innerVisible = true" type="success" size="mini">新增</el-button>

          <el-button @click="updataClassNumBtn(CollTaskData)" type="primary" size="mini">确定</el-button>

        </div>
      </div>
    </el-dialog>

    <!-- 点击编辑弹层 -->
    <el-dialog width="40%" title="修改采集任务分类" :visible.sync="ediltVisible" append-to-body>
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">修改采集任务分类</span>
      </div>
      <el-form :model="editClassTask" ref="addClassTask">
        <el-form-item label=" 分类编号" prop="class_num" :rules="rule.default" :label-width="formLabelWidth"
                      width="130">
          <el-input v-model="editClassTask.class_num" style="width:284px" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 分类名称" prop="class_name" :rules="rule.default" :label-width="formLabelWidth">
          <el-input v-model="editClassTask.class_name" style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="class_des" :label-width="formLabelWidth">
          <el-input v-model="editClassTask.class_des" type="textarea" style="width:284px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="danger" @click="ediltVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editClassTaskSane(editClassTask)">保存</el-button>
      </div>
    </el-dialog>

    <!-- 测试连接弹层 -->
    <el-dialog title="提示信息" :visible.sync="testLink" width="30%">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">提示信息</span>
      </div>
      <div class="testLinnk">
        <span>{{ linkTip }}</span>
      </div>
    </el-dialog>

    <!-- 查看日志弹层 -->
    <el-dialog title="Agent日志信息" :visible.sync="viewLog" width="80%">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">Agent日志信息</span>
      </div>
      <div class="logseach">
        <el-input placeholder="请输入查看条数" v-model="lognum" class="input-with-select" size="mini">
          <el-button slot="append" icon="el-icon-search" @click='getviewlog()'></el-button>
        </el-input>
      </div>
      <div class='logclass' style="min-height:200px">
        <pre>{{ logMsg }}</pre>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog title=" 查看详情" :visible.sync="dialogViewDetails" width="60%" class="alltable">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">查看详情</span>
      </div>
      <table v-if="viewDatilsData.length==0" class="mailTable" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="nocontent">暂无信息</td>
        </tr>
      </table>
      <table v-else class="mailTable" border="0" cellspacing="0" cellpadding="0">
        <tr v-for="(item,index) in viewDatilsData" :key="index">
          <td>{{ item.storage_property_key }}：</td>
          <td>
            <p>{{ item.storage_property_val }}</p>
          </td>
        </tr>
      </table>
    </el-dialog>

    <!--已存在的数据库信息弹窗 start-->
    <el-dialog title="请根据需求选择对应的采集任务类型" :visible.sync="collectType" width="30%" center
               :before-close="handleClose">
      <el-collapse v-model="collectTypeMsg">
        <el-collapse-item title="数据库抽数" name="1" @click.native="changeColletType('1')">
          <div>
            将源库选择的表或者自定义的sql,以文件(定长,非定长,CSV,SEQUENCEFILE,PARQUET,ORC)中的某种方式写入到落地目录
          </div>
        </el-collapse-item>
        <el-collapse-item title="数据库采集" name="3" @click.native="changeColletType('3')">
          <div>将源库中的表或者自定义的sql,以JDBC的方式直接将数据加载到定义中的目标库中</div>
        </el-collapse-item>
        <el-collapse-item title="实时采集" name="4" @click.native="changeColletType('4')">
          <div>将源库中的表,通过消息队列的形式实时传输加载到定义中的目标库中</div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!--已存在的数据库信息弹窗 end-->
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import * as message from "@/utils/message";
import Step from "./step.vue";
import StepColl from "./step_coll.vue";
import StepColl1 from "./step_coll1.vue";
import StepTy from "./step_ty.vue";
import Loading from '../../../../components/loading/index.vue'

export default {
  components: {
    Step,
    StepColl,
    StepColl1,
    StepTy,
    Loading
  },
  data() {
    return {
      selectedOption: null,
      Allis_destination: false,
      Alldestination_pagesize: 10,
      Alldestination_currentPage: 1,
      AlldestinationData: [],
      ex_destinationcurrentPage: 1,
      ex_destinationpagesize: 100,
      destination_currentPage: 1,
      destination_pagesize: 10,
      checked: false, // 用于跟踪单选框的选中状态
      active: 0,
      tableloadingInfo: "数据加载中...",
      dialogChooseStorageTier: false,
      dialogViewDetails: false,
      activeNames: "",
      radio: null,
      radio3: null,
      radio4: null,
      linkTip: "",
      isLoading: false,
      linkloading: false,
      CollTaskData: [],
      currentPage: 1,
      pagesize: 10,
      source_id: "",
      ruleForm: {
        dsl_id:"",
        task_name: "",
        database_number: "",
        classify_num: "",
        classify_name: "",
        fetch_size: 500
      },
      ruleFormThird: {
        dsl_id:"",
        task_name: "",
        database_number: "",
        classify_num: "",
        classify_name: "",
        fetch_size: 500
      },
      ruleFormFourTh: {
        dsl_id:"",
        task_name: "",
        database_number: "",
        classify_num: "",
        classify_name: "",
        fetch_size: 500,
      },
      sourceName: "",
      sourceId: null,
      agentId: null,
      rule: validator.default,
      outerVisible: false,
      innerVisible: false,
      ediltVisible: false,
      testLink: false,
      viewLog: false,
      input0: "",
      addClassTask: {
        class_num: "",
        class_name: "",
        class_des: ""
      },
      editClassTask: {
        class_id: "",
        class_num: "",
        class_name: "",
        class_des: ""
      },
      currentSelectItem: {},
      classifyName: "",
      classifyNum: "",
      DatabaseType: [],
      dbid: null,
      activelink: "",
      formLabelWidth: "150px",
      show: false,
      lognum: 100,
      logMsg: '',
      StorageTierData: [],
      storeTypeData: [],
      StorageTier_currentPage: 1,
      StorageTier_pagesize: 10,
      viewDatilsData: [],
      radioSave: null, //存储层弹框单选
      tyAddSave: false,
      dbcollect_AddSave: false,
      isshow: 'all',
      dialogChooseSatabase: false,
      databaseData: [],
      choiceDatabase: {},
      collectType: false,
      collectTypeMsg: ['1', '2', '3', '4'],
      collect_type: {},
      fetch_size: null,
    };
  },
  created() {
    this.sourceName = this.$Base64.decode(this.$route.query.source_name);
    this.sourceId = this.$route.query.source_id;
    this.agentId = this.$route.query.agent_id;
    this.dbid = this.$route.query.id;
    this.edit = this.$route.query.edit;
    this.getDatabaseInfo();
    this.storeTypeFun();
    this.$Code.getCodeItems({category: 'CollectType'}).then(res => {
      this.collect_type = res.data
    })
  },
  mounted() {
    if (this.edit == "yes") {
      this.isshow = 'first'
      this.show = true;
      let params = {};
      params["databaseId"] = this.dbid;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/getDBConfInfo", params).then(res => {
        if (res.data.length != 0) {
          this.isshow = 'first'
          this.activeNames = 'first'
          this.ruleForm = res.data[0];
          this.ruleForm.dsl_id = res.data[0].dsl_id;
          this.fetch_size = res.data[0].fetch_size;
          this.radio = res.data[0].classify_id;
          this.AllSettingDestinationFun(this.ruleForm.dsl_id);
        } else {
          this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/editorDatabase", params).then(rs => {
            if (rs.data) {
              let res = this.$Secret.DecryptJSON(rs.data)
              if (res.data.length != 0) {
                this.isshow = 'third'
                this.activeNames = 'third'
                this.ruleFormThird.task_name = res.data[0].task_name;
                this.ruleFormThird.database_number = res.data[0].database_number;
                this.ruleFormThird.classify_num = res.data[0].classify_num;
                this.ruleFormThird.classify_name = res.data[0].classify_name;
                this.ruleFormThird.dsl_id = res.data[0].dsl_id;
                this.ruleFormThird.fetch_size = res.data[0].fetch_size;
                this.fetch_size = res.data[0].fetch_size;
                this.dbid = res.data[0].database_id;
                this.radio3 = res.data[0].classify_id;
                this.AllSettingDestinationFun(this.ruleFormThird.dsl_id);
              } else {
                this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/editorDatabaseSSCJ", params).then(rs => {
                  if (rs.data) {
                    let res = this.$Secret.DecryptJSON(rs.data);
                    if (res.data.length != 0) {
                      this.isshow = 'fourth'
                      this.activeNames = 'fourth'
                      this.ruleFormFourTh.task_name = res.data[0].task_name;
                      this.ruleFormFourTh.database_number = res.data[0].database_number;
                      this.ruleFormFourTh.classify_num = res.data[0].classify_num;
                      this.ruleFormFourTh.classify_name = res.data[0].classify_name;
                      this.ruleFormFourTh.dsl_id = res.data[0].dsl_id;
                      this.ruleFormFourTh.fetch_size = res.data[0].fetch_size;
                      this.fetch_size = res.data[0].fetch_size;
                      this.dbid = res.data[0].database_id;
                      this.radio4 = res.data[0].classify_id
                      this.AllSettingDestinationFun(this.ruleFormFourTh.dsl_id);
                    }
                  }
                });
              }
            }
          })
        }
      });
    } else {
      this.isshow = 'first'
      let params = {};
      params["databaseId"] = this.sourceId;
      params["agent_id"] = this.$route.query.agent_id
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/addDBConfInfo", params).then(res => {
        if (res.data.length != 0) {
          this.showStep('first', false)
          this.ruleForm = res.data[0];
          this.fetch_size = res.data[0].fetch_size;
          this.radio = res.data[0].classify_id;
          this.ruleForm.dsl_id = res.data[0].dsl_id;
          this.dbid = res.data[0].database_id;
          this.AllSettingDestinationFun(this.ruleForm.dsl_id);
        } else {
          let params = {};
          params["source_id"] = this.sourceId;
          params["agent_id"] = this.agentId;
          this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/getInitDatabase", params).then(res => {
            if (res.data.length !== 0) {
              this.showStep('third', false);
              this.ruleFormThird.task_name = res.data[0].task_name;
              this.ruleFormThird.database_number = res.data[0].database_number;
              this.ruleFormThird.classify_num = res.data[0].classify_num;
              this.ruleFormThird.classify_name = res.data[0].classify_name;
              this.ruleFormThird.dsl_id = res.data[0].dsl_id;
              this.ruleFormThird.fetch_size = res.data[0].fetch_size;
              this.fetch_size = res.data[0].fetch_size;
              this.dbid = res.data[0].database_id;
              this.radio3 = res.data[0].classify_id;
              this.AllSettingDestinationFun(this.ruleFormThird.dsl_id);
            } else {
              let paramss = {};
              paramss["source_id"] = this.sourceId;
              paramss["agent_id"] = this.$route.query.agent_id
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/getInitDatabaseSSCJ", params).then(res => {
                if (res.data.length !== 0) {
                  this.showStep('fourth', false)
                  this.ruleFormFourTh.task_name = res.data[0].task_name;
                  this.ruleFormFourTh.database_number = res.data[0].database_number;
                  this.ruleFormFourTh.classify_num = res.data[0].classify_num;
                  this.ruleFormFourTh.classify_name = res.data[0].classify_name;
                  this.ruleFormFourTh.dsl_id = res.data[0].dsl_id;
                  this.ruleFormFourTh.fetch_size = res.data[0].fetch_size;
                  this.fetch_size = res.data[0].fetch_size;
                  this.dbid = res.data[0].database_id
                  this.radio4 = res.data[0].classify_id
                  this.AllSettingDestinationFun(this.ruleFormFourTh.dsl_id);
                } else {
                  this.showStep('all', true)
                }
              })
            }
          })
        }
      })
    }
  },
  methods: {
    ex_destination_handleSizeChange(size) {
      this.ex_destinationpagesize = size;
    },
    ex_destination_handleCurrentChange(current) {
      this.ex_destinationcurrentPage = current;
    },
    destination_handleSizeChange(size) {
      this.destination_pagesize = size;
    },
    destination_handleCurrentChange(current) {
      this.destination_currentPage = current;
    },
    Alldestination_handleSizeChange(size) {
      this.Alldestination_pagesize = size;
    },
    Alldestination_handleCurrentChange(current) {
      this.Alldestination_currentPage = current;
    },
    // 点击查看详情
    getStoDestDetailFun(row) {
      this.dialogViewDetails = true;
      let params = {};
      params["dslId"] = row.dsl_id;
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStoDestDetail", params).then(rs => {
        if (rs.success) {
          this.viewDatilsData = this.$Secret.DecryptJSON(rs.data).data
        }
      });
    },
    // store_type
    storeTypeFun() {
      let params = {};
      params["category"] = "Store_type";
      this.$Code.getCategoryItems(params).then(res => {
        if (res) {
          this.storeTypeData = res.data;
        }
      });
    },
    // 获取所有存储层信息
    AllSettingDestinationFun(val) {
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStorageDataBySource").then(res => {
        let arr = JSON.parse(JSON.stringify(res.data));
        let data = this.storeTypeData;
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].code == arr[i].store_type) {
              arr[i].store_type = data[j].value;
            }
          }
        }
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].usedflag == "1" || arr[i].dsl_id == val) {
            arr[i].usedflag = true;
          } else {
            arr[i].usedflag = false;
          }
          for (let j = 0; j < data.length; j++) {
            if (data[j].code == arr[i].store_type) {
              arr[i].store_type = data[j].value;
            }
          }
        }
        this.AlldestinationData = arr;
      })
    },
    // 选择目的地弹框选择某一个
    handleCheckboxChange(option) {
      if (option.usedflag) {
        this.selectedOption = option;
        if (this.activeNames == 'first') {
          this.ruleForm.dsl_id = option.dsl_id;
        } else if (this.activeNames == 'third') {
          this.ruleFormThird.dsl_id = option.dsl_id;
        } else {
          this.ruleFormFourTh.dsl_id = option.dsl_id;
        }
      } else {
        this.selectedOption = null;
        if (this.activeNames == 'first') {
          this.ruleForm.dsl_id = null;
        } else if (this.activeNames == 'third') {
          this.ruleFormThird.dsl_id = null
        } else {
          this.ruleFormFourTh.dsl_id = null
        }
      }
      // 将其他选项设置为未选中
      this.AlldestinationData.forEach((item) => {
        if (item.dsl_id != option.dsl_id) {
          item.usedflag = false;
        }
      });
    },
    getRowKeys(row) {
      return row.dsl_id;
    },
    // 获取数据库信息
    getDatabaseInfo() {
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/getDatabaseInfo", null).then(res => {
        if (res.success) {
          this.DatabaseType = res.data;
        }
      });
    }
    ,
    next(formName) {
      this.isLoading = true
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.testLinkFun("2"); //如果是1就是点击了测试按钮，是需要loding直接出现的
        } else {
          this.isLoading = false
        }
      });
    },
    nextLink(data) {
      if (data == "true") {
        let params = {};
        if (this.activeNames == 'first') {
          params["task_name"] = this.ruleForm.task_name;
          params["database_number"] = this.ruleForm.database_number;
          params["classify_id"] = this.radio;
          params["collect_type"] = this.collect_type.ShuJuKuChouShu
          params["source_id"] = this.sourceId
          params["dsl_id"] = this.ruleForm.dsl_id;
        }  else if (this.activeNames == 'third') {
          params["task_name"] = this.ruleFormThird.task_name;
          params["database_number"] = this.ruleFormThird.database_number;
          params["classify_id"] = this.radio3;
          params["collect_type"] = this.collect_type.ShuJuKuCaiJi
          params["fetch_size"] = this.ruleFormThird.fetch_size
          params["dsl_id"] = this.ruleFormThird.dsl_id;
        } else {
          params["task_name"] = this.ruleFormFourTh.task_name;
          params["database_number"] = this.ruleFormFourTh.database_number;
          params["classify_id"] = this.radio4;
          params["collect_type"] = this.collect_type.ShiShiCaiJi
          params["fetch_size"] = this.ruleFormFourTh.fetch_size
          params["dsl_id"] = this.ruleFormFourTh.dsl_id;
        }

        params["source_id"] = this.sourceId
        params["database_id"] = this.dbid;
        params["agent_id"] = this.agentId;

        if (this.activeNames == 'first') {
          // 数据库抽数
          this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/dbconf/saveDbConf", params).then(res => {
            this.isLoading = false
            if (res.success) {
              let data = {};
              if (this.edit == "yes") {
                data = {
                  agent_id: this.agentId,
                  id: this.dbid,
                  source_id: this.sourceId,
                  source_name: this.$Base64.encode(this.sourceName),
                  edit: "yes"
                };
              } else {
                data = {
                  id: res.data,
                  source_id: this.sourceId,
                  agent_id: this.agentId,
                  source_name: this.$Base64.encode(this.sourceName)
                };
              }
              this.$router.push({
                name: "isolate",
                query: data
              });
            }
          });
        } else if (this.activeNames == 'third') {
          // 数据库采集
          if (this.edit == "yes") {
            // 编辑保存 updateDatabaseInfo
            this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/updateDatabaseInfo", params).then(res => {
              this.isLoading = false
              if (res.success) {
                let data = {};
                data = {
                  agent_id: this.agentId,
                  id: this.dbid,
                  source_id: this.sourceId,
                  source_name: this.$Base64.encode(this.sourceName),
                  edit: "yes",
                };
                this.$router.push({
                  name: "collect",
                  query: data
                });
              }
            });
          } else {
            if (this.dbid && typeof this.dbid != 'undefined') {
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/updateDatabaseInfo", params).then(res => {
                //addTaskAllFun.updateDatabaseInfo(params).then(res => {
                this.isLoading = false
                if (res.success) {
                  let data = {};
                  data = {
                    agent_id: this.agentId,
                    id: this.dbid,
                    source_id: this.sourceId,
                    source_name: this.$Base64.encode(this.sourceName),
                    dsl_id: this.radioSave,
                  };
                  this.$router.push({
                    name: "collect",
                    query: data
                  });
                }
              });
            } else {
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/saveDatabaseInfo", params).then(res => {
                this.isLoading = false
                if (res.success) {
                  let data = {};
                  data = {
                    id: res.data,
                    source_id: this.sourceId,
                    agent_id: this.agentId,
                    dsl_id: this.radioSave,
                    source_name: this.$Base64.encode(this.sourceName)
                  };
                  this.$router.push({
                    name: "collect",
                    query: data
                  });
                }
              });
            }
          }
        } else if (this.activeNames == 'fourth') {
          // 实时采集
          // 判断是否运行过，若运行过，不进行更新，跳转到 scj/show页，否则继续继续

          this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/cdcCollect/hasBeenRun", {taskId:this.dbid}).then(res => {
              if (res && res.success) {
                if(res.data){
                  let data = {};
                  data = {
                    agent_id: this.agentId,
                    id: this.dbid,
                    source_id: this.sourceId,
                    source_name: this.$Base64.encode(this.sourceName),
                    dsl_id: this.radioSave,
                    edit: "yes",
                  };
                  this.$router.push({
                    path: "/B/dataCollectionO/agent/sscj/show",
                    query: data
                  });
                  this.$Msg.customizTitle('此任务已运行，无法继续修改', "warning");
                }else{
                  if (this.edit == "yes") {
                    // 编辑保存 updateDatabaseInfo
                    this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/updateDatabaseInfo", params).then(res => {
                      this.isLoading = false
                      if (res.success) {
                        let data = {};
                        data = {
                          agent_id: this.agentId,
                          id: this.dbid,
                          source_id: this.sourceId,
                          source_name: this.$Base64.encode(this.sourceName),
                          dsl_id: this.radioSave,
                          edit: "yes",
                        };
                        this.$router.push({
                          name: "sscj",
                          query: data
                        });
                      }
                    });
                  } else {
                    if (this.dbid && typeof this.dbid != 'undefined') {
                      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/updateDatabaseInfo", params).then(res => {
                        this.isLoading = false
                        if (res.success) {
                          let data = {};
                          data = {
                            agent_id: this.agentId,
                            id: this.dbid,
                            source_id: this.sourceId,
                            source_name: this.$Base64.encode(this.sourceName),
                            dsl_id: this.radioSave,
                          };
                          this.$router.push({
                            name: "sscj",
                            query: data
                          });
                        }
                      });
                    } else {
                      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/database/saveDatabaseInfo", params).then(res => {
                        this.isLoading = false
                        if (res.success) {
                          let data = {};
                          data = {
                            id: res.data,
                            source_id: this.sourceId,
                            agent_id: this.agentId,
                            dsl_id: this.radioSave,
                            source_name: this.$Base64.encode(this.sourceName)
                          };
                          this.$router.push({
                            name: "sscj",
                            query: data
                          });
                        }
                      });
                    }
                  }

                }
              }
            });
        }
      }
    },
    backFun() {
      this.$router.push({
        name: "dataCollectionO"
      });
    },
    getviewlog() {
      let params = {};
      params["agentId"] = this.agentId;
      params["readNum"] = this.lognum;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/viewTaskLog", params).then(res => {
        if (res.success) {
          this.logMsg = res.data.trim();
        }
      });
    },
    viewLogFun() {
      this.viewLog = true
      this.getviewlog()
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    // 采集任务分类单选选择时
    handleSelectionChange(row) {
      if (row) {
        this.currentSelectItem = row;
        this.classifyName = row.classify_name;
        this.classifyNum = row.classify_num;
      }
    },
    chooseone(row) {
      if (this.activeNames == 'first') {
        this.radio = row.classify_id;
      } else if (this.activeNames == 'third') {
        this.radio3 = row.classify_id;
      } else {
        this.radio4 = row.classify_id;
      }
    },
    // 采集任务分类确定提交时
    updataClassNumBtn(row) {
      if (row.length > 0) {
      if (this.activeNames == 'third') {
          if (this.radio3 != '') {
            for (let i = 0; i < row.length; i++) {
              if (row[i].classify_id == this.radio3) {
                this.outerVisible = false;
                this.ruleFormThird.classify_name = row[i].classify_name;
                this.ruleFormThird.classify_num = row[i].classify_num;
              }
            }
          } else {
            this.$Msg.customizTitle('请至少选择一项', 'error')
          }
        } else if (this.activeNames == 'fourth') {
          if (this.radio4 != '') {
            for (let i = 0; i < row.length; i++) {
              if (row[i].classify_id == this.radio4) {
                this.outerVisible = false;
                this.ruleFormFourTh.classify_name = row[i].classify_name;
                this.ruleFormFourTh.classify_num = row[i].classify_num;
              }
            }
          } else {
            this.$Msg.customizTitle('请至少选择一项', 'error')
          }
        } else {
          if (this.radio != '') {
            for (let i = 0; i < row.length; i++) {
              if (row[i].classify_id == this.radio) {
                this.outerVisible = false;
                this.ruleForm.classify_name = row[i].classify_name;
                this.ruleForm.classify_num = row[i].classify_num;
              }
            }
          } else {
            this.$Msg.customizTitle('请至少选择一项', 'error')
          }
        }
      } else {
        this.$Msg.customizTitle('请新增任务并选择', 'error')
      }
    },
    // 采集任务取消时
    cancelClassNumBtn() {
      this.outerVisible = false;
      this.radio = "";
      this.currentSelectItem = {};
      this.classifyName = "";
      this.classifyNum = "";
    },
    // 点击分类编号时调
    collTaskClassFun(num) {
       if (num == '3') {
        this.ruleFormThird.classify_name = "";
        this.ruleFormThird.classify_num = "";
        this.radio3 = ''
      } else if (num == '4') {
        this.ruleFormFourTh.classify_name = "";
        this.ruleFormFourTh.classify_num = "";
        this.radio4 = ''
      } else {
        this.ruleForm.classify_name = "";
        this.ruleForm.classify_num = "";
        this.radio = ''
      }
      let params = {};
      params["sourceId"] = this.sourceId;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/getClassifyInfo", params).then(res => {
        if (res.data) {
          if (res.data.length === 0) {
            this.tableloadingInfo = "暂无数据";
          } else {
            this.CollTaskData = res.data
          }
        }
      });
    },
    // 点击编辑按钮回显之前数据
    colltaskEditBtn(row) {
      this.ediltVisible = true;
      this.editClassTask.class_id = row.classify_id;
      this.editClassTask.class_name = row.classify_name;
      this.editClassTask.class_num = row.classify_num;
      this.editClassTask.class_des = row.remark;
    },
    // 点击编辑后-提交
    editClassTaskSane(data) {
      this.ediltVisible = false;
      let params = {};
      params["classify_id"] = data.class_id;
      params["classify_num"] = data.class_num;
      params["classify_name"] = data.class_name;
      params["remark"] = data.class_des;
      params["agent_id"] = this.agentId;
      params["sourceId"] = this.sourceId;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/updateClassifyInfo", params).then(res => {
        message.updateSuccess(res);
        this.collTaskClassFun();
      });
    },
    // 点击任务采集-删除
    colltaskDeleBtn(row) {
      let that = this
      message.confirmMsg('确定删除吗').then(res => {
        let params = {};
        params["classifyId"] = row.classify_id;
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/deleteClassifyInfo", params).then(res => {
          message.deleteSuccess(res);
          that.collTaskClassFun();
        });
      }).catch(() => {
      })
    },
    // 点击新增
    addClassNumBtn() {
      this.addClassTask.class_num = "",
          this.addClassTask.class_name = "",
          this.addClassTask.class_des = "";
    },
    // 点击新增后的弹框保存
    addClassTaskFun(data) {
      let params = {};
      params["classify_num"] = data.class_num;
      params["classify_name"] = data.class_name;
      params["remark"] = data.class_des;
      params["agent_id"] = this.agentId;
      params["sourceId"] = this.sourceId;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/saveClassifyInfo", params).then(res => {
        message.saveSuccess(res);
        this.collTaskClassFun();
        this.g
      });
    },
    // 点击测试连接
    testLinkFun(n) {
      if (n === '1') { //等于1是点击了测试链接按钮需要loding出现
        this.linkloading = true
      }
      let params = {};
      if (this.activeNames == 'first') {
        params["dsl_id"] = this.ruleForm.dsl_id;
      } else if (this.activeNames == 'third') {
        params["dsl_id"] = this.ruleFormThird.dsl_id;
      } else {
        params["dsl_id"] = this.ruleFormFourTh.dsl_id;
      }
      params["agent_id"] = this.agentId;
      params["fetch_size"] = this.ruleForm.fetch_size;
      if (!params.dsl_id) {
        this.$Msg.customizTitle('请先选中数据库链接信息之后再测试连接', 'warning')
        this.linkloading = false;
        return;
      }
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/dbconf/testConnection", params).then(res => {
        if (res && res.success) {
          this.activelink = "true";
          if (n === '1') {
            this.linkloading = false
            this.$Msg.customizTitle('连接成功', "success");
          } else if (n === "2") {
            this.nextLink(this.activelink);
          }
        } else {
          this.linkloading = false
          this.activelink = "false";
          this.isLoading = false
        }
      });
    },
    StorageTier_handleSizeChange(size) {
      this.StorageTier_pagesize = size
    },
    StorageTier_handleCurrentChange(currentpage) {
      this.StorageTier_currentPage = currentpage
    },
    // 根据数据库采集类型跳转到不同的路经
    changeColletType(name) {
      if (name == '1') { // 数据库抽数
        this.activeNames = 'first'
        this.AllSettingDestinationFun();
      } else if (name == '3') { // 数据库采集
        this.activeNames = 'third'
        this.AllSettingDestinationFun();
      } else {//实时采集
        this.activeNames = 'fourth'
        this.AllSettingDestinationFun();
      }
      this.collectType = false;
    },
    handleClose() {
      this.collectType = false;
      this.activeNames = 'third';
    },
    showStep(data, isShow) {
      if (this.edit) {
        this.isshow = data
        this.activeNames = data
      } else {
        this.isshow = 'all'
        this.activeNames = data
        this.collectType = isShow
      }
    },
    // 点击tab标签清楚存储层选中状态
    tabClick(){
      this.AlldestinationData.forEach((item) => item.usedflag = false)
    },
  }
};
</script>

<style scoped>
.leftbtn {
  margin-top: 12px;
  margin-top: 12px;
  float: left;
  margin: 15px;
  margin-bottom: 10px;
}

.rightbtn {
  margin-top: 12px;
  margin-top: 12px;
  float: right;
  margin: 15px;
  margin-bottom: 10px;
}

.ruleFormSe {
  margin-top: 15px;
  border-top: 1px dotted #ccc;
  padding-top: 10px;
}

#jdbcUrl > lable {
  width: 20% !important;
}

.testLinnk {
  text-align: center;
}

.testLinnk > span {
  font-size: 14px;
  color: #e84d45
}

.logseach {
  width: 25%;
  position: absolute;

  top: 18px;

  left: 160px;
}

.logseach > div > input {
  height: 20px;
}

#dataAcquisition >>> .el-dialog__header {
  border-bottom: 1px solid #f3f0f0;
}

.collTask >>> .el-dialog__body {
  padding: 0;
}

.btntop {
  margin: 10px 0;
}

.mailTable {
  width: 66%;
  margin: 0 auto;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  box-sizing: border-box;
}

.mailTable > tr > td:nth-child(1) {
  width: 25%;
  text-align: right;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  font-weight: bold;
  background-color: #eff3f6;
}

.mailTable > tr > td:nth-child(2) {
  width: 40%;
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}

.el-col >>> .el-input-group__append {
  padding: 0 8px !important;
}

.el-collapse >>> .el-collapse-item__header {
  font-size: 20px !important;
}

.el-collapse >>> div {
  font-size: 13px !important;
}
</style>