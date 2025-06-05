<template>
<div class="error">
    <el-row>
        <el-col :span="13">
            <div class="timeStyle">
                登陆超时,页面将在 {{ times }} 秒后返回登陆页面...
                <el-button type="primary" round @click="goLogin">立即返回</el-button>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    data() {
        return {
            times: 10,
            timer: null,
        };
    },
    created() {
        this.$resetMessage.close();
    },
    mounted() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.times--;
            if (this.times === 0) {
                this.goLogin()
            }
        }, 1000);
    },
    methods: {
        goLogin() {
            //清除
            this.$store.dispatch('logOut')
            //返回到登陆页面
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
.error {
    background: url("../assets/images/time_out.jpg") no-repeat;
    text-align: center;
    height: 100%;
    background-size: 100%;
}

.timeStyle {
    color: #1464a3;
    font-size: 60px;
}

.el-row {
    top: 40%;
    left: 20%;
    max-width: 80%;
}
</style>
