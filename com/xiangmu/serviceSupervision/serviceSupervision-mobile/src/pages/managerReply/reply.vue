<template>
  <div>
    <transition name="slide-left" mode="out-in">
      <div class="replyInfo" v-show="nowPage === 'forms'">
        <van-nav-bar title="回复" left-arrow fixed @click-left="goback" />
        <div style="width:100%;height:46px;"></div>
        <h1 class="title">
          <span class="tasktype">{{ common.typeFormat(taskInfo.type) }}</span>
          {{ taskInfo.title }}
        </h1>
        <div class="content">
          <p class="applyer-info">
            <span>提问人: {{ taskInfo.applyername }}({{ taskInfo.applyerid }})</span>
            <span style="float:right;">联系方式: {{ taskInfo.applyermobile || "--" }}</span>
          </p>
          <div class="contenttext">{{ taskInfo.content }}</div>
          <div class="attaches">
            <img v-for="item in imgUrls" @click="imgShow = true" :key="item" :src="item" alt />
            <van-image-preview v-model="imgShow" :images="imgUrls"></van-image-preview>
          </div>
          <span class="dept">{{taskInfo.handledeptname}}</span>
          <span
            class="createtimes"
            v-if="taskInfo.createtime"
          >{{ util.formatTime(taskInfo.createtime, "YYYY-MM-DD hh:mm") }}</span>
        </div>
        <div class="transferInfo" v-if="taskInfo.lastEvent">
          <p class="tranlabel">转移人：{{ taskInfo.lastEvent.name }}</p>
          <p
            class="tranlabel"
            v-if="taskInfo.lastEvent.time"
          >转移时间：{{ util.formatTime(taskInfo.lastEvent.time, "YYYY-MM-DD hh:mm") }}</p>
          <p>转移说明：{{ taskInfo.lastEvent.note }}</p>
        </div>
        <h1 class="replytitle">回复</h1>
        <div class="replyformarea">
          <van-form ref="replyform" :show-error-message="false">
            <van-field
              readonly
              :border="false"
              name="areaids"
              :value="replyForm.areaids"
              label="区域"
              :required="true"
              :rules="[{ required: areas.length > 0, message: '请选择区域' }]"
            />
            <div class="multselects">
              <div
                v-for="(item, index) in areas"
                :key="item.id"
                @click="selectType(index, 'areas')"
                :class="{ selected: item.checked }"
              >{{ item.name }}</div>
              <div v-if="areas.length === 0">暂无</div>
            </div>

            <van-field
              :border="false"
              readonly
              name="questtypeids"
              :value="replyForm.questtypeids"
              label="问题分类"
              :required="true"
              :rules="[{ required: types.length > 0, message: '问题分类' }]"
            />
            <div class="multselects">
              <div
                v-for="(item, index) in types"
                :key="item.id"
                @click="selectType(index, 'types')"
                :class="{ selected: item.checked }"
              >{{ item.name }}</div>
              <div v-if="types.length === 0">暂无</div>
            </div>
            <van-field
              :border="false"
              readonly
              name="note"
              type="textarea"
              label="回复内容"
              v-model="replyForm.note"
              :required="true"
              :rules="[{ required: true, message: '请输入回复' }]"
            />

            <div class="quickreplies">
              <div v-for="item in simpleReplies" :key="item.id" @click="useReply(item.content)">
                <span class="quicklab">#</span>
                {{ item.title }}
              </div>
              <div class="morequick" @click="showmore">更多快捷</div>
            </div>
            <van-field
              :border="false"
              name="note1"
              class="notearea"
              type="textarea"
              :rows="6"
              v-model="replyForm.note"
            />
            <van-field name="isopen" label="是否公开" input-align="right" :required="true">
              <template #input>
                <van-switch
                  active-value="1"
                  inactive-value="0"
                  v-model="replyForm.isopen"
                  size="20"
                />
              </template>
            </van-field>
            <van-field>
              <template #input>
                <div class="upload" v-if="imgLoading">
                  <van-loading type="spinner" size="20" />
                </div>
                <div class="upload-imgs" v-for="(item, index) in replyAttaches" :key="item">
                  <img :src="item.url" alt />
                  <van-icon name="cross" @click="deletePhoto(index)"></van-icon>
                </div>
                <div class="upload" @click="upload" v-if="!imgLoading && replyAttaches.length < 3">
                  <van-icon name="plus"></van-icon>
                  <p>上传图片</p>
                </div>
              </template>
            </van-field>
          </van-form>
        </div>
        <div class="submitbtn">
          <van-button icon="checked" :loading="loading" block type="info" @click="submit">回 复</van-button>
        </div>
        <upload
          v-show="false"
          :multiple="false"
          :size="5120"
          exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
          @choose="imgLoading = true"
          @done="uploaded"
          :url="$store.state.uploadUrl"
          ref="upload"
        ></upload>
      </div>
    </transition>
    <!-- 快捷回复页面 -->
    <transition name="slide-left" mode="out-in">
      <div class="quickreplieslist" v-show="nowPage === 'replys'">
        <van-nav-bar title="回复" left-arrow fixed @click-left="switchPage" />
        <div style="width:100%;height:46px;"></div>
        <van-tabs class="tabs" v-model="quickTab">
          <van-tab title="快捷回复">
            <transition name="slide-right" mode="out-in">
              <div class="quiclreplylist" v-if="quickTab == 0">
                <p
                  class="replys"
                  @click="useReply(item.content)"
                  v-for="item in quickReplies"
                  :key="item.id"
                >
                  <span class="quicklab">#</span>
                  {{ item.title }}
                </p>
              </div>
            </transition>
          </van-tab>
          <van-tab title="历史回复">
            <transition name="slide-left" mode="out-in">
              <div v-if="quickTab == 1">
                <div class="searchinput">
                  <van-field
                    class="inputs"
                    v-model="historySearchInput"
                    @keypress.native.enter="historySearch()"
                    placeholder="请输入关键词查询"
                    left-icon="search"
                  />
                </div>
                <div class="quiclreplylist">
                  <p
                    class="replys"
                    @click="useReply(item.content)"
                    v-for="item in historyReplies"
                    :key="item.id"
                  >{{ clipscontent(item.content) }}</p>
                </div>
              </div>
            </transition>
          </van-tab>
        </van-tabs>
      </div>
    </transition>
  </div>
