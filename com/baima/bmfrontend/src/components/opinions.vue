<template>
  <div>
    <el-row>
      <el-col :span="isCol ? 24 : 16" v-if="!isRepairMove">
        <div class="inner-item">
          <div class="part" v-if="auditDev === 'leader'">单位领导审批意见:</div>
          <div class="part" v-if="auditDev === 'bm'">白马办审批意见:</div>
          <el-input
            v-model.trim="eventnote"
            type="textarea"
            :rows="8"
            placeholder="请输入"
            resize="none"
            maxlength="1000"
          ></el-input>
        </div>
      </el-col>

      <el-col :span="isCol ? 24 : 8">
        <div class="inner-item">
          <div
            class="part"
            style="border-left: none;padding-left: 0"
            :style="isRepairMove ? { 'margin-bottom': '10px' } : {}"
          >
            <span>常用意见</span>
            <span
              style="float: right;color:rgba(0,176,155,1);cursor: pointer"
              @click="operateTip('add', null)"
            >
              <img
                style="width:20px;height:20px;vertical-align:top;margin-right:5px"
                src="../../static/images/bm-tip-add.png"
                alt=""
              />添加</span
            >
          </div>
          <div class="tip-box my-scroll">
            <el-row
              class="tip-item"
              v-for="(item, index) in tipList"
              :key="item.id"
              :class="{ checked: index == checked }"
            >
              <el-col class="content" :span="16">
                <label>
                  <input
                    style
                    v-model="eventnote"
                    name="eventnote"
                    type="radio"
                    class="my-radio"
                    :value="item.note"
                    @change="tipChecked(index)"
                  />
                  <span style>{{ item.note }}</span>
                </label>
              </el-col>
              <el-col class="operate" :span="6" style>
                <img
                  style="margin-right:10px"
                  src="../../static/images/bm-tip-edit.png"
                  alt=""
                  title="编辑"
                  @click="operateTip('edit', item.id)"
                />
                <img
                  style="width:14px"
                  src="../../static/images/bm-tip-delete.png"
                  alt=""
                  title="删除"
                  @click="deleteTip(item.id)"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--弹框-->
    <el-dialog
      class="res-apply-dialog"
      :title="tipTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :modal="!isCol"
    >
      <el-form :hide-required-asterisk="true">
        <el-form-item required style="margin-left: 0">
          <el-input
            autocomplete="off"
            v-model.trim="addnote"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="my-button green" @click="addEidt">提 交</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    auditDev: {
      // 审批部门，默认白马办
      type: String,
      default: "bm"
    },
    isCol: Boolean,
    isRepairMove: Boolean
  },
  data() {
    return {
      eventnote: "", // 审批意见
      note: "", // 选中的常用意见
      tipList: [], // 常用意见
      tipType: "",
      tipTitle: "",
      addnote: "",
      dialogVisible: false,
      checked: -1
    };
  },
  methods: {
    tipChecked(index) {
      this.checked = index;
      if (this.isRepairMove && this.$parent.$data) {
        if (this.$parent.$data.editForm) {
          this.$parent.$data.editForm.note = this.eventnote;
        } else {
          this.$parent.$parent.$data.editForm.note = this.eventnote;
        }
      }
    },

    //打开常用意见弹框
    operateTip(type, id) {
      this.tipType = type;
      switch (type) {
        case "add":
          this.tipTitle = "添加常用意见";
          this.addnote = "";
          this.dialogVisible = true;
          break;
        case "edit":
          this.tipTitle = "编辑常用意见";
          this.util
            .postAjax({
              code: this.global.code,
              url: "/opinions/findById",
              data: {
                id: id
              }
            })
            .then(res => {
              if (res.success == true) {
                this.addnote = res.item.note;
                this.tipid = res.item.id;
                this.dialogVisible = true;
              }
            });
          break;
        default:
          break;
      }
    },

    //删除常用意见
    deleteTip(id) {
      this.$confirm("此操作将永久删除该常用意见, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.util
            .postAjax({
              code: this.global.code,
              url: "/opinions/deleteById",
              data: {
                id: id
              }
            })
            .then(res => {
              if (res.success == true) {
                this.eventnote = "";
                this.getTipList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        })
        .catch(() => {});
    },
    //添加和编辑常用字段
    addEidt() {
      if (!this.addnote) {
        this.$message({
          type: "warning",
          message: "请输入常用意见"
        });
      } else {
        this.util
          .postAjax({
            code: this.global.code,
            url: this.tipType == "add" ? "/opinions/add" : "/opinions/update",
            isRep: true,
            data: {
              id: this.tipType == "add" ? "" : this.tipid,
              note: this.addnote
            }
          })
          .then(res => {
            if (res.success == true) {
              this.getTipList();
              this.dialogVisible = false;
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
      }
    },
    //获取常用意见接口
    getTipList() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/opinions/list"
        })
        .then(res => {
          if (res.success == true) {
            this.tipList = res.items;
          }
        });
    }
  },
  created() {
    this.getTipList();

    // console.log("auditDev",this.auditDev);
  }
};
</script>

<style></style>
