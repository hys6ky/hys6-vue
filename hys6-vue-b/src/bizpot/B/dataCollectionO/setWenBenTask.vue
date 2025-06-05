<template>
  <div>
    <el-row class='topTitle'>
      <span>文件内容流 Agent服务</span>
      <router-link :to="{name:'dataCollectionO'}">
        <el-button type="primary" size="small" class="goIndex" style="margin-left:8px">
          <i class="el-icon-back"></i>返回上一页
        </el-button>
      </router-link>
      <el-button type="primary" size="small" class="goIndex" style="margin-left:8px"
                 @click="saveSdmReceiveConfManage()">
        保存
      </el-button>
      <el-button type="primary" @click="dialogFileAdd = true" size="small" class="goIndex">
        <i class="el-icon-user-solid"></i> 导入文件添加内容流采集任务
      </el-button>
    </el-row>
    <div>
      <!--页面表单-->
      <el-form ref="form" label-position="right" :model="form" label-width="30%">
        <div>
          <span class="dialogtitle el-icon-edit">文件流设置:</span>
        </div>
        <div class="topForm">
          <el-form-item label="任务名称" prop="Sdm_receive_conf.sdm_receive_name"
                        :rules="filter_rules([{required: true}])">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_receive_name"
                      placeholder="任务名称"></el-input>
          </el-form-item>
          <el-form-item label="任务描述" prop="Sdm_receive_conf.sdm_rec_des">
            <el-input type="textarea" v-model="form.Sdm_receive_conf.sdm_rec_des" placeholder="任务描述"
                      style="width:300px" :rows="2">
            </el-input>
          </el-form-item>
          <el-form-item label="文本读取方式" prop="Sdm_receive_conf.file_readtype">
            <el-radio v-model="form.Sdm_receive_conf.file_readtype" label="0">内容读取</el-radio>
            <el-radio v-model="form.Sdm_receive_conf.file_readtype" label="1">字节读取</el-radio>
          </el-form-item>
          <el-form-item label="分区" prop="Sdm_receive_conf.sdm_partition"
                        :rules="filter_rules([{required: true}])">
            <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="1">随机分布</el-radio>
            <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="2">key</el-radio>
            <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="3">分区</el-radio>
            <div style="display:inline-block; position:absolute;width:100px">
              <el-form-item style="display:inline-block"
                            v-if="form.Sdm_receive_conf.sdm_partition=='2' || form.Sdm_receive_conf.sdm_partition=='3'"
                            prop="Sdm_receive_conf.sdm_partition_name"
                            :rules=" form.Sdm_receive_conf.sdm_partition=='2' || form.Sdm_receive_conf.sdm_partition=='3' ? filter_rules([{required: true}]):null">
                <el-input v-model="form.Sdm_receive_conf.sdm_partition_name" placeholder="流，接口"
                          style="width:100px;"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <div style="display:inline" v-show="form.Sdm_receive_conf.file_readtype==0">
            <el-form-item label="读取类型" prop="Sdm_receive_conf.read_type"
                          :rules=" form.Sdm_receive_conf.file_readtype==0 ? filter_rules([{required: true}]):null">
              <el-radio v-model="form.Sdm_receive_conf.read_type" label="0">单次读取</el-radio>
              <el-radio v-model="form.Sdm_receive_conf.read_type" label="1">实时读取</el-radio>
            </el-form-item>
            <el-form-item label="读取模式" prop="Sdm_receive_conf.read_mode"
                          :rules=" form.Sdm_receive_conf.file_readtype==0 ? filter_rules([{required: true}]):null">
              <el-radio v-model="form.Sdm_receive_conf.read_mode" label="1">按行读取</el-radio>
              <el-radio v-model="form.Sdm_receive_conf.read_mode" label="2">按JSON对象读取</el-radio>
            </el-form-item>
            <el-form-item label="监控类型" prop="Sdm_receive_conf.monitor_type"
                          :rules=" form.Sdm_receive_conf.file_readtype==0 ? filter_rules([{required: true}]):null">
              <el-radio v-model="form.Sdm_receive_conf.monitor_type" label="0">监控文件</el-radio>
              <el-radio v-model="form.Sdm_receive_conf.monitor_type" label="1">监控文件夹</el-radio>
            </el-form-item>
          </div>
          <el-form-item
              v-if="form.Sdm_receive_conf.monitor_type=='1' && form.Sdm_receive_conf.file_readtype =='0'"
              label="选择文件夹" prop="Sdm_receive_conf.ra_file_path"
              :rules=" form.Sdm_receive_conf.monitor_type=='1' ? filter_rules([{required: true}]):null">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.ra_file_path" :disabled="false">
              <template slot="append">
                <el-button type='primary' @click="selectFolder()">选择文件夹</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
              v-if="form.Sdm_receive_conf.monitor_type=='1'&& form.Sdm_receive_conf.file_readtype =='0'"
              label="文件匹配规则" prop="Sdm_receive_conf.file_match_rule"
              :rules=" form.Sdm_receive_conf.monitor_type=='1' ? filter_rules([{required: true}]):null">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.file_match_rule"
                      placeholder="请填写文件名匹配规则aaaa.*等">
            </el-input>
          </el-form-item>
          <el-form-item
              v-if="form.Sdm_receive_conf.monitor_type=='1'&& form.Sdm_receive_conf.file_readtype =='0'"
              label="线程数" prop="Sdm_receive_conf.thread_num"
              :rules=" form.Sdm_receive_conf.monitor_type=='1' ? filter_rules([{required: true}]):null">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.thread_num" placeholder="线程数">
            </el-input>
          </el-form-item>
          <el-form-item
              v-if="form.Sdm_receive_conf.monitor_type!='1' || form.Sdm_receive_conf.file_readtype =='1'"
              label="选择文件流文件" prop="Sdm_receive_conf.ra_file_path"
              :rules=" form.Sdm_receive_conf.monitor_type=='0' ? filter_rules([{required: true}]):null">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.ra_file_path" :disabled="true">
              <template slot="append">
                <el-button type='primary' @click="selectFile(1)">选择文件</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="启动方式" prop="Sdm_receive_conf.run_way">
            <el-radio v-model="form.Sdm_receive_conf.run_way" label="1">立即启动</el-radio>
            <el-radio v-model="form.Sdm_receive_conf.run_way" label="2">命令触发</el-radio>
          </el-form-item>
        </div>
        <div class="lines"></div>
        <div>
          <span class="dialogtitle el-icon-edit">生产流参数:</span>
        </div>
        <el-form-item label="消息主题" prop="Sdm_rec_param.topic" :rules="filter_rules([{required: true}])">
          <el-input style="width: 300px;" v-model="form.Sdm_rec_param.topic" placeholder="主题名称"></el-input>
        </el-form-item>
        <el-form-item label="流服务主机" prop="Sdm_rec_param.bootstrap_servers">
          <el-input style="width: 300px;" v-model="form.Sdm_rec_param.bootstrap_servers" :disabled='true'>
          </el-input>
          <el-button style="position: relative;margin-left:20px" type="primary" size="small"
                     @click="productStreamVisible=!productStreamVisible"> 高级设置
          </el-button>
        </el-form-item>
        <!--                                     隐藏下拉表单                                                     -->
        <div v-show="productStreamVisible">
          <el-row>
            <el-form-item label="发送成功确认等级" prop="Sdm_rec_param.acks">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.acks" placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item label="重试次数" prop="Sdm_rec_param.retries">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.retries" placeholder="">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="单条记录阈值" prop="Sdm_rec_param.max_request_size">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.max_request_size" placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item label="批量大小" prop="Sdm_rec_param.batch_size">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.batch_size" placeholder="">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="批处理等待时间" prop="Sdm_rec_param.linger_ms">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.linger_ms" placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item label="缓存大小" prop="Sdm_rec_param.buffer_memory">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.buffer_memory" placeholder="">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="键序列化器" prop="Sdm_rec_param.key_serializer">
              <el-select style="width: 300px;" v-model="form.Sdm_rec_param.key_serializer">
                <el-option value="String">String</el-option>
                <el-option value="Byte">Byte</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值序列化器" prop="Sdm_rec_param.value_serializer">
              <el-select style="width: 300px;" v-model="form.Sdm_rec_param.value_serializer">
                <el-option value="String">String</el-option>
                <el-option value="Avro">Avro</el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="压缩类型" prop="Sdm_rec_param.compression_type">
              <el-select style="width: 300px;" v-model="form.Sdm_rec_param.compression_type">
                <el-option value="none">none</el-option>
                <el-option value="gzip">gzip</el-option>
                <el-option value="snappy">snappy</el-option>
                <el-option value="lz4">lz4</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否同步" prop="Sdm_rec_param.sync">
              <el-select style="width: 300px;" v-model="form.Sdm_rec_param.sync">
                <el-option value="0" label="是"></el-option>
                <el-option value="1" label="否"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="拦截器" prop="Sdm_rec_param.interceptor_classes">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.interceptor_classes"
                        placeholder="类使用拦截器的列表">
              </el-input>
            </el-form-item>
            <el-form-item label="字节读取消息大小" prop="Sdm_rec_param.messageSize">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.messageSize" placeholder="">
              </el-input>
            </el-form-item>
          </el-row>
        </div>
        <!--                         隐藏下拉表单结束 -->
        <el-col>
          <div class="lines"></div>
        </el-col>
        <div>
          <span class="dialogtitle el-icon-edit">自定义业务处理:</span>
        </div>
        <el-form-item label="选择业务处理方式" prop="Sdm_receive_conf.cus_des_type">
          <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.cus_des_type">
            <el-option value="0" label="none"></el-option>
            <el-option value="1" label="Java"></el-option>
            <el-option value="2" label="JavaScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.cus_des_type=='1'" label="Java业务处理类"
                      prop="Sdm_receive_conf.sdm_bus_pro_cla">
          <el-input v-model="form.Sdm_receive_conf.sdm_bus_pro_cla" placeholder="Java业务处理类">
          </el-input>
          <el-button type="text" style="position: relative;margin-left:20px" size="small"
                     v-if="form.Sdm_receive_conf.cus_des_type=='1'" @click="programDialog=true">说明
          </el-button>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.cus_des_type=='2'" label="JavaScript业务处理程序"
                      prop="Sdm_receive_conf.sdm_bus_pro_cla">
          <el-input type='textarea' style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_bus_pro_cla"
                    placeholder="JavaScript业务处理程序">
          </el-input>
          <el-button type="text" style="position: relative;margin-left:20px" size="small"
                     v-if="form.Sdm_receive_conf.cus_des_type=='2'" @click="businessDialog=true">说明
          </el-button>
        </el-form-item>
        <el-col>
          <div class="lines"></div>
        </el-col>
        <div>
          <span class="dialogtitle el-icon-edit">故障报警:</span>
        </div>
        <el-row>
          <el-form-item label="故障报警方式" prop="Sdm_receive_conf.fault_alarm_mode">
            <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.fault_alarm_mode">
              <el-option value="none" label="none"></el-option>
              <el-option value="email" label="Email"></el-option>
              <el-option value="snmp" label="Snmp"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.Sdm_receive_conf.fault_alarm_mode=='email'" label="接收报警的email地址"
                        prop="Sdm_receive_conf.sdm_email">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_email"
                      placeholder="请填写正确的邮箱格式">
            </el-input>
          </el-form-item>
          <el-form-item v-if="form.Sdm_receive_conf.fault_alarm_mode=='snmp'" label="接收snmp协议发送数据主机ip"
                        prop="Sdm_receive_conf.snmp_ip">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.snmp_ip" placeholder="请填写正确的IP地址">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="form.Sdm_receive_conf.fault_alarm_mode!='none'" label="故障检查周期"
                        prop="Sdm_receive_conf.check_cycle">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.check_cycle"
                      placeholder="请填写正整数，单位：分钟">
            </el-input>
          </el-form-item>
        </el-row>
        <el-col>
          <div class="lines"></div>
        </el-col>
        <div>
          <span class="dialogtitle el-icon-edit">消息定义:</span>
        </div>
        <el-form-item v-if="form.Sdm_receive_conf.read_mode=='1' && form.Sdm_receive_conf.file_readtype==0"
                      label="整行判断类" prop="Sdm_receive_conf.file_handle">
          <el-input v-model="form.Sdm_receive_conf.file_handle" placeholder="整行判断类">
          </el-input>
        </el-form-item>
        <el-form-item label="编码" prop="Sdm_receive_conf.code" v-show="form.Sdm_receive_conf.file_readtype==0">
          <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.code">
            <el-option value="1" label="UTF-8"></el-option>
            <el-option value="2" label="GBK"></el-option>
            <el-option value="3" label="UTF_16"></el-option>
            <el-option value="4" label="GB2312"></el-option>
            <el-option value="5" label="ISO_8859_1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="读文件的位置" prop="Sdm_receive_conf.file_initposition">
          <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.file_initposition">
            <el-option value="0" label="初始位置"></el-option>
            <el-option value="-2" label="上次的位置"></el-option>
            <el-option value="-1" label="最新的位置"></el-option>
            <el-option value="1" label="自定义位置"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.file_initposition=='1'" label="行数"
                      prop="Sdm_receive_conf.file_read_num">
          <el-input v-model="form.Sdm_receive_conf.file_read_num" placeholder="行数">
          </el-input>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.read_mode=='1' && form.Sdm_receive_conf.file_readtype==0"
                      label="是否对每一行数据进行分隔" prop="Sdm_receive_conf.is_data_partition">
          <el-checkbox v-model="form.Sdm_receive_conf.is_data_partition" true-label="1" false-label="0">
          </el-checkbox>
          <el-form-item style="margin-left:30px;" v-if="form.Sdm_receive_conf.is_data_partition=='1'"
                        prop="Sdm_receive_conf.sdm_dat_delimiter"
                        :rules=" form.Sdm_receive_conf.is_data_partition=='1' ? filter_rules([{required: true}]):null">
            <el-input v-model="form.Sdm_receive_conf.sdm_dat_delimiter" placeholder="请输入分隔符"
                      style="width:170px"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.read_mode=='2' && form.Sdm_receive_conf.file_readtype==0"
                      label="是否解析对象" prop="Sdm_receive_conf.is_obj">
          <el-checkbox v-model="form.Sdm_receive_conf.is_obj" true-label="1" false-label="0">
          </el-checkbox>
        </el-form-item>
        <el-form-item label="是否包含文件属性：" v-show="form.Sdm_receive_conf.file_readtype==0" style="width:100%"
                      label-width='15%'>
          <el-checkbox label="所在主机IP(file_attr_ip)" v-model="form.Sdm_receive_conf.is_file_attr_ip"
                       true-label="1" false-label="0">
          </el-checkbox>
          <el-checkbox label="全路径(full_path)" v-model="form.Sdm_receive_conf.is_full_path" true-label="1"
                       false-label="0">
          </el-checkbox>
          <el-checkbox label="文件名(file_name)" v-model="form.Sdm_receive_conf.is_file_name" true-label="1"
                       false-label="0">
          </el-checkbox>
          <el-checkbox label="时间(file_time)" v-model="form.Sdm_receive_conf.is_file_time" true-label="1"
                       false-label="0">
          </el-checkbox>
          <el-checkbox label="文件大小(file_size)" v-model="form.Sdm_receive_conf.is_file_size" true-label="1"
                       false-label="0">
          </el-checkbox>
        </el-form-item>
        <div v-show="form.Sdm_receive_conf.is_data_partition=='1'  && form.Sdm_receive_conf.file_readtype==0
                || form.Sdm_receive_conf.is_obj==1">
          <el-button size="small" type="danger" style="" @click="addTable()">添加</el-button>
          <el-button size="small" type="danger" style="float:right" @click="diaVisible=true">快速添加列</el-button>
          <el-table stripe border size="small" :cell-style="{'text-align':'center'}"
                    :header-cell-style="{'text-align':'center'}" :data="form.sdmMessInfo">
            <el-table-column label="序号" type="index" width="80px"></el-table-column>
            <el-table-column label="变量名（英文）" prop="sdm_var_name_en">
              <template scope="scope">
                <el-input v-model="scope.row.sdm_var_name_en" style="width:100%"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="变量名（中文）" prop="sdm_var_name_cn">
              <template scope="scope">
                <el-input v-model="scope.row.sdm_var_name_cn" style="width:100%"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sdm_describe" label="含义" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_describe`"
                              style="width:100%;margin:auto 0px" label-width='0'>
                  <el-input v-model="scope.row.sdm_describe" style="width:100%"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="sdm_var_type" width='250px'>
              <template scope="scope">
                <el-select placeholder="请选择" v-model="scope.row.sdm_var_type">
                  <el-option v-for="item in inputTypeGroup" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="sdm_is_send" label="是否发送" align="center" width='100px'>
              <template slot-scope="scope">
                <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_is_send`">
                  <el-checkbox v-model="scope.row.sdm_is_send" true-label="1" false-label="0">
                  </el-checkbox>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="deleteMessInfo(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <!--                                        页面form结束                                              -->
      <!--                                  导入文件添加内容流采集任务弹窗                                         -->
      <el-dialog :visible.sync="dialogFileAdd" width="700px">
        <div slot="title">
          <span class="dialogtitle el-icon-caret-right">导入文件添加内容流采集任务</span>
          <el-button type="text" size="small" @click="viewInputFileTypeDialog=true">查看导入文件格式</el-button>
        </div>
        <el-form label-width="40%" :model="formFileAdd" ref="formFileAdd">
          <el-form-item label="选择数据字典" label-width="20%" prop="file_path" style="width:100%;">
            <el-input v-model="formFileAdd.file_path" :disabled="true" style="width:95%;">
              <template slot="append">
                <el-button type="primary" @click="formFileAdd.file_path=selectFolder(2)">选择数据字典所在目录
                </el-button>
              </template>
            </el-input>
            <span class="chooseTip">提示：数据字典路径选择到目录即可，且数据字典名称为dd_data.json，不可更改。</span>
          </el-form-item>
          <el-form-item label="采集日期和后缀名" prop="file_exte_date">
            <el-input v-model="formFileAdd.file_exte_date" autocomplete="off" placeholder="采集日期和后缀名"
                      style="width:80%">
            </el-input>
            <el-tooltip effect="dark"
                        content="指定数据字典同级目录下要采集的日期和后缀，如20180406.csv，定时采集当天数据请使用#{TXDATE}.csv "
                        placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="是否按行解析数据" prop="is_parse" label-width="50%">
            <el-switch v-model="formFileAdd.is_parse" active-color="#13ce66" inactive-color="grey"
                       active-value='1' inactive-value='0'>
            </el-switch>
            <!-- <el-radio v-model="formFileAdd.is_parse" label="0">是</el-radio>
        <el-radio v-model="formFileAdd.is_parse" label="1">否</el-radio> -->
          </el-form-item>
          <el-form-item label="数据分隔符" prop="data_separator" v-if="formFileAdd.is_parse=='1'">
            <el-input v-model="formFileAdd.data_separator" placeholder="数据分隔符" style="width:80%">
            </el-input>
            <el-tooltip effect="dark" content="数据文件按行解析需要使用的分隔符" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancleAdd" size="mini" type="danger">取 消</el-button>
          <el-button type="primary" style="width: 120px" @click="addContentCollectTask(formFileAdd)" size="mini">生成内容流采集任务
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--                                      Java业务处理类说明弹窗                    -->
    <el-dialog :visible.sync="programDialog" title="Java业务处理类说明" width="600px">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">Java业务处理类说明</span>
      </div>
      <div>
        实现接口：BusinessProcess<br>
        发送到分为String、Avro两种方式<br>
        String：有接收两个参数<br>
        参数一：List &lt;String&gt; listColumn （定义的列集合）
        参数二：JSONObject json （json格式数据）<br>
        返回值：JSONObject<br>
        Avro：有接收两个参数<br>
        参数一：List&lt;String&gt; listColumn （定义的列集合）<br>
        参数二：GenericRecord genericRecord （avro格式数据）<br>
        返回值： GenericRecord<br>
      </div>
    </el-dialog>
    <!--                                JavaScript业务处理说明弹窗                       -->
    <el-dialog :visible.sync="businessDialog" title="JavaScript业务处理程序说明" width="600px">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">JavaScript业务处理程序说明</span>
      </div>
      <div>
        实现JavaScript函数：var recordFunction=function(record){}<br/>
        record分为String、Avro两种方式<br>
        String方式参数record为json格式数据<br>
        返回值：JSONObjectAvro<br>
        方式参数record为<br>
        Avro格式数据返回值： GenericRecord'
      </div>
    </el-dialog>
    <!--JSON模板弹窗-->
    <el-dialog :visible.sync="viewInputFileTypeDialog" width="500px">
      <div slot="title" style="height:30px">
        <el-button type='text' @click="downLoadFileTemplate">下载模板</el-button>
      </div>
      <pre class="content">[
    {
        "storage_type":"1",
        "columns":[
            {
                "column_id":0,
                "column_key":"N",
                "column_cn_name":"",
                "column_remark":"",
                "column_name":"agent_id",
                "column_type":"numeric(10,0)",
                "column_null":"Y"
            },
            {
                "column_id":1,
                "column_key":"N",
                "column_cn_name":"",
                "column_remark":"",
                "column_name":"agent_ip",
                "column_type":"varchar(50)",
                "column_null":"Y"
            }
        ],
        "table_cn_name":"",
        "table_name":"agent_info"
    }
]		        </pre>
      <span slot="footer" class="dialog-footer">
                <el-button type="danger" size="small" @click="viewInputFileTypeDialog=false">关闭</el-button>
            </span>
    </el-dialog>
    <!--快速添加列弹窗-->
    <el-dialog title="快速添加列" :visible.sync='diaVisible' style="height:120%;">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">快速添加列</span>
      </div>
      <div style="height:150px">
        <el-input :rows="6" type="textarea" v-model="quickAdd"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="danger" size="small" @click="diaVisible=false">取 消</el-button>
                <el-button type="primary" size="small" @click="quickAddConfirm();">确 定</el-button>
            </span>

    </el-dialog>
    <!--                                         选择文件弹出框                       -->
    <el-dialog title="选择文件" :visible.sync="dialogSelect">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">选择文件</span>
      </div>
      <div class="mytree"  hight='200'>
        <el-tree ref='tree' :data="data2" :check-strictly="true" :show-checkbox='hiddenshow' node-key="name"
                 lazy :load="loadNode" :props="defaultProps" accordion :indent='0' @check-change="handleCheckChange">
                    <span class="span-ellipsis" slot-scope="{ node}">
                        <i class="el-icon-document" v-if="!node.disabled"/>
                        <span :title="node.label">{{ node.label }}</span>
                    </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSelect" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="dialogSelect = false;" size="mini">保存</el-button>
      </div>
    </el-dialog>
    <!--                                        选择文件夹弹出框                              -->
    <el-dialog title="选择文件夹" :visible.sync="dialogSelectfolder">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">选择文件夹</span>
      </div>
      <div class="mytree"  hight='200'>
        <el-tree ref='tree' :data="data2" :check-strictly="true" show-checkbox node-key="name" lazy
                 :load="loadNodeFolder" :props="defaultProps" accordion :indent='0'
                 @check-change="handleCheckChangeFolder">
                    <span class="span-ellipsis" slot-scope="{ node}">

                        <span :title="node.label">{{ node.label }}</span>
                    </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSelectFolder" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="dialogSelectfolder = false;" size="mini">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as fileOperations from '@/utils/fileOperations'
import {execDownloadFileByModuleUrl, execGetByPostModuleUrl} from "@/utils/executeRequest";

export default {
  mounted() {
    this.getBaseInfo()
  },
  data() {
    return {
      form: {
        Sdm_receive_conf: {
          file_readtype: "0",
          run_way: '1',
          cus_des_type: "0",
          fault_alarm_mode: "none",
          code: "1",
          file_initposition: "0",
          is_file_attr_ip: "0",
          is_full_path: "0",
          is_file_name: "0",
          is_file_time: "0",
          is_file_size: "0",
          is_data_partition: "0",
        },
        Sdm_rec_param: {
          acks: "1",
          retries: "0",
          max_request_size: "10485760",
          batch_size: "16384",
          linger_ms: "1",
          buffer_memory: "33554432",
          key_serializer: "String",
          value_serializer: "String",
          compression_type: "none",
          sync: "1",
          messageSize: "1048576",
          topic: "",
          bootstrap_servers: "",
          interceptor_classes: ""
        },
        sdmMessInfo: [],
      },
      agentList: [],
      sdm_agent_id: "",
      formLabelWidth: "165px",
      size: "medium",
      sdm_param_key: "",
      sdm_param_value: "",
      fileArry: [],
      dialogFileAdd: false,
      formFileAdd: {
        file_path: '',
        file_exte_date: '',
        is_parse: '',
        data_separator: ''
      },
      programDialog: false, //自定义业务处理说明弹窗控制
      businessDialog: false, //自定义业务处理说明弹窗控制
      viewInputFileTypeDialog: false, //查看导入文件格式弹窗控制
      diaVisible: false, //添加弹窗控制
      quickAdd: '', //快速添加
      dialogSelectfolder: false, //选择文件夹弹窗控制
      dialogSelect: false, //选择文件弹窗控制
      data2: [], //文件选择树结构列表
      inputTypeGroup: [ //消息定义的变量类型
        {value: '1', label: '整数'},
        {value: '2', label: '字符串'},
        {value: '3', label: '浮点数'},
        {value: '4', label: '字节数组'},
      ],
      hiddenshow: true, //路径选择是否可勾选
      defaultProps: { //树结构
        children: "children",
        label: "path",
        isLeaf: 'leaf'
      },
      fileMark: '',
      productStreamVisible: false, //高级设置下拉框控制
      param_list: [],
    }
  },
  methods: {
    //下载文件模板
    downLoadFileTemplate() {
      this.$executeRequest.execDownloadFileByModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/downLoadFileTemplate').then(res => {
        fileOperations.fileDownload(res.request.responseText, 'dd_data.json')
      })
    },
    //进入编辑页面，获取信息
    getBaseInfo() {
      if (this.$route.query.type == 'edit') {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectWenBenTask', {
          sdm_agent_id: this.$route.query.agent_id,
          sdm_receive_id: this.$route.query.sdm_receive_id
        }).then((res) => {
          this.form.Sdm_receive_conf = res.data.sdmReceiveInfo
          res.data.sdmParam_list.map((item) => {
            this.form.Sdm_rec_param[item.sdm_param_key] = item.sdm_param_value
          })
          this.form.Sdm_rec_param.bootstrap_servers = res.data.brokerServer
          this.getsdmMessInfo(res.data.sdmMess_list)
        })
      } else {
        this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getBrokerServer').then((res) => {
          this.form.Sdm_rec_param.bootstrap_servers = res.data
        })
      }
    },
    //根据res.data.sdmMess_list来检查是否包含文件属性，五个条件的勾选，单独插入的回显列表。
    getsdmMessInfo(data) {
      data.forEach(element => {
        switch (element.sdm_var_name_en) {
          case ('file_attr_ip'):
            this.form.Sdm_receive_conf.is_file_attr_ip = '1';
            break;
          case ('full_path'):
            this.form.Sdm_receive_conf.is_full_path = '1';
            break;
          case ('file_name'):
            this.form.Sdm_receive_conf.is_file_name = '1';
            break;
          case ('file_time'):
            this.form.Sdm_receive_conf.is_file_time = '1';
            break;
          case ('file_size'):
            this.form.Sdm_receive_conf.is_file_size = '1';
            break;
          default:
            this.form.sdmMessInfo.push(element)
        }
      });
    },
    // 生成内容流采集任务
    addContentCollectTask(formData) {
      formData['sdm_agent_id'] = this.$route.query.agent_id
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/saveWenBenLiuTask', formData).then((res) => {
        if (res.success == 'true') {
          this.$Msg.updateSuccess(res)
        }
      })
    },
    //param_list 组装
    mergeForm() {
      for (let key in this.form.Sdm_rec_param) {
        let newValue = {}
        newValue.sdm_param_key = key
        newValue.sdm_param_value = this.form.Sdm_rec_param[key]
        this.param_list.push(newValue)
      }
    },
    // 保存数据  test98
    saveSdmReceiveConfManage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.mergeForm()
          var data = this.form.Sdm_receive_conf;
          data.sdm_agent_id = this.$route.query.agent_id;
          data.sdmRecParam = JSON.stringify(this.param_list);
          // this.param_list = [];
          data.sdm_partition_name = data.sdm_partition == '1' ? null : data.sdm_partition_name

          if (data.file_readtype == '1') {
            data.read_type = null;
            data.read_mode = null;
            data.monitor_type = '0';
            data.file_handle = null;
            data.code = null;
            data.is_data_partition = null;
            data.is_obj = null;
            data.is_file_attr_ip = '0';
            data.is_full_path = "0";
            data.is_file_name = "0";
            data.is_file_time = "0";
            data.is_file_size = "0";
            data.sdm_dat_delimiter = null;
            data.file_read_num = null;
          }
          data.is_obj = data.read_mode == '0' ? null : data.is_obj;
          data.file_handle = data.read_mode == '1' ? null : data.file_handle;
          data.is_data_partition = data.read_mode == '2' ? null : data.is_data_partition;
          data.sdm_dat_delimiter = data.is_data_partition == '0' || data.is_data_partition == null ? '' : this.form.Sdm_receive_conf.sdm_dat_delimiter;
          this.form.sdmMessInfo = (data.is_data_partition == '0' && data.is_obj == '0') || (data.is_data_partition == null && data.is_obj == null) ? [] : this.form.sdmMessInfo;
          data.sdmMessInfo = JSON.stringify(this.form.sdmMessInfo);
          data.sdm_bus_pro_cla = data.cus_des_type == '0' ? null : data.sdm_bus_pro_cla;
          data.check_cycle = data.fault_alarm_mode == 'none' ? null : data.check_cycle;
          data.sdm_email = data.fault_alarm_mode == 'email' ? data.sdm_email : null;
          data.snmp_ip = data.fault_alarm_mode == 'snmp' ? data.snmp_ip : null;
          let param = {sdmReceiveConf:"",
            sdmRecParam:"",
            sdmMessInfo:""};
          // delete data.sdmMessInfo
          // delete data.sdmRecParam
          param.sdmReceiveConf= JSON.stringify(data);
          param.sdmRecParam=JSON.stringify(this.param_list);
          param.sdmMessInfo=JSON.stringify(this.form.sdmMessInfo);
          // param.append('sdmReceiveConf', JSON.stringify(data))
          // param.append('sdmRecParam', JSON.stringify(this.param_list))
          this.param_list = [];
          // param.append('sdmMessInfo', JSON.stringify(this.form.sdmMessInfo))

          // 调用添加方法
          if (this.$route.query.type == 'create') {
            this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/saveSdmReceiveConfManage', param).then(response => {
              if (response.success == true) {
                this.$Msg.saveSuccess(response)
                this.$router.push({name:'dataCollectionO'})
              }
            });
          } else if (this.$route.query.type == 'edit') {
            data.sdm_receive_id = this.$route.query.sdm_receive_id
            this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/updateSdmReceiveConfManage', param).then(response => {
              if (response.success == true) {
                this.$Msg.updateSuccess(response)
                this.$router.push({name:'dataCollectionO'})
              }
            });
          } else {
            return false
          }
        } else {
          return false;
        }
      });
    },
    //消息定义添加行
    addTable() {
      this.form.sdmMessInfo.push({
        sdm_var_name_en: "",
        sdm_var_name_cn: "",
        sdm_describe: "",
        sdm_var_type: "",
        sdm_is_send: "1"
      });
    },
    // 快速添加消息定义
    quickAddConfirm() {
      if (this.quickAdd != '') {
        let quickAddArry = []

        function unique(arr) {
          return [...new Set(arr)]
        }

        quickAddArry = unique(this.quickAdd.split(','))
        this.form.sdmMessInfo = []
        quickAddArry.map(item => {
          let newValue = {
            sdm_var_name_en: item,
            sdm_var_name_cn: item,
            sdm_describe: item,
            sdm_var_type: '2',
            sdm_is_send: "1",
          }
          this.form.sdmMessInfo.push(newValue);
        })
      }
      this.quickAdd = '';
      this.diaVisible = false;
    },
    //消息定义删除行
    deleteMessInfo(index, row) {
      this.form.sdmMessInfo.splice(index, 1);
    },
    // 选择文件
    selectFile(type) {
      this.dialogSelect = true;
      let path = '';
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectFile', {
        sdm_agent_id: this.$route.query.agent_id,
        path: path,
        isFile: true
      }).then(res => {
        if (res.data && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].isFolder == 'true') {
              res.data[i].children = [{}];
              res.data[i].disabled = true;
              res.data[i].leaf = false;
            } else if (res.data[i].isFolder == 'false') {
              res.data[i].disabled = false;
              res.data[i].leaf = true;
            }
          }
          this.data2 = res.data;
        } else {
          this.dialogSelect = false;
          this.treenloadingInfo = '暂无数据'
        }
      });
    },
    //  获取目录下一级
    loadNode(node, resolve) {
      if (node.level > 0) {
        setTimeout(() => {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectFile', {
            sdm_agent_id: this.$route.query.agent_id,
            path: node.data.path,
            isFile: true
          }).then(res => {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isFolder == 'true') {
                res.data[i].children = [{}];
                res.data[i].disabled = true;
                res.data[i].leaf = false;
              } else if (res.data[i].isFolder == 'false') {
                res.data[i].disabled = false;
                res.data[i].leaf = true;
              }
            }
            resolve(res.data);
          });
        }, 500);
      }

    },
    //获取选中状态下的数据
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        let arr = [data.name];
        this.$refs.tree.setCheckedKeys(arr);
      }
      this.form.Sdm_receive_conf.ra_file_path = data.path;
    },
    // 取消选择目录文件并且关闭弹出框
    cancelSelect() {
      if (this.fileMark != '') {
        this.form.Sdm_receive_conf.ra_file_path = this.fileMark;
      } else {
        this.form.Sdm_receive_conf.ra_file_path = '';
      }
      this.dialogSelect = false;
    },
    // 选择文件夹（文件夹）
    selectFolder(type) {
      window.selectType = type
      this.dialogSelectfolder = true;
      let path = '';
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectFile', {
        sdm_agent_id: this.$route.query.agent_id,
        path: path,
        isFile: false
      })
          .then(res => {
            if (res.data && res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].isFolder == 'true') {
                  res.data[i].children = [{}]
                }
              }
              this.data2 = res.data;
            } else {
              this.treenloadingInfo = '暂无数据'
            }
          });
    },
    //  获取文件夹目录下一级（文件夹）
    loadNodeFolder(node, resolve) {
      if (node.level > 0) {
        let path = node.data.path,
            id = this.$route.query.agent_id;
        setTimeout(() => {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectFile', {
            sdm_agent_id: id,
            path: path,
            isFile: false
          })
              .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].isFolder == 'true') {
                    res.data[i].children = [{}]
                  }
                }
                resolve(res.data);
              });
        }, 500);
      }
    },
    //获取选中状态下的数据（文件夹）
    handleCheckChangeFolder(data) {
      if (selectType == 2) {
        this.formFileAdd.file_path = data.path
      } else {
        this.form.Sdm_receive_conf.ra_file_path = data.path;
      }
    },
    // 取消选择目录文件并且关闭弹出框（文件夹）
    cancelSelectFolder() {
      this.form.Sdm_receive_conf.ra_file_path;
      this.dialogSelectfolder = false;
    },
    // 点击添加弹出框的取消按钮
    cancleAdd() {
      this.formFileAdd = {};
      this.dialogFileAdd = false;
      this.$refs.formFileAdd.resetFields();
    },
  }
}
</script>

<style scoped>
.el-form-item {
  width: 50%;
  display: inline-block;
}

.el-input {
  width: 350px;
}

.chooseTip {
  display: block;
  width: 110%;
  margin-left: -100px;

}

.lines {
  min-height: 1px;
  background: #dddddd;
  margin: 4px 0 15px -30px;
}
</style>