<template>
<div class="interfaceInfo px-20">
  <el-tabs @tab-click="handleClick">
    <!--接口使用信息列表展示-->
    <el-tab-pane label="接口使用信息">
      <div class="search my-10 ">
<!--        <el-input placeholder="请输入接口名称" clearable v-model="interface_name">-->
<!--                <el-button slot="append" @click="searchInterfaceInfo" icon="el-icon-search">查询-->
<!--                </el-button>-->
<!--            </el-input>-->
        <router-link :to="{name:'interfaceTest'}">
          <el-button type="primary" size="mini">接口测试</el-button>
        </router-link>
      </div>
      <ByTable
          :tableData="interfaceUseData.slice((pagination.pageNum - 1) * pagination.pageSize,pagination.pageNum * pagination.pageSize)"
          :columnArr="columnArr"
          :pagination="pagination"
          @linkTo="jumpTo"
          @handleFilter="searchInterfaceInfo"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChangeList"
      ></ByTable>
      <!-- 分页内容 -->
<!--      <el-row class="pagination">-->
<!--        <el-pagination @current-change="handleCurrentChangeList" :current-page="currPage" @size-change="handleSizeChange" :page-sizes="[5, 10, 20,50, 100,500]" :page-size="pageSize" layout=" total,sizes,prev, pager, next,jumper" :total="totalSize" class='locationcenter' />-->
<!--      </el-row>-->
<!--      <el-divider />-->

    </el-tab-pane>
    <el-tab-pane label="数据使用信息">
      <!--数据使用信息列表展示-->
<!--      <div class="search mt-10">-->
<!--        <el-input placeholder="请输入表名称" clearable v-model="sysreg_name">-->
<!--          <el-button slot="append" @click="searchDataTableInfo" icon="el-icon-search">查询</el-button>-->
<!--        </el-input>-->
<!--      </div>-->
      <ByTable
          class="mt-10"
          :tableData="dataUseData.slice((pagination1.pageNum - 1) * pagination1.pageSize,pagination1.pageNum * pagination1.pageSize)"
          :columnArr="columnArr1"
          @operateItem="operateItem1"
          @handleFilter="searchDataTableInfo"
          :pagination="pagination1"
          @sizeChange="handleSizeChange1"
          @currentChange="handleCurrentChangeList1"
      ></ByTable>
      <!-- 分页内容 -->
<!--      <el-row class="pagination">-->
<!--        <el-pagination @current-change="handleCurrentDataChangeList" :current-page="currDataPage" @size-change="handleSizeDataChange" :page-sizes="[5, 10, 20,50, 100,500]" :page-size="pageDataSize" layout=" total,sizes,prev, pager, next,jumper" :total="totalDataSize" class='locationcenter' />-->
<!--      </el-row>-->

    </el-tab-pane>
  </el-tabs>

<div>
</div>
    <!--查看字段弹出框-->
    <ByModel
        :visible.sync="dialogViewFieldFormVisible"
        :modelTitle="viewTitle"
        modelWidth="600px"
        :footerShow="false"
        v-slot="footer"
        @close="dialogViewFieldFormVisible = false"
        @closed="dialogViewFieldFormVisible = false"
    >
      <ByTable
          :tableData="filedData"
          :columnArr="modelColumnArr"
      ></ByTable>
      <div slot="footer" style="width:100%;">
        <el-button type="primary" size="mini" @click="dialogViewFieldFormVisible = false" style="margin-left: 90%">确 认</el-button>
      </div>

    </ByModel>

</div>
</template>

<script>
import * as validator from "@/utils/validator";
import ByTable from "@/components/global/ByTable";
import {columnArr,pagination,columnArr1,modelColumnArr} from "@/bizpot/G/interfaceService/mock";

