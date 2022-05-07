<template>
  <div class="user-center clearfix">
    <van-nav-bar title="个人中心" class="nav-bar" :border="false" fixed></van-nav-bar>
    <div class="navbar-height"></div>
    <!------------------------------------ 个人信息 ----------------------------------->
    <div class="card" v-if="userInfo.id">
      <img class="headpic" :src="require(`@/assets/img/headpic-big-${userInfo.sex}.png`)" alt="头像" />
      <h3>图书馆借书证</h3>
      <span
        class="active"
        v-if="userInfo.readerflag == '3'"
        @click="$router.push('/exam')"
      >{{status}}</span>
      <span v-else>{{status}}</span>
    </div>
    <div class="user-info" v-if="userInfo.id">
      <!-- <h3>{{userInfo.name}}</h3> -->
      <van-row>
        <van-col span="12">
          <label>证件</label>
          <span>{{userInfo.readerid}}</span>
        </van-col>
        <van-col span="12">
          <label>条码</label>
          <span>{{userInfo.barcode}}</span>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <label>年级</label>
          <span>{{userInfo.grade}}</span>
        </van-col>
        <van-col span="12">
          <label>所属</label>
          <span>{{userInfo.dept}}</span>
        </van-col>
      </van-row>
      <van-row>
        <label>校区</label>
        <span>{{campusName}}</span>
      </van-row>
    </div>
    <!------------------------------------ 大事记 ----------------------------------->
    <div class="time">
      <h3>大事记</h3>
      <van-steps direction="vertical" :active="0" active-color="#3A78FC" active-icon="more">
        <van-step v-for="(item, index) in list" :key="index">
          <div class="time-content">
            <p class="time-time">{{item.time}}</p>
            <div class="line-card">
              <h3>{{item.title}}</h3>
              <p v-if="item.content">
                参加
                <strong>{{item.examName}}</strong>
                ，{{item.content}}
              </p>
            </div>
          </div>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLoginUserAllExamRecords } from '@/api/user'
export default {
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: mapState({
    userInfo: state => state.userInfo,
    campusList: state => state.campusList,
    status() {
      let flag = this.userInfo.readerflag
      let val = ''
      switch (flag) {
        case '0':
          val = '已注销'
          break
        case '1':
          val = '正常使用'
          break
        case '2':
          val = '已挂失'
          break
        case '3':
          val = '未激活，去考试'
          break
      }
      return val
    },
    campusName() {
      let campus = this.campusList.find(i => i.id == this.userInfo.campusId)
      return campus.name || '--'
    }
  }),
  methods: {
    // 获取登录人考试记录
    getLoginUserAllExamRecords() {
      this.loading = true
      getLoginUserAllExamRecords()
        .then(res => {
          this.loading = false
          if (res.code == '000000') {
            this.list = res.data || {}
            this.list.forEach(i => {
              this.$set(i, 'time', this.common.defaultTimeFormat(i.examTime))
              this.$set(i, 'title', i.examType == '1' ? '普通考试' : '闯关考试')
              let content = ''
              if (i.isPass == '1') {
                content = `恭喜通过考试，本次分数为${i.score}分。`
              } else {
                content = `遗憾未通过考试，本次分数为${i.score}分。`
              }
              this.$set(i, 'content', content)
            })
            this.list.sort((a, b) => b.examTime - a.examTime)
            this.list.push({
              time: this.common.defaultTimeFormat(this.userInfo.firstLoginTime),
              title: '初次登录系统'
            })
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  },
  created() {
    this.getLoginUserAllExamRecords()
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  width: 100%;
  padding: 0 45px;
}

.card {
  position: relative;
  width: 100%;
  height: 352px;
  background: url('~@/assets/img/card-bg.png') no-repeat;
  background-size: contain;
  padding: 148px 40px 40px;
  color: #ffffff;
  margin-top: 98px;
  margin-bottom: 40px;
  .headpic {
    position: absolute;
    top: -68px;
    left: 52px;
    width: 136px;
    height: 136px;
  }
  h3 {
    font-size: 40px;
    font-weight: 400;
    color: #ffffff;
    line-height: 56px;
    margin-bottom: 20px;
  }
  span {
    display: inline-block;
    line-height: 40px;
    padding: 24px 60px;
    text-align: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 44px;
    &.active {
      background: #ffffff;
      color: #3a78fc;
      cursor: pointer;
    }
  }
}

.user-info {
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 10px;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 400;
  color: #1f232f;
  line-height: 40px;
  label {
    color: #1f232f;
    margin-right: 24px;
  }
  span {
    color: #999999;
  }
  .van-row {
    margin-bottom: 30px;
  }
}
.time {
  margin-bottom: 60px;
  h3 {
    font-size: 36px;
    line-height: 50px;
    margin-bottom: 30px;
  }
  .time-time {
    font-size: 24px;
    font-weight: 400;
    color: #999999;
    line-height: 32px;
    margin-bottom: 20px;
  }
  .line-card {
    background: #f3f5f9;
    border-radius: 10px;
    padding: 30px 40px;
    h3 {
      font-size: 32px;
      line-height: 45px;
      margin-bottom: 20px;
      color: #333333;
    }
    p {
      font-size: 28px;
      color: #1f232f;
      line-height: 42px;
    }
    strong {
      font-weight: 400;
      color: #3a78fc;
    }
  }
}
</style>