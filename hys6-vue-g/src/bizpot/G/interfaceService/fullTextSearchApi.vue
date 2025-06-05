<template>
<div class="fullTextSearchApi px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
  <by-container-title title="全文检索接口使用说明" class="my-10"></by-container-title>
<!--    <el-row class="topTitle">-->
<!--        <span class="el-icon-s-operation">全文检索接口使用说明</span>-->
<!--       <router-link :to="{name:'interfaceUser'}">-->
<!--            <el-button type="primary" class="goIndex" size="mini" icon="el-icon-s-home">-->
<!--                返回首页-->
<!--            </el-button>-->
<!--        </router-link>-->
<!--    </el-row>-->
    <el-row :gutter="20">
        <el-col :span="6">
          <by-header-slice title="请求方式"/>
<!--            <span class="fontStyle">请求方式</span>-->
            <el-input value="POST" :disabled="true" />
        </el-col>
        <el-col :span="18">
          <by-header-slice title="请求URL"/>
<!--            <span class="fontStyle">请求URL</span>-->
            <el-input v-model="ipAndPort" :disabled="true" />
        </el-col>
    </el-row>
    <el-divider />
    <by-header-slice title="请求参数列表"/>
<!--    <span class="fontStyle">请求参数列表</span>-->
    <!--请求参数列表展示-->
    <ByTable border size="medium"
             class="mt-10"
             :tableData="tableData"
             :columnArr="ApiColumnArr"
    >
    </ByTable>
<!--    <el-table :data="tableData" border size="medium">-->
<!--        <el-table-column prop="field" label="字段" width="160px" align="center" />-->
<!--        <el-table-column prop="fieldType" width="100px" label="类型" align="center" />-->
<!--        <el-table-column prop="isRequired" label="是否必填" align="center" />-->
<!--        <el-table-column prop="remark" label="描述" align="center" />-->
<!--    </el-table>-->
    <el-divider />
    <el-row>
<!--        <span class="fontStyle">使用方式事例：</span>-->
        <by-header-slice title="使用方式事例"/>
        <el-input v-model="requestAddressForToken" style="font-size: 16px;margin-top: 10px" :disabled="true" />
        <el-divider>或</el-divider>
        <el-input v-model="requestAddress" style="font-size: 16px;margin-top: 10px" :disabled="true" />
    </el-row>
    <el-divider />
    <el-row >
      <by-header-slice title="正常响应事例:"/>
<!--        <span class="fontStyle">正常响应事例:</span>-->
        <pre style="font-size: 14px;height: 600px">
            {
                "code":999
                "message":"Success",
                "analysis":["hadoop"],
                "data":[
                    {
                        "source_path":"/test/文件采集/10265.docx",
                        "downloadpath":"http://xxx/downloadFileSDO.do?view_down_file_id=16100&view_down_file_name=10265.docx",
                        "file_suffix":"docx",
                        "file_id":"161009900000125958055591",
                        "dep_id":"161009900330,125958055591",
                        "storage_date":"20161009",
                        "storage_time":"125958",
                        "original_update_date":"20160922",
                        "original_update_time":"114526",
                        "file_md5":"ada1cde354c05f0e9240ecdb21961d1f",
                        "file_size":"15145.00",
                        "original_name":"10265.docx",
                        "summary_content":"[测试文件内容，次内容为空]",
                        "fcs_name":"csss",
                        "collect_set_id":"1000000102",
                        "datasource_name":"yuan",
                        "source_id":"1000000079",
                        "agent_name":"文件采集",
                        "agent_id":"1000000081",
                        "file_avro_path":"/hrds/395/B0/10/20161009/avro_1475988430834"
                        "file_avro_block":"368284464"
                    }
                ],
                "success": true
            }
        </pre>
    </el-row>
    <el-row>
      <by-header-slice title="错误响应事例:"/>
<!--        <span class="fontStyle">错误响应事例:</span>-->
        <pre style="font-size: 14px;">
            {
                "code":1002,
                "message":"UNAUTHORIZED"
                "data":"账号或密码错误",
                "success": false
            }
        </pre>
    </el-row>
</div>
</template>

<script>
import Scrollbar from '@/components/global/Scrollbar.vue';
import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";

