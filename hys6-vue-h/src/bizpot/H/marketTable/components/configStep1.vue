<template>
  <div class="pb-20">
    <ByFormGroup
      :formData="formData"
      :formList="formList"
      :formConfig="formConfig"
      :formRules="formRules"
      @changeInput="changeInput"
      @changeSelect="changeSelect"
      ref="marketTable"
    >
    </ByFormGroup>
    <ByTable
      :tableData="tableData"
      :columnArr="columnArr"
      @operateItem="operateItem"
      @selectionChange="handleSelectionChange"
      @handleFilter="getTableByFuzzyQuery"
    />
    <div class="d-flex justify-content-end">
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </div>
    <ByModel
      :visible.sync="visible"
      modelTitle="数据存储层配置属性"
      modelWidth="1000px"
      @close="visible = false"
      @closed="dialogClosed"
    >
      <div style="padding: 0 20px 0 20px">
        <ByTable :columnArr="columnArrConfig" :tableData="storeConfigTable" />
        <ByModelForm
          :formData="modalFormData"
          :formItems="modalFormItems"
          :formConfig="modalFormConfig"
        ></ByModelForm>
      </div>
      <template slot="modalFoot">
        <el-button type="danger" @click="visible = false">关闭</el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  formRules,
  formList,
  formData,
  formConfig,
  columnArr,
  columnArrConfig,
  modalFormItems,
  modalFormData,
  modalFormConfig,
} from "../mock";
export default {
  data() {
    return {
      formRules,
      formList: JSON.parse(JSON.stringify(formList)),
      formData: JSON.parse(JSON.stringify(formData)),
      formConfig,
      zipperData: [],
      tableData: [],
      columnArr,
      //数据储存配置弹窗
      visible: false,
      columnArrConfig,
      storeConfigTable: [],
      modalFormItems: JSON.parse(JSON.stringify(modalFormItems)),
      modalFormData,
      modalFormConfig,
      data_mart_id: this.$route.query.data_mart_id, //工程ID
      operation: this.$route.query.operation,//新增or编辑
      // is_add: this.$route.query.is_add, //新增or编辑
      datatable_id: this.$route.query.datatable_id, //作业ID
      dsl_id: "", //对应的列表勾选项
    };
  },
  watch: {
    ComputeFormData: {
      handler(val, oldVal) {
        if (val.datatable_lifecycle !== "2") {
          this.formList[0].formItems.map((item, index) => {
            if (item.prop === "datatable_due_date") {
              this.formList[0].formItems.splice(index, 1);
            }
          });
          this.formData.datatable_due_date = "";
        } else {
          const find = this.formList[0].formItems.find(
            (item) => item.prop === "datatable_due_date"
          );
          if (!find) {
            this.formList[0].formItems.push({
              label: "数据表到期日期",
              prop: "datatable_due_date",
              type: "date",
              span: 12,
            });
          }
        }
        if (val.repeat_flag && val.repeat_flag !== oldVal.repeat_flag) {
          this.changerepeat();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ComputeFormData() {
      return JSON.parse(JSON.stringify(this.formData));
    },
  },
  async mounted() {
    this.getTable();
    await this.getisflag();
    await this.getAllSqlEngine();
    await this.getAllStorageType();
    await this.getAllTableStorage();
    await this.getAllDatatableLifecycle();
    await this.getDmCategoryForDmDataTable();
    if (
      (this.operation == "update") &&
      // (this.is_add == 1 || this.is_add == "1") &&
      this.datatable_id != undefined
    ) {
      this.queryDMDataTableByDataTableId(this.datatable_id);
    }
  },
  created() {
    this.$Code
      .getCodeItems({
        category: "StorageType",
      })
      .then((res) => {
        this.zipperData = [
          res.data.TiHuan,
          res.data.ZhuiJia,
          res.data.QuanLiang,
        ];
      });
  },
  methods: {
    //获取表单数据
    queryDMDataTableByDataTableId(datatable_id) {
      let param = {
        datatable_id: datatable_id,
      };
      this.$executeRequest.execGetByModulName("/market/queryDMDataTableByDataTableId", param)
        .then((res) => {
          if (res && res.success) {
            this.formData = res.data[0];
            let dataYear = this.formData.datatable_due_date.substring(0, 4);
            let dataMonth = this.formData.datatable_due_date.substring(4, 6);
            let dataDay = this.formData.datatable_due_date.substring(6, 9);
            let data = dataYear + "-" + dataMonth + "-" + dataDay;
            this.formData.datatable_due_date = data;
            this.dsl_id = res.data[0].dsl_id;
            this.tableData.map((item) => {
              if (item.dsl_id === this.dsl_id) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
            if (this.datatable_id == undefined) {
              this.formData.repeat_flag = "1";
            }
            this.changerepeat();
          } else {
            this.$Msg.customizTitle(response.message, "warning");
          }
        });
    },
    changeInput(prop, val) {
      if (prop === "datatable_en_name") {
        this.formData.datatable_en_name = val.replace(/\s+/g, "");
        this.checkrepeat();
      }
    },
    changeSelect(prop, val) {
      if (prop === "datatable_en_name") {
        this.formData.datatable_en_name = val;
        this.checkrepeat();
      }
    },
    //更改英文名
    checkrepeat() {
      let param = {
        datatable_en_name: this.formData.datatable_en_name,
        datatable_id: this.datatable_id,
      };
      if (this.formData.datatable_en_name == "") {
        return false;
      }
      this.$executeRequest.execGetByModulName("/market/queryTableNameIfRepeat", param)
        .then((res) => {
          if (res && res.success) {
            if (res.data.result == true) {
              this.queryDMDataTableByDataTableId(res.data.datatable_id);
              this.formData.repeat_flag = "1";
            }
          }
        });
    },
    //是否已存在表
    changerepeat() {
      //如果改为是
      if (this.formData.repeat_flag == "1") {
        let datatable_en_name = "";
        datatable_en_name = this.formData.datatable_en_name;
        if (datatable_en_name == "") {
          this.$Msg.customizTitle("请输入表名", "warning");
          return false;
        }
        this.$executeRequest.execGetByModulName("/market/isDataTableExist", {
            datatable_en_name: datatable_en_name,
          })
          .then((res) => {
            if (res && res.data) {
              const isReuse = res.data;
              if (isReuse === "1") {
                this.$executeRequest.execGetByModulName("/market/getAllDatatable_En_Name")
                  .then((res) => {
                    let list = [];
                    res.data.forEach((item) => {
                      list.push({
                        label: item.datatable_en_name,
                        value: item.datatable_en_name,
                      });
                    });
                    this.formList[0].formItems.map((item) => {
                      if (item.prop === "datatable_en_name") {
                        item.options = list;
                        item.type = "select";
                      }
                    });
                  });
              } else {
                this.formList[0].formItems.map((item) => {
                  if (item.prop === "datatable_en_name") {
                    item.type = "input";
                    item.options ? delete item.options : "";
                  }
                });
              }
            }
          });
      } else {
        this.formList[0].formItems.map((item) => {
          if (item.prop === "datatable_en_name") {
            item.type = "input";
            item.options ? delete item.options : "";
          }
        });
      }
    },
    //获取表格
    getTable() {
      this.$executeRequest.execGetByModulName("/market/searchDataStore")
        .then((res) => {
          if (res && res.success) {
            res.data.forEach((item) => {
              item.checked = false;
              this.$Code
                .getValue({
                  category: "IsFlag",
                  code: item.is_hadoopclient,
                })
                .then((res) => {
                  item.is_hadoopclient = res.data;
                });
              this.$Code
                .getValue({
                  category: "Store_type",
                  code: item.store_type,
                })
                .then((res) => {
                  item.store_type = res.data;
                });
              item.checked = false;
            });
            this.tableData = res.data;
          }
        });
    },
    //表格筛选
    getTableByFuzzyQuery(val) {
      if (val.length === 0) {
        this.getTable();
        return;
      }
      let params = {
        fuzzyqueryitem: val,
      };
      this.$executeRequest.execGetByModulName("/market/searchDataStoreByFuzzyQuery", params)
        .then((res) => {
          if (res && res.success) {
            res.data.forEach((item) => {
              this.$Code
                .getValue({
                  category: "IsFlag",
                  code: item.is_hadoopclient,
                })
                .then((res) => {
                  item.is_hadoopclient = res.data;
                });
              this.$Code
                .getValue({
                  category: "Store_type",
                  code: item.store_type,
                })
                .then((res) => {
                  item.store_type = res.data;
                });
              if (item.dsl_id === this.dsl_id) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
            this.tableData = res.data;
          }
        });
    },
    //表格操作
    operateItem(type, row) {
      if (type === "storeConfig") {
        this.$executeRequest.execGetByModulName("/market/datastore/searchDataStoreById", {
            dsl_id: row.dsl_id,
          })
          .then((res) => {
            let result = this.$Secret.DecryptJSON(res.data);
                        let table = result.data.layerAndAttr;
            let checkbox = result.data.layerAndAdded;
            this.storeConfigTable = table;
            checkbox.forEach((item) => {
              this.$Code
                .getValue({
                  category: "StoreLayerAdded",
                  code: item.dsla_storelayer,
                })
                .then((value) => {
                  let list = [];
                  list.push({
                    value: item.dsla_storelayer,
                    label: value.data,
                  });
                  this.modalFormItems.map((v1) => {
                    if (v1.prop === "dsla_storelayer") {
                      v1.options = list;
                    }
                  });
                });
            });
            this.visible = true;
          });
      }
    },
    //表格单选
    handleSelectionChange(val) {
      this.tableData.map((item) => {
        if (item.dsl_id === val.dsl_id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    //是否已存在表
    async getisflag() {
      await this.$Code
        .getCategoryItems({
          category: "IsFlag",
        })
        .then(async (res) => {
          let list = [];
          res.data.forEach((item) => {
            list.push({
              label: item.value,
              value: item.code,
            });
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "repeat_flag") {
              item.options = list;
            }
          });
        });
    },
    //获取所有执行引擎
    async getAllSqlEngine() {
      await this.$Code
        .getCategoryItems({
          category: "SqlEngine",
        })
        .then(async (res) => {
          let list = [];
          res.data.forEach((item) => {
            list.push({
              label: item.value,
              value: item.code,
            });
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "sql_engine") {
              item.options = list;
            }
          });
        });
    },
    //进数方式
    async getAllStorageType() {
      await this.$Code
        .getCategoryItems({
          category: "StorageType",
        })
        .then(async (res) => {
          let list = [];
          let ccc = res.data;
          ccc.forEach((item, index) => {
            if (this.zipperData.includes(item.code)) {
              list.push({
                label: item.value,
                value: item.code,
              });
            }
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "storage_type") {
              item.options = list;
            }
          });
        });
    },
    //获取数据存储方式
    async getAllTableStorage() {
      await this.$Code
        .getCategoryItems({
          category: "TableStorage",
        })
        .then(async (res) => {
          let list = [];
          res.data.forEach((item) => {
            list.push({
              label: item.value,
              value: item.code,
            });
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "table_storage") {
              item.options = list;
            }
          });
        });
    },
    //获取数据表生命周期
    async getAllDatatableLifecycle() {
      await this.$Code
        .getCategoryItems({
          category: "TableLifeCycle",
        })
        .then(async (res) => {
          let list = [];
          res.data.forEach((item) => {
            list.push({
              label: item.value,
              value: item.code,
            });
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "datatable_lifecycle") {
              item.options = list;
            }
          });
        });
    },
    // 选择分类信息id
    async getDmCategoryForDmDataTable() {
      if(this.$route.query.data_mart_id == null){
        await this.formList[0].formItems.map((item) => {
          if (item.prop === "category_id") {
            item.options = [{label:this.$route.query.category,value:0}];
          }
        });
      }else{
        await this.$executeRequest.execGetByModulName("/market/getDmCategoryForDmDataTable", {
          data_mart_id: this.$route.query.data_mart_id,
        })
        .then(async (res) => {
          let list = [];
          res.data.forEach((item) => {
            list.push({
              label: item.category_name,
              value: item.category_id,
            });
          });
          await this.formList[0].formItems.map((item) => {
            if (item.prop === "category_id") {
              item.options = list;
            }
          });
        });
}
    },
    //下一步
    nextStep() {
      this.$refs.marketTable.$refs[formConfig.ref].validate((valid) => {
        if (valid) {
          const checkedItem = this.tableData.find(
            (item) => item.checked === true
          );
          if (!checkedItem) {
            this.$Msg.customizTitle("请选择存储目的地", "warning");
            return;
          } else {
            this.dsl_id = checkedItem.dsl_id;
          }
          //判断是否为orcle
          let isorclaeok = true;
          this.$executeRequest.execGetByModulName("/market/checkOracle", {
              dsl_id: this.dsl_id,
              datatable_en_name: this.formData.datatable_en_name,
            })
            .then((res) => {
              isorclaeok = res.data;
              if (!res.data) {
                this.$Msg.customizTitle(
                  "选择存储目的地为oracle,且表名长度大于26，请修改表名!",
                  "warning"
                );
                return false;
              }
              if (this.operation == "add") {
              // if (this.is_add === "0") {
                this.addConfirm();
              } else {
                this.updateConfirm();
              }
            });
        }
      });
    },
    //确认新增
    addConfirm() {
      const obj = {
        dsl_id: this.dsl_id,
        data_mart_id: this.data_mart_id,
      };
      const params = Object.assign({}, obj, this.formData);
      params.uuid = this.$route.query.uuid;
      params.category = this.$route.query.category;;
      this.$executeRequest.execGetByModulName("/market/addDMDataTable", params)
        .then((res) => {
          if (res && res.success) {
// 若此次新增了工程，重新设置工程id
            if(res.data.data_mart_id != null){
              this.data_mart_id = res.data.data_mart_id;
            }
            this.datatable_id = res.data.datatable_id;
            this.$router.push({
              name: "marketTable",
              query: {
                data_mart_id: this.data_mart_id,
                datatable_id: this.datatable_id,
                operation: "update",
                // is_add: "1",
                ifrepeat: res.data.ifrepeat,
                active: "1",
// 外部跳转相关
                source : this.$route.query.source,
                uuid: this.$route.query.uuid,
                category: this.$route.query.category,
                task_is_first : 1
              },
            });
          }
        });
    },
    //确认编辑
    updateConfirm() {
      const obj = {
        dsl_id: this.dsl_id,
        data_mart_id: this.data_mart_id,
        datatable_id: this.datatable_id,
      };
      const params = Object.assign(this.formData, obj);
      this.$executeRequest.execGetByUrl("/H/market/updateDMDataTable", params).then((res) => {
          if (res && res.success) {
            this.$router.push({
              name: "marketTable",
              query: {
                data_mart_id: this.data_mart_id,
                datatable_id: this.datatable_id,
                // is_add: "1",
                operation: "update",
                ifrepeat: res.data.ifrepeat,
                active: "1",
              },
            });
          }
        });
    },
    dialogClosed() {
      this.modalFormItems = JSON.parse(JSON.stringify(modalFormItems));
      this.storeConfigTable = [];
    },
  },
};
</script>

<style scoped>
.el-button {
  width: 100px;
  height: 32px;
  padding: 8px 0;
  font-size: 12px;
}
</style>
