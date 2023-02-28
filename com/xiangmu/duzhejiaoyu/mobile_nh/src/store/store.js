import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        navs:[],//菜单的选中
    },
    mutations:{
        setnavs(state,val){
            state.navs = val;
        },
    },
    actions:{
        getnavs({commit},res) {
            commit("setnavs", res);
        },


    }
})

export default store;