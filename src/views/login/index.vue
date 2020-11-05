<template>
  <div class="login-container">
    <!-- 导航栏 -->
  <van-nav-bar
  class="page-nav-bar"
  title="登录"
>
<van-icon slot="left" @click="$router.back()"  class=""   name="cross" />
</van-nav-bar>
<!-- 登录表单 -->
<!-- 表单验证 -->
<van-form @submit="onSubmit" ref="loginFrom">
  <van-field
    v-model="user.mobile"
    name="mobile"
    placeholder="请输入手机号"
     :rules="userFormrules.mobile"
     type="number"
     maxlength="11"
  >
  <i slot="left-icon" class="iconfont toutiaoshouji" ></i>
  </van-field>
  <van-field
    v-model="user.code"
    name="code"
    placeholder="请输入验证码"
    :rules="userFormrules.code"
    type="number"
    maxlength="6"
  >
<i slot="left-icon" class="iconfont toutiaoyanzhengma"></i>
  <template #button>
    <!-- 倒计时 -->
    <van-count-down
    v-if="isCountDownShow"
    :time="1000*60"
    format="ss s"
    @finish="isCountDownShow = false" />
    <van-button v-else class="send-sms-btn" round size="small" type="default" @click="onsendSms" native-type="button"><i class="send-sms-i"></i>发送验证码</van-button>
  </template>
  </van-field>
  <div style="margin: 16px;">
    <van-button  block type="info" native-type="submit">
      登录
    </van-button>
  </div>
</van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'loginIndex',
  components: {},
  props: {},
  data () {
    return {
      isCountDownShow: false,
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      userFormrules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async  onSubmit () {
      // 获取表单数据
      const user = this.user
      // 表单验证
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0，则持续展示
      })
      // 提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登陆成功')
        this.$router.back()
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败，请稍后重试')
        }
      }
      // 根据请求响应结果来处理后续操作
    },
    async onsendSms () {
    // 1.效验手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.iconfont{
  font-size: 37px;
}
 .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
  .send-sms-i{
    background-color: #f0f0f0;
    position: relative;
    right: 60px;
    border: 1px solid #f0f0f0;
  }
</style>
