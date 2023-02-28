<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin:0 50px"
    >
      <el-form-item label="登录名" prop="LOGINNAME">
        <el-input v-model="form.LOGINNAME"></el-input>
      </el-form-item>

      <el-form-item label="用户名" prop="NAME">
        <el-input v-model="form.NAME"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="SEX">
        <el-radio-group v-model="form.SEX" class="my-radio">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="dialogType == 'add'" label="密码" prop="PWD">
        <el-input v-model="form.PWD"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="PHONE">
        <el-input v-model="form.PHONE"></el-input>
      </el-form-item>

      <el-form-item label="部门名称" prop="ORGID">
        <el-cascader
          v-model="form.ORGID"
          :options="orgList"
          :props="optionProps"
          style="width:100%"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="角色权限" prop="ROLEID">
        <el-select
          v-model="form.ROLEID"
          multiple
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="item in roleList"
            :key="item.ID"
            :label="item.NAME"
            :value="item.ID"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="角色状态" prop="STATUS">
        <el-select
          v-model="form.STATUS"
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="item in roleStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="() => $emit('closeDialog')"
        >取 消</el-button
      >
      <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </div>
  </div>
</template>

<script>
// import upload from '../../components/BaseUpload'
export default {
  props: {
    classifyList: Array,
    dialogTitle: String,
    dialogType: String
  },
  // components:{upload},
  data() {
    var checkPhone = (rule, value, callback) => {
      var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (!value) {
        callback();
      } else {
        if (!myreg.test(value)) {
          return callback(new Error("手机号码格式不正确"));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        ID: "",
        LOGINNAME: "",
        PASSWORD: "",
        PHONE: "",
        NAME: "",
        SEX: "",
        ORGID: "",
        ROLEID: "",
        STATUS: ""
        // TID:"1",
      },
      rules: {
        LOGINNAME: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        NAME: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        PWD: [{ required: true, message: "请输入密码", trigger: "blur" }],
        PHONE: [{ validator: checkPhone, trigger: "blur" }],
        SEX: [{ required: true, message: "请选择性别", trigger: "change" }],
        ORGID: [
          { required: true, message: "请选择部门名称", trigger: "change" }
        ],
        ROLEID: [
          { required: true, message: "请选择角色权限", trigger: "change" }
        ],
        STATUS: [
          { required: true, message: "请选择角色状态", trigger: "change" }
        ]
      },

      orgList: [],
      optionProps: {
        value: "ID",
        label: "NAME",
        children: "children"
      },
      roleStatusList: [
        // { name: "删除", id: "0" },
        { name: "正常", id: "1" },
        { name: "停用", id: "2" }
      ],
      roleList: []
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  methods: {
    // 部门名称选择
    handleChange(value) {
      this.form.ORGID = this.form.ORGID[this.form.ORGID.length - 1];
    },

    // 提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.util.regExps.pwdRegex.test(this.form.PWD)) {
            this.$message({
              type: "error",
              message:
                "您的密码复杂度太低（密码中必须包含大小写字母、数字、特殊字符，长度为8~30），请及时修改密码！"
            });
            return;
          }
          let form = {
            ID: this.form.ID,
            LOGINNAME: this.form.LOGINNAME,
            PHONE: this.form.PHONE,
            NAME: this.form.NAME,
            SEX: this.form.SEX,
            ORGID: this.form.ORGID,
            STATUS: this.form.STATUS,
            TID: this.userInfo.TID
          };

          if (this.dialogType == "add") {
            form.PWD = this.form.PWD;
          }

          // console.log(form);

          // return false;
          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.util
            .postAjax({
              code: this.global.authCode,
              url: "/User/simpleSave",
              data: {
                d: JSON.stringify(form)
              }
            })
            .then(res => {
              loading.close();
              if (res.success) {
                this.common.saveRole(res, this.form).then(res => {
                  if (res.success) {
                    this.$message({
                      type: "success",
                      message: this.dialogTitle + "成功"
                    });

                    this.$emit("closeDialog");
                  }
                });
              }
            });
        }
      });

      // return;
    },

    // 获取组织列表
    getOrgList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "/Org/tree"
        })
        .then(res => {
          //    console.log(res)
          this.orgList = res;
        });
    },

    // 获取角色列表
    getRoleList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "/Role/groupRole"
        })
        .then(res => {
          if (res.success && res.items) {
            let arr = [];
            res.items.forEach(v => {
              if (v.children) {
                v.children.forEach(m => {
                  arr.push(m);
                });
              }
            });

            this.roleList = arr;
          }
        });
    }
  },

  created() {
    this.getOrgList();
    this.getRoleList();

    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });

    // this.contentText=this.form.quesTitle;
    // console.log("dialogTitle",this.dialogTitle);
  }
};
</script>