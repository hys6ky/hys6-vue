<template>
  <div class="px-20 assets h100">
    <ByQuickSearch :formItems="searchFormItems" @search="search" @reset="reset" :extraButton="extraButton"
                   @btnClick="btnClick"></ByQuickSearch>
    <div style="height: calc(100% - 82px)" class="d-flex">
      <ByTree  @handCollapse="handCollapse" :defaultProps="defaultProps" :data="treeData" class="h100"
               :expandedKeys="expandedKeys" @detail="toDetail" @logDetail="toDetail" ref="tree" />
      <div class="flex-1 py-20 pl-20" v-if="Object.keys(node).length > 0" style="width: calc(100% - 295px)">
        <div class="d-flex align-items-center justify-content-between">
          <ByContainerTitle :title="title" />
          <!-- <el-button type="primary">保存</el-button> -->
        </div>
        <div class="table">
          <ByTable
              :pagination="pagination"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
              :columnArr="assetColumnArr" @handleMultiple="handleMultiple" :tableData="assetTableData" class="pt-10"
              @operateItem="operate" />
        </div>
      </div>
      <div v-else class="flex-1">
        <ByEmpty />
      </div>
    </div>
    <ByDrawer :visible.sync="visible" drawTitle="数据资产编辑" :drawWidth="1300" :drawFooter="false" @close="clone">
      <Info :djbtn="djbtn" :sjzcpd="sjzcpd" @gb="gb" :sjzczd="sjzczd" />
    </ByDrawer>
  </div>
</template>

