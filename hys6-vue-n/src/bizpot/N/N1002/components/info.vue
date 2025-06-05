<template>
  <div class="px-20 asset">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"></el-tab-pane>
			<el-tab-pane label="字段登记" name="second"></el-tab-pane>
    </el-tabs>
    <div class="mt-20">
      <div v-if="activeName === 'first'">
        <ByFormGroup :formData="formData" :formList="formList" :formConfig="formConfig" :formRules="formRules" ref="asset">
          <template v-slot:belong_departSlot>
             <div>
               <tree ref="tree" @checkChange="checkChange" :nodeConfig="{value:'code'}" v-model="formData['belong_depart']" placeholder="  请选择归属部门" :treeData="gsbm"></tree>
            </div>
          </template>
          <template v-slot:manage_departSlot>
             <div>
               <tree ref="tree1" @checkChange="glcheckChange" :nodeConfig="{value:'code'}" v-model="formData['manage_depart']" placeholder="  请选择管理部门" :treeData="gsbm"></tree>
            </div>
          </template>
          <template v-slot:belong_bySlot>
             <div>
               <tree1 ref="tree2" @checkChange="rcheckChange" :nodeConfig="{value:'code'}" v-model="formData['belong_by']" placeholder="  请选择归属人" :treeData="gsbm1"></tree1>
            </div>
          </template>
          <template v-slot:manage_bySlot>
             <div>
               <tree1 ref="tree3" @checkChange="gcheckChange" :nodeConfig="{value:'code'}" v-model="formData['manage_by']" placeholder="  请选择管理人" :treeData="gsbm1"></tree1>
            </div>
          </template>
          <template v-slot:layerSlot>
             <div>
               <!-- <tree2 ref="tree4" @checkChange="gcheckChange1" :nodeConfig="{value:'code'}" v-model="formData['layer']" placeholder="  请选择所属层级" :treeData="gsbm2"></tree2> -->
               <tree2 :options="gsbm2" :multiple="true" :valueMultiple="valueMultiple"
      @getValue="getSelectedValue"></tree2>
            </div>
          </template>
        </ByFormGroup>
        <div class="d-flex justify-content-center">
          <el-button v-if="lsdj1"  type="primary" @click="lsdj"  v-debounce >临时登记</el-button>
          <el-button :disabled="btn"  type="primary" @click="wcdj"  v-debounce >{{ djbtn }}</el-button>
        </div>
      </div>
      <div v-else-if="activeName === 'second'">
        <div class="d-flex justify-content-between align-items-center mb-10 title-wrap">
          <div class="d-flex align-items-center ">
            <i class="el-icon-warning" style="color:#407FFF;margin-right:5px"></i>
            <span class="font-12">共&nbsp;{{zzd.length}}&nbsp;个字段信息</span>
            <p class="font-12" style="color:#F56C6C">（标红资产：字段名称可能存在不规范情况，请完成字段信息登记的同时，建议将字段名称进一步规范，如涉及特殊含义的名称建议存入字段业务含义）</p>
          </div>
        
        </div>
        <ByFormTable :lb="lb" ref="byftable" @tableRowClassName="tableRowClassName" @operateItem="operateItem" :formData="formDataColumn"  :columnArr="columnArr" formTableRef="assetManageTable" :operate="false"  @sort="sort">
          <template  v-slot:standardName="data">
              <div>
              <el-button @click="tk(data.row)" type="text" size="mini">{{data.row.standardName}}</el-button>
            </div>
          </template>
          <template v-slot:code="data">
             <div>
              <el-button @click="operateItem(data.row)" type="text" size="mini">{{ data.row.codeName || '新增码值'}}</el-button>
            </div>
          </template>
        </ByFormTable>
        <ByModel :body="false" :visible.sync="visible" :modelTitle="modelTitle" modelWidth="850px" @close="dialogCancel" @closed="dialogClosed">
          <ByTable ref="table2" @selectionChange="selectionChange" :tableData="table1" :columnArr="columnArr1" :pagination="pagination" 
        @sizeChange="sizeChange" @currentChange="currentChange" @handleMultiple="handleMultiple1"></ByTable>
        <template slot="modalFoot">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" v-debounce> 保存 </el-button>
      </template>
        </ByModel>
        <ByModel :body="false" ref="model" :visible.sync="visible1" :modelTitle="modelTitle1" modelWidth="850px" @close="dialogCancel1" @closed="dialogClosed1">
          <ByTable ref="table1" @rowClick="rowClick" :data="adata" @selectionChange="selectionChange2" 
          :tableData="table2" :columnArr="columnArr2"  @handleMultiple="handleMultiple"></ByTable>
        <template slot="modalFoot">
        <el-button @click="visible1 = false">取 消</el-button>
        <el-button type="primary" @click="confirm1" v-debounce> 保存 </el-button>
      </template>
        </ByModel>

        <ByModel :body="false" :visible.sync="visible2" :modelTitle="modelTitle12" modelWidth="850px" @close="dialogCancel12" @closed="dialogClosed12">
          <ByTable ref="table" :tableData="table3" :columnArr="columnArr3"  ></ByTable>
        <template slot="modalFoot">
        <el-button @click="visible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm12" v-debounce> 关闭 </el-button>
      </template>
        </ByModel>
      </div>
    </div>
  </div>
