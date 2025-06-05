<template>
  <div class="assetCatalogManage h100 ">
    <div class="header " style="width: 100%;border-bottom: 1px solid #E3E4E5; ">
      <div class="btn mx-20 d-flex justify-content-between  ">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>类目</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.catalog_name }}</el-breadcrumb-item>
          <el-breadcrumb-item>配置资产</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="btnn">

          <el-button class="goBackBtn" @click="$router.go(-1)">返回</el-button>
        </div>

        <!-- <el-button   type="major" v-debounce>批量删除</el-button> -->
      </div>
    </div>
    <div class="main  d-flex" style="height: calc(100% - 46px)">
      <ByTree :data="treeData" class="h100" :expandAll="true" @detail="toDetail" @logDetail="toDetail" />
      <div class="flex-1" style="width: calc(100% - 295px)">
        <div class=" mx-20 flex-1">
          <ByQuickSearch :formItems="searchFormItems" @search="search" @reset="reset" :extraButton="extraButton"
            @btnClick="btnClick"></ByQuickSearch>
          <div v-if="Object.keys(node).length > 0" class="pt-10">
            <div class="d-flex justify-content-between">
              <ByContainerTitle :title="title" />
              <el-button type="primary" @click="save">保存</el-button>
            </div>

            <ByTable @sizeChange="sizeChange" :pagination="pagination" @currentChange="currentChange"
              @handleMultiple="handleMultiple" :columnArr="columnArr" ref="multipleTable" :tableData="tableData"
              class="pt-10" />
          </div>
          <div v-else style="height: calc(100% - 38px)">
            <ByEmpty />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  treeData, searchFormItems,
  extraButton, formItems, columnArr, tableData
} from "./mock";
import { dateFormat, hourFormat } from '@/utils/dateconversion'

