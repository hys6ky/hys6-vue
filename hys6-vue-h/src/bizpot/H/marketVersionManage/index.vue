<template>
  <div id='bbgl'>
    <el-row class='topTitle'>
      <span class='el-icon-location'>加工版本管理</span>
      <!--<router-link to="/collectmonitor">
        <el-button type="primary" size="small" class="goIndex">
          <i class="fa fa-home fa-lg"></i>返回首页
        </el-button>
      </router-link>-->
    </el-row>
    <el-row :gutter='20'>
      <el-col :span="6">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini"/>
        <div class='mytree'>
          <el-tree accordion class="filter-tree" :data="versionManageTreeData" :indent="0"
                   :filter-node-method="filterNode" ref="tree" node-key="id">

            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="data.description"
                    v-if="data.file_id && data.file_id !== '' && data.tree_page_source === 'market_version_manage'">
                <el-checkbox @change="choiceCheck($event, data)" v-model="data.ischoice" :key='data.id'></el-checkbox>
                {{ node.label.substring(0, 4) }}-{{ node.label.substring(4, 6) }}-{{ node.label.substring(6, 8) }}
              </span>
              <span :title="data.description"
                    v-else-if="data.file_id && data.file_id !== '' && data.tree_page_source !== 'market_version_manage'">
                <i class="el-icon-document"/>
                <template v-if="data.original_name && data.original_name !== ''">{{
                    data.original_name
                  }}</template>
                <template v-else-if="data.original_name === '' && data.table_name !== ''">{{
                    data.table_name
                  }}</template>
                <template v-else>{{ data.hyren_name }}</template>
              </span>
              <span :title="data.description" v-else>
                <i class="el-icon-folder-opened"/>
                {{ node.label }}
              </span>
            </span>
          </el-tree>
                  </div>
      </el-col>
      <el-col :span="18">
        <el-tabs v-model="activeName" type="border-card" @tab-click='tabClick'>
          <el-tab-pane label="数据结构对比" name="first">
            <div class="text item">
              <div class='bd contrast'>
                <el-row type="flex" justify="start" :gutter="2">
                  <el-col>
                    <div class="ctxt">
                      <el-table :data="tableStructureInfo" style='min-height:400px'>
                        <el-table-column v-for="(item, index) in tableVersionData" :key="index" :label="processingDate(item)" align="center" show-overflow-tooltip>
                          <el-table-column label="中文" :prop="'field_cn_name' + item" align="center"
                                           show-overflow-tooltip>
                            <template slot-scope="scope">
                              <p v-if="scope.row['cn_is_same' + item] === '0'" style="color: red">{{ scope.row['field_cn_name' +
                              item] }}</p>
                              <p v-else-if="scope.row['field_cn_name_flag' + item] === '1'" style="color: red">{{ scope.row['field_cn_name' +
                              item] }}</p>
                              <p v-else>{{ scope.row['field_cn_name' + item] }}</p>
                            </template>
                          </el-table-column>
                          <el-table-column label="英文" :prop="'field_en_name' + item" align="center"
                                           show-overflow-tooltip>
                            <template slot-scope="scope">
                              <p v-if="scope.row['en_is_same' + item] === '0'" style="color: red">{{ scope.row['field_en_name' +
                              item] }}</p>
                              <p v-else-if="scope.row['field_en_name_flag' + item] === '1'" style="color: red">{{ scope.row['field_en_name' +
                              item] }}</p>
                              <p v-else>{{ scope.row['field_en_name' + item] }}</p>
                            </template>
                          </el-table-column>
                          <el-table-column label="类型" :prop="'field_type' + item" align="center"
                                           show-overflow-tooltip>
                            <template slot-scope="scope">
                              <p v-if="scope.row['type_is_same' + item] === '0'" style="color: red">{{ scope.row['field_type' +
                              item] }}
                                {{ scope.row['field_length' + item] }}</p>
                              <p v-else-if="scope.row['field_type_flag' + item] === '1'" style="color: red">{{ scope.row['field_type' +
                              item] }}
                                {{ scope.row['field_length' + item] }}</p>
                              <p v-else>{{ scope.row['field_type' + item] }} {{ scope.row['field_length' + item] }}</p>
                            </template>
                          </el-table-column>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="数据mapping对比" name="second" v-if="versionType">
            <div class="text item">
              <div class='bd contrast'>
                <el-table :data="tableMappingData" border style='min-height:400px'>
                  <el-table-column v-for="(item, index) in mappingVersionData" :key="index"
                                   :label="item.substring(0, 4) + '-' + item.substring(4, 6) + '-' + item.substring(6, 8)"
                                   align="center">
                    <template slot-scope="scope">
                      <SqlEditor class='textasql CodeMirror' :ref="'sqleditor' + item" :readOnly='true' :lineNumbers='false' :key="scope.row.id"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane> -->

          <el-tab-pane :label="tableName" :name="tableName" v-for="(tableName,index) in tableMappingDataTables" :key="tableName">
            <div class="text item">
              <div class='bd contrast'>
                <el-table :data="tableMappingData[tableName]" border style='min-height:400px'>
                <!-- <el-table  border style='min-height:400px'> -->
                  <el-table-column v-for="(value,date) in tableMappingData[tableName][0]"
                                  :prop="date"
                                   :label="date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)"
                                   align="center">
                    <template slot-scope="scope">
                      <SqlEditor :ref="'sqleditor_' +tableName+ '_'+date" :readOnly='true' :lineNumbers='false' class='textasql CodeMirror'/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SqlEditor from './components/SqlEditor.vue'
