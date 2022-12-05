<!-- 登陆页 -->
<template>
  <div class="index">
    <div class="body"
      :style="{ backgroundImage: `url('/src/assets/login/login-bk.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }">
      <div class="title">惠购后台管理系统</div>
      <div class="center">
        <div class="center-top">
          <div class='isSelect'>密码登录</div>
        </div>
        <div class="phone-login">
          <div class="account">
            <div style="width:50px">账号：</div>
            <el-input v-model="account" class="input" placeholder="请输入登陆账号" />
          </div>
          <div class="mima">
            <div style="width:50px">密码：</div>
            <el-input v-model="password" class="input" placeholder="请输入登陆密码" />
          </div>
        </div>
        <div class="login-button" @click="loginClick">登 录</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import store from "@/store/index"
import { getUserInfo } from '@/utils/cookie'

export default defineComponent({
  data(): any {
    return {
      account: 'root',
      password: '1234567',
    };
  },

  created() {
    console.log(getUserInfo());
  },
  methods: {
    loginClick() {

      if (this.account == "") {
        this.$message.info('账号不能为空')
        return
      }
      if (this.password == "") {
        this.$message.info('密码不能为空')
        return
      }
      store().user.login({ account: this.account, password: this.password }).then(() => {
        this.$router.replace("/index") //authority
      }).catch((e: any) => {
        this.$message.info(e)
      })
    },

  }
})


</script>
<style lang='scss' scoped>
.index {
  width: 100%;
  height: 100%;

  .input {
    border: none;
    width: 250px;
    height: 42px;
    outline: none;
    background: #fff;
    padding-left: 10px;
  }

  .body {
    height: 100%;
    width: 100%;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .title {
      height: 500px;
      width: 500px;
      margin-right: 100px;
      font-size: 60px;
    }

    .center {
      width: 350px;
      height: 350px;
      background: #f5f5f5;
      opacity: 0.9;
      margin-right: 150px;
      position: relative;

      .img {
        position: absolute;
        top: 0;
        right: 0;
        height: 50px;
        width: 50px;
      }

      .center-top {
        display: flex;
        padding: 30px 20px 20px;

        .isSelect {
          border-bottom: 2px solid #999;
          // font-weight: bold;
        }
      }

      .phone-login {
        padding: 0 25px;

        .account {
          display: flex;
          align-items: center;
          .icon {
            font-size: 18px;
            vertical-align: middle;
            padding: 10px;
            background: #ddd;
          }
        }

        .mima {
          margin-top: 20px;
          display: flex;
          align-items: center;
          .icon {
            font-size: 18px;
            vertical-align: middle;
            padding: 10px;
            background: #ddd;
          }
        }
      }

      .login-button {
        width: 300px;
        cursor: pointer;
        line-height: 42px;
        text-align: center;
        margin: 30px auto 20px;
        height: 42px;
        border-radius: 5px;
        background: #f40;
        color: #fff;
      }
    }
  }
}
</style>