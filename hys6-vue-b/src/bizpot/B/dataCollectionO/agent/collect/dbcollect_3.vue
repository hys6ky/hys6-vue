<template>
    <div>
        <Step :active="active"></Step>
        <div class="cleanbtn">
            <el-button size="mini" type="success" @click="AllSettingDestinationFun()">所有表目的地设置</el-button>
        </div>
        <el-form ref="ruleForm" :model="ruleForm" class="steps5">
            <el-table :header-cell-style="{background:'#e6e0e0'}" ref="filterTable" stripe
                      :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%" size="medium" border
                      :data="ruleForm.ex_destinationData.slice((ex_destinationcurrentPage - 1) * ex_destinationpagesize, ex_destinationcurrentPage *ex_destinationpagesize)">
                <el-table-column label="序号" align="center" width="70">
                    <template scope="scope">
                        <span>{{ scope.$index + (ex_destinationcurrentPage - 1) * ex_destinationpagesize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="表名" prop="table_name" width="240" align="center" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="表中文名" width="240" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-form-item :prop="'ex_destinationData.'+scope.$index+'.table_ch_name'" :rules="rule.default">
                            <el-popover trigger="hover" placement="top">
                                <p>{{ scope.row.table_ch_name }}</p>
                            </el-popover>
                            <el-input size="medium" v-model="scope.row.table_ch_name"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="是否使用前缀" align="center" width="150" show-overflow-tooltip>
                    <template slot="header">
                        <el-checkbox @change="allPrefix(Allis_prefix)" v-model="Allis_prefix">
                            <span class="allclickColor">是否使用前缀</span>
                        </el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox type="selection" :true-label="IsFlag.Shi" :false-label="IsFlag.Fou"
                                     v-model="scope.row.is_prefix"
                                     v-if="scope.row.data_extract_type!='1'"></el-checkbox>
                        <!-- <el-tooltip class="item" effect="light" content placement="right">
            <div slot="content">
                最终表名称<br/>
                <span v-if="scope.row.is_prefix && scope.row.is_prefix == IsFlag.Shi">{{datasource_number+'_' + classify_num + '_' + scope.row.table_ch_name}}</span>
                <span v-else>{{scope.row.table_ch_name}}</span>
            </div>
            <i class="el-icon-question" color="blue" aria-hidden="true"></i>
        </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column label=" 选择目的地" align="center" show-overflow-tooltip min-width="150px">
                    <template slot="header">
                        <el-tooltip class="item" effect="light" content placement="right">
                            <div slot="content">目的地是oracle时<br/>落地表名长度不能大于27</div>
                            <i class="el-icon-question" aria-hidden="true">选择目的地</i>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                    <span class="settingbtn" v-if="scope.row.data_extract_type!='1'">
                        <el-button type="text" size="mini" v-if="scope.row.table_setting==true"
                                   @click="ChooseDestination(scope.row,scope.$index)">
                            {{ scope.row.store_name.join(' / ') }}
                        </el-button>
                        <el-button type="warning" size="mini" v-else @click="ChooseDestination(scope.row,scope.$index)">未选择</el-button>
                    </span>
                    </template>
                </el-table-column>
                <el-table-column label="是否拉链存储" align="center" width="150">
                    <template slot="header">
                        <el-checkbox @change="Allis_zipperFun(ruleForm.ex_destinationData,Allis_zippercheck)"
                                     v-model="Allis_zippercheck" :checked="Allis_zippercheck">
                        <span class="allclickColor">
                            是否拉链存储
                        </span>
                        </el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox :checked="scope.row.is_zipper" v-model="scope.row.is_zipper"
                                     v-if="scope.row.data_extract_type!='1'"
                                     @change="is_zipperFun(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="是否计算MD5" align="center" width="170" >
                    <template slot="header">
                        <el-checkbox @change="allMd5Fun(ruleForm.ex_destinationData,allMd5)" v-model="allMd5">
                            <el-tooltip class="item" effect="light" content placement="top">
                                <div slot="content">
                                    <dl>
                                        <dt>
                                            <h3>追加/替换</h3>
                                        </dt>
                                        <dd>支持自定义是否计算MD5值</dd>
                                        <br/>
                                        <dt>
                                            <h3>历史拉链/全历史拉链</h3>
                                        </dt>
                                        <dd>MD5项为必选</dd>
                                    </dl>
                                </div>
                                <span class="allclickColor">
                                <i class="el-icon-question" aria-hidden="true"><span
                                        class="allclickColor">是否计算MD5</span></i>
                            </span>
                            </el-tooltip>
                        </el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.is_md5" v-show="!scope.row.is_zipper" :true-label="IsFlag.Shi"
                                     :false-label="IsFlag.Fou"></el-checkbox>
                        <el-checkbox v-model="scope.row.is_md5" v-show="scope.row.is_zipper" disabled
                                     :true-label="IsFlag.Shi" :false-label="IsFlag.Fou"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="存储方式" align="center" width="180">
                    <template slot="header">
                        <el-popover placement="right" width="120" height="50" v-model="visible">
                            <el-select v-if="Allis_zippercheck" placeholder="存储方式" v-model="allstoragetype"
                                       size="medium">
                                <el-option v-for="(item,index) in zipper22" :key="index" :label="item.value"
                                           :value="item.code"></el-option>
                            </el-select>
                            <el-select v-else placeholder="存储方式" v-model="allstoragetype" size="mini">
                                <el-option v-for="(item,index) in notzipper22" :key="index" :label="item.value"
                                           :value="item.code"></el-option>
                            </el-select>
                            <div style="text-align: right; margin:30px 0 5px 0">
                                <el-button size="mini" type="danger" @click="allStorageModeCloseFun()">取消</el-button>
                                <el-button type="primary" size="mini" @click="allStorageModeFun()">确定</el-button>
                            </div>
                            <el-checkbox slot="reference" @change="allcunchuFun(allcunchu)" :checked="allcunchu"
                                         v-model="allcunchu">
                                <span class="allclickColor">存储方式</span>
                            </el-checkbox>
                        </el-popover>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.data_extract_typ!=='1'">
                            <el-form-item :prop="'ex_destinationData.'+scope.$index+'.storage_type'"
                                          :rules="rule.selected" v-if="scope.row.kafkaFlag != true">
                                <el-select v-if="scope.row.is_zipper" placeholder="存储方式"
                                           v-model="scope.row.storage_type" size="medium">
                                    <el-option v-for="(item,index) in zipper22" :key="index" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                                <el-select v-else placeholder="存储方式" v-model="scope.row.storage_type" size="medium">
                                    <el-option v-for="(item,index) in notzipper22" :key="index" :label="item.value"
                                               :value="item.code"></el-option>
                                    <!-- StorageType -->
                                </el-select>
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label=" 数据保留天数" align="center" width="165" >
                    <template slot="header">
                        <el-popover placement="right" height="50" v-model="saveDayvisible">
                            <div class="alldays">
                                <el-input size="medium" v-model="allSaveDay" style="width:66px"></el-input>
                                <span style="margin-left: 10px;">天</span>
                            </div>
                            <div style="text-align: right; margin:10px">
                                <el-button size="mini" type="danger" @click="allsaveDayCloseFun()">取消</el-button>
                                <el-button type="primary" size="mini" @click="allsaveDaySubmitFun()">确定</el-button>
                            </div>
                            <el-checkbox slot="reference" @change="allsaveDayFun(allSaveDayActive)"
                                         :checked="allSaveDayActive" v-model="allSaveDayActive">
                                <span class="allclickColor">数据保留天数(/天)</span>
                            </el-checkbox>
                        </el-popover>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'ex_destinationData.'+scope.$index+'.storage_time'" :rules="rule.default"
                                      v-if="scope.row.data_extract_type!='1'">
                            <el-input size="medium" v-model="scope.row.storage_time"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <el-pagination @size-change="ex_destination_handleSizeChange"
                       @current-change="ex_destination_handleCurrentChange" :current-page="ex_destinationcurrentPage"
                       :page-sizes="[100, 200, 300, 400]" :page-size="ex_destinationpagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="ruleForm.ex_destinationData.length"
                       class="locationcenter"></el-pagination>
        <el-row>
            <el-col :span="12">
                <el-button type="primary" size="medium" class="leftbtn" @click="backFun()">返回</el-button>
            </el-col>
            <el-col :span="12">
                 <el-button type="primary" size="medium" class='rightbtn' @click="next('ruleForm')" >下一步</el-button>
<!--                 <el-button type="success" size="medium" class='rightbtn' @click="startButtonFun()" >立即启动</el-button>-->
                <el-button type="primary" size="medium" class='rightbtn' @click="pre()">上一步</el-button>
            </el-col>
        </el-row>
        <!-- 选择目的地弹框 -->
        <el-dialog title=" 选择目的地" :visible.sync="dialogChooseDestination" width="70%" class="alltable">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">选择目的地</span>
            </div>
            <el-form ref="digForm" :model="digForm" label-width="20%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="落地表名:" prop="hyren_name"
                                      :rules="filter_rules([{required: true,dataType:'compositions'}])">
                            <el-input placeholder="表名" v-model="digForm.hyren_name" size="mini">
                                <template v-if="prefix" slot="prepend">{{ datasource_number }}_{{ classify_num }}_
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table stripe
                      :data="destinationData.slice((destination_currentPage - 1) * destination_pagesize, destination_currentPage * destination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="getRowKeys">
                <el-table-column width="55" align="center" prop="selectionState">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox @change="Allis_destinationFun(destinationData,Allis_destination)"
                                     v-model="Allis_destination" :checked="Allis_destination"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                                     @change="destination_evercheck(scope.row.usedflag,scope.row.dsl_name)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="序号" align="center" width="70">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (destination_currentPage - 1) * destination_pagesize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column property="dsl_name" label="存储名称" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="store_type" label="存储类型" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="store_name" label="目标库名称" align="center"
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
                <el-table-column prop="selectCol" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="getColumnStoInfoFun(scope.row)">配置字段属性</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="destination_handleSizeChange" @current-change="destination_handleCurrentChange"
                           :current-page.sync="destination_currentPage" :page-size="destination_pagesize"
                           layout="total, prev, pager, next" :total="destinationData.length"
                           class="locationcenter"></el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChooseDestination = false" type="danger" size="mini">取 消</el-button>
                <el-button type="primary" @click="ChooseDestinationSubmitFun('digForm')" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看详情 -->
        <el-dialog title=" 查看详情" :visible.sync="dialogViewDetails" width="60%" class="alltable">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">查看详情</span>
            </div>
            <table v-if="!viewDatilsData" class="mailTable" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="nocontent">暂无信息</td>
                </tr>
            </table>
            <table v-else class="mailTable" border="0" cellspacing="0" cellpadding="0">
                <tr v-for="(item,index) in viewDatilsData" :key="index">
                    <td>{{ item.storage_property_key }}</td>
                    <td>
                        {{ item.storage_property_val }}
                    </td>
                </tr>
            </table>
        </el-dialog>
        <!-- 配置字段属性 -->
        <el-dialog :visible.sync="dialogFieldProperty" width="80%" class="alltable">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">配置字段属性(根据目的地选择字段存储)</span>
            </div>
            <el-table stripe :data="FieldProperty" border size="medium" max-height="600" highlight-current-row
                      @row-click="loadAll">
                <el-table-column label="序号" width="70" align="center">
                    <template scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="item.value" :property="item.id" v-for="item in selectedColumnList"
                                 :key="item.id" align="center" :render-header="renderHeader">
                    <template slot-scope="scope" slot="header">
                    <span :key="scope.column.property" class="allclickColor"
                          v-if="item.id==='column_name'||item.id==='column_ch_name' || item.id==='column_type'|| item.id === 'column_tar_type' && item.id !==undefined">
                        {{ item.value }}
                    </span>
                        <el-checkbox :key="scope.column.property" v-else @change="allSelectFun(item.id,item.active)"
                                     v-model="item.active" :checked="item.active">
                            <span class="allclickColor">{{ item.value }}</span>
                        </el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <span v-if="scope.column.property==='column_name'">{{ scope.row[scope.column.property] }}</span>
                        <el-input v-else-if="scope.column.property==='column_ch_name'"
                                  v-model="scope.row[scope.column.property]" :title="scope.row[scope.column.property]"
                                  placeholder="列中文名" size="medium"></el-input>
                        <span v-else-if="scope.column.property==='column_type'">{{ scope.row[scope.column.property] }}</span>
                        <!--                    <el-select v-else-if="scope.column.property==='column_tar_type'" placeholder="请选择" v-model="scope.row['column_tar_type']" size="mini" clearable allow-create filterable>-->
                        <!--                        <el-option v-for="(item,index) in scope.row['column_type_mapping']" :key="index" :label="item" :value="item"></el-option>-->
                        <!--                    </el-select>-->
                        <el-autocomplete class="fetch" v-else-if="scope.column.property==='column_tar_type'"
                                         v-model="scope.row['column_tar_type']" :fetch-suggestions="querySearch"
                                         clearable placeholder="请输入内容" ref="elAuto"
                                         @clear="clearSelect"></el-autocomplete>
                        <div v-else>
                            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>
                            <!-- <el-checkbox v-else v-model="scope.row[scope.column.property]"></el-checkbox> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="Hbase">
                    <template slot-scope="scope">
                        <el-button size="mini" :disabled="scope.$index===0"
                                   @click="moveUp(scope.$index,scope.row,FieldProperty)">
                            <i class="el-icon-arrow-up"></i>
                        </el-button>
                        <el-button size="mini" :disabled="scope.$index===(FieldProperty.length-1)"
                                   @click="moveDown(scope.$index,scope.row,FieldProperty)">
                            <i class="el-icon-arrow-down"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--        <el-pagination @size-change="fieldProperty_handleSizeChange" @current-change="fieldProperty_handleCurrentChange" :current-page.sync="fieldProperty_currentPage" :page-size="fieldProperty_pagesize" layout="total, prev, pager, next" :total="FieldProperty.length" class="locationcenter"></el-pagination>-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="ConfigureFieldPropertiesCloseFun()" type="danger" size="mini">取 消</el-button>
                <el-button type="primary" size="mini" @click="ConfigureFieldPropertiesSubmitFun()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择全表目的地弹框 -->
        <el-dialog title=" 选择目的地" :visible.sync="dialogAllChooseDestination" width="70%" class="alltable">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">全表选择目的地设置</span>
                <span class="dialogtoptxt">
                <p class="dialogtopname">(存储名称选择存在oracle时，落地表名长度不能大于27，需单独设置并更改对应落地表名)</p>
            </span>
            </div>
            <el-table stripe
                      :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                      border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                      :row-key="(row)=>{ return row.dsl_id}" @selection-change="AllhandleSelectionChange"
                      @select-all='allselectD'>
                <el-table-column width="55" align="center" type="selection">
                </el-table-column>
                <el-table-column label="序号" align="center" width="70">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + (Alldestination_currentPage - 1) * Alldestination_pagesize + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column property="dsl_name" label="存储名称" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="store_type" label="存储类型" align="center"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property="store_name" label="目标库名称" align="center"
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAllChooseDestination = false" type="danger" size="mini">取 消</el-button>
                <el-button type="primary" @click="ChooseAllDestinationSubmitFun()" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <!--完成  -->
        <el-dialog title="设置数据跑批日期" :visible.sync="finishDialogVisible" width="40%">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">设置数据跑批日期</span>
            </div>
            <div>
                <el-form>
                    <el-form-item>
                        <el-date-picker type="date" value-format="yyyyMMdd" placeholder="选择启动日期" v-model="etl_date"
                                        style="width:100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        SQL中如果存在占位符,请填写占位符的值...多个参数之间请使用{{ ParamPlaceholder }}进行分割,例如: column1=123{{ ParamPlaceholder
                        }}column2=456
                        <el-input type="textarea" placeholder="采集任务中的SQL占位参数值" v-model="sqlParam"
                                  style="width:100%;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="finishDialogVisible = false" type="danger" size="mini">取 消</el-button>
            <el-button type="primary" @click="finishSubmit()" size="mini">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as validator from '@/utils/validator'
    import * as message from "@/utils/message";
    import Step from "../step_coll.vue";

    export default {
        components: {
            Step
        },
        data() {
            return {
                allMd5: false,
                Allis_prefix: false,
                prefix: true,
                sqlParam: '',
                ParamPlaceholder: '',
                finishDialogVisible: false,
                rule: validator.default,
                tableloadingInfo: "数据加载中...",
                dbid: null,
                aId: null,
                sourId: null,
                sName: null,
                active: 2,
                Allis_zippercheck: false,
                pzcheckAll: false,
                allcunchu: false,
                allSaveDayActive: false,
                visible: false,
                saveDayvisible: false,
                Allis_destination: false,
                ex_destinationcurrentPage: 1,
                ex_destinationpagesize: 100,
                destination_currentPage: 1,
                destination_pagesize: 10,
                fieldProperty_currentPage: 1,
                fieldProperty_pagesize: 10,
                Alldestination_pagesize: 10,
                Alldestination_currentPage: 1,
                ruleForm: {
                    ex_destinationData: [],

                },
                digForm: {
                    hyren_name: "",
                }, //选择目的地弹框显示的表名
                ex_destinationData: [],
                dialogChooseDestination: false,
                dialogViewDetails: false,
                dialogFieldProperty: false,
                destinationData: [{
                    Storagename: "1",
                    Storage: "2"
                }],
                FieldProperty: [],
                StorageType: [],
                storeTypeData: [],
                viewDatilsData: null,
                tableId: "",
                dynamic: [],
                selectedColumnList: {},
                Hbase: false,
                type: "",
                dslid: "",
                allstoragetype: "",
                allSaveDay: "",
                StoreData: [],
                dslIdString: [],
                multipleSelection: [],
                dataExtractypeindex: "",
                oldTbData: [],
                submit_0: false,
                submit_1: false,
                datasource_number: '', //数据源编号
                classify_num: '', // 分类编号
                dialogAllChooseDestination: false, //全表设置目的地
                AlldestinationData: [],
                Alldestinationchoose: [],
                etl_date: '',
                storageLayer: {},
                storegaType: {},
                storegaTypeAll: [],
                zipper22: [],
                notzipper22: [],
                checkSorageData: {},
                IsFlag: {},
                column_type_mapping: [],
                table_name: "",
                isSure: false, // 是否点了配置字段属性
                check_pass: false, //检查字段映射关系是否成功
                database_type: '', //采集原始库
                columnTarTypes: [],//字段目标列映射集合
            };
        },
        computed: {
            address() {
                const {
                    submit_0,
                    submit_1
                } = this;
                return {
                    submit_0,
                    submit_1
                };
            }
        },
        watch: {
            address(val) {
                if (val.submit_0 == true && val.submit_1 == true) {
                    if (this.startButton == true) {
                        this.sendSubmit()
                        this.startButton = false
                    } else {
                        this.nextLinkfun();
                    }
                }
            }
        },
        beforeCreate() {
            let params = {};
            params["category"] = "IsFlag";
            this.$Code.getCodeItems(params).then(res => {
                this.IsFlag = res.data ? res.data : [];
            });
            let params2 = {};
            let zipper = []
            params2["category"] = "StorageType";
            this.$Code.getCodeItems(params2).then(res => {
                this.storegaType = res.data
                zipper = [this.storegaType.QuanLiang]
                this.codeMethods(params2,res.data,zipper)
            });
          // this.$Code.getCategoryItems(params2).then(res => {
          //   let arrdata = res.data ? res.data : []
          //   if (arrdata.length > 0) {
          //     this.notzipper22 = [];
          //     arrdata.forEach(item => {
          //       if (item.code !== this.storegaType.ZengLiang&&item
          //           .code!==this.storegaType.UpSet&&item.code !== this.storegaType.LiShiLaLian) {
          //         if (zipper.includes(item.code)) {
          //           this.zipper22.push(item)
          //         }
          //       }
          //       if (item.code !== this.storegaType.ZengLiang&&item
          //           .code!==this.storegaType.UpSet&&item.code !== this.storegaType.
          //           LiShiLaLian&&item.code !== this.storegaType.QuanLiang){
          //         this.notzipper22.push(item)
          //       }
          //     })
          //     console.log(this.notzipper22,"this.notzipper22")
          //   }
          // });
        },
        created() {
            this.dbid = this.$route.query.id;
            this.aId = this.$route.query.agent_id;
            this.sourId = this.$route.query.source_id;
            this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/fileconf/getSqlParamPlaceholder").then(res => {
              if (res && res.success) {
                this.ParamPlaceholder = res.data
              }
            })

            this.storeTypeFun();
            this.specialfieldFun();
            this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/getStoreDataBase", {
                'colSetId': this.dbid
            }).then(res => {
                /*addTaskAllFun.getStoreDataBase({
                    'colSetId': this.dbid
                }).then(res => {*/
                if (res.success) {
                    this.storageLayer = res.data
                }
            })
        },
        mounted() {
            let params = {};
            params["colSetId"] = this.dbid;
            this.tableloadingInfo = "数据加载中...";
            this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getInitInfo", params).then(res => {
                // addTaskAllFun.stodegetInitInfo(params).then(res => {
                this.datasource_number = res.data.datasource_number
                this.classify_num = res.data.classify_num
                if (res) {
                    if (res.data.storageTableData.length == 0) {
                        this.tableloadingInfo = "暂无数据";
                    } else {
                        let arr = res.data.storageTableData;
                        let paramst = {};
                        paramst["colSetId"] = this.$route.query.id;
                        this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getTbStoDestByColSetId", paramst).then(res => {
                            //addTaskAllFun.getTbStoDestByColSetId(paramst).then(res => {
                            if (res.success) {
                                this.oldTbData = res.data != '' ? res.data : [];
                            }
                            let database = this.datasource_number + '_' + this.classify_num + '_';
                            if (this.oldTbData.length > 0) {
                                for (var i = 0; i < arr.length; i++) {
                                    for (let j = 0; j < this.oldTbData.length; j++) {
                                        if (arr[i].table_id == this.oldTbData[j].tableId) {
                                            if (this.oldTbData[j].dslIds.length > 0) {
                                                arr[i].table_setting = true;
                                            } else {
                                                arr[i].table_setting = false;
                                            }
                                            if (arr[i].is_prefix == this.IsFlag.Shi) {
                                                let tableName = this.oldTbData[j].hyren_name == '' ? arr[j].table_name : this.oldTbData[j].hyren_name.replace(database, '');
                                                this.oldTbData[j].hyren_name = database + tableName
                                            }
                                            arr[i].store_name = this.storageLayer[arr[i].table_id]
                                            if (typeof arr[i].storage_type === 'undefined') {
                                                arr[i].storage_type = this.oldTbData[j].storage_type
                                            }
                                            this.checkSorageData[arr[i].table_name] = this.oldTbData[j].storage_type
                                        }
                                    }
                                  //判断目的地是不是kafka,如果是改变kafkaFlag=true
                                  if (arr[i].store_name !== undefined && arr[i].store_name.length > 0){
                                    arr[i].store_name.forEach(item => {
                                      var toLowerCase = item.toLowerCase();
                                      if (toLowerCase.includes('kafka')){
                                        arr[i]['kafkaFlag'] = true;
                                      }
                                    })
                                  }
                                    // 拉链存储或者增量卸数
                                    if (arr[i].is_zipper == "1") {
                                        arr[i].is_zipper = true;
                                    } else {
                                        arr[i].is_zipper = false;
                                    }
                                    this.checkSorageData[arr[i].table_name + '_zip'] = arr[i].is_zipper
                                    this.checkSorageData[arr[i].table_name + '_md5'] = typeof arr[i].is_md5 != 'undefined' ? arr[i].is_md5 : this.IsFlag.Fou
                                    // if (!arr[i].storage_type) {
                                    //     arr[i].storage_type = "3";
                                    // }
                                    if (!arr[i].storage_time) {
                                        arr[i].storage_time = 0;
                                    }
                                }
                                this.ruleForm.ex_destinationData = arr;
                            } else {
                                for (var i = 0; i < arr.length; i++) {
                                    if (arr[i].is_zipper == "1") {
                                        arr[i].is_zipper = true;
                                    } else {
                                        arr[i].is_zipper = false;
                                    }
                                    // if (!arr[i].storage_type) {
                                    //     arr[i].storage_type = "3";
                                    // }
                                    if (!arr[i].storage_time) {
                                        arr[i].storage_time = 0;
                                    }
                                    arr[i].store_name = []
                                    this.checkSorageData[arr[i].table_name] = this.storegaType.TiHuan
                                }
                                this.ruleForm.ex_destinationData = arr;
                            }
                        });
                    }
                } else {
                    this.tableloadingInfo = "暂无数据";
                }
            });
            // this.getSaveDataFun();
        },

        methods: {
          codeMethods(param,codeData,zipper){
            this.$Code.getCategoryItems(param).then(res => {
              let arrdata = res.data ? res.data : []
              if (arrdata.length > 0) {
                this.notzipper22 = [];
                arrdata.forEach(item => {
                  if (item.code !== codeData.ZengLiang&&item
                      .code!==codeData.UpSet&&item.code !== codeData.LiShiLaLian) {
                    if (zipper.includes(item.code)) {
                      this.zipper22.push(item)
                    }
                  }
                  if (item.code !== codeData.ZengLiang&&item
                      .code!==codeData.UpSet&&item.code !== codeData.
                      LiShiLaLian&&item.code !== codeData.QuanLiang){
                    this.notzipper22.push(item)
                  }
                })
              }
            });
          },
            // 表头事件
            renderHeader(h, {
                column
            }) { // h即为cerateElement的简写，具体可看vue官方文档
                if (column.property === 'column_tar_type') {
                    return h(
                        'div', [
                            h('span', column.label),
                            h('el-tooltip', {
                                props: {
                                    placement: 'bottom'
                                }
                            }, [
                                h('div', {
                                    slot: 'content',
                                    style: {
                                        'width': '150px',
                                        whiteSpace: 'normal',
                                        'margin-bottom': '10px'
                                    }
                                }, "可点击输入框查看输入建议，也支持自定义输入"),
                                h('i', {
                                    class: 'el-icon-question',
                                    style: 'color:black;margin-left:5px;'
                                })
                            ],)
                        ]
                    )
                } else {
                    return column.label;
                }
            },
            sendSubmit() {
                this.$executeRequest.execGetByModuleUrl("/agentList/sendCollectDatabase", {
                    colSetId: this.dbid,
                    etl_date: this.etl_date,
                    sqlParam: this.sqlParam
                }).then(res => {
                    /*addTaskAllFun
                        .sendCollectDatabase({
                            colSetId: this.dbid,
                            etl_date: this.etl_date,
                            sqlParam: this.sqlParam
                        })
                        .then(res => {*/
                    this.submit_1 = false
                    this.submit_0 = false
                    if (res.success) {
                        this.finishDialogVisible = false;
                        this.$Msg.customizTitle('启动发送成功', 'success')
                        this.$router.push({
                            name: "dataCollectionO"
                        });
                    }
                })
            },
            backFun() {
                this.$router.push({
                    name: "dataCollectionO"
                });
            },
            next(formName) {
              //如果选择kafka为目的地，则默认storage_type = '3'  F1,替换
              this.ruleForm.ex_destinationData.forEach(item => {
                if (item.kafkaFlag){
                  item.storage_type = '3'
                }
              });
                let dataAll = this.ruleForm.ex_destinationData,
                    datasource_number1 = this.datasource_number,
                    classify_num1 = this.classify_num;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let tbStoInfoString = [],
                            tableString = [],
                            arr = dataAll,
                            desDataArr = [],
                            dslIdString = [];
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].data_extract_type != "1") {
                                tbStoInfoString.push({
                                    is_zipper: arr[i].is_zipper == true ? "1" : "0",
                                    storage_time: parseInt(arr[i].storage_time),
                                    storage_type: arr[i].storage_type,
                                    table_id: arr[i].table_id,
                                    is_prefix: arr[i].is_prefix,
                                    is_md5: arr[i].is_md5
                                });
                                desDataArr.push({
                                    tableId: arr[i].table_id,
                                    dslIds: [],
                                    hyren_name: arr[i].is_prefix == this.IsFlag.Shi ? datasource_number1 + '_' + classify_num1 + '_' + arr[i].table_name : arr[i].table_name,
                                    storeNames: arr[i].store_name
                                });
                            }

                            tableString.push({
                                table_id: arr[i].table_id,
                                table_ch_name: arr[i].table_ch_name,
                                table_name: arr[i].table_name
                            });
                        }
                        // 判断获得的表里面
                        for (let j = 0; j < desDataArr.length; j++) {
                            for (let k = 0; k < this.oldTbData.length; k++) {
                                if (desDataArr[j].tableId == this.oldTbData[k].tableId) {
                                    desDataArr[j].dslIds = this.oldTbData[k].dslIds;
                                    if (this.oldTbData[k].hyren_name != '' && this.oldTbData[k].hyren_name != undefined) {
                                        desDataArr[j].hyren_name = this.oldTbData[k].hyren_name
                                    }
                                }
                            }
                        }
                        for (let m = 0; m < desDataArr.length; m++) {
                            for (let n = 0; n < this.dslIdString.length; n++) {
                                if (desDataArr[m].tableId == this.dslIdString[n].tableId) {
                                    desDataArr[m].dslIds = this.dslIdString[n].dslIds;
                                    if (this.dslIdString[n].hyren_name != '' && this.dslIdString[n].hyren_name != undefined) {
                                        desDataArr[m].hyren_name = this.dslIdString[n].hyren_name

                                    }
                                }
                            }
                        }
                        dslIdString = desDataArr;
                        // 检查表字段目标类型并保存目标类型
                        if (desDataArr.length > 0) {
                            for (let i = 0; i < desDataArr.length; i++) {
                                for (let j = 0; j < desDataArr[i].dslIds.length; j++) {
                                    let params = {};
                                    params["dslId"] = desDataArr[i].dslIds[j];
                                    params["tableId"] = desDataArr[i].tableId;
                                    this.isSure = false;
                                    //TODO 检查字段映射关系是否未配置  这个代码有问题，先注释了
                                    //this.getColumnStoInfo(params, desDataArr[i].storeNames[j], false);
                                }
                            }
                        }
                        if (tbStoInfoString.length > 0) {
                            let params = {};
                            params["tbStoInfoString"] = JSON.stringify(tbStoInfoString);
                            params["colSetId"] = this.dbid;
                            params["dslIdString"] = JSON.stringify(dslIdString);
                            this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/stodestconf/saveTbStoInfo", params).then(res => {
                                //addTaskAllFun.saveTbStoInfo(params).then(res => {
                                if (res.success) {
                                    this.submit_1 = true;
                                }
                            });
                        } else {
                            this.submit_1 = true;
                        }
                        // 保存表名updateTableName
                        if (tableString.length > 0) {
                            let params = {};
                            params["tableString"] = JSON.stringify(tableString);
                            this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/stodestconf/updateTableName", params).then(res => {
                                if (res.success) {
                                    this.submit_0 = true;
                                    // this.dbid = res.data;
                                } else {
                                    this.$Msg.customizTitle(res.message, 'error')
                                }
                            });
                        } else {
                            this.submit_0 = true;
                        }

                    }
                });
            },
            nextLinkfun() {
                let data = {};
                if (this.$route.query.edit == "yes") {
                    data = {
                        agent_id: this.aId,
                        id: this.$route.query.id,
                        source_id: this.sourId,
                        source_name: this.$route.query.source_name,
                        edit: "yes"
                    };
                } else {
                    data = {
                        id: this.$route.query.id,
                        agent_id: this.aId,
                        source_id: this.sourId,
                        source_name: this.$route.query.source_name,
                    };
                }
                  this.$router.push({
                    name: "dbcollect_4",
                    query: data
                  });
            },
            pre() {
                let data = {};
                if (this.$route.query.edit == "yes") {
                    data = {
                        agent_id: this.aId,
                        id: this.dbid,
                        source_id: this.sourId,
                        source_name: this.$route.query.source_name,
                        edit: "yes",
                    };
                } else {
                    data = {
                        agent_id: this.aId,
                        id: this.dbid,
                        source_id: this.sourId,
                        source_name: this.$route.query.source_name,
                    };
                }
                this.$router.push({
                    name: "collect",
                    query: data
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
            fieldProperty_handleSizeChange(size) {
                this.fieldProperty_pagesize = size;
            },
            fieldProperty_handleCurrentChange(current) {
                this.fieldProperty_currentPage = current;
            },
            is_zipperFun(row) {
                // 非拉链, 存储方式设置为替换, 并默认不计算MD5
                if (!row.is_zipper) {
                    console.log(row,"非拉链row")
                    row.storage_type = this.storegaType.TiHuan
                    row.is_md5 = this.checkSorageData[row.table_name + '_md5']
                } else {
                  console.log(row,"拉链row")
                    //拉链代码项
                    let ll = [this.storegaType.QuanLiang, this.storegaType.ZengLiang]
                    // 如果是拉链, 且上次记录的拉线方式不存在(增量/全量)则默认为全量
                    if (typeof this.checkSorageData[row.table_name] != 'undefined') {
                        if (!ll.includes(this.checkSorageData[row.table_name])) {
                            row.storage_type = this.storegaType.QuanLiang
                        } else {
                            row.storage_type = this.checkSorageData[row.table_name]
                        }
                    }
                    row.is_md5 = this.IsFlag.Shi
                }
            },
            Allis_zipperFun(items, e) {

                //拉链代码项
                let ll = [this.storegaType.QuanLiang, this.storegaType.ZengLiang]
                items.forEach((item) => {
                    if (e) {
                        //这里是全选拉链
                        item.is_zipper = true;
                        //如果存在上次配置的值,则不存放默认的数据,否则给个默认数据信息
                        if (!ll.includes(item.storage_type)) {
                            item.storage_type = this.storegaType.QuanLiang
                        } else {
                            let storageType = this.checkSorageData[item.table_name];
                            // 如果是拉链, 检查上次的数据是否还为拉链, 如果是则获取旧的拉链方式(全量/增量),反之直接使用全量
                            if (ll.includes(storageType)) {
                                item.storage_type = this.checkSorageData[item.table_name]
                            } else {
                                item.storage_type = this.storegaType.QuanLiang
                            }
                        }
                        item.is_md5 = this.IsFlag.Shi
                    } else {
                        item.storage_type = typeof this.checkSorageData[item.table_name] != 'undefined' ? this.checkSorageData[item.table_name] : this.storegaType.TiHuan
                        item.is_zipper = this.checkSorageData[item.table_name + "_zip"]
                        item.is_md5 = this.checkSorageData[item.table_name + "_md5"]
                    }
                });
            },
            allMd5Fun(items, e) {
                //拉链代码项
                items.forEach((item) => {
                    // 全选 MD5, 跳过是拉链的表,并将MD5设置为否
                    if (item.is_zipper) {
                        item.is_md5 = this.IsFlag.Shi
                    } else {
                        if (e) {
                            item.is_md5 = this.IsFlag.Shi
                        } else {
                            // 如果取消了全选, 恢复之前的状态, 如果没有之前的状态,则默认不计算MD5
                            item.is_md5 = typeof this.checkSorageData[item.table_name + "_md5"] == 'undefined' ? this.IsFlag.Fou : this.checkSorageData[item.table_name + "_md5"]
                        }
                    }
                });
            },
            //是否使用前缀全选/取消
            allPrefix(e) {
                this.ruleForm.ex_destinationData.forEach(item => {
                    if (e) {
                        item.is_prefix = this.IsFlag.Shi;
                    } else {
                        item.is_prefix = this.IsFlag.Fou;
                    }
                })
                this.Allis_prefix = e
            },
            ChooseDestination(row, index) {
                this.dataExtractypeindex = index;
                this.tableId = row.table_id;
                this.table_name = row.table_name;
                this.prefix = row.is_prefix == this.IsFlag.Shi;
                this.database_type = row.database_type;
                if (this.dslIdString.length > 0) {
                    let arrall = [];
                    for (let m = 0; m < this.dslIdString.length; m++) {
                        arrall.push(this.dslIdString[m].tableId);
                    }
                    if (arrall.indexOf(row.table_id) != -1) {
                        arrall.length = 0
                        for (let m = 0; m < this.dslIdString.length; m++) {
                            if (this.dslIdString[m].tableId == row.table_id) {
                                let params = {},
                                    dslIds = this.dslIdString[m].dslIds;
                                let data = this.storeTypeData;
                                params["tableId"] = row.table_id;
                                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStoDestByTableId", params).then(res => {
                                    //addTaskAllFun.getStoDestByTableId(params).then(res => {
                                    let arr = JSON.parse(JSON.stringify(res.data.tableStorage));
                                    if (dslIds.length > 0) {
                                        for (let yn = 0; yn < arr.length; yn++) {
                                            arr[yn].usedflag = false;
                                            for (let n = 0; n < dslIds.length; n++) {
                                                if (arr[yn].dsl_id == dslIds[n]) {
                                                    arr[yn].usedflag = true;
                                                }
                                            }
                                            for (let j = 0; j < data.length; j++) {
                                                if (data[j].code == arr[yn].store_type) {
                                                    arr[yn].store_type = data[j].value;
                                                }
                                            }
                                        }
                                    } else {
                                        for (let yn = 0; yn < arr.length; yn++) {
                                            arr[yn].usedflag = false;
                                            for (let j = 0; j < data.length; j++) {
                                                if (data[j].code == arr[yn].store_type) {
                                                    arr[yn].store_type = data[j].value;
                                                }
                                            }
                                        }
                                    }
                                    this.destinationData = arr;
                                })
                                this.digForm.hyren_name = this.dslIdString[m].new_name

                            }
                        }
                    } else {
                        this.destinationOldDataFun(row.table_id, row.table_name);
                    }
                } else {
                    /*
                      这里判断是否使用前缀,如果使用前缀则
                    */
                    if (row.is_prefix)
                        this.destinationOldDataFun(row.table_id, row.table_name);
                }
                this.dialogChooseDestination = true;
            },
            //目的地弹框初始数据
            destinationOldDataFun(id, tablename) {
                let params = {};
                params["tableId"] = id;
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStoDestByTableId", params).then(res => {
                    //addTaskAllFun.getStoDestByTableId(params).then(res => {
                    let str = this.datasource_number + '_' + this.classify_num + '_'
                    if (res.success) {
                        this.digForm.hyren_name = res.data.hyren_name != '' ? res.data.hyren_name.replace(str, '') : tablename;
                        let arr = JSON.parse(JSON.stringify(res.data.tableStorage));
                        let data = this.storeTypeData;
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].usedflag == "1") {
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
                        this.destinationData = arr;
                    }
                });
            },
            // 点击查看详情
            getStoDestDetailFun(row) {
                this.dialogViewDetails = true;
                let params = {};
                params["dslId"] = row.dsl_id;
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStoDestDetail", params).then(rs => {
                    //addTaskAllFun.getStoDestDetail(params).then(rs => {
                    if (rs.success) {
                        this.viewDatilsData = this.$Secret.DecryptJSON(rs.data).data
                    }
                });
            },
            // 点击配置属性按钮
            getColumnStoInfoFun(row) {
                this.type = row.store_type;
                this.dslid = row.dsl_id;
                this.Hbase = row.store_type === "Hbase";
                this.dialogFieldProperty = true;
                // 获取表头
                let param = {};
                param["dslId"] = row.dsl_id;
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getColumnHeader", param).then(res => {
                    //addTaskAllFun.getColumnHeader(params0).then(res => {
                    if (res.success) {
                        let key;
                        res.data["column_type"] = "字段类型";
                        res.data["column_tar_type"] = "字段目标类型";
                        let arr = [];
                        for (key in res.data) {
                            if (key === "column_name" || key === 'column_tar_type' ||
                                key === "column_ch_name" || key === "column_type") {
                                arr.push({
                                    id: key,
                                    value: res.data[key]
                                });
                            }
                        }
                        for (key in res.data) {
                            if (key !== "column_name" && key !== "column_ch_name" &&
                                key !== "column_type" && key !== 'column_tar_type') {
                                arr.push({
                                    id: key,
                                    value: "是否" + res.data[key],
                                    active: false
                                });
                            }
                        }
                        this.selectedColumnList = arr;
                    }
                });
                this.isSure = true;
                // 获取数据
                let params = {};
                params["dslId"] = row.dsl_id;
                params["tableId"] = this.tableId;
                this.getColumnStoInfo(params, this.type, true);
            },
            // 获取字段属性以及映射信息
            getColumnStoInfo(params, store_name, showMessage) {
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getColumnStoInfo", params).then(res => {
                    if (res.success) {
                        let arr = res.data;
                        for (let i = 0; i < arr.length; i++) {
                            for (let key in arr[i]) {
                                if (!arr[i]['column_type_mapping']) {
                                    // 同库之间，取源类型
                                    let contrast = [];
                                    if (!arr[i]['column_tar_type']) {
                                        // 目标类型不存在，取源类型
                                        arr[i]['column_tar_type'] = arr[i]['column_type']
                                    } else if (arr[i]['column_tar_type'] !== arr[i]['column_type']) {
                                        // 手动输入目标类型
                                        contrast.push(arr[i]['column_type'])
                                    }
                                    contrast.push(arr[i]['column_tar_type'])
                                    arr[i]['column_type_mapping'] = contrast
                                } else if (key === 'column_type_mapping') {
                                    // 非类型对照属性
                                    if (arr[i]['column_type_mapping'].length === 0) {
                                        let contrast = [];
                                        // 映射类型不存在
                                        if (!arr[i]['column_tar_type']) {
                                            // 目标类型不存在，取源类型
                                            arr[i]['column_tar_type'] = arr[i]['column_type']
                                        }
                                        contrast.push(arr[i]['column_tar_type'])
                                        arr[i]['column_type_mapping'] = contrast
                                    } else {
                                        // 映射类型存在
                                        if (!arr[i]['column_tar_type']) {
                                            if (arr[i]['column_type_mapping'].length === 1) {
                                                arr[i]['column_tar_type'] = arr[i]['column_type_mapping'][0];
                                            } else {
                                                arr[i]['column_tar_type'] = ""
                                            }
                                        } else if (arr[i]['column_type_mapping']) {
                                            if (arr[i]['column_type_mapping'].length === 1) {
                                                if (arr[i]['column_tar_type']) {
                                                    if (arr[i]['column_type_mapping'].indexOf(arr[i]['column_tar_type']) !== -1) {
                                                        arr[i]['column_tar_type'] = arr[i]['column_type_mapping'][0];
                                                    }
                                                } else {
                                                    arr[i]['column_tar_type'] = arr[i]['column_type_mapping'][0];
                                                }
                                            } else if (arr[i]['column_type_mapping'].indexOf(arr[i]['column_tar_type']) === -1) {
                                                arr[i]['column_tar_type'] = arr[i]['column_tar_type']
                                            }
                                        }
                                    }
                                } else if (key !== "column_id" && key !== "column_ch_name" && key !== 'column_tar_type' &&
                                    key !== "column_name" && key !== "csi_number" && key !== 'column_type' &&
                                    key !== 'column_type_mapping') {
                                    arr[i][key] = arr[i][key] !== "0"
                                }
                            }
                        }
                        this.FieldProperty = arr;
                        if (!this.isSure) {
                            // 检查配置字段属性中目标类型配置情况信息，是否有一对多未而选择目标类型
                            this.checkFieldsConfProperties(store_name);
                            // 如果配置字段属性没有点击确定且字段类型存在一一映射关系，默认保存，如果有多个映射关系根据提示手动选择
                            if (this.check_pass) {
                                let tbcol_srctgt_maps = [];
                                let param = {};
                                param["dslId"] = params.dslId;
                                for (let i = 0; i < arr.length; i++) {
                                    tbcol_srctgt_maps.push({
                                        dsl_id: params.dslId,
                                        column_id: arr[i].column_id,
                                        column_tar_type: arr[i].column_tar_type
                                    });
                                    delete arr[i].column_tar_type;
                                }
                                param["tbcol_srctgt_maps"] = JSON.stringify(tbcol_srctgt_maps);
                                this.saveTbColSrctgtMapInfo(param, showMessage);
                            }
                        }
                    }
                });
            },
            //校验配置字段属性
            checkFieldsConfProperties(store_name) {
                if (this.FieldProperty.length !== 0) {
                    for (let i = 0; i < this.FieldProperty.length; i++) {
                        let datum = this.FieldProperty[i];
                        if (!datum.column_tar_type && datum.column_type_mapping && datum.column_type_mapping.length > 1) {
                            this.$Msg.customizTitle("存储层为：" + store_name + "，表名为：" + this.table_name +
                                "，字段为：" + datum.column_name + '，字段类型为：' + datum.column_type +
                                ", 目标类型有多个映射关系：" + datum.column_type_mapping +
                                ', 请选择存储层并点击配置字段属性选择需要映射的字段类型！！！', 'warning')
                            this.check_pass = false;
                            break;
                        } else {
                            this.check_pass = true;
                        }
                    }
                }
            },
            allSelectFun(tit, e) {
                let data = this.FieldProperty;
                for (let i = 0; i < data.length; i++) {
                    for (let key in data[i]) {
                        if (key == tit) {
                            if (e) {
                                data[i][key] = true;
                            } else {
                                data[i][key] = false;
                            }
                        }
                    }
                }
            },
            //上移
            moveUp(index, row, tableData) {
                if (index > 0) {
                    let upDate = tableData[index - 1];
                    tableData.splice(index - 1, 1);
                    tableData.splice(index, 0, upDate);
                } else {
                    // alert("已经是第一条，不可上移");
                }
            },
            //下移
            moveDown(index, row, tableData) {
                if (index + 1 === tableData.length) {
                    // alert("已经是最后一条，不可下移");
                } else {
                    let downDate = tableData[index + 1];
                    tableData.splice(index + 1, 1);
                    tableData.splice(index, 0, downDate);
                }
            },
            //  获取特殊字段值
            specialfieldFun() {
                let params = {};
                params["category"] = "StoreLayerAdded";
                this.$Code.getCategoryItems(params).then(res => {
                    if (res.success) {
                        this.StoreData = res.data;
                    }
                });
            },
            // 配置字段属性
            ConfigureFieldPropertiesSubmitFun() {
                let data = this.FieldProperty;
                // 校验是否有未选择映射类型
                for (let i = 0; i < data.length; i++) {
                    if (!data[i].column_tar_type) {
                        this.$Msg.customizTitle("第" + (i + 1) + "行字段为：" + data[i].column_name +
                            '，字段类型为：' + data[i].column_type + ",目标类型有多个映射关系：" + data[i].column_type_mapping +
                            ',请选择需要映射的字段类型！！！', 'warning')
                        return;
                    }
                }
                let arr = data,
                    columnString = [],
                    count = 0,
                    specialfield = [],
                    arrlist = [],
                    tbcol_srctgt_maps = [];
                // 调特殊字段接口dslid
                let param = {};
                param["dslId"] = this.dslid;
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getDataStoreLayerAddedId", param).then(res => {
                    //addTaskAllFun.getDataStoreLayerAddedId(params0).then(res => {
                    if (res.success) {
                        let data = res.data,
                            arr2 = [];
                        // 将获得的id以固定形式给arr2
                        if (data) {
                            for (let item in data) {
                                arr2.push({
                                    key: item,
                                    value: data[item]
                                });
                            }
                            // 将特殊字段对应id组成新的数组给specialfield
                            for (let i = 0; i < this.StoreData.length; i++) {
                                for (let j = 0; j < arr2.length; j++) {
                                    if (this.StoreData[i].code === arr2[j].key) {
                                        specialfield.push({
                                            key: this.StoreData[i].value,
                                            value: arr2[j].value
                                        });
                                    }
                                }
                            }
                        }
                        //columnString,tbcol_srctgt_maps
                        for (let i = 0; i < arr.length; i++) {
                            columnString.push({
                                column_id: arr[i].column_id,
                                column_ch_name: arr[i].column_ch_name
                            });
                            tbcol_srctgt_maps.push({
                                dsl_id: this.dslid,
                                column_id: arr[i].column_id,
                                column_tar_type: arr[i].column_tar_type
                            });
                            delete arr[i].column_name;
                            delete arr[i].column_ch_name;
                            delete arr[i].column_tar_type;
                            arr[i].dsladIds = [];
                            // Hbase类型增加csiNumber字段
                            if (this.type === "Hbase") {
                                delete arr[i].csiNumber;
                                if (arr[i].rowkey) {
                                    if (arr[i].rowkey === true) {
                                        count = count + 1;
                                        arr[i].csiNumber = count;
                                    }
                                }
                            }
                            // 遍历得到dsladIds数组
                            for (let key in arr[i]) {
                                if (
                                    key !== "csiNumber" &&
                                    key !== "column_id" &&
                                    key !== "dsladIds" &&
                                    key !== "csi_number" &&
                                    key !== 'column_type' &&
                                    key !== 'is_primary_key' &&
                                    key !== "column_tar_type"
                                ) {
                                    if (key) {
                                        if (arr[i][key] === true) {
                                            delete arr[i][key];
                                            arr[i].dsladIds.push(key);
                                        } else {
                                            delete arr[i][key];
                                        }
                                    }
                                }
                                if (key === "column_id") {
                                    arr[i].columnId = arr[i][key];
                                    delete arr[i][key];
                                }
                                if (key === "csi_number") {
                                    delete arr[i][key];
                                }
                            }
                        }
                    }
                    arrlist = JSON.parse(JSON.stringify(arr));
                    // dslIds空的删除，并替换对应特殊字段id
                    for (let j = 0; j < arrlist.length; j++) {
                        if (arrlist[j].dsladIds.length === 0) {
                            arrlist.splice(j, 1);
                            j--;
                        } else {
                            for (let n = 0; n < arrlist[j].dsladIds.length; n++) {
                                for (let m = 0; m < specialfield.length; m++) {
                                    if (specialfield[m].key === arrlist[j].dsladIds[n]) {
                                        arrlist[j].dsladIds[n] = specialfield[m].value;
                                    }
                                }
                            }
                        }
                    }
                    // 保存特殊字段
                    let params = {};
                    params["colStoInfoString"] = JSON.stringify(arrlist);
                    params["tableId"] = this.tableId;
                    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/stodestconf/saveColStoInfo", params).then(res => {
                    });
                    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/stodestconf/updateColumnZhName", columnString).then(res => {
                    });
                    // 保存表字段目标类型
                    let params3 = {};
                    params3["dslId"] = this.dslid;
                    params3["tbcol_srctgt_maps"] = JSON.stringify(tbcol_srctgt_maps);
                    this.saveTbColSrctgtMapInfo(params3, true);
                });
            },
            // 保存表字段目标类型
            saveTbColSrctgtMapInfo(params, showMessage) {
                this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agent/stodestconf/saveTbColSrctgtMapInfo", params).then(res => {
                    //addTaskAllFun.saveTbColSrctgtMapInfo(params).then(res => {
                    if (showMessage) {
                        message.saveSuccess(res);
                    }
                    this.dialogFieldProperty = false;
                });
            },
            // 配置字段属性取消按钮
            ConfigureFieldPropertiesCloseFun() {
                this.dialogFieldProperty = false;
                this.isSure = false;
            },
            // 改变所有存储方式确定按钮方法
            allcunchuFun(e) {
                if (e) {
                    this.visible = true;
                } else {
                    this.visible = false;
                }
            },
            allStorageModeFun() {
                this.visible = false;
                for (let i = 0; i < this.ruleForm.ex_destinationData.length; i++) {
                    if (!this.ruleForm.ex_destinationData[i].is_zipper) {
                        this.ruleForm.ex_destinationData[i].storage_type = this.allstoragetype;
                    }
                }
            },
            allStorageModeCloseFun() {
                this.visible = false;
                this.allcunchu = false;
            },
            //选择目的地弹框提交确定按钮
            ChooseDestinationSubmitFun(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.destinationData)),
                            str = '',
                            searcharr = [];
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].usedflag === true) {
                                //这写的是啥玩意啊........这里出现问题需要调整
                                // searcharr.push(data[i].dsl_name.toLowerCase())
                                //不想改这个程序,这里直接使用数据库类型的名称
                                searcharr.push(data[i].store_name.toLowerCase())
                                // 检查数据类型是不是需要做转换
                                this.dslid = data[i].dsl_id;
                                let params = {};
                                params["dslId"] = data[i].dsl_id;
                                params["tableId"] = this.tableId;
                                this.isSure = false;
                                // 检查字段映射关系是否未配置
                                this.getColumnStoInfo(params, data[i].store_name, false);
                            }
                        }
                        if (searcharr.length === 0) {
                            this.open();
                            return;
                        }
                        let database = {};
                        let dslIds = [];
                        searcharr.forEach(item => {
                            if (item.indexOf('oracle') === -1) {
                                if (this.prefix) {
                                    str = this.datasource_number + '_' + this.classify_num + '_' + this.digForm.hyren_name
                                } else {
                                    str = this.digForm.hyren_name
                                }
                                if (this.dslIdString.length > 0) {
                                    for (let j = 0; j < this.dslIdString.length; j++) {
                                        if (this.dslIdString[j].tableId === this.tableId) {
                                            this.dslIdString.splice(j, 1);
                                            j--
                                        }
                                    }
                                }
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i].usedflag === true) {
                                        if (dslIds.indexOf(data[i].dsl_id) === -1) {
                                            dslIds.push(data[i].dsl_id);
                                        }
                                        database[data[i].dsl_id] = data[i].dsl_name
                                    }
                                }
                                let kafkaFlag = false;
                                for (let i = 0; i < data.length; i++){
                                  if (data[i].usedflag === true && data[i].store_type == 'Kafka'){
                                    kafkaFlag = true;
                                  }
                                }
                                if (dslIds.length !== 0) {
                                    this.dslIdString.push({
                                        dslIds: dslIds,
                                        tableId: this.tableId,
                                        hyren_name: str,
                                        new_name: this.digForm.hyren_name
                                    });
                                    this.dialogChooseDestination = false;
                                    this.ruleForm.ex_destinationData[this.dataExtractypeindex].table_setting = true;
                                    this.ruleForm.ex_destinationData[this.dataExtractypeindex].store_name = Object.values(database);
                                    this.ruleForm.ex_destinationData[this.dataExtractypeindex].kafkaFlag = kafkaFlag;
                                } else {
                                    this.open();
                                }
                            } else {
                                if (this.prefix) {
                                    str = this.datasource_number + '_' + this.classify_num + '_' + this.digForm.hyren_name
                                } else {
                                    str = this.digForm.hyren_name
                                }
                                if (str.length > 27) {
                                    this.$Msg.customizTitle('选择目的地存在oracl时,落地表名长度不能超过27,请修改落地表名:' + str, 'error')
                                } else {
                                    let dslIds = [];
                                    if (this.dslIdString.length > 0) {
                                        for (let j = 0; j < this.dslIdString.length; j++) {
                                            if (this.dslIdString[j].tableId === this.tableId) {
                                                this.dslIdString.splice(j, 1);
                                                j--
                                            }
                                        }
                                    }
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i].usedflag === true) {
                                            if (dslIds.indexOf(data[i].dsl_id) === -1) {
                                                dslIds.push(data[i].dsl_id);
                                            }
                                            database[data[i].dsl_id] = data[i].dsl_name
                                        }
                                    }
                                    if (dslIds.length !== 0) {
                                        this.dslIdString.push({
                                            dslIds: dslIds,
                                            tableId: this.tableId,
                                            hyren_name: str,
                                            new_name: this.digForm.hyren_name
                                        });
                                        this.dialogChooseDestination = false;
                                        this.ruleForm.ex_destinationData[this.dataExtractypeindex].table_setting = true;
                                        this.ruleForm.ex_destinationData[this.dataExtractypeindex].store_name = Object.values(database);
                                    } else {
                                        this.open();
                                    }
                                }
                            }
                        })
                    }
                })
            },
            open() {
                this.$Msg.customizTitle('请至少选择一个存储目的地', 'error')
            },
            getRowKeys(row) {
                return row.dsl_id;
            },

            //
            //选择目的地弹框全选
            Allis_destinationFun(items, e) {
                let that = this;
                items.forEach((item, j) => {
                    if (e) {
                        item.usedflag = true;
                    } else {
                        item.usedflag = false;
                    }
                });
            },
            // 选择目的地弹框选择某一个
            destination_evercheck(val, name) {
                if (val == true) {
                    for (let i = 0; i < this.destinationData.length; i++) {
                        if (this.destinationData[i].dsl_name == name) {
                            this.destinationData[i].usedflag = true;
                        }
                    }
                } else {
                    for (let i = 0; i < this.destinationData.length; i++) {
                        if (this.destinationData[i].dsl_name == name) {
                            this.destinationData[i].usedflag = false;
                        }
                    }
                }
            },
            // 全表设置目的地
            AllSettingDestinationFun() {
                this.dialogAllChooseDestination = true
                //    AlldestinationData
                this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agent/stodestconf/getStorageDataByTarget").then(res => {
                    //addTaskAllFun.getStorageData().then(res => {
                    let arr = JSON.parse(JSON.stringify(res.data));
                    let data = this.storeTypeData;
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].code == arr[i].store_type) {
                                arr[i].store_type = data[j].value;
                            }
                        }
                    }
                    this.AlldestinationData = arr;
                })

            },
            // 全表设置目的地确定提交
            ChooseAllDestinationSubmitFun() {
                if (this.Alldestinationchoose.length > 0) {
                    this.dslIdString.length = 0
                    let dslIds = []
                    let databaseAll = {}
                    for (let i = 0; i < this.Alldestinationchoose.length; i++) {
                        if (dslIds.indexOf(this.Alldestinationchoose[i].dsl_id) === -1) {
                            dslIds.push(this.Alldestinationchoose[i].dsl_id);
                        }
                        databaseAll[this.Alldestinationchoose[i].dsl_id] = this.Alldestinationchoose[i].dsl_name
                    }
                    for (let i = 0; i < this.ruleForm.ex_destinationData.length; i++) {
                        let item = this.ruleForm.ex_destinationData[i];
                        this.dslIdString.push({
                            dslIds: dslIds,
                            tableId: item.table_id,
                            hyren_name: item.is_prefix === this.IsFlag.Shi ?
                                this.datasource_number + '_' + this.classify_num + '_' + item.table_name
                                : item.table_name,
                            new_name: item.table_name
                        });
                        this.ruleForm.ex_destinationData[i].table_setting = true
                        this.ruleForm.ex_destinationData[i].store_name = Object.values(databaseAll)
                    }
                    this.dialogAllChooseDestination = false
                    let data = JSON.parse(JSON.stringify(this.ruleForm.ex_destinationData));
                    for (let i = 0; i < data.length; i++) {
                        for (let dslId of dslIds) {
                          let params = {};
                          params["dslId"] = dslId;
                          params["tableId"] = data[i].table_id;
                          // 检查字段映射关系是否未配置
                          this.getColumnStoInfo(params, data[i].store_name, false);
                        }
                      }
                } else {
                    this.open()
                }
            }
            ,
            // 全表设置目的地全选
            AllhandleSelectionChange(item) {
                this.Alldestinationchoose = item
            }
            ,
            // 全表设置目的地单个勾选
            allselectD(item) {
                this.Alldestinationchoose = item
            }
            ,
            // 立即启动
            startButtonFun() {
                this.finishDialogVisible = true
                let date = new Date()
                this.etl_date = date.getFullYear() + '' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '' + (date.getDate() > 9 ? date.getDate() : '0' + (date.getDate()))
            }
            ,
            finishSubmit() {
                this.startButton = true
                this.next('ruleForm')
            }
            ,
            loadAll(row, column, event) {
                const arr = [];
                row.column_type_mapping.forEach(item => {
                    const obj = {};
                    obj.value = item;
                    arr.push(obj);
                })
                this.columnTarTypes = arr;
            }
            ,
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.columnTarTypes);
            }
            ,
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            }
            ,
            clearSelect() {
                this.$refs.elAuto.activated = true;
                this.$forceUpdate();
            }
            ,
        }
    };
