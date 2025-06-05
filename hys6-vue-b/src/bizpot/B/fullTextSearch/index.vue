<template>
  <div>
    <el-row>
      <span class="el-icon-search" style="color: #3a8ee6"> 全文检索 </span>
    </el-row>
    <el-row>
      <hr/>
    </el-row>
    <el-row>
      <!-- 搜索条区域-->
      <el-form :inline="true" ref="form" style="text-align: center">
        <el-form-item>
          <el-select v-model="searchType">
            <!--            <el-option label="全文检索" value="fullTextSearch"/>-->
            <el-option label="非结构化文件检索" value="unstructuredFileSearch"/>
            <el-option label="结构化文件检索" value="structuredFileSearch"/>
            <!--            <el-option label="以图搜图" value="searchByMap" />-->
            <!--            <el-option label="文章相似" value="articleSimilarityQuery"/>-->
            <!--            <el-option label="文件名搜索" value="fileNameSearch"/>-->
          </el-select>
        </el-form-item>
        <el-form-item>
          <template
            v-if="searchType === 'fullTextSearch' || searchType === 'unstructuredFileSearch' || searchType === 'structuredFileSearch'">
            <el-row>
              <el-col :span="16">
                <el-input type="text" placeholder="搜索" @change="fullTextSearchOnChange()" v-model="queryKeyword"/>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" class="el-icon-search" style="margin-left: 10px" @click="fullTextSearch(searchType)">查询
                </el-button>
              </el-col>
            </el-row>
          </template>
          <template v-if="searchType === 'searchByMap'">
            <el-upload class="upload-demo" ref="uploadByMap" :fileList="fileList" :auto-upload="false" action="">
              <el-button type="info" class="el-icon-plus" slot="trigger">选取文件</el-button>
              <el-button type="success" class="el-icon-upload" style="margin-left: 10px">上传文件</el-button>
              <el-button type="primary" class="el-icon-search" @click="searchByMap()">搜索</el-button>
            </el-upload>
          </template>
          <template v-if="searchType === 'articleSimilarityQuery'">
            <el-upload class="upload-demo" ref="articleSimilarityQuery" :fileList="fileList" :auto-upload="false"
                       action="" :on-change="handleChange">
              <el-button type="info" class="el-icon-plus" slot="trigger">
                选取文件
              </el-button>
              <el-select style="margin-left: 10px" v-model="search_way">
                <el-option label="全文检索" value="1"/>
                <el-option label="逐文档匹配" value="0"/>
              </el-select>
              <el-button style="margin-left: 10px" type="primary" class="el-icon-search" @click="articleSimilarityQuery()">
                检索
              </el-button>
            </el-upload>
          </template>
          <template v-if="searchType === 'fileNameSearch'">
            <el-row>
              <el-col :span="18">
                <el-input type="text" placeholder="文件名" v-model="fileName"/>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" style="margin-left: 10px" class="el-icon-search" @click="fileNameSearch()" size="mini">
                  查询
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-form-item>
      </el-form>
      <!-- </el-col> -->
    </el-row>
    <el-row>
      <!-- 内容展示区域-->
      <el-col :span="16" :offset="2">
        <template v-if="searchType === 'searchByMap'"> searchByMap</template>
        <template>
          <el-row v-if="undefined !== searchInfo.unstructuredhRs && searchInfo.unstructuredhRs.length > 0" class="topTitle">
            <span>非结构化检索结果</span>
          </el-row>
          <!-- 非结构化文件展示 -->
          <el-row v-for="data in searchInfo.unstructuredhRs" :key="data.file_id" style="margin-top: 1%">
            <el-col>
              <!-- 文件头 -->
              <el-row style="margin-top: 1%">
                <template>
                  <h4>
                    <span>文件名: </span>
                    <span v-html="highLight(data.original_name)"></span>
                  </h4>
                  <hr/>
                </template>
              </el-row>
              <!-- 摘要 -->
              <el-row style="margin-top: 1%">
                <p><span v-html="highLight(data.summary_content)"></span></p>
              </el-row>
              <!-- 操作信息 -->
              <el-row style="margin-top: 1%">
                <el-col :span="6">
                  <template>
                    <p class="text_info"><span class="el-icon-date">入库时间: {{ data.collectTime }}</span></p>
                  </template>
                </el-col>
                <el-col :span="14">
                  <template>
                    <a class="text_url" href="javascript:void(0);" @click="downloadFile(data.file_id, data.original_name)">
                      <i class="el-icon-download">
                        {{ data.downloadPath.substr(0, 7) }}...{{ data.original_name }}
                      </i>
                    </a>
                  </template>
                </el-col>
                <!--                <el-col :span="3">-->
                <!--                  <a class="text_analysis" href="javascript:void(0);"-->
                <!--                     @click="analysis(data.file_id,data.original_name)">-->
                <!--                    <i class="el-icon-s-opportunity">文本分析</i>-->
                <!--                  </a>-->
                <!--                </el-col>-->
                <el-col :span="2">
                  <a v-if="data.fav_flag === '' || 'undefined' === typeof data.fav_flag || null === data.fav_flag"
                     class="text_analysis" href="javascript:void(0);" @click="saveFavoriteFile(data.file_id, data.original_name)">
                    <i class="el-icon-star-on">收藏</i>
                  </a>
                  <a v-else class="text_analysis" href="javascript:void(0);" @click="cancelFavoriteFile(data.fav_id, data.original_name)">
                    <i class="el-icon-star-off">取消收藏</i>
                  </a>
                </el-col>
                <el-col :span="2">
                  <a class="text_analysis" href="javascript:void(0)" @click="viewFile(data.file_id, data.file_type)">
                    查看详情
                  </a>
                </el-col>
                <el-col v-if="searchType === 'articleSimilarityQuery'" :span="4">
                  <template>
                    <p class="text_info"><span class="el-icon-date">相似度: {{ data.rate }}</span></p>
                  </template>
                </el-col>
              </el-row>
              <el-row style="margin-top: 1%">
                <hr style="border: 1px dashed #ddd"/>
              </el-row>
            </el-col>
          </el-row>
          <!-- 结构化文件展示 -->
          <el-row
            v-if="undefined !== searchInfo.structuredRs && searchInfo.structuredRs.length > 0" class="topTitle">
            <span>结构化检索结果</span>
          </el-row>
          <el-row v-for="data in searchInfo.structuredRs" :key="data.file_id" style="margin-top: 1%">
            <!-- 文件头 -->
            <el-row style="margin-top: 1%">
              <h4>
                <el-col :span="8">
                  <p><span>登记表名: </span><span v-html="highLight(data.hyren_name)"></span></p>
                </el-col>
                <el-col :span="8">
                  <p><span>表中文名: </span><span v-html="highLight(data.original_name)"></span></p>
                </el-col>
                <el-col :span="8">
                  <p><span>表英文名: </span><span v-html="highLight(data.table_name)"></span></p>
                </el-col>
              </h4>
            </el-row>
            <hr/>
            <el-row>
              <el-table :data="data.csv" style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-form label-position="left">
                      <template v-for="(v, k) in scope.row">
                        <el-form-item :label="'字段名 : ' + k + ' 字段值 : '" :key="k">
                          <span v-html="highLight(v)"></span>
                        </el-form-item>
                      </template>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="所属id" prop="id">
                  <template slot-scope="scope">
                    <span v-html="highLight(scope.row.id)"></span>
                  </template>
                </el-table-column>
                <el-table-column label="所属表名" prop="table_name">
                  <template slot-scope="scope">
                    <span v-html="highLight(scope.row.table_name)"></span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
          <!-- 分页 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currPage" :page-sizes="[5, 10, 50, 100, 500]" :page-size="pageSize" layout="sizes"
                         style="text-align: center">
          </el-pagination>
        </template>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-row>
          <template>我的收藏</template>
        </el-row>
        <el-row v-for="collectFile in collectFiles" :key="collectFile.file_id">
          <hr/>
          <a class="text_analysis" href="javascript:void(0)" @click="viewFile(collectFile.file_id, collectFile.file_type)">
            {{ collectFile.original_name.substr(0, 30) }}...
          </a>
          <el-button type="text">
            <i class="el-icon-close" @click="cancelFavoriteFile(collectFile.fav_id,collectFile.original_name)"/>
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import * as dataQuery from "../api/dataQuery";
import * as fileOperations from "./mock";
import {execGetByPostModuleUrl} from "@/utils/executeRequest";

