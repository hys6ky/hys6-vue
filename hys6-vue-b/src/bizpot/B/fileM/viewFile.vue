<template>
  <div>
    <el-row class="topTitle">
      <span>文件查看</span>
      <router-link :to="{name:'dataCollectionO'}">
        <el-button type="primary" size="small" class="goIndex">
          <i class="fa fa-home fa-lg"/>返回首页
        </el-button>
      </router-link>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-row>
          <el-col :span="5" :offset="1"
          >数据入库日期：{{ viewData.storage_date }}
          </el-col
          >
          <el-col :span="5" :offset="1"
          >数据入库时间：{{ viewData.storage_time }}
          </el-col
          >
          <el-col :span="5" :offset="1"
          >最后修改日期：{{ viewData.original_update_date }}
          </el-col
          >
          <el-col :span="5" :offset="1"
          >最后修改时间：{{ viewData.original_update_time }}
          </el-col
          >
        </el-row>
        <el-row style="margin-top: 1%">
          <el-col :span="23" :offset="1">
            <blockquote>
              <img id="showImg" v-if="isImg" :src="url" width="100%"/>
              <span v-else v-html="viewData.file_content"></span>
            </blockquote>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "viewFile",
  data() {
    return {
      viewData: {},
      isImg: false,
      url: "",
    };
  },
  created() {
  },
  computed: {},
  mounted() {
    //获取显示数据
    this.getViewFile();
  },
  methods: {
    /* 初始化显示数据 */
    getViewFile() {
      let fileId = this.$route.query.fileId;
      let fileType = this.$route.query.fileType;
      this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/viewFile', {
        fileId: fileId,
        fileType: fileType,
      }).then((res) => {
        if (res && res.success) {
          this.viewData = res.data;
          this.isImg = false;
          if ("1002" == fileType) {
            this.isImg = true;
            this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/viewImage', {
              fileId: fileId,
            }).then((res) => {
              if (res && res.success) {
                //这里也是关键,调用window的这个方法URL方法
                const blob = new Blob([res.data], {
                  type: "image/jpeg",
                });
                const src = window.URL.createObjectURL(blob);
                this.url = src;
              }
            });
          }
        }
      });
    },
  },
};
</script>
