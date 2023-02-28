import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { fetchGoodsList } from '@/api/queuing'
import { fetchLocationList } from '@/api/ghhw'

export default new Vuex.Store({
  state: {
    goodsList: [],     // 物料列表
    locationList: [],  // 罐号列表
    cardtypeList: [
      {id: "2", name: "人工开卡"},
      {id: "1", name: "自助开卡"},
    ]
  },
  getters: {
  },
  mutations: {
    setGoodsList(state, data) {
      state.goodsList = data
    },
    setLocationList(state, data) {
      state.locationList = data
    }
  },
  actions: {
    // 获取物料列表
    getGoodsList({ commit }) {
      return new Promise((resolve, reject) => {
        fetchGoodsList().then(res => {
          if(res.code == "000000") {
            let data = res.data || []
            commit("setGoodsList", data);
            resolve(data)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取罐号列表
    getLocationList({ commit }) {
      return new Promise((resolve, reject) => {
        fetchLocationList().then(res => {
          if(res.code == "000000") {
            let data = res.data || []
            commit("setLocationList", data);
            resolve(data)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  modules: {
  }
})