import sqlFormatter from 'sql-formatter'

export default {
  components: {
    SqlEditor
  },
  data() {
    return {
      //搜索框
      filterText: '',
      //页面默认显示数据结构对比标签
      activeName: 'first',
      //表结构信息对比变量
      tableStructureInfo: [],
      tableVersionData: [],
      mappingVersionData: [],
      //版本管理树数据
      versionManageTreeData: [],
      //模型数据表id
      datatable_id: null,
      //版本日期数组变量 勾选的日期
      // version_date_s: [],
      // 已选节点
      selectedNode:[],
      // 集市表名称集合
      tableMappingDataTables:[],
      // 集市表及其日期，结构：{tableName1:[99991231,20121221]}
      tableMappingDataStruct:{},
      //表Mapping信息变量
      tableMappingData: [],


      chioceId: '',
      version_date_id: [], //存树勾选的id
      versionType: true
    }
  },
  created() {
    //页面初始化时获取源数据列表树
    this.getMarketVerManageTreeData();
  },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    butC(){
      this.columns[this.columns.length] = "t"+this.columns.length;
      this.data[0][this.columns[this.columns.length-1]] = this.columns.length;
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
    tabClick(tab,event) {
      this.getDataTableMappingInfos()
    },
    //获取集市版本树菜单数据
    getMarketVerManageTreeData() {
      this.$executeRequest.execGetByModulName('/marketVersionManage/getMarketVerManageTreeData').then(res => {
        this.versionManageTreeData = res.data;
      });
    },
    //树循环递归
    treeForeach(tree, func) {
      tree.forEach(data => {
        func(data)
        data.children && this.treeForeach(data.children, func) // 遍历子树
      })
    },
    // 取消勾选
    cancelChoice(array){
      for(var i =0;i<array.length;i++){
        array[i].ischoice = false;
        if(array[i].children != null && array[i].children.length > 0){
          this.cancelChoice(array[i].children);
        }
      }
    },
    // 勾选
    choiceCheckTrue(data){
      // 是否首次勾选：如是-记录模型表id，清空日期列表后添加当前日期到列表；如否：判断是否同一模型表：如是-添加日期到列表；如否-重新记录模型表id，清空日期列表后添加日期到列表，并取消勾选，并提示切换模型表，并切换结构表
      if(this.datatable_id == null){
        this.datatable_id = data.parent_id;
        // this.version_date_s = [data.label];
        this.selectedNode = [data];
      }else if(this.datatable_id == data.parent_id){
        // this.version_date_s.push(data.label);
        this.selectedNode.push(data)
      }else{
        this.datatable_id = data.parent_id;
        // this.version_date_s = [data.label];
        // 取消所有勾选 && 重新勾选当前节点
        // this.cancelChoice(this.versionManageTreeData)
        for(var i = 0 ;i<this.selectedNode.length;i++){
          this.selectedNode[i].ischoice = false;
        }
        data.ischoice = true;
        this.selectedNode = [data];
        this.activeName = "first  "
        this.$Msg.customizTitle("已切换模型表，清空其它选择");
      }
      // 排序日期列表-倒叙排序
      this.selectedNode.sort(function(a,b){return b.label-a.label;})
      // this.version_date_s.sort(function(a,b){return b-a;})
      // 刷新结构页和sql页面
      // if(this.datatable_id != null && this.version_date_s != null && this.version_date_s.length > 0){
      if(this.datatable_id != null && this.selectedNode != null && this.selectedNode.length > 0){
        this.getDataTableStructureInfos()
        this.getDataTableMappingInfos()
      }
    },
    // 取消勾选
    choiceCheckFalse(data){
      // 判断已选模型表是否存在，是否与当前模型表相同，如不存在或不同，提示错误并退出
      if(this.datatable_id == null || this.datatable_id != data.parent_id){
        this.$Msg.customizTitle("异常操作：只可操作当前模型表的版本");
        return;
      }
      // 判断已选日期列表中是否有当前日期，如无：提示错误并退出;如有，从列表中删除该日期
      // if(this.version_date_s.indexOf(data.label)<0){
      var labelIndexOf = -1;
      for(var i = 0 ;i<this.selectedNode.length;i++){
        if(this.selectedNode[i].label == data.label){
          labelIndexOf = i;
        }
      }
      if(labelIndexOf<0){
        this.$Msg.customizTitle("异常操作：未选择该版本");
        return;
      }else{
        // this.version_date_s.splice(this.version_date_s.indexOf(data.label),1);
        this.selectedNode.splice(labelIndexOf,1);
      }
      // 判断日期列表是否为空，如是，将 模型表置为 null，返回结构页面
      // if(this.version_date_s.length ==0){
      if(this.selectedNode.length == 0){
        this.datatable_id = null;
        this.activeName = "first"
      }
      data.ischoice = false;

      // 刷新结构页和sql页面
      // if(this.datatable_id != null && this.version_date_s != null && this.version_date_s.length > 0){
      if(this.datatable_id != null && this.selectedNode != null && this.selectedNode.length > 0){
        this.getDataTableStructureInfos()
        this.getDataTableMappingInfos()
      }else{
          this.tableStructureInfo = []
          this.tableVersionData = []
          this.tableMappingDataTables= [];
          this.tableMappingDataStruct = {};
          this.tableMappingData = {}

      }
    },
    //点击源数据管理树节点触发
    choiceCheck(e, data) {
      // 根据勾选还是取消勾选进入不同逻辑
      if(e){
        this.choiceCheckTrue(data);
      }else{
        this.choiceCheckFalse(data);
      }

    },
    //处理显示日期
    processingDate(item) {
      if (item === '00000000') {
        return item.substring(0, 4) + '-' + item.substring(4, 6) + '-' + item.substring(6, 8) + ' (该版本未成功运行)'
      } else {
        return item.substring(0, 4) + '-' + item.substring(4, 6) + '-' + item.substring(6, 8)
      }
    },
    // 获取数据表结构数据方法
    getDataTableStructureInfos() {
      let params = {}
      params["datatable_id"] = this.datatable_id;
      params["version_date_s"] = [];
      for(var i =0;i<this.selectedNode.length;i++){
        params["version_date_s"].push(this.selectedNode[i].label);
      }
      this.$executeRequest.execPostByModulName('/marketVersionManage/getDataTableStructureInfos', params).then(res => {
        if (res && res.success) {
          this.tableStructureInfo = []
          this.tableVersionData = []
          for (const key in res.data) {
            this.tableVersionData.push(key)
            for (let i = 0; i < res.data[key].length; i++) {
              if (this.tableStructureInfo.length < res.data[key].length) {
                this.tableStructureInfo.push({})
              }
              this.tableStructureInfo[i]['field_cn_name' + key] = res.data[key][i].field_cn_name_map.field_cn_name
              this.tableStructureInfo[i]['field_en_name' + key] = res.data[key][i].field_en_name_map.field_en_name
              this.tableStructureInfo[i]['field_type' + key] = res.data[key][i].field_type_map.field_type
              let field_length = res.data[key][i].field_type_map.field_length;
              if (field_length == null || field_length === '--' || field_length === '') {
                field_length = ''
              } else {
                field_length = '(' + res.data[key][i].field_type_map.field_length + ')'
              }
              this.tableStructureInfo[i]['field_length' + key] = field_length
              this.tableStructureInfo[i]['cn_is_same' + key] = res.data[key][i].field_cn_name_map.is_same
              this.tableStructureInfo[i]['en_is_same' + key] = res.data[key][i].field_en_name_map.is_same
              this.tableStructureInfo[i]['type_is_same' + key] = res.data[key][i].field_type_map.is_same
            }
          }
          //此时this.tableStructureInfo里面已经有所有版本的数据信息,此时进行对比操作
          //创建中文名称,英文名称，字段类型标志数组
          let cn_flag_array = [];
          let en_flag_array = [];
          let type_flag_array = [];
          for (let j = 0; j < this.tableStructureInfo.length; j++){
            //创建Set集合用于去重
            let cn_set = new Set();
            let en_set = new Set();
            let type_set = new Set();
            this.tableVersionData.forEach(date => {
              //获取数据
              cn_set.add(this.tableStructureInfo[j]['field_cn_name' + date]);
              en_set.add(this.tableStructureInfo[j]['field_en_name' + date]);
              type_set.add(this.tableStructureInfo[j]['field_type' + date]);
            });
            if (cn_set.size > 1){
              //有不同数据,进行标注
              cn_flag_array.push(j + '-'+ 'field_cn_name');
            }
            if (en_set.size > 1){
              //有不同数据,进行标注
              en_flag_array.push(j + '-'+ 'field_en_name')
            }
            if (type_set.size > 1){
              //有不同数据,进行标注
              type_flag_array.push(j + '-'+ 'field_type')
            }
          }
          if (cn_flag_array.length > 0){
            cn_flag_array.forEach(flag => {
              let flagArr = flag.split('-');
              //获取下标和字段
              let index = flagArr[0];
              let col = flagArr[1];
              //根据下标获取指定数据行,标注不同数据
              this.tableVersionData.forEach(date => {
                this.tableStructureInfo[index][col +'_flag'+ date] = '1';
              })
            })
          }
          if (en_flag_array.length > 0){
            en_flag_array.forEach(flag => {
              let flagArr = flag.split('-');
              //获取下标和字段
              let index = flagArr[0];
              let col = flagArr[1];
              //根据下标获取指定数据行,标注不同数据
              this.tableVersionData.forEach(date => {
                this.tableStructureInfo[index][col +'_flag'+ date] = '1';
              })
            })
          }
          if (type_flag_array.length > 0){
            type_flag_array.forEach(flag => {
              let flagArr = flag.split('-');
              //获取下标和字段
              let index = flagArr[0];
              let col = flagArr[1];
              //根据下标获取指定数据行,标注不同数据
              this.tableVersionData.forEach(date => {
                this.tableStructureInfo[index][col +'_flag'+ date] = '1';
              })
            })
          }
        }
      });
    },
    // 获取数据表Mapping数据方法
    getDataTableMappingInfos() {
      let params = {}
      this.mappingVersionData = [];
      params["datatable_id"] = this.datatable_id;
      // params["version_date_s"] = this.version_date_s;
      params["version_date_s"] = [];
      for(var i =0;i<this.selectedNode.length;i++){
        params["version_date_s"].push(this.selectedNode[i].label);
      }
      this.$executeRequest.execPostByModulName('/marketVersionManage/getDataTableMappingInfos', params).then(res => {
        if(res && res.data){
          this.tableMappingDataTables= [];
          this.tableMappingDataStruct = {};
          this.tableMappingData = res.data;
          this.$nextTick(()=>{

            for(var tableName in this.tableMappingData){

              var dateToSql = this.tableMappingData[tableName];
              var dates= [];
              for(var date in dateToSql[0]){
                dates.push(date);
              }
              // 取出所有表名
              this.tableMappingDataTables.push(tableName);
              // 取出表名与结构
              this.tableMappingDataStruct[tableName] = dates;
            }

            this.$nextTick(()=>{
              for(var tableName in this.tableMappingData){
                for(var i =0 ;i<this.tableMappingDataStruct[tableName].length;i++){
                  var keys = "sqleditor_"+tableName+"_"+this.tableMappingDataStruct[tableName][i];
                  if(this.$refs[keys].length != 0){
                    // console.log("this.$refs["+keys+"][0].editor.setValue("+this.tableMappingData[tableName][0][this.tableMappingDataStruct[tableName][i]].execute_sql+")")
                    
                    var sql = this.tableMappingData[tableName][0][this.tableMappingDataStruct[tableName][i]].execute_sql;
                    // console.log(sql)
                    sql = sqlFormatter.format(sql);
                    // console.log(sql)
                    this.$refs[keys][0].editor.setValue(sql)
                  }

                }
              }
            })
          })


        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
.changered {
  color: #b70707
}

.markinden {
  text-indent: 2rem;
}

.redmarkinden {
  color: #b70707;
  text-indent: 2rem;
}

#bbgl {
  padding: 10px;

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

    // .el-tree-node__content {
    //   padding: 0 !important;
    // }

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

  .locationcenter {
    text-align: center;
    margin-top: 5px;
  }
}
.textasql .CodeMirror {
  height: 400px !important;
}
/deep/.CodeMirror {
  height: 300px;
  .CodeMirror-scroll .CodeMirror-line {
    white-space: pre;
  }
}

</style>
