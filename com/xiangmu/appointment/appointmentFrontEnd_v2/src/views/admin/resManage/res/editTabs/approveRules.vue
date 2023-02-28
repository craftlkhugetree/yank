<template>
  <div class="main">
    <!--------------------------- 审核层级 --------------------------->
    <div class="item">
      <h3 class="title">审核层级</h3>
      <div class="content approve-content">
        <el-button type="primary" size="small" @click="addLevel">添加审核层级</el-button>
        <el-timeline class="approve-timeline">
          <el-timeline-item v-for="(item, index) in list" :key="index">
            <div class="approve-timeline-item">
              <h3>第{{item.order}}步</h3>
              <el-input v-model="item.name" placeholder="请输入审批环节名称" size="small"></el-input>
              <el-select
                v-model="item.users"
                multiple
                filterable
                remote
                placeholder="请输入审批人员姓名或工号查询"
                :remote-method="remoteMethod"
                :loading="userloading"
                value-key="ID"
                size="small"
                no-data-text="该用户不存在或不是审核领导"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="{ID:item.ID,NAME:item.NAME}"
                >
                  <span>{{item.NAME + '--' + item.ID}}</span>
                </el-option>
              </el-select>
              <span class="tip">
                <i class="el-icon-warning"></i>
                或签（一名审批人同意或拒绝即可）
              </span>
              <el-button
                v-if="index == list.length-1"
                type="danger"
                size="small"
                @click="deleteLevel(index)"
              >删除该步骤</el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!--------------------------- 审核超时 --------------------------->
    <div class="item">
      <h3 class="title">审核超时</h3>
      <div class="content approve-content">
        资源使用时间开始前
        <el-input-number
          controls-position="right"
          v-model.number="timeOut"
          size="small"
          style="width:80px;margin:0 10px;"
          :min="0"
        ></el-input-number>分钟未审核，则默认审核不通过
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserList } from "@/api/admin/roles";
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      timeOut: 0,
      list: [],
      userloading: false,
      userList: []    // 用户列表
    };
  },
  watch: {
    resDetail() {
      this.setList();
    },
    timeOut() {
      this.list.forEach(i => {
        i.timeout = this.timeOut;
      })
    }
  },
  methods: {
    // 添加审核层级
    addLevel() {
      let obj = {
        order: this.list.length + 1,
        name: null,
        timeout: this.timeOut,
        users: []
      };
      this.list.push(obj);
    },
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let data = {
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            KEYWORD: query,
            ROLEID: "9200001-3" 
          })
        };
        fetchUserList(data)
          .then(res => {
            this.userloading = false;
            this.userList = res.items;
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 删除审核层级
    deleteLevel(index) {
      this.list.splice(index, 1);
    },
    // 初始化数据
    setList() {
      let data = this.resDetail.approves;
      this.timeOut = data[0] ? data[0].timeout : 0;
      let arr = [];
      this.list = data.map(i => {
        let ids = i.userids ? i.userids.split(",") : [];
        let names = i.usernames ? i.usernames.split(",") : [];
        let users = [];
        if (ids.length > 0) {
          ids.forEach((j, index) => {
            let obj = {
              ID: j,
              NAME: names[index]
            };
            users.push(obj);
            arr.push(obj);
          });
        }
        return {
          order: i.order,
          name: i.name,
          timeout: i.timeOut,
          users: users
        };
      });
      this.list.sort((a, b) => {
        return a.order > b.order ? 1 : -1;
      });
      this.userList = arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding: 5px 0;
}
.item {
  margin-bottom: 30px;
  .title {
    font-size: 16px;
    color: #474d51;
    line-height: 22px;
    position: relative;
    padding: 0 0 10px 36px;
    border-bottom: 1px dashed #dbdbdb;
    &::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border: 4px solid #3f86f7;
      border-radius: 8px;
      position: absolute;
      left: 10px;
      top: 3px;
    }
  }
}
.content {
  padding: 20px 10px;
}
.approve-timeline {
  margin: 20px 0 0 4px;
  .el-timeline-item {
    padding-bottom: 10px;
  }
  .approve-timeline-item {
    h3 {
      font-size: 14px;
      color: #7d7d80;
      font-weight: 400;
      margin-bottom: 10px;
    }
    .el-input,
    .el-select {
      width: 300px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .el-input,
    .el-button {
      display: block;
    }
  }
}
.tip {
  display: inline-block;
  min-width: 200px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  i {
    color: #3f86f7;
    font-size: 14px;
  }
}
</style>