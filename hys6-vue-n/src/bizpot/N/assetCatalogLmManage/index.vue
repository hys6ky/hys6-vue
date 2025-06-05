<template>
  <div class="assetCatalogLmManage  px-20 h100">
   <div class="header"  style="width: 100%;border-bottom: 1px solid #E3E4E5; ">
    <div class="btn d-flex justify-content-between  ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item >类目</el-breadcrumb-item>
  <el-breadcrumb-item>{{ $route.query.catalog_name }}</el-breadcrumb-item>
</el-breadcrumb>
       <div class="btnn">
     
        <el-button  @click="addDir"  type="primary" v-debounce>新增目录</el-button>
        <el-button  @click="flush"  type="primary" v-debounce>刷新</el-button>
        <el-button  @click="disposition"  type="primary" v-debounce>配置资产</el-button>
        <el-button  @click="fh"   type="major" v-debounce>返回</el-button>
       </div>
       
        <!-- <el-button   type="major"flush v-debounce>批量删除</el-button> -->
      </div>
   </div>
   <div class="main d-flex" style="height: calc(100% - 62px)">
        <ByTree  :expandAll="true" :data="metaDataTree" @detail="detail"  class="h100" @logDetail="detail" 
      @add="add"  @addLog="addLog"   @editLog="editLog"
      type="tree"  />
      <div class="flex-1 py-20 pl-20" v-if="Object.keys(node).length > 0" style="width: calc(100% - 295px)">
				<div class="d-flex align-items-center justify-content-between">
					<ByContainerTitle :title="title" />
				</div>
				<ByTable @handleMultiple="handleMultiple" :columnArr="assetColumnArr" :tableData="assetTableData" class="pt-10" @operateItem="operate" />
			</div>
			<div v-else class="flex-1">
				<ByEmpty />
			</div> 
   </div>
   <ByModel class="bm" :visible.sync="visible" :modelTitle="modelTitle" modelWidth="650px" @close="dialogCancel" @closed="dialogClosed">
      <div class="bm1" style="padding: 0 20px 0 20px">
        <ByModelForm :formData="modelFormData3" :formItems="modelFormItems3" :formRules="modelFormRules3"
          :formConfig="modelFormConfig3" ref="dataMark" />
      </div>
      <template slot="modalFoot">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" v-debounce> 保存 </el-button>
      </template>
    </ByModel>
    <ByModel class="bm" :visible.sync="bjVisible" :modelTitle="bjModelTitle" modelWidth="650px" @close="bjdialogCancel" @closed="bjdialogClosed">
      <div class="bm1" style="padding: 0 20px 0 20px">
        <ByModelForm :formData="modelFormData3" :formItems="modelFormItems3" :formRules="modelFormRules3"
          :formConfig="modelFormConfig3" ref="dataMark1" />
      </div>
      <template slot="modalFoot">
        <el-button @click="bjVisible = false">取 消</el-button>
        <el-button type="primary" @click="bjconfirm" v-debounce> 保存 </el-button>
      </template>
    </ByModel>
    <ByModel class="bm" :visible.sync="bjVisible1" :modelTitle="bjModelTitle" modelWidth="650px" @close="bjdialogCancel1" @closed="bjdialogClosed1">
      <div class="bm1" style="padding: 0 20px 0 20px">
        <ByModelForm :formData="modelFormData3" :formItems="modelFormItems31" :formRules="modelFormRules3"
          :formConfig="modelFormConfig3" ref="dataMark1" />
      </div>
      <template slot="modalFoot">
        <el-button @click="bjVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="bjconfirm1" v-debounce> 保存 </el-button>
      </template>
    </ByModel>
    <ByModel class="bm" :visible.sync="dirVisible" :modelTitle="modelTitle" modelWidth="650px" @close="dirDialogCancel" @closed="dirDialogClosed">
      <div class="bm1" style="padding: 0 20px 0 20px">
        <ByModelForm :formData="modelFormData3" :formItems="modelFormItems3" :formRules="modelFormRules3"
          :formConfig="modelFormConfig3" ref="dataMark3" />
      </div>
      <template slot="modalFoot">
        <el-button @click="dirVisible = false">取 消</el-button>
        <el-button type="primary" @click="dirConfirm" v-debounce> 保存 </el-button>
      </template>
    </ByModel>
    <!-- <ByDrawer  :visible.sync="bmVisible" drawTitle="资产编码管理" :drawWidth="1300" :drawFooter="false" @close="bmVisible = false">
			<Info @bc="bc"/>
		</ByDrawer> -->
  </div>
</template>

<script>
import { dateFormat, hourFormat } from '@/utils/dateconversion'

