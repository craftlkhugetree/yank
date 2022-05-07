<template>
  <div class="user-center clearfix">
    <!------------------------------------ 左侧 ----------------------------------->
    <div class="left">
      <div class="user-info bg">
        <img :src="require(`@/assets/img/headpic-big-${userInfo.sex}.png`)" alt="头像" />
        <h3>{{userInfo.name}}</h3>
        <div class="info">
          <p>
            <label>证件</label>
            <span>{{userInfo.readerid}}</span>
          </p>
          <p>
            <label>条码</label>
            <span>{{userInfo.barcode}}</span>
          </p>
          <p>
            <label>所属</label>
            <span>{{userInfo.dept}}</span>
          </p>
          <p>
            <label>年级</label>
            <span>{{userInfo.grade}}</span>
          </p>
          <p>
            <label>校区</label>
            <span>{{campusName}}</span>
          </p>
        </div>
      </div>
      <div class="card">
        <h3>图书馆借书证</h3>
        <span class="active" v-if="userInfo.readerflag == '3'" @click="$router.push('/exam')">{{status}}</span>
        <span v-else>{{status}}</span>
      </div>
    </div>
    <!------------------------------------ 右侧 ----------------------------------->
    <div class="right bg">
      <img src="@/assets/img/center-bg.png" alt />
      <h3>大事记</h3>
      <div v-loading="loading">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in list"
            :key="index"
            :timestamp="item.time"
            size="large"
            :color="index == 0 ? '#3A78FC' : '#C8D8FD'"
            placement="top"
          >
            <div class="line-card">
              <h3>{{item.title}}</h3>
              <p v-if="item.content">
                参加
                <strong>{{item.examName}}</strong>
                ，{{item.content}}
              </p>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
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
  width: 1200px;
  margin: 20px auto;
  padding-bottom: 40px;
}
.bg {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 8px;
  border: 1px solid #e5e8ed;
}
.left {
  float: left;
  width: 300px;
}
.right {
  float: right;
  width: 880px;
}
h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  line-height: 28px;
}
.user-info {
  margin-bottom: 20px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin: 40px 80px 20px;
  }
  h3 {
    margin-bottom: 30px;
    text-align: center;
  }
  .info {
    background: #f3f5f9;
    border-radius: 5px;
    padding: 20px 30px 10px;
    font-size: 14px;
    font-weight: 400;
    color: #1f232f;
    line-height: 20px;
    p {
      margin-bottom: 10px;
    }
    label {
      color: #1f232f;
      margin-right: 20px;
    }
    span {
      color: #999999;
    }
  }
}
.card {
  width: 300px;
  height: 160px;
  background: url('~@/assets/img/card-bg.png');
  padding: 50px 30px 30px;
  color: #ffffff;
  h3 {
    color: #ffffff;
    margin-bottom: 20px;
  }
  span {
    display: inline-block;
    line-height: 20px;
    padding: 6px 32px;
    text-align: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    &.active {
      background: #ffffff;
      color: #3a78fc;
      cursor: pointer;
    }
  }
}
.right {
  img {
    width: 840px;
    height: 180px;
  }
  h3 {
    margin: 20px 0;
  }
  .el-timeline {
    padding: 0 10px 20px 24px;
  }
  .line-card {
    background: #f3f5f9;
    border-radius: 5px;
    padding: 0 20px 12px;
    h3 {
      font-size: 16px;
      line-height: 22px;
      padding: 20px 0 10px;
      margin: 0;
    }
    p {
      color: #1f232f;
      line-height: 28px;
    }
    strong {
      font-weight: 400;
      color: #3a78fc;
    }
  }
}
</style>
<style lang="scss">
.user-center .el-timeline-item__tail {
  left: 3px;
  border-left: 4px solid #f3f5f9;
}
</style>