<template>
	<div class="assetCatalog px-20 h100">
		<ByQuickSearch @change="change" :formItems="formItems" @search="search" @reset="reset" />
		<div class="d-flex" style="height: calc(100% - 82px)">
			<ByTree :defaultProps="defaultProps" :data="treeData" class="h100" :expandAll="true" @detail="toDetail" @logDetail="toDetail" ref="tree" />
			<div v-if="Object.keys(node).length > 0" class="p-20 flex-1">
				<ByContainerTitle :title="title" />
				<el-tabs v-model="activeName" class="mt-10">
					<el-tab-pane v-for="item in tabPanes" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
				</el-tabs>
        <panelBaseInfo :type="type" :zd="zd"  v-if="activeName === 'BSEINFO'"/>
        <!-- 组件里通过监听type区分是表的还是字段的 -->
        <antv v-else/>
			</div>
      <div v-else class="flex-1">
        <ByEmpty />
      </div>
		</div> 
	</div>
</template>

<script>
import { formItems} from './mock'
import panelBaseInfo from './components/panelBaseInfo.vue'
import antv from './components/antvView.vue'
import { v4 as uuidv4 } from "uuid";
export default {
  name: "assetCatalog",
  components:{
    panelBaseInfo ,
    antv
  },
  data () {
    return {
      formItems,
      treeData : [],
      zd : {},
      node : {},
      type : undefined,
      formData: {
        assetView: "",
        assetDepartment: ""
      },
      defaultProps:{
        children: "children",
        label: "showLable",
        key : 'ID'
      },
      activeName: "BSEINFO",
      tabPanes: [
        {
          label: "基本信息",
          name: "BSEINFO"
        },
        // {
        //   label: "资产标签",
        //   name: "ASSETTAG"
        // },
        // {
        //   label: "血缘关系",
        //   name: "BLOODRELATION"
        // },
        // {
        //   label: "资产关系",
        //   name: "ASSETRELATION"
        // },
        // {
        //   label: "评价信息",
        //   name: "EVALUATIONINFO"
        // }
      ],
      title: '',
    }
  },
  methods: {
    change(val){
      this.init(val)

    },
    search (data) {
      this.$executeRequest
          .execByControllerMappingName("/N/N1002/findDataAssetByDepart", 
          {
            depId: data.assetDepartment ? data.assetDepartment : 0, 
            catalogId: data.assetView ? data.assetView : 0,
            currPage: 1, 
            pageSize: 9999
          })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            this.treeData = [];
            for (var index in res.data.pageList) {
              var data = res.data.pageList[index]
              if(res.data.pageList[index].asset_status === '3'){
                this.treeData.push({
                id: uuidv4(),
                ID: data.asset_id,
                expanded: false,
                showLable: data.asset_cname,
                type: "text1", 
                children : [],
                name: data.asset_cname, 
                label: data.asset_cname, 
                code: data.asset_code,
                status: data.asset_status
              });
              }
              
            }
          });
    },
    reset (data) {
      for(var index in this.formItems) {
        if(this.formItems[index].prop == 'assetView') {
            this.init(this.formItems[index].options[0].value);
        }
      }
    },
    toDetail(val) {
      // 目录
      if (val.isLeaf == '0') {
        // 目录数据
        this.node = {}
        const params = {
          parentId: val.ID,
          catalogId : this.catalogId,
          // catalogStatus : '1'
        };
        this.$executeRequest
          .execByControllerMappingName("/N/N1001/queryByParentId", params)
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            val.children = [];
            for (var index in res.data) {
              if('3' != res.data[index].status && '' != res.data[index].status) {
                continue;
              }
              res.data[index].showLable = res.data[index].label
              res.data[index].code = res.data[index].code
              res.data[index].expanded = false
             if(res.data[index].status !== ''){
              res.data[index].type = 'text1'
             }else{
              res.data[index].type = 'text'
              
             }
              res.data[index].ID =  res.data[index].id
              res.data[index].id = uuidv4()
              res.data[index].children = []
              val.children.push(res.data[index]);
            }
          });
        this.title = val.label;
      }
      else if (val.type === 'text1') {
      this.node = val
      this.type = '表'
        this.title = val.label + "(" + val.code + ")";
        // 点击的为表时查询字段信息
        this.$executeRequest
          .execByControllerMappingName("/N/N1002/findDataAssetColumn",
            { assetId: val.ID, currPage: 1, pageSize: 99999 })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            val.children = [];
            for (var index in res.data.pageList) {
              res.data.pageList[index].ID =  res.data.pageList[index].col_id
              res.data.pageList[index].id = uuidv4()
              res.data.pageList[index].label = res.data.pageList[index].norm_col_cname
              res.data.pageList[index].name = res.data.pageList[index].norm_col_cname,
              res.data.pageList[index].showLable = res.data.pageList[index].norm_col_cname
              res.data.pageList[index].code = res.data.pageList[index].norm_col_ename
              res.data.pageList[index].type = 'text'
              val.children.push(res.data.pageList[index]);
            }
            console.log(val.children);
          });
        val.expanded = true;

        // 查询出资产类型为表的
       this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAsset", 
        {
          assetId : val.ID,
          currPage : 1,
          pageSize : 9999
        })
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          this.zd = res.data.pageList[0]
        });
      }
      else {
      this.node = val

      this.type = '字段'
      

        // 查询出资产类型为字段的
        this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAssetColumnById", 
        {
          colId : val.ID,
        })
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAsset", 
        {
          assetId : res.data.asset_id,
          currPage : 1,
          pageSize : 9999
        })
        .then((res1) => {
          if (res1.code != 999) {
            return;
          }
          this.title = res1.data.pageList[0].asset_cname + "(" + res1.data.pageList[0].asset_code + ")";
          this.zd = {
            ...res1.data.pageList[0] , ...res.data
          }
        });
        });

      }
    },
    findDataAsset(assetId) {
       this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAsset", 
        {
          assetId : assetId,
          currPage : 1,
          pageSize : 9999
        })
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          this.zd = res.data
        });
    },
    init(val) {     
      this.catalogId = val
      const params = {
        parentId: 0,
        catalogId : val,
        catalogStatus : '1'
      };  
      this.$executeRequest
        .execPostByControllerMapping("/N/N1001/queryByParentId", params)
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          this.treeData = [];
          for (var index in res.data) {
            res.data[index].showLable = res.data[index].label
            res.data[index].expanded = false
            res.data[index].ID =  res.data[index].id
            res.data[index].id = uuidv4()
            res.data[index].type = 'text'
            if (res.data[index].isLeaf == '0') {
              res.data[index].children = []
            }
            this.treeData.push(res.data[index]);
          }
        });
    },
  },
  created() {
 
    this.$executeRequest
        .execPostByControllerMapping("/N/N1001/findCatalog",{
          currPage : 1,
          pageSize : 9999
        })
        .then((res)=>{
          if(res.code === 999){
            for(var index in this.formItems) {
              if(this.formItems[index].prop == 'assetView') {
                this.formItems[index].options = []
                for(var index2 in res.data.pageList) {
                  this.formItems[index].options.push(
                    {
                      label : res.data.pageList[index2].catalog_name,
                      value : res.data.pageList[index2].catalog_id,
                    });
                }
              }
            }
            this.init(res.data.pageList[0].catalog_id);
          }
        })
    
    this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAssetDepart")
        .then((res)=>{
          if(res.code != 999){
            return;
          }
          for(var index in this.formItems) {
              if(this.formItems[index].prop == 'assetDepartment') {
                this.formItems[index].options = []
                for(var index2 in res.data) {
                  this.formItems[index].options.push(
                    {
                      label : res.data[index2].dep_name,
                      value : res.data[index2].dep_id,
                    });
                }
              }
            }
        })
    
  }
}
</script>

<style lang="less" scoped>
</style>