<template>
  <div class="common-content ques-type-wrap">
    <div class="title">
      <span class="name">
        <img src="../../../static/images/ques-type-title-icon.png" />题库管理
      </span>

      <el-button type="primary" size="small" style="width:100px" @click="add">
        <i class="el-icon-plus" style="margin-right:10px"></i>新 增
      </el-button>
    </div>

    <div class="list-wrap" v-loading="loading">
      <div class="item" v-for="(item,index) in classifyList" :key="index">
        <img class="left" src="../../../static/images/type-item-icon.png" />
        <el-input v-if="activeId==index" v-model="quesName" class="name" placeholder size="small"></el-input>
        <el-tooltip v-else effect="dark" :content="item.name" placement="top-start">
          <span class="name ellipsis">{{item.name}}</span>
        </el-tooltip>
        <span v-if="activeId==index" class="operations" style="margin-top:12px">
          <el-tooltip effect="dark" content="取消" placement="top-start" style="margin-right:10px">
            <img
              src="../../../static/images/type-item-clear.png"
              style="padding:0"
              @click="clear(item)"
            />
          </el-tooltip>

          <el-tooltip effect="dark" content="保存" placement="top-start">
            <img
              src="../../../static/images/type-item-save.png"
              style="padding:0"
              @click="submit(item)"
            />
          </el-tooltip>
        </span>
        <span v-else class="operations">
          <el-tooltip effect="dark" content="编辑" placement="top-start" style="margin-right:10px">
            <img
              src="../../../static/images/type-item-edit.png"
              style="padding:0"
              @click="edit(item,index)"
            />
          </el-tooltip>

          <el-tooltip effect="dark" content="删除" placement="top-start">
            <img
              src="../../../static/images/type-item-delete.png"
              style="padding:0"
              @click="deleteType(item)"
            />
          </el-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classifyList: [],
      loading: false,
      quesName: "",
      activeId: "-1"
    };
  },

  methods: {
    // 删除单条
    deleteType(item) {
      this.$confirm("此操作将永久删除该题目类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.util
            .postAjax({
              code: this.global.code,
              url: "/qusetclass/delete",
              data: {
                id: item.id
              }
            })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            });
        })
        .catch(() => {});
    },

    // 清空单条
    clear(item) {
      this.activeId = "-1";
    },

    // 题库提交
    submit(item) {
      item.name = this.quesName;
      if (item.name) {
        let url = "";
        let message = "";
        if (item.id) {
          url = "/qusetclass/update";
          message = "编辑成功";
        } else {
          url = "/qusetclass/add";
          message = "新增成功";
        }

        const loading = this.$loading({
          lock: true,
          text: "提交中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });

        this.util
          .postAjax({
            code: this.global.code,
            url: url,
            data: {
              id: item.id,
              name: item.name
            }
          })
          .then(res => {
            loading.close();
            if (res.success) {
              this.getList();
              this.$message({
                type: "success",
                message: message
              });
              this.activeId = "-1";
            }
          });
      } else {
        this.$message({
          type: "error",
          message: "题库名称不能为空"
        });
      }
    },

    // 新增题库
    add() {
      this.quesName = "";
      let last = this.classifyList.length;
      if (!this.classifyList[last - 1].name) {
        this.$message({
          type: "error",
          message: "新增题库名称不能为空"
        });
        return false;
      }
      this.classifyList.push({
        id: "",
        name: ""
      });
      this.activeId = last;
    },

    // 编辑
    edit(item, index) {
      this.activeId = index;
      this.quesName = item.name;
    },

    //获取题目分类列表接口
    getList() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/qusetclass/list"
        })
        .then(res => {
          this.loading = false;

          if (res.success) {
            this.classifyList = res.items;
            let total = res.total;
          }
        });
    }
  },

  created() {
    this.getList();
  }
};
</script>