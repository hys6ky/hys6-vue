<template>
  <div>
    <el-row>
      <template v-for="item in ApplyType">
        <template v-if="apply_type === item.code">
          <span class="el-icon-s-management" :key="item.code"
                style="color: #3a8ee6; margin-left: 10px">我的{{ item.value }}列表</span>
        </template>
      </template>
      <router-link :to="{name: 'fileM'}">
        <el-button type="primary" size="small" style="float: right; margin-right: 10px">返回</el-button>
      </router-link>
    </el-row>
    <el-row>
      <hr/>
    </el-row>
    <el-row>
      <el-table :data="apply_rs.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
        <el-table-column type="index" prop="date" label="序号" align="center" width="70px">
          <template slot-scope="scope">
            <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="original_name" label="文件名" width="260px" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p>{{ scope.row.title }}</p>
              <div slot="reference">{{ scope.row.original_name }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="file_size" label="文件大小" align="center"/>
        <el-table-column prop="file_suffix" label="文件后缀名" align="center"/>
        <el-table-column label="文件类型" align="center">
          <template slot-scope="scope">
            <template v-for="item in FileType">
              <template v-if="scope.row.file_type === item.code">{{ item.value }}
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="申请下载时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.apply_date }}{{ scope.row.apply_time }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button round type="warning" size="mini" @click="cancelApply(scope.row.da_id, apply_type)">
              取消申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="apply_rs.length"/>
    </el-row>
  </div>
</template>

<script>


import {execGetByPostModuleUrl} from "@/utils/executeRequest";

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      totalSize: 0,
      apply_rs: [],
      apply_type: 2,
      category: "",
      FileType: [],
      ApplyType: [],
    };
  },
  created() {
    /* 获取代码项配置 */
    this.$executeRequest.execGetByUrl('/Base/code/getCategoryItems',{category: "FileType"}).then((res) => {
      if (res && res.success) {
        this.FileType = res.data;
      } else {
        this.$Msg.customizTitle(res.message, "error");
      }
    });
    this.$executeRequest.execGetByUrl('/Base/code/getCategoryItems',{category: "ApplyType"}).then((res) => {
      if (res && res.success) {
        this.ApplyType = res.data;
      } else {
        this.$Msg.customizTitle(res.message, "error");
      }
    });
  },
  mounted() {
    /* 如果路由中查询类型为空,则默认显示下载请求信息 */
    if (this.$route.params.apply_type === undefined) {
      this.$route.params.apply_type = "2";
    }
    /* 初始化显示数据 */
    this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/getApplyData',{
      apply_type: this.$route.params.apply_type,
    }).then((res) => {
      if (res.success) {
        this.apply_rs = res.data.apply_rs;
        this.apply_type = res.data.apply_type;
      } else this.$Msg.customizTitle(res.message, "error");
    });
  },
  methods: {
    /* 设置每页显示条数 */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    /* 查询页面 */
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    cancelApply(da_id, apply_type) {
      this.$confirm("确认取消申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/cancelApply',{da_id: da_id}).then((res) => {
          if (res && res.success) {
            this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/getApplyData',{apply_type: apply_type}).then((res) => {
              if (res && res.success) {
                this.apply_rs = res.data.apply_rs;
              } else this.$Msg.customizTitle(res.message, "error");
            });
          } else this.$Msg.customizTitle(res.message, "error");
        });
      });
    },
  },
};
</script>

<style>
/* 分页组件居中 */
.el-pagination {
  text-align: center;
}
</style>
