<template>
    <div class="login-wrap">
        <van-nav-bar title="登陆"/>
    <form>
        <van-cell-group>
            <van-field
                v-model="user.mobile"
                left-icon="iconshoujihao"
                label="手机号"
                right-icon="question-o"
                placeholder="请输入手机号"
                @click-right-icon="$toast('question')"
            />

            <van-field
                v-model="user.code"
                left-icon="iconshoujihao"
                type="password"
                label="验证码"
                placeholder="请输入验证码"
            />
        </van-cell-group>
        <div class="login-btn">
            <van-button class="btn" type="info" @click.prevent="handleLogin">登陆</van-button>
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
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        const data = await login(this.user)
        console.log(data)

        // 通过提交 mutation 更新 Vuex 容器中的状态
        this.$store.commit('setUser', data)
      } catch (err) {
        console.log(err)
        console.log('登陆失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn{
    padding: 10px;
    .btn{
        width: 100%;
    }
}

</style>
