<template>
  <div class="dataVisualization">
    <div class="d-flex my-10 justify-content-between">
      <ByHeaderSlice title="数据可视化"/>
      <div class="d-flex align-items-center">
        <el-row style="margin-right: 20px">
          <el-input placeholder="请输入组件名称"  size="mini" v-model="componentName">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-row>
        <el-row>
          <el-button type="primary" size="small" @click="addProject">新建组件</el-button>
        </el-row>
      </div>
    </div>
    <el-table size="medium" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="70px" align='left'>
      </el-table-column>
      <el-table-column prop="component_name" show-overflow-tooltip label="组件名称" align='left'>
      </el-table-column>
      <el-table-column prop="component_desc" show-overflow-tooltip label="组件描述" align='left'>
      </el-table-column>
      <el-table-column prop="data_source" show-overflow-tooltip label="数据来源" width="130px" align='left'>
      </el-table-column>
      <el-table-column prop="component_status" show-overflow-tooltip label="组件状态" width="100px" align='left'>
      </el-table-column>
      <el-table-column prop="create_date" label="创建日期" align='left'>
      </el-table-column>
      <el-table-column label="创建用户" prop="create_user" width="150px" show-overflow-tooltip align='left'>
      </el-table-column>
      <el-table-column label="操作" align='left' width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="mini" type="text" @click="vieSql(scope.$index, scope.row)">查看sql
          </el-button>
          <el-button size="mini" type="text" @click="deleteVisualComponent(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right"
                     :page-sizes="[5,10,20,25,50,100,1000]" :current-page="currPage" :page-size="pageSize"
                     :total="totalSize" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-row>
    <!-- 查看sql -->
    <el-dialog title="查看sql" :visible.sync="viewSqlDataDiolag" width="900px">
      <el-input type="textarea" :rows="14" placeholder="请输入内容" v-model="exe_sql">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewSqlDataDiolag=false" size="mini" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  data() {
    return {
      viewSqlDataDiolag: false,
      tableData: [],
      compState: [],
      autoSourceObject: [],
      exe_sql: '',
      componentName: '',
      currPage: 1,
      pageSize: 10,
      totalSize: 0,
    }
  },
  mounted() {
    this.getCodeItems('AutoFetchStatus');
    this.getCodeItems("AutoSourceObject");
    this.getVisualComponentInfo();
  },
  methods: {
    getCodeItems(val) {
      if (val == "AutoFetchStatus") { //组件状态
        this.$Code.getCategoryItems({
          category: 'AutoFetchStatus'
        }).then((res) => {
          if (res && res.success) {
            this.compState = res.data;
          }
        })
      } else if (val == "AutoSourceObject") { //可视化源对象
        this.$Code.getCategoryItems({
          category: 'AutoSourceObject'
        }).then((res) => {
          if (res && res.success) {
            this.autoSourceObject = res.data;
          }
        })
      }
    },
    // 数据可视化首页列表展示
    getVisualComponentInfo() {
      let data = {
        currPage: this.currPage,
        pageSize: this.pageSize
      }
      this.$executeRequest.execGetByModuleUrl('/dataVisualization/operate/getVisualComponentInfo', data).then((res) => {
        if (res && res.success) {
          res.data.visualCompList.forEach(item => {
            if (item.create_date) {
              item.create_date = this.$Date.dateToMilldate(item.create_date + " " + item.create_time);
            }
            this.compState.forEach(val => {
              if (item.component_status == val.code) {
                item.component_status = val.value;
              }
            })
            this.autoSourceObject.forEach(val => {
              if (item.data_source == val.code) {
                item.data_source = val.value;
              }
            })
          })
          this.tableData = res.data.visualCompList;
          this.totalSize = res.data.totalSize;
        }
      })
    },
    search() {
      this.currPage = 1;
      this.getVisualComponentInfoByName();
    },
    // 根据组件名称模糊查询数据可视化组件信息
    getVisualComponentInfoByName() {
      if (this.componentName == '') {
        // 为空查询所有
        this.getVisualComponentInfo();
      } else {
        //不为空
        let data = {
          componentName: this.componentName,
          currPage: this.currPage,
          pageSize: this.pageSize
        }
        this.$executeRequest.execGetByPostModuleUrl('/dataVisualization/operate/getVisualComponentInfoByName', data).then((res) => {
          if (res && res.success) {
            res.data.visualCompList.forEach(item => {
              if (item.create_date) {
                item.create_date = this.$Date.dateToMilldate(item.create_date + " " + item.create_time);
              }
              this.compState.forEach(val => {
                if (item.component_status == val.code) {
                  item.component_status = val.value;
                }
              })
              this.autoSourceObject.forEach(val => {
                if (item.data_source == val.code) {
                  item.data_source = val.value;
                }
              })
            })
            this.tableData = res.data.visualCompList;
            this.totalSize = res.data.totalSize;
          }
        })
      }
    },
    // 新建组件
    addProject() {
      this.$router.push({
        name: 'visualization'
      })
    },
    //编辑
    handleEdit(index, row) {
      this.$router.push({
        name: 'visualization',
        query: {
          component_id: row.component_id
        }
      })
    },
    //查看sql
    vieSql(index, row) {
      // 查看sql接口
      this.viewSqlDataDiolag = true;
      this.exe_sql = row.exe_sql;
    },
    //删除
    deleteVisualComponent(row) {
      this.$confirm('确认删除组件（' + row.component_name + '）吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 删除接口
        let data = {
          component_id: row.component_id
        }
        this.$executeRequest.execGetByPostModuleUrl('/dataVisualization/operate/deleteVisualComponent', data).then((res) => {
          if (res && res.success) {
            // res.data.visualCompList.forEach(item => {
            //   // 从新渲染表格
            //   this.getVisualComponentInfo();
            //   this.$Msg.customizTitle('删除成功', 'success')
            // })
            // 从新渲染表格
            this.getVisualComponentInfo();
            this.$Msg.customizTitle('删除成功', 'success')
            this.totalSize = res.data.totalSize;
            this.tableData = res.data.visualCompList;
          }
        })
      }).catch(() => {});
    },
    // 自主取数分页方法
    handleCurrentChange(currPage) {
      this.currPage = currPage;
      if (this.componentName == '') {
        this.getVisualComponentInfo();
      } else {
        this.getVisualComponentInfoByName()
      }
    },
    handleSizeChange(pageSize) {
      this.currPage = 1;
      this.pageSize = pageSize;
      if (this.componentName == '') {
        this.getVisualComponentInfo();
      } else {
        this.getVisualComponentInfoByName()
      }
    },
  },
}
</script>

<style scoped>
.elRows {
  height: 40px;
  line-height: 40px;
  width: 100%;
}

.el-row span {
  color: #2196f3;
  font-size: 18px;
}

/* button样式设置 */
.els {
  float: right;
  margin-top: 3px;
}

.lines {
  margin-top: 2px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 10px;
}
</style>
