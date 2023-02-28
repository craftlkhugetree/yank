
<template>
  <div class="section">
    <div class="taskinfo clearfix">
      <p class="title">
        <span class="titletext">监督查询</span>
        <span class="tasktime clearcond" @click="clearconds">
          <el-divider direction="vertical"></el-divider>
          <i class="iconfont iconxiangpi_huaban1"></i>
          清空条件
        </span>
        <span class="tasktime clearcond exportresult" @click="exportResult">
          <i class="el-icon-upload2"></i>
          导出数据
        </span>
        <span class="tasktime">条</span>
        <span class="tasktime num">{{ total }}</span>
      </p>
      <!-- 时间筛选 -->
      <div style="margin-bottom:15px;">
        <label slot="label">提问时间：</label>
        <el-date-picker
          v-model="createTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          size="small"
          style="width:206px;margin-right:5px;"
          @change="search(1,size,false)"
        ></el-date-picker>
        <label slot="label">回复时间: </label>
        <el-date-picker
          v-model="handleTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          size="small"
          style="width:206px;margin-right:5px;"
          @change="search(1,size,false)"
        ></el-date-picker>
        <label slot="label">提问人角色: </label>
        <el-select
          v-model="roleIds"
          class="role-select"
          popper-class="role-select-popper"
          size="small"
          style="width:145px;"
          clearable
          multiple
          @change="search(1,size,false)"
        >
          <el-option v-for="item in roleList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
      </div>
      <div class="searchconditions">
        <div class="keywordinput">
          关键字：
          <el-input
            class="input"
            v-model="input"
            size="small"
            placeholder="请输入关键字查询"
            @keypress.native.enter="inputSearch"
          ></el-input>
          <el-button
            class="searchbtn"
            size="small"
            icon="el-icon-search"
            type="primary"
            @click="inputSearch"
          ></el-button>
        </div>
        <el-form label-width="75px" label-position="left">
          <el-form-item>
            <label slot="label">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</label>
            <div class="types" :class="{ selected: typesAll }" @click="selectAllType">全部</div>
            <div
              class="types"
              :class="{ selected: item.selected }"
              v-for="(item, index) in types"
              :key="item.id"
              @click="multSelected(index, 'types')"
            >{{ item.name }}</div>
          </el-form-item>
          <el-form-item label="回复状态:">
            <div class="types" :class="{ selected: repliedAll }" @click="selectAllReplied">全部</div>
            <div
              class="types"
              :class="{ selected: item.selected }"
              v-for="(item, index) in replied"
              :key="item.id"
              @click="multSelected(index, 'replied')"
            >{{ item.name }}</div>
          </el-form-item>

          <el-form-item label="业务领域:">
            <div class="types" :class="{ selected: rangesAll }" @click="selectAllRanges">全部</div>
            <div
              class="types"
              :class="{ selected: item.selected }"
              v-for="(item, index) in ranges"
              :key="item.ID"
              @click="changeDepts(index)"
            >{{ item.NAME }}</div>
          </el-form-item>
          <div class="seccods" v-show="(replied[1].selected || replied[2].selected) && !rangesAll">
            <el-form label-width="75px" label-position="right">
              <el-form-item>
                <label slot="label">区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域：</label>
                <div
                  class="sectypes"
                  :class="{ selected: item.selected }"
                  v-for="(item, index) in areas"
                  :key="item.id"
                  @click="multSelected(index, 'areas')"
                >{{ item.name }}</div>
              </el-form-item>
              <el-form-item label="问题分类:">
                <div
                  class="sectypes"
                  :class="{ selected: item.selected }"
                  v-for="(item, index) in taskTypes"
                  :key="item.id"
                  @click="multSelected(index, 'taskTypes')"
                >{{ item.name }}</div>
              </el-form-item>
            </el-form>
          </div>
          <el-form-item v-show="replied[2].selected" label="评价星级:">
            <div class="types" :class="{ selected: rateAll }" @click="selectAllRate">全部</div>
            <div
              class="types"
              :class="{ selected: item.selected }"
              v-for="(item, index) in rate"
              :key="item.id"
              @click="multSelected(index, 'rate')"
            >{{ item.name }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="resultslist">
        <empty v-if="!results.length"></empty>
        <div class="taskitems" v-for="item in results" :key="item.id">
          <taskItem :showApplyer="true" :info="item"></taskItem>
          <div v-if="item.lastEvent" class="infos">
            <p class="transferInfo">
              <span class="item orgname">
                {{
                util.formatTime(item.lastEvent.time, "YYYY-MM-DD HH:mm")
                }}
              </span>
              <span class="item orgname">
                {{ item.lastEvent.name }} 转移至
                {{ item.lastEvent.dept }}
              </span>
            </p>
            <p class="transferInfo">
              <span class="label">转移说明：</span>
              <span class="item">{{ item.lastEvent.note }}</span>
            </p>
          </div>
          <replyItem v-if="item.handletime" :info="item" class="replyitem"></replyItem>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="size"
          :page-sizes="[10, 15, 20]"
          :current-page.sync="page"
          @current-change="(page) => search(page, size, false)"
          @size-change="(size) => search(page, size, false)"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import empty from "../../components/emptyList";
import taskItem from "../supervision/taskItem";
import replyItem from "../reply/replyItem";
export default {
  components: { empty, taskItem, replyItem },
  data() {
    return {
      total: 0,
      page: 1,
      size: 10,
      createTime: null,
      handleTime: null,
      roleList: [],
      roleIds: [],
      input: "",
      types: [],
      typesAll: true,
      ranges: [],
      rangesAll: true,
      areas: [],
      taskTypes: [],
      results: [],
      replied: [
        { id: 1, name: "未回复", selected: false },
        { id: 2, name: "已回复", selected: false },
        { id: 3, name: "已评价", selected: false }
      ],
      repliedAll: true,
      rate: [
        { id: 1, name: "1星", selected: false },
        { id: 2, name: "2星", selected: false },
        { id: 3, name: "3星", selected: false },
        { id: 4, name: "4星", selected: false },
        { id: 5, name: "5星", selected: false }
      ],
      rateAll: true
    };
  },
  methods: {
    selectAllRanges() {
      this.rangesAll = true;
      _.forEach(this.ranges, item => {
        item.selected = false;
      });
      this.page = 1;
      this.search(1, this.size, true);
    },
    selectAllRate() {
      this.rateAll = true;
      _.forEach(this.rate, item => {
        item.selected = false;
      });
      this.page = 1;
      this.search(1, this.size, true);
    },
    selectAllReplied() {
      this.repliedAll = true;
      _.forEach(this.replied, item => {
        item.selected = false;
      });
      this.page = 1;
      this.search(1, this.size, true);
    },
    selectAllType() {
      this.typesAll = true;
      _.forEach(this.types, item => {
        item.selected = false;
      });
      this.page = 1;
      this.search(1, this.size, true);
    },
    //还原初始选择条件
    clearconds() {
      this.createTime = null;
      this.handleTime = null;
      this.roleIds = [];
      this.typesAll = true;
      this.repliedAll = true;
      this.rateAll = true;
      this.rangesAll = true;
      this.input = "";
      _.forEach(this.types, item => {
        item.selected = false;
      });
      _.forEach(this.ranges, item => {
        item.selected = false;
      });
      _.forEach(this.replied, item => {
        item.selected = false;
      });
      _.forEach(this.areas, item => {
        item.selected = false;
      });
      _.forEach(this.taskTypes, item => {
        item.selected = false;
      });
      // this.changeDepts(0);
      _.forEach(this.rate, item => {
        item.selected = false;
      });
      this.page = 1;
      this.search(1, this.size, true);
    },
    //选择服务类型，可多选
    multSelected(index, key) {
      let typekey = key === "areas" || key === "taskTypes";
      //只有问题和问题类型可以多选
      if (!typekey) {
        let oldData = _.cloneDeep(this[key]);
        _.forEach(oldData, item => {
          item.selected = false;
        });
        oldData[index].selected = true;
        this[key] = oldData;
        this[`${key}All`] = false;
      } else {
        let oldData = _.cloneDeep(this[key]);
        oldData[index].selected = !oldData[index].selected;
        this[key] = oldData;
      }
      this.page = 1;
      this.search(this.page, this.size, typekey);
    },
    //切换业务领域，这样区域问题类型都要换
    changeDepts(index) {
      let depts = _.cloneDeep(this.ranges);
      _.forEach(depts, (dept, deptIndex) => {
        if (deptIndex === index) {
          dept.selected = true;
        } else {
          dept.selected = false;
        }
      });
      this.ranges = depts;
      this.rangesAll = false;
      this.page = 1;
      this.search(this.page, this.size, false);
      this.getAreaAndType();
    },
    inputSearch() {
      this.page = 1;
      this.search(this.page, this.size, true);
    },
    exportResult() {
      let searchData = {
        filter: {
          keyword: this.input || null,
          types: "",
          applystatus: "",
          handledeptids: "",
          markscore: "",
          starttime: this.createTime ? this.createTime[0] + "000000" : null,
          endtime: this.createTime ? this.createTime[1] + "235959" : null,
          handlestarttime: this.handleTime
            ? this.handleTime[0] + "000000"
            : null,
          handleendtime: this.handleTime ? this.handleTime[1] + "235959" : null,
          roleids: this.roleIds.join(",") || null
        },
        limit: 0,
        page: 0
      };
      //获取选中的类型
      let types = [];
      _.forEach(this.types, type => {
        type.selected && types.push(type.type);
      });
      searchData.filter.types = this.typesAll ? null : types.join(",");

      let applystatus = [];
      _.forEach(this.replied, reply => {
        reply.selected && applystatus.push(reply.id);
      });
      searchData.filter.applystatus = this.repliedAll
        ? null
        : applystatus.join(",");
      let markscore = [];
      _.forEach(this.rate, rate => {
        rate.selected && markscore.push(rate.id);
      });
      searchData.filter.markscore = markscore.length
        ? markscore.join(",")
        : null;

      //获取选中的业务领域
      _.forEach(this.ranges, item => {
        if (item.selected) {
          searchData.filter.handledeptids = item.ID;
        }
      });
      searchData.filter.handledeptids = this.rangesAll
        ? null
        : searchData.filter.handledeptids;
      if (
        (this.replied[1].selected || this.replied[2].selected) &&
        !this.rangesAll
      ) {
        let areas = [];
        _.forEach(this.areas, area => {
          area.selected && areas.push(area.id);
        });
        searchData.filter.areaids = areas.length ? areas.join(",") : null;
        let taskType = [];
        _.forEach(this.taskTypes, type => {
          type.selected && taskType.push(type.id);
        });
        searchData.filter.questtypeids = taskType.length
          ? taskType.join(",")
          : null;
      }
      //判断回复状态的选择，取消一些请求参数
      if (!this.replied[2].selected) {
        delete searchData.filter.markscore;
      }
      if (!this.replied[1].selected) {
        delete searchData.filter.deptid;
        delete searchData.filter.areas;
        delete searchData.filter.questtypes;
      }
      // this.exportFormValue = JSON.stringify(searchData.filter);
      // this.$refs['exportform'].setAttribute('action',window.g.url + 'apply/exportApply');
      // this.$refs['exportform'].submit();
      // let formData = new FormData();
      // formData.append("filter", JSON.stringify(searchData.filter));
      // var httpRequest = new XMLHttpRequest();
      let IDSTGC = this.util.getCookieByName("IDSTGC");
      // httpRequest.open("POST", window.g.url + "apply/exportApply");
      // httpRequest.setRequestHeader("IDSTGC", IDSTGC);
      // httpRequest.send(formData);

      axios({
        url: window.g.url + "apply/exportApply",
        method: "post",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          IDSTGC: IDSTGC
        },
        data: qs.stringify({
          filter: JSON.stringify(searchData.filter)
        })
      })
        .then(response => {
          var filename = "服务监督查询单导出.xlsx"; //下载后文件名
          var blob = new Blob([response.data], {
            type: response.headers["content-type"]
          });
          var downloadElement = document.createElement("a");
          var href = URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = filename;
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(err => {});
    },
    search(page, size, flag) {
      //当flag为true的时候，需要搜索区域和问题类型。因为这两个在重新选择业务领域的时候回重新请求并且重置
      let searchData = {
        filter: {
          keyword: this.input || null,
          types: "",
          applystatus: "",
          handledeptids: "",
          markscore: "",
          starttime: this.createTime ? this.createTime[0] + "000000" : null,
          endtime: this.createTime ? this.createTime[1] + "235959" : null,
          handlestarttime: this.handleTime
            ? this.handleTime[0] + "000000"
            : null,
          handleendtime: this.handleTime ? this.handleTime[1] + "235959" : null,
          roleids: this.roleIds.join(",") || null
        },
        orderBy: "createtime",
        sort: "desc",
        limit: size,
        page: page
      };
      //获取选中的类型
      let types = [];
      _.forEach(this.types, type => {
        type.selected && types.push(type.type);
      });
      searchData.filter.types = this.typesAll ? null : types.join(",");

      let applystatus = [];
      _.forEach(this.replied, reply => {
        reply.selected && applystatus.push(reply.id);
      });
      searchData.filter.applystatus = this.repliedAll
        ? null
        : applystatus.join(",");
      let markscore = [];
      _.forEach(this.rate, rate => {
        rate.selected && markscore.push(rate.id);
      });
      searchData.filter.markscore = markscore.length
        ? markscore.join(",")
        : null;

      //获取选中的业务领域
      _.forEach(this.ranges, item => {
        if (item.selected) {
          searchData.filter.handledeptids = item.ID;
        }
      });
      searchData.filter.handledeptids = this.rangesAll
        ? null
        : searchData.filter.handledeptids;
      if (flag) {
        let areas = [];
        _.forEach(this.areas, area => {
          area.selected && areas.push(area.id);
        });
        searchData.filter.areaids = areas.length ? areas.join(",") : null;
        let taskType = [];
        _.forEach(this.taskTypes, type => {
          type.selected && taskType.push(type.id);
        });
        searchData.filter.questtypeids = taskType.length
          ? taskType.join(",")
          : null;
      }
      //判断回复状态的选择，取消一些请求参数
      if (!this.replied[2].selected) {
        delete searchData.filter.markscore;
      }
      if (!this.replied[1].selected) {
        delete searchData.filter.deptid;
        delete searchData.filter.areas;
        delete searchData.filter.questtypes;
      }
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: searchData
        })
        .then(res => {
          if (res.success) {
            this.total = res.total;
            _.forEach(res.data, item => {
              if (item.events.length) {
                item.lastEvent = {
                  name: `${item.events[0].creatername}(${item.events[0].createrid})`,
                  time: item.events[0].createtime,
                  note: item.events[0].note,
                  dept: item.events[0].handledeptname
                };
              }
              if (item.markscore) {
                item.markscore = parseInt(item.markscore);
              }
            });
            this.results = res.data;
          }
        });
    },
    getDept() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getList",
          data: {
            filter: JSON.stringify({
              APPID: this.$store.state.GROUPID
            }),
            limit: 10000,
            page: 1,
            ISDELETE: "0"
          }
        })
        .then(res => {
          this.ranges = _.map(res.items, (item, index) => {
            item.selected = false;
            return item;
          });
          //获取区域和问题类型
          this.search(this.page, this.size, true);
          this.getAreaAndType();
        });
    },
    getAreaAndType() {
      let selectedDeptid = "";
      _.forEach(this.ranges, item => {
        if (item.selected) {
          selectedDeptid = item.ID;
        }
      });

      this.util
        .postAjax({
          code: this.global.code,
          url: "/area/areas",
          isRep: true,
          data: {
            deptid: selectedDeptid
          }
        })
        .then(res => {
          if (res.success) {
            this.areas = _.map(res.data, (item, index) => {
              item.selected = false;
              return item;
            });
          }
        });
      this.util
        .postAjax({
          code: this.global.code,
          url: "/questtype/types",
          isRep: true,
          data: {
            deptid: selectedDeptid
          }
        })
        .then(res => {
          this.taskTypes = _.map(res.data, (item, index) => {
            item.selected = false;
            return item;
          });
        });
    },

    // 获取角色列表
    getRoleList() {
      this.util
        .postAjax({
          code: "auth",
          url: "rest/Role/list",
          data: {
            filter: JSON.stringify({
              ISUSE: 1,
              ISDELETE: 0,
              GROUPID: this.$store.state.GROUPID
            })
          }
        })
        .then(res => {
          this.roleList = res.items || [];
          // 去掉全校师生
          this.roleList = this.roleList.filter(i => i.ID !== "9100003-3");
          this.roleList.sort((a, b) => {
            if (a.CODE && b.CODE) {
              return a.ID > b.ID ? 1 : -1;
            } else if (a.CODE) {
              return -1;
            } else if (b.CODE) {
              return 1;
            }
          });
        });
    }
  },

  created() {
    this.types = _.cloneDeep(this.$store.state.serviceTypes);
    _.forEach(this.types, (type, index) => {
      type.selected = false;
    });
    this.getDept();
    this.getRoleList();
  }
};
</script>
<style lang='scss' scoped>
.exportresult {
  margin-left: 10px;
}
.title {
  border-bottom: #eeeeee 1px solid;
  line-height: 52px;
  height: 52px;
  margin-bottom: 20px;
}
.titletext {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
  line-height: 52px;
  height: 52px;
}
.tasktime {
  float: right;
  display: inline-block;
  line-height: 52px;
  height: 52px;

  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
}
.taskinfo {
  background: #fff;
  padding-left: 200px;
  padding-right: 200px;
  // margin-top: 20px;
  padding-bottom: 38px;
  padding-top: 10px;
}
.num {
  line-height: 52px;
  height: 52px;
  font-size: 16px;
  margin-right: 6px;
  font-weight: 600;
  color: #ff6f4b;
}
.seccods {
  margin-left: 75px;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 16px;
}
.searchconditions {
  border-bottom: 1px solid #eeeeee;
  & /deep/ .el-form-item {
    margin-bottom: 6px;
  }
}
.types {
  display: inline-block;
  margin-right: 10px;
  height: 32px;
  padding: 0 16px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  background: #f6f6f6;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 10px;
}
.types.selected {
  background: #e7eefe;
  background-color: rgba(231, 238, 254, 1);
  color: #3a78fc;
  background-image: url(../../../static/images/selected.png);
  background-repeat: no-repeat;
  background-position: right bottom;
}
.sectypes {
  display: inline-block;
  margin-right: 20px;
  height: 32px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  border-radius: 3px;
  cursor: pointer;
}
.sectypes.selected {
  color: #3a78fc;
}
.transferInfo {
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  margin-top: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}
.resultslist {
  padding: 20px 0;
}
.taskitems {
  margin-bottom: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.infos {
  margin-bottom: 10px;
}
.keywordinput {
  position: relative;
  // top: -50px;
  width: 260px;
  float: right;
  font-size: 14px;
  color: #606266;
  z-index: 200;
  & > .input {
    width: 159px;
  }
  & > .searchbtn {
    width: 32px;
    padding: 9px 7px;
    position: relative;
    left: -7px;
  }
}
.pagination-box {
  margin-top: 20px;
  float: right;
}
.clearcond {
  font-weight: 400;
  color: #999999;
  font-size: 12px;
  cursor: pointer;
}
.searchconditions {
  & /deep/ .el-form-item__label {
    height: 32px;
    line-height: 32px;
  }
  & /deep/ .el-form-item__content {
    line-height: 32px;
  }
}
.replyitem {
  margin-top: 20px;
}
.section {
  // width: 1200px;
  margin: 0 auto;
}
</style>

<style>
.role-select .el-select__tags {
  display: block;
  overflow: hidden;
  white-space: nowrap;
}
.role-select-popper .el-select-dropdown__item {
  padding: 0 10px;
}
.role-select-popper .el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 10px;
}

</style>