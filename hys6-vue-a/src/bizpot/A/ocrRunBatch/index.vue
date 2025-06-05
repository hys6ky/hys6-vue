<template>
  <div  class="h100 d-flex">
        <ByTree
            :data="treeData"
            :defaultProps="treeProps"
            @logDetail="logDetail"
            class="h100"
        ></ByTree>
    <div class="px-20 d-flex flex-column" style="width: calc(100% - 295px)">
      <div class="d-flex py-10 justify-content-between">
        <ByHeaderSlice title="OCR跑批" />
      </div>
      <ByTable
          :tableData="taskList"
          :columnArr="taskCols"
          @operateItem="operateItem"
          v-if="taskList.length > 0"
      ></ByTable>
      <ByEmpty v-else></ByEmpty>
    </div>
<!--    </div>-->
<!--   -->
<!--    <div  class="px-20 d-flex flex-column" style="width: calc(100% - 295px)">-->
<!--      -->
<!--    </div>-->
<!--    <div class="dataSheetmain">-->
<!--      <el-col :span="2" v-for="(item,index) in dataSourceList" :key="index">-->
<!--        <div class="dataSheetmainDiv" @click="getFileCollectionTasks(item.source_id)">-->
<!--          <div style="margin-top:6px;">-->
<!--            <img :src="imgUrl" style="width: 32px;height: 32px;">-->
<!--            <p>{{item.datasource_name}}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </div>-->
    <!-- 弹出数据源选择模态框 start-->
<!--    <el-dialog title="OCR跑批任务列表" :visible.sync="file_collection_task_dialog" width="80%">-->
<!--      <el-row :gutter="10">-->
<!--        <el-col>-->
<!--          <el-table :data="taskList" size="mini">-->
<!--            <el-table-column type="index" label="序号" width="70" align="center" />-->
<!--            <el-table-column prop="agent_name" label="Agent名称" align="center" />-->
<!--            <el-table-column prop="agent_ip" label="Agent部署主机IP" align="center" />-->
<!--            <el-table-column prop="fcs_name" label="采集任务名" align="center" />-->
<!--            <el-table-column prop="create_date" label="任务创建日期" align="center" />-->
<!--            <el-table-column prop="create_time" label="采集创建时间" align="center" />-->
<!--            <el-table-column label="操作" align="center">-->
<!--              <template slot-scope="scope">-->
<!--                <a href="javascript:void(0)" class="linkStyle text-primary" @click="startOcrRunBatch(scope.row.fcs_id)">OCR跑批</a>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-dialog>-->
    <!-- 弹出数据源选择模态框 end-->
    <!-- 加载遮罩层 start -->
<!--    <transition>-->
<!--      <loading v-if="isLoading" />-->
<!--    </transition>-->
    <!-- 加载遮罩层 end -->
  </div>
</template>

<script>
import Loading from '@/components/loading';
import ByTree from "@/components/global/ByTree.vue";
import {getFlatArr, parseSimpleTreeData, treeFindPath} from "@/utils/datahandler.js";
import ByTable from "@/components/global/ByTable.vue";
import {
  taskCols
} from "./mock"
import ByEmpty from "@/components/global/ByEmpty.vue";
import {dateFormat, hourFormat} from "@/utils/dateconversion";
export default {
  name: "",
  components: {
    ByEmpty,
    ByTable,
    ByTree,
    Loading,
  },
  data() {
    return {
      taskCols,
      treeProps:{
        children: "children",
        label: "datasource_name",
      },
      treeData:[],
      imgUrl:require('@/assets/orc.svg'),
      //数据源列表
      dataSourceList: [],
      //数据源下任务列表
      taskList: [],
      //文件采集任务对话框
      file_collection_task_dialog: false,
      //页面加载遮罩层
      isLoading: false,
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    //树初始化
    initTree() {
      this.$executeRequest.execGetAllPathByUrl("/ocrRunBatch/getFileCollectionDataSources")
          .then((res) => {
            const list = JSON.parse(JSON.stringify(res.data));
            list.map((item) => {
              item.kind = "project";
            });
            let arr = getFlatArr(list);
            arr.map((item) => {
              item.id = item.source_id;
              item.showLable = item.datasource_name;
              item.type = "text";
              item.children = [];
            });
            this.treeData = parseSimpleTreeData(arr, "source_id", "parent_id");
          });
    },
    //点击树事件
    logDetail(node){
      this.getFileCollectionTasks(node.source_id);
    },
    //操作 OCR跑批
    operateItem(type, row,index){
      this.startOcrRunBatch(row.fcs_id);
    },
    getFileCollectionTasks(data_source_id) {
      this.$executeRequest.execGetAllPathByUrl('/ocrRunBatch/getFileCollectionTasks',{
        'sourceId': data_source_id
      }).then((res) => {
        if (res && res.success){
          this.file_collection_task_dialog = true;
          this.taskList = res.data;
          this.taskList.forEach(item =>{
            item.create_date = this.$dateconversion.dateFormat(item.create_date)
            item.create_time = this.$dateconversion.hourFormat(item.create_time)
          })
        }
      })
    },
    //OCR跑批
    startOcrRunBatch(fcs_id) {
      this.isLoading = true;
      this.$executeRequest.execGetAllPathByUrl('/ocrRunBatch/startOcrRunBatch',{
        'fcs_id': fcs_id
      }).then((res) => {
        if (res && res.success) {
          this.isLoading = false;
          this.$Msg.customizTitle('跑批成功', 'success')
        } else {
          this.isLoading = false;
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
.dataSheetmain {
  padding-left: 30px;
  border: 1px solid #dddddd;
  min-height: 124px;
  padding-top: 30px;
  overflow: hidden;
  margin-bottom: 10px;
}

/* 遮料层样式 */
.boxshletr {
  width: 106px;
  height: 28px;
  background: black;
  opacity: 0.6;
  position: absolute;
  bottom: 0px;
  left: 0px;
  display: none;
  border-radius: 4px;
}

.topTitleLocal {
  margin-bottom: 6px !important;
}

.dataSheetmainDiv:hover {
  background: #286090;
  cursor: pointer;
}

.dataSheetmainDiv:hover .boxshletr {
  display: block;
}

.fa {
  color: white;
}

.dataSheetmainDiv {
  margin: 0 auto;
  margin-bottom: 30px;
  padding-top: 10px;
  width: 106px;
  height: 80px;
  background: #337AB7;
  border-radius: 4px;
  margin-right: 30px;
  text-align: center;
  float: left;
  position: relative;
}

.dataSheetmainDiv p {
  margin-top: 4px;
  color: #fff;
  margin-left: 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 超链接样式 */
.linkStyle {
  text-decoration: none;
}

/* 文本颜色 */
.text-primary {
  color: #409EFF;
}
</style>
