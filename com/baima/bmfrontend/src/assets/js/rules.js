const yphone = /^1\d{10}$/; // 手机号
const email = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; // email地址
export default {
        // 联系方式
        contactRules: {
            YDDH: [{validator: function(rule, value, callback) {
                if(value && !yphone.test(value)) {            
                    callback(
                        new Error('请输入正确的手机号！')
                    )
                } else {
                    callback()
                }
              }, trigger: "blur"}],
            DZYX: [{validator: function(rule, value, callback) {
                if(value && !email.test(value)) {
                    callback(
                        new Error('请输入正确的电子邮箱！')
                    )
                } else {
                    callback()
                }
            }}]
        }
}