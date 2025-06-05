<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">生产端消息主题列表</span>
      <router-link :to="{name: 'steamDataDistribution'}">
        <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">返回</el-button>
      </router-link>
      <router-link :to="{name:'consumptionDataConfig',query:{type:'create'}}">
        <el-button type="primary" size="small" class="goIndex"><i class="el-icon-plus" style="font-size:12px;margin-right:5px;font-weight:800" />添加消费</el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="tableBlock">
      <el-table stripe size="medium" :data="tableData" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ 'text-align': 'center'}">
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column label="消息名称" prop="sdm_cons_name"></el-table-column>
        <el-table-column label="创建用户" prop="user_id"></el-table-column>
        <el-table-column label="创建日期" prop="create_date">
        </el-table-column>
        <el-table-column label="是否按分区消费" prop="con_with_par">
          <template scope="scope">{{scope.row.con_with_par == '0'?'否':'是'}}</template>
        </el-table-column>
        <el-table-column label="消费目的地" prop="sdm_conf_describe"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template scope="scope">
            <router-link :to="{name:'consumptionDataConfig',query:{sdm_consum_id:scope.row.sdm_consum_id,type:'edit'}}">
              <el-button type="text" class="editcolor">编辑</el-button>
            </router-link>
            <el-button type="text" style="margin-left:5px" @click="del(scope.row,scope.$index)" class="delcolor">删除</el-button>
            <el-button type="text" @click="downLoad(scope.row)" class="sendcolor">下载</el-button>
            <el-button type="text" @click="copy(scope.row)" class="sendcolor">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as fileOperations from '@/utils/fileOperations'

export default {
  created() {
    this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getConsumerMsgList').then((res) => {
      this.tableData = res.data
      this.tableData.forEach((item) => {
        item.sdm_conf_describe = JSON.parse(item.sdm_conf_describe)
        item.sdm_conf_describe.forEach((res, index2) => {
          if (item.sdm_conf_describe.length >= 2) {
            item.sdm_conf_describe[index2] = fn(res) + ', '
          } else {
            item.sdm_conf_describe[index2] = fn(res)
          }
        })
        item.create_date = this.$Date.dateFormat(item.create_date);

        function fn(data) {
          switch (data) {
            case '1':
              return '数据库';
              break;
            case '2':
              return 'Hbase';
              break
            case '3':
              return 'Rest服务';
              break
            case '4':
              return '文件';
              break
            case '5':
              return '二进制文件';
              break
            case '6':
              return 'Kafka';
              break
            case '7':
              return '自定义业务类';
              break
            default:
              break
          }
        }
      })
    })
  },
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    //下载
    downLoad(data) {
      this.$executeRequest.execDownloadFileByModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/downLoadFile',{
        sdm_consum_id: data.sdm_consum_id
      }).then((res) => {
        fileOperations.fileDownload(res, "streamDistribute.zip")
      })
    },
    //复制
    copy(data) {
      var input = document.createElement("input"); // js创建一个input输入框
      input.value = data.sdm_consum_id; // 将需要复制的文本赋值到创建的input输入框中
      document.body.appendChild(input); // 将输入框暂时创建到实例里面
      input.select(); // 选中输入框中的内容
      document.execCommand("Copy"); // 执行复制操作
      this.$Msg.customizTitle('复制成功！', 'success')
      document.body.removeChild(input);
    },
    //删除列表数据
    del(data, index) {
      this.$Msg.confirmMsg('确认删除该消息主题？').then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/deleteConsumerMsg',{
          sdm_consum_id: data.sdm_consum_id
        }).then((res) => {
          this.tableData.splice(index, 1)
          this.$Msg.deleteSuccess(res)
        })
      }).catch(()=>{
        this.$message.info('已取消')
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
