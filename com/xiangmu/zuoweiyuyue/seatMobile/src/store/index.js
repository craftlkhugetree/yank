import Vue from 'vue'
import Vuex  from 'vuex'
Vue.use(Vuex)
import util from "../util/util";
import code from '../util/code'
export default new Vuex.Store({
    state:{
        BlackText: '', // 黑名单
    },
    mutations:{
        setBlackText(state, data) {
            state.BlackText = data;
        },
    },
    actions:{
        // 获取黑名单信息
        getBlackText({
            commit
        }) {
            return new Promise((resolve, reject) => {
            util.postAjax({
                code: code.base,
                url: code.isInBlackList,
                })
                .then(res => {
                if (res.success) {
                    commit("setBlackText", res.data);
                    resolve(res.data)
                } else {
                    reject(res)
                }
                }).catch(err => {
                reject(err)
                })
            })
        },
    }
})