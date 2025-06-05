<template>
    <el-row>
<!--        <i class="el-icon-document" style="font-size: 18px;text-align: center;color: #2196f3;"><span>数据补录同步：{{ defau.df_pro_name }}</span></i>-->
<!--        <el-button size="small" type="text" style="float:right;" @click="goUpper">返回上一级</el-button>-->
<!--        <el-divider></el-divider>-->
      <ByContainerTitle title="数据补录同步">
        <el-button size="small" type="text" style="float:right;" @click="goUpper">返回上一级</el-button>
      </ByContainerTitle>
      <el-divider></el-divider>
        <ByQuickSearch
            :formItems="syncFormItems"
            @search="click_query"
            @reset="click_reset"
        ></ByQuickSearch>
<!--        <el-form :inline="true">-->
<!--            <el-form-item label="表单名称" style="margin-left: 10px;">-->
<!--                <el-input v-model="query.formName" size="small"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="状态" style="margin-left: 10px;">-->
<!--                <el-select v-model="query.status" size="small">-->
<!--                    <el-option v-for="item in defau.statusOptions" :key="item.code" :label="item.value" :value="item.code">-->
<!--                    </el-option>-->
<!--                </el-select>-->
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
          :columnArr="synchColumnArr"
          @operateItem="operateItem"
          :pagination="pagination"
          @sizeChange="pageSizeChange"
          @currentChange="pageCurrentChange"
        >
        </ByTable>
<!--        <el-table :data="tableData" stripe border style="width: 100%">-->
<!--            <el-table-column type="selection" width="55">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="hyren_name" label="表英文名" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="dep_name" label="部门" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="user_name" label="创建人" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="create_date" label="创建时间" :formatter="formatDateTimeCreate" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="update_date" label="最后更新时间" :formatter="formatDateTimeUpdate" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="is_sync" label="状态" :formatter="formatStatus" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" show-overflow-tooltip align='center'>-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button @click="click_list_show(scope.row)" type="text" size="small">查看</el-button>-->
<!--                    <el-button v-if="scope.row.is_sync == 0" @click="click_list_synch(scope.row)" type="text" size="small">同步</el-button>-->
<!--                    <el-button v-if="scope.row.is_sync == 1" @click="click_list_rollback(scope.row)" type="text" size="small">回滚</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--        </el-table>-->
<!--        <div class="block">-->
<!--            <el-pagination style="text-align: center;" @size-change="pageSizeChange" @current-change="pageCurrentChange"-->
<!--                :current-page="page.current" :page-sizes="page.pageSizes" :page-size="page.pageSize"-->
<!--                layout="total, sizes, prev, pager, next, jumper" :total="page.total">-->
<!--            </el-pagination>-->
<!--        </div>-->
        <el-dialog :visible.sync="dialog.visible" @close="dialogClose">
            <el-table :data="dialog.tableData" stripe border>
                <template v-for="(item, index) in dialog.cols">
                    <el-table-column :key="index" :prop="item"
                        :label="item" show-overflow-tooltip align='center' :render-header="labelHead"></el-table-column>
                </template>
            </el-table>
        </el-dialog>
    </el-row>
