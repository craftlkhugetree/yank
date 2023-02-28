
<template>
  <div>
    <div class="taskinfo">
      <p class="title">
        <span class="tasktype">{{ taskType[taskInfo.type] }}</span>
        <span class="titletext">{{ taskInfo.title }}</span>
      </p>
      <p>
        <span class="taskDept">{{taskInfo.handledeptname}}</span>
        <span class="tasktime">提问人：{{ taskInfo.applyername }}({{ taskInfo.applyerid }})</span>
        <span class="tasktime">联系电话：{{ taskInfo.applyermobile }}</span>
        <span class="tasktime">
          提问时间：{{
          util.formatTime(taskInfo.createtime, "YYYY-MM-DD HH:mm")
          }}
        </span>
      </p>
      <!-- 全文 -->
      <div class="all">
        <div class="context">{{ taskInfo.content }}</div>
        <div class="taskattaches">
          <el-image
            class="imgs"
            style="width: 160px; height: 160px"
            v-for="item in imgUrls"
            :src="item"
            :preview-src-list="imgUrls"
            :key="item"
          ></el-image>
          <!-- <img :src="item" alt="" v-for="item in imgUrls" :key="item" /> -->
        </div>
      </div>
    </div>
    <div class="replyinfo clearfix">
      <div class="replyinputs">
        <p class="title">回复</p>
        <!-- 回复表单 -->
        <el-form
          label-position="left"
          ref="replyForm"
          :rules="replyRules"
          :model="replyForm"
          label-width="80px"
        >
          <el-form-item label="区域" prop="areaids">
            <el-input class="hidden" v-model="replyForm.areaids"></el-input>
          </el-form-item>
          <div class="replyvalues">
            <div
              class="types"
              :class="{ selected: item.checked }"
              v-for="(item, index) in areas"
              :key="item.id"
              @click="selectAreas(index)"
            >{{ item.name }}</div>
          </div>
          <el-form-item label="问题分类" prop="questtypeids">
            <el-input class="hidden" v-model="replyForm.questtypeids"></el-input>
          </el-form-item>
          <div class="replyvalues">
            <div
              class="types"
              :class="{ selected: item.checked }"
              v-for="(item, index) in types"
              :key="item.id"
              @click="selectTypes(index)"
            >{{ item.name }}</div>
          </div>
          <el-form-item label="回复内容" prop="note">
            <el-input class="hidden" type="textarea" :row="6" v-model="replyForm.note"></el-input>
          </el-form-item>
          <div class="replyvalues">
            <el-input type="textarea" :rows="6" v-model="replyForm.note"></el-input>
          </div>
          <el-form-item label="是否公开" prop="isopen">
            <el-radio-group v-model="replyForm.isopen">
              <el-radio label="1">公开</el-radio>
              <el-radio label="0">不公开</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="uploads">
          <p>请上传小于5M的附件</p>

          <el-button icon="el-icon-upload2" size="small" @click="upload">上传附件</el-button>
          <upload
            style="display: none"
            ref="upbtn"
            :multiple="false"
            :size="5120"
            exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
            @done="uploaded"
            :url="$store.state.uploadUrl"
          ></upload>
          <div class="attachs">
            <span v-for="(item, index) in replyAttaches" :key="item.ID">
              <i class="el-icon-paperclip"></i>
              {{ item.TITLE
              }}
              <i
                class="el-icon-close"
                @click="removeAttach(index)"
              ></i>
            </span>
          </div>
        </div>
        <el-button
          :loading="loading"
          size="small"
          type="primary"
          @click="submit"
          class="submitext"
        >提交回复</el-button>
      </div>
      <div class="quickinputs">
        <el-tabs v-model="fast">
          <el-tab-pane label="快捷回复" name="quick">
            <!--------------------------- 新增快捷回复 --------------------------->
            <el-popover
              popper-class="popover-dialog big-popover-dialog"
              placement="bottom-start"
              width="400"
              :visible-arrow="false"
              v-model="popoverVisible"
              @hide="hidePopover"
              @show="$refs.editForm.clearValidate()"
              trigger="manual"
            >
              <div>
                <h3 class="popover-dialog-title">
                  {{popoverTitle}}
                  <i class="el-icon-close" @click="popoverVisible=false;"></i>
                </h3>
                <div class="popover-dialog-content">
                  <el-form ref="editForm" :model="editForm" :rules="editRules" :show-message="false">
                    <el-form-item prop="title" label="标题">
                      <el-input
                        v-model="editForm.title"
                        placeholder="请输入标题"
                        size="small"
                        style="width:300px;"
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="content" label="回复">
                      <el-input
                        type="textarea"
                        v-model="editForm.content"
                        placeholder="请输入内容，不超过200字"
                        maxlength="200"
                        resize="none"
                        rows="5"
                        size="small"
                        style="width:300px;"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="popover-dialog-footer">
                  <el-button type="primary" size="small" @click="saveReply">提交</el-button>
                  <el-button
                    class="white-btn"
                    type="info"
                    plain
                    size="small"
                    @click="popoverVisible=false;"
                  >取消</el-button>
                </div>
              </div>
              <span slot="reference">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="popoverVisible=true;"
                >快捷回复</el-button>
              </span>
            </el-popover>
            <div style="margin-top:20px;">
              <p class="quicklist" v-for="item in quickReplies" :key="item.id">
                <el-tooltip class="item" effect="dark" :content="item.content" placement="right">
                  <div slot="content" style="max-width: 250px; line-height: 20px">{{ item.content }}</div>
                  <span class="quickitem ellipsis" @click="replyForm.note = item.content">
                    <span class="topic">#</span>
                    {{ item.title }}
                  </span>
                </el-tooltip>
                <span class="btns">
                  <span @click="editReply(item)">编辑</span>
                  <span @click="deleteReply(item)">删除</span>
                </span>
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史回复" name="history" class="hispane">
            <el-input
              prefix-icon="el-icon-search"
              size="small"
              class="historySearch"
              clearable
              v-model="historySearchInput"
              @keypress.native.enter="historySearch"
              placeholder="请输入关键字搜索"
              @clear="historySearch"
            ></el-input>
            <el-tooltip
              v-for="item in historyReplies"
              :key="item.id"
              class="item"
              effect="dark"
              :content="item.content"
              placement="bottom"
              popper-class="popper"
            >
              <div slot="content" style="max-width: 250px; line-height: 20px">{{ item.content }}</div>
              <div style="position: relative">
                <p
                  class="hislist"
                  @click="replyForm.note = item.content"
                >{{ clipText(item.content) }}</p>
                <span class="setqucik" @click="setToQuick(item.content)">设置快捷</span>
              </div>
            </el-tooltip>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!---------------------------- 弹窗 ---------------------------->
    <el-dialog
      class="base-dialog"
      title="快捷回复"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <el-form-item prop="title" label="标题">
          <el-input v-model="editForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="回复">
          <el-input
            type="textarea"
            v-model="editForm.content"
            placeholder="请输入内容，不超过200字"
            maxlength="200"
            resize="none"
            rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="saveReply" :loading="loading">提交</el-button>
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from "@/components/BaseUpload.vue";
export default {
  components: { upload },
  data() {
    return {
      loading: false,
      replyForm: {
        areaids: "",
        questtypeids: "",
        note: "",
        isopen: "1",
        attch: "",
        applyid: "",
        version:""
      },
      replyAttaches: [],
      replyRules: {
        areaids: { required: true, message: "请选择区域" },
        questtypeids: { required: true, message: "请选择类型" },
        note: { required: true, message: "请输入回复" },
        isopen: { required: true }
      },
      //任务的信息
      taskType: ["", "咨询", "投诉", "表扬", "反馈", "其他"],
      imgUrls: [],
      taskInfo: {
        type: 0,
        title: "",
        content: "",
        createtime: "",
        applyermobile: "",
        applyerid: "",
        applyername: "",
        handledeptname: ""
      },
      handledeptid: "",
      //区域和问题类型
      areas: [],
      types: [],
      //快捷回复栏目
      fast: "quick",
      //   快捷回复
      quickReplies: [],
      // 历史回复
      historySearchInput: "",
      historyReplies: [],
      //历史转快捷回复
      dialogVisible: false,
      editRules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
      },
      editForm: {
        id: "",
        title: "",
        content: ""
      },
      popoverTitle: "新增快捷回复",
      popoverVisible: false
    };
  },
  props: {
    info: Object
  },
  methods: {
    hidePopover() {
      this.popoverTitle = "新增快捷回复";
      this.editForm = {
        id: "",
        title: "",
        content: ""
      };
    },
    editReply(item) {
      this.popoverTitle = "编辑快捷回复";
      this.editForm = {
        id: item.id,
        title: item.title,
        content: item.content
      };
      this.popoverVisible = true;
    },
    saveReply() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/save",
              isRep: true,
              data: {
                id: this.editForm.id || null,
                title: this.editForm.title,
                content: this.editForm.content,
                deptid: this.handledeptid
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.popoverVisible = false;
                this.$message.success("提交成功！");
                this.dialogVisible = false;
                this.getQuickReplies();
              } else {
                this.$message.error("提交失败!");
              }
            });
        }
      });
    },

    // 删除
    deleteReply(item) {
      this.$confirm(`是否确认删除该快捷回复？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/delete",
              data: {
                id: item.id
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getQuickReplies();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    //把历史回复设置成快捷回复
    setToQuick(content) {
      this.editForm.content = content;
      this.editForm.title = "";
      this.dialogVisible = true;
    },
    //   提交回复
    submit() {
      if (this.loading) return;
      this.$refs["replyForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          //组装数据
          let replyData = {
            applyid: this.replyForm.applyid,
            version: this.replyForm.version,
            isopen: this.replyForm.isopen,
            note: this.replyForm.note
          };
          if (this.replyAttaches.length) {
            let attch = [];
            _.forEach(this.replyAttaches, attaches => {
              attch.push(attaches.ID);
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
                this.$message.success("回复成功！");
                setTimeout(() => {
                  // window.close();
                  this.$router.go(-1);
                }, 1500);
              } else {
                this.$message.error(res.data.message);
                this.loading = false;

              }
            });
          //保存历史回答
          this.util
            .postAjax({
              code: this.global.code,
              url: "/historyanswer/save",
              isRep: true,
              data: {
                content: this.replyForm.note,
                deptid: this.handledeptid
              }
            })
            .then(res => {});
        }
      });
    },
    //触发上传
    upload() {
      this.$refs["upbtn"].toupload();
    },
    //上传结束
    uploaded(res) {
      if (res.success) {
        this.replyAttaches.push(res.data[0]);
      }
    },
    //取消文件
    removeAttach(index) {
      this.replyAttaches.splice(index, 1);
    },
    //选择区域和问题类型
    selectAreas(index) {
      let flag = this.areas[index];
      flag.checked = !flag.checked;
      this.$set(this.areas, index, flag);
      let checkedArr = [];
      _.forEach(this.areas, area => {
        if (area.checked) {
          checkedArr.push(area.id);
        }
      });
      this.replyForm.areaids = checkedArr.join(",");
    },
    selectTypes(index) {
      let flag = this.types[index];
      flag.checked = !flag.checked;
      this.$set(this.types, index, flag);
      let checkedArr = [];
      _.forEach(this.types, types => {
        if (types.checked) {
          checkedArr.push(types.id);
        }
      });
      this.replyForm.questtypeids = checkedArr.join(",");
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
          }
        })
        .then(res => {
          if (res.success) {
            this.historyReplies = res.data;
          }
        });
    },
    clipText(content) {
      return content.length > 65 ? content.substring(0, 65) + "..." : content;
    },
    //获取任务细节
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
              this.$message.error("本条数据已被他人处理！");
              setTimeout(() => {
                // window.close();
                this.$router.go(-1);
              }, 500);
              return true;
            }
            this.replyForm.version = taskInfos.version;
            this.handledeptid = res.data.handledeptid;
            this.getQuickReplies();

            //获取任务细节
            this.taskInfo = {
              type: taskInfos.type,
              title: taskInfos.title,
              content: taskInfos.content,
              createtime: taskInfos.createtime,
              applyername: taskInfos.applyername,
              applyermobile: taskInfos.applyermobile,
              applyerid: taskInfos.applyerid,
              handledeptname: taskInfos.handledeptname
            };
            if (taskInfos.photos) {
              let photo = taskInfos.photos.split(",");
              _.forEach(photo, img => {
                this.imgUrls.push(this.$store.state.fileUrl + "/" + img);
              });
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
                version:taskInfos.version,
              };
              if (taskInfos.handleattch) {
                let attachids = taskInfos.handleattch.split(",");
                this.util
                  .postAjax({
                    code: this.global.fileCode,
                    url: "rest/FileOut/getFiles",
                    isRep: true,
                    data: {
                      IDs: attachids
                    }
                  })
                  .then(res => {
                    if (res.success) {
                      let data = res.data;
                      _.forEach(attachids, id => {
                        this.replyAttaches.push(data[id]);
                      });
                    }
                  });
              }
            }
          }
        });
    },
    //获取快捷回复
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
      this.historySearch();
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
.tasktype {
  display: inline-block;
  width: 40px;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  text-align: center;
  font-weight: 400;
  background: #ff6f4b;
  border-radius: 3px;
  color: #fff;
  margin-right: 10px;
}
.title {
  border-bottom: #eeeeee 1px solid;
  line-height: 52px;
  height: 52px;
  margin-bottom: 10px;
}
.titletext {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  color: #2a2e2e;
  line-height: 52px;
  height: 52px;
}
.taskDept {
  background: #fff0ed;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 400;
  color: #ff6f4b;
  line-height: 17px;
  padding: 3px 5px;
  margin-right: 30px;
}
.tasktime {
  // float: right;
  display: inline-block;
  // line-height: 52px;
  // height: 52px;
  font-size: 12px;
  color: #999999;
  margin-right: 30px;
}
.context {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 28px;
  position: relative;
}
.previmg .context {
  width: 710px;
  float: left;
  margin-right: 10px;
}
.previmg .contextimg {
  width: 80px;
  float: left;
  height: 80px;
  //   outline: 1px solid #ff6f4b;
  margin-top: 10px;
  position: relative;
}
.contextimg > img {
  width: 100%;
  height: 100%;
}
.contextimg > span {
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  width: 30px;
  height: 24px;
  line-height: 24px;
}
.taskattaches {
  margin-top: 38px;
  .imgs {
    width: 160px;
    height: 160px;
    display: inline-block;
    margin-right: 20px;
  }
}
.transferInfo {
  height: 14px;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  margin-top: 10px;
}
.orgname {
  display: inline-block;
  margin-right: 30px;
}

.taskinfo {
  background: #fff;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 20px;
  padding-bottom: 38px;
}
.replyinfo {
  background: #fff;
  margin-top: 10px;
}
.replyinputs,
.quickinputs {
  width: 50%;
  float: left;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
}
.replyinputs {
  border-right: 1px solid #eee;
}
.replyinputs > .title {
  font-size: 16px;
  font-weight: bold;
  color: #2a2e2e;
  height: 52px;
  line-height: 52px;
}
.quickinputs /deep/ .el-tabs__item {
  height: 52px;
  line-height: 52px;
}
.quickinputs /deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}

.quickinputs /deep/ .el-tabs__active-bar {
  background-color: #ff6f4b;
}
.quickinputs /deep/ .el-tabs__item.is-active {
  color: #2a2e2e;
  font-weight: bold;
}
.quickinputs /deep/ .el-tabs__item:hover {
  color: #ff6f4b;
}

.el-tooltip__popper {
  max-width: 300px !important;
}
.quicklist {
  height: 36px;
  line-height: 36px;
  position: relative;
  .btns {
    position: absolute;
    right: 0;
    font-size: 14px;
    font-weight: 400;
    color: #3a78fc;
    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.topic {
  font-size: 14px;
  font-weight: 400;
  color: #ff6f4b;
}
.quickitem {
  cursor: pointer;
  width: calc(100% - 80px);
  font-size: 14px;
  color: #5f6464;
  line-height: 16px;
}
.quickitem:hover {
  color: #ff6f4b;
}
.historySearch /deep/ input {
  background-color: #f6f6f6;
  border: none;
}
.hispane {
  padding-right: 26px;
}
.hislist {
  font-size: 14px;
  font-weight: 400;
  color: #5f6464;
  line-height: 28px;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.popper {
  max-width: 250px;
}
.setqucik {
  position: absolute;
  bottom: 7px;
  right: 14px;
  color: #3a78fc;
  font-size: 14px;
  cursor: pointer;
}
.hidden {
  display: none;
}
.replyinputs /deep/ .el-form-item {
  margin-bottom: 0;
}
.replyinputs .replyvalues {
  margin-bottom: 30px;
}
.types {
  display: inline-block;
  margin-right: 10px;
  min-width: 48px;
  padding: 0 10px;
  height: 32px;
  text-align: center;
  font-size: 14px;
  color: #888888;
  line-height: 32px;
  background: #f6f6f6;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 10px;
}
.types.selected {
  background: #ff6f4b;
  color: #fff;
}
.replyinputs /deep/ .el-form-item__error {
  top: 25% !important;
}
.uploads {
  margin-top: 30px;
  margin-bottom: 30px;
}
.el-icon-paperclip {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #3a78fc;
  background: #e7eefe;
  font-size: 12px;
  border-radius: 3px;
  margin-right: 10px;
}
.attachs > span {
  font-size: 12px;
  color: #3a78fc;
  line-height: 14px;
  cursor: pointer;
}
.attachs {
  margin-top: 10px;
  & .el-icon-close {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    color: #000;
    margin-left: 10px;
    text-align: center;
  }
  & > span {
    display: block;
    margin-bottom: 10px;
  }
}
.uploads > p {
  display: block;
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
.submitext {
  font-size: 14px;
}
</style>
