import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        selectimgs:'',//上传购书单的图片数组
        Fundstype:'',//境内/境外
        selected:'',//首页选中的
    },
    mutations:{
        setselectimgs(state,val){
            state.selectimgs = val;
        },
        setFundstype(state,val){
            state.Fundstype = val;
        },
        setselected(state,val){
            state.selected = val;
        },
    }
})

export default store;