export default {
  name: "assetCatalogManage",
  data() {
    return {
      treeData,
      formItems,
      formData: {
        metadata: "",
        type: "",
      },
      bc: null,
      columnArr,
      searchFormItems,
      extraButton,
      tableData,
      title: "", //标题
      node: {},
      selectAsset: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
        total: 1,
      },
    };
  },
  methods: {

    currentChange(val) {

      this.pagination.pageNum = val;
      this.pagination.pageSize = 10;
      this.search({});
    },
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.search({});
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
          let str = arr.join(',')
          this.$Msg
            .confirmMsg("确定批量删除吗")
            .then(() => {
              this.$executeRequest
                .execPostByControllerAllMappingName("/N/N1002/deleteDataAsset", arr)
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
    search(val) {
      let params = {
        assetId: 0,
        assetCode: val.assetCode || null,
        assetName: val.assetTitle || null,
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findDataAsset", params)
        .then((res) => {
          if (res.code === 999) {
            this.node = res.data.pageList;
            res.data.pageList.forEach((item) => {
              item.asset_date = dateFormat(item.asset_date)
            })
            this.node = res.data.pageList
            function roundUpToNearestMultiple(num) {
              if (num > 50) {
                return Math.ceil(num / 50) * 50;
              } else {
                return 50;
              }
            }
           let result = roundUpToNearestMultiple(res.data.totalSize);
            console.log(result); // 输出：100
            this.pagination.pageSizes[4] = result
            this.pagination.total = res.data.totalSize
            this.tableData = res.data.pageList

          }
        })
    },
    reset() {
      this.formData = {
        assetCode: "",
        assetTitle: "",
      };
    },
    handleMultiple(val) {
      this.selectAsset = val;
      console.log(val);
    },
    save() {
      console.log(this.selectAsset, this.bc);
      if (this.bc) {
        var dataAssetRegistVoList = [];
        for (var index in this.selectAsset) {
          dataAssetRegistVoList.push(
            {
              mdata_table_id: this.selectAsset[index].mdata_table_id,
              asset_ename: this.selectAsset[index].asset_ename,
              asset_cname: this.selectAsset[index].asset_cname,
              asset_type: this.selectAsset[index].asset_type,
            });
        }
        this.$executeRequest.execPostByUrl2("/N/N1002/addDirAndAssetRel",
          {
            dirId: this.bc,
            dataAssetRegistVoList: dataAssetRegistVoList
          })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            this.$Msg.customizTitle("保存成功!", "success");
            this.init()
          });
      } else {
        this.$Msg.customizTitle("请选择目录", "warning");
      }

    },
    toDetail(val) {
      // 目录
      if (val.isLeaf == '0') {
        // 目录数据
        this.title = val.label;

        const params = {
          parentId: val.id,
          catalogId: this.catalogId
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

              if (res.data[index].isLeaf === '1') {
                res.data[index].type = 'text1'
              } else {
                res.data[index].type = 'text'
              }
              res.data[index].children = []
              val.children.push(res.data[index]);
            }
          });

        // 表格数据
        this.$executeRequest
          .execByControllerMappingName("/N/N1002/queryByDirId",
            { dirId: val.id })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            for (var index in res.data) {
              res.data[index].asset_cname = res.data[index].asset_ename
              res.data[index].asset_ename = res.data[index].asset_cname
              res.data[index].asset_type = res.data[index].asset_type
              res.data[index].asset_code = res.data[index].asset_code
            }
            this.node = val
            // this.tableData = res.data
            this.bc = this.node.id
            this.tableData.forEach((tItem) => {
              this.$refs.multipleTable.$refs.table.toggleRowSelection(tItem, false)
            })
            if (res.data.length !== 0) {
              res.data.forEach((item) => {
                this.tableData.forEach((tItem) => {
                  if (item.asset_id === tItem.asset_id) {
                    this.$refs.multipleTable.$refs.table.toggleRowSelection(tItem, true)
                  }
                })

              })
            }


          });

      }
      else if (val.isLeaf == '1') {
        this.$executeRequest
          .execByControllerMappingName("/N/N1002/findDataAssetColumn",
            { assetId: val.id, currPage: 1, pageSize: 99999 })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            val.children = [];
            for (var index in res.data.pageList) {
              res.data.pageList[index].id = res.data.pageList[index].col_id
              res.data.pageList[index].label = res.data.pageList[index].col_ename + res.data.pageList[index].col_cname
              res.data.pageList[index].showLable = res.data.pageList[index].col_cname || res.data.pageList[index].col_ename

              res.data.pageList[index].code = res.data.pageList[index].col_ename
              res.data.pageList[index].expanded = false
              res.data.pageList[index].type = 'text'
              res.data.pageList[index].disabled = true
              val.children.push(res.data.pageList[index]);
            }
            this.sjzczd = val.children
            this.bc = null
          });

        val.expanded = true
      }

    },
    init() {
      const params = {
        parentId: 0,
        catalogId: this.catalogId,
        catalogStatus: '1'

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
            res.data[index].type = 'text'
            if (res.data[index].isLeaf == '0') {
              res.data[index].children = []
            }
            this.treeData.push(res.data[index]);
          }
        });

      this.$executeRequest
        .execPostByControllerMapping("/N/N1002/findMetaDataSource")
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          var sourceIdOptions = [];
          for (var index in res.data) {
            res.data[index].showLable = res.data[index].label
            res.data[index].expanded = false
            res.data[index].type = 'text'
            if (res.data[index].isLeaf == '0') {
              res.data[index].children = []
            }
            sourceIdOptions.push(
              {
                value: res.data[index].source_id,
                label: res.data[index].source_name
              }
            );
          }
          for (var index in this.formItems) {
            if ('source_id' == this.formItems[index].prop) {
              this.formItems[index].options = sourceIdOptions;
            }
          }
        });
      this.search({})
    },
  },
  created() {
    this.catalogId = this.$route.query.catalog_id;
    this.init();
  },
  watch: {
    tableData: {
      handler(val, oldVal) {
        this.$nextTick(() => {
          this.tableData.forEach((item) => {
            if (item.isConfig === '1') {
              this.$refs.multipleTable.$refs.table.toggleRowSelection(item, true)
            }
          })
        })
      },
      deep: true,
    },
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-button {
  padding: 8px 16px;
}

.btn {
  .el-breadcrumb {
    line-height: 46px !important;
  }

  /deep/.el-button {
    margin-top: 14px;
  }
}

.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-family: SourceHanSansCNVF-Regular, SourceHanSansCNVF;
}

.backWrap {
  border-bottom: @border-common;
}
</style>