<script>
import Info from "./components/info.vue";
import { v4 as uuidv4 } from "uuid";
import { dateFormat, hourFormat } from '@/utils/dateconversion'
import {
  searchFormItems,
  extraButton,
  assetColumnArr,
  assetTableData,
} from "./mock";
export default {
  components: { Info },
  name: "asset",
  data() {
    return {
      searchFormItems,
      bm : [],
      extraButton,
      djbtn: '完成登记',
      sjzcpd: null,
      deleteSelect: [],
      expandedKeys: [],
      sjzczd: [],
      defaultProps: {
        children: "children",
        label: "label",
        key: 'id'
      },
      sjzczd1: undefined,
      formData: {
        assetCode: "",
        assetTitle: "",
      },
      catalogId: '',
      treeData: [],
      title: "", //标题
      node: {},
      assetColumnArr,
      assetTableData,
      visible: false,
      sdelet: {},
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      table : []
    };
  },

  methods: {
    getMetaObjInfo() {
      const param = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      let tab = JSON.parse(JSON.stringify(this.table))
      console.log(tab);
      if(this.pagination.pageNum  === 1){
        this.assetTableData = tab.slice(0,this.pagination.pageSize)
      }else {
        this.assetTableData = tab.slice((this.pagination.pageNum - 1) * this.pagination.pageSize,(this.pagination.pageNum - 1) * this.pagination.pageSize + this.pagination.pageSize)
      }

      console.log(param);
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getMetaObjInfo();
    },
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getMetaObjInfo();
    },
    clone() {

      this.visible = false
    },
    handleMultiple(val) {
      this.deleteSelect = val
    },
    gb(val) {
      this.visible = val
      this.assetTableData = []
      this.node = {}
      this.init()
    },
    search(val) {
      this.title = ''

      let params = {
        assetId :0,
        assetCode: val.assetCode || null,
        assetName: val.assetTitle || null,
        currPage: 1,
        pageSize: 99999,
      }
      if(this.$route.query.id){
        if(params.assetCode !== null){
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]
                  this.assetTableData = dataTable
                  this.pagination.total = 0


                }
              })
        }else if(params.assetCode === null && params.assetName === null) {
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]

                  let table = []
                  let xgM = []
                  function bltable(data, arr) {
                    data.forEach((item) => {
                      if (item.file_id) {
                        arr.push(item)
                        xgM.push(item.id)
                      } else {
                        bltable(item.children, arr)
                      }
                    })
                  }
                  bltable(JSON.parse(JSON.stringify(this.treeData)), table)
                  let tarr =  table.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return arrM.indexOf(item.id) === -1
                  })
                  //  if(tarr.length !== 0){
                  //  }
                  dataTable =dataTable.filter((item)=>{
                    return xgM.indexOf(item.mdata_table_id) !== -1
                  })
                  dataTable = [ ...dataTable,...tarr]
                  this.pagination.total = dataTable.length
                  this.pagination.pageNum = 1
                  this.pagination.pageSize = 10
                  this.table = dataTable
                  this.assetTableData = dataTable.slice(0,10)


                }
              })
        } if(params.assetCode === null && params.assetName !== null){
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]
                  console.log(dataTable,arrM);
                  let table = []
                  function bltable(data, arr) {
                    data.forEach((item) => {
                      if (item.file_id) {
                        arr.push(item)
                      } else {
                        bltable(item.children, arr)
                      }
                    })
                  }
                  bltable(JSON.parse(JSON.stringify(this.treeData)), table)
                  let aarr =  table.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return item.label === params.assetName
                  })
                  let tarr =  aarr.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return arrM.indexOf(item.id) === -1
                  })
                  dataTable = [ ...dataTable,...tarr]
                  this.pagination.total = 0
                  this.assetTableData = dataTable


                }
              })
        }

      }else {
        if(params.assetCode !== null){
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]
                  //         this.pagination.total = dataTable.length
                  // this.pagination.pageNum = 1
                  // this.pagination.pageSize = 10
                  // this.table = dataTable
                  this.pagination.total = 0
                  this.assetTableData = dataTable
                }
              })
        }else if(params.assetCode === null && params.assetName === null) {
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]
                  console.log(dataTable,arrM);
                  let table = []
                  function bltable(data, arr) {
                    data.forEach((item) => {
                      if (item.file_id) {
                        arr.push(item)
                      } else {
                        bltable(item.children, arr)
                      }
                    })
                  }
                  bltable(JSON.parse(JSON.stringify(this.treeData)), table)

                  let tarr =  table.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return arrM.indexOf(item.id) === -1
                  })
                  dataTable = [ ...dataTable,...tarr]
                  this.pagination.total = dataTable.length
                  this.pagination.pageNum = 1
                  this.pagination.pageSize = 10
                  this.table = dataTable
                  this.assetTableData = dataTable.slice(0,10)
                  // this.assetTableData = dataTable


                }
              })
        }else if(params.assetCode === null && params.assetName !== null){
          this.$executeRequest
              .execPostByControllerMapping("/N/N1002/findDataAsset", params)
              .then((res) => {
                if (res.code === 999) {
                  this.node = res.data.pageList;
                  res.data.pageList.forEach((item) => {
                    item.asset_date = dateFormat(item.asset_date)
                    item.asset_time = hourFormat(item.asset_time)
                    this.bm.forEach((item1)=>{
                      if(item1.dep_id === item.belong_depart){
                        item.belong_depart_name = item1.dep_name
                      }
                    })
                  })
                  let map = new Map();
                  let arrM = []
                  for (let item of res.data.pageList) {
                    if(item.mdata_table_id){
                      map.set(item.mdata_table_id, item);
                      arrM.push(item.mdata_table_id)
                    }else {
                    }
                  }
                  let dataTable = [...map.values()]
                  console.log(dataTable,arrM);
                  let table = []
                  function bltable(data, arr) {
                    data.forEach((item) => {
                      if (item.file_id) {
                        arr.push(item)
                      } else {
                        bltable(item.children, arr)
                      }
                    })
                  }
                  bltable(JSON.parse(JSON.stringify(this.treeData)), table)
                  let aarr =  table.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return item.label === params.assetName
                  })
                  let tarr =  aarr.filter((item) => {
                    item.asset_cname = item.asset_cname || item.label
                    item.asset_ename = item.asset_ename || item.table_name
                    item.asset_code = item.asset_code || null
                    item.belong_depart = item.belong_depart || null
                    item.asset_status = item.asset_status || '1'
                    item.asset_date = '-'
                    return arrM.indexOf(item.id) === -1
                  })
                  dataTable = [ ...dataTable,...tarr]
                  this.pagination.total = 0
                  this.assetTableData = dataTable


                }
              })
        }

      }

    },
    reset() {
      this.formData = {
        assetCode: "",
        assetTitle: "",
      };
    },
    toDetail(val) {
      // 目录
      if (val.parent_id === '0') {
        let table = []
        function bltable(data, arr) {
          data.forEach((item) => {
            if (item.file_id) {
              arr.push(item)
            } else {
              bltable(item.children, arr)
            }
          })
        }
        bltable(val.children, table)
        table.forEach((item) => {
          item.asset_cname = item.asset_cname || item.label
          item.asset_ename = item.asset_ename || item.table_name
          item.asset_code = item.asset_code || null
          item.belong_depart = item.belong_depart || null
          item.asset_status = item.asset_status || '1'
          item.asset_date = '-'
        })
        // this.title = val.label;
        // this.node = val
        // if (table.length === 0) {
        //   this.node = {}
        // }
        // this.assetTableData = table
      } else if ( !val.code && val.children.length !== 0 && val.file_id === null) {
        let str = []
        val.children.forEach((item) => {
          str.push(item.id)
        })
        this.$executeRequest
            .execPostByControllerAllMappingName("/N/N1002/queryByMdataId",
                str
            )
            .then((res) => {
              if (res.code === 999) {
                // 获取去重后的已登记资产
                let map = new Map();
                for (let item of res.data) {
                  map.set(item.mdata_table_id, item);
                }
                let dataTable = [...map.values()]
                // 点击目录下的资产
                let table = []
                let arrstr = []
                val.children.forEach((item) => {

                  if (dataTable.length === 0) {
                    table.push(item)
                  }else {
                    dataTable.forEach((dataitem) => {
                      if (item.id === dataitem.mdata_table_id) {
                        dataitem.asset_date = dateFormat(dataitem.asset_date)
                        dataitem.asset_time = hourFormat(dataitem.asset_time)
                        this.bm.forEach((item1)=>{
                          if(item1.dep_id === dataitem.belong_depart){
                            dataitem.belong_depart_name = item1.dep_name
                          }
                        })
                        arrstr.push(dataitem.mdata_table_id)
                        table.push(dataitem)
                      } else{

                      }
                    })
                  }
                })
                let table1 = []
                console.log(dataTable.length);
                if(dataTable.length !== 0){
                  table1 =  val.children.filter((item)=>{
                    return arrstr.indexOf(item.id) === -1
                  })
                }else {
                }
                console.log(table1);
                table = [ ...table,...table1]
                table.forEach((item)=>{
                  if(!item.id){
                    item.id = item.mdata_table_id
                  }
                })
                this.title = val.label;
                this.node = val
                if (table.length === 0) {
                  this.node = {}
                }
                //        let map1 = new Map();
                // for (let item of table) {
                //     map1.set(item.mdata_table_id, item);
                // }
                // let dataTable1 = [...map1.values()]
                this.pagination.total = table.length
                this.pagination.pageNum = 1
                this.pagination.pageSize = 10
                this.table = table
                this.assetTableData = table.slice(0,10)
              }
            })
      } else if (!val.code &&val.file_id !== null && val.asset_status === '1') {
        // // 元数据字段接口
        // this.$executeRequest
        //   .execGetByControllerMapping('/M/metaObjInfo/' + `${val.id}`)
        //   .then((res) => {
        //     if (res.code === 999) {
        //       val.children = [];
        //       for (var index in res.data.colQueryVoList) {
        //         res.data.colQueryVoList[index].id = res.data.colQueryVoList[index].dtl_id + res.data.colQueryVoList[index].obj_id
        //         res.data.colQueryVoList[index].label = res.data.colQueryVoList[index].col_ch_name
        //         res.data.colQueryVoList[index].code = res.data.colQueryVoList[index].col_en_name
        //         res.data.colQueryVoList[index].type = 'text'
        //         res.data.colQueryVoList[index].expanded = false
        //         val.children.push(res.data.colQueryVoList[index]);
        //       }

        // if(this.expandedKeys.indexOf(val.id) === -1){
        //   this.expandedKeys.push(val.id)
        // }else{
        //   this.expandedKeys = this.expandedKeys.filter((item)=>{
        //    return item !== val.id
        //   })
        //   this.$forceUpdate()
        // }
        //     }
        //   })

      } else if  (!val.code &&val.file_id !== null && val.asset_status !== '1'){
        // this.$executeRequest
        //       .execByControllerMappingName("/N/N1002/findDataAssetColumn",
        //         { assetId: val.id, currPage: 1, pageSize: 99999 })
        //       .then((res) => {
        //         if (res.code != 999) {
        //           return;
        //         }
        //         val.children = [];
        //         for (var index in res.data.pageList) {
        //           res.data.pageList[index].id = uuidv4()
        //           res.data.pageList[index].label = res.data.pageList[index].col_cname
        //           res.data.pageList[index].code = res.data.pageList[index].col_ename
        //           res.data.pageList[index].type = 'text'
        //           val.children.push(res.data.pageList[index]);
        //         }
        //       });
        //       if(this.expandedKeys.indexOf(val.id) === -1){
        //       this.expandedKeys.push(val.id)
        //     }else{
        //       this.expandedKeys = this.expandedKeys.filter((item)=>{
        //        return item !== val.id
        //       })
        //       this.$forceUpdate()
        //     }
      }else{
        console.log(val.code,"字段");
      }
    },
    operate(type, val) {
      this.sjzcpd = {}
      // this.getDataNun(val.id,val.label)
      this.$executeRequest
          .execGetByControllerMapping("/M/metaObjInfo/getDataNum",{
            id:val.id,
            tabName:val.asset_ename
          }).then(res =>{
        if(res && res.success){
          this.$set(this.sjzcpd,"data_num",res.data)
          // this.sjzcpd.data_num = res.data
        }
      })
      if (type === "edit" && val.asset_status === '1') {
        if(val.asset_id){
          val.id = val.asset_id
        }
        this.sjzcpd = JSON.parse(JSON.stringify(val))
        this.$executeRequest
            .execGetByControllerMapping('/M/metaObjInfo/' + `${val.id}`)
            .then((res) => {
              this.djbtn = '完成登记'
              this.sjzczd = res.data.colQueryVoList
              console.log(this.sjzczd )

              if (this.sjzcpd.tech_pk && typeof this.sjzcpd.tech_pk === 'string') {
                this.sjzcpd.tech_pk = this.sjzcpd.tech_pk.split(',')
              } else {
                this.sjzcpd.tech_pk = null
              }
              if (this.sjzcpd.layer && typeof this.sjzcpd.layer === 'string') {
                this.sjzcpd.layer = this.sjzcpd.layer.split(',')
              } else {
                this.sjzcpd.layer  = null
              }
              if (this.sjzcpd.belong_by && typeof this.sjzcpd.belong_by === 'string') {
                this.sjzcpd.belong_by = Number(this.sjzcpd.belong_by)
              }else {
                this.sjzcpd.belong_by =null
              }
              if (this.sjzcpd.manage_by && typeof this.sjzcpd.manage_by === 'string') {
                this.sjzcpd.manage_by = Number(this.sjzcpd.manage_by)
              }else {
                this.sjzcpd.manage_by = null
              }
              if (this.sjzcpd.tech_cname && typeof this.sjzcpd.tech_cname === 'string') {
                this.sjzcpd.tech_cname = this.sjzcpd.tech_cname.split(',')
              }else {
                this.sjzcpd.tech_cname = null
              }
              if (this.sjzcpd.business_pk && typeof this.sjzcpd.business_pk === 'string') {
                this.sjzcpd.business_pk = this.sjzcpd.business_pk.split(',')
              }
              if (this.sjzcpd.business_cname && typeof this.sjzcpd.business_cname === 'string') {
                this.sjzcpd.business_cname = this.sjzcpd.business_cname.split(',')
              }else{
                this.sjzcpd.business_cname= null
              }
              this.sjzcpd.asset_id = this.sjzcpd.asset_id || null
              this.sjzcpd.mdata_table_id = res.data.obj_id || null
              this.sjzcpd.dir_id = this.sjzcpd.dir_id || res.data.source_id
              delete this.sjzcpd.children
              if(this.title === '视图'){
                this.sjzcpd.asset_type = this.sjzcpd.asset_type || '2'
              }else if(this.title === '物化视图'){
                this.sjzcpd.asset_type = this.sjzcpd.asset_type || '2'

              }else if(this.title === '表信息'){
                this.sjzcpd.asset_type = this.sjzcpd.asset_type || '1'

              }
              if(this.$refs.tree.$refs.tree.getNode(val.parent_id).data.label === '表信息'){
                this.sjzcpd.asset_type = '1'
              }else if(this.$refs.tree.$refs.tree.getNode(val.parent_id).data.label === '视图'){
                this.sjzcpd.asset_type = '2'
              }else if(this.title === '物化视图'){
                this.sjzcpd.asset_type = '2'
              }

              this.sjzcpd.asset_date = '-'
              this.sjzcpd.asset_time = '-'
              this.sjzcpd.asset_by =  null
              console.log(this.sjzczd);
              this.sjzczd.forEach((item) => {
                item.standardName = '关联标准'
                item.col_cname = item.col_ch_name
                item.col_ename = item.col_en_name
                if(item.col_len ){
                  item.col_len = item.col_len.toString() || null
                }else {
                  item.col_len =  null

                }
                if(item.col_prec ){
                  item.col_prec = item.col_prec.toString() || null
                }else {
                  item.col_prec = null
                }
                item.mdata_col_id = item.dtl_id
                item.col_business = item.biz_desc
              })
              this.sjzcpd.manage_depart =  this.sjzcpd.manage_depart || null
              console.log( this.sjzcpd);
              this.visible = true;
              this.sjzczd1 = undefined
            })
      } else if (type === "edit" && val.asset_status !== '1') {
        this.sjzcpd = JSON.parse(JSON.stringify(val))

        this.$executeRequest
            .execByControllerMappingName("/N/N1002/findDataAssetColumn",
                {
                  assetId: val.asset_id
                  , currPage: 1, pageSize: 99999
                })
            .then((res) => {
              if(val.asset_status === '3'){
                this.djbtn = '更新版本'
              }else{
                this.djbtn = '完成登记'

              }
              this.sjzczd = res.data.pageList
              if (this.sjzcpd.tech_pk && typeof this.sjzcpd.tech_pk === 'string') {
                this.sjzcpd.tech_pk = this.sjzcpd.tech_pk.split(',')
              }
              if (this.sjzcpd.layer && typeof this.sjzcpd.layer === 'string') {
                this.sjzcpd.layer = this.sjzcpd.layer.split(',')
              }
              if (this.sjzcpd.belong_by && typeof this.sjzcpd.belong_by === 'string') {
                this.sjzcpd.belong_by = Number(this.sjzcpd.belong_by)
              }
              if (this.sjzcpd.manage_by && typeof this.sjzcpd.manage_by === 'string') {
                this.sjzcpd.manage_by = Number(this.sjzcpd.manage_by)
              }
              if (this.sjzcpd.tech_cname && typeof this.sjzcpd.tech_cname === 'string') {
                this.sjzcpd.tech_cname = this.sjzcpd.tech_cname.split(',')
              }
              if (this.sjzcpd.business_pk && typeof this.sjzcpd.business_pk === 'string') {
                this.sjzcpd.business_pk = this.sjzcpd.business_pk.split(',')
              }
              if (this.sjzcpd.business_cname && typeof this.sjzcpd.business_cname === 'string') {
                this.sjzcpd.business_cname = this.sjzcpd.business_cname.split(',')
              }
              this.sjzcpd.manage_depart =  this.sjzcpd.manage_depart || null

              this.sjzcpd.asset_date = this.sjzcpd.asset_date || '-'
              this.sjzcpd.asset_time = this.sjzcpd.asset_time || '-'
              this.sjzcpd.asset_by =  this.sjzcpd.asset_by || null
              if(this.title === '表信息'){
                this.sjzcpd.asset_type = '1'
              }else if(this.title === '视图'){
                this.sjzcpd.asset_type = '2'
              }else if(this.title === '物化视图'){
                this.sjzcpd.asset_type = '2'
              }
              this.sjzczd.forEach((item) => {
                item.standardName = '关联标准'
                if(item.col_len ){
                  item.col_len = item.col_len.toString() || null
                }else {
                  item.col_len =  null

                }
                if(item.col_prec ){
                  item.col_prec = item.col_prec.toString() || null
                }else {
                  item.col_prec = null
                }
              })
              this.visible = true;
              this.sjzczd1 = undefined
            })
      } else if (type === 'del') {
        if(val.asset_status === '1'){
          this.$Msg.customizTitle("未盘点不可删除", "warning")
          return
        }
        let assetIds = [val.asset_id]
        this.$executeRequest
            .execPostByControllerAllMappingName("/N/N1002/deleteDataAsset",
                assetIds)
            .then((res) => {
              if (res.code === 999) {
                this.title = ''
                this.search({})
                this.$executeRequest
                    .execPostByControllerMapping("/N/N1001/findCatalog", {
                      currPage: 1,
                      pageSize: 9999
                    })
                    .then((res) => {
                      if (res.code === 999) {
                        this.init(res.data.pageList[0].catalog_id);
                      }
                    })
                this.$Msg.customizTitle("删除成功", "success");

              }
            })
      }
    },
    getDataNun(obj_id,obj_name){
      debugger

    },
    handCollapse(id, node) {
      // node.expanded = false
      // this.expandedKeys.splice(this.expandedKeys.indexOf(id), 1)
    },
    btnClick(type) {
      console.log(type);
      if (type === "add") {

      } else if (type === 'delete') {
        if (this.deleteSelect.length === 0) {
          this.$Msg.customizTitle("请选择删除项", "warning");
        } else {
          let arr = []
          this.deleteSelect.forEach((item) => {
            arr.push(item.asset_id)
          })
          this.$Msg
              .confirmMsg("确定批量删除吗")
              .then(() => {
                this.$executeRequest
                    .execPostByControllerAllMappingName("/N/N1002/deleteDataAsset",
                        arr)
                    .then((res) => {
                      if (res.code === 999) {
                        this.$Msg.customizTitle("删除成功", "success");
                        this.node = {}
                        this.$executeRequest
                            .execPostByControllerMapping("/N/N1001/findCatalog", {
                              currPage: 1,
                              pageSize: 10
                            })
                            .then((res) => {
                              if (res.code === 999) {
                                this.init(res.data.pageList[0].catalog_id);
                              }
                            })
                      } else {
                        this.$Msg.customizTitle("删除失败", "error");

                      }

                    })
              })
              .catch(() => { });
          this.deleteSelect = []

        }

      }
    },
    init() {
      this.$executeRequest
          .execByUrl("/Base/departmentalList/getDepartmentInfo",{
            currPage : 1,
            pageSize : 999
          })
          .then((res)=>{
            this.bm = res.data.departmentInfos
          })
      // const params = {
      //     parentId: 0,
      //     catalogId: '1185979003278778368'
      //   };
      // this.$executeRequest
      //     .execByControllerMappingName("/N/N1001/queryByParentId", params)
      if (this.$route.query.id === undefined) {
        // 元数据接口
        this.$executeRequest
            .execGetByControllerMapping("/T/bizReq/getMetaTreeDataInfo?isPrco=0")
            .then((res) => {
              if (res.code != 999) {
                return;
              }
              function mybl(data) {
                data.forEach((item) => {
                  if(item.data_layer !== null){
                    item.type = 'text1'

                  }else{
                    item.type = 'text'

                  }
                  if (item.children.length >= 1) {
                    mybl(item.children)
                  }
                })
              }
              mybl(res.data)

              this.treeData = res.data;
              console.log( this.treeData);
            })
      }else{
        this.$executeRequest
            .execGetByControllerMapping("/T/taskDev/assign/treeTable?id="+`${this.$route.query.id}`)
            .then((res) => {
              if (res.code != 999) {
                return;
              }
              function mybl(data) {
                data.forEach((item) => {
                  if(item.data_layer !== null){
                    item.type = 'text1'

                  }else{
                    item.type = 'text'

                  }
                  if (item.children.length >= 1) {
                    mybl(item.children)
                  }
                })
              }
              mybl(res.data)

              this.treeData = res.data;

            })
      }

    },
  },
  watch : {

  },
  created() {

    // // 元数据字段接口
    // this.$executeRequest
    //   .execGetByControllerMapping("/M/metaObjInfo/7120234931728412672")
    // this.$executeRequest
    //   .execPostByControllerMapping("/N/N1001/findCatalog", {
    //     currPage: 1,
    //     pageSize: 10
    //   })
    //   .then((res) => {
    //     if (res.code === 999) {
    this.init();
    //   }
    // })

  }
};
</script>

<style lang="less" scoped></style>