</template>

<script>
import { Notify } from "vant";
import upload from "../../components/BaseUpload";
export default {
  data() {
    return {
      quickTab: 0,
      nowPage: "forms",
      loading: false,
      handledeptid: "",
      replyForm: {
        areaids: "",
        questtypeids: "",
        note: "",
        isopen: "1",
        attch: "",
        applyid: "",
        version:""
      },
      imgLoading: false,
      replyAttaches: [],
      imgUrls: [],
      imgShow: false,
      taskInfo: {
        type: 0,
        title: "",
        content: "",
        createtime: "",
        handledeptname: "",
        lastEvent: {}
      },
      //区域和问题类型
      areas: [],
      types: [],
      //快捷回复栏目

      fast: "quick",
      //   快捷回复
      quickReplies: [],
      // 历史回复
      historySearchInput: "",
      historyReplies: []
    };
  },
  components: { upload },
  computed: {
    simpleReplies() {
      let replies = _.cloneDeep(this.quickReplies);
      return replies.splice(0, 6);
    }
  },
  methods: {
    submit() {
      if (this.loading) {
        return false;
      }
      this.$refs["replyform"].validate().then(res => {
        if (res) {
          return false;
        }
        this.loading = true;
        //组装数据
        let replyData = {
          applyid: this.replyForm.applyid,
          version: this.replyForm.version,
          isopen: this.replyForm.isopen,
          note: this.replyForm.note,
          attch: ""
        };
        if (this.replyAttaches.length) {
          let attch = [];
          _.forEach(this.replyAttaches, attaches => {
            attch.push(attaches.id);
          });
          replyData.attch = attch.join(",");
        }
        let areas = [];
        _.forEach(this.areas, area => {
          if (area.checked) areas.push(area);
        });
        replyData.areas = areas;
        let questtypes = [];
        _.forEach(this.types, type => {
          if (type.checked) questtypes.push(type);
        });
        replyData.questtypes = questtypes;
        // return
        this.util
          .postAjax({
            code: this.global.code,
            url: "/apply/handle",
            isRep: true,
            data: replyData
          })
          .then(res => {
            if (res.success) {
              Notify({ type: "success", message: "回复成功" });
              //保存历史回答
              this.util
                .postAjax({
                  code: this.global.code,
                  url: "/historyanswer/save",
                  isRep: true,
                  data: {
                    content: this.replyForm.note,
                    deptid: this.handledeptid
                    // deptid: JSON.parse(sessionStorage.getItem("userInfo"))
                    // .userOrgId,
                  }
                })
                .then(res => {});
              setTimeout(() => {
                history.go(-1);
              }, 1500);
            } else {
              this.loading = false;
              Notify({ type: "danger", message: res.data.message });
            }
          });
      });
    },
    clipscontent(text) {
      if (text.length > 62) {
        return text.substring(0, 62) + "...";
      } else {
        return text;
      }
    },
    goback() {
      history.go(-1);
    },
    deletePhoto(index) {
      this.replyAttaches.splice(index, 1);
    },
    // 上传图片
    upload() {
      this.$refs["upload"].toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.replyAttaches.length < 3) {
        this.replyAttaches.unshift({
          url: this.$store.state.fileUrl + res.data[0].ID,
          id: res.data[0].ID
        });
      } else {
        this.$toast.fail("上传失败！");
      }
    },
    selectType(index, kind) {
      let oldData = _.cloneDeep(this[kind][index]);
      oldData.checked = !oldData.checked;
      this.$set(this[kind], index, oldData);
      if (kind === "areas") {
        let areaids = [];
        _.forEach(this[kind], item => {
          if (item.checked) areaids.push(item.id);
        });
        this.replyForm.areaids = areaids.join(",");
      }
      if (kind === "types") {
        let questtypeids = [];
        _.forEach(this[kind], item => {
          if (item.checked) questtypeids.push(item.id);
        });
        this.replyForm.questtypeids = questtypeids.join(",");
      }
    },
    //获取任务信息
    getTaskInfos() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/findById?id=" + this.$route.params.id,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            let taskInfos = res.data;
          if(taskInfos.version!=this.replyForm.version){
            Notify({ type: "primary", message: "本条数据已被他人处理！" });
            setTimeout(() => {
              history.go(-1);
            }, 500);
            return true;

          }
            this.replyForm.version = taskInfos.version;
            // 获取部门
            this.handledeptid = taskInfos.handledeptid;
            //获取任务细节
            this.taskInfo = {
              type: taskInfos.type,
              title: taskInfos.title,
              content: taskInfos.content,
              createtime: taskInfos.createtime,
              handledeptname: taskInfos.handledeptname,
              applyerid: taskInfos.applyerid,
              applyermobile: taskInfos.applyermobile,
              applyername: taskInfos.applyername
              //   lastEvent: {
              //     time: "",
              //   },
            };
            if (taskInfos.photos) {
              let photo = taskInfos.photos.split(",");
              _.forEach(photo, img => {
                this.imgUrls.push(this.$store.state.fileUrl + "/" + img);
              });
            }
            if (taskInfos.events && taskInfos.events.length > 0) {
              this.taskInfo.lastEvent = {
                name: `${taskInfos.events[0].creatername}(${taskInfos.events[0].createrid})`,
                time: taskInfos.events[0].createtime,
                note: taskInfos.events[0].note
              };
            }
            //获取区域和问题类型
            this.util
              .postAjax({
                code: this.global.code,
                url: "/area/areas",
                isRep: true,
                data: {
                  deptid: taskInfos.handledeptid
                }
              })
              .then(res => {
                if (res.success) {
                  let taskareas = taskInfos.areaids
                    ? taskInfos.areaids.split(",")
                    : [];
                  let data = res.data.filter(i => i.isuse == "1");
                  this.areas = _.map(data, area => {
                    area.checked = taskareas.indexOf(area.id) !== -1;
                    return area;
                  });
                }
              });
            this.util
              .postAjax({
                code: this.global.code,
                url: "/questtype/types",
                isRep: true,
                data: {
                  deptid: taskInfos.handledeptid
                }
              })
              .then(res => {
                let tasktypes = taskInfos.questtypeids
                  ? taskInfos.questtypeids.split(",")
                  : [];
                let data = res.data.filter(i => i.isuse == "1");
                this.types = _.map(data, type => {
                  type.checked = tasktypes.indexOf(type.id) !== -1;
                  return type;
                });
              });
            //获取以回复的信息
            if (taskInfos.handletime) {
              this.replyForm = {
                areaids: taskInfos.areaids,
                questtypeids: taskInfos.questtypeids,
                note: taskInfos.handlenote,
                isopen: taskInfos.isopen,
                applyid: taskInfos.id,
                version:taskInfos.version
              };
              if (taskInfos.handleattch) {
                let attachids = taskInfos.handleattch.split(",");
                _.forEach(attachids, id => {
                  this.replyAttaches.push({
                    url: this.$store.state.fileUrl + id,
                    id: id
                  });
                });
              }
            }
            this.getQuickReplies();
            this.historySearch();
          }
        });
    },
    switchPage() {
      this.nowPage = "forms";
    },
    useReply(content) {
      this.replyForm.note = content;
      if (this.nowPage === "replys") {
        this.switchPage();
      }
    },
    showmore() {
      this.nowPage = "replys";
    },
    // 搜索历史回答
    historySearch() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/historyanswer/historyanswers",
          isRep: true,
          data: {
            content: this.historySearchInput || null,
            deptid: this.handledeptid
            // deptid: JSON.parse(sessionStorage.getItem("userInfo")).userOrgId,
          }
        })
        .then(res => {
          if (res.success) {
            this.historyReplies = res.data;
          }
        });
    },
    //获取快速回复内容
    getQuickReplies() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/quickanswer/quickanswers",
          isRep: true,
          data: {
            deptid: this.handledeptid
          }
        })
        .then(res => {
          if (res.success) {
            this.quickReplies = res.data;
          }
        });
    }
  },
  created() {
    this.replyForm.applyid = this.$route.params.id;
    this.replyForm.version = this.$route.params.version;
    this.getTaskInfos();
  }
};
</script>
<style lang='scss' scoped>
.title {
  margin-top: 6px;
  margin-bottom: 1px;
  background-color: #fff;
  padding: 15px;
  line-height: 22px;
  font-size: 14px;
  color: #2a2e2e;
  font-weight: 600;
  .tasktype {
    font-size: 12px;
    display: inline-block;
    width: 40px;
    height: 20px;
    line-height: 22px;
    background: #ff6f4b;
    border-radius: 3px;
    color: #fff;
    text-align: center;
    margin-right: 8px;
  }
}
.content {
  padding: 12px 16px;
  background-color: #fff;
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 21px;
}
.applyer-info {
  font-size: 12px;
  color: #999999;
  margin-bottom: 6px;
}
.attaches {
  margin-top: 12px;
  img {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-right: 8px;
  }
}
.createtimes {
  float: right;
  margin-top: 8px;
  color: #999999;
  font-size: 12px;
  font-weight: 400;
}
.transferInfo {
  margin-top: 1px;
  padding: 16px;
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  background-color: #fff;
  .tranlabel {
    display: inline-block;
    width: 49%;
    margin-bottom: 8px;
  }
}
.replytitle {
  padding: 12px;
  font-size: 16px;
  font-weight: 400;
  color: #2a2e2e;
}
.replyformarea {
  padding: 16px;
  background-color: #fff;
}
.multselects > div {
  padding: 0 15px;
  margin-bottom: 8px;
  height: 30px;
  background: #f6f6f6;
  border-radius: 3px;
  display: inline-block;
  margin-right: 12px;
  text-align: center;
  line-height: 30px;
  color: #888;
}
.ness {
  color: red;
}
.multselects > div.selected {
  background: #ff6f4b;
  color: #fff;
}
.replyformarea {
  & /deep/ [name="areaids"] {
    display: none;
  }
  & /deep/ [name="questtypeids"] {
    display: none;
  }
  & /deep/ [name="note"] {
    display: none;
  }
}
.quickreplies > div {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid #dbdbdb;
  padding: 7px 10px;
  border-radius: 13px;
  .quicklab {
    display: inline-block;
    margin: 0 5px 0 5px;
    color: #ff6f4b;
  }
}
.morequick {
  background-color: #f6f6f6;
  color: #888888;
}
.notearea {
  border: 1px solid #dbdbdb;
  margin-top: 12px;
  border-radius: 3px;
}
.switch {
  float: right;
}
.submitbtn {
  background-color: #f3f3f3;
  padding: 24px;
}
.upload,
.upload-imgs {
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  padding: 16px 0 0;
  margin-right: 8px;
  i,
  p {
    color: #999999;
  }
  i {
    font-size: 20px;
  }
  p {
    font-size: 12px;
  }
}
.upload-imgs {
  position: relative;
  padding: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .van-icon {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
  }
}
.tabs {
  margin-top: 1px;
  & /deep/ .van-tabs__line {
    width: 50%;
    background-color: #ff6f4b;
  }
  & /deep/ .van-tab__text {
    font-weight: 600;
  }
  & /deep/ .van-tab--active {
    color: #ff6f4b;
  }
}
.quiclreplylist {
  background-color: #fff;
  padding: 0 16px;
  .replys {
    padding: 12px 0;
    font-size: 12px;
    color: #5f6464;
    border-bottom: 1px solid #dbdbdb;
    .quicklab {
      display: inline-block;
      margin: 0 5px 0 5px;
      color: #ff6f4b;
    }
  }
}
.searchinput {
  height: 50px;
  background-color: #f3f3f3;
  padding: 10px 0;
}
.searchinput .inputs {
  width: 90%;
  margin: 0 auto;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  padding-top: 0;
  padding-bottom: 0;
}

.dept {
  display: inline-block;
  background: #fff0ed;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 400;
  color: #ff6f4b;
  line-height: 16px;
  padding: 2px 4px;
  margin-top: 8px;
}
</style>
