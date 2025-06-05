<template>
  <div class="standardSource h100 d-flex" style="width: 100%" v-if="checksource">
    <ByTree :data="metaDataTree" :accordion="true" :type="'datafenceng'"  :default-props="treeProps" :drop-list="dropList"  @detail="detail"  @logDetail="logDetail"  @contextmenu="treeCheck"   @add="add" ></ByTree>
    <div  v-if="taskIndex" style="width: 100%">
      <div class="flex-1 px-20 overflow-auto" style="margin-top: 20px">
        <!--    <ByHeaderSlice :title="HeadersTitle"></ByHeaderSlice>-->
        <div  style="height:22px;">
          <ByHeaderSlice :title="(sourceName ?sourceName+' - ' : '')+ HeadersTitle" style="float: left"></ByHeaderSlice>
          <el-button type="primary" size="small" v-if="dsTypeboole" v-debounce @click="inputMateDataClick" class="goBackBtn button">导入元数据</el-button>
          <el-button type="primary" size="small" v-else v-debounce @click="checkSourceData" class="goBackBtn button">元数据检核</el-button>
        </div>

        <el-divider></el-divider>
        <div v-if="HeadersTitle ===  '采集任务配置'">
          <el-button @click="addtask1 " type="primary" size="small" style="float: right;margin-right:10px;margin-bottom: 10px" v-if="source_id!== null && source_id!== '' && !dsTypeboole">新增任务</el-button>
          <ByTable v-if="HeadersTitle ===  '采集任务配置' && taskData.length > 0" :table-data="taskData" :column-arr="taskColumn"
                   @operateItem="operateHandler"  :pagination="taskPagination"  @sizeChange="taskSizeChange" @currentChange="taskCurrentChange" ></ByTable>
          <ByEmpty v-else></ByEmpty>
        </div>

        <div style="float:left; width: 100%">
              <span v-if="HeadersTitle ===  '表信息' || HeadersTitle ===  '存储过程'||
              HeadersTitle === '视图' || HeadersTitle === '物化视图' " style="width: 100%" >
                <el-button @click="addtask1 " type="primary" size="small" style="float: right;margin-right:10px;margin-bottom: 10px" v-if="source_id!== null && source_id!== ''  && !dsTypeboole">新增任务</el-button>
                <ByTable v-if="taskData.length > 0" :table-data="taskData" :column-arr="taskColumn"
                         @operateItem="operateHandler"  :pagination="taskPagination"  @sizeChange="taskSizeChange" @currentChange="taskCurrentChange" ></ByTable>
                <ByEmpty v-else style="width: 100%"></ByEmpty>
              </span>