export default {
    name: "fileAttributeSearch",
    components: {
        Scrollbar
    },
    data() {
        return {
          ApiColumnArr,
            ipAndPort: '',
            requestAddressForToken: '',
            requestAddress: '',
            tableData: [{
                    field: 'user_id',
                    fieldType: 'Long',
                    isRequired: '必填，与user_password同选',
                    remark: '用户ID',
                },
                {
                    field: 'user_password',
                    fieldType: 'String',
                    isRequired: '必填，与user_id同选',
                    remark: '密码',
                },
                {
                    field: 'token',
                    fieldType: 'String',
                    isRequired: '必填，和user_id,user_password选择一种模式',
                    remark: 'token值',
                },
                {
                    field: 'url',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '请求路径（fullTextSearchApi）',
                },
                {
                    field: 'query',
                    fieldType: 'String',
                    isRequired: '必填(支持模糊查询)',
                    remark: '检索信息',
                },
                {
                    field: 'ds_name',
                    fieldType: 'String',
                    isRequired: '选填(支持模糊查询)',
                    remark: '数据源名称',
                },
                {
                    field: 'agent_name',
                    fieldType: 'String',
                    isRequired: '选填(支持模糊查询)',
                    remark: 'Agent采集名称',
                },
                {
                    field: 'fcs_name',
                    fieldType: 'String',
                    isRequired: '选填(支持模糊查询)',
                    remark: '任务采集名称',
                },
                {
                    field: 'filename',
                    fieldType: 'String',
                    isRequired: '选填(支持模糊查询)',
                    remark: '要查询文件名',
                },
                {
                    field: 'filesize',
                    fieldType: 'String',
                    isRequired: '选填(数值以字节为单位,例如filesize=1,2000输入范围值以英文逗号隔开)',
                    remark: '要查询文件大小',
                },
                {
                    field: 'filesuffix',
                    fieldType: 'String',
                    isRequired: '选填(filesuffix=xlsx 例如xlsx,docx,支持多个类型以英文逗号隔开)',
                    remark: '要查询文件后缀',
                },
                {
                    field: 'filemd5',
                    fieldType: 'String',
                    isRequired: '选填(32位文件内容MD5值)',
                    remark: '文件md5',
                },
                {
                    field: 'filepath',
                    fieldType: 'String',
                    isRequired: '选填(文件路径,支持多个路径)',
                    remark: '要查询文件的路径',
                },
                {
                    field: 'storagedate',
                    fieldType: 'String',
                    isRequired: '选填(时间格式为20160926)',
                    remark: '要查询文件入库日期',
                },
                {
                    field: 'dep_id',
                    fieldType: 'Long[]',
                    isRequired: '选填(多个部门传数组)',
                    remark: '要查询部门id',
                },
                {
                    field: 'fcs_id',
                    fieldType: 'Long[]',
                    isRequired: '选填(多个任务传数组)',
                    remark: '要查询任务id',
                },
                {
                    field: 'id',
                    fieldType: 'String',
                    isRequired: '选填(唯一文件ID,文件编号，即solr中存储的主键id)',
                    remark: '要查询的文件的唯一id',
                },
                {
                    field: 'num',
                    fieldType: 'String',
                    isRequired: '选填，不填默认显示10条,填写方式如: num=10',
                    remark: '显示条数',
                },
                {
                    field: 'hyren_sort',
                    fieldType: 'String',
                    isRequired: '选填(格式为：hyren_sort=fieldname+空格+desc|asc[,fieldname+空格+desc|asc]...)',
                    remark: '字段排列',
                },
                {
                    field: 'isAccurateQuery',
                    fieldType: 'String',
                    isRequired: '选填,是否为精确查询 选填(只能为：1 或者 0 {1: 是, 0: 否}, 如果不填，默认为 0: 否)',
                    remark: '是否为精确查询',
                },
            ],
        }
    },
    watch: {
        $route(to, from) {
            this.$router.go(0)
        }
    },
    mounted() {
        this.getIpAndPort();
    },
    methods: {
        // 查询当前用户的IP与端口信息
        getIpAndPort() {
          // 查询当前用户的IP与端口信息
            this.$executeRequest.execGetByModuleUrl('/interfaceService/serviceuser/getIpAndPort').then(res =>{
              this.ipAndPort = "http://" + res.data +
                  "/G/interfaceService/serviceuser/impl/" + this.$route.query.url;
              this.requestAddressForToken =
                  this.ipAndPort +
                  "?token=AJALalfja&url=" + this.$route.query.url + "&tableName=emp" +
                  "&filename=20160620&query=abc&num=20";
              this.requestAddress = this.ipAndPort +
                  "?user_id=1005&user_password=111111&url=" + this.$route.query.url +
                  "&filename=20160620&query=abc&num=20";
            })
        },
    }
}
</script>

<style lang="less" scoped>
//.filtstyle>>>.scrollbar-wrap .scrollbar__content {
//    position: relative;
//}

.el-table {
    margin-top: 10px;
}

.el-input {
    margin-top: 10px;
}

/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    cursor: not-allowed;
  height: 32px;
  font-size: 14px;
  font-family: @pingfang;
  color: @titletxt-color;
  padding: 0 10px;
}

.fontStyle {
    color: #2196f3;
    font-size: 18px;
}
.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
</style>