export default {
    name:"interfaceService",
  components: {ByTable},
  //写定义的变量数据方法等
    data() {
        return {
            rule: validator.default,
            tableData: [],
            interfaceUseData: [],
            dataUseData: [],
            filedData: [],
            dialogViewFieldFormVisible: false,
            interface_name: "",
            sysreg_name: "",
            tokenData: {
                interface_use_id: 0,
                interface_name: '获取token值接口',
                start_use_date: '-',
                use_valid_date: '-',
                url: 'getToken'
            },
            interfaceInline: {},
            dataInLine: {},
            viewTitle: "表列名信息",
            columnArr,
            columnArr1,
            modelColumnArr,
            pagination: {
              total: 0,
              pageNum: 1,
              pageSize: 10,
              pageSizes: [10, 20, 50, 100],
            },
            pagination1: {
              total: 0,
              pageNum: 1,
              pageSize: 10,
              pageSizes: [10, 20, 50, 100],
            },
        }
    },
    mounted() {
        this.searchDataTableInfo();
        this.searchInterfaceInfo()
    },
    methods: {
      // interfaceTest(){
      //   this.$router.push({
      //     path:'/interfaceTest'
      //   })
      // },
        // 查询数据使用信息
        searchDataTableInfo(val) {
          this.$executeRequest.execGetByModuleUrl('/interfaceService/serviceuser/searchDataTableInfo',{"sysreg_name": val})
              .then(res =>{
                this.dataUseData = res.data;
                this.pagination1.total = res.data.length;
              })
        },
        // 查询接口使用信息
        searchInterfaceInfo(val) {
          this.$executeRequest.execGetByModuleUrl('/interfaceService/serviceuser/searchInterfaceInfo',{"interface_name": val})
              .then(res =>{
                //this.interfaceUseData = res.data;
                const list = res.data;
                list.map((item) => {
                  item.start_use_date_txt = this.dateFormat1(item.start_use_date);
                  item.use_valid_date_txt = this.dateFormat1(item.use_valid_date);
                })
                this.interfaceUseData = list;
                // 添加到第一行
                this.interfaceUseData.unshift(this.tokenData);
                this.pagination.total = this.interfaceUseData.length;
              })
        },
        // 根据表使用ID查询当前用户对应的列信息
        searchColumnInfoById(row) {
            this.dialogViewFieldFormVisible = true;
          this.$executeRequest.execGetByModuleUrl('/interfaceService/serviceuser/searchColumnInfoById',{"use_id": row.use_id})
              .then(res =>{
                this.filedData = res.data;
              })
        },
        // 改变tabs框
        handleClick(tab) {
          // this.currPage = 1;
          if (tab.paneName === "0") {
            this.searchInterfaceInfo();
          } else {
            this.dataTableStatus = true;
            this.searchDataTableInfo();
          }
        },
        //表格操作
        operateItem(type, row) {
          if (type === "view") {
            this.jumpTo(row)
          }
        },
        operateItem1(type, row) {
          if (type === "view") {
            this.searchColumnInfoById(row);
          }
        },
        // 跳转
        jumpTo(row) {
          //当前路由
          const currentRoute = this.$router.currentRoute;
          // 获取 row 中的数据
          const interface_use_id = row.interface_use_id;
          const url = row.url;
          const interface_code = row.interface_code;
          // 构建导航 URL
          const routeName = url;
          const queryParams = {
            interface_use_id,
            url,
            interface_code,
          };
          this.$router.push({ path: currentRoute.name + "/"+ routeName, query: queryParams });

        },
        //接口信息实现分页功能
        handleCurrentChangeList(val) {
            //把val赋给当前页面
            this.pagination.pageNum = val;
        },
        // 改变接口信息每页显示条数
        handleSizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
        },
        //表数据实现分页功能
        handleCurrentChangeList1(val) {
          //把val赋给当前页面
          this.pagination1.pageNum = val;
        },
        // 改变表数据每页显示条数
        handleSizeChange1(pageSize) {
          this.pagination1.pageSize = pageSize;
        },
        beforeViewFieldClose() {
            this.dialogViewFieldFormVisible = false;
        },
        // 表格日期格式化展示
        dateFormat(row, column) {
            const date = row[column.property];
            if (date != null) {
                const year = date.substring(0, 4);
                const month = date.substring(4, 6);
                const day = date.substring(6, 8);
                return year + "-" + month + "-" + day;
            }
        },
        flushCom() {
            this.$router.go(0)
        },
        dateFormat1(date) {
          if (date != null) {
            const year = date.substring(0, 4);
            const month = date.substring(4, 6);
            const day = date.substring(6, 8);
            return year + "-" + month + "-" + day;
          }
        },
    }
}
</script>

<style scoped>
.el-icon-s-operation {
    font-size: 18px;
    color: #2196f3;
}

.el-icon-s-data {
    font-size: 18px;
    color: #2196f3;
}

.search {
    float: right;
}

/* .tableBox {

    th {
        padding: 0 !important;
        height: 47px;
        line-height: 47px;
    }

    td {
        padding: 0 !important;
        height: 47px;
        line-height: 47px;
    }

} */

.locationcenter {
    text-align: center;
    margin-top: 5px;
}
</style>
