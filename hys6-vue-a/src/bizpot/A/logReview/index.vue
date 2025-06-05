<template>
  <div class="px-20 pb-20">
<!--    <div class="d-flex py-10 justify-content-between" style="margin: 5px 0px">-->
<!--      <ByHeaderSlice title="日志审查"/>-->
<!--    </div>-->
<!--    <ByContainerTitle-->
<!--        title = "日志审查"-->
<!--        :addBtn = false-->
<!--        style="margin: 5px 0px"-->
<!--    />-->
    <ByQuickSearch
        :formItems="modelFormItems"
        :extraButton="[{label:'日志下载'}]"
        showMore
        @search="search"
        @btnClick="downloadSystemLog"
        @reset="reset"
    >
    </ByQuickSearch>
    <ByContainerTitle title="日志审查列表" style="margin: 5px 0px"></ByContainerTitle>
    <ByTable
        :tableData="userTablelist"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItem"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        v-if="userTablelist.length"
    />
    <ByEmpty v-else></ByEmpty>
  </div>
</template>

<script>
import {
  columnArr,
  modelFormItems,
} from "./mock";
import * as message from "@/utils/message";
import ByEmpty from "@/components/global/ByEmpty.vue";
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";

export default {
  name: "",
  components: {ByContainerTitle, ByEmpty},
  data() {
    return {
      modelFormItems,
      userTablelist: [],
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      isSearch: true,
      searchData: {},
    }
  },
  created() {
    this.searchData["currPage"] = this.pagination.pageNum;
    this.searchData["pageSize"] = this.pagination.pageSize;
    this.getSearch()
  },
  mounted() {

  },
  methods: {
    reset() {
      this.getSearch();
    },
    search(data) {
      this.pagination.pageNum = 1;
      data["currPage"] = this.pagination.pageNum;
      data["pageSize"] = this.pagination.pageSize;
      this.searchData = data;
      this.getSearch();
    },
    // 根据用户ID或请求日期分页查询系统日志信息
    getSearch() {
      this.$executeRequest.execGetAllPathByUrl("/logReview/searchSystemLogByIdOrDate", this.searchData)
          .then((res) => {
            // console.log(res)
            if (res && res.success) {
              this.dateTimeFormat(res.data);
              this.userTablelist = res.data;
              if (res.data.length !== 0) {
                this.pagination.total = res.data[0].totalSize;
              } else {
                this.pagination.total = 0;
              }
              this.isSearch = true;
            }
          });
    },
    operateItem() {
    },
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.searchData.pageSize =val;
      this.getSearch();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.searchData.currPage = val;
      this.getSearch();
    },
    // 下载系统日志
    downloadSystemLog() {
      message.confirmMsg("如果未填写过滤用户和请求日期,则下载全部日志信息")
          .then((res) => {
            if (this.pagination.total > 1000000) {
              this.filename = "logReview.csv";
            } else {
              this.filename = "logReview.xlsx";
            }
            this.$executeRequest.execDownloadByUrl(
                "/logReview/downloadSystemLog",
                this.searchData
            )
                .then((res) => {
                  this.$file.fileDownload(res, this.filename);
                });
          })
          .catch(() => {
          });
    },
    // getUserListData() {
    //   this.$executeRequest.execGetByMenuUrl("/searchSystemLogByPage", this.searchData).then((res) => {
    //     // console.log(res)
    //     if (res && res.success) {
    //       this.dateTimeFormat(res.data);
    //       this.userTablelist = res.data;
    //       if (res.data.length !== 0) {
    //         this.pagination.total = res.data[0].totalSize;
    //       } else {
    //         this.pagination.total = 0;
    //       }
    //     }
    //   });
    // },
    // 日期时间格式化
    dateTimeFormat(data) {
      data.forEach((item) => {
        if (item.request_date) {
          item.request_date = this.$dateconversion.dateFormat(
              item.request_date
          );
        }
        if (item.request_time) {
          item.request_time = this.$dateconversion.hourFormat(
              item.request_time
          );
        }
      });
    },
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
</style>
