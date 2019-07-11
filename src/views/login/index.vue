<template>
  <div class="login-wrap">
    <van-nav-bar title="登陆" />
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          v-validate="'required'"
          name="mobile"
          :error-message="errors.first('mobile')"
          left-icon="iconshoujihao"
          label="手机号"
          right-icon="question-o"
          placeholder="请输入手机号"
          @click-right-icon="$toast('question')"
        />

        <van-field
          v-model="user.code"
          v-validate="'required'"
          name="password"
          :error-message="errors.first('password')"
          left-icon="iconshoujihao"
          type="password"
          label="验证码"
          placeholder="请输入验证码"
        />
      </van-cell-group>
      <div class="login-btn">
        <van-button
        class="btn"
        type="info"
        @click.prevent="handleLogin"
        :loading="loginLoading"
        >登陆</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '18801185985',
        code: '123456'
      },
      loginLoading: false // 控制登陆请求的 loading 状态
    }
  },
  created () {
    this.configCustomMessages()
  },
  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const valid = await this.$validator.validate()
        // 如果表单验证失败，则什么都不做
        if (!valid) {
          this.loginLoading = false
          return
        }
        // 表单通过，提交表单
        const data = await login(this.user)
        console.log(data)

        // 通过提交 mutation 更新 Vuex 容器中的状态
        this.$store.commit('setUser', data)
        // 登陆成功，简单粗暴跳转到首页，后面在处理跳转到来的页面
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        this.$toast.fail('登陆失败！用户名或密码错误')
      }
      this.loginLoading = false
    },
    configCustomMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          password: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
    }
  }
}
</script>

<style lang='less' scoped>
.login-btn {
  padding: 10px;
  .btn {
    width: 100%;
  }
}
</style>
