<template>
  <div>
    <!-- 主页 -->
    <div class="px-20" v-if="this.switch">
      <!-- 筛选 -->
      <div>
        <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
      </div>

      <div class="container mt-10">
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @operateItem="operate"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></ByTable>
      </div>
    </div>

    <!-- 测试页面 -->
    <div class="px-20" v-if="!this.switch">
      <!-- <div class="back">
        <el-button
          style="float: right; height: 32px; padding: 0 24px"
          type="primary"
          size="mini"
          margin-top="20px"
          @click="back"
          >返回上级</el-button
        >
      </div> -->

      <div class="taskMessage">
        <div
          class="taskMessage1"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <ByHeaderSlice title="任务信息"> </ByHeaderSlice>
          <span style="height: 32px">
            <el-button
              style="
                height: 32px;
                padding: 0px 14px;
                margin-right: 20px;
                font-size: 14px;
              "
              type="primary"
              size="mini"
              @click="back"
              >返回上级</el-button
            >
          </span>
        </div>

        <div
          class="messages"
          style="font-size: 16px; margin: 20px 0; width: 100%"
        >
          <el-descriptions
            :column="3"
            border
            :labelStyle="labelStyle"
            :contentStyle="contentStyle"
          >
            <el-descriptions-item label="业务需求:">{{
              taskMeg.biz_name
            }}</el-descriptions-item>
            <el-descriptions-item label="数据需求:">{{
              taskMeg.data_req_name
            }}</el-descriptions-item>
            <el-descriptions-item label="任务完成时间:">{{
              taskMeg.end_date
            }}</el-descriptions-item>
            <el-descriptions-item label="开发人员:">
              {{ taskMeg.owner_name }}
            </el-descriptions-item>
            <el-descriptions-item label="测试人员:">{{
              taskMeg.tester_id
            }}</el-descriptions-item>
            <el-descriptions-item label="任务类型:">{{
              taskMeg.task_category_txt
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="dataMessage">
        <!-- <ByContainerTitle title="开发数据信息" class="pt-20 bottomList">
        </ByContainerTitle> -->
        <ByHeaderSlice title="开发数据信息"> </ByHeaderSlice>
        <div class="itemsMessage" style="font-size: 16px; margin: 20px 0">
          <el-descriptions
            :column="3"
            border
            :labelStyle="labelStyleData"
            :contentStyle="contentStyleData"
            v-for="item in tableDataList"
          >
            <el-descriptions-item label="英文表名:">
              {{ item.en_name }}
            </el-descriptions-item>
            <el-descriptions-item label="中文表名:">
              {{ item.cn_name }}
            </el-descriptions-item>
            <el-descriptions-item label="字段信息:">
              <el-button  type="text" @click="checkTable(item.id)">点击查看</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <div class="testMessage">
        <!-- <ByContainerTitle title="测试要点名称" class="pt-20 bottomList">
        </ByContainerTitle> -->

        <div style="height: 32px; margin-bottom: 10px">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <ByHeaderSlice title="测试要点名称"> </ByHeaderSlice>
            <el-button
              style="
                float: right;
                height: 32px;
                padding: 0 14px;
                margin-right: 20px;
              "
              type="primary"
              @click="addPoints"
              >添加要点</el-button
            >
          </div>
        </div>

        <ByTable
          :tableData="testTableData"
          :columnArr="testColumnArr"
          @operateItem="operateTest"
          :height="400"
        ></ByTable>

        <div style="height: 32px; padding: 30px 0">
          <el-button
            style="
              float: right;
              height: 32px;
              padding: 0 14px;
              margin-right: 20px;
            "
            type="primary"
            @click="submit()"
            >提交测试</el-button
          >
          <!-- <el-button
            style="
              float: right;
              height: 32px;
              padding: 0 14px;

              margin-right: 20px;
            "
            type="primary"
            >保存</el-button -->
        </div>
      </div>

      <!-- 配置变量 -->
      <ByModel
        :visible.sync="variableVisable"
        modelTitle="配置"
        modelWidth="1000px"
        @close="variableVisable = false"
      >
        <div class="dataMessage">
          <ByContainerTitle title="开发数据信息" class="pt-20 bottomList">
          </ByContainerTitle>
          <div
            class="developDataMessage"
            style="font-size: 16px; margin-top: 20px"
          >
            <el-row v-for="item in tableDataList">
              <el-col :span="8">
                <div style="margin: 0 20px">
                  英文表名:<span> {{ item.en_name }} </span>
                </div>
              </el-col>
              <el-col :span="8"
                ><div style="margin: 0 20px">
                  中文表名: <span>{{ item.cn_name }} </span>
                </div></el-col
              >
              <el-col :span="8">
                <div style="margin: 0 20px">
                  字段信息: <span style="color: #409EFF" @click="checkTable(item.id)"> 点击查看</span>
                </div></el-col
              >
            </el-row>
          </div>
          <ByContainerTitle title="测试要点信息" class="pt-20 bottomList">
          </ByContainerTitle>
          <div class="pointMessage" style="font-size: 16px; margin-top: 20px">
            <el-row>
              <el-col :span="8">
                <div style="margin: 0 20px">
                  测试要点名称:
                  <span>{{
                    variablePointData.point_name
                      ? variablePointData.point_name
                      : ""
                  }}</span>
                </div>
              </el-col>
              <el-col :span="8"
                ><div style="margin: 0 20px">
                  测试要点类型:
                  <span>{{
                    variablePointData.point_type_txt
                      ? variablePointData.point_type_txt
                      : ""
                  }}</span>
                </div></el-col
              ></el-row
            >
            <el-row style="margin-top: 10px">
              <el-col :span="16">
                <div style="margin: 0 20px">
                  测试sql:
                  <span>{{ variablePointData.test_sql }}</span>
                </div></el-col
              >
            </el-row>
          </div>
          <div class="pointDatas" style="margin: 40px 20px">
            <el-form
              ref="variableTableData"
              :model="variableTableData"
              :rules="rules"
              :show-message="false"
              size="medium"
              label-width="120px"
            >
              <el-table :data="variableTableData.datas" style="width: 100%">
                <el-table-column align="center" prop="var_key">
                  <template slot="header"> 变量 </template>
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`datas.${scope.$index}.var_key`"
                      :rules="rules.var_key"
                      class="table"
                      label-width="0px"
                    >
                      <el-input v-model="scope.row.var_key"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column align="center" prop="var_val">
                  <template slot="header"> 值 </template>
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`datas.${scope.$index}.var_val`"
                      class="table"
                      :rules="rules.var_val"
                      inline-message="true"
                      label-width="0px"
                    >
                      <el-input v-model="scope.row.var_val"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作"
                  align="center"
                  class="operate"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="line-height: 8px"
                      @click="
                        deleteRowVariable(scope.$index, variableTableData.datas)
                      "
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="mt-10">
                <el-button
                  type="primary"
                  @click="addVariable"
                  style="padding: 8px 0; width: 82px; height: 32px"
                  >添加</el-button
                >
              </div>
            </el-form>
          </div>
        </div>
        <template slot="modalFoot">
          <el-button @click="cancelVariable">取 消</el-button>
          <el-button type="primary" @click="makeSureVariable">确 定</el-button>
        </template>
      </ByModel>
      <!-- 添加要点 -->
      <ByModel
        :visible.sync="pointsVisible"
        modelTitle="添加"
        modelWidth="1300px"
        @close="pointsVisible = false"
      >
        <ByTable
          :tableData="pointsTableData"
          :columnArr="pointsColumnArr"
          :pagination="pointsPagination"
          @handleMultiple="multiple"
          @sizeChange="sizeChangePoint"
          @currentChange="currentChangePoint"
        ></ByTable>

        <template slot="modalFoot">
          <el-button @click="pointsVisible = false">取 消</el-button>
          <el-button type="primary" @click="pointConfirm()" v-debounce>
            确 认
          </el-button>
        </template>
      </ByModel>
    </div>

    <ByModel
      :visible.sync="feedbackVisible"
      modelTitle="反馈"
      modelWidth="1000px"
      @close="feedClose"
    >
      <ByTable
        :tableData="feedbackTableData"
        :columnArr="feedbackColumnArr"
        :height="300"
      ></ByTable>
      <ByModelForm :form-data="test" :form-items="testItme" :form-config="taskConfig"></ByModelForm>
<!--      <div class="form-group">-->
<!--        <label for="text-input">备注:</label>-->
<!--        <textarea-->
<!--          id="text-input"-->
<!--          style="height: 20px"-->
<!--          v-model="testNote"-->
<!--        ></textarea>-->
<!--      </div>-->
      <template slot="modalFoot">
        <el-button type="primary" @click="pass()" v-debounce> 通过 </el-button>
        <el-button @click="rejection()">驳回</el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  formItems,
  columnArr,
  rules,
  tableData,
  testTableData,
  testColumnArr,
  pointsColumnArr,
  pointsTableData,
  variableColumnArr,
  feedbackColumnArr,
  feedbackTableData,
} from "./mock.js";
import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  components: {ByModelForm},
  data() {
    return {
      tableDataList: [
        {
          id: 9999999999999,
          en_name: "PROCESS_TBLA",
          cn_name: "加工表A",
        }
      ],
      // 主页面
      formItems,
      columnArr,
      tableData,
      test: [],
      testItme: [
        {
          prop: 'testNote',
          label: '备注',
          placeholder: '请输入任务描述',
          type: 'textarea',
          disabled: false,
          rwos: 2,
          span: 24
        },
      ],
      taskConfig : {
        labelWidth: "70px",
        width: '0px',
        inline: false,
        ref:"from"
      },
      pagination: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      paginationFeed: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      //切换变量
      switch: true,
      row: null,
      //测试页面
      ids: [],
      paginationTest: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      pointsPagination: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      pointsColumnArr,
      pointsTableData,
      testTableData,
      testColumnArr,
      taskMeg: null,
      labelStyle: {
        // 设置标签样式
        width: "12%",
        height: "30px",
        textAlign: "right",
      },
      contentStyle: {
        width: "22%",
        height: "30px",
      },
      labelStyleData: {
        // 设置标签样式
        width: "12%",
        height: "30px",
        textAlign: "right",
      },
      contentStyleData: {
        width: "22%",
        height: "30px",
      },
      pointsVisible: false,
      //配置变量
      variableVisable: false,
      variableColumnArr,
      variableTableData: {
        datas: [],
      },
      tskStatus: [],
      variablePointData: {
        // point_name: "",
        // point_type: "",
        // test_sql: "",
      },
      variableRow: "",
      rules,
      points: [],
      task_status_clone: [],
      //测试反馈页面
      feedbackVisible: false,
      testNote: "",
      feedbackColumnArr,
      feedbackTableData,
      task_id: "",

      pointTypeEnum: [],
      tskCategoryEnum: "",
    };
  },
  mounted() {
    // this.getCode("TskCategoryEnum");
    this.pointType();
    this.tskType();
    this.getPeople();
    this.taskType();

    this.getTestDatas();
  },
  methods: {
    // 开发测试
    search(val) {
      console.log(val, "val");
      this.getTestDatas(val);
    },
    reset(val) {
      // console.log(val);
    },
    operate(type, row) {
      if (type === "test") {
        this.row = row;
        this.getTestPointsDatas(row);
      } else {
        this.getTestFeedback(row);
        this.row = row;
        this.feedbackVisible = true;
      }
    },

    operateTest(type, row) {
      if (type === "del") {
        this.delkPointsDatas(row);
      } else if (type === "configuration") {
        this.echovariableMeg(row);
        this.getConfigurtionDatas(row);

        this.variableRow = row;
        this.variableVisable = true;
      }
    },
    back() {
      this.switch = true;
    },

    //获取测试列表数据
    getTestDatas(val) {
      const params = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        end_date: val ? val.end_date : "",
        owner_id: val ? val.owner_id.toString() : "",
        task_name: val ? val.task_name : "",
        task_status: val ? val.task_status_txt : "",
        tester_id: val ? val.tester_id.toString() : "",
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/queryByPage",
          params
        )
        .then((res) => {
          if (res && res.success) {
            let datas = res.data.tskTaskDevList;
            datas.map((item) => {
              this.task_status_clone.map((data) => {
                if (item.task_status == data.value) {
                  item.task_status_txt = data.label;
                }
              });
              this.tskStatus.forEach((data1) => {
                if (item.task_category === data1.value) {
                  item.task_category_txt = data1.label;
                }
              });
            });

            this.tableData = datas;
            console.log(this.tableData, "zhuye");
            this.pagination.total = Number(res.data.totalSize);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取测试-要点详情数据
    getTestPointsDatas() {
      this.$executeRequest
        .execGetByControllerAllMappingName(
          `/T/tskTaskPointRel/${this.row.task_id}`
        )
        .then((res) => {
          if (res.message === "Success") {
            let list = res.data.taskInfo;
            this.tskStatus.forEach((data) => {
              if (list.task_category == data.value) {
                list.task_category_txt = data.label;
              }
            });
            this.taskMeg = list;

            let datas = res.data.testPointInfo;
            datas.forEach((item) => {
              this.pointTypeEnum.forEach((data) => {
                if (item.point_type === data.value) {
                  item.point_type_txt = data.label;
                }
              });
            });

            this.testTableData = datas;
            this.switch = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取新增要点列表
    getPointsDatas(val) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/selectPointByTaskCategory?currPage=" +
            this.pointsPagination.pageNum +
            "&pageSise=" +
            this.pointsPagination.pageSize +
            "&taskCategory=" +
            this.row.task_category
        )
        .then((res) => {
          if (res.message === "Success") {
            let list = res.data.pageList;
            list.forEach((item) => {
              this.pointTypeEnum.forEach((data) => {
                if (item.point_type === data.value) {
                  item.point_type_txt = data.label;
                }
              });
              this.tskStatus.forEach((data) => {
                if (item.task_category === data.value) {
                  item.task_category_txt = data.label;
                }
              });
            });
            this.pointsTableData = list;
            this.pointsPagination.total = Number(res.data.totalSize);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    multiple(val) {
      val.forEach((item) => {
        this.ids.push(item.point_id);
      });
    },
    pointConfirm() {
      this.addPointsDatas();
    },

    //新增要点
    addPointsDatas() {
      let ids = this.ids.toString();
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/bachInsertRel?ids=" +
            ids +
            "&task_id=" +
            this.row.task_id
        )
        .then((res) => {
          if (res.success) {
            this.getTestPointsDatas();
            this.$Msg.customizTitle("添加成功");
            this.ids = [];
            this.pointsVisible = false;
          }
        });
    },

    //删除要点
    delkPointsDatas(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/deleteByRelId?rel_id=" + row.rel_id
        )
        .then((res) => {
          if (res.message === "Success") {
            this.$Msg.customizTitle("删除成功");
            this.getTestPointsDatas();
          }
        })
        .catch((err) => {
          this.$Msg.customizTitle("删除失败", "info");
        });
    },

    //根据要点id获取配置
    getConfigurtionDatas(row) {
      this.variableTableData.datas = [];
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/queryConfigByRelId?rel_id=" + row.rel_id
        )
        .then((res) => {
          if (res && res.success) {
            let lists = res.data.testPoint;
            this.pointTypeEnum.forEach((data) => {
              if (lists.point_type == data.value) {
                lists.point_type_txt = data.label;
              }
            });
            this.variablePointData = lists;
            let point = res.data.testPoint.test_sql;
            this.points = point.match(/{(.*?)}/g);
            if (this.points) {
              let obj = [];
              this.points.forEach((item) => {
                let list = { var_key: item, var_val: "" };
                obj.push(list);
              });
              if (this.variableTableData.datas.length === 0) {
                this.variableTableData.datas = obj;
              }
            }
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    },

    //提交测试
    submit() {
      this.submitTest();
    },
    submitTest(val) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/commitTest?task_id=" + this.row.task_id
        )
        .then((res) => {
          if (res && res.success) {
            this.back();
            this.getTestDatas();
            this.$Msg.customizTitle("提交测试成功");
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    },

    //测试反馈-获取测试要点数据
    getTestFeedback(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/testBack?task_id=" + row.task_id
        )
        .then((res) => {
          if (res.message === "Success") {
            res.data.forEach((item) => {
              this.pointTypeEnum.forEach((data) => {
                if (item.point_type === data.value) {
                  item.point_type_txt = data.label;
                }
              });
              this.tskStatus.forEach((data) => {
                if (item.task_category === data.value) {
                  item.task_category_txt = data.label;
                }
              });
            });
            this.feedbackTableData = res.data;
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    },

    pass() {
      this.testPass();
      this.test.testNote = "";
    },
    rejection() {
      this.testReject();
      this.test.testNote = "";
    },
    checkTable(id){
      console.log(id)
    },

    //测试通过
    testPass(val) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/testPass?task_id=" +
            this.row.task_id +
            "&test_note=" +
            this.test.testNote
        )
        .then((res) => {
          if (res.message === "Success") {
            this.feedbackVisible = false;
            this.$Msg.customizTitle("成功通过");
            this.getTestDatas();
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    },
    feedClose() {
      this.feedbackVisible = false;
      this.test.testNote = "";
    },

    //测试驳回
    testReject(val) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/testNoPass?task_id=" +
            this.row.task_id +
            "&test_note=" +
            this.test.testNote
        )
        .then((res) => {
          if (res.success) {
            this.feedbackVisible = false;
            this.$Msg.customizTitle("驳回成功");
            this.getTestDatas();
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    },

    //更新测试点配置信息
    updateTestMeg(val) {
      const params = {
        currPage: this.pointsPagination.pageNum,
        pageSize: this.pointsPagination.pageSize,
        taskCategory: this.row.task_category,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTaskPointRel/selectPointByTaskCategory",
          params
        )
        .then((res) => {
          if (res.message === "Success") {
            this.$Msg.console.log(res, "数据");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 配置要点编辑
    updatevariableMeg(val) {
      const params = {
        rel_id: this.variableRow.rel_id,
        varConfs: this.variableTableData.datas,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTestPointVarConf/updateVarConfig",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("配置成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //测试页面
    addPoints() {
      this.pointsVisible = true;
      this.getPointsDatas();
    },

    //状态获取
    async taskType() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "TaskStatusEnum",
        })
        .then((res) => {
          if (res && res.success) {
            let opt = [];
            res.data.map((item) => {
              if (item.code != 0 && item.code != 1) {
                opt.push({
                  label: item.value,
                  value: item.code,
                });
              }
            });
            this.formItems.forEach((item) => {
              if (item.prop === "task_status_txt") {
                item.options = opt;
                //浅拷贝
                this.task_status_clone = item.options;
              }
            });
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
    async tskType() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "TskCategoryEnum",
        })
        .then((res) => {
          if (res && res.success) {
            let opt = [];
            res.data.map((item) => {
              // if (item.code != 0 && item.code != 1) {
                opt.push({
                  label: item.value,
                  value: item.code,
                });
              // }
            });
            console.log(opt,'aaaaaaaaaaaaaa')
            this.tskStatus = opt;
            // this.columnArr.forEach((item) => {
            //   if (item.prop === "task_category_txt") {
            //     item.options = opt;
            //     //浅拷贝
            //     console.log();
            //     // this.task_status_clone = item.options;
            //   }
            // });
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
    // 配置变量删除
    deleteRowVariable(index, rows) {
      rows.splice(index, 1);
    },
    //根据要点id获取配置
    echovariableMeg(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/T/tskTestPointVarConf/queryByRelId?rel_id=" + row.rel_id
        )
        .then((res) => {
          if (res && res.success) {
            if (res.data.length > 0) {
              this.variableTableData.datas = res.data;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 配置变量新增
    addVariable() {
      const obj = {
        var_val: "",
        var_key: "",
      };
      this.variableTableData.datas.push(obj);
    },
    makeSureVariable() {
      this.$refs.variableTableData.validate((valid) => {
        if (valid) {
          this.updatevariableMeg();
          this.variableVisable = false;
          // console.log(this.$refs.variableTableData);
        }
      });
    },
    cancelVariable() {
      this.variableVisable = false;
    },
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      //调用接口
      this.getTestDatas();
    },

    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      this.getTestDatas();
    },

    // //分页
    // currentChangeTest(val) {
    //   this.pagination.pageNum = val;
    //   //调用接口
    //   this.getTestPointsDatas();
    // },

    // sizeChangeTest(val) {
    //   this.pagination.pageNum = 1;
    //   this.pagination.pageSize = val;
    //   //调用接口
    //   getTestPointsDatas();
    // },
    //分页
    currentChangePoint(val) {
      this.pagination.pageNum = val;
      //调用接口
      this.getPointsDatas();
    },

    sizeChangePoint(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      this.getPointsDatas();
    },
    async getPeople() {
      const params = {
        currPage: 1,
        pageSize: 999,
      };
      this.$executeRequest.execGetByUrl("/Base/sysUser/getAllSysUserWithOperator").then((res) => {
        if (res && res.success) {
          // console.log(res, "数控");
          let list = [];
          let data = res.data;
          data.forEach((item) => {
            list.push({
              label: item.user_name,
              value: item.user_id,
            });
          });
          this.formItems.forEach((item) => {
            if (item.prop === "owner_id") {
              item.options = list;
            } else if (item.prop === "tester_id") {
              item.options = list;
            }
          });
        }
      });
    },

    async pointType() {
      this.$executeRequest
        .execPostByControllerMapping("/T/code/getCategoryItems", {
          category: "PointTypeEnum",
        })
        .then((res) => {
          if (res && res.success) {
            let opt = [];
            res.data.map((item) => {
              if (item) {
                opt.push({
                  label: item.value,
                  value: item.code,
                });
              }
            });
            this.pointTypeEnum = opt;
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("新增失败", "info");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.form-group {
  display: flex; /* 使用 flex 布局 */
  // align-items: center; /* 垂直居中对齐 */
  width: 60%;
}

label {
  width: auto; /* 标题的宽度 */
  margin-right: 10px;
}

textarea {
  flex: 1; /* 填充剩余的空间 */
  height: 100px;
}
.taskMessage {
  margin-top: 30px;
}
.form-group textarea {
  padding: 5px;
}
::v-deep .el-form-item__error {
  color: #f56c6c !important;
}
::v-deep .el-form-item {
  margin: 10px 0;
}
.el-row .el-col div span {
  color: black;
}
</style>
