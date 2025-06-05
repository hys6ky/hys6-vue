<template>
  <div class="dataSheetMain">
    <div class="dataSheetMainDiv" v-for="(item,index) in data" :key="index">
      <div @click="gotoSourceDetail(index)">
        <i class="el-icon-edit-outline" style="font-size: 40px;color: #fff;"></i>
        <p>{{ item.datasource_name }}</p>
        <p class="postionP">Agent个数为 {{ item.sumAgent }}</p>
        <span>{{ item.sumAgent }}</span>
      </div>
      <div class="boxshletr">
        <el-button type="text" icon="el-icon-download" style="font-size: 20px;color: #fff;"
                   @click="downloadData(index)"/>
        <el-button type="text" icon="el-icon-edit" style="font-size: 20px;color: #fff;"
                   @click="dialogFormVisibleAdd = true;clickEditButton(index)"/>
        <el-button type="text" icon="el-icon-delete-solid" style="font-size: 20px;color: #fff;"
                   v-if="item && item.sumAgent === 0"
                   @click="deleteThisData(index)"/>
      </div>
    </div>

    <!-- 实现点击编辑按钮进行数据更改-->
    <!-- 编辑的弹出表单 -->
    <el-dialog title="编辑数据源" :visible.sync="dialogFormVisibleAdd" width="40%">
      <el-form :model="formUpdate" ref="formUpdate">
        <el-form-item label=" 数据源编号" :label-width="formLabelWidth">
          <el-input v-model="formUpdate.datasource_number" autocomplete="off" placeholder="数据源编号"
                    style="width:284px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label=" 数据源名称" :label-width="formLabelWidth" prop="datasource_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formUpdate.datasource_name " autocomplete="off" placeholder="数据源名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label=" 所属部门" :label-width="formLabelWidth">
          <el-select v-model="depIds" filterable placeholder="请选择（可多选）" multiple style="width:284px">
            <el-option v-for="(item,index) in options" :key="index" :label="item.dep_name"
                       :value="item.dep_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 数据源详细描述" :label-width="formLabelWidth" prop="source_remark">
          <el-input type="textarea" v-model="formUpdate.source_remark" autocomplete="off" placeholder="数据源详细描述"
                    style="width:284px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="update('formUpdate')" size="mini">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

export default {
  props: ["data"],
  data() {
    return {
      filename: "",
      options: [],
      click: "",
      source_id: "",
      dialogFormVisibleAdd: false,
      formUpdate: {
        datasource_name: "",
        datasource_number: "",
        source_remark: "",
      },
      depIds: [],
      rule: validator.default,
      formLabelWidth: "150px"
    };
  },
  methods: {
    // 点击编辑小图标获取部门信息和回显数据
    clickEditButton(index) {
      this.depIds = [];
      this.source_id = this.data[index].source_id;
      // 获取部门信息
      this.$executeRequest.execPostByModuleUrl("/dataCollectionM/searchDepartmentInfo").then(res => {
        if (res && res.success) {
          this.options = res.data;
        }
      });
      // 数据回显
      let params = {source_id: this.data[index].source_id};
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/searchDataSourceById", params).then((res) => {
        if (res && res.success) {
          this.formUpdate = res.data;
          res.data.depNameAndId.forEach((item) => {
            this.depIds.push(item.dep_id);
          })
        }
      })
    },

    // 点击保存按钮更新当前的所有信息
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          params["depIds"] = this.depIds;
          this.formUpdate["source_id"] = this.source_id;
          params['dataSource'] = this.formUpdate;
          this.$executeRequest.execPostByControllerMappingName("/updateDataSource", params).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle('更新成功', 'success')
              this.$emit("addEvent");
              this.dialogFormVisibleAdd = false;
              this.formUpdate = {
                datasource_name: "",
                datasource_number: "",
                source_remark: "",
              }
              this.depIds = [];
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击添加弹出框的取消按钮
    cancelAdd() {
      // 表单清空
      this.formUpdate = {
        datasource_name: "",
        datasource_number: "",
        source_remark: "",
      }
      this.depIds = [];
      // 隐藏对话框
      this.dialogFormVisibleAdd = false;
    },
    // 点击数据来源表的内容跳转页面
    gotoSourceDetail(index) {
      //进行页面的跳转
      this.$router.push({
        name: "agentInfo",
        query: {
          source_id: this.data[index].source_id
        }
      });
    },

    // 点击删除删除数据源
    deleteThisData(index) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.source_id = this.data[index].source_id;
        let params = {
          source_id: this.source_id
        };
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/deleteDataSource", params).then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle('删除成功', 'success')
            this.$emit("addEvent");
          }
        })
      }).catch(() => {
        this.$message('取消删除')
      })
    },
    // 点击下载图标数据
    downloadData(index) {
      this.source_id = this.data[index].source_id;
      let params = {source_id: this.source_id};
      this.$executeRequest.execDownloadFileByUrl("/dataCollectionM/downloadFile", params).then((res) => {
        let fileName = this.data[index].datasource_name + ".hrds";
        this.$FileOperations.fileDownload(res, fileName);
      })
    },
  }
};
</script>

<style scoped>
/* 组件样式设置 */
.dataSheetMain {
  padding-left: 44px;
  border: 1px solid #dddddd;
  min-height: 124px;
  padding-top: 30px;
  overflow: hidden;
}

.dataSheetMainDiv:hover .boxshletr {
  display: block;
}

.dataSheetMainDiv:hover {
  background: #286090;
  cursor: pointer;
}

.dataSheetMainDiv {
  margin-bottom: 46px;
  padding-top: 10px;
  width: 100px;
  height: 80px;
  background: #337ab7;
  border-radius: 10px;
  margin-right: 30px;
  text-align: center;
  float: left;
  position: relative;
}

.dataSheetMainDiv p {
  color: #fff;
  margin-left: 5px;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标签定位 */
.dataSheetMainDiv span {
  display: block;
  width: 18px;
  height: 18px;
  background: #f89406;
  border-radius: 50%;
  color: white;
  position: absolute;
  right: -2px;
  top: -3px;
  font-size: 12px;
}

/* 字体描述定位 */
.dataSheetMainDiv .postionP {
  position: absolute;
  bottom: -20px;
  left: 4px;
  font-size: 13px;
  color: black;
}

/* 遮料层样式 */
.boxshletr {
  width: 100px;
  height: 45px;
  background: black;
  opacity: 0.6;
  position: absolute;
  bottom: -20px;
  //left: -1px;
  display: none;
}

.fa {
  color: white;
}

/* 小图标样式 */
.tree {
  color: aliceblue;
}
</style>
