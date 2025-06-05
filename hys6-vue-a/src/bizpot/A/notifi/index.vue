<template>
  <div>
    <el-row style="margin-top: 15px;padding: 0px 10px">
      <el-col :span="20">
        <el-input
            placeholder="请输入通知内容"
            type="textarea"
            :rows="15"
            v-model="message"
        >
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button
            type="primary"
            @click="sendMessage"
            style="margin-top: 276px; margin-left: 15px"
        >发 送</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "",
  data() {
    return {
      message: "",
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    sendMessage() {
      this.$executeRequest.execByControllerMappingName("/getSendHost").then((res) => {
        // console.log(res)
        if (res && res.success && res.data.length > 0) {
          if (this.message) {
            let messageObj = {};
            messageObj[
                "message"
                ] = `通知地址：${res.data} <br />${this.message}`;
            messageObj["sys_notifiy"] = true;
            this.$socket.send(JSON.stringify(messageObj));
          }
        }
      });
    },
  }
}
</script>

<style scoped lang="less">

</style>
