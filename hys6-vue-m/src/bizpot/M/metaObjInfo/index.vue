<template>
  <div class="metaObjInfo h100 d-flex">
    <div class="h100">
      <ByTree :data="metaDataTree" class="h100" @logDetail="detail" />
    </div>
    <div class="flex-1 h100 overflow-y-auto" style="width: calc(100% - 275px)">
      <div class="px-20" v-if="table.length > 0">
        <ByQuickSearch :formItems="formItems" @reset="reset" @search="search" />
        <div class="mt-20 d-flex justify-content-between">
          <ByContainerTitle :title="source_title" />
          <div>
            <el-button type="primary" v-if="false">批量对标</el-button>
            <el-button type="primary"  v-debounce @click="exportMateDataClick" >导出表信息</el-button>
          </div>

        </div>
        <div style="margin-top: 16px" class="pb-20">
          <ByTable
            :tableData="table"
            :columnArr="columnArr"
            :pagination="pagination"
            @operateItem="operateItem"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          />
        </div>
      </div>
      <div v-else class="h100">
        <ByEmpty />
      </div>
    </div>
    <ByDrawer
      :visible.sync="editVisible"
      drawTitle="表信息"
      :drawWidth="1000"
      @close="editVisible = false"
      @closed="editClosed"
    >
      <div style="padding: 0 20px 0 20px" class="drawerContent">
        <ByModelForm
          :formData="editModelFormData"
          :formItems="editModelFormItems"
          :formRules="editModelFormRules"
          :formConfig="editModelFormConfig"
          ref="editInfo"
        />
        <el-divider></el-divider>
        <div v-if="editModelFormData.type !== '2'">
          <div class="d-flex justify-content-between mb-20">
            <ByHeaderSlice title="表信息" />
            <div>
              <el-button type="primary" @click="history" > 历史版本 </el-button>
              <el-button type="primary" v-if="editModelFormData.type === '0' && false" >
                对标
              </el-button>
              <el-button type="primary" @click="compareHandler1"
                >版本对比</el-button
              >
            </div>
          </div>
          <div>
            <ByFormTable
              :formData="tableDataInfo"
              :columnArr="columnArrInfo"
              :operate="false"
              @operateItem="editOperateItem"
              ref="editTableInfo"
              formTableRef="editTableInfoForm"
            />
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-content-between mb-20">
            <ByHeaderSlice title="SQL信息" />
            <div>
              <el-button type="primary">版本对比</el-button>
            </div>
          </div>
          <div style="border: 1px solid #e3e4e5">
            <SqlEditor
              ref="sqlEdit"
              :value.sync="editFmSql"
              @changeTextarea="changeTextarea($event)"
              @editing="editing"
              style="height: 300px"
            />
          </div>
        </div>
      </div>
      <template slot="drawFoot">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm" v-debounce>
          确 定
        </el-button>
      </template>
    </ByDrawer>
    <ByModel
      :visible.sync="compareModel"
      modelTitle="版本对比"
      modelWidth="1200px"
      @close="compareModel = false"
      @closed="compareModelClosed"
    >
      <div style="padding: 0 20px 0 20px" class="compareBox">
        <div class="d-flex justify-content-between">
          <div class="d-flex font-12 align-items-center">
            <span class="fontweight-600">版本：</span>
            <el-checkbox-group v-model="compareListChoice">
              <el-checkbox
                v-for="item in compareList"
                :key="item"
                :label="item"
              >
                版本{{ item }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div>
            <el-button type="primary" @click="getCompareData(select_obj_id)">
              对比
            </el-button>
          </div>
        </div>
        <div style="overflow-x: auto">
          <div
            class="d-flex font-12 py-10 compareTitle"
            style="margin-left: 100px"
          >
            <span
              v-for="item in compareListChoice"
              :key="item"
              class="flex-1 contentWidth"
            >
              版本{{ item }}
            </span>
          </div>
          <div class="pb-10">
            <CompareContent :content="compareData" />
          </div>
        </div>
      </div>
      <template slot="modalFoot">
        <el-button @click="compareModel = false">取 消</el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  formItems,
  columnArr,
  editModelFormItems,
  editModelFormData,
  editModelFormConfig,
  editModelFormRules,
  tableDataInfo,
  columnArrInfo,
} from "./mock";
import { v4 as uuidv4 } from "uuid";
import { treeFindPath } from "@/utils/datahandler.js";
import SqlEditor from "@/components/SqlEditor.vue";
import CompareContent from "./components/compareContent.vue";
export default {
  name: "metaObjInfo",
  data() {
    return {
      metaDataTree: [],
      formItems: JSON.parse(JSON.stringify(formItems)),
      formSearchData: {
        en_name: "",
        ch_name: "",
        type: "",
      },
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      source_id: "", //选中数据源
      source_title: "",
      table: [],
      columnArr,
      options: [
        {
          value: "0",
          label: "表",
          type: "tblTaskQueryVoList",
        },
        {
          value: "1",
          label: "视图",
          type: "viewTaskQueryVoList",
        },
        {
          value: "2",
          label: "存储过程",
          type: "procTaskQueryVoList",
        },
        {
          value: "3",
          label: "物化视图",
          type: "meterViewTaskQueryVoList",
        },
      ],
      editVisible: false, //编辑弹窗
      editModelFormConfig,
      editModelFormItems,
      editModelFormRules,
      editModelFormData: JSON.parse(JSON.stringify(editModelFormData)),
      tableDataInfo: JSON.parse(JSON.stringify(tableDataInfo)),
      columnArrInfo,
      editFmSql: "",
      compareModel: false, //版本对比弹窗
      compareList: [], //对比列表
      compareListChoice: [], //对比列表选中
      fieldValidate: false,
      compareData: {},
      select_obj_id: "", //选中的obj_id
    };
  },
  components: {
    SqlEditor,
    CompareContent,
  },
  mounted() {
    this.getMetaDataSource();
  },
  methods: {
    getMetaDataSource() {
      let param = {
        currPage: 1,
        pageSize: 999,
        showTask: "1",
      };
      this.$executeRequest
        .execGetByControllerAllMappingName("/metaTask/metaDataSource", param)
        .then((res) => {
          if (res && res.success) {
            this.setTree(res.data.pageList);
          }
        });
    },
    //左侧树数据整理
    setTree(data) {
      let treeData = [];
      data.map((item) => {
        item.tblTaskQueryVoList.map((tabTask) => {
          tabTask.id = tabTask.task_id;
          tabTask.label = tabTask.task_name;
          tabTask.type = "text";
          tabTask.showLable = tabTask.task_name;
          tabTask.labelText = tabTask.task_name;
        });
        item.procTaskQueryVoList.map((tabTask) => {
          tabTask.id = tabTask.task_id;
          tabTask.label = tabTask.task_name;
          tabTask.type = "text";
          tabTask.showLable = tabTask.task_name;
          tabTask.labelText = tabTask.task_name;
        });
        item.viewTaskQueryVoList.map((tabTask) => {
          tabTask.id = tabTask.task_id;
          tabTask.label = tabTask.task_name;
          tabTask.type = "text";
          tabTask.showLable = tabTask.task_name;
          tabTask.labelText = tabTask.task_name;
        });
        item.meterViewTaskQueryVoList.map((tabTask) => {
          tabTask.id = tabTask.task_id;
          tabTask.label = tabTask.task_name;
          tabTask.type = "text";
          tabTask.showLable = tabTask.task_name;
          tabTask.labelText = tabTask.task_name;
        });
        let data = {
          id: item.source_id,
          label: item.source_name,
          showLable: item.source_name +(item.dslName ? " 【"+item.dslName+"】" : ''),
          labelText: item.source_name +(item.dslName ? " 【"+item.dslName+"】" : ''),
          type: "text",
          children: [
            {
              id: uuidv4(),
              value: "tblTaskQueryVoList",
              type: "text",
              label: "表信息 【" + (item.moiTblNum || 0) + "】",
              showLable: "表信息 【" + (item.moiTblNum || 0) + "】",
              labelText: "表信息 【" + (item.moiTblNum || 0) + "】",
              // children: item.tblTaskQueryVoList,
              children: [],
            },
            {
              id: uuidv4(),
              value: "procTaskQueryVoList",
              type: "text",
              label: "存储过程 【" + (item.moiProcNum || 0) + "】",
              // children: item.procTaskQueryVoList,
              children: [],
              showLable: "存储过程 【" + (item.moiProcNum || 0) + "】",
              labelText: "存储过程 【" + (item.moiProcNum || 0) + "】",
            },
            {
              id: uuidv4(),
              value: "viewTaskQueryVoList",
              type: "text",
              label: "视图 【" + (item.moiViewNum || 0) + "" + "】",
              showLable: "视图 【" + (item.moiViewNum || 0) + "" + "】",
              labelText: "视图 【" + (item.moiViewNum || 0) + "" + "】",
              // children: item.viewTaskQueryVoList,
              children: [],
            },
            {
              id: uuidv4(),
              value: "meterViewTaskQueryVoList",
              type: "text",
              label: "物化视图 【" + (item.moiMeterViewNum || 0) + "】",
              showLable: "物化视图 【" + (item.moiMeterViewNum || 0) + "】",
              labelText: "物化视图 【" + (item.moiMeterViewNum || 0) + "】",
              // children: item.meterViewTaskQueryVoList,
              children: [],
            },
          ],
        };
        treeData.push(data);
      });
      this.metaDataTree = treeData;
    },
    //点击树节点
    detail(val) {
      if (val.value) {
        this.formSearchData.type = this.options.find(
          (item) => item.type === val.value
        ).value;
        this.formItems.map((item) => {
          if (item.prop === "type") {
            item.value = this.formSearchData.type;
            item.disabled = true;
          }
        });
      } else {
        // this.source_id = val.id;
        this.formSearchData.type = "";
        this.formItems = JSON.parse(JSON.stringify(formItems));
      }
      this.source_title = treeFindPath(
        this.metaDataTree,
        (data) => data.id === val.id,
        "label"
      ).join(" > ");
      this.source_id = treeFindPath(
        this.metaDataTree,
        (data) => data.id === val.id,
        "id"
      )[0];
      this.pagination.pageNum = 1;
      this.pagination.pageSize = 10;
      this.getMetaObjInfo();
    },
    getMetaObjInfo() {
      const param = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        source_id: this.source_id,
        ...this.formSearchData,
      };
      this.$executeRequest
        .execGetByControllerAllMappingName("/metaObjInfo/", param)
        .then((res) => {
          if (res && res.success) {
            res.data.pageList.map((item) => {
              item.created_dateTime = this.$dateconversion.dateFormat(item.created_date)+" "+this.$dateconversion.hourFormat(item.created_time)
              item.update_dateTime = this.$dateconversion.dateFormat(item.updated_date)+" "+this.$dateconversion.hourFormat(item.updated_time)
              this.options.map((val) => {
                if (item.type === val.value) {
                  item.typeText = val.label;
                }
              });
            });
            this.table = res.data.pageList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    search(val) {
      this.formSearchData = val;
      this.getMetaObjInfo();
    },
    reset(val) {
      this.formSearchData = val;
    },
    operateItem(type, row) {
      switch (type) {
        case "edit":
          this.editHandler(row);
          break;
        case "version":
          this.compareHandler(row);
          break;
        case "history":
          this.historyHandler(row);
          break;
      }
    },
    history() {
      console.log(this.editModelFormData);
      this.historyHandler(this.editModelFormData);
    },
    //编辑
    editHandler(row) {
      this.$executeRequest
        .execGetByControllerAllMappingName(`/metaObjInfo/${row.obj_id}`)
        .then((res) => {
          if (res && res.success) {
            this.editModelFormData = {
              en_name: res.data.en_name,
              ch_name: res.data.ch_name,
              type: res.data.type,
              source_name: res.data.source_name,
              version: res.data.version,
              updated_time: this.$dateconversion.dateToMilldate(res.data.updated_date+ ' ' +res.data.updated_time) ,
              obj_id: res.data.obj_id,
            };

            this.options.map((val) => {
              if (this.editModelFormData.type === val.value) {
                this.editModelFormData.type_text = val.label;
              }
            });
            if (this.editModelFormData.type !== "2") {
              this.tableDataInfo.tableData = res.data.colQueryVoList;
            } else {
              this.editFmSql = res.data.funcQueryVo?.fm_sql || "";
            }
            // console.log(res.data.colQueryVoList);
            // console.log(res.data.funcQueryVo);
            this.editVisible = true;
          }
        });
    },
    exportMateDataClick(){
      if (this.source_id !== null && this.source_id != undefined){
        this.$executeRequest.downloadGetFileAllMappingNameParams("/M/metaObjInfo/export",{source_id: this.source_id}).then(res =>{
          // if (res ){
          const blob = res;
          let fileName = "元数据表信息.xlsx";
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
          this.$Msg.customizTitle("导出成功", "success");
        })
      }
    },
    //确认编辑
    editConfirm() {
      debugger
      const list = [
        this.$refs.editInfo.$refs.editForm.validate(),
      ];
      if (this.editModelFormData.type !== '2'){
        list.push(this.$refs.editTableInfo.$refs.editTableInfoForm.validate())
      }
      Promise.all(list).then(async (res) => {
        if (res.every((item) => item)) {
          const infoParams = {
            obj_id: this.editModelFormData.obj_id,
            ch_name: this.editModelFormData.ch_name,
          };
          if (this.editModelFormData.type !== "2") {
            const tblColSaveVoList = this.tableDataInfo.tableData.map(
              (item) => {
                return {
                  dtl_id: item.dtl_id,
                  col_ch_name: item.col_ch_name,
                };
              }
            );
            infoParams.tblColSaveVoList = tblColSaveVoList;
          } else {
            infoParams.fm_sql = this.editFmSql;
          }
          this.$executeRequest
            .execPutByControllerAllMappingName("/metaObjInfo/", infoParams)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("保存成功!", "success");
                this.editVisible = false;
              }
            });
        }
      });
    },
    editClosed() {
      this.editModelFormData = JSON.parse(JSON.stringify(editModelFormData));
      this.tableDataInfo = JSON.parse(JSON.stringify(tableDataInfo));
      this.editFmSql = "";
    },
    //编辑sql
    changeTextarea(val) {
      this.editFmSql = val;
    },
    editing(val) {
      this.editFmSql = val;
    },
    //编辑表格操作
    editOperateItem(type, row, index) {
      switch (type) {
        case "viewStandard":
          this.viewStandardHandler(row);
          break;
        case "saveSingle":
          this.saveSingleHandler(row, index);
          break;
      }
    },
    //查看标准元
    viewStandardHandler(row) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/normbasic/getDbmNormbasicInfoById",
          { basic_id: row.dtl_id }
        )
        .then((res) => {
          if (res && res.success) {
            console.log(res);
          }
        });
    },
    //单行保存
    saveSingleHandler(row, index) {
      this.$refs.editTableInfo.$refs.editTableInfoForm.validateField(
        [`tableData.${index}.col_ch_name`],
        (valid) => {
          if (valid.length === 0 && !this.fieldValidate) {
            const params = {
              dtl_id: row.dtl_id,
              col_ch_name: row.col_ch_name,
            };
            this.fieldValidate = true;
            setTimeout(() => {
              this.fieldValidate = false;
            }, 1000);
            this.$executeRequest
              .execPutByControllerAllMappingName("/metaObjInfo/col", params)
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("保存成功!", "success");
                }
              });
            return;
          }
        }
      );
    },
    //版本对比
    compareHandler(row) {
      this.getVersionList(row.version);
      this.getCompareData(row.obj_id);
      this.select_obj_id = row.obj_id;
    },
    //版本对比
    compareHandler1() {
      this.getVersionList(this.editModelFormData.version);
      this.getCompareData(this.editModelFormData.obj_id);
      this.select_obj_id = this.editModelFormData.obj_id;
    },
    getCompareData(obj_id) {
      const params = {
        obj_id,
        versions: JSON.parse(JSON.stringify(this.compareListChoice)).join(","),
      };
      this.$executeRequest
        .execGetByControllerAllMappingName(
          "/metaObjInfo/version/compare",
          params
        )
        .then((res) => {
          if (res && res.success) {
            const { data } = res;
            let en_name = [];
            let ch_name = [];
            let type = "";
            let colQueryVoList = [];
            let funcQueryVo = [];
            let list = [];
            data.map((item) => {
              en_name.push(item.en_name);
              ch_name.push(item.ch_name);
              type = item.type;
              if (item.type !== "2") {
                item.colQueryVoList.map((v) => {
                  list.push(v);
                });
              } else {
                funcQueryVo.push(item?.funcQueryVo?.fm_sql || "--");
              }
            });
            let newColQueryVoList = this.getNewData(list, "col_ord_position"); //按照col_ord_position分组
            newColQueryVoList.map((item, index) => {
              let obj = {
                col_en_name: [],
                col_ch_name: [],
                col_type: [],
                col_len: [],
              };
              item.data.map((v) => {
                obj.col_en_name.push(v.col_en_name);
                obj.col_ch_name.push(v.col_ch_name);
                obj.col_type.push(v.col_type);
                obj.col_len.push(v.col_len);
              });
              colQueryVoList[index] = obj;
            });
            this.compareData = {
              en_name,
              ch_name,
              type,
              colQueryVoList,
              funcQueryVo,
            };
            // console.log(this.compareData);
            this.compareModel = true;
          }
        });
    },
    groupData(arr, fun) {
      const groups = {};
      arr.forEach((el) => {
        const group = fun(el);
        groups[group] = groups[group] || [];
        groups[group].push(el);
      });
      return Object.keys(groups).map((group) => {
        // 更改data的数据结构  可以改变新数据的结构 data即为newData的数组中每个数据的结构
        let data = {
          dtl_id: group,
          data: groups[group],
        };
        return data;
      });
    },
    getNewData(oldData, prop) {
      const newData = this.groupData(oldData, (item) => {
        return item[prop];
      });
      return newData;
    },
    getVersionList(version) {
      //获取version以下所有正整数并拼接成数组
      let arr = [];
      for (let i = 1; i <= version; i++) {
        arr.push(i);
      }
      this.compareList = arr;
      this.compareListChoice = arr;
    },
    historyHandler(row) {
      const data = window.microApp.getData();
      data.baseRouer.push({
        path: "/M/metadataHistory",
        query: {
          obj_id: row.obj_id,
          source_id: row.source_id,
        },
      });
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getMetaObjInfo();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getMetaObjInfo();
    },
    //版本对比弹窗关闭
    compareModelClosed() {
      this.compareData = {};
      this.compareList = [];
      this.compareListChoice = [];
    },
  },
};
</script>

<style scoped lang="less">
.metaObjInfo {
  .el-button {
    min-width: 80px;
    height: 32px;
    padding: 8px 25px;
    font-family: @hansan;
  }
  .drawerContent {
    .el-divider--horizontal {
      margin: 0 0 20px;
    }
  }
  .compareBox {
    /deep/.el-checkbox__inner {
      width: 12px;
      height: 12px;
    }
    /deep/ .el-checkbox__label {
      font-size: 12px;
    }
    /deep/.el-checkbox__inner::after {
      top: 0;
    }
    .compareTitle {
      border-bottom: @border-common;
      width: fit-content;
      min-width: calc(100% - 100px);
    }
    .contentWidth {
      min-width: 255px;
    }
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      border-radius: 8px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