export default {
  name: "fullTextSearch",
  data() {
    return {
      //分页参数
      totalSize: 0,
      currPage: 1,
      pageSize: 5,
      //页面参数配置信息
      fileList: [],
      searchType: "unstructuredFileSearch",
      fullTextSearchMethod: "unstructuredFileSearch",
      queryKeyword: "",
      imageAddress: "",
      docAddress: "",
      fileName: "",
      similarityRate: "0",
      search_way: "1",
      containStructuredFile: false,
      summary_content: "", //摘要信息
      collectTime: "", //采集时间
      downloadPath: "", //文件下载路径
      fav_flag: "", //是否收藏标记
      fav_id: "", //收藏id
      file_type: "", //文件类型
      //检索结果信息
      searchInfo: {},
      //收藏文件信息
      collectFiles: [],
    };
  },
  mounted() {
    //初始化当前用户收藏的文件信息
    this.getCollectFiles();
  },
  methods: {
    //全文检索输入框发生变化触发,初始化当前页和页大小参数
    fullTextSearchOnChange() {
      this.currPage = 1;
      this.pageSize = 5;
    },
    //分页大小改变触发
    handleSizeChange(pageSize) {
      this.currPage = 1;
      this.pageSize = pageSize;
      this.checkSearchType();
    },
    //当前页改变触发
    handleCurrentChange(currPage) {
      this.currPage = currPage;
      this.checkSearchType();
    },
    //获取收藏文件列表
    getCollectFiles() {
      this.$executeRequest.execPostByMenuUrl('/getCollectFiles').then((res) => {
        if (res && res.success) {
          this.collectFiles = res.data;
        }
      });
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    //全文搜索按钮
    fullTextSearch(searchType) {
      if (this.queryKeyword === "") {
        this.$Msg.customizTitle("检索信息不能为空！", "warning");
        return;
      }
      let params = {};
      params["queryKeyword"] = this.queryKeyword;
      params["fullTextSearchMethod"] = searchType;
      params["currPage"] = this.currPage;
      params["pageSize"] = this.pageSize;
      this.$executeRequest.execGetByPostModuleUrl('/fullTextSearch/fullTextSearchMethod', params).then((res) => {
        if (res && res.success) {
          this.searchInfo = res.data;
          // if (undefined !== this.searchInfo.unstructuredhRs) {
          //   this.searchInfo.unstructuredhRs = res.data.unstructuredhRs;
          // }
          // if (undefined !== this.searchInfo.structuredRs) {
          //   this.searchInfo.structuredRs = res.data.structuredRs;
          // }
        }
      });
    },
    //以图搜图
    searchByMap() {
      if (this.fileList.length === 0) {
        this.$Msg.customizTitle("上传文件不能为空", "warning");
      } else {
        // 创建form对象
        let param = new FormData();
        param.append("imageAddress", this.fileList[0].raw);
        this.$executeRequest.execGetByPostModuleUrl('/fulltextsearch/searchByMap', param).then((res) => {
          this.searchInfo = res.data;
        });
      }
    },
    //文章相似度检索
    articleSimilarityQuery() {
      if (this.fileList.length === 0) {
        this.$Msg.customizTitle("上传文件不能为空", "warning");
      } else {
        // 创建form对象
        let param = new FormData();
        param.append("docAddress", this.fileList[0].raw);
        param.append("similarityRate", this.similarityRate);
        param.append("searchWay", this.search_way);
        this.$executeRequest.execGetByPostModuleUrl('/fulltextsearch/articleSimilarityQuery', param).then((res) => {
          this.searchInfo = res.data;
        });
      }
    },
    //文件名检索
    fileNameSearch() {
      if (this.fileName === "") {
        this.$Msg.customizTitle("文件名不能为空！", "warning");
        return;
      }
      // 创建form对象
      let params = {};
      params["fileName"] = this.fileName;
      params["currPage"] = this.currPage;
      params["pageSize"] = this.pageSize;
      this.$executeRequest.execGetByPostModuleUrl('/fullTextSearch/fileNameSearch', params).then((res) => {
        if (res && res.success) {
          this.searchInfo = res.data;
        }
      });
    },
    /* 查看文件 */
    viewFile(fileId, fileType) {
      //检查是否有查看文件的权限
      this.$executeRequest.execGetByPostModuleUrl('/dataQuery/checkFileViewPermissions', {
        fileId: fileId,
        fileType: fileType,
      }).then((res) => {
        if (res.data) {
          let routeUrl = this.$router.resolve({
            name: "viewFile",
            query: {
              fileId: fileId,
              fileType: fileType,
            },
          });
          window.open(routeUrl.href, "_blank");
        } else {
          this.$Msg.customizTitle(
            "文件没有查看权限,请先申请并审批成功后再查看!",
            "warning"
          );
        }
      });
    },
    /* 下载文件 */
    downloadFile(file_id, original_name) {
      this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/downloadFile', {
        fileId: file_id,
        fileName: original_name,
      }).then((res) => {
        if ("undefined" === typeof res) {
          this.$Msg.customizTitle(
            "文件没有下载权限,请先申请并审批成功后再下载!",
            "warning"
          );
        } else {
          // 转换数据流为文件
          fileOperations.fileDownload(res.data, original_name);
        }
      });
    },
    //文本高亮函数(Word,pdf)
    highLight(str) {
      //根据检索条件解析的词条进行高亮
      let analysis = this.searchInfo.analysis;
      let new_str = str;
      analysis.forEach((analysi_data) => {
        if (str && str.length > 0) {
          if (!this.containSpecial(analysi_data)) {
            const re = new RegExp(analysi_data, "g");
            new_str = new_str.replace(
              re,
              "<span style='color:red'>" + analysi_data + "</span>"
            );
          }
        }
      });
      let num = 100;
      //如果当前字符串小于num，返回原值
      if (str.length <= num) {
        return new_str;
      }
      if (str.length > num) {
        return new_str.substr(0, num - 1) + "...";
      }
      return new_str;
    },
    //判断是否包含特殊字符
    containSpecial(s) {
      const containSpecial = RegExp(
        /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\,)(\.)(\/)(\<)(\>)(\?)(\)(\')(\")]+/
      );
      return containSpecial.test(s);
    },
    //文本分析
    // analysis(file_id, original_name) {
    //   this.$Msg.customizTitle('试用版本不支持文本分析功能!', 'success')
    // },
    //保存文件收藏
    saveFavoriteFile(file_id, original_name) {
      this.$confirm("确认收藏" + original_name + "文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //保存文件收藏信息
          this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/saveFavoriteFile', {
            fileId: file_id,
          }).then((res) => {
            if (res && res.success) {
              //保存成功后重新获取收藏的文件列表
              this.getCollectFiles();
              //刷新检索页面
              this.refreshTheSearchPage();
            }
          });
        })
        .catch((e) => e);
    },
    //取消文件收藏
    cancelFavoriteFile(fav_id, original_name) {
      console.log(fav_id, "fav_id")
      console.log(original_name, "original_name")
      this.$confirm("取消收藏" + original_name + "文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //取消文件收藏信息
          this.$executeRequest.execGetByPostModuleUrl('/fileM/dataQuery/cancelFavoriteFile', {
            favId: fav_id,
          }).then((res) => {
            if (res && res.success) {
              //取消收藏成功后重新获取收藏的文件列表
              this.getCollectFiles();
              //刷新检索页面
              if (this.queryKeyword !== "") {
                this.refreshTheSearchPage();
              }
            }
          });
        })
        .catch((e) => e);
    },
    //刷新检索页面
    refreshTheSearchPage() {
      this.checkSearchType();
    },
    //校验检索类型
    checkSearchType() {
      switch (this.searchType) {
        case "fullTextSearch":
          this.fullTextSearch();
          break;
        case "searchByMap":
          this.searchByMap();
          break;
        case "articleSimilarityQuery":
          this.articleSimilarityQuery();
          break;
        case "fileNameSearch":
          this.fileNameSearch();
          break;
        default:
          this.$Msg.customizTitle("检索类型不合法!", "warning");
          break;
      }
    },
  },
};
</script>

<style scoped>
.text_info {
  color: #31708f;
}

.text_url {
  color: #3c763d;
  text-decoration: none;
}

.text_analysis {
  color: #31708f;
  text-decoration: none;
}
</style>
