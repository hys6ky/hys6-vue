<template>
  <div class="institutionManage h100 d-flex">
    <!--获取树信息  -->
    <div class="h100">
      <ByTree
          :data="treeData"
          :defaultProps="defaultProps"
          @contextmenu="handleContextmenu"
          @logDetail="logDetail"
          @add="addFenceng"
          class="h100"
      />
    </div>
    <!-- table信息 -->
    <div
        class="flex-1 h100 box-sizing overflow-y-auto p-20"
        style="width: calc(100% - 275px)"
    >
      <div class="px-20 h100 box-sizing">
        <div class="h100 d-flex flex-column">
          <div class="d-flex justify-content-between">
            <ByHeaderSlice title="部门信息表"></ByHeaderSlice>
            <div>
              <el-button
                  type="primary"
                  v-debounce
                  @click="addFenceng"
              >
                新增
              </el-button>
            </div>
          </div>
          <div class="mt-20" v-if="tableData.length > 0">
            <ByTable
                :tableData="tableData"
                :columnArr="columnArr"
                :pagination="pagination"
                @operateItem="operateHandler"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
            />
          </div>
          <ByEmpty v-else></ByEmpty>
        </div>
      </div>
    </div>

    <ByModel
        :visible.sync="visible"
        :modelTitle="modelTitle"
        modelWidth="560px"
        @close="dialogCancel"
        @closed="dialogClosed"
    >
      <ByModelForm
          :formData="modelFormData"
          :formItems="modelFormItems"
          :formRules="modelFormRules"
          :formConfig="modelFormConfig"
          ref="metricManage"
      />
      <template slot="modalFoot">
        <el-button @click="dialogCancel">取消</el-button>
        <el-button
            type="primary"
            @click="addConfirm"
            v-debounce
            v-if="modelTitle === '新增部门'"
        >
          保存
        </el-button>
        <el-button type="primary" @click="updateConfirm" v-debounce v-else>
          提交
        </el-button>
      </template>
    </ByModel>

  </div>
</template>

<script>
import {formItems, pagination, columnArr, modelFormItems, modelFormRules, modelFormConfig} from "./mock";
import {getFlatArr, parseSimpleTreeData, treeFindPath} from "@/utils/datahandler";

