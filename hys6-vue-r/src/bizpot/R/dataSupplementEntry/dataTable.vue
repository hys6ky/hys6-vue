<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <el-row>
        <i class="el-icon-document"><span>项目列表</span></i>
        <el-button type="primary" size="mini" style="float: right"
                   @click="goBack">
            返回上一级
        </el-button>
        <el-divider/>
        <el-col span="24">
          <el-row>
            <el-col v-if="record === true" span="4">
              <el-button size="mini" type="primary" @click="checkAll(true)">选中所有字段</el-button>
              <el-button size="mini" type="primary" @click="checkAll(false)">取消所有字段</el-button>
              <!--<el-checkbox id="record"
                           @change="checkAll($event)" label="选中所有字段补录">
              </el-checkbox>-->
            </el-col>
            <el-col span="20" style="text-align: right;padding-bottom: 20px" v-if="this.operation === true">

              <el-button size="mini" type="primary" style="float: left" @click="addTableDataRow"
              >添加一行
              </el-button>
              <el-button size="mini" type="primary" style="float: left" @click="delTableDataRow"
              >删除选中行
              </el-button>
              <el-button v-if="exportt === false && update === false" style="float: left"
                         @click="add"
                         size="mini" type="primary"> 添加一列
              </el-button>
              <el-button v-if=" record !== false && update !==true " style="float: left"
                         @click="del"
                         size="mini" type="primary"> 删除一列
              </el-button>
              <div v-if="record === true || update === true"
                   style=" padding-bottom: 10px;text-align: left;display:inline-block;margin-right: 10px">
                <el-upload style="height: 50px"
                           class="upload-demo"
                           :action="this.uploadExcel"
                           :on-success="uploadSuccess"
                           :on-preview="handlePreview"
                           accept="xls/xlsx"
                           :before-upload="onBeforeUpload"
                           multiple
                           :limit="1"
                           :on-exceed="handleExceed">
                  <el-button size="mini" type="primary">批量导入
                  </el-button>
                  <!--                    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过1M</div>-->
                </el-upload>
              </div>
              <el-button size="mini" type="primary" @click="recordExportExcel">导出
              </el-button>
              <el-button size="mini" type="primary" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col>
            <div v-if="columnAdd === true" style="text-align: left;">
                <el-input style="width: 200px;" id="columnValue" v-model="columnValue"></el-input>
                <el-button @click="addTableDataLine">确定</el-button>
            </div>
            <div v-if="columnDel === true">
                <el-select v-model="delColumnData" placeholder="请选择需要删除的列">
                    <el-option
                            v-for="(item,index) in columnData"
                            :label="item.name"
                            :value="item.name"
                            :key="index">
                    </el-option>
                </el-select>
                <el-button @click="delTableDataLine">确定</el-button>
            </div>
        </el-col>
        <el-col>
            <el-table ref="mainTable" :data="tableData" @selection-change="doSelectChange"
                      @row-click="doRowClick"
                      row-key="id" border fit>
                <el-table-column type="selection" width="80px" :indeterminate="true" fixed="left"
                                 v-if="record === true || delFlag=== true">
                </el-table-column>
                <!--<el-table-column type="index" width="80px" :indeterminate="true" fixed="left"></el-table-column>-->
                <el-table-column v-for="(item,index) in columnData" :prop="columnData[index].name"
                                 :label="columnData[index].name" :key="index"
                                 width="200px">
                    <template v-slot:header="scope" v-if="record === true">
                        <div><span style="text-align: center;">
                            {{columnData[index].name}}
                            </span>
                            <br>
                            <el-checkbox id="record" v-if="record === true" v-model="columnData[index].recordIsCheck"
                                         @change="change($event, scope, 'dept')"
                                          label="是否补录">
                            </el-checkbox>
                            <br>
                            <el-checkbox id="key" v-if="record === true" v-model="columnData[index].keyIsCheck"
                                         @change="changeKey($event, scope, 'dept')"
                                          label="是否为主键">
                            </el-checkbox>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="scope.row[scope.column.property]" placement="top"
                                    v-if="scope.row[scope.column.property] !== '' && scope.row[scope.column.property] !== undefined">
                            <input class="el-input__inner"
                                   v-model.lazy="scope.row[scope.column.property]"
                                   autocomplete="off">
                        </el-tooltip>
                        <input class="el-input__inner" v-model.lazy="scope.row[scope.column.property]"
                               v-else autocomplete="off">
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
import {exportCursor, recordExportExcel} from "@/utils/executeRequest";

    export default {
        name: "dataTable",
        watch: {
            '$route'() {
                // 若路由产生变换（退出或提交成功切换回上一页时），将页面数据重置为初始值
                Object.assign(this.$data, this.$options.data())
                // 此处别忘了加上created里需要执行的请求，因为在keep-alive的单页面中切换路由不会执行created钩子
            }
        },
        created() {
            this.selectData.submit_state = this.$route.query.submit_state; //此为跳转字段，为返回键服务
            this.record = this.$route.query.record;
            this.id = this.$route.query.id;
            this.update = this.$route.query.update;
            var dfPid = this.$route.query.dfPid; //当点击数据未补录过的信息跳转时，此时都为项目id
            this.allflag = this.$route.query.allflag;
            console.log(this.allflag);
            this.operation = this.$route.query.operation;
            this.targetTableId = this.$route.query.targetTableId;  //通过table_name改为table_Id确定目标表
            this.selectData.tableName = this.$route.query.tableName; //当点击数据未补录过的信息跳转时，此为对应表名称
            this.selectData.dfPid = dfPid;
            this.uploadExcel = "/R/dfTableApply/importExcel";
            console.log(this.uploadExcel);
            this.tableData = Array.from(Array(5), () => new Array(5).fill(""));
            //通过id加载临时表数据
            // 需增加此代码，才能正确下一步
            if (typeof this.record === 'string') this.record = Boolean(this.record);
            if (typeof this.update === 'string') this.update = Boolean(this.update);
            if (typeof this.allflag === 'string') this.allflag = Boolean(this.allflag);
            if (typeof this.operation === 'string') this.operation = Boolean(this.operation);
            if (this.record === true) {
                //数据补录进来
                this.findList();
                //this.tableData = [];
            } else {
                this.findCursorList();
            }
        },
        data() {
            return {
                exportt: false,
                delFlag: false,
                delColumnData: "",
                targetTableId: "",
                columnValue: "",
                record: false,
                columnAdd: false,
                columnDel: false,
                columnData: [
                    /* {
                         recordIsCheck: true,
                         keyIsCheck: true,
                         name: "job_type",
                     }*/
                ],
                update: false,
                id: "", //这里的id一直保持为项目id
                total: 10,
                allflag: false,
                operation: false,
                fileList: [],
                selectData: {
                    currPage: 1,
                    pageSize: 5,
                },
                upload: false,
                uploadExcel: "",
                tableData: "",
                sendData: [],
                selectedIds: [],
                resultData: [],
                checkBoxData: {
                    keyData: [],
                    sendColumnData: [],
                },
                keyData: [],
                sendColumnData: [],
            }
        },
        methods: {
            checkAll($event, scope) {
                console.log($event)
                //console.log(JSON.stringify(this.columnData))
                this.sendColumnData = [];
                if ($event) {
                    for (let i = 0; i < this.columnData.length; i++) {
                        //console.log("nnnnn")
                        this.columnData[i].recordIsCheck = true;
                        this.sendColumnData.push(this.columnData[i].name);
                    }
                } else {
                    for (let i = 0; i < this.columnData.length; i++) {
                        //console.log("nnnnn")
                        this.columnData[i].recordIsCheck = false;
                        this.sendColumnData = [];
                    }
                }
                this.columnData = [...this.columnData];
                console.log(JSON.stringify(this.sendColumnData))
            },
            delTableDataRow() {
                this.delFlag = true;
                const rowData = this.sendData;
                //const key = this.keyData[0];
                //console.log(key);
                //console.log(JSON.stringify(rowData));
                //console.log(rowData[0][key]);
                for (let i = 0; i < rowData.length; i++) {
                    console.log("1111111111111111111111"+this.tableData);
                    this.tableData = this.tableData.filter(item => item["index"] !== rowData[i]["index"]);
                }
                //console.log("table " +JSON.stringify(this.tableData))
            },
            change($event, scope) {
                console.log($event);
                if ($event) {
                    for (let i = 0; i < this.columnData.length; i++) {
                        if (this.columnData[i].name === scope.column.label) {
                            this.columnData[i].recordIsCheck = true;
                        }
                    }
                    this.sendColumnData.push(scope.column.label);
                } else {
                    for (let i = 0; i < this.columnData.length; i++) {
                        if (this.columnData[i].name === scope.column.label) {
                            this.columnData[i].recordIsCheck = false;
                        }
                    }
                    this.sendColumnData = this.sendColumnData.filter(item => item !== scope.column.label);
                }
                this.columnData = [...this.columnData];
                this.sendColumnData = [...this.sendColumnData];
                console.log(this.sendColumnData);
            },
            changeKey($event, scope) {
                console.log($event);
                if ($event) {
                    this.keyData.push(scope.column.label);
                    for (let i = 0; i < this.columnData.length; i++) {
                        if (this.columnData[i].name === scope.column.label) {
                            this.columnData[i].recordIsCheck = true;
                        }
                    }
                    this.sendColumnData.push(scope.column.label);
                } else {
                    this.keyData = this.keyData.filter(item => item !== scope.column.label);
                    for (let i = 0; i < this.columnData.length; i++) {
                        if (this.columnData[i].name === scope.column.label) {
                            this.columnData[i].recordIsCheck = false;
                        }
                    }
                    this.sendColumnData = this.sendColumnData.filter(item => item !== scope.column.label);
                }
                this.columnData = [...this.columnData];
                console.log(JSON.stringify("key    " + this.keyData));
                console.log(JSON.stringify("column    " + this.sendColumnData))
                /* if ($event) {
                     this.sendColumnData.push(scope.column.label);
                 }
                 /!*if (!$event) {
                     this.sendColumnData = this.sendColumnData.filter(item => item !== scope.column.label);
                 }*!/
                 console.log(this.sendColumnData);*/
            },
            doSelectChange(row) {
                this.sendData = row;
                //console.log(JSON.stringify(this.sendData));
            },
            doRowClick(table) {
                //console.log(JSON.stringify(table))
            },
            add() {
                this.columnAdd = true;
            },
            del() {
                this.columnDel = true;
            },
            delTableDataLine() {
                //arr = arr.filter(item => item !== element)
                //删除列元素
                this.columnData = this.columnData.filter(item => item.name !== this.delColumnData)
                //删除对象属性
                this.tableData.forEach(item => {
                    if (item[this.delColumnData] !== null) {
                        // console.log("aaa")
                        delete item[this.delColumnData];
                    }
                })
                //console.log(JSON.stringify(this.tableData))
            },
            addTableDataLine() {
                this.record = false;
                let j = this.tableData.length;
                const columnValue = this.columnValue;
                if (columnValue === "") {
                    this.$message.error("请输入列名后添加");
                } else if (this.columnData.indexOf(columnValue) !== -1) {
                    this.$message.error("列名重复，请修改");
                } else {
                    console.log(columnValue);
                    if (j === 0) {
                        const params = {};
                        params[columnValue] = '';
                        this.columnData.push(columnValue);
                        this.tableData.push(params);
                    } else {
                        console.log("aaaa")
                        var tableData = this.tableData;
                        tableData = tableData.map((item) => {
                            return {
                                ...item,
                                [columnValue]: "",
                            }
                        });
                        console.log(tableData)
                        this.columnData.push(columnValue);
                        this.tableData = tableData;
                    }
                    console.log(this.tableData);
                }
            },
            addTableDataRow() {
                //let tableLine = [];
                const tableData = this.tableData;
                /*for (let i = 0; i < tableData.length; i++) {
                    tableLine = tableData[i];
                }*/
                const newData = {};
                for (let i = 0; i < this.columnData; i++) {
                    newData[this.columnData[i]] = "";
                }
                tableData.push(newData);
                this.tableData = tableData;
            },
            getTableData() {
                this.resultData = [];
                for (let i = 0; i < this.sendData.length; i++) {
                    const rowData = {};
                    for (let j = 0; j < this.sendColumnData.length; j++) {
                        rowData[this.sendColumnData[j]] = this.sendData[i][this.sendColumnData[j]];
                    }
                    this.resultData.push(rowData);
                }
            },
            save() {
                //将选中的数据进行汇总后进行请求
                this.getTableData();
                //保存请求时根据update状态进行判断
                if (this.update === true) {
                    //进入修改
                  const params = {
                    "data": this.tableData,
                    "applyTabId": this.selectData.dfPid,
                    "dfPid": this.id,
                    "targetTableId": this.targetTableId
                  };
                  this.$executeRequest.execPostByMenuUrl("/dfTableApply/updateCursor",params).then(res => {
                    console.log(res);
                    if (res.success) {
                      this.$message.success("修改成功！");
                    } else {
                      this.$message.error(res.message);
                    }
                  })
                    // record.updateCursor(this.tableData, this.selectData.dfPid, this.targetTableId, this.id).then(res => {
                    //     console.log(res);
                    //     if (res.success) {
                    //         this.$message.success("修改成功！");
                    //     } else {
                    //         this.$message.error(res.message);
                    //     }
                    // })
                } else {
                    //进入新增
                    console.log(this.tableData)
                  const params = {
                    "keyData": this.keyData,  //主键列表
                    "data": this.resultData,  //数据
                    "dfPid": this.selectData.dfPid, //项目id
                    "tableName": this.selectData.tableName, //原始表
                    "tableId": this.targetTableId //原始表id
                  };
                  this.$executeRequest.execPostByMenuUrl("/dfTableApply/createTempTable",params).then(res =>{
                    console.log(res);
                    if (res.code == 999 && res.success) {
                      this.$Msg.customizTitle('保存成功！', 'success')
                    } else {
                      this.$message.error(res.message);
                    }
                  })
                    // record.createTable(this.keyData, this.resultData, this.selectData.dfPid, this.selectData.tableName, this.targetTableId).then(res => {
                    //     console.log(res);
                    //     if (res.code == 999 && res.success) {
                    //         this.$Msg.customizTitle('保存成功！', 'success')
                    //     } else {
                    //         this.$message.error(res.message);
                    //     }
                    // })
                }
            },
            goBack() {
                this.$router.push({
                  name : "insertSheet",
                  query: {
                    "dfPid": this.id,
                    "submit_state": this.selectData.submit_state,
                    "tableId": this.targetTableId,
                  }
                })
            },
            //删除选中的数据
            delTableData() {
                /*this.$confirm("确定删除吗?")
                    .then(async () => {
                        await this.tableData.remove(this.selectedIds);
                        this.$message.success("删除成功");
                        //this.getUsers();
                    })
                    .catch(() => {
                        this.$message.info("取消删除");
                    });*/
                var con = this.$refs.multipleTable.selection;
                console.log(con);
            },
            handleSizeChange(val) {
                this.selectData.pageSize = val;
                this.selectData.currPage = 1;
                this.findList();
            }
            ,
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.selectData.currPage = val;
                this.findList();
            },
            //查2000条数据
            findList() {
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findList/"+this.targetTableId,this.selectData).then(res =>{
                  if (res.success) {
                    this.tableData = res.data.data;
                    //自定义下标进行删除标记
                    for (let i = 0; i < this.tableData.length; i++) {
                      this.tableData[i]["index"] = i;
                    }
                    const columns = Object.keys(res.data.data[0]);
                    const column = columns.filter(item => item !== "index");
                    this.keyData = res.data.keyData;
                    //const column = Object.keys(res.data.data[0]);
                    //this.columnData = Object.keys(res.data.data[0]);
                    for (let i = 0; i < column.length; i++) {
                      const params = {};
                      params["name"] = column[i];
                      for (let j = 0; j < this.keyData.length; j++) {
                        if (column[i] === this.keyData[j]) {
                          /* recordIsCheck: true,
                               keyIsCheck: true,*/
                          params["recordIsCheck"] = true;
                          params["keyIsCheck"] = true;
                        } else {
                          params["recordIsCheck"] = false;
                          params["keyIsCheck"] = false;
                        }
                      }
                      this.columnData.push(params);
                    }
                    //将keyData放进columnData中
                    for (let i = 0; i < this.keyData.length; i++) {
                      this.sendColumnData.push(this.keyData[i]);
                    }
                    //将columnData重新构造
                    this.total = res.data.count;
                  } else {
                    this.$message.error(res.message);
                  }
                  console.log(this.keyData)
                  console.log(JSON.stringify(this.sendColumnData))
                })
                // record.findList(this.selectData, this.targetTableId).then(res => {
                //     if (res.success) {
                //         this.tableData = res.data.data;
                //         //自定义下标进行删除标记
                //         for (let i = 0; i < this.tableData.length; i++) {
                //             this.tableData[i]["index"] = i;
                //         }
                //         const columns = Object.keys(res.data.data[0]);
                //         const column = columns.filter(item => item !== "index");
                //         this.keyData = res.data.keyData;
                //         //const column = Object.keys(res.data.data[0]);
                //         //this.columnData = Object.keys(res.data.data[0]);
                //         for (let i = 0; i < column.length; i++) {
                //             const params = {};
                //             params["name"] = column[i];
                //             for (let j = 0; j < this.keyData.length; j++) {
                //                 if (column[i] === this.keyData[j]) {
                //                     /* recordIsCheck: true,
                //                          keyIsCheck: true,*/
                //                     params["recordIsCheck"] = true;
                //                     params["keyIsCheck"] = true;
                //                 } else {
                //                     params["recordIsCheck"] = false;
                //                     params["keyIsCheck"] = false;
                //                 }
                //             }
                //             this.columnData.push(params);
                //         }
                //         //将keyData放进columnData中
                //         for (let i = 0; i < this.keyData.length; i++) {
                //             this.sendColumnData.push(this.keyData[i]);
                //         }
                //         //将columnData重新构造
                //         this.total = res.data.count;
                //     } else {
                //         this.$message.error(res.message);
                //     }
                //     console.log(this.keyData)
                //     console.log(JSON.stringify(this.sendColumnData))
                // })
            },
            //导出
            recordExportExcel() {
                for (let i = 0; i < this.tableData.length; i++) {
                    delete this.tableData[i].index;
                }
                this.$executeRequest.exportCursor("/dfTableApply/recordExportExcel",this.tableData).then(res =>{
                  console.log(res.data);
                  const link = document.createElement('a'); //创建a标签
                  const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) //设置文件流
                  link.style.display = 'none';
                  // 设置连接
                  link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
                  if (this.selectData.dfPid == null) {
                    link.download = "_RECORD";
                  } else {
                    link.download = this.selectData.dfPid + "_RECORD";
                  }
                  document.body.appendChild(link);
                  // 模拟点击事件
                  link.click()  //设置点击事件
                }).catch(err => {
                  this.$message.error("存储层连接获取失败，导出失败。")
                })
                // record.recordExportExcel(this.tableData, this.selectData.dfPid).then(res => {
                //     console.log(res.data);
                //     const link = document.createElement('a'); //创建a标签
                //     const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) //设置文件流
                //     link.style.display = 'none';
                //     // 设置连接
                //     link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
                //     if (this.selectData.dfPid == null) {
                //         link.download = "_RECORD";
                //     } else {
                //         link.download = this.selectData.dfPid + "_RECORD";
                //     }
                //     document.body.appendChild(link);
                //     // 模拟点击事件
                //     link.click()  //设置点击事件
                // }).catch(err => {
                //     this.$message.error("存储层连接获取失败，导出失败。")
                // })
            },
            findCursorList() {
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findCursorList",this.selectData).then(res =>{
                  if (res.success) {
                    console.log(JSON.stringify(res.data.data));
                    this.tableData = res.data.data;
                    //自定义下标进行删除标记
                    for (let i = 0; i < this.tableData.length; i++) {
                      this.tableData[i]["index"] = i;
                    }
                    const columns = Object.keys(res.data.data[0]);
                    const column = columns.filter(item => item !== "index");
                    //this.columnData = Object.keys(res.data.data[0]);
                    for (let i = 0; i < column.length; i++) {
                      const params = {};
                      params["name"] = column[i];
                      for (let j = 0; j < this.keyData.length; j++) {
                        if (column[i] === this.keyData[j]) {
                          /* recordIsCheck: true,
                               keyIsCheck: true,*/
                          params["recordIsCheck"] = true;
                          params["keyIsCheck"] = true;
                        } else {
                          params["recordIsCheck"] = false;
                          params["keyIsCheck"] = false;
                        }
                      }
                      this.columnData.push(params);
                    }
                    //this.columnData = Object.keys(res.data.data[0]);
                  } else {
                    this.$message.error(res.message);
                  }
                })
                // record.findCursorList(this.selectData).then(res => {
                //     if (res.success) {
                //         console.log(JSON.stringify(res.data.data));
                //         this.tableData = res.data.data;
                //         //自定义下标进行删除标记
                //         for (let i = 0; i < this.tableData.length; i++) {
                //             this.tableData[i]["index"] = i;
                //         }
                //         const columns = Object.keys(res.data.data[0]);
                //         const column = columns.filter(item => item !== "index");
                //         //this.columnData = Object.keys(res.data.data[0]);
                //         for (let i = 0; i < column.length; i++) {
                //             const params = {};
                //             params["name"] = column[i];
                //             for (let j = 0; j < this.keyData.length; j++) {
                //                 if (column[i] === this.keyData[j]) {
                //                     /* recordIsCheck: true,
                //                          keyIsCheck: true,*/
                //                     params["recordIsCheck"] = true;
                //                     params["keyIsCheck"] = true;
                //                 } else {
                //                     params["recordIsCheck"] = false;
                //                     params["keyIsCheck"] = false;
                //                 }
                //             }
                //             this.columnData.push(params);
                //         }
                //         //this.columnData = Object.keys(res.data.data[0]);
                //     } else {
                //         this.$message.error(res.message);
                //     }
                // })
            },
            //导入文件后回显
            uploadSuccess(res) {
                /*if (res.success) {*/
                    //console.log(res.data.data)
                    this.sendColumnData = [];
                    this.keyData = res.data.keyData;
                    this.tableData = res.data.data;
                    //console.log(JSON.stringify(this.tableData));
                    this.columnData = [];
                    //自定义下标进行删除标记
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i]["index"] = i;
                    }
                    const columns = Object.keys(res.data.data[0]);
                    const column = columns.filter(item => item !== "index");
                    //console.log(column);
                    //this.columnData = Object.keys(res.data.data[0]);
                    for (let i = 0; i < column.length; i++) {
                        const params = {};
                        params["name"] = column[i];
                        for (let j = 0; j < this.keyData.length; j++) {
                            if (column[i] === this.keyData[j]) {
                                /* recordIsCheck: true,
                                     keyIsCheck: true,*/
                                params["recordIsCheck"] = true;
                                params["keyIsCheck"] = true;
                            } else {
                                params["recordIsCheck"] = false;
                                params["keyIsCheck"] = false;
                            }
                        }
                        this.columnData.push(params);
                    }
                    // this.record = true;
                    //this.exportt = true;
               /* } else {
                    this.$message.error(res.message)
                }*/
                this.sendColumnData.push(this.keyData)
                this.sendColumnData = [...this.sendColumnData];
                this.keyData = [...this.keyData];
                console.log(this.sendColumnData)
                console.log(this.keyData)
            },
            onBeforeUpload(file) {
                const isIMAGE = file.type === 'xls' || "xlsx";
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isIMAGE) {
                    this.$message.error('上传文件只能是xls或xlsx格式!');
                }
                if (!isLt1M) {
                    this.$message.error('上传文件大小不能超过 1MB!');
                }
                return isIMAGE && isLt1M;
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件`);
            },
        }
    }

</script>

<style scoped>

    .excel * {
        border: 2px solid #ccc;
        text-align: center;
        line-height: 30px;
        width: 140px;
    }

    /deep/ .el-table th {
        overflow: initial;
    }

    /deep/ .el-table th > .cell {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 14px;
        color: #2e3444;
    }

    /deep/ .el-table thead tr:first-of-type th:first-of-type,
    /deep/ .el-table thead tr:nth-of-type(2) th:first-of-type {
        border-bottom: none;
        padding: 0;
    }

    /deep/ .el-table thead tr:last-of-type th:first-of-type:before {
        content: "";
        position: absolute;
        width: 1px;
        background-color: #ebeef5;
        display: block;
    }

    /deep/ .el-table tbody tr td:first-of-type .cell {
        font-family: PingFangSC-Regular, sans-serif;
        font-size: 14px;
        color: #ebeef5;
        font-weight: 600;
        text-align: center;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: white;
    }

    record.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #ebeef5;
    }

</style>