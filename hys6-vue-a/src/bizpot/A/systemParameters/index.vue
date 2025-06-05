<template>
  <div class="px-20 pb-20">
    <ByContainerTitle
        title = "系统参数列表"
        :addBtn = false
        style="padding: 10px"
    >
      <el-button type="primary" @click="addSystemParameters()" style="padding-left: 10px;width: 120px">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增系统参数</span>
      </el-button>
    </ByContainerTitle>

    <ByTable
        :tableData="systemParameters"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItem"
        @tableInput="selectItem"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @handleFilter="handleFilter"
    />
    <!--  新增系统参数弹层-->
    <ByModel
        :visible.sync="visible"
        :modelTitle="modelTitle"
        modelWidth="650px"
        @close="dialogCancel"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
            :formData="modelFormData"
            :formItems="modelFormItems"
            :formRules="modelFormRules"
            :formConfig="modelFormConfig"
            ref="systemParametersForm"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="dialogCancel">取消</el-button>
        <el-button
            type="primary"
            @click="confirm"
            v-debounce
            v-if="modelTitle === '新增系统参数'"
        >
          保存
        </el-button>
        <el-button
            type="primary"
            @click="update"
            v-debounce
            v-else-if="modelTitle === '更新系统参数信息'"
        >
          更新
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>


import {columnArr, modelFormConfig, modelFormData, modelFormItems, modelFormRules} from "./mock";

export default {
  data() {
    return {
      systemParameters: [],
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      visible: false,
      modelTitle: "",
      modelFormItems,
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      modelFormRules,
      modelFormConfig,
      select : "",
    }
  },
  created() {
    this.getSysParaList()
  },
  methods: {
    // 表格筛选
    handleFilter(val) {
      // console.log(val)
      let params = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        paraName: val
      };
      this.$executeRequest.execByControllerMappingName("/getSysPara", params)
          .then((res) => {
            // console.log(res)
            if (res && res.success) {
              this.systemParameters = res.data.sysParas;
              this.pagination.total = res.data.totalSize;
            }
          });
    },
    operateItem(type, row) {
      if (type === "edit") {
        this.visible = true
        this.handleEdit(row)
      }
    },
    sizeChange(val) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = val
      this.getSysParaList()
    },
    currentChange(val) {
      this.pagination.pageNum = val
      this.getSysParaList()
    },
    // 获取参数列表信息
    getSysParaList() {
      let params = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest.execByControllerMappingName("/getSysPara", params)
          .then((res) => {
            // console.log(res)
            if (res && res.success) {
              this.systemParameters = res.data.sysParas;
              this.pagination.total = res.data.totalSize;
            }
          });
    },
    // 取消
    dialogCancel() {
      this.visible = false
    },
    // 新增系统参数
    addSystemParameters() {
      this.modelFormData = {}
      this.modelFormItems.map(item => item.prop === 'para_name' && (item.disabled = false))
      this.modelFormItems.map(item => item.prop === 'para_type' && (item.disabled = false))
      this.modelTitle = '新增系统参数'
      this.visible = true
    },
    // 确认新增
    confirm() {
      this.$refs.systemParametersForm.$refs[this.modelFormConfig.ref].validate(valid => {
        if (valid) {
          this.$confirm("确认新增吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.$executeRequest.execByControllerMappingName('/addSysPara', this.modelFormData)
                .then(res => {
                  if (res && res.success) {
                    this.$message.success("新增成功")
                    this.getSysParaList()
                    this.visible = false
                    this.$refs.systemParametersForm.$refs[this.modelFormConfig.ref].resetFields()
                  }
                })
          })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "取消新增!",
                });
              });
        }
      })
    },
    // 确认更新
    update() {
      this.$refs.systemParametersForm.$refs[this.modelFormConfig.ref].validate(valid => {
        if (valid) {
          this.$confirm("确认编辑吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.$executeRequest.execByControllerMappingName('/updateSysPara', this.modelFormData)
                .then(res => {
                  if (res && res.success) {
                    this.$message.success("编辑成功")
                    this.getSysParaList()
                    this.visible = false
                    this.$refs.systemParametersForm.$refs[this.modelFormConfig.ref].resetFields()
                  }
                })
          }).catch(() => {
            this.$message({
              type: "info",
              message: "取消编辑!",
            });
          });
        }
      })
    },
    // 编辑按钮
    handleEdit(row) {
      // console.log(row)
      // this.systemParametersForm = Object.assign({}, row);
      this.modelTitle = "更新系统参数信息"
      this.modelFormData = row
      this.modelFormItems.map(item => item.prop === 'para_name' && (item.disabled = true))
      this.modelFormItems.map(item => item.prop === 'para_type' && (item.disabled = true))
      this.visible = true
    },
    selectItem(val){
      if (val){
        this.pagination.pageNum = 1;
        this.handleFilter(val.trim())
        // this.systemParameters = this.systemParameters.filter(data => data.para_name.trim().toLowerCase().includes(val) || data.para_value.trim().toLowerCase().includes(val));
      } else {
        this.getSysParaList()
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-button {
  width: 100px;
  height: 32px;
  padding: 8px 0;
}

.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
</style>