import request from '@/utils/request'
// 封装用户相关接口请求
export const login = ({ mobile, code }) => {
  // 可以在这执行其他逻辑
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
