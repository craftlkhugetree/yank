<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    label-position="top"
    :hide-required-asterisk="true"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="资源编号"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            :maxlength="maxLen"
            v-model.trim="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="面积(m²)"
          :label-width="formLabelWidth"
          prop="area"
        >
          <el-input-number
            v-model.trim="form.area"
            autocomplete="off"
            controls-position="right"
            :min="0"
            :max="100000"
            :precision="2"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="单价(元)"
          :label-width="formLabelWidth"
          prop="price"
          style="position: relative"
        >
          <el-input-number
            v-model.trim="form.price"
            autocomplete="off"
            controls-position="right"
            :min="0"
            :max="100000"
            :precision="2"
            style="width: 100%"
          ></el-input-number>
          <div
            style="line-height: 20px;position: absolute;color: #1A5AC1;top: -30px;left:58px"
          >
            (计费周期：{{ typeDetail.chargecycle }} ; 计费方式：{{
              typeDetail.chargetype
            }})
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="基础设施"
          :label-width="formLabelWidth"
          prop="oldBaseList"
        >
          <el-select
            v-model="form.oldBaseList"
            style="width: 100%"
            multiple
            placeholder="请选择基础设施"
            @change="() => $forceUpdate()"
          >
            <!-- collapse-tags -->
            <el-option
              v-for="item in typeDetail.baseList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col
        v-for="(item, index) in form.attrList"
        :span="12"
        :key="item.typeattrid + index"
      >
        <el-form-item
          :prop="'attrList[' + index + '].attrv'"
          :label="item.name"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              validator: (r, v, cb) => validatorInput(r, v, cb, item)
            }
          ]"
        >
          <el-input
            v-model.trim="item.attrv"
            @input="inputAttr"
            :maxlength="maxLen"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="资源状态" prop="status">
          <el-radio-group
            v-model="form.status"
            class="my-radio-right-18"
            :disabled="disabled"
          >
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row> </el-row>
  </el-form>
</template>

<script>
export default {
  name: "applyDialog",
  props: {
    formLabelWidth: String,
    newId: String,
    disabled: Boolean,
    dialogType: String,
    form0: Object,
    typeDetail0: Object
  },
  data() {
    return {
      form: this.form0,
      typeDetail: this.typeDetail0,
      maxLen: 100,
      rules: {
        name: [{ required: true, message: "请输入资源编号", trigger: "blur" }],
        area: [{ required: true, message: "请输入面积", trigger: "blur" }],
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        status: [
          { required: true, message: "请选择资源状态", trigger: "change" }
        ],
        oldBaseList: [
          { required: true, message: "请选择基础设施", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    validatorInput(r, v, cb, item) {
      if (!item.attrv) {
        return cb(new Error("请设置" + item.name));
      } else {
        cb();
      }
    },
    inputAttr(val) {
      this.$forceUpdate(); //强制刷新
    }
  }
};
</script>

<style scoped></style>
