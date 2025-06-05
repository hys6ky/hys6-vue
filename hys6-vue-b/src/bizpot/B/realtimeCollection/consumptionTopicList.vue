<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">生产端消息主题列表</span>
      <router-link :to="{name:'realtimeCollection'}">
        <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">返回</el-button>
      </router-link>
      <router-link :to="{name:'consumptionList'}">
        <el-button type="primary" size="small" class="goIndex">查看消费列表</el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="tableBlock">
      <el-table size="medium" stripe :data="tableData" :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ 'text-align': 'center'}">
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column label="消息主题" prop="sdm_top_name"></el-table-column>
        <el-table-column label="生产端任务" prop="sdm_receive_name"></el-table-column>
        <el-table-column label="生产端Agent" prop="sdm_agent_name"></el-table-column>
        <el-table-column label="生产端数据源" prop="sdm_source_name"></el-table-column>
        <el-table-column label="生产用户" prop="user_id"></el-table-column>
        <el-table-column label="状态" prop="application_status"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template scope="scope">
            <el-button type="text" @click="cancelApplicantion(scope.row)"
                       v-if="scope.row.application_status=='申请中'||tableData.application_status=='申请不通过'"
                       style="color:green">取消申请
            </el-button>
            <el-button type="text" @click="againApplicantion(scope.row)"
                       v-if="scope.row.application_status=='申请不通过'">再次申请
            </el-button>
            <el-button type="text" @click="applyConsume(scope.row)" v-if="scope.row.application_status=='未申请'"
                       style="color:green">申请消费
            </el-button>
            <el-button type="text" @click="checkDataStructure(scope.row)">查看生产端数据结构</el-button>
            <el-button type="text" @click="getDataPreview(scope.row)">数据预览</el-button>
            <el-button type="text" @click="consumerTopic(scope.row)" v-if="scope.row.application_status=='申请通过'"
                       style="color:green">添加消费
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog :visible.sync="dataStructureDialog" title="生产端数据结构" width="1000px">
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">生产端数据结构</span>
        </div>
        <div>
          <el-table :data="dataStructureTable" stripe size="medium" height="400px" style="overflow:auto"
                    :cell-style="{'text-align':'center'}" :header-cell-style="{ textAlign: 'center' }">
            <el-table-column label="序号" prop="num"></el-table-column>
            <el-table-column label="变量名" prop="sdm_var_name_en"></el-table-column>
            <el-table-column label="变量中文名" prop="sdm_var_name_cn"></el-table-column>
            <el-table-column label="变量类型" prop="sdm_var_type"></el-table-column>
            <el-table-column label="描述" prop="sdm_describe"></el-table-column>
            <el-table-column label="是否发送" prop="sdm_is_send"></el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination @current-change="handleCurrentDataChangeList" :current-page="currDataPage"
                         @size-change="handleSizeDataChange" :page-sizes="[5, 10, 20,50]" :page-size="pageDataSize"
                         layout=" total,sizes,prev, pager, next,jumper" :total="totalDataSize" class='locationcenter'/>
        </div>
        <span slot="footer">
                <el-button @click="dataStructureDialog = false" type="danger" size="small">关闭</el-button>
            </span>
      </el-dialog>
      <el-dialog :visible.sync="dataPreView" title="数据预览" width="1000px">
        <!--        <div slot="title">-->
        <!--          <span class="dialogtitle el-icon-caret-right">数据预览</span>-->
        <!--        </div>-->
        <!--        <div id='container111' style="overflow-y:auto;overflow-x:auto;max-height:340px;max-width:100%;padding: 10px;padding-left:0;padding-right:0;text-align:center">-->
        <!--        </div>-->
        <el-table :data="dataPreViewTableData"
                  height="450"
                  stripe
                  border
                  size="medium"
                  :header-cell-style="thStyleFun"
                  :cell-style="cellStyleFun">
          <template v-for="(index,column) in dataPreViewTableData[0]">
            <el-table-column :key="column" :label="column" :prop="column">
              <template slot-scope="scope">{{
                  scope.row[scope.column.property]
                }}
              </template>
            </el-table-column>
          </template>

        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  created() {
    this.getTableData();
    if (this.dataPreViewTableData.length > 0) {
      // 获取第一个对象的属性作为表头列
      this.tableColumns = Object.keys(this.dataPreViewTableData[0]).map(key => {
        return {key: key, label: key};
      });
    }
  },
  data() {
    return {
      dataStructureDialog: false,
      dataPreView: false,
      currDataPage: 1,
      pageDataSize: 10,
      totalDataSize: 0,
      dataStructureTable: [],
      tableData: [],
      sdm_receive_id: '',
      dataPreViewTableData: [],
    }
  },
  methods: {
    //表头居中
    thStyleFun() {
      return "text-align:center";
    },
    //数据居中
    cellStyleFun() {
      return "text-align:center";
    },
    //获取页面列表数据
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getConsumerTopicList').then((res) => {
        this.tableData = res.data.map((item) => {
          let result = JSON.parse(item)
          item.split(',').map((ele) => {
            if (ele.indexOf('sdm_receive_id') != -1) {
              result.sdm_receive_id = ele.split(':')[1]
            }
            if (ele.indexOf('topic_id') != -1) {
              result.topic_id = ele.split(':')[1]
            }
            if (ele.indexOf('app_id') != -1) {
              result.app_id = ele.split(':')[1]
            }
          })
          return result
        });
      })
    },
    //再次申请
    againApplicantion(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/againApplicantion', {
        app_id: data.app_id
      }).then((res) => {
        this.getTableData()
      })
    },
    //取消申请
    cancelApplicantion(data) {
      this.$Msg.confirmMsg('确定取消申请？').then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/cancelApplicantion', {
          app_id: data.app_id
        }).then((res) => {
          this.$Msg.customizTitle('取消申请成功！', 'success')
          this.getTableData()
        })
      })

    },
    //消费
    consumerTopic(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumerTopic', {
        topic_id: data.topic_id,
      }).then((res) => {
        if (res.success == true) {
          res.data.type = 'create'
          this.$router.push({
            name: 'consumptionDataConfig',
            query: res.data
          })
        }
      })
    },
    //申请消费
    applyConsume(data) {
      if (data.sdm_receive_name == undefined) {
        this.$Msg.customizTitle('请创建生产端任务！', 'warning');
      } else {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/applyConsume', {
          topic_id: data.topic_id,
          sdm_receive_id: data.sdm_receive_id,
          user_id: data.user_id
        }).then((res) => {
          if (res.success) {
            this.$Msg.customizTitle('申请成功！', 'success')
            this.getTableData()
          }
        })
      }

    },
    //数据预览
    getDataPreview(data) {
      if (data.sdm_receive_id == undefined) {
        this.$Msg.customizTitle('暂未配置！', 'warning')
      } else {
        this.dataPreView = true
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getDataPreview', {
          sdm_receive_id: data.sdm_receive_id
        }).then((res) => {
          if (res && res.success) {
            this.dataPreViewTableData = res.data.data
          }
          // if (res.data && res.data.msgArray != '') {
          //   let test = document.getElementById('container111')
          //   test.innerHTML = res.data.msgArray
          //   let test1 = test.getElementsByTagName('table')
          //   test1[0].style.borderLeft = "1px solid"
          //   test1[0].style.borderTop = "1px solid"
          //   test1[0].style.width = "100%"
          //   let test2 = test.getElementsByTagName('td')
          //   for (let k = 0; k < test2.length; k++) {
          //     test2[k].style.borderBottom = "1px solid"
          //     test2[k].style.borderRight = "1px solid"
          //   }
          //   let test3 = test.getElementsByTagName('th')
          //   for (let k = 0; k < test3.length; k++) {
          //     test3[k].style.borderBottom = "1px solid"
          //     test3[k].style.borderRight = "1px solid"
          //   }
          // } else {
          //   let test = document.getElementById('container111')
          //   test.innerHTML = "<span>暂无数据！</span>"
          // }
        })
      }
    },
    //查看消费数据结构
    checkDataStructure(data) {
      this.sdm_receive_id = data.sdm_receive_id;
      if (data.sdm_receive_id == undefined) {
        this.$Msg.customizTitle('暂未配置！', 'warning')
      } else {
        this.dataStructureDialog = true
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
          sdm_receive_id: data.sdm_receive_id,
          currPage: this.currDataPage,
          pageSize: this.pageDataSize,
        }).then((res) => {
          this.totalDataSize = res.data.totalSize
          this.dataStructureTable = res.data.messInfoList
        })
      }
    },
    //表数据实现分页功能
    handleCurrentDataChangeList(currPage) {
      //把val赋给当前页面
      this.currDataPage = currPage;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
        sdm_receive_id: this.sdm_receive_id,
        currPage: this.currDataPage,
        pageSize: this.pageDataSize,
      }).then((res) => {
        this.totalDataSize = res.data.totalSize
        this.dataStructureTable = res.data.messInfoList
      })
    },
    // 改变表数据每页显示条数
    handleSizeDataChange(pageSize) {
      this.pageDataSize = pageSize;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
        sdm_receive_id: this.sdm_receive_id,
        currPage: this.currDataPage,
        pageSize: this.pageDataSize,
      }).then((res) => {
        this.totalDataSize = res.data.totalSize
        this.dataStructureTable = res.data.messInfoList
      })
    },
  }

}
</script>

<style scoped>
.nav {
  font-size: 20px;
  color: #2196f3;
}

.lines {
  margin-top: 4px;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
</style>
