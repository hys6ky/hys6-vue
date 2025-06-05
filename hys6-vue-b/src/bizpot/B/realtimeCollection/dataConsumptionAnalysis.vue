<template>
  <div>
    <el-row>
      <el-col :span="4" style="margin-top: 10px">
        <span class="nav" style="font-size: 18px"><i class="el-icon-s-data"></i>数据消费分析</span>
      </el-col>
      <el-col :span="20" style="float: right">
        <router-link :to="{name:'streamDataAnalysis'}">
          <el-button type="primary" size="small" style="margin-left:10px" class="goIndex"><span style="color: white">返回流计算首页</span></el-button>
        </router-link>
        <router-link :to="{name:'dataConsumptionOutput',query:{ssj_job_id:this.$route.query.ssj_job_id,ssj_job_name:this.$route.query.ssj_job_name,type: this.$route.query.type}}">
          <el-button type="primary" size="small" style="margin-left:10px" class="goIndex"><span style="color: white">下一步</span></el-button>
        </router-link>
        <router-link :to="{name:'consunmptionInput',query:{ssj_job_id:this.$route.query.ssj_job_id,ssj_job_name:this.$route.query.ssj_job_name,type: this.$route.query.type}}">
          <el-button type="primary" size="small" class="goIndex"><span style="color: white">上一步</span></el-button>
        </router-link>
      </el-col>
    </el-row>
    <div class="lines"></div>
    <el-row :gutter='20'>
      <el-col :span="6">
        <div><span class="fontStyle">源表信息</span></div>
        <div style="margin-top:-20px">
          <el-divider />
        </div>
        <div class="mytree">
          <el-tree :data="treeData" node-key="name" :props="defaultProps" accordion :indent='2'>
                    <span class="span-ellipsis" slot-scope="{ node}">
                        <span :title="node.label">
                            <i class="el-icon-folder-opened" v-if="node.label =='文本文件'||node.label =='数据库表'||node.label =='消息主题'" />
                            <i class="el-icon-document" v-else />
                            {{ node.label }}
                        </span>
                    </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18" style="border-left: 1px #e0dcdc dashed;min-height: 40px;">
        <div><span class="fontStyle">分析处理</span>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              1.分析处理sql和输出表名一一对应。输出表名代表sql执行后的结果集。<br />
              2.写sql语句时，可以查询到源表信息中的任意表的数据。例：源表信息中有数据库表A，输出表名为T1。sql：select * from A ，T1就代表该sql执行后的结果。<br />
              3.如果写了多条sql语句，新增的sql可以对已经写好的sql的结果集（输出表名）进行操作。<br />
              例：（1）源表信息中有数据库表A，输出表名为T1，sql1：select * from A -->T1<br />
              （2）对sql1的结果进行查询，输出表名为T2，sql2：select * from T1 -->T2<br />
              （3）对sql2的结果进行查询，输出表名为T3，sql2：select * from T2 -->T3<br />
            </div>
            <i class="el-icon-question" style="margin-left: 10px"></i>
          </el-tooltip>
          <el-button style="margin-left:10px;float:right" @click="submit" type="primary" size="small">保存</el-button>
          <el-button type="primary" size="small" style="float:right" @click="add()">添加行</el-button>
        </div>
        <div style="margin-top:-10px">
          <el-divider />
        </div>
        <div>
          <el-table size="medium" stripe border :header-cell-style="{ textAlign: 'center' }" :cell-style="{ 'text-align': 'center' }" height="350px" :data="tabledata">
            <el-table-column label="序号" align="center" width="80px" type="index">
            </el-table-column>
            <el-table-column label="分析处理sql" min-width="80px" prop="analysis_sql">
              <template scope="scope">
                <el-input type="textarea" :rows="3" v-model="scope.row.analysis_sql"> </el-input>
              </template>
            </el-table-column>
            <el-table-column label="输出表名" min-width="60" prop="analysis_table_name">
              <template scope="scope">
                <el-input v-model="scope.row.analysis_table_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="90px">
              <template scope="scope">
                <el-button type="text" @click="del(scope.$index,scope.row)" class="delcolor">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {

  mounted() {
    this.getTableData()
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      total: 10,
      num: 10,
      treeData1: [],
      treeData: [],
      analysis_table_name: [],
      analysis_sql: [],
      tabledata: [
        { analysis_sql: '', analysis_table_name: '' },
      ]
    }
  },
  methods: {
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/getAnalyseSql',{
        ssj_job_id: this.$route.query.ssj_job_id
      }).then((res) => {
        this.tabledata = res.data
      })
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/getSdmAnalyseDataInfos',{
        pageStep: '2'
      }).then((res) => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/getTableDataList',{
          ssj_job_id: this.$route.query.ssj_job_id,
          pageStep: '2'
        }).then((ele) => {
          res.data.forEach((item)=>{
            ele.data.forEach((data)=>{
              if(item.id == data.parent_id){
                item.children = []
                item.children.push(data)
              }
            })
          })
          this.treeData = res.data
        })
      })
    },
    //增加sql输入框
    add() {
      var newValue = {
        analysis_sql: '',
        analysis_table_name: ''
      }
      this.tabledata.push(newValue)
    },
    //删除sql输入框
    del(index, data) {
      if (data.analysis_sql != '') {
        this.$confirm('确定删除该条分析处理sql?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (data.ssa_info_id) {
            this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/deleteAnalyseSql',{
              ssa_info_id: data.ssa_info_id
            })
          }
          this.tabledata.splice(index, 1)
        }).catch(() => {
          this.$message.info('已取消')
        })
      } else {
        this.tabledata.splice(index, 1)
      }
    },
    //保存填写分析sql内容
    submit() {
      this.tabledata.map((item) => {
        this.analysis_sql.push(item.analysis_sql)
        this.analysis_table_name.push(item.analysis_table_name)
      })
      let data = {
        ssj_job_id: this.$route.query.ssj_job_id,
        analysis_sql: this.analysis_sql,
        analysis_table_name: this.analysis_table_name
      }
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/saveAnalyseSql',data).then((res) => {
        if (res.success == true) {
          this.$Msg.saveSuccess(res)
        }
      })
    },
  }

}
</script>

<style scoped>
.lines {
  margin-top: 4px;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.nav {
  font-size: 20px;
  color: #2196f3;
}

.del {
  margin-bottom: 50px;
  height: 100px;
}

.input {
  width: 80%;
  top: 100px;
}

.fontStyle {
  color: #2196f3;
  font-size: 18px;
  margin-left: 20px;
}
</style>
