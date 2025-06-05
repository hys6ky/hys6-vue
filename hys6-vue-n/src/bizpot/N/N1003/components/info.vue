<template>
  <div class="asset">
    <div>
      <div v-if="activeName === 'first'">
        <ByFormGroup
          :formData="formData"
          :formList="formList"
          :formConfig="formConfig"
          :formRules="formRules"
          ref="asset"
        />
      </div>
      <div v-else-if="activeName === 'second'">
        <ByFormGroup
          :formData="formData1"
          :formList="formList1"
          :formConfig="formConfig"
          :formRules="formRules"
          ref="asset1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  formList,
  formConfig,
  formRules,
  formDataColumn,
  columnArr,
  formList1,
} from "../mock";
export default {
  name: "asset",
  data() {
    return {
      formList,
      formConfig,
      formList1,
      formRules,
      formData: {},
      formData1: {},
      columnArr,
      formDataColumn,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
        total: 2,
      },
    };
  },
  props: {
    activeName: {
      type: String,
      default: "first",
    },
    sj: {
      type: Object,
      default: () => {},
    },
  },
  methods: {},
  async created() {
    if (this.sj.assetType !== "5") {
      let obj = JSON.parse(JSON.stringify(this.sj));
      await this.$executeRequest
        .execByUrl("/Base/departmentalList/getDepartmentInfo", {
          currPage: 1,
          pageSize: 999,
        })
        .then((res) => {
          res.data.departmentInfos.forEach((item) => {
            if (item.dep_id === obj.belongDepart) {
              obj.belongDepart1 = item.dep_name;
            }
            if (item.dep_id === obj.manageDepart) {
              obj.manageDepart1 = item.dep_name;
            }
          });
        });
      await this.$executeRequest
        .execByUrl("/Base/sysUser/getAllSysUserByDepartmentInfo")
        .then((res) => {
          res.data.forEach((item) => {
            if (item.user_id === Number(obj.belongBy)) {
              obj.belongBy1 = item.user_name;
            }
            if (item.user_id === Number(obj.manageBy)) {
              obj.manageBy1 = item.user_name;
            }
          });
        });
      this.formData = obj;
    } else {
      this.formData1 = this.sj;
      console.log(this.formData1);
    }
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-button {
  padding: 8px 16px;
}
.title-wrap {
  background: rgb(217, 236, 255);
  height: 48px;
  padding: 0 10px;
  border-radius: 4px;
}
.el-button--text {
  color: @primary-color;
  // font-size: 14px;
  font-family: @pingfang;
}
</style>