<!--          <el-tabs  v-if="HeadersTitle ===  '元数据配置'" v-model="activeName"  type="border-card"  @tab-click="handleClick">-->
<!--            <el-tab-pane label="已选中" name="selected">-->
<!--              <ByQuickSearch :form-items="quickSearchItem"  @search="selectedSearch" ></ByQuickSearch>-->
<!--              <ByTable :table-data="tableData" :column-arr="tableColumn" @handleMultiple="tableHandleMultiple1"-->
<!--                       :pagination="tablePagination"  @sizeChange="tableSizeChange" @currentChange="tableCurrentChange"></ByTable>-->
<!--              &lt;!&ndash;          <ByEmpty v-else></ByEmpty>&ndash;&gt;-->
<!--            </el-tab-pane>-->
<!--            <el-tab-pane label="未选中" name="unchecked" v-if="tabCheck">-->
<!--              &lt;!&ndash;          <div style="width: 100%">&ndash;&gt;-->
<!--              <ByQuickSearch :form-items="quickSearchItem" :extra-button="extraButton"@search="search" @btnClick="btnClick"></ByQuickSearch>-->
<!--              <ByTable  :table-data="tableData" :column-arr="tableColumn" @handleMultiple="tableHandleMultiple"-->
<!--                        :pagination="tablePagination" @sizeChange="tableSizeChange1" @currentChange="tableCurrentChange1"></ByTable>-->
<!--              &lt;!&ndash;            <ByEmpty v-else style="width: 100%"></ByEmpty>&ndash;&gt;-->
<!--              &lt;!&ndash;          </div>&ndash;&gt;-->
<!--              <div style="margin-top: 20px;margin-right: 10px">-->
<!--                <el-button @click="taskConfigTask" type="primary" size="small" style="float:right;">保存并配置采集任务</el-button>-->
<!--              </div>-->
<!--            </el-tab-pane>-->
<!--          </el-tabs>-->
          <!--      <el-button v-if=" HeadersTitle ===  '元数据配置' " style="float:right;">导入元数据</el-button>-->
        </div>

      </div>

      <!--  新增数据源弹框-->
      <ByModel :model-width="'50%'" :model-title="title" :visible.sync="dataSourceModel" @close="closeModel">
        <ByTable v-if="dataSourceData.length > 0" :table-data="dataSourceData" :column-arr="dataSourceColumn"  :pagination="pagination"
                 @sizeChange="sizeChange" @currentChange="currentChange"  @handleMultiple="sorceHandleMultiple"></ByTable>
        <ByEmpty v-else></ByEmpty>
        <div slot="modalFoot">
          <el-button type="primary" @click="saveDataSource">保存</el-button>
          <el-button type="primary" @click="openDataSource">新建数据源</el-button>
          <el-button   @click="closeModel" >取消</el-button>
        </div>
      </ByModel>
      <!--  新增数据源弹框2-->
      <ByModel :model-width="'30%'" :model-title="title" :visible.sync="dataSourceModel2" @close="closeModel2">
        <ByModelForm :form-data="dataSourceData2" :form-items="dataSourceitem" :form-config="dataSourceConfig" :form-rules="dataSourceRule"></ByModelForm>
        <div slot="modalFoot">
          <el-button type="primary" @click="saveMetaDataSource">保存</el-button>
          <el-button  @click="closeModel2" >取消</el-button>
        </div>
      </ByModel>

      <!--  新增任务-->
      <ByModel :model-width="'40%'" :model-title="'新增任务'" :visible.sync="taskModel" @close="taskcloseModel">
        <ByModelForm :form-data="taskFromData" :form-items="taskFromItem" :form-config="taskConfig" :form-rules="taskRule" ref="addTask"></ByModelForm>
        <div slot="modalFoot">
          <el-button type="primary" @click="saveTask">保存</el-button>
          <el-button  @click="taskcloseModel" >取消</el-button>
          <el-button type="primary" style="width: 115px" @click="saveAndJob" v-if="true && tag" >保存并配置作业</el-button>

        </div>
      </ByModel>
      <!--  导入元数据-->
      <ByModel :model-width="'30%'" :model-title="'导入元数据'" :visible.sync="importMeatDataModel" @close="importMeatDataModel = false">
        <ByModelForm :form-data="importMetaData" :form-items="importMetaItem" :form-config="importMetaConfig" :form-rules="importMetaRule" @fileType="fileTypeClick" ></ByModelForm>
        <el-row>
          <el-col  :offset="7" :span="5">
            <!--    只能上传Excel 类型-->
            <el-upload ref="upload" v-if=" importMetaData.file_type === '0' "  action="your-upload-url"  accept=".xls, .xlsx" :fileList="fileList"  :auto-upload="false" :limit="1"
                       :on-exceed="handleExceed" :on-change="handleChange" :before-remove="beforeRemove"   >
              <el-button   size="small" type="primary" >上传Excel</el-button>
            </el-upload>
              <!--    只能上传DDL 类型-->
            <el-upload ref="upload" v-else  :fileList="fileList" :auto-upload="false" :limit="1"
                       :on-exceed="handleExceed" :on-change="handleChangeDDL" :before-remove="beforeRemove" :before-upload="handleUpload"  >
              <el-button   size="small" type="primary">上传DDL</el-button>
            </el-upload>
          </el-col>
          <el-col :offset="1"  :span="5">
            <el-button @click="download" size="small" type="primary">下载Excel模板</el-button>
          </el-col>
        </el-row>

        <div slot="modalFoot">
          <el-button  @click="importMeatDataModel = false " >取消</el-button>
          <el-button type="primary" @click="imput">导入</el-button>
        </div>
      </ByModel>

      <!--  选择以有任务 -->
      <ByModel :model-width="'30%'" :model-title="'保存并配置采集任务 '" :visible.sync="taskConfigTaskModel" @close="taskConfigTaskModel = false">
        <ByModelForm :form-data="taskCheckFromData" :form-items="taskCheckFromItem" :form-config="taskCheckConfig" :form-rules="taskCheckRule"  ref="taskChech" ></ByModelForm>
        <div slot="modalFoot">
          <el-button type="primary" @click="saveCheckTask">保存</el-button>
          <el-button  @click="taskConfigTaskModel = false " >取消</el-button>
          <el-button type="primary" @click="addtask ">新增任务</el-button>
        </div>
      </ByModel>
    </div>
    <div v-else>
      <task-index  :is-add="isAdd" :source_id="source_id" :dsl-id="dslId" :task-data="taskindexData" @goBack="goBack" @saveConfigTask="saveConfigTask" ref="taskIndex"></task-index>
    </div>
    <div>
      <ByModel :visible.sync="taskConfigModel" :model-title="'作业配置'" :model-width="'80%'" @close="taskConfigModel = false">
        <ByModelForm :form-data="taskCOnfigData" :form-config="taskConfigConfig" :form-items="taskConfigItem" :form-rules="taskConfigRule"
                     @etlSysCd="getSubSysCd" @subSysCd="setSubSysCd" @dispFreq="dispFreq"  ref="taskCon"> </ByModelForm>

        <div slot="modalFoot">
          <el-button  @click="taskConfigModel = false " >取消</el-button>
          <el-button type="primary" @click="saveJobData">生成作业</el-button>
        </div>
      </ByModel>

      <ByModel :visible.sync="saveEtlModel" :model-title="'新增工程'" :model-width="'40%'" @close="saveEtlModel = false">
        <ByModelForm :form-data="saveEtlData" :form-config="saveEtlConfig" :form-items="saveEtlItem" :form-rules="saveEtlRule"
                     @etlSysCd="getSubSysCd" @dispFreq="dispFreq"  ref="saveEtl"> </ByModelForm>

        <div slot="modalFoot">
          <el-button  @click="saveEtlModel = false " >取消</el-button>
          <el-button type="primary" @click="saveEtl">生成作业</el-button>
        </div>
      </ByModel>

      <!-- 添加/修改任务模态框 -->
      <ByModel
          :model-title="'添加任务'"
          :visible.sync="addSubSys"
          :model-width="'40%'"
          @close="addSubSys = false"
      >
        <ByModelForm :form-data="subSysForm" :form-items="subSysFormItem"
                     :form-rules="subSysFormRules" :form-config="subSysFormConfig" ref="subSysFromRef">

        </ByModelForm>
        <template slot="modalFoot">
          <el-button @click="addSubSys = false">取 消</el-button>
          <el-button type="primary" @click="saveSubSysCd" v-debounce
          >确 定</el-button
          >
        </template>
      </ByModel>

    </div>
  </div>
  <div v-else>
    <check-source-date :source_id="source_id" @goBack="goBack"></check-source-date>
  </div>
</template>


<script >
import ByTree from "@/components/global/ByTree.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByTable from "@/components/global/ByTable.vue";
import {
  dataSourceColumn,
  dataSourceConfig,
  dataSourceitem,subSysFormItem,subSysFormRules,subSysFormConfig,
  dataSourceRule, importMetaConfig, importMetaItem, importMetaRule,
  quickSearchItem, saveEtlConfig, saveEtlItem, saveEtlRule,
  tableColumn, taskCheckConfig, taskCheckFromItem, taskCheckRule,
  taskColumn, taskConfig, taskConfigConfig, taskConfigItem, taskConfigRule, taskFromItem, taskRule
} from "./mock";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import TaskIndex from "@/bizpot/M/metaTask/taskIndex.vue";
import {
  execGetByControllerMapping, execGetByControllerMappingName,
  execPostByControllerAllMappingNameParams,
  uploadFileAllMappingName
} from "@/utils/executeRequest";
import ByEmpty from "@/components/global/ByEmpty.vue";
import CheckSourceDate from "@/bizpot/M/metaTask/checkSourceDate.vue";