</template>

<script>
import {formList,formConfig,formRules,columnArr,columnArr1,columnArr2,columnArr3} from '../mock'
import { dateFormat , hourFormat} from '@/utils/dateconversion'
import tree from './tree.vue'
import tree1 from './tree1.vue'
import tree2 from './tree2.vue'
export default {
  name: 'asset',
  data () {
    return {
      gsbm : [],
      mymz : [],
      gsbm1 : [],
      valueMultiple : [],
      gsbm2 :[],
      lsdj1 : true ,
      modelTitle: "映射标准关系",
      modelTitle1: "新增码值",
      modelTitle12: "选择码值",
      activeName: 'first',
      formList,
      visible1 : false,
      visible2 : false,
      columnArr1,
      mzx : [],
      columnArr2,
      columnArr3,
      table3 : [],
      table2 : [],
      btn : true,
      btn1 : true,
      adata : [],
      formConfig,
      formRules,
      visible: false,
      formData : null,
      columnArr : JSON.parse(JSON.stringify(columnArr)),
      mz : null,
      zd : null,
      table1 : [],
      zzd : JSON.parse(JSON.stringify(this.sjzczd)),
      select : null,
      select1 : null,
      lb :[],
      formDataColumn : null,
      mapd : '',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
        total: 1,
      },
      cctk : {}
    }
  },
  components: {
    tree ,tree1,tree2
  },
  props: {
    sjzcpd: {
      type: Object,
      default: () => {},
    },
    sjzczd: {
      type: Array,
      default: () => [],
    },
    djbtn :{
      type: String,
      default: '完成登记',
    },
  },
  methods:{
    getSelectedValue(value) {
      console.log('选中的结果值', value)
      let arr = []
                value.forEach((item)=>{
                    arr.push(item.id)
                })
      this.formData['layer'] = arr
    },
    gcheckChange1(data ,checked){
      // if(checked){
      //   this.$refs.tree4.$refs.tree.setCheckedKeys([data.id])
      //   this.$refs.tree3.$data.selectShowLabel = this.$refs.tree3.$data.selectShowLabel.push(data.label)
      //   this.formData['layer'] = data.catalog_id
      // }
      // if(!checked&&this.$refs.tree3.$refs.tree.getCheckedKeys().length === 0){
      //   this.$refs.tree3.$data.selectShowLabel = ''
      //   this.formData['layer'] = null
      // }
    },
    gcheckChange(data ,checked){
      if(checked){
        this.$refs.tree3.$refs.tree.setCheckedKeys([data.user_id])
        this.$refs.tree3.$data.selectShowLabel = data.user_name
        this.formData['manage_by'] = data.user_id
      }
      if(!checked&&this.$refs.tree3.$refs.tree.getCheckedKeys().length === 0){
        this.$refs.tree3.$data.selectShowLabel = ''
        this.formData['manage_by'] = null
      }
    },
    rcheckChange(data ,checked){
      if(checked){
        this.$refs.tree2.$refs.tree.setCheckedKeys([data.user_id])
        this.$refs.tree2.$data.selectShowLabel = data.user_name
        this.formData['belong_by'] = data.user_id
      }
      if(!checked&&this.$refs.tree2.$refs.tree.getCheckedKeys().length === 0){
        this.$refs.tree2.$data.selectShowLabel = ''
        this.formData['belong_by'] = null
      }
    },
    checkChange(data ,checked){
      if(checked){
        this.$refs.tree.$refs.tree.setCheckedKeys([data.dep_id])
        this.$refs.tree.$data.selectShowLabel = data.dep_name
        this.formData['belong_depart'] = data.dep_id
      }
      if(!checked&&this.$refs.tree.$refs.tree.getCheckedKeys().length === 0){
        this.$refs.tree.$data.selectShowLabel = ''
        this.formData['belong_depart'] = null
      }
    },
    glcheckChange(data ,checked){
      if(checked){
        this.$refs.tree1.$refs.tree.setCheckedKeys([data.dep_id])
        this.$refs.tree1.$data.selectShowLabel = data.dep_name
        this.formData['manage_depart'] = data.dep_id  
      }
      if(!checked&&this.$refs.tree1.$refs.tree.getCheckedKeys().length === 0){
        this.$refs.tree1.$data.selectShowLabel = ''
        this.formData['manage_depart'] = null
      }
    },
    // 新增码值
    confirm1(){
      if(this.select1){
        this.select1.create_date = this.select1.create_date.split('-').join('')
        this.select1.create_time = this.select1.create_time.split(':').join('')
        this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",{
          code_type_id : this.select1.code_type_id
        }).then((res)=>{
          if(res.code === 999){
            this.zzd.forEach((item)=>{
          if(item.mdata_col_id === this.zd.mdata_col_id ){
            item.code_type_name = this.select1.code_type_name || null
            item.code_type_id = this.select1.code_type_id || null
            item.codeName = this.select1.code_type_name || '新增码值'
            item.mzx = res.data.dbmCodeItemInfos
          }
        })
        this.mapd =  this.zd.mdata_col_id
        this.select1 = null
        let arr = JSON.parse(JSON.stringify(this.zzd))
        this.formDataColumn.tableData = arr
          }
        })
      }else {
        this.zzd.forEach((item)=>{
          if(item.mdata_col_id === this.zd.mdata_col_id){
            item.code_type_name =  null
            item.code_type_id = item.enum_ename || null
            item.codeName =  '新增码值'
            delete item.mzx
            if(item.code_type_id !== null){
              this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",{
          code_type_id : item.code_type_id
        }).then((res)=>{
          if(res.code === 999){
            item.mzx = res.data.dbmCodeItemInfos || undefined
          }
        })
            }
            this.mapd = ''
          }
        })
        let arr = JSON.parse(JSON.stringify(this.zzd))
        this.formDataColumn.tableData = arr
      }
        
       this.visible1 = false;
    },
    dialogClosed1(){},
    dialogCancel1() {
      this.visible1 = false;
    },
    tableRowClassName(val){
      // console.log(val);
      // if(val.row.col_cname === '字段3'){
      //   return 'warning';
      // }
      
    },
   
    confirm12(){
      this.visible2 = false;
    },
    dialogClosed12(){},
    dialogCancel12() {
      this.visible2 = false;
    },

    rowClick(row, column, event){ 
      if(column.label === '标准代码类名'){
        this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",{
          code_type_id : row.code_type_id
        }).then((res)=>{
          if(res.code === 999){
            this.adata = res.data.dbmCodeItemInfos
          }
        })
      }
    
    },

    operateItem(row){
           this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codetypeinfo/getDbmCodeTypeInfo")
        .then((res)=>{
          if(res.code === 999){
            res.data.dbmCodeTypeInfos.forEach((item)=>{
              item.create_date = dateFormat(item.create_date)
              item.create_time = hourFormat(item.create_time)
            })
           this.table2 = JSON.parse(JSON.stringify(res.data.dbmCodeTypeInfos))
          }
        })

        this.zd = row
        this.visible1 = true

      // }
    },
    // 关联标准选择
   async confirm(){
      if(this.select){
        this.formDataColumn.tableData.forEach((item)=>{
          if(item.mdata_col_id === this.cctk.id){
            item.standardName = this.select.norm_cname
          }
        })
        this.zzd.forEach((item)=>{
          if(item.mdata_col_id === this.zd.mdata_col_id){
            console.log(item,this.select);
            item.norm_col_ename = this.select.norm_ename
            item.standardName = this.select.norm_cname
            item.norm_col_cname = this.select.norm_cname
            this.select.src_col_ename = item.col_ename
        this.select.src_col_cname = item.col_cname
        this.select.src_col_ename = item.col_ename
        this.select.src_col_type = item.col_type
        if(item.col_len){
             this.select.src_col_len = Number(item.col_len) || 0
              }else {
                this.select.src_col_len  =  0
              }
              if(item.col_prec ){
                this.select.src_col_preci = Number(item.col_prec) || 0
              }else {
                this.select.src_col_preci  =  0
              }
          }
        })
        console.log(this.select);
        if(this.select.code_type_id !== null){
          await  this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",{
          code_type_id : this.select.code_type_id
        }).then((res)=>{
          if(res.code === 999){
   
            this.zzd.forEach((item)=>{
          if(item.mdata_col_id === this.zd.mdata_col_id ){
            item.code_type_name = this.select.code_type_name || null
            item.enum_ename = this.select.code_type_id || null
            item.code_type_id = this.select.code_type_id || null
            item.codeName = this.select.code_type_name || '新增码值'
            item.mzx = res.data.dbmCodeItemInfos || null
          }
        })
        let arr = JSON.parse(JSON.stringify(this.zzd))
        this.formDataColumn.tableData = arr
          }
        })
        }else {
          this.zzd.forEach((item)=>{
          if(item.mdata_col_id === this.zd.mdata_col_id ){
            item.code_type_name = this.select.code_type_name || null
            item.enum_ename = this.select.code_type_id || null
            item.code_type_id = this.select.code_type_id || null
            item.codeName = this.select.code_type_name || '新增码值'
            item.mzx = undefined
          }
        })
        let arr = JSON.parse(JSON.stringify(this.zzd))
        this.formDataColumn.tableData = arr
        }
  
     
        await  this.$executeRequest
        .execPostByControllerAllMappingName("/K/standardImp/standardCheck",JSON.parse(JSON.stringify(this.select)))
        .then((res)=>{
          if(res.code === 999){
            if(res.data.imp_result === '1'){
             
              this.lb =  this.lb.filter((item)=>{
           return item !== this.zd.mdata_col_id
          })
            }else if(res.data.imp_result === '0'){
              if(this.lb.indexOf(this.zd.mdata_col_id) === -1){
                this.lb.push(this.zd.mdata_col_id)
              }
              
              this.$Msg.customizTitle(res.data.imp_detail+',只能临时保存', "error");
            }
          }
        })
      }else {
      this.$Msg.customizTitle("关联标准不能为空", "warning");
      }
      this.visible= false
      this.select = null
    },

    selectionChange(val){
      // if(val.checked){
      // this.select = val
      // }else{
      //   this.select = {checked : false}
      // }
    },
    selectionChange2(val){
      
      // if(val.checked){

      // this.select1 = val
      // }else{
      //   this.select1 = {checked : false}
      // }
    },
    handleMultiple1(val) {
        if(val.length === 1){
          console.log(val);
          this.select = val[0]
        }else {
          this.select = null
        }
          if (val.length > 1) {
            this.$refs.table2.$refs.table.clearSelection()
            this.$refs.table2.$refs.table.toggleRowSelection(val.pop())
      } } ,
        // 多选变化触发
        handleMultiple(val) {
        if(val.length === 1){
          console.log(val);
          this.select1 = val[0]
        }else {
          this.select1 = null
        }
          if (val.length > 1) {
            this.$refs.table1.$refs.table.clearSelection()
            this.$refs.table1.$refs.table.toggleRowSelection(val.pop())
      }
    },
    getMetaObjInfo() {
      const param = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        ...this.cctk,
      };
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/K/standardImp/getStandardList",
              param
          )
          .then((res)=>{
            if(res.code === 999){
              this.pagination.total = res.data.total 
              this.table1 = res.data.normInfoList
            }
          })
    },
    currentChange(val) {
     
      this.pagination.pageNum = val;
      this.pagination.pageSize = 10;
      this.getMetaObjInfo();
    },
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getMetaObjInfo();
    },
    dialogCancel() {
      this.visible = false;
      this.cctk = {}
    },
  tk(val){
     this.cctk = {
      src_col_cname: val.col_cname, //原始字段中文名称, 必填
      src_col_ename:val.col_ename, // 所属分类id
      id : val.mdata_col_id
     }
    let data = {
        src_col_cname: val.col_cname, //原始字段中文名称, 必填
        src_col_ename:val.col_ename, // 所属分类id
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/K/standardImp/getStandardList",
              data
          )
          .then((res)=>{
            if(res.code === 999){
              this.table1 = res.data.normInfoList
              this.pagination.total = res.data.total
            }
          })
          this.zd = val
    this.visible = true
  },
       //新增弹窗关闭之后
    dialogClosed() {

    },
    sort(data){
      if(data.order === 'ascending'){//升序
        this.formDataColumn.tableData.sort((a,b)=>{
          return new Date(a[data.prop]).getTime() - new Date(b[data.prop]).getTime()
        })
      }else{//降序
        this.formDataColumn.tableData.sort((a,b)=>{
          return new Date(b[data.prop]).getTime() - new Date(a[data.prop]).getTime()
        })
      }
    },
    // 临时登记
    lsdj(){
      let params = JSON.parse(JSON.stringify(this.formData))
   if(params.asset_date !== '-'){
      params.asset_date = params.asset_date.split('-').join('') || null
   }else {
    params.asset_date = null
   }
   if(params.asset_time !== '-'){
      params.asset_time = params.asset_time.split(':').join('') || null
   }else{ 
    params.asset_time = null
   }
      // params.asset_time = params.asset_time.split(':').join('') || null
 params.data_source_type =params.data_source_type || null
 params.theme =params.theme || null
 params.business_remark =params.business_remark || null
 params.mdata_table_id =params.mdata_table_id|| null
 params.store_path =params.store_path || null
 params.process_frequen =params.process_frequen || null
 params.process_rule =params.process_rule || null
 params.data_auth_code =params.data_auth_code || null
 if(params.manage_by){
  params.manage_by = `${params.manage_by}`
}else {
  params.manage_by = null
}
if(params.manage_by){
  params.belong_by = `${params.belong_by}`
}else {
  params.belong_by = null
}
     
      params.business_cname = [] 
      params.tech_cname = []
      if(params.layer){
      params.layer =  params.layer.join(',') || null
      }
      this.sjzczd.forEach((item)=>{
        params.business_pk.forEach((i)=>{
          if(item.col_ename === i){
            params.business_cname.push(item.col_cname)
          }
        })
      })
      this.sjzczd.forEach((item)=>{
        params.tech_pk.forEach((i)=>{
          if(item.col_ename === i){
            params.tech_cname.push(item.col_cname)
          }
        })
      })
        params.asset_status = '2'
    
      console.log(params);
      params.business_cname= params.business_cname.join(',') || null
      params.business_pk = params.business_pk.join(',') || null
      params.tech_pk = params.tech_pk.join(',') || null
      params.tech_cname = params.tech_cname.join(',') || null
      let dataAssetEnumVoList = []
      for (let i = 0; i < this.zzd.length; i++) {
      this.zzd[i].asset_id = params.asset_id || null
      this.zzd[i].publish_rule= this.zzd[i].publish_rule || null,
      this.zzd[i].security_level= this.zzd[i].security_level || null,
      this.zzd[i].share_metho= this.zzd[i].share_metho || null,
      this.zzd[i].amount_unit=  this.zzd[i].amount_unit || null
      if(this.zzd[i].col_len ){
        this.zzd[i].col_len = Number(this.zzd[i].col_len)
              }else {
                this.zzd[i].col_len =  null

              }
              if(this.zzd[i].col_prec ){
                this.zzd[i].col_prec = Number(this.zzd[i].col_prec)
              }else {
                this.zzd[i].col_prec = null
              }
      // this.zzd[i].col_type = this.zzd[i].code_type_name ,
      this.zzd[i].enum_ename = this.zzd[i].code_type_id || null,
      this.zzd[i].share_rule= this.zzd[i].share_rule ||  null,
      this.zzd[i].share_type= this.zzd[i].share_type  ||  null
      if(this.zzd[i].mzx !== undefined){
        console.log(this.zzd[i].mzx,this.zzd[i]);
        this.zzd[i].mzx.forEach((item)=>{
          dataAssetEnumVoList.push( {
              enum_cname: this.zzd[i]?.code_type_name || null,
              enum_ename: this.zzd[i]?.code_type_id || null,
              enum_id:  null,
              item_cname: item.code_item_name,
              item_ename: null,
              item_value: item.code_item_id
            })
        })
      } 
     delete this.zzd[i].mzx

       
      }
     
      let obj  = {
          dataAssetRegistVo: params,
          dataAssetColumnVo: JSON.parse(JSON.stringify(this.zzd)),
          dataAssetEnumVoList,
          taskId : this.$route.query.id || 0
        }
        console.log(obj);
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/N/N1002/registDataAsset",
              obj
          )
          .then((res)=>{
            if(res.code === 999){
              this.$emit('gb',false)
              this.$Msg.customizTitle("保存成功", "success");
            }
          })
    },
    // 完成登记
    wcdj(){
      let params = JSON.parse(JSON.stringify(this.formData))
      console.log(params);
   if(params.asset_date !== '-'){
      params.asset_date = params.asset_date.split('-').join('') || null
   }else {
    params.asset_date = null
   }
   if(params.asset_time !== '-'){
      params.asset_time = params.asset_time.split(':').join('') || null
   }else{ 
    params.asset_time = null
   }
      // params.asset_time = params.asset_time.split(':').join('') || null
 params.data_source_type =params.data_source_type || null
 params.theme =params.theme || null
 params.business_remark =params.business_remark || null
 params.mdata_table_id =params.mdata_table_id|| null
 params.store_path =params.store_path || null
 params.process_frequen =params.process_frequen || null
 params.process_rule =params.process_rule || null
 params.data_auth_code =params.data_auth_code || null
 if(params.manage_by){
  params.manage_by = `${params.manage_by}`
}else {
  params.manage_by = null
}
if(params.belong_by){
  params.belong_by = `${params.belong_by}`
}else {
  params.belong_by = null
}
     
      params.business_cname = [] 
      params.tech_cname = []
      if(params.layer){
      params.layer =  params.layer.join(',') || null
      }
      this.sjzczd.forEach((item)=>{
        params.business_pk.forEach((i)=>{
          if(item.col_ename === i){
            params.business_cname.push(item.col_cname)
          }
        })
      })
      this.sjzczd.forEach((item)=>{
        params.tech_pk.forEach((i)=>{
          if(item.col_ename === i){
            params.tech_cname.push(item.col_cname)
          }
        })
      })

        params.asset_status = '3'
      params.business_cname= params.business_cname.join(',') || null
      params.business_pk = params.business_pk.join(',') || null
      params.tech_pk = params.tech_pk.join(',') || null
      params.tech_cname = params.tech_cname.join(',') || null
      let dataAssetEnumVoList = []
      for (let i = 0; i < this.zzd.length; i++) {
      this.zzd[i].asset_id = params.asset_id || null
      this.zzd[i].publish_rule= this.zzd[i].publish_rule || null,
      this.zzd[i].security_level= this.zzd[i].security_level || null,
      this.zzd[i].share_metho= this.zzd[i].share_metho || null,
      this.zzd[i].amount_unit=  this.zzd[i].amount_unit || null
      if(this.zzd[i].col_len ){
        this.zzd[i].col_len = Number(this.zzd[i].col_len)
              }else {
                this.zzd[i].col_len =  null

              }
              if(this.zzd[i].col_prec ){
                this.zzd[i].col_prec = Number(this.zzd[i].col_prec)
              }else {
                this.zzd[i].col_prec = null
              }
      // this.zzd[i].col_type = this.zzd[i].code_type_name ,
      this.zzd[i].enum_ename = this.zzd[i].code_type_id || null,
      this.zzd[i].share_rule= this.zzd[i].share_rule ||  null,
      this.zzd[i].share_type= this.zzd[i].share_type  ||  null
      if(this.zzd[i].mzx !== undefined){
        this.zzd[i].mzx.forEach((item)=>{
          dataAssetEnumVoList.push( {
              enum_cname: this.zzd[i].code_type_name || null,
              enum_ename: this.zzd[i].code_type_id || null,
              enum_id:  null,
              item_cname: item.code_item_name,
              item_ename: null,
              item_value: item.code_item_id
            })
        })
      } 
     delete this.zzd[i].mzx

       
      }
      let obj  = {
          dataAssetRegistVo: params,
          dataAssetColumnVo: JSON.parse(JSON.stringify(this.zzd)),
          dataAssetEnumVoList,
          taskId : this.$route.query.id || 0
        }
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/N/N1002/registDataAsset",
              obj
          )
          .then((res)=>{
            if(res.code === 999){
              this.$emit('gb',false)
              this.$Msg.customizTitle("保存成功", "success");
            }
          })
    }
  },
  created() {
    this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codetypeinfo/getDbmCodeTypeInfo")
        .then((res)=>{
         this.mymz = res.data.dbmCodeTypeInfos
        })
    if(this.sjzcpd.asset_status === '3'){
      this.lsdj1 = false
    }
    let arr = JSON.parse(JSON.stringify(this.sjzcpd))
    if(this.sjzcpd.layer !== null){
      this.valueMultiple = this.sjzcpd.layer
    }
    this.$executeRequest
        .execByUrl("/Base/departmentalList/getDepartmentInfo",{
          currPage : 1,
          pageSize : 999
        }) 
        .then((res)=>{
          let arr1 = [] 
          res.data.departmentInfos.forEach((item)=>{
           item.label = item.dep_name 
           item.value = item.dep_id
           res.data.departmentInfos.forEach((i)=>{
            if (item.sup_dep_id === i.dep_id) {
                    if (!i.children) {
                      i.children = []
                      i.children.push(item)
                    } else {
                      i.children.push(item)
                    }
                  }
           })

           if(item.sup_dep_id=== 0){
              item.children = []
              arr1.push(item)
            }
      
          })
          this.gsbm = arr1
        })
      
        this.$executeRequest
        .execByUrl("/Base/sysUser/getAllSysUserByDepartmentInfo") 
        .then((res)=>{
          res.data.forEach((item)=>{
            item.label = item.user_name
           item.value = item.user_id
           res.data.forEach((i)=>{
            if(item.create_id === i.user_id){
              if (!i.children) {
                      i.children = []
                      i.children.push(item)
                    } else {
                      i.children.push(item)
                    }
            }
           })
           if(item.user_id===1000){
              item.children = []
              this.gsbm1.push(item)
            }
          })
        })
        this.$executeRequest
        .execByUrl("/N/N1001/findCatalog?catalogName=&currPage=1&pageSize=10") 
        .then((res)=>{
          if(res.code === 999){
            res.data.pageList.forEach((item)=>{
              item.name = item.catalog_name
           item.id = item.catalog_id
           item. disabled = true 
           item.children = []
           this.gsbm2.push(item)
            })
          }
        })
    this.formData = arr
    this.formList[0].formItems[3].options = []

    this.sjzczd.forEach((item)=>{
      this.formList[0].formItems[3].options.push({
        label : item.col_cname ,
        value : item.col_ename
      })
    })
    this.formList[1].formItems[4].options= []
    this.sjzczd.forEach((item)=>{
      this.formList[1].formItems[4].options.push({
        label : item.col_cname ,
        value : item.col_ename
      })
    })
    this.formList[1].formItems[5].options= []
    this.sjzczd.forEach((item)=>{
      this.formList[1].formItems[5].options.push({
        label : item.col_cname ,
        value : item.col_ename
      })
    })

  
       if(this.sjzcpd.asset_status !== '1'){
        this.zzd.forEach((item)=>{
          item.src_col_cname = item.col_cname
       item.src_col_ename = item.col_ename
        item.src_col_type = item.col_type
        if(item.col_len){
             item.src_col_len = item.col_len || 0
              }else {
               item.src_col_len  =  0
              }
              if(item.col_prec ){
                item.src_col_preci = item.col_prec || 0
              }else {
                item.src_col_preci  =  0
              }
            if(item.enum_ename !== null){
              item.code_type_id = item.enum_ename 
            }
            
            const param = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        src_col_cname: item.col_cname, //原始字段中文名称, 必填
      src_col_ename:item.col_ename, // 所属分类id
      id : item.mdata_col_id
        
      };
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/K/standardImp/getStandardList",
              param
          )
          .then((res)=>{
            res.data.normInfoList.forEach((i)=>{
              if(item.norm_col_cname === i.norm_cname){
                console.log(i);
                item.standardName = i.norm_cname
                item.basic_id =i.basic_id
                this.$executeRequest
        .execPostByControllerAllMappingName("/K/standardImp/standardCheck",item)
        .then((res)=>{
          if(res.code === 999){
            if(res.data.imp_result === '1'){
             
              this.lb =  this.lb.filter((l)=>{
           return l !== item.mdata_col_id
          })
            }else if(res.data.imp_result === '0'){
              if(this.lb.indexOf(item.mdata_col_id) === -1){
                this.lb.push(item.mdata_col_id)
              }
              
     
            }
          }})
              }
            })
         
          })
          if(item.enum_ename !== null){
            this.$executeRequest
        .execPostByControllerMapping("/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId",{
          code_type_id : item.enum_ename
        }).then((res)=>{  
          // item.codeName = res.data.code_type_name || '新增码值'
          item.mzx = res.data.dbmCodeItemInfos || null
          if(res.data.dbmCodeItemInfos.length !== 0){
            this.mymz.forEach((m)=>{
              if(m.code_type_id === res.data.dbmCodeItemInfos[0].code_type_id){
                item.codeName = m.code_type_name
                item.code_type_name = m.code_type_name
                
              }
            })
          }
        })
          }
       
          })
       }
    
    this.formDataColumn = {
      tableData : this.zzd
    }
  }, 
  watch: {
    activeName: {
      handler(val) {
       if(val === 'first'){
        if(this.lb.length === 0){
        this.btn = false
        }else {
        }
        this.zzd.forEach((item)=>{
          if(item.standardName !=='关联标准'){
          }else{
            this.btn = true
          }
        })
       }
      }
    
    },

  }
}
</script>

<style lang="less" scoped>

::v-deep .el-button {
  padding: 8px 16px;
}
.title-wrap {
  background: rgb(217,236,255);
  height: 48px;
  padding: 0 10px;
  border-radius: 4px;
}
// 将全选项隐藏
/deep/ thead .el-table-column--selection .cell {
  display: none !important;
}
.el-button--text {
		color: @primary-color;
		// font-size: 14px;
		font-family: @pingfang;
	}
  // 将全选项隐藏


</style>