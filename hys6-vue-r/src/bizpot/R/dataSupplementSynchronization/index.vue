<template>
    <el-row>
        <i class="el-icon-document" style="font-size: 18px;text-align: center;color: #2196f3;"><span>数据补录同步</span></i>
        <el-divider></el-divider>
        <ByQuickSearch
          :formItems="formItems"
          @search="search"
          @reset="click_reset"
        >
        </ByQuickSearch>
<!--        <el-form :inline="true">-->
<!--            <el-form-item label="项目名称" style="margin-left: 10px;">-->
<!--                <el-input v-model="query.proName" size="small"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="补录类型" style="margin-left: 10px;">-->
<!--                <el-select v-model="query.dfType" size="small">-->
<!--                    <el-option v-for="item in defau.dfTypeOptions" :key="item.code" :label="item.value" :value="item.code">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="提交时间" style="margin-left: 10px;">-->
<!--                <el-date-picker format="yyyy-MM-dd" value-format="yyyyMMdd" v-model="query.submitStartDate" type="date"-->
<!--                    placeholder="选择日期" size="small"></el-date-picker>-->
<!--                &#45;&#45;-->
<!--                <el-date-picker format="yyyy-MM-dd" value-format="yyyyMMdd" v-model="query.submitEndDate" type="date"-->
<!--                    placeholder="选择日期" size="small"></el-date-picker>-->

<!--            </el-form-item>-->

<!--            <el-form-item style="float: right;">-->
<!--                <el-button @click="click_query" size="mini" type="primary">查询</el-button>-->
<!--                <el-button @click="click_reset" size="mini" type="primary">重置</el-button>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
        <ByTable
          :tableData="tableData"
          :columnArr ="columnArr"
          @operateItem="operateItem"
          :pagination="pagination"
          @sizeChange="pageSizeChange"
          @currentChange="pageCurrentChange"
        >
        </ByTable>
<!--        <el-table :data="tableData" tooltip-effect="dark" stripe border style="width: 100%">-->
<!--            <el-table-column type="index" label="序号" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="pro_name" label="项目名称" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="df_type" label="补录类型" :formatter="formatDfType" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="submit_user" label="提交人" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="submit_date" label="提交时间" :formatter="formatDateTime" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="table_count" label="补录数量" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" show-overflow-tooltip align='center'>-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button @click="click_operation(scope.row)" type="text" size="small">操作</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--        </el-table>-->
<!--        <div class="block">-->
<!--            <el-pagination style="text-align: center;" @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.current"-->
<!--                :page-sizes="page.pageSizes" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"-->
<!--                :total="page.total">-->
<!--            </el-pagination>-->
<!--        </div>-->
    </el-row>
</template>
<script>
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {
  formItems,
  columnArr
} from './mock'
import ByTable from "@/components/global/ByTable.vue";
import {dateToMilldate} from "@/utils/dateconversion";
export default {
  components: {ByTable, ByQuickSearch},
    data() {
        return {
            formItems,
            columnArr,
            pagination:{
                total:0,
                pageNum:1,
                pageSize:10,
                pageSizes:[10, 50, 100, 200]
            },
            // 页面默认参数
            defau: {
                // 默认查看 补录类型集合
                defaultShowStates: [],
                // 默认不查看 补录类型集合
                defaultNoShowStates: [],
                // 补录类型集合
                dfTypeOptions: [],
                // 默认查看 审批类型集合
                defaultShowAppStates:[],
                // 默认不查看 审批类型集合 草稿、未审批、已拒绝
                defaultNoShowAppStates:[0,1,3]
            },
            // 查询参数
            query: {
                // 项目名-模糊搜索
                proName: null,
                // 补录类型
                dfType: null,
                // 提交时间-起始
                submitStartDate: null,
                // 提交时间-结束
                submitEndDate: null,
            },
            tableData: [],
            page: {
                current: 1,
                pageSizes: [10, 50, 100, 200],
                pageSize: 10,
                total: 0
            }
        }
    },
  mounted: function () {
    this.refreshTable(this.query);
    this.initDfType();
  },
  methods: {
        operateItem(type,data){
          this.click_operation(data)
        },
        search(data){
          this.refreshTable(data);
        },
        // 单机查询按钮
        click_query() {
            this.refreshTable();
        },
        // 单机重置按钮
        click_reset(data) {
            // console.log("click_reset")
            this.resetQueryData();
        },
        // 单击 操作/回滚/同步 按钮
        click_operation(val) {
            // console.log("click_operation df_pid:" + val.df_pid)
            // console.log(val);
            this.$router.push({
                name: 'synch_table',
                query:{
                    id:val.df_pid,
                    pro_name:val.pro_name
                }
            })
        },
        // 重置查询参数
        resetQueryData() {
            this.query = {
                proName: null,
                dfType: null,
                submitStartDate: null,
                submitEndDate: null,
            }
            this.refreshTable(this.query)
        },
        // 初始化补录类型
        initDfType() {
            this.$executeRequest.execPostByMenuUrl("/sync/getDfTypes").then(res =>{
              if(res && res.data){
                this.defau.dfTypeOptions = res.data;
                res.data.forEach(val =>{
                  this.formItems.forEach(item =>{
                    if (item.prop == 'dfType'){
                      let param = {};
                      param['value'] = val.code;
                      param['label'] = val.value;
                      item.options.push(param)
                    }
                  })
                })
              }
            })
        },
        // 分页大小变更事件
        pageSizeChange(val) {
            // console.log("pageSizeChange"+val);
            this.page.pageSize = val;
            this.page.current = 1;
            this.refreshTable(this.query);
        },
        // 分页当前页变更事件
        pageCurrentChange(val) {
            // console.log("pageCurrentChange"+val);
            this.page.current = val;
            this.refreshTable(this.query);
        },
        // 刷新列表
        refreshTable(data) {
          if (data.submitDate != null && data.submitDate.length > 0){
            this.query.submitStartDate = data.submitDate[0];
            this.query.submitEndDate = data.submitDate[1];
          }
          this.query.proName=data.proName;
          this.query.dfType=data.dfType;
            //创建请求参数
            var data = {
                fuzzyName: this.query.proName,
                type: this.query.dfType,
                startDate: this.query.submitStartDate,
                endDate: this.query.submitEndDate,
                pageSize: this.page.pageSize,
                currPage: this.page.current,

            };
            // 查询
            this.$executeRequest.execGetByMenuUrl("/sync/pageQueryPassed",data).then(res =>{
              if (res && res.data) {
                var tableData = res.data;

                // 渲染
                if (tableData) {
                  if (tableData.total != null) {
                    this.page.total = tableData.total;
                    this.pagination.total = tableData.total;
                  }
                  if (tableData.list != null) {
                    console.log(tableData.list,"list")
                    tableData.list.forEach(item => {
                      let date = item.submit_date + item.submit_time;
                      item['formatDate'] = this.$Date.dateToMilldate(date)
                    })

                    this.tableData = tableData.list;
                  }
                }

              }
            })
        },
        // 格式化补录类型
        formatDfType(value){
            if(this.defau.dfTypeOptions && this.defau.dfTypeOptions.length >0){
                for(var i = 0;i< this.defau.dfTypeOptions.length;i++){
                    if(value.df_type == this.defau.dfTypeOptions[i].code){
                        return this.defau.dfTypeOptions[i].value;
                    }
                }
            }
        },
        // 格式化时间
        formatDateTime(value){
            
            var dateTime = (value.submit_date==null? "":value.submit_date)+ (value.submit_time==null?"":value.submit_time);
            return this.$Date.dateToMilldate(dateTime)
        }

    },
}
</script>