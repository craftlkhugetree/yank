<template>
  <div>
    <h2>
      常用回复
      <span class="add" @click="openAddModal"
        ><van-icon name="add-o" class="addicon" />添加</span
      >
    </h2>
    <div class="lists" :style="{ height: height + 'px' }">
      <p
        class="contents"
        v-for="item in contentList"
        :key="item.id"
        @click="useReply(item.content)"
      >
        {{ clipText(item.content) }}
        <van-icon name="delete" class="delbtn" @click="delReply(item.id)" />
      </p>
    </div>
    <!-- 添加常用回复弹窗 -->
    <van-popup
      v-model="vis"
      position="bottom"
      :style="{ height: '30%' }"
      :close-on-click-overlay="false"
      class="reportform"
    >
      <div class="popuptitle">
        <span class="cancel" @click="vis = false">取消</span>
        常用回复
        <span class="save" @click="addQuickReplies">确认</span>
      </div>
      <van-form ref="replyForm" :show-error-message="false">
        <van-field
          v-model="content"
          :rows="3"
          autosize
          type="textarea"
          placeholder="请输入留言"
          :maxlength="200"
          class="fieldbottom"
          :rules="[{ required: true, message: '请输入' }]"
        />
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import { Notify, Dialog } from "vant";
export default {
  data() {
    return {
      content: "",
      contentList: [],
      vis: false,
    };
  },
  props: {
    type: String, //快速回复类型 1退回2撤回3派单4已维修5不修
    height: {
      type: Number,
      default: 350,
    },
  },
  components: {},

  methods: {
    clipText(content) {
      if (content.length > 20) {
        return content.substring(0, 20) + "...";
      } else {
        return content;
      }
    },
    addQuickReplies() {
      this.$refs["replyForm"].validate().then((res) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/quickanswer/save",
            isRep: true,
            data: {
              content: this.content,
              deptid: this.$store.state.userInfo.userOrgId,
              type: this.type,
            },
          })
          .then((res) => {
            if (res.success) {
              Notify({ type: "success", message: "添加常用回复成功！" });
              this.content = "";
              this.vis = false;
              this.getReplies();
            }
          });
      });
    },
    openAddModal() {
      this.content = "";
      this.vis = true;
    },
    useReply(content) {
      this.$emit("userReply", content);
    },
    delReply(id) {
      Dialog.confirm({
        title: "删除确认",
        message: "确定要删除这条快捷回复吗？",
      }).then(() => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "/quickanswer/delete",
            data: {
              id: id,
            },
          })
          .then((res) => {
            if (res.success) {
              this.getReplies();
            }
          });
      });
    },
    getReplies() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/quickanswer/quickanswers",
          isRep: true,
          data: {
            deptid: this.$store.state.userInfo.userOrgId,
            type: this.type,
          },
        })
        .then((res) => {
          if (res.success) {
            this.contentList = res.data;
          }
        });
    },
  },
  created() {
    this.getReplies();
  },
};
</script>
<style lang='scss' scoped>
h2 {
  border-top: 1px solid rgba(219, 219, 219, 1);
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  .add {
    float: right;
    color: rgba(99, 141, 236, 1);
    .addicon {
      float: left;
      margin-right: 9px;
      height: 50px;
      line-height: 50px;
    }
  }
}
.lists {
  width: 100%;
  // height: 350px;
  overflow-y: scroll;
  padding: 12px 16px;
  background-color: rgba(246, 246, 246, 1);
}
.contents {
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 21px;
  .delbtn {
    line-height: 21px;
    float: right;
    color: rgba(99, 141, 236, 1);
  }
}
</style>