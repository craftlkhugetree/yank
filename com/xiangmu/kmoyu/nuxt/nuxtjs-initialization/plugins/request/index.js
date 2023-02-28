
import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import {isEmptyValue} from '@/utils/validate'
const service = axios.create({
    baseURL: process.env.NODE_ENV !== 'production'?'/api':'/api', // url = base url + request url
    timeout: 20000 // 请求超时时间，
})


// 请求前操作
service.interceptors.request.use(
    config => {

        config.headers['Version'] = 1
        config.headers['X-Chinaftt-Client'] = 'platform-admin'
        const token = getToken()
        // 这里是我们那后台压根没判断token是否为空，有这个参数就去查token 去了，无语，所以需要判断下
        if (!isEmptyValue(token)) {
            config.headers['Admin-Token'] = token
            config.headers['X-Chinaftt-Client'] = 'platform-admin'
        }
        console.log(config)
        console.log(process.env.NODE_ENV )
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 请求返回
service.interceptors.response.use(
  
    response => {
 
        const res = response.data

        if (res.code == '4018') {
            return res
        }
        // if the custom code is not 20000, it is judged as an error.
        if (res.code != 2000) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            // 如果过期了，则清除token
            if (JSON.parse(res.code) == 4404 || JSON.parse(res.code) == 4195) {
               // store.dispatch('user/resetToken')
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        Message({
            message: error.message.includes('timeout') ?
                '网络延迟,请稍后再试!' :
                error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service