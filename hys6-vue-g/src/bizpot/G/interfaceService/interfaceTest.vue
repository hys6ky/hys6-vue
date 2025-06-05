<template>
  <div class="interfaceTest px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
    <by-container-title title="接口测试"  class="my-10"></by-container-title>

<!--    <by-quick-search :formItems="formItems" :showMore="true">-->
<!--      <el-button type="primary" size="mini" @click="getToken">获取token</el-button>-->
<!--    </by-quick-search>-->
    <el-row :gutter='40'>
      <el-col :span='12'>
        <by-model-form
            :formData="tokenForm"
            :formItems="tokenItems"
            :formConfig="tokenItemsConfig"
            ref="tokenForm"
        />
      </el-col>
      <el-col :span="12">
        <el-button type="primary" size="mini" @click="getToken">获取token</el-button>
      </el-col>
    </el-row>

    <el-row :gutter='40' class="mb-20">
      <el-col :span='12'>
        <by-model-form
            :formData="testForm"
            :formItems="dataItems"
            :formConfig="dataItemsConfig"
            ref="userForm"
        />
        <div style="width: 100%" class="d-flex justify-content-center">
          <el-button type="primary" size="mini" @click="getInterfaceData" style="">提交</el-button>
        </div>

      </el-col>
      <el-col :span="12">
        <by-header-slice title="接口响应数据："/>
<!--        <span class="fontStyle">接口响应数据：</span>-->
        <div style="margin: 20px 0"></div>
        <el-input type="textarea" :rows="66" v-model="interfaceData" />
      </el-col>
    </el-row>

<!--    <el-divider />-->


