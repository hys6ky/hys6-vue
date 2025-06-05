<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">消费信息配置</span>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="generateConfigMsg">
        配置信息生成配置文件
      </el-button>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="nextStep"
                 v-if="bottomForm.con_with_par=='0'">下一步
      </el-button>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="savaPartition" v-else>
        保存
      </el-button>
      <router-link :to="{name:'consumptionList',query:{}}">
        <el-button type="primary" size="small" class="goIndex"><i class="el-icon-s-home" style="margin-right:5px"/>返回上一页
        </el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="content">
      <div slot="title">
        <!-- 启动参数列表 -->
        <span class="dialogtitle el-icon-edit">启动参数列表</span>
      </div>
      <div>
        <el-form :model="topForm" ref="topForm" label-width="30%" label-position="right">
          <el-form-item label="消费任务名称" prop="sdm_cons_name" :rules="filter_rules([{required: true}])">
            <el-input style="width: 300px;" v-model="topForm.sdm_cons_name"></el-input>
          </el-form-item>
          <el-form-item label="任务描述" prop="sdm_cons_describe">
            <el-input type="textarea" style="width:300px" :rows="2" v-model="topForm.sdm_cons_describe"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="lines"></div>
      <div>
        <!-- 消费端参数设置 -->
        <span class="dialogtitle el-icon-edit">消费端参数设置:</span>
      </div>
      <div>
        <el-form :model="middleForm" ref="middleForm" label-width="30%">
          <el-form-item label="消费方式" prop="consumer_type">
            <el-select style="width: 300px;" v-model="consumer_type">
              <el-option label="Consumer" value="1"></el-option>
              <!-- <el-option label="Streams" value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="消息主题" prop="topic" :rules="filter_rules([{required: true}])">
            <el-input style="width: 300px;" v-model="middleForm.topic" @blur="selectTopic"></el-input>
          </el-form-item>
          <el-form-item label="消费组" prop="groupid" :rules="filter_rules([{required: true}])">
            <el-input style="width: 300px;" v-model="middleForm.groupid"></el-input>
            <el-button type="primary" size='small' class="historyButton" @click="showConsumeHistory">消费组历史
            </el-button>
          </el-form-item>
          <el-form-item label="服务流主机" prop="bootstrap_servers">
            <el-input style="width: 300px;" v-model="middleForm.bootstrap_servers" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="分区数" prop="partitionCount">
            <el-input style="width: 300px;" v-model="middleForm.partitionCount" :disabled='true'></el-input>
            <el-button type="primary" size='small' class="historyButton" @click="advancedConfig=!advancedConfig"><i
                v-if="advancedConfig==false" class="el-icon-bottom"/><i v-else class="el-icon-top"/>高级设置
            </el-button>
          </el-form-item>
          <div v-if="advancedConfig==true" style="display:inline">
            <el-form-item label="单分区最大拉取字节" prop="max_partition_fetch_bytes">
              <el-input style="width: 300px;" v-model="middleForm.max_partition_fetch_bytes"></el-input>
            </el-form-item>
            <el-form-item label="单次拉取最大字节" prop="fetch_max_bytes">
              <el-input style="width: 300px;" v-model="middleForm.fetch_max_bytes"></el-input>
            </el-form-item>
            <el-form-item label="自动提交" prop="enable_auto_commit">
              <el-select style="width: 300px;" v-model="middleForm.enable_auto_commit">
                <el-option label="true" value="true"></el-option>
                <el-option label="false" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最大拉取条数" prop="max_poll_records">
              <el-input style="width: 300px;" v-model="middleForm.max_poll_records"></el-input>
            </el-form-item>
            <el-form-item label="超时检测时间" prop="session_timeout_ms">
              <el-input style="width: 300px;" v-model="middleForm.session_timeout_ms"></el-input>
            </el-form-item>
            <el-form-item label="偏移量设置" prop="auto_offset_reset">
              <el-select style="width: 300px;" v-model="middleForm.auto_offset_reset">
                <el-option value="latest" label="latest"></el-option>
                <el-option value="earliest" label="earliest"></el-option>
                <el-option value="none" label="none"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="自动提交时间" prop="auto_commit_interval_ms">
              <el-input style="width: 300px;" v-model="middleForm.auto_commit_interval_ms"></el-input>
            </el-form-item>
            <el-form-item label="拉取间隔时间" prop="poll">
              <el-input style="width: 300px;" v-model="middleForm.poll"></el-input>
            </el-form-item>
            <el-form-item label="键反序列化器" prop="key_deserializer">
              <el-select style="width: 300px;" v-model="middleForm.key_deserializer">
                <el-option value="String" label="String"></el-option>
                <el-option value="Byte" label="Byte"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值反序列化器" prop="value_deserializer">
              <el-select style="width: 300px;" v-model="middleForm.value_deserializer">
                <el-option value="Avro" label="Avro"></el-option>
                <el-option value="String" label="String"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拦截器" prop="interceptor_classes">
              <el-input style="width: 300px;" v-model="middleForm.interceptor_classes"></el-input>
            </el-form-item>
            <el-form-item label="字节读取消息大小" prop="messageSize">
              <el-input style="width: 300px;" v-model="middleForm.messageSize"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <div class="block">
                <el-date-picker style="width: 300px;" v-model="middleForm.startTime" type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <div class="block">
                <el-date-picker style="width: 300px;" v-model="middleForm.endTime" type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 是否按分区消费（中间输入框） -->
      <div>
        <div class="lines"></div>
        <el-form :model="bottomForm" ref="bottomForm" label-width="30%">
          <el-form-item label="是否按分区消费" prop="con_with_par">
            <el-select style="width: 300px;" v-model="bottomForm.con_with_par">
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择分区" prop="partition" v-if="bottomForm.con_with_par=='1'">
            <el-select style="width: 300px;" v-model="bottomForm.partition" @change="selectPartition">
              <el-option :value="item.value" :label="item.label" v-for="(item,index) in partitionGroup"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费线程执行周期" prop="consum_thread_cycle">
            <el-select style="width: 300px;" v-model="bottomForm.consum_thread_cycle">
              <el-option value="1" label="无限期"></el-option>
              <el-option value="2" label="按时间结束"></el-option>
              <el-option value="3" label="按数据量结束"></el-option>
            </el-select>
          </el-form-item>
          <div style="display:inline" v-if="bottomForm.consum_thread_cycle=='2'">
            <el-form-item label="按时间结束类型" prop="end_type">
              <el-select style="width: 300px;" v-model="bottomForm.end_type">
                <el-option value="0" label="无限期"></el-option>
                <el-option value="1" label="截止时间"></el-option>
                <el-option value="2" label="运行时长"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止日期" prop="deadline" v-if="bottomForm.end_type=='1'">
              <el-date-picker style="width: 300px;" v-model="bottomForm.deadline" value-format="yyyy-MM-dd HH:mm:ss"
                              type="datetime" placeholder="选择截止日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="运行时长" prop="run_time_long" v-if="bottomForm.end_type=='2'">
              <el-input v-model="bottomForm.run_time_long" style="width: 300px;">
                <template slot="append">
                  <el-select v-model="bottomForm.time_type" style="width: 100px;">
                    <el-option value="1" label="日"></el-option>
                    <el-option value="2" label="小时"></el-option>
                    <el-option value="3" label="分钟"></el-option>
                    <el-option value="4" label="秒"></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="数据量" prop="data_volume" v-if="bottomForm.consum_thread_cycle=='3'">
            <el-input style="width: 300px;" v-model="bottomForm.data_volume"></el-input>
          </el-form-item>
          <div style="display:inline" v-if="bottomForm.con_with_par=='0'">
            <el-form-item label="选择业务处理方式" prop="cus_des_type">
              <el-select style="width: 300px;" v-model="bottomForm.cus_des_type">
                <el-option value="0" label="none"></el-option>
                <el-option value="1" label="Java"></el-option>
                <el-option value="2" label="JavaScript"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Java业务处理类" prop="sdm_bus_pro_cla" v-if="bottomForm.cus_des_type=='1'">
              <el-input style="width: 300px;" v-model="bottomForm.sdm_bus_pro_cla" placeholder="Java业务处理类">
              </el-input>
              <el-popover placement="bottom" title="Java业务处理类说明" width="350" trigger="click">
                <p>实现接口：RealizeBusinessProcess<br>
                  方法接收存在三种类型<br>
                  第一种：<br>
                  参数：JSONObject message （json类型数据）<br>
                  返回值：BussinessEnum(枚举)<br>
                  第二种：<br>
                  参数：GenericRecord message （avro类型数据）<br>
                  返回值：BussinessEnum(枚举)<br>
                  第三种：<br>
                  参数：byte[] message (byte[]类型数据)<br>
                  返回值：BussinessEnum(枚举)<br>
                  枚举类三个值代表的含义：<br>
                  Stop：遇到当前数据则停止消费，进程终止。<br>
                  skip：跳过，当前数据不处理。<br>
                  keep：正常处理。</p>
                <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="JavaScript业务处理程序" prop="sdm_bus_pro_cla" v-if="bottomForm.cus_des_type=='2'">
              <el-input style="width: 300px;" v-model="bottomForm.sdm_bus_pro_cla" placeholder="JavaScript业务处理程序">
              </el-input>
              <el-popover placement="bottom" title="JavaScript业务处理程序说明" width="400" trigger="click">
                <p>实现JavaScript函数：var recordFunction=function(record){}<br>
                  record分为String、Avro两种方式<br>
                  String方式参数record为json格式数据<br>
                  Avro方式参数record为avro格式数据<br>
                  返回值只能为为stop,skip和keep中的一个<br>
                  三个值代表的含义：<br>
                  Stop：遇到当前数据则停止消费，进程终止。<br>
                  skip：跳过，当前数据不处理。<br>
                  keep：正常处理。</p>
                <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
              </el-popover>

            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-if="bottomForm.con_with_par=='1'">
        <div class="lines"></div>
        <!-- 已选择消费目的地分区 -->
        <div>
          <span class="dialogtitle el-icon-edit">已选择消费目的地分区:</span>
        </div>
        <el-form label-width="10%">
          <div v-for="(item,index) in destinationGroup" :key="index" style="margin-top:20px">
            <el-form-item label=' ' style="width:100%">
              <span>分区</span>
              <el-input style="width:50px;margin-left:10px" :disabled='true' v-model="item.partition"></el-input>
              <span style="margin-left:30px">目的地</span>
              <el-input style="width:150px;margin-left:10px" :disabled='true' v-model="item.sdm_conf_describe">
              </el-input>
              <span style="margin-left:30px">方式</span>
              <el-select style="width:150px;margin-left:10px" v-model="item.descustom_buscla">
                <el-option value="0" label="none"></el-option>
                <el-option value="1" label="Java"></el-option>
                <el-option value="2" label="JavaScript"></el-option>
              </el-select>
              <div style="display:inline-block;width:380px" v-if="item.descustom_buscla=='1'">
                <span style="margin-left:30px">Java业务处理类</span>
                <el-input placeholder="Java业务处理类" style="width:150px;margin-left:10px" v-model="item.des_class">
                </el-input>
                <el-popover placement="bottom" title="Java业务处理类说明" width="350" trigger="click">
                  <p>实现接口：RealizeBusinessProcess<br>
                    方法接收存在三种类型<br>
                    第一种：<br>
                    参数：JSONObject message （json类型数据）<br>
                    返回值：BussinessEnum(枚举)<br>
                    第二种：<br>
                    参数：GenericRecord message （avro类型数据）<br>
                    返回值：BussinessEnum(枚举)<br>
                    第三种：<br>
                    参数：byte[] message (byte[]类型数据)<br>
                    返回值：BussinessEnum(枚举)<br>
                    枚举类三个值代表的含义：<br>
                    Stop：遇到当前数据则停止消费，进程终止。<br>
                    skip：跳过，当前数据不处理。<br>
                    keep：正常处理。</p>
                  <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
                </el-popover>
              </div>
              <div style="display:inline-block;width:380px" v-if="item.descustom_buscla=='2'">
                <span style="margin-left:30px">JavaScript业务处理程序</span>
                <el-input placeholder="JavaScript业务处理程序" style="width:150px;margin-left:10px"
                          v-model="item.des_class">
                </el-input>
                <el-popover placement="bottom" title="JavaScript业务处理程序说明" width="400" trigger="click">
                  <p>实现JavaScript函数：var recordFunction=function(record){}<br>
                    record分为String、Avro两种方式<br>
                    String方式参数record为json格式数据<br>
                    Avro方式参数record为avro格式数据<br>
                    返回值只能为为stop,skip和keep中的一个<br>
                    三个值代表的含义：<br>
                    Stop：遇到当前数据则停止消费，进程终止。<br>
                    skip：跳过，当前数据不处理。<br>
                    keep：正常处理。</p>
                  <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
                </el-popover>
              </div>
              <el-button type="primary" size='small' style="margin-left:10px" @click="addConfig(item,'create',index)"
                         v-if="item.sdm_conf_describe==''">新增配置
              </el-button>
              <el-button type="primary" size='small' style="margin-left:30px" @click="addConfig(item,'edit',index)"
                         v-else>编辑配置
              </el-button>
              <el-button type="danger" size='small' @click="delConfig(item,index)">删除</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!--消费组历史 -->
      <el-dialog :visible.sync="consumptionDialog" title="消费组历史" width="500px">
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">消费组历史</span>
        </div>
        <el-table :data="consumptionHistory" stripe :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}" height="500PX">
          <el-table-column label="消费组" prop="groupid"></el-table-column>
          <el-table-column label="消息主题名称" prop="topic"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
                <el-button @click="consumptionDialog=false" size="small" type="danger">关闭</el-button>
            </span>
      </el-dialog>
      <!--消费目的地设置 -->
      <el-dialog :visible.sync="addConfigDialog" title="消费目的地设置" width="900px" :before-close="cancleConfig">
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">消费目的地设置</span>
        </div>
        <el-form :model="dialogForm" ref="dialogForm" label-width="30%">
          <el-form-item label="消费端目的地" style="width:100%" label-width="15%" prop="sdm_conf_describe"
                        :rules="filter_rules([{required: true}])">
            <el-radio-group v-model="dialogForm.sdm_conf_describe" @change="handleCheckedChange">
              <el-radio :label="item.value" v-for="(item,index) in consumptionDestinationGroup" :key="index">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文件类型" v-if="dialogForm.sdm_conf_describe=='4'" prop="external_file_type"
                        :rules="filter_rules([{required: true}])">
            <el-select style="width:80%" v-model="dialogForm.external_file_type">
              <el-option value="1" label='csv'></el-option>
              <el-option value="2" label='parquet'></el-option>
              <el-option value="3" label='avro'></el-option>
              <el-option value="4" label='orcfile'></el-option>
              <el-option value="5" label='sequencefile'></el-option>
              <el-option value="6" label='其他'></el-option>
            </el-select>
          </el-form-item>
          <div v-if="dialogForm.sdm_conf_describe=='5'">
            <el-form :model="binaryForm" ref="binaryForm" label-width="30%">
              <el-form-item label="文件名" prop="file_name" style="width:50%" :rules="filter_rules([{required: true}])">
                <el-input v-model="binaryForm.file_name" style="width:80%"></el-input>
              </el-form-item>
              <el-form-item label="文件绝对路径" style="width:50%" prop="file_path"
                            :rules="filter_rules([{required: true}])">
                <el-input style="width:200px" v-model="binaryForm.file_path"></el-input>
              </el-form-item>
              <el-form-item label="消费不到数据重发时间" style="width:50%;" label-width="170px" prop="time_interval"
                            :rules="filter_rules([{required: true,dataType:'number'}])">
                <el-input v-model="binaryForm.time_interval" style="width:75%"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="dialogForm.sdm_conf_describe=='7'">
            <el-form-item label="选择业务处理方式" prop="descustom_buscla">
              <el-select v-model="dialogForm.descustom_buscla" style="width:80%">
                <el-option value="0" label="None"></el-option>
                <el-option value="1" label="Java"></el-option>
                <el-option value="2" label="JavaScript"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Java自定义目的地程序" v-if="dialogForm.descustom_buscla=='1'" label-width="170px"
                          prop="des_class" :rules="filter_rules([{required: true}])">
              <el-input v-model="dialogForm.des_class" style="width:80%"></el-input>
              <el-popover placement="bottom" title="Java业务处理类说明" width="450" trigger="click">
                <p>实现接口：ConsumerBusinessProcess<br>
                  参数一：List&ltConsumerRecord&ltString, byte[]&gt&gt partitionRecords （该分区内的数据集合）<br>
                  参数二：JSONObject json （kafak配置参数）<br>
                  参数三：int partitionNum （该分区）<br>
                  返回值：int （为未处理的消息条数）</p>
                <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
              </el-popover>
            </el-form-item>
            <el-form-item label="JavaScript自定义目的地程序" v-if="dialogForm.descustom_buscla=='2'" label-width="210px"
                          prop="des_class" :rules="filter_rules([{required: true}])">
              <el-input style="width:140px" v-model="dialogForm.des_class"></el-input>
              <el-popover placement="bottom" title="Java业务处理类说明" width="400" trigger="click">
                <el-button slot="reference" type="text" style="margin-left:20px" size="small">说明</el-button>
                <p>
                  实现JavaScript函数：var recordFunction=function(record){}<br>
                  record分为String、Avro两种方式<br>
                  String方式参数record为json格式数据<br>
                  Avro方式参数record为avro格式数据<br>
                  无返回值<br>
                </p>
              </el-popover>
            </el-form-item>
          </div>
          <el-form-item label="线程数" v-if="bottomForm.con_with_par=='0'" style="display: inline-block;"
                        prop="thread_num" :rules="filter_rules([{required: true}])">
            <el-input v-model="dialogForm.thread_num" style="width:80%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="cancleConfig" size="small" type="danger">关闭</el-button>
                <el-button type="primary" size="small" @click="confirmConfig"
                           v-if="bottomForm.con_with_par=='0'">{{ this.buTitle }}</el-button>
                <el-button type="primary" size="small" @click="confirmPartitionConfig" v-else>保存</el-button>
            </span>
      </el-dialog>
      <!--JavaScript业务处理说明弹窗-->
      <el-dialog :visible.sync="businessDialog" title="JavaScript业务处理程序说明" width="500px">
        <div>
          实现JavaScript函数：var recordFunction=function(record){}<br>
          record分为String、Avro两种方式<br>
          String方式参数record为json格式数据<br>
          Avro方式参数record为avro格式数据<br>
          返回值只能为为stop,skip和keep中的一个<br>
          三个值代表的含义：<br>
          Stop：遇到当前数据则停止消费，进程终止。<br>
          skip：跳过，当前数据不处理。<br>
          keep：正常处理。<br>
        </div>
      </el-dialog>
      <!--选择存储层弹框-->
      <el-dialog :visible.sync="StorageTierDialog" width="900px">
        <el-form style="height:600px;overflow:auto">
          <el-table :data="StorageTiertableData" border stripe size="medium" ref="StorageTiertableData">
            <el-table-column property label="选择" type="index" align="center" width='60'>
              <template slot-scope="scope">
                <el-radio :disabled="iflock" v-model="dsl_id" @change="radioChange(scope.row)"
                          :label="scope.row.dsl_id">&thinsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
            <el-table-column prop="dsl_name" label="名称" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="store_type" label="存储类型" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="dsl_remark" label="备注" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="is_hadoopclient" width="140" label="hadoop客户端" align="center"></el-table-column>
            <el-table-column prop="store_type" width="202" label="数据存储层配置属性" align="center">
              <template slot-scope="scope">
                <el-button type="info" size="mini"
                           @click="dataSaveConfigure = true;searchDataStoreById(scope.$index, scope.row)">数据存储层配置属性
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div style="float:left;margin-top:-10px" v-show="hiveSelect">
            <span style="float:left" class="dialogtitle ">请选择hive文件类型:</span>
            <div>
              <el-radio-group v-model="dialogForm.hdfs_file_type" size="mini">
                <el-radio label="1" border>csv</el-radio>
                <el-radio label="2" border>parquet</el-radio>
                <el-radio label="3" border>avro</el-radio>
                <el-radio label="4" border>orcfile</el-radio>
                <el-radio label="5" border>sequencefile</el-radio>
              </el-radio-group>
            </div>
          </div>
          <el-button @click="StorageTierDialog = false" type="danger" size="medium">取 消</el-button>
          <el-button type="primary" @click="confirmStrorage()" size="medium">确 定</el-button>
        </div>
      </el-dialog>
      <!--数据存储层配置属性-->
      <el-dialog title="数据存储层配置属性" :visible.sync="dataSaveConfigure" width="1100px">
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">数据存储层配置属性</span>
        </div>
        <el-form>
          <el-table :data="tableDataConfigure" border stripe size="medium">
            <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
            <el-table-column prop="storage_property_key" show-overflow-tooltip label="key"
                             align="center"></el-table-column>
            <el-table-column prop="storage_property_val" show-overflow-tooltip label="value"
                             align="center"></el-table-column>
            <el-table-column prop="dsla_remark" label="描述" show-overflow-tooltip align="center"></el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dataSaveConfigure = false" size="mini" type="danger">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      radio: 1,
      inner: 0,
      //选择存储层数据定义
      StorageTierDialog: false,
      iflock: false,
      dataSaveConfigure: false,
      dsl_id: "",
      sdm_des_id: '',
      StorageTiertableData: [],
      checkboxType: [],
      databaseType: [],
      form: {},
      tableDataConfigure: [],
      buTitle: '下一步',
      configIndex: '',
      advancedConfig: false,
      addConfigDialog: false,
      programDialog: false,
      businessDialog: false,
      consumptionDialog: false,

      consumptionDestinationGroup: [{label: '存储层', value: '1'}, {label: 'rest服务', value: '3'}, {
        label: '文件',
        value: '4'
      }, {label: '二进制文件', value: '5'}, {label: 'Kafka', value: '6'}, {label: '自定义业务类', value: '7'}],
      partitionGroup: [],
      destinationGroup: [],
      destinationNameGroup: [],

      topForm: {
        sdm_cons_name: '',
        sdm_cons_describe: '',
      },
      consumer_type: '1',
      middleForm: {
        topic: '',
        groupid: '',
        bootstrap_servers: '',
        partitionCount: '',
        max_partition_fetch_bytes: '1048576',
        fetch_max_bytes: '52428800',
        enable_auto_commit: 'true',
        max_poll_records: '500',
        session_timeout_ms: '10000',
        auto_offset_reset: 'latest',
        auto_commit_interval_ms: '5000',
        poll: '1000',
        key_deserializer: 'String',
        value_deserializer: 'String',
        interceptor_classes: '',
        messageSize: '1048576',
        startTime: '',
        endTime: '',
      },
      bottomForm: {
        con_with_par: '0',
        // partition: '',
        end_type: '', //?
        deadline: '',
        run_time_long: '0',
        time_type: '',
        descustom_buscla: '0',
        consum_thread_cycle: '1',
        data_volume: '',
        des_class: ''
      },
      dialogForm: {
        //cus_des_type: '',
        hdfs_file_type: '',
        thread_num: '',
        sdm_conf_describe: '1',
        external_file_type: '',
        //sdm_bus_pro_cla: '',

      },
      //二进制文件
      binaryForm: {
        file_name: '',
        file_path: '',
        time_interval: '',

      },
      consumptionHistory: [],
      sdm_receive_id: '',
      nextType: '',
      topicReceiveId: '',
      fristType: '1',
      hiveSelect: false,
      times: 0
    }
  },
  mounted() {
    if (this.$route.query.topic_name) {
      this.middleForm.topic = this.$route.query.topic_name
    }
    if (this.$route.query.brokerServer) {
      this.middleForm.bootstrap_servers = this.$route.query.brokerServer
    }
    if (this.$route.query.sdm_partition) {
      this.middleForm.partitionCount = this.$route.query.sdm_partition
      this.partitionGroupAdd(this.middleForm.partitionCount)
    }
    if (this.$route.query.type == 'edit') {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getConsumeMsg', {
        sdm_consum_id: this.$route.query.sdm_consum_id
      }).then((res) => {
        for (let key in this.bottomForm) {
          this.bottomForm[key] = res.data.confMsg[key]
        }
        this.topForm.sdm_cons_name = res.data.confMsg.sdm_cons_name
        res.data.paraMsg.map(item => {
          this.middleForm[item.sdm_conf_para_na] = item.sdm_cons_para_val
        });
        this.partitionGroupAdd(this.middleForm.partitionCount)
        if (res.data.binFileMsg != {} & res.data.binFileMsg != undefined) {
          for (let key in this.binaryForm) {
            this.binaryForm[key] = res.data.binFileMsg[key]
          }
        }
        ;
        if (res.data.confMsg.con_with_par == '1') {
          this.topForm.sdm_conf_describe = res.data.confMsg.sdm_conf_describe
          this.bottomForm.descustom_buscla = '0'
          this.bottomForm.des_class = ''
          this.destinationGroup = res.data.consumeDesMsg
          this.destinationGroup.forEach((item, index) => {
            this.consumptionDestinationGroup.map(ele => {
              if (item.sdm_conf_describe == ele.value) {
                item.sdm_conf_describe = ele.label
                this.destinationNameGroup.push(item.partition)
              }
            })
            if (item.partition == undefined) {
              this.destinationGroup.splice(index, 1)
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/deletePatitionMsg', {
                sdm_consum_id: item.sdm_consum_id,
                sdm_des_id: item.sdm_des_id
              })
            }
            ;
          })
        } else {
          this.fristType = '0'
          this.sdm_des_id = res.data.consumeDesMsg[0].sdm_des_id
          this.nextType = res.data.consumeDesMsg[0].sdm_conf_describe
          if (res.data.consumeDesMsg[0].sdm_conf_describe == '5') {
            this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg', {
              sdm_consum_id: this.$route.query.sdm_consum_id,
              sdm_des_id: this.sdm_des_id
            }).then(res => {
              for (let key in this.binaryForm) {
                this.binaryForm[key] = res.data.binFileMsg[key]
                this.binaryForm.file_id = res.data.binFileMsg.file_id
              }
            })
          }
          for (let key in this.dialogForm) {
            this.dialogForm[key] = res.data.consumeDesMsg[0][key]
          }
        }
        if (this.dialogForm.sdm_conf_describe == '2') {
          this.dialogForm.sdm_conf_describe = '1'
        }
        this.selectTopic()
      })
    }
  },
  methods: {
    handleCheckedChange(val) {
      if (val == '1' || val == '3' || val == '4' || val == '6') {
        this.buTitle = '下一步';
      } else {
        this.buTitle = '保存';
      }
    },
    radioChange(data) {
      this.dsl_id = data.dsl_id;
      if (data.store_type.toUpperCase() === "HIVE") {
        this.hiveSelect = true
      } else {
        this.hiveSelect = false
        this.dialogForm.hdfs_file_type = null
      }
    },
    newAdd(partition) {
      let newValue = {};
      newValue.sdm_bus_pro_cla = '',
          newValue.sdm_conf_describe = '',
          newValue.descustom_buscla = '',
          newValue.partition = partition,
          newValue.des_class = '',
          newValue.sdm_cons_des = '1',
          newValue.thread_num = '',
          newValue.external_file_type = '',
          // newValue.sdm_des_id = '',
          newValue.sdm_thr_partition = '',
          // newValue.hyren_consumedes = '',
          newValue.descustom_buscla = '0',
          newValue.hdfs_file_type = ''
      return newValue
    },
    //主题填写完成，查询主题信息
    selectTopic() {
      try {
        if (this.middleForm.topic != '') {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/selectTopicName', {
            topic_name: this.middleForm.topic
          }).then(ele => {
            if (ele.data.length != 0) {
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumerTopic', {
                topic_id: ele.data[0].topic_id
              }).then((res) => {
                if (this.middleForm.topic == ele.data[0].sdm_top_name) {
                  this.topicReceiveId = ele.data[0].sdm_receive_id
                  this.middleForm.partitionCount = ele.data[0].sdm_partition
                  this.middleForm.bootstrap_servers = res.data.brokerServer
                  this.partitionGroupAdd(this.middleForm.partitionCount)
                } else {
                  this.$Msg.customizTitle('主题无效，请重新选择！', 'warning')
                }
              })
            } else {
              this.$Msg.customizTitle('主题无效，请重新选择！', 'warning')
            }
          })
        }
      } catch (error) {
      }
    },
    //获取消费组历史
    showConsumeHistory() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/showConsumeHistory', {}).then(res => {
        if (res && res.success) {
          this.consumptionHistory = res.data
          this.consumptionDialog = true
        }
      })
    },
    //分区选择数组填充
    partitionGroupAdd(count) {
      this.partitionGroup = []
      for (let i = 0; i < count; i++) {
        let newValue = {}
        newValue.label = i.toString()
        newValue.value = i.toString()
        this.partitionGroup.push(newValue)
      }
    },
    //选择分区后，增加目的地分区输入
    selectPartition(item) {
      if (this.fristType != this.bottomForm.con_with_par && this.times == 0) {
        this.destinationGroup = []
        this.times++
        this.dialogForm.cus_des_type = '0',
            this.dialogForm.hdfs_file_type = '',
            this.dialogForm.thread_num = '',
            this.dialogForm.sdm_conf_describe = '',
            this.dialogForm.external_file_type = '',
            this.dialogForm.sdm_bus_pro_cla = ''
      }
      if (this.destinationNameGroup.includes(item) == false) {
        this.destinationGroup.push(this.newAdd(item))
        this.destinationNameGroup.push(item)
      }
    },
    //增加或编辑目的地配置
    addConfig(data, type, index) {
      window.partitionType = type
      if (data.sdm_conf_describe != '') {
        for (let key in data) {
          this.dialogForm[key] = data[key]
        }
        if (data.sdm_conf_describe == '存储层') {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg', {
            sdm_consum_id: this.$route.query.sdm_consum_id,
            sdm_des_id: data.sdm_des_id
          }).then(res => {
            this.dsl_id = res.data.dataMsg.dsl_id
          })
        }
        if (data.sdm_conf_describe == '二进制文件') {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg', {
            sdm_consum_id: this.$route.query.sdm_consum_id,
            sdm_des_id: data.sdm_des_id
          }).then(res => {
            for (let key in this.binaryForm) {
              this.binaryForm[key] = res.data.binFileMsg[key]
              this.binaryForm.file_id = res.data.binFileMsg.file_id
            }
          })
        }
        this.sdm_des_id = data.sdm_des_id
        this.consumptionDestinationGroup.map(ele => {
          if (this.dialogForm.sdm_conf_describe == ele.label) {
            this.dialogForm.sdm_conf_describe = ele.value
            this.nextType = this.dialogForm.sdm_conf_describe
          }
        })
      }
      this.configIndex = data.partition
      this.nextStep()
    },
    //删除目的地配置
    delConfig(data, index) {
      if (data.sdm_conf_describe) {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/deletePatitionMsg', {
          sdm_consum_id: data.sdm_consum_id,
          sdm_des_id: data.sdm_des_id
        }).then(res => {
          if (res.success != undefined && res.success == true) {
            this.$Msg.deleteSuccess(res)
            this.destinationGroup.splice(index, 1);
            this.destinationNameGroup.splice(this.destinationNameGroup.indexOf(data.partition), 1)
          }
        })
      } else {
        this.destinationGroup.splice(index, 1);
        this.destinationNameGroup.splice(this.destinationNameGroup.indexOf(data.partition), 1)
      }
    },
    //取消配置
    cancleConfig() {
      this.addConfigDialog = false
      this.configIndex = ''
      if (this.bottomForm.con_with_par == '1') {
        this.$refs.dialogForm.resetFields()
      }
    },
    //获取存储层列表
    getStorageTiertableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/searchDataStore').then(res => {
        if (res && res.success) {
          res.data.forEach((item, index) => {
            this.$Code.getValue({
              category: "IsFlag",
              code: item.is_hadoopclient
            }).then((res) => {
              item.is_hadoopclient = res.data;
            });
            this.$Code.getValue({
              category: "Store_type",
              code: item.store_type
            }).then((res) => {
              item.store_type = res.data;
            })
            if (item.dsl_id == this.dsl_id) {
              this.$refs.StorageTiertableData.toggleRowSelection(res.data[index]);
            }
          })
          this.StorageTiertableData = res.data;
        }
      });
    },
    //获取存储层详细信息
    searchDataStoreById(index, row) {
      this.checkboxType = [];
      let params = {}
      params['dslId'] = row.dsl_id
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getStorageLayerConfInfo', {
        "dsl_id": row.dsl_id
      }).then((res) => {
        this.tableDataConfigure = res.data.dsl_attr_s;
        res.data.dsl_attr_s.forEach(item => {
          if (item.storage_property_key == 'database_type') {
            item.storage_property_val = row.store_type
          }
        })
        this.form.dsl_name = res.data.dsl_name;
        this.form.store_type = res.data.store_type;
      })
    },
    //确认选择存储层
    confirmStrorage() {
      if (this.dsl_id != '') {
        try {
          this.StorageTiertableData.map((item) => {
            if (item.dsl_id == this.dsl_id) {
              this.dialogForm.sdm_conf_describe = item.store_type == 'Hbase' ? '2' : '1'
              throw SyntaxError
            }
          })
        } catch {
        }
        this.saveConsumerMsg()
      } else {
        this.$Msg.customizTitle("请选择存储目的地", "warning")
      }
    },
    //确认配置
    confirmConfig() {
      try {
        this.$refs.dialogForm.validate((valid) => {
          //  此处检查线程数值是否符合规则。
          if (valid) {
            if (this.bottomForm.con_with_par == '0' && this.dialogForm.thread_num > this.middleForm.partitionCount) {
              this.$Msg.customizTitle('线程数不能大于分区数！', 'warning')
              throw SyntaxError()
            }
          } else {
            throw SyntaxError()
          }
        })
      } catch (err) {
        return false
      }
      switch (this.dialogForm.sdm_conf_describe) {
        case '1':
          this.StorageTierDialog = true
          this.getStorageTiertableData()
          break;
        case '3':
          this.saveConsumerMsg('consumptionRestConfig')
          break;
        case '4':
          this.saveConsumerMsg('consumptionFileConfig')
          break;
        case '5':
          try {
            this.$refs.binaryForm.validate((valid) => {
              if (valid == false) {
                throw SyntaxError()
              } else {
                this.saveConsumerMsg('')
              }
            })
          } catch (err) {
            return false
          }
          break;
        case '6':
          this.saveConsumerMsg('consumptionKafkaConfig')
          break;
        case '7':
          this.saveConsumerMsg('')
          break;
      }
      this.addConfigDialog = false
    },
    confirmPartitionConfig() {
      this.confirmConfig()
    },
    savaPartition() {
      let resultForm = {}
      let type = this.nextType == resultForm.sdm_conf_describe ? 'edit' : 'create'
      try {
        if (this.destinationGroup.length == 0) {
          this.$Msg.customizTitle('请按分区选择消费目的地!', 'warning')
          throw SyntaxError()
        } else {
          this.destinationGroup.map(item => {
            if (item.sdm_conf_describe == '') {
              this.$Msg.customizTitle('分区消费目的地配置信息填写不完善!', 'warning')
              throw SyntaxError()
            }
          })
        }
      } catch (error) {
        return false
      }
      //resultForm.sdm_consume_des = JSON.stringify(this.destinationGroup)
      resultForm.sdm_consum_id = this.$route.query.sdm_consum_id
      //remark
      for (let key in this.topForm) {
        resultForm[key] = this.topForm[key]
      }
      for (let key in this.bottomForm) {
        resultForm[key] = this.bottomForm[key]
      }
      resultForm.consumer_type = this.consumer_type
      //resultForm.data_volume = '0'
      // delete resultForm.partition
      //delete resultForm.cus_des_type
      //delete resultForm.sdm_bus_pro_cla
      // resultForm.end_type='1'
      //resultForm.deadline = '2'
      //resultForm.time_type ='3'
      // resultForm.remark = '4'
      //resultForm.create_date ='5'
      //resultForm.create_time = '6'
      //resultForm.sdm_des_id = '7'
      //resultForm.sdm_consum_id = '8'
      //resultForm.sdm_cons_describe = '9'
      //resultForm.user_id = '2001'
      //this.destinationGroup[0].des_class = ''
      resultForm.thread_num = resultForm.thread_num == '' ? '0' : resultForm.thread_num //此值必传，且有值。（不懂为什么按区分还要传！！！没有就接口报错。）
      //this.destinationGroup[0].external_file_type = '1'
      //this.destinationGroup[0].sdm_thr_partition = '1'
      //this.destinationGroup[0].hdfs_file_type = ''
      //resultForm.sdm_conf_describe = '7'
      this.destinationGroup.forEach(item => {
        this.consumptionDestinationGroup.map(ele => {
          if (item.sdm_conf_describe == ele.label) {
            item.sdm_conf_describe = ele.value
          }
        })
      })
      resultForm.sdm_consume_des = JSON.stringify(this.destinationGroup)
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveConsumerMsgToPartition', resultForm).then((res) => {
        if (res.success == true) {
          this.$Msg.saveSuccess(res)
          this.$router.go(0)
        }
      })
    },
    //保存前整理合并下数据
    merageData() {
      let resultForm = {},
          sdm_cons_para_list = []
      for (let key in this.bottomForm) {
        resultForm[key] = this.bottomForm[key]
      }
      for (let key in this.topForm) {
        resultForm[key] = this.topForm[key]
      }
      let newValue = {}
      for (let key in this.middleForm) {
        newValue.sdm_conf_para_na = key
        newValue.sdm_cons_para_val = this.middleForm[key]
        sdm_cons_para_list.push(newValue)
        newValue = {}
      }

      if (this.dialogForm.sdm_conf_describe == '5') {
        for (let key in this.binaryForm) {
          resultForm[key] = this.binaryForm[key]
        }
      }

      resultForm.consumer_type = this.consumer_type
      resultForm.data_volume = '0'
      resultForm.sdm_cons_para = JSON.stringify(sdm_cons_para_list)
      resultForm.sdm_cons_des = '1'
      resultForm.is_add = this.$route.query.type == 'edit' ? '0' : '1'
      if (resultForm.is_add == '0') {
        resultForm.sdm_consum_id = this.$route.query.sdm_consum_id
        resultForm.sdm_des_id = this.sdm_des_id
      }
      for (let key in this.dialogForm) {
        resultForm[key] = this.dialogForm[key]
      }
      resultForm.thread_num = resultForm.thread_num == '' ? '0' : resultForm.thread_num //此值必传，且有值。(线程数)（不懂为什么按区分还要传！！！没有就接口报错。）
      if (this.bottomForm.con_with_par == '1') {

        this.destinationGroup.forEach(item => {
          if (item.partition == this.configIndex) {
            resultForm.cus_des_type = item.descustom_buscla
            resultForm.sdm_bus_pro_cla = item.des_class
          }
        })
      }
      if (this.middleForm.topic != '') {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/selectTopicName', {
          topic_name: this.middleForm.topic
        }).then(res => {
          this.topicReceiveId = res.data[0].sdm_receive_id
        })
      }
      return resultForm
    },
    //保存消费信息
    saveConsumerMsg(url) {
      let resultForm = this.merageData()
      if (resultForm.sdm_conf_describe != '5') {
        delete resultForm.file_id
      }
      if (resultForm.con_with_par == '0') {
        if (resultForm.sdm_des_id == undefined && resultForm.sdm_consum_id == undefined) {
          this.save(resultForm, url)
        } else if (this.sdm_des_id == '' && resultForm.sdm_consum_id != '') {
          let _this = this
          new Promise(function (resolve, reject) {
            _this.destinationGroup.map((res, index) => {
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/deletePatitionMsg', {
                sdm_consum_id: res.sdm_consum_id,
                sdm_des_id: res.sdm_des_id
              })
            })
            resolve();
          }).then(res => {
            resultForm.sdm_consume_des = JSON.stringify(this.destinationGroup)
            this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveConsumerMsgToPartition', resultForm).then(res => {
              delete resultForm.sdm_consume_des
              this.destinationGroup.push(this.newAdd())
              for (let key in this.dialogForm) {
                delete resultForm[key]
                this.destinationGroup[0][key] = this.dialogForm[key]
              }
              resultForm.sdm_des_id = '1'
              resultForm.is_add = '1'
              for (let key in this.dialogForm) {
                resultForm[key] = this.dialogForm[key]
              }
              this.save(resultForm, url)
            })
          })
        } else if (this.sdm_des_id != '' && resultForm.sdm_consum_id != '') {
          this.save(resultForm, url)
        }
      } else {
        if (window.partitionType == 'create') {
          resultForm.sdm_des_id = '1'
          resultForm.is_add = '1'
        }
        if (this.fristType != resultForm.con_with_par) {
          let haha = []
          resultForm.sdm_consume_des = JSON.stringify(haha)
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveConsumerMsgToPartition', resultForm).then(res => {
            this.save(resultForm, url)
          })
        } else {
          this.save(resultForm, url)
        }
      }
    },
    save(resultForm, url) {
      let type = this.nextType == resultForm.sdm_conf_describe ? 'edit' : 'create'
      resultForm.sdm_thr_partition = resultForm.con_with_par == '0' ? '1' : '2'
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveConsumerMsg', resultForm).then((res) => {
        if (res.success == true) {
          this.sdm_receive_id = this.topicReceiveId
          if (resultForm.sdm_conf_describe == '1') {
            this.$router.push({
              name: 'consumpationDataBaseConfig',
              query: {
                dsl_id: this.dsl_id,
                sdm_consum_id: res.data.sdm_consume_id,
                sdm_des_id: res.data.sdm_des_id,
                sdm_receive_id: this.sdm_receive_id,
                topic_name: this.middleForm.topic,
                type: type,
              }
            })
          } else if (resultForm.sdm_conf_describe == '2') {
            this.$router.push({
              name: 'consumptionHbaseConfig',
              query: {
                dsl_id: this.dsl_id,
                sdm_consum_id: res.data.sdm_consume_id,
                sdm_des_id: res.data.sdm_des_id,
                sdm_receive_id: this.sdm_receive_id,
                topic_name: this.middleForm.topic,
                type: type,
              }
            })
          } else if (resultForm.sdm_conf_describe == '5' || resultForm.sdm_conf_describe == '7') {
            let _this = this
            new Promise(function (resolve, reject) {
              _this.$Msg.saveSuccess(res)
              setTimeout(function () {
                resolve()
              }, 1000)
            }).then(ele => {
              this.$router.push({
                name: 'consumptionList',
                query: {
                  sdm_consum_id: res.data.sdm_consume_id,
                  sdm_des_id: res.data.sdm_des_id,
                  sdm_receive_id: this.sdm_receive_id,
                  topic_name: this.middleForm.topic,
                  type: 'edit',
                }
              })
              this.$router.go(0)
            })
          } else {
            this.$router.push({
              name: url,
              query: {
                sdm_consum_id: res.data.sdm_consume_id,
                sdm_des_id: res.data.sdm_des_id,
                sdm_receive_id: this.sdm_receive_id,
                topic_name: this.middleForm.topic,
                type: type,
              }
            })
          }
        }
      })
    },
    //生成配置信息
    generateConfigMsg() {
      var _this = this
      if (this.$route.query.sdm_consum_id) {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/generateConfigMsg', {
          sdm_consum_id: this.$route.query.sdm_consum_id
        }).then(res => {
          if (res.success == true) {
            this.$Msg.customizTitle('生成配置成功！')
            setTimeout(function () {
              _this.$router.push({
                name: 'consumptionList',
              })
            }, 1500)
          }
        })
      } else {
        this.$Msg.customizTitle('请先填写并保存配置信息！', 'warning')
      }
    },
    nextStep() {
      if (this.nextType == '1' || this.nextType == '2') {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg', {
          sdm_consum_id: this.$route.query.sdm_consum_id,
          sdm_des_id: this.sdm_des_id
        }).then(res => {
          if (res.data.dataMsg) {
            this.dsl_id = res.data.dataMsg.dsl_id
          }
        })
      }
      try {
        this.$refs.topForm.validate((valid) => {
          if (valid == false) {
            this.addConfigDialog = false
            throw SyntaxError()
          }
        })
        this.$refs.middleForm.validate((valid) => {
          if (valid == false) {
            this.addConfigDialog = false
            throw SyntaxError()
          }
        })
      } catch (err) {
        return false
      }
      this.addConfigDialog = true
    },
  }
}
</script>

<style scoped>
.nav {
  font-size: 20px;
  color: #2196f3;

}

.lines {
  margin-top: 4px;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
  margin-left: -50px;
}

.el-input {
  width: 350px;
}

.el-select {
  width: 350px;
}

.el-form-item {
  width: 50%;
  display: inline-block;
}

.historyButton {
  position: relative;
  margin-left: 10px;

}
</style>