export default {
  name: "departmentalList",
  data() {
    return{
      treeData: [],
      columnArr,
      tableData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      // 弹窗
      visible: false,
      modelTitle: "",
      modelFormItems: JSON.parse(JSON.stringify(modelFormItems)),
      modelFormRules,
      modelFormConfig,
      formItems,
      modelFormData: {
        dep_id: "",
        dep_name: "",
        sup_dep_id: "",
        dep_remark: ""
      },
      optionTreeData: [],

      //树节点id
      dep_id: "",
      dep_name: "",
    }
  },
  created() {
    this.initTree();
    this.getTableData();
  },
  methods: {
    //获取树信息
    initTree() {
      this.$executeRequest
          .execByControllerMappingName("getAllTree")
          .then((res) => {
            const list = res.data
            const tree = getFlatArr(res.data);
            tree.map((item) => {
              if (item.children?.length > 0) {
                item.children = [];
              }
              item.type = "text";
              item.showLabel  = item.label;
              item.dropList = [
                { label: "添加同级部门", type: "ADDSAMEMENU" },
                { label: "添加下属部门", type: "ADDCHILDMENU" },
                { label: "修改部门", type: "EDITMENU" },
                { label: "删除部门", type: "DELETEMENU" },
              ];
            });
            tree.unshift({
              id: 100,
              label: "添加部门",
              showLabel: "添加部门",
              expanded: false,
              type: "add",
            });
            this.treeData = parseSimpleTreeData(tree, "id", "pid");
            this.initOptionList(list);
          });
    },
    //上级分类option树
    initOptionList(list) {
      let arr = getFlatArr(JSON.parse(JSON.stringify(list)));
      arr.map((item) => {
        if (item.children?.length > 0) {
          item.children = [];
        }
      });
      this.optionTreeData = parseSimpleTreeData(arr, "id", "pid");
      this.modelFormItems.map((item) => {
        if (item.prop == "sup_dep_id") {
          item.options = this.optionTreeData;
        }
      });
    },
    //获取右侧列表
    getTableData() {
      //获取分层列表信息
      this.$executeRequest
          .execByControllerMappingName("getDataByPage", {
            dep_id: this.dep_id,
            currPage: this.pagination.pageNum,
            pageSize: this.pagination.pageSize,
          })
          .then((res) => {
            const list = res.data.departmentInfo;
            list.map((item) => {
              const list = treeFindPath(
                  this.optionTreeData,
                  (data) => data.id === item.sup_dep_id,
                  "label"
              );
              item.sup_dep_Txt = item.sup_dep_id === 0 ? "----" : list.join('/');

            });
            this.tableData = res.data.departmentInfo;
            this.pagination.total = res.data.totalSize;
          });
    },
    //右键菜单
    handleContextmenu(val) {
      switch (val.command) {
        case "ADDSAMEMENU":
          this.addSameOrChildMenu(val.data.pid);
          break;
        case "ADDCHILDMENU":
          this.addSameOrChildMenu(val.data.id);
          break;
        case "EDITMENU":
          this.editMenu(val.data);
          break;
        case "DELETEMENU":
          this.delMenu(val.data);
          break;
        default:
          break;
      }
    },
    //添加同级分层
    addSameOrChildMenu(id) {
      this.modelTitle = "新增部门";
      const list = treeFindPath(
          this.optionTreeData,
          (data) => data.id === id,
          "id"
      );
      this.modelFormData.sup_dep_id = list;
      this.visible = true;
    },
    //编辑分类
    editMenu(data) {
      const { id: dep_id } = data;
      this.modelTitle = "编辑部门";
      this.$executeRequest.execByControllerMappingName("/getByDepId",{dep_id}).then((res)=>{
        if (res.success && res.message === "Success") {
          this.modelFormData = res.data;
        }
      })
      this.visible = true;
    },
    //删除分类
    delMenu(data) {
      const { id: dep_id } = data;
      this.$executeRequest
          .execByControllerMappingName("/deleteById", {
            dep_id,
          })
          .then((res) => {
            if (res.success && res.message === "Success") {
              this.$Msg.customizTitle("删除成功", "success");
              this.initTree();
              this.getTableData();
            }
          });
    },
    //点击目录
    logDetail(node) {
      this.dep_id = node.id;
      this.dep_name = node.label;
      this.getTableData();
    },
    //新建分层
    addFenceng() {
      this.modelTitle = "新增部门";
      this.modelFormItems.map((item) => {
        if (item.prop == "sup_dep_id") {
          item.disabled = false;
        }
      });
      this.visible = true;
    },
    //表格操作
    operateHandler(type, row) {
      if (type === "detail" || type === "edit") {
        this.toDetail(row.dep_id, type);
      } else if (type === "del") {
        this.toDelete(row.dep_id);
      } else {
        this.$confirm("表格操作类型错误", "提示", {
          type: "warning",
        });
      }
    },
    //删除
    toDelete(dep_id) {
      this.$confirm("是否删除该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$executeRequest
                .execByControllerMappingName("/deleteById", {
                  dep_id,
                })
                .then((res) => {
                  if (res.success && res.message === "Success") {
                    this.$Msg.customizTitle("删除成功", "success");
                    this.initTree();
                    this.getTableData();
                  }
                });
          })
          .catch(() => {});
    },
    //查看
    toDetail(dep_id, type) {
      this.modelTitle = "编辑部门";
      this.$executeRequest.execByControllerMappingName("/getByDepId",{dep_id}).then((res)=>{
        if (res.success && res.message === "Success") {
          this.modelFormData = res.data;
        }
      })
      this.visible = true;
    },
    addConfirm() {
      this.$refs.metricManage.$refs[modelFormConfig.ref].validate((valid) => {
        if (valid) {
          // 新增数据
          const params = {
            dep_name: this.modelFormData.dep_name,
            sup_dep_id: this.modelFormData.sup_dep_id[this.modelFormData.sup_dep_id.length-1],
            dep_remark: this.modelFormData.dep_remark,
          };
          this.$executeRequest
              .execPostByControllerMappingName("/add", params)
              .then((res) => {
                if (res.data) {
                  this.$Msg.customizTitle("添加成功", "success");
                } else {
                  this.$Msg.customizTitle("添加失败", "success");
                }
                this.$refs.metricManage.$refs[modelFormConfig.ref].resetFields(); //清空弹窗表单
                this.visible = false;
                this.initTree();
                this.getTableData();
              });
        } else {
          return false;
        }
      });
    },
    updateConfirm() {
      this.$refs.metricManage.$refs[modelFormConfig.ref].validate((valid) => {
        if (valid) {
          //新增数据
          this.$executeRequest
              .execPostByControllerMappingName("/update", this.modelFormData).then((res) => {
            if (res.data) {
              this.$Msg.customizTitle("编辑成功", "success");
            } else {
              this.$Msg.customizTitle("编辑失败", "success");
            }
            this.$refs.metricManage.$refs[modelFormConfig.ref].resetFields(); //清空弹窗表单
            this.visible = false;
            this.initTree();
            this.getTableData();
          });
        } else {
          return false;
        }
      });
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableData();
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableData();
    },
    dialogCancel() {
      this.visible = false;
    },
    dialogClosed() {
      this.modelFormData = {
        dep_id: "",
        dep_name: "",
        sup_dep_id: "",
        dep_remark: "",
      };
    },


  }
}
</script>

<style scoped>

</style>