<!--    <el-form :inline="true" :model="tokenForm" class="demo-form-inline">-->
<!--      <el-form-item label="用户名">-->
<!--        <el-input-->
<!--          v-model="tokenForm.user_id"-->
<!--          clearable-->
<!--          placeholder="请输入用户名"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="密码" style="margin-left: 66px">-->
<!--        <el-input-->
<!--          v-model="tokenForm.user_password"-->
<!--          clearable-->
<!--          placeholder="请输入密码"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button-->
<!--          type="success"-->
<!--          size="mini"-->
<!--          style="margin-left: 50px"-->
<!--          @click="getToken"-->
<!--        >-->
<!--          获取token-->
<!--        </el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <el-row :gutter="50">-->
<!--      <el-col :span="9">-->
<!--        <el-form-->
<!--          :label-position="labelPosition"-->
<!--          label-width="100px"-->
<!--          :model="testForm"-->
<!--        >-->
<!--          <el-form-item label="token">-->
<!--            <el-input-->
<!--              v-model="testForm.token"-->
<!--              clearable-->
<!--              placeholder="请输入token"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="url">-->
<!--            <el-input-->
<!--              v-model="testForm.url"-->
<!--              clearable-->
<!--              placeholder="请输入请求路径"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="tableName">-->
<!--            <el-input-->
<!--              v-model="testForm.tableName"-->
<!--              clearable-->
<!--              placeholder="请输入系统登记表名称"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="dataType">-->
<!--            <el-input-->
<!--              v-model="testForm.dataType"-->
<!--              clearable-->
<!--              placeholder="请输入输出数据类型"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="outType">-->
<!--            <el-input-->
<!--              v-model="testForm.outType"-->
<!--              clearable-->
<!--              placeholder="请输入输出数据形式"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="num">-->
<!--            <el-input-->
<!--              v-model="testForm.num"-->
<!--              clearable-->
<!--              placeholder="请输入显示条数"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="selectColumn">-->
<!--            <el-input-->
<!--              v-model="testForm.selectColumn"-->
<!--              clearable-->
<!--              placeholder="请输入需要查询的列名"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="whereColumn">-->
<!--            <el-input-->
<!--              v-model="testForm.whereColumn"-->
<!--              clearable-->
<!--              placeholder="请输入查询条件"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="ds_name">-->
<!--            <el-input-->
<!--              v-model="testForm.ds_name"-->
<!--              clearable-->
<!--              placeholder="请输入数据源名称"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="agent_name">-->
<!--            <el-input-->
<!--              v-model="testForm.agent_name"-->
<!--              clearable-->
<!--              placeholder="请输入agent采集名称"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="fcs_name">-->
<!--            <el-input-->
<!--              v-model="testForm.fcs_name"-->
<!--              clearable-->
<!--              placeholder="请输入任务采集名称"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="filename">-->
<!--            <el-input-->
<!--              v-model="testForm.filename"-->
<!--              clearable-->
<!--              placeholder="请输入查询文件名"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="filesize">-->
<!--            <el-input-->
<!--              v-model="testForm.filesize"-->
<!--              clearable-->
<!--              placeholder="请输入文件大小"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="filesuffix">-->
<!--            <el-input-->
<!--              v-model="testForm.filesuffix"-->
<!--              clearable-->
<!--              placeholder="请输入文件后缀名"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="filemd5">-->
<!--            <el-input-->
<!--              v-model="testForm.filemd5"-->
<!--              clearable-->
<!--              placeholder="请输入文件md5值"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="filepath">-->
<!--            <el-input-->
<!--              v-model="testForm.filepath"-->
<!--              clearable-->
<!--              placeholder="请输入文件路径"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="storagedate">-->
<!--            <el-input-->
<!--              v-model="testForm.storagedate"-->
<!--              clearable-->
<!--              placeholder="请输入文件入库日期"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="sql">-->
<!--            <el-input-->
<!--              v-model="testForm.sql"-->
<!--              clearable-->
<!--              placeholder="请输入要执行的sql语句"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="query">-->
<!--            <el-input-->
<!--              v-model="testForm.query"-->
<!--              clearable-->
<!--              placeholder="请输入检索信息"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="dep_id">-->
<!--            <el-input-->
<!--              v-model="testForm.dep_id"-->
<!--              clearable-->
<!--              placeholder="请输入部门ID"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="fcs_id">-->
<!--            <el-input-->
<!--              v-model="testForm.fcs_id"-->
<!--              clearable-->
<!--              placeholder="请输入任务ID"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="asynType">-->
<!--            <el-input-->
<!--              v-model="testForm.asynType"-->
<!--              clearable-->
<!--              placeholder="请输入是否异步"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="directory">-->
<!--            <el-input-->
<!--              v-model="testForm.directory"-->
<!--              clearable-->
<!--              placeholder="请输入文件目录"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="uuid">-->
<!--            <el-input-->
<!--              v-model="testForm.uuid"-->
<!--              clearable-->
<!--              placeholder="请输入uuid"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="success" size="mini" @click="getInterfaceData"-->
<!--              >提交</el-button-->
<!--            >-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-col>-->
<!--      <el-col :span="15">-->
<!--        <span class="fontStyle">接口响应数据：</span>-->
<!--        <div style="margin: 20px 0"></div>-->
<!--        <el-input type="textarea" :rows="66" v-model="interfaceData" />-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import ByQuickSearch from "@/components/global/ByQuickSearch";
import {tokenItems, dataItems,dataItemsConfig,tokenItemsConfig} from "@/bizpot/G/interfaceService/interfaceTestMock";
import ByModelForm from "@/components/global/ByModelForm";
import ByHeaderSlice from "@/components/global/ByHeaderSlice";
export default {
  name: "interfaceTest",
  components: {ByHeaderSlice, ByModelForm, ByQuickSearch},
  data() {
    return {
      labelPosition: "right",
      tokenForm: {
        user_id: "",
        user_password: ""
      },
      testForm: {
        token: "",
        num: null,
      },
      interfaceData: "",
      tokenItems,
      dataItems,
      dataItemsConfig,
      tokenItemsConfig
    };
  },
  methods: {
    // 获取token值
    getToken() {
      let params = {};
      params["user_id"] = this.tokenForm.user_id;
      params["user_password"] = this.tokenForm.user_password;
      this.$executeRequest
        .execGetByModuleUrl("/interfaceService/serviceuser/impl/getToken", params)
        .then((res) => {
          this.testForm.token = res.data.token;
          this.interfaceData = this.getFormatData(JSON.stringify(res.data));
          // this.$message.success(this.getFormatData(JSON.stringify(res.data)))
        });
    },
    // 获取接口响应信息
    getInterfaceData() {
      if (this.testForm.user_id === "" || this.testForm.user_id === undefined) {
        this.testForm.user_id = null;
      }
      if (this.testForm.url === undefined) {
        this.interfaceData = this.getFormatData(
          JSON.stringify(
            "{" +
              '                        "message": {' +
              '                            "url未填或填写错误请检查"' +
              "                        }," +
              '                        "status": "NORMAL"' +
              "                    }"
          )
        );
      } else {
        if (this.testForm.url == "uuidDownload") {
          this.$executeRequest
            .execDownloadByUrl(
              "/G/interfaceService/serviceuser/impl/" + this.testForm.url,
              this.testForm
            )
            .then((res) => {
              let er = res.ers["content-disposition"];
              this.filename = this.$Base64.decode(
                er.substring(er.indexOf("filename=") + 9)
              );
              const blob = new Blob([res.data], {
                type: "application/msword",
              });
              if (window.navigator.msSaveOrOpenBlob) {
                // 兼容IE10
                navigator.msSaveBlob(blob, this.filename);
              } else {
                //  chrome/firefox
                let aTag = document.createElement("a");
                // document.body.appendChild(aTag);
                // aTag.download = "SystemOperation";
                aTag.download = this.filename;
                aTag.href = URL.createObjectURL(blob);
                if (aTag.all) {
                  aTag.click();
                } else {
                  //  兼容firefox
                  var evt = document.createEvent("MouseEvents");
                  evt.initEvent("click", true, true);
                  aTag.dispatchEvent(evt);
                }
                URL.revokeObjectURL(aTag.href);
              }
            });
          // interfaceFunctionAll.uuidDownload(this.testForm).then(res => {
          //     let er = res.ers['content-disposition'];
          //     this.filename = this.$Base64.decode(er.substring(er.indexOf("filename=") + 9));
          //     const blob = new Blob([res.data], {
          //         type: "application/msword"
          //     });
          //     if (window.navigator.msSaveOrOpenBlob) {
          //         // 兼容IE10
          //         navigator.msSaveBlob(blob, this.filename);
          //     } else {
          //         //  chrome/firefox
          //         let aTag = document.createElement("a");
          //         // document.body.appendChild(aTag);
          //         // aTag.download = "SystemOperation";
          //         aTag.download = this.filename;
          //         aTag.href = URL.createObjectURL(blob);
          //         if (aTag.all) {
          //             aTag.click();
          //         } else {
          //             //  兼容firefox
          //             var evt = document.createEvent("MouseEvents");
          //             evt.initEvent("click", true, true);
          //             aTag.dispatchEvent(evt);
          //         }
          //         URL.revokeObjectURL(aTag.href);
          //     }
          // })
        } else {
          this.$executeRequest
            .execGetByPostModuleUrl("/interfaceService/serviceuser/impl/" + this.testForm.url, this.testForm)
            .then((res) => {
              if (
                this.testForm.dataType == "csv" &&
                this.testForm.outType == "stream"
              ) {
                this.interfaceData = res.data.replace(/\r\n/g, "");
                this.interfaceData = res.data.replace(/\n/g, "");
              } else {
                this.interfaceData = this.getFormatData(
                  JSON.stringify(res.data)
                );
              }
            });
          // interfaceFunctionAll.getInterfaceData(this.testForm).then(res => {
          //     if (this.testForm.dataType == 'csv' && this.testForm.outType == 'stream') {
          //         this.interfaceData = res.data.replace(/\r\n/g, "");
          //         this.interfaceData = res.data.replace(/\n/g, "");
          //     } else {
          //         this.interfaceData = this.getFormatData(JSON.stringify(res.data));
          //     }
          //
          // })
        }
      }
    },
    formatJson(json) {
      let i = 0,
        il = 0,
        tab = "    ",
        newJson = "",
        indentLevel = 0,
        inString = false,
        currentChar = null;
      for (i = 0, il = json.length; i < il; i += 1) {
        currentChar = json.charAt(i);
        switch (currentChar) {
          case "{":
          case "[":
            if (!inString) {
              newJson += currentChar + "\n" + this.repeat(tab, indentLevel + 1);
              indentLevel += 1;
            } else {
              newJson += currentChar;
            }
            break;
          case "}":
          case "]":
            if (!inString) {
              indentLevel -= 1;
              newJson += "\n" + this.repeat(tab, indentLevel) + currentChar;
            } else {
              newJson += currentChar;
            }
            break;
          case ",":
            if (!inString) {
              newJson += ",\n" + this.repeat(tab, indentLevel);
            } else {
              newJson += currentChar;
            }
            break;
          case ":":
            if (!inString) {
              newJson += ": ";
            } else {
              newJson += currentChar;
            }
            break;
          case " ":
          case "\n":
          case "\t":
            if (inString) {
              newJson += currentChar;
            }
            break;
          case '"':
            if (i > 0 && json.charAt(i - 1) !== "\\") {
              inString = !inString;
            }
            newJson += currentChar;
            break;
          default:
            newJson += currentChar;
            break;
        }
      }
      return newJson;
    },
    getFormatData(json) {
      json = json + "";
      if (json.indexOf("{") === -1 && json.indexOf("[") === -1) {
        return json;
      } else {
        return this.formatJson(json);
      }
    },
    repeat(s, count) {
      return new Array(count + 1).join(s);
    },
  },
};
</script>

<style scoped>
.borderStyle {
  width: 100%;
  border: #e6e6e6 solid 1px;
}

.demo-form-inline {
  margin-left: 45px;
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