</template>
<script>
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {
  syncFormItems,
  synchColumnArr
} from './mock'
export default {
  components: {ByQuickSearch, ByContainerTitle},
    data() {
        return {
          syncFormItems,
          synchColumnArr,
          pagination:{
            total : 0,
            pageNum : 1,
            pageSize : 10,
            pageSizes : [10, 50, 100, 500],
          },
            defau: {
                df_pid: null,
                df_pro_name: null,
                statusOptions: [
                    {
                        code: 1,
                        value: '已同步'
                    }, {
                        code: 0,
                        value: '未同步'
                    }
                ]
            },
            query: {
                formName: null,
                status: null,
            },
            tableData: [],
            page: {
                current: 1,
                pageSizes: [10, 50, 100, 500],
                pageSize: 10,
                total: 0
            },
            dialog: {
                visible: false,
                tableData: [],
                cols: [],
            }
        }
    },
    methods: {
      operateItem(type,data){
        if (type == 'view'){
          this.click_list_show(data)
        }else if (type == 'synch'){
          this.click_list_synch(data)
        } else if (type == 'rollback'){
          this.click_list_rollback(data)
        }
      },
        //表头自适应
        labelHead (h, { column, index }) {
            let l = column.label.length
            let f = 14 //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
            column.minWidth = f * l //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
            //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
            return h('div', { class: 'table-head', style: { width: '100%' } }, [column.label])
        },
        // 返回上级页面
        goUpper(){
            this.$router.push({
                name: 'dataSupplementSynchronization'
            })
        },
        // 查询按钮
        click_query(data) {
            this.refreshTable(data);
        },
        //重置按钮
        click_reset(data) {
            this.query.formName = null;
            this.query.status = null;
            this.refreshTable(data);
        },
        // 列表-查看按钮
        click_list_show(row) {
            // console.log("click_operation")
            this.dialog.visible = true;
            this.refreshDialog(row.apply_tab_id);
        },
        // 列表-同步按钮
        click_list_synch(row) {
            console.log("click_list_synch")
            var data = {
                applyTabId: row.apply_tab_id
            }
            this.$executeRequest.execGetByMenuUrl("/sync/sync",data).then(res =>{
              console.log("synch.synch(data)");
              console.log(res)
              if (res && res.data == true) {
                this.$message({
                  type: 'success',
                  message: '同步成功!'
                })
                this.refreshTable(this.query);
              }
            })
        },
        // 列表-回滚按钮
        click_list_rollback(row) {
            console.log("click_list_rollback")
            var data = {
                applyTabId: row.apply_tab_id
            }
            this.$executeRequest.execGetByMenuUrl("/sync/rollback",data).then(res =>{
              console.log("synch.rollback(data)");
              console.log(res)
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '回滚成功!'
                })
                this.refreshTable(this.query);
              }
            })
        },
        // dialog关闭事件
        dialogClose() {
            // 清空弹窗中的数据
            this.dialog.tableData = [];
            this.dialog.cols = [];
        },
        // 分页大小变更事件
        pageSizeChange(val) {
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
        // 初始化 IsFlag 枚举数据
        initIsFlag() {
            console.log("initIsFlag")
            this.$executeRequest.execGetByMenuUrl("/sync/getIsFlag").then(res =>{
              // console.log(res)
              if (res && res.data) {
                this.defau.IsFlag = res.data;
              }
            })
        },
        // 刷新列表
        refreshTable(data) {
            this.query.formName=data.formName;
            this.query.status=data.status;
            var data = {
                dfPid: this.defau.df_pid,
                fuzzyName: this.query.formName,
                status: this.query.status,
                pageSize: this.page.pageSize,
                currPage: this.page.current,
            };
            this.$executeRequest.execGetByMenuUrl("/sync/query",data).then(res =>{
              if (res && res.data) {
                var tableData = res.data;
                console.log(tableData,"tableData")
                // 渲染
                if (tableData) {
                  if (tableData.total != null) {
                    this.page.total = tableData.total;
                    this.pagination.total = tableData.total;
                  }
                  if (tableData.list != null) {
                    tableData.list.forEach(item => {
                      if (item.user_name == null){
                        item.user_name = "";
                      }
                      if (item.is_sync == '1'){
                        item.sync = '已同步'
                      } else {
                        item.sync = '未同步'
                      }
                    })
                    console.log(tableData.list,"tableData.list")
                    this.tableData = tableData.list;
                  }
                }

              }
            })
        },
        //刷新 dialog
        refreshDialog(id) {
            var data = {
                apply_tab_id: id
            }
            // 获取临时表字段
            // synch.queryTempTableColumn(id).then(res=>{
            //     console.log("synch.queryTempTableColumn(id).them(res=>{");
            //     console.log(res);
            //     if(res && res.data){
            //     }
            // })
            // 获取临时表数据
            this.$executeRequest.execGetByMenuUrl("/sync/queryData",data).then(res =>{
              if (res && res.data) {
                var d = res.data;
                var cols = [];
                for (var key in d[0]) {
                  cols.push(key);
                }
                this.dialog.cols = cols;
                this.dialog.tableData = d;
              }
            })
            // synch.queryTempTableData(data).then(res => {
            //     if (res && res.data) {
            //         var d = res.data;
            //         var cols = [];
            //         for (var key in d[0]) {
            //             cols.push(key);
            //         }
            //         this.dialog.cols = cols;
            //         this.dialog.tableData = d;
            //     }
            // })
        },
        // 格式化同步状态
        formatStatus(value) {
            if (this.defau.statusOptions && this.defau.statusOptions.length > 0) {
                for (var i = 0; i < this.defau.statusOptions.length; i++)
                    if (value.is_sync == this.defau.statusOptions[i].code) {
                        return this.defau.statusOptions[i].value;
                    }
            }
        },
        // 格式化时间
        formatDateTimeCreate(value){
            var dateTime = (value.create_date==null? "":value.create_date)+ (value.create_time==null?"":value.create_time);
            return this.$Date.dateToMilldate(dateTime)
        },
        formatDateTimeUpdate(value){
            var dateTime = (value.update_date==null? "":value.update_date)+(value.update_time==null?"":value.update_time);
            return this.$Date.dateToMilldate(dateTime)
        }
    },
    mounted: function () {
        console.log(this.$route.query)
        this.defau.df_pid = this.$route.query.id;
        this.defau.df_pro_name = this.$route.query.pro_name;

        this.initIsFlag();
        this.refreshTable(this.query)
    }
}
</script>