export default{
  computed: {
    taskCheckRule() {
      return taskCheckRule
    }
  },
  components: {CheckSourceDate, ByEmpty, TaskIndex, ByQuickSearch, ByModelForm, ByTable, ByModel, ByHeaderSlice, ByTree},
  data(){
    return{
      checksource: true,
      isAdd: true,
      tag: true,
      subSysFormItem,
      subSysFormRules,
      subSysFormConfig,
      subSysForm: {},
      saveEtlRule,
      saveEtlConfig,
      saveEtlItem,
      saveEtlData: {},
      saveEtlModel: false,
      taskTableData: [],
      taskConfigRule,
      tabCheck: true,
      importMetaRule,
      importMetaConfig,
      importMetaItem,
      importMetaData: [],
      dslId : '',
      taskConfigConfig,
      taskConfigItem,
      taskCOnfigData: {},
      fileList:[],
      taskConfigModel: false,
      taskCheckFromData: {},
      taskCheckConfig,
      taskCheckFromItem,
      obj_list: [],
      taskindexData: {},
      importMeatDataModel: false,
      objType: '',
      taskConfigTaskModel: false,
      source_id: '',
      taskIndex: true,
      taskRule,
      taskConfig,
      taskFromItem,
      taskFromData: {},
      taskModel: false,
      dsTypeboole: false, // 元数据源来源 0-存储层  1-导入
      quickSearchItem,
      activeName: 'unchecked',
      taskData: [],
      taskColumn,
      HeadersTitle: '采集任务配置',
      tableColumn,
      dataSourceRule,
      dataSourceitem,
      dataSourceConfig,
      dataSourceColumn,
      title: '',
      sorceList: [],
      tableData: [],
      dataSourceData : [],
      dataSourceData2: {},
      dataSourceModel: false,
      dataSourceModel2: false,
      extraButton: [
        {
          label: '查看全表',
        }
      ],
      dropList:[
        {
          type: 'EDIT',
          label: '编辑目录'
        },
        {
          type: 'DEL',
          label: '删除目录'
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label',
      },
      sourceName: '',
      task_name: '',
      task_id: '',
      metaDataTree: [],
      metaDataSource: [],
      etlparaseparator: '@',
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      tablePagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100 ]
      },
      taskPagination:{
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      },
      addSubSys: false,
      Dispatch_Type : [],
      Dispatch_Frequency: [],
      MetaObjTypeEnum : [],
      IsFlag: [],
    }

  },
  mounted() {
    this.getMetaDataSource();
    this.getCode('MetaObjTypeEnum');
    this.getCode('Dispatch_Type');
    this.getCode('Dispatch_Frequency');
    this.getCode('Status');
    this.getCode("IsFlag")
  },
  methods:{
    getMetaDataSource(){
      let param ={
        // source_name: '',
        // ds_type: '',
        currPage: 1,
        pageSize: 999,
        showTask: 1,
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaDataSource",param).then(res =>{
        if (res && res.success){
          this.metaDataSource = res.data;
          this.setTree(res.data.pageList)
          console.log(this.metaDataTree)
        }
      })
    },
    // 查看全表 按钮
    btnClick(){
      if (this.dslId){
        this.getMetaData(this.dslId,this.objType,'');
      }else {
        this.$Msg.customizTitle("没有元数据信息，请先导入元数据信息！", "warning");
      }
    },
    // 已选中查询按钮
    selectedSearch(val){
      this.getPageByIsCol(this.source_id,'1',this.objType,val.en_name);
    },
    // 未选中查询 按钮
    search(val){
      if (this.dslId){
        this.getMetaData(this.dslId,this.objType,val.en_name);
      }else {
        this.$Msg.customizTitle("没有元数据信息，请先导入元数据信息！", "warning");
      }
    },
    goBack(){
      this.checksource = true;
      this.taskIndex = true;
      this.getMetaTask(this.source_id,this.objType);
      this.getMetaDataSource();
    },
    setOption(arrData,prop,data){
      arrData.map( item =>{
        if (item.prop === prop){
          item.options = data;
        }
      })
    },
    operateHandler(type, row){
      if (type === 'edit'){
        // alert('编辑');
        this.isAdd = false;
        this.taskIndex = false;
        row.source_name = this.sourceName;
        this.taskindexData = row;
      }else if (type === 'del'){
        // alert('删除');
        // console.log(row)
        this.taskDelete(row.task_id)
      }else if (type === 'addJob'){
        // alert("生成作业");
        this.task_name = row.task_name;
        this.task_id = row.task_id;
        this.saveConfigTask();
      }else if(type === 'isRun'){
        this.task_id = row.task_id;

        this.$confirm("确认立即执行 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
        })
            .then((res) => {
              this.isRun(row.task_id);
            })
            .catch((eer) => {
              this.$message({
                message: "已取消",
                type: "info",
              });
            });
      }
    },
    inputMateDataClick(){
      this.importMetaData = [];
      this.importMeatDataModel = true;
      this.$set(this.importMetaData,'file_type','0');
      // this.importMetaData.file_type = '0';
    },
    taskConfigTask(){
      if(this.obj_list.length !== 0){
        this.taskCheckFromData = []
        this.getMetaTask1(this.source_id,this.objType);
        this.taskConfigTaskModel = true;
      }else {
        this.$Msg.customizTitle("请先选择表！", "warning");
      }
    },
    isRun(task_id){
      this.$executeRequest.execGetByControllerAllMappingName("metaObjInfo/run",{task_id: task_id}).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("立即执行成功");
        }
      })
    },
    saveConfigTask(data,taskTableData){
      this.taskCOnfigData = {};
      this.getSysPara('hrds_m.properties');
      // this.taskTableData = taskTableData;
      this.taskConfigModel = true;
      this.getEtlSysData();

    },
    tableHandleMultiple(val){
      console.log(val);
      this.obj_list = [];
      this.obj_list = val;
    },
    tableHandleMultiple1(val){
      console.log(val);
      this.obj_list = [];
      this.obj_list = val;
    },
    sorceHandleMultiple(val){
      this.sorceList = val;
    },
    saveCheckTask(){
      this.$refs.taskChech.transferData().then(data =>{
        let dataList = [];
        this.obj_list.map(obj =>{
          let data = {
            source_id :  this.source_id,
            type :  this.objType,
            is_col : '1',
            en_name: obj.en_name,
            ch_name: obj.ch_name,
            obj_id : obj.obj_id
          }
          dataList.push(data)
        })
        let params = {
          task_id : this.taskCheckFromData.task_id,
          objList: dataList,
        }
        console.log(params);
        this.saveMetaTaskObj(params);
      }).catch(err =>{

      })
    },
    saveCheckTaskAndAddTask(task_id){
      let dataList = [];
      this.obj_list.map(obj =>{
        let data = {
          source_id :  this.source_id,
          type :  this.objType,
          is_col : '1',
          en_name: obj.en_name,
          ch_name: obj.ch_name,
          obj_id : obj.obj_id
        }
        dataList.push(data)
      })
      let params = {
        task_id : task_id,
        objList: dataList,
      }
      this.saveMetaTaskObj(params);
    },
    saveMetaTaskObj(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/metaTaskObj",params).then(res => {
        if (res && res.success){
          this.$Msg.customizTitle("新增任务成功");
          this.getMetaTask(this.source_id,this.objType);
          this.taskConfigTaskModel = false;
          // this.obj_list = [];
          this.HeadersTitle=  '采集任务配置';
          // this.getMetaTask(data.source_id);
        }
      })
    },
    handleClick(tab, event) {
      this.tablePagination.pageNum = 1;
      console.log(tab, event);
      if (tab.name === 'selected'){
        this.getPageByIsCol(this.source_id,'1',this.objType);
      }else {
        this.getMetaData(this.dslId,this.objType,'');
        this.tableData = [];
      }
    },
    addtask(){
      this.taskFromData = [];
      this.taskModel = true;
      if (this.objType){
        this.taskFromData.task_type = this.objType;
        this.setDisabled(this.taskFromItem,'task_type',true);
      }else{
        this.setDisabled(this.taskFromItem,'task_type',false);
      }
    },
    // 导入
    imput(){
      if (this.fileList.length !== 0 &&this.fileList[0].raw){
        let params = new FormData();
        params.append('source_id',this.source_id);
        if(this.fileList.length !== 0 &&this.fileList[0].raw){
          params.append('file',this.fileList[0].raw);
        }
        this.$executeRequest.uploadFileAllMappingName("/M/metaObjInfo/import",params).then(res =>{
          if (res && res.success){
            this.$Msg.customizTitle("元数据导入成功");
            this.getPageByIsCol(this.source_id,'1',this.objType);
          }
        })
      }else {
        this.$Msg.customizTitle("请先上传文件！", "warning");
      }

    },
    // 采集任务配置界面上的新增任务
    addtask1(){
      this.isAdd = true;
      this.taskindexData = {
        source_name : this.sourceName,
        task_name:'',
        task_type: '',
      };
      this.taskIndex = false;
    },
    setDisabled(arrData,prop,boolean){
      arrData.map( item =>{
        if (prop === item.prop){
          item.disabled = boolean;
        }
      })
    },
    saveMetaDataSource(){
      if (!this.dataSourceData2.source_id){
        // 新增
        let params = {
          source_name: this.dataSourceData2.source_name,
          mds_desc: '',
          ds_type: '1',
          dsl_id: '',
        };
        this.metaDataSource1(params);
      }else {
        // 编辑目录
        let params = {
          source_id: this.dataSourceData2.source_id,
          source_name: this.dataSourceData2.source_name,
          mds_desc:  this.dataSourceData2.mds_desc,
          ds_type:  this.dataSourceData2.ds_type,
          dsl_id:  this.dataSourceData2.dsl_id,
        };
        this.editMetaDataSource1(params);
      }

    },
    getMetaTask(source_id,task_type){
      let param ={
        source_id: source_id,
        task_type: task_type || '',
        task_name: '',
        currPage: this.taskPagination.pageNum,
        pageSize: this.taskPagination.pageSize,
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/",param).then(res =>{
        if (res && res.success){
          if (res.data.pageList){
            res.data.pageList.map( item =>{
              item.created_dateTime  =  item.created_date +' ' + item.created_time;
              this.MetaObjTypeEnum.map(type =>{
                    if (item.task_type === type.value){
                      item.typeLabel = type.label
                    }
                  }
              )
              this.IsFlag.map(flag =>{
                if (flag.value === item.etlStatus){
                  item.etlStatusValue = flag.label;
                }
              })
            })
          }
          this.taskData = res.data.pageList;
          this.taskPagination.total = res.data.totalSize;
        }
      })
    },
    getMetaTask1(source_id,task_type){
      let param ={
        source_id: source_id,
        task_type: task_type,
        task_name: '',
        currPage: 1,
        pageSize: 999,
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/",param).then(res =>{
        if (res && res.success){
          let taskData = [];
          res.data.pageList.map( item =>{
            let data = {
              label: item.task_name,
              value: item.task_id,
              code: item.task_id,
            }
            taskData.push(data);
          })
          this.setOption(this.taskCheckFromItem,'task_id',taskData);
        }
      })
    },
    saveAndJob(){
      this.$refs.addTask.transferData().then(data =>{
        this.saveTask();
        // this.task_name = row.task_name;
        // this.task_id = row.task_id;
        this.saveConfigTask();
      }).catch(err =>{

      })

    },
    saveDataSource(){
      if (this.sorceList.length > 0){
        let tag = true;
        this.sorceList.map( sorce =>{
          if (!sorce.source_name){
            tag  = false;
            this.$Msg.customizTitle("数据源别名不能为空！", "warning");
          }
          console.log(sorce)
          sorce.mds_desc = sorce.dsl_remark;
          // 数据源来源 0-数据库直连  1-外部数据导入
          sorce.ds_type = '0';
        })
        if(tag){
          this.batchMetaDataSource1(this.sorceList);
        }
      }else {
        this.$Msg.customizTitle("请先选择数据源！", "warning");
      }

    },
    // 作业调度工程编号
    getEtlSysData(){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/B/dataCollectionO/agent/startwayconf/getEtlSysData").then(res =>{
        if (res && res.success){
          console.log(res.data)
          res.data.map(item =>{
            item.value = item.etl_sys_id;
            item.label = item.etl_sys_cd;
          })
          let data = [{
            label: '新增工程',
            options: [{
              value : 'add',
              label : '新增工程'
            }]
          },{
            label: '可选工程',
            options: res.data
          }
          ]
          console.log(data)
          this.setOption(this.taskConfigItem,'etl_sys_id',data);
          this.setOption(this.saveEtlItem,'pre_etl_sys_ids',res.data);
          this.setOption(this.subSysFormItem,'etl_sys_id',res.data);
        }
      })
    },
    // 调度触发方式
    dispFreq(){
      if (this.taskCOnfigData.dispatching_mode !== 'D'){
        this.setConceal(this.taskConfigItem,'upstream_operation','false');
        this.setConceal(this.taskConfigItem,'dispatching_time','true');
        this.setConceal(this.taskConfigItem,'dispatching_timedrift','true');
      }else {
        this.setConceal(this.taskConfigItem,'upstream_operation','true');
        this.setConceal(this.taskConfigItem,'dispatching_time','false');
        this.setConceal(this.taskConfigItem,'dispatching_timedrift','false');
        this.getSearchEtlJob(this.taskCOnfigData.etl_sys_id)
      }
    },
    download(){
      this.$executeRequest
          .downloadGetFileAllMappingNameParams(
              "/M/metaObjInfo/download"
          )
          .then((res) => {
            // if (res ){
            const blob = res;
            let fileName = "标准元信息模板.xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              // 兼容IE10
              navigator.msSaveBlob(blob, fileName);
            } else {
              //  chrome/firefox
              let aTag = document.createElement("a");
              // document.body.appendChild(aTag);
              aTag.download = fileName;
              aTag.href = URL.createObjectURL(blob);
              if (aTag.all) {
                aTag.click();
              } else {
                //  兼容firefox
                const evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                aTag.dispatchEvent(evt);
              }
              URL.revokeObjectURL(aTag.href);
            }
            // }
          });
    },
    setConceal(data,prop,boole){
      data.map(item =>{
        if (item.prop === prop){
          item.conceal = boole;
        }
      })
    },
    saveJobData(task_name,task_id){
      this.$refs.taskCon.transferData().then(data =>{
        let task_name = this.task_name;
        let task_id = this.task_id;
        let params = {};
        let etl_job_def = {};
        let etl_dependency = {};
        // etl_job_def["etl_job_id"] = this.taskCheckFromData.etl_job_id;  //作业ID
        // params["etl_sys_cd"] = this.sys_cd;
        etl_job_def["etl_sys_id"] = this.taskCOnfigData.etl_sys_id;
        // params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
        etl_job_def["sub_sys_id"] = this.taskCOnfigData.sub_sys_id; //子系统主键
        etl_job_def["etl_job"] = task_name+'_'+task_id; //作业名称 取任务名称
        etl_job_def["etl_job_desc"] = this.taskCOnfigData.etl_job_desc; //描述
        etl_job_def["pro_type"] = 'SHELL'; // 作业程序类型 默认为SHELL
        etl_job_def["pro_dic"] = this.taskCOnfigData.pro_dic; // 作业程序目录
        etl_job_def["pro_name"] = this.taskCOnfigData.pro_name; // 作业程序名称
        etl_job_def["pro_para"] = task_id; // 作业程序参数
        etl_job_def["log_dic"] = this.taskCOnfigData.log_dic; //日志目录
        etl_job_def["disp_freq"] = this.taskCOnfigData.dispatching_frequency; //调度频率

        etl_job_def["disp_offset"] = this.taskCOnfigData.dispatching_timedrift; //调度频率时间位移
        etl_job_def["disp_type"] = this.taskCOnfigData.dispatching_mode; //调度触发方式
        if (this.taskCOnfigData.database_pad == "") {
          this.$set(this.taskCOnfigData,'job_priority',null);
        }
        etl_job_def["job_priority"] = this.taskCOnfigData.database_pad; //作业优先级
        etl_job_def["job_eff_flag"] = 'Y'; //作业有效标志 默认为有效 Y 无效N 空跑 V
        etl_job_def["comments"] = ''; //备注信息
        etl_job_def["disp_time"] = this.taskCOnfigData.dispatching_time;//调度触发时间
        etl_job_def["today_disp"] = 'Y'; // 当天是否调度  默认为Y
        etl_job_def["success_job"] = '';
        etl_job_def["fail_job"] = ''; //失败后续作业
        etl_job_def["job_datasource"] = '10';//作业程序类型
        params["etl_job_def"] = etl_job_def;
        etl_dependency["etl_job_id"] = this.taskCOnfigData.etl_job_id;
        etl_dependency["etl_sys_id"] = this.taskCOnfigData.etl_sys_id;
        etl_dependency["etl_job"] = task_name; //作业名称 取任务名称
        etl_dependency["pre_etl_sys_id"] = '';
        etl_dependency["status"] = 'T'; // 依赖是否有效
        params["etl_dependency"] = etl_dependency;
        params["pre_etl_job_ids"] = this.taskCOnfigData.upstream_operation || []; //依赖作业 上游作业
        params["old_disp_freq"] = '';
        params["old_pre_etl_job_ids"] = '';
        params["old_dispatch_type"] = '';
        console.log(params)
        this.$executeRequest.execPostByControllerAllMappingName("C/etlMage/jobconfig/saveEtlJobDef", params)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("作业生成成功", "success");
                this.taskConfigModel = false;
              }
            });
      }).catch(err =>{

      })
    },
    saveJobDataToDatabase(params){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/B/collectmonitor/agent/startwayconf/saveJobDataToDatabase",params)
          .then(res =>{
            if (res && res.success){

            }
          })
    },
    getSearchEtlJob(etl_sys_id){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/B/dataCollectionO/otherApi/searchEtlJob",
          {etl_sys_id : etl_sys_id}).then(res =>{
        if (res && res.success){
          res.data.map( item =>{
            item.label = item.etl_job;
            item.value = item.etl_job_id;
          })
          this.setOption(this.taskConfigItem,'upstream_operation',res.data);
        }
      })
    },
    checkSourceData(){
      this.checksource = false;
    },
    getSysPara(paraType){
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaDataSource/getSysPara",{paraType : paraType}).then(res =>{
        if (res && res.success){
          this.$set(this.taskCOnfigData,'pro_dic',res.data.metadata_coll_script_path)
          this.$set(this.taskCOnfigData,'pro_name',res.data.metadata_coll_script_name)
          this.$set(this.taskCOnfigData,'log_dic',res.data.metadata_coll_log_path)
          // this.taskCOnfigData.pro_dic =  res.data.metadata_coll_script_path;
          // this.taskCOnfigData.pro_name =  res.data.metadata_coll_script_name;
          // this.taskCOnfigData.log_dic =  res.data.metadata_coll_log_path;
        }
      })
    },
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
    },

    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
    },

    //表格分页
    tableCurrentChange(val) {
      this.tablePagination.pageNum = val;
    },


    tableSizeChange(val) {
      this.tablePagination.pageNum = 1;
      this.tablePagination.pageSize = val;
    },

    //表格分页
    taskCurrentChange(val) {
      this.taskPagination.pageNum = val;
      this.getMetaTask(this.source_id,this.objType);
    },


    taskSizeChange(val) {
      this.taskPagination.pageNum = 1;
      this.taskPagination.pageSize = val;
      this.getMetaTask(this.source_id,this.objType);
    },

    //表格分页
    tableCurrentChange1(val) {
      this.tablePagination.pageNum = val;
      this.getMetaData(this.dslId,this.objType,'');
    },

    tableSizeChange1(val) {
      this.tablePagination.pageNum = 1;
      this.tablePagination.pageSize = val;
      this.getMetaData(this.dslId,this.objType,'');
    },

    detail(data){
      this.taskIndex = true;
      data.source_name = this.sourceName;
      console.log(data);
      // alert("点击文件")
      this.isAdd = false;
      this.taskIndex = false;
      this.taskindexData = data;
      this.$refs.taskIndex.getMetaTaskObj1(data.task_id);
    },
    getCode(category){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/M/code/getCategoryItems",{category : category}).then(res =>{
        if (res && res.success){
          res.data.map(item =>{
            item.label = item.value
            item.value  = item.code
          })
          if (category === 'Dispatch_Type'){
            let data = [];
            res.data.map(type =>{
              if (type.code !== 'B' && type.code !== 'A'){
                data.push(type);
              }
            })
            this.setOption(this.taskConfigItem,'dispatching_mode',data);
          }
          if (category === 'Dispatch_Frequency'){
            this.setOption(this.taskConfigItem,'dispatching_frequency',res.data);
          }
          if('MetaObjTypeEnum' ===category ){
            this.MetaObjTypeEnum = res.data;
          }
          if ('Status' === category){
            this.setOption(this.saveEtlItem,'status',res.data)
          }
          if('IsFlag' ===category){
            this.IsFlag = res.data;
          }

        }
      })
    },
    saveTask(){
      this.$refs.addTask.transferData().then(data =>{
        let params = {
          task_type: this.taskFromData.task_type,
          task_name: this.taskFromData.task_name,
          source_id: this.source_id
        }
        console.log(params);
        this.saveMetaTask(params);
      }).catch(err =>{

      })
    },
    taskDelete(id){
      this.$executeRequest.execDeleteByControllerMappingName("/metaTask/"+id).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("删除任务成功");
          this.getMetaTask(this.source_id,this.objType);
        }
      })
    },
    saveMetaTask(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/",params).then(res =>{
        if(res && res.success){
          this.task_id = res.data.task_id;
          this.task_name = res.data.task_name;
          this.$Msg.customizTitle("新增任务成功");
          this.getMetaTask(this.source_id,this.objType);
          this.getMetaDataSource();
          this.taskConfigTaskModel = false;
          this.taskModel = false;
          if(this.obj_list && this.obj_list.length > 0){
            this.saveCheckTaskAndAddTask(res.data.task_id)
          }
        }
      })

    },
    logDetail(data){
      // 类型
      // TBL("0","表","59","元数据对象类型"),
      // VIEW("1","视图","59","元数据对象类型"),
      // PROC("2","存储过程","59","元数据对象类型"),
      // METER_VIEW("3","物化视图","59","元数据对象类型")
      this.taskIndex = true;
      // 判断 元数据来源  0-存储层  1-导入
      if (data.ds_type === '1'){
        this.dsTypeboole =  true;
      }else if(data.ds_type === '0'){
        this.dsTypeboole =  false;
      }
      this.sourceName = data.source_name;
      this.source_id =  data.source_id;
      // alert("点击目录")
      if(data.value ){
        // this.HeadersTitle = '元数据配置';
        this.ds_type = data.ds_type;
        this.tableData = [];
        if (data.value === 'tblTaskQueryVoList'){
          // alert("表信息")
          this.HeadersTitle = '表信息';
          this.objType = '0';
          this.getMetaTask(data.source_id,"0");
          this.ResetRablePagination();
        }else if (data.value === 'procTaskQueryVoList'){
          // alert("存储过程")
          this.HeadersTitle = '存储过程';
          this.objType = '2';
          this.getMetaTask(data.source_id,"2");
          this.ResetRablePagination();
        }else if (data.value === 'viewTaskQueryVoList'){
          // alert("视图")
          this.HeadersTitle = '视图';
          this.objType = '1';
          this.getMetaTask(data.source_id,"1");
          this.ResetRablePagination();
        }else if (data.value === 'meterViewTaskQueryVoList'){
          // alert("物化视图")
          this.HeadersTitle = '物化视图';
          this.objType = '3';
          this.getMetaTask(data.source_id,"3");
          this.ResetRablePagination();
        }

      }else if(data.source_id) {
        // alert("点击数据源 ")
        this.source_id = data.source_id;
        this.HeadersTitle=  '采集任务配置';
        this.objType = '';
        this.getMetaTask(data.source_id);
      }
      if(data.dsl_id){
        this.activeName = 'unchecked';
        this.tabCheck = true;
        this.dslId = data.dsl_id;
      }else {
        this.activeName = 'selected';
        this.tabCheck = false;
        this.dslId = '';
        this.getPageByIsCol(this.source_id,'1',this.objType);
      }


    },
    ResetRablePagination(){
      this.tablePagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100 ]
      }
    },
    add(node){
      console.log(node)
      this.dataSourceModel = true;
      this.title = '新增数据源';
      this.searchDataStore();

    },
    getSubSysCd(){
      // this.taskCOnfigData.etl_sys_cd
      // console.log(this.taskCOnfigData.etl_sys_cd)
      this.setOption(this.taskConfigItem,'sub_sys_id',[]);
      this.$set(this.taskCOnfigData,'sub_sys_id','');
      this.getEtlSubSysData(this.taskCOnfigData.etl_sys_id);
    },
    getEtlSubSysData(id){
      if (id  === 'add'){
        this.saveEtlData = {};
        this.taskCOnfigData.etl_sys_id = '';
        // alert("新增工程")
        this.saveEtlModel = true;
      }else {
        this.$executeRequest.execPostByControllerAllMappingNameParams("/B/dataCollectionO/agent/startwayconf/getEtlSubSysData",{etl_sys_id : id}).then(res =>{
          if (res && res.success){
            console.log(res.data)
            res.data.map(item =>{
              item.value = item.sub_sys_id;
              item.label = item.sub_sys_cd;
            })
            let data = [{
              label: '新增任务',
              options: [{
                value : 'add',
                label : '新增任务'
              }]
            },{
              label: '可选任务',
              options: res.data
            }
            ]
            this.setOption(this.taskConfigItem,'sub_sys_id',data)
          }
        })
      }

    },
    setSubSysCd(){
      if (this.taskCOnfigData.sub_sys_id === 'add'){
        this.subSysForm = {};
        this.$set(this.taskCOnfigData,'sub_sys_id','');
        if (this.taskCOnfigData.etl_sys_id !== '' && this.taskCOnfigData.etl_sys_id !== undefined && this.taskCOnfigData.etl_sys_id !== null){
          this.$set(this.subSysForm,'etl_sys_id',this.taskCOnfigData.etl_sys_id);
          this.addSubSys = true;
        }else {
          this.$Msg.customizTitle("请先选择工程信息！", "warning");
        }
      }
    },
    //模态框新增保存按钮
    saveSubSysCd(formName) {
      this.$refs.subSysFromRef.transferData().then( data =>{
        let params = {};
        params["etl_sys_id"] = this.subSysForm.etl_sys_id;
        params["sub_sys_cd"] = this.subSysForm.sub_sys_cd;
        params["sub_sys_desc"] = this.subSysForm.sub_sys_desc;
        params["comments"] = this.subSysForm.comments;
        this.$executeRequest.execPostByControllerAllMappingNameParams('/C/etlMage/jobconfig/saveEtlSubSys',params).then(res => {
          if (res && res.success) {
            this.getEtlSubSysData(this.taskCOnfigData.etl_sys_id);
            this.$Msg.customizTitle("保存成功", "success");
            this.addSubSys = false;
          }
        })
      }).catch(err =>{

      })

    },
    saveEtl(){
      this.$refs.saveEtl.transferData().then(value =>{
        let params = {};
        params["etl_sys_cd"] = this.saveEtlData.etl_sys_cd;
        params["etl_sys_name"] = this.saveEtlData.etl_sys_name;
        params["comments"] = this.saveEtlData.comments;
        params["pre_etl_sys_ids"] = this.saveEtlData.pre_etl_sys_ids;
        params["status"] = this.saveEtlData.status;
        this.$executeRequest
            .execPostByControllerAllMappingName("/C/etlMage/addEtlSys", params)
            .then((res) => {
              if (res && res.success) {
                this.saveEtlModel = false;
                this.getEtlSysData();
              }
            });
      }).catch(err =>{

      })
    },

    getPageByIsCol(source_id,is_col,type,en_name){
      let params = {
        currPage: this.tablePagination.pageNum,
        pageSize: this.tablePagination.pageSize,
        source_id: source_id,
        is_col: is_col,
        type: type,
        en_name: en_name || ''
      }
      this.$executeRequest.execPostByControllerAllMappingNameParams("/M/metaTask/metaSourceObjCache/getPageByIsCol",params).then(res =>{
        if (res && res.success){
          res.data.pageList.map(data =>{
            this.MetaObjTypeEnum.map( type =>{
              if(data.type === type.value){
                data.typeLabel = type.label
              }
            })
          })
          this.tablePagination.total = res.data.totalSize;
          this.tableData =  res.data.pageList;
        }
      })
    },
    getMetaData(dslId,objType,objName){
      let params = {
        // currPage: this.tablePagination.pageNum,
        // pageSize: this.tablePagination.pageSize,
        dslId: dslId,
        objType: objType,
        objName: objName
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaObjInfo/getMetaData",params).then(res =>{
        if (res && res.success){
          this.tablePagination.total = res.data.length;
          this.tableData =  res.data.slice(
              (this.tablePagination.pageNum - 1) * this.tablePagination.pageSize,
              this.tablePagination.pageNum * this.tablePagination.pageSize
          );
          this.tableData.map(tblData =>{
            tblData.type = this.objType;
            this.MetaObjTypeEnum.map(type =>{
              if (this.objType === type.value){
                tblData.typeLabel = type.label
              }
            })
          })
          this.tablePagination.pageSizes = [10, 50 , 100 , 500 ];
          if (res.data.length >  500){
            this.tablePagination.pageSizes.push(res.data.length )
          }
        }
      })
    },
    metaDataSource1(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/metaDataSource",params).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("新增数据源成功");
          this.getMetaDataSource();
          this.closeModel();
          this.closeModel2();
        }
      })
    },
    editMetaDataSource1(params){
      this.$executeRequest.execPutByControllerAllMappingName("/metaTask/metaDataSource",params).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("新增数据源成功");
          this.getMetaDataSource();
          this.closeModel();
          this.closeModel2();
        }
      })
    },
    batchMetaDataSource1(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/metaDataSource/batchAdd",params).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("修改成功");
          this.getMetaDataSource();
          this.closeModel();
          this.closeModel2();
        }
      })
    },
    deleteMetaDataSource(id){
      this.$executeRequest.execDeleteByControllerMappingName("/metaTask/metaDataSource/"+id).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("删除成功");
          this.getMetaDataSource();
          this.closeModel();
          this.closeModel2();
        }
      })
    },
    treeCheck(val){
      console.log(val);
      if (val.command  === "EDIT"){
        if (val.data.source_id && !val.data.task_id && val.data.source_name){
          console.log(val.data);
          this.dataSourceData2 = val.data;
          this.dataSourceModel2 = true;
        }else if (val.data.task_id){
          // alert("采集任务修改")
          this.$Msg.customizTitle("不能进行修改操作！", "warning");
        }else {
          this.$Msg.customizTitle("不能进行修改操作！", "warning");
        }

      }else if(val.command  === "DEL"){
        if (val.data.source_id && !val.data.task_id && val.data.source_name){
          // alert("删除数据源修改");
          // this.$executeRequest.execDelByControllerAllMappingName("/metaDataSource/"+ )
          this.deleteMetaDataSource(val.data.source_id);
        }else if (val.data.task_id){
          // alert("删除采集任务修改")
          this.$Msg.customizTitle("不能进行删除操作！", "warning");
        }else {
          this.$Msg.customizTitle("不能进行删除操作！", "warning");
        }
      }
    },

    closeModel(){
      this.dataSourceModel = false;
    },
    closeModel2(){
      this.dataSourceModel2 = false;
    },
    taskcloseModel(){
      this.tag = true;
      this.taskModel = false;
    },
    searchDataStore(){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/B/dataCollectionO/agent/stodestconf/getStorageDataBySource").then(res =>{
        if(res && res.success){
          this.dataSourceData = res.data
          console.log(this.dataSourceData)
        }
      })
    },
    openDataSource(){
      this.dataSourceData2 = {};
      this.dataSourceModel2 = true;
    },

    setTree(data){
      let treeData = [];
      treeData.push({
        id: 0,
        label: '添加源系统',
        expanded: false,
        type: 'add',
      });
      data.map(item =>{
        if (item.tblTaskQueryVoList){
          item.tblTaskQueryVoList.map(tabTask =>{
            tabTask.id = tabTask.task_id
            tabTask.label = tabTask.task_name;
          })
        }
        if (item.procTaskQueryVoList){
          item.procTaskQueryVoList.map(tabTask =>{
            tabTask.id = tabTask.task_id
            tabTask.label = tabTask.task_name;
          })
        }
        if (item.viewTaskQueryVoList){
          item.viewTaskQueryVoList.map(tabTask =>{
            tabTask.id = tabTask.task_id
            tabTask.label = tabTask.task_name;
          })
        }
        if (item.meterViewTaskQueryVoList){
          item.meterViewTaskQueryVoList.map(tabTask =>{
            tabTask.id = tabTask.task_id
            tabTask.label = tabTask.task_name;
          })
        }

        let data = {
          id: item.source_id,
          label: item.source_name+(item.dslName ? " 【"+item.dslName+"】" : ''),
          type : 'text',
          "source_id": item.source_id,
          "created_id": item.created_id,
          "updated_id": item.updated_id,
          "created_by": item.created_by,
          "updated_by": item.updated_by,
          "created_date": item.created_date,
          "created_time": item.created_time,
          "updated_date": item.updated_date,
          "updated_time": item.updated_time,
          "source_name": item.source_name,//数据源名称不能为空
          "dsl_id": item.dsl_id,//存储层配置ID
          "c_tbl_num": item.c_tbl_num,//已选中缓存表数量
          "c_view_num": item.c_view_num,//已选中缓存视图数量
          "c_meter_view_num": item.c_meter_view_num,//已选中缓存物化视图数量
          "c_proc_num": item.c_proc_num,//已选中缓存存储过程数量
          "mds_desc": item.mds_desc,
          "ds_type": item.ds_type,//元数据源来源 0-存储层  1-导入
          "f_tbl_num": item.f_tbl_num,//已采集正式表数量
          "f_view_num": item.f_view_num,//已采集正式视图数量
          "f_meter_view_num": item.f_meter_view_num,//已采集正式物化视图数量
          "f_proc_num": item.f_proc_num, //已采集正式存储过程数量
          children: [
            {
              id: '1',
              value: 'tblTaskQueryVoList',
              dsl_id: item.dsl_id,
              source_name: item.source_name,
              "source_id": item.source_id,
              label: '表信息 【' + (item.tblTaskQueryVoList ?item.tblTaskQueryVoList.length :  0) + '】',
              children: item.tblTaskQueryVoList,
            },
            {
              id: '2',
              value: 'procTaskQueryVoList',
              source_name: item.source_name,
              dsl_id: item.dsl_id,
              "source_id": item.source_id,
              label: '存储过程 【' + (item.procTaskQueryVoList ? item.procTaskQueryVoList.length : 0) + '】',
              children: item.procTaskQueryVoList,
            },
            {
              id: '3',
              value: 'viewTaskQueryVoList',
              source_name: item.source_name,
              dsl_id: item.dsl_id,
              "source_id": item.source_id,
              label: '视图 【' + (item.viewTaskQueryVoList ? item.viewTaskQueryVoList.length : 0) + '' + '】',
              children: item.viewTaskQueryVoList,
            },
            {
              id: '4',
              value: 'meterViewTaskQueryVoList',
              source_name: item.source_name,
              dsl_id: item.dsl_id,
              "source_id": item.source_id,
              label: '物化视图 【' + ( item.meterViewTaskQueryVoList ? item.meterViewTaskQueryVoList.length : 0) + '】',
              children: item.meterViewTaskQueryVoList,
            },
          ],
        }
        treeData.push(data);
      })
      this.metaDataTree = treeData;
    },
    handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");

    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    // 获取上传的文件详情
    handleChangeDDL(file, fileList) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'ddl') {
        this.$message.error('只能上传DDL文件');
        this.fileList = [];
      }else {
        this.fileList = fileList;
      }
    },
    beforeRemove(file, fileList){
      this.fileList = fileList
      console.log(this.fileList)
    },
    fileTypeClick(){
      this.fileList = [];
    },
    handleUpload(file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'ddl') {
        this.$message.error('只能上传DDL文件');
        return false; // 返回false可以阻止上传
      }
      return true; // 返回true表示可以继续上传
    }
  }
}
</script>

<style scoped lang="less">
.goBackBtn {
  //width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-family: SourceHanSansCNVF-Regular, SourceHanSansCNVF;
}
.button {
  float:right;
  height:32px;
  padding:0 14px;
  margin-right:10px
}
</style>