import {treeData , 
  assetColumnArr,
  assetTableData,
  modelFormData,
  modelFormItems,
  modelFormConfig,
  modelFormRules,
  modelFormData1,
  modelFormItems1,
  modelFormConfig1,
  modelFormRules1,
  modelFormItems3,
  modelFormItems31,
  modelFormConfig3,
  modelFormData3,
  modelFormRules3
} from './mock'
import Info from './components/info.vue';
export default {
  name: 'assetCatalogLmManage',
  components: { Info },
  data() {
    return {
      metaDataTree : [],
      treeData,
      bjVisible1 : false,
      title: "一级目录",
      modelTitle: "新增目录",
      modelFormItems31,
      bjModelTitle : '编辑',
      bmModelTitle : '资产编码管理',
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      modelFormItems,
      modelFormConfig,
      modelFormRules,
      modelFormData1: JSON.parse(JSON.stringify(modelFormData1)),
      modelFormItems1,
      modelFormConfig1,
      modelFormRules1,
      modelFormItems3,
      modelFormConfig3,
      modelFormData3: JSON.parse(JSON.stringify(modelFormData3)),
      modelFormRules3,
      visible: false,
      bjVisible: false,
      bmVisible : false,
      dirVisible: false,
      node: {},
      expandedList : [],
      expandedKeys: [],
      assetColumnArr ,
      assetTableData,
      catalogId: 0,
      currentNode: {},
    }
  },
  methods: {
    disposition(){
  
      this.$router.push({
          path: "/N/catalogManage", query: {
            catalog_id: this.$route.query.catalog_id,
            catalog_name: this.$route.query.catalog_name,
          }
        });
    },
    fh(){
      this.$router.push({
          path: '/N/N1001'
        })
    },

    bjconfirm1(){
      if(this.modelFormData3.parent_id === ''){
         this.modelFormData3.parent_id = 0
      }
      this.$refs.dataMark1.$refs[this.modelFormConfig3.ref].validate((valid) => {
        if (valid) {
          this.$executeRequest
            .execPostByUrl2("/N/N1001/addOrUpdateDir", this.modelFormData3)
            .then((res) => {
              if (res.code != 999) {
                return;
              }
              var currentNode = this.currentNode;
              this.$nextTick(() => {
                this.detail(currentNode);
              });
          this.$Msg.customizTitle("编辑成功!", "success");
            });
          this.bjVisible1 = false;
        }
      });
    },
    // 编码管理保存
    bc(val){
      console.log(val);
      this.bmVisible = false
    },

    // 这里是树的添加类目保存
    dialogCancel() {
      this.visible = false;
    },
    //保存工程
    confirm() {
      this.$refs.dataMark.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          console.log(this.modelFormData);
          this.visible = false
        }
      });
    },
       //新增弹窗关闭之后
    dialogClosed() {

    },

    // 这里是table的编辑
    bjdialogCancel() {
      this.bjVisible = false;
    },
    bjdialogCancel1() {
      this.bjVisible1 = false;
    },
    dirDialogCancel() {
      this.dirVisible = false;
    },
    dirConfirm() {
      if(this.modelFormData3.parent_id === ''){
         this.modelFormData3.parent_id = 0
      }
      this.$refs.dataMark3.$refs[this.modelFormConfig3.ref].validate(async (valid) => {
        if (valid) {
          this.modelFormData3.catalog_id = this.catalogId;
         await this.$executeRequest
            .execPostByUrl2("/N/N1001/addOrUpdateDir", this.modelFormData3)
            .then((res) => {
              if (res.code != 999) {
                return;
              }
              var currentNode = this.currentNode;
              this.$nextTick(() => {
                this.detail(currentNode);
              });
              if(this.modelTitle === '新增目录'){
                this.$Msg.customizTitle("新增成功", "success");
              }else if(this.modelTitle === '编辑目录'){
                this.$Msg.customizTitle("修改成功", "success");

              }
          

            });
          this.modelFormData3 = {}

          this.dirVisible = false;
          this.flush()

        }
      });
    },
    //保存工程
    bjconfirm() {
      this.$refs.dataMark1.$refs[this.modelFormConfig3.ref].validate((valid) => {
        console.log(this.modelFormData3);
        if (valid) {
          this.$executeRequest
            .execPostByUrl2("/N/N1001/addOrUpdateDir", this.modelFormData3)
            .then((res) => {
              if (res.code != 999) {
                return;
              }
              var currentNode = this.currentNode;
              this.$nextTick(() => {
                this.detail(currentNode);
              });
          this.$Msg.customizTitle("新增成功!", "success");
          
            });
            this.modelFormData3 = {}
          this.bjVisible = false;
          this.flush()

        }
      });
    },
       //新增弹窗关闭之后
    bjdialogClosed() {

    },
    bjdialogClosed1() {

},
    dirDialogClosed() {

    },
    // 批量删除
    handleMultiple(val){
      console.log(val);
    },
    flush() {
      this.init(this.catalogId);
    },
    addDir() {
      this.modelTitle = '新增目录'
      this.dirVisible = true;
      var options = this.metaDataTree;
      for(var index in this.modelFormItems3) {
          if(this.modelFormItems3[index].prop == 'parent_id') {
            this.modelFormItems3[index].options = options;
          }
      }
      console.log(options);
    },


    add (node) {
      this.modelTitle = "新增目录";
      // this.visible = true;
    },
    //增加目录
    addLog (data) {
      console.log(data, '0000')
      if(data.command === 'SUB'){
        this.modelTitle = "添加子类目";
        console.log('添加子类目');
        this.visible = true;
      }else if(data.command === 'PEER'){
        this.modelTitle = "添加一级类目";
        console.log('添加一级类目');
        this.visible = true;
      }else if(data.command === 'BM') {
        this.bmVisible = true;
      }
      
   
      
    },
    //编辑目录
    editLog (data) {
      this.modelTitle = "编辑目录";
      this.visible = true;
    },
    // 类目的编辑
    operate (type, row) {
      if(type === 'bj') {
        this.modelTitle = '编辑目录'
        this.modelFormData3 = row
        this.dirVisible = true
        var options = this.metaDataTree;
      for(var index in this.modelFormItems3) {
          if(this.modelFormItems3[index].prop == 'parent_id') {
            this.modelFormItems3[index].options = options;
          }
      }
      }
      else if(type === 'del') {
        this.$executeRequest
          .execByControllerMappingName("/N/N1001/deleteDir",
            { dirId: row.dir_id, isDelCoding: '1' })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            this.$Msg.customizTitle("删除成功", "success");
            this.detail(this.currentNode);
          });
      }
    },
     //点击树节点
     detail(val) {
      if(val.id === undefined){
        this.init(this.catalogId);
        return
      }
      this.currentNode = val;
      this.title = val.label
      if (val.isLeaf == '0') {
       
        // 目录数据
        const params = {
          parentId: val.id,
          catalogId: 0 ,
        };
        this.$executeRequest
          .execByControllerMappingName("/N/N1001/queryByParentId", params)
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            val.children = [];
            for (var index in res.data) {
              res.data[index].showLable = res.data[index].label
              res.data[index].code = res.data[index].code
              res.data[index].expanded = false
              if(res.data[index].isLeaf === '1' ){
              res.data[index].type = 'text1'
              }else{
              res.data[index].type = 'text'
              }
              res.data[index].children = []
              val.children.push(res.data[index]);
            }
          });
      
        // 表格数据
        this.$executeRequest
          .execByControllerMappingName("/N/N1001/queryDirByParentId",
            { parentId: val.id 
            })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            res.data.forEach((item)=>{
              item.create_date = dateFormat(item.create_date)
              item.create_time = hourFormat(item.create_time)
            })
            this.node = res.data
           
            this.assetTableData = res.data;
          });

      }else if(val.isLeaf == '1'){
        this.node = {}
      }
    },
    //左侧树数据整理
    setTree(data) {
      this.metaDataTree = data;
    },
    init(catalogId) {
      
      const params = {
          parentId: 0,
          catalogId: catalogId
        };
      this.$executeRequest
          .execByControllerMappingName("/N/N1001/queryByParentId", params)
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            this.$executeRequest
          .execByControllerMappingName("/N/N1001/queryDirByParentId",
            { parentId: 0
            }).then((res1)=>{
              let table = []
              res1.data.forEach((item)=>{
                res.data.forEach((item1)=>{
                  if(item.dir_id === item1.id){
                    table.push(item)
                  }
                })
              })

                 table.forEach((item)=>{
              item.create_date = dateFormat(item.create_date)
              item.create_time = hourFormat(item.create_time)
            })
            this.node = table
           this.title = '一级目录'
            this.assetTableData = table;
            })
            this.metaDataTree = []
            var tree = []
            for(var index in res.data) {
              tree.push({
                id: res.data[index].id, 
                label: res.data[index].name, 
                showLable: res.data[index].label, 
                code: res.data[index].code, 
                isLeaf: res.data[index].isLeaf,
                status: res.data[index].status,
                type: res.data[index].type,
                expanded: false, 
                type: 'text', 
                children: []
              })
            }
            this.setTree(tree)
          });
          
    }
  },
  created() {
    this.catalogId = this.$route.query.catalog_id;
    this.init(this.catalogId);
  },
}
</script>

<style scoped lang="less">
.assetCatalogLmManage { 
  .btn {
    .el-breadcrumb{
      line-height: 60px !important;
    }
    /deep/.el-button {
      min-width: 80px;
      height: 32px;
      padding: 8px 25px;
      margin-top: 14px;
      margin-bottom: 14px;
    }
  }
  .bm{
    .bm1{
      
      ::v-deep .el-cascader-menu{
      min-height: 50px !important;
    }
    }
  }
}
</style>