</script>

<style scoped>
    .el-form-item__content .el-input-group {
        vertical-align: middle;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

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

    .allclickColor {
        color: #2E3033;
        font-weight: bold;
    }

    .locationcenter {
        text-align: center;
        margin-top: 5px;
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

    .alltable >>> .el-dialog__body {
        padding: 10px 20px 20px;
    }

    .topcolumename {
        display: inline-block;
        background: #f3eded;
        color: #ec0b35;
        padding: 2px;
    }

    .addline {
        margin: 5px 0;
    }

    .nocontent {
        text-align: center !important;
        font-weight: normal;
        border-right: 0;
    }

    .alldays {
        text-align: center;
        margin-top: 10px;
    }

    .alldays >>> .el-input--medium .el-input__inner {
        height: 24px !important;
    }

    .settingbtn {
        color: #409eff;
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
    }

    .steps5 >>> .el-form-item {
        margin-bottom: 0 !important;
    }

    .steps5 >>> .el-form-item__content::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        display: inline-block;
        position: absolute;
        left: -5%;
    }

    .steps5 >>> .el-icon-question:before {
        content: "" !important;
    }

    .steps5 >>> .el-icon-question:after {
        content: "\E7A4" !important;
        margin-left: 10px;
    }

    .steps5 >>> tr > td {
        padding: 0;
    }

    .steps5 >>> tr > td > .cell {
        padding: 11px 10px;
    }

    .steps5 >>> .el-form-item__error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 6px;
        position: absolute;
        top: 86%;
        left: 1%;
    }

    .cleanbtn {
        width: 100%;
        background: #f3f1f1;
        padding: 10px 0;
        overflow: hidden;
        position: relative;
    }

    .cleanbtn > button {
        float: right;
        margin: 0 10px;
    }

    .fetch {
        overflow-y: hidden;
    }
</style>
