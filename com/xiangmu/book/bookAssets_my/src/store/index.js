import Vue from "vue";
import Vuex from "vuex"
Vue.use(Vuex);

const state = {
  userRight:""  ,//题库管理内的题目类型
};


const mutations ={
  //设置题目数量
  setUserRight:function (state,value) {
    state.userRight=value
  },
};

const store = new Vuex.Store({
  state,mutations
});

export default store
