<template>
  <div class="base-search-table" v-loading="loading">
    <!------------------------------------- 人工开卡 ------------------------------------->
    <div class="search-box clearfix">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <el-divider direction="vertical"></el-divider>
      人工开卡
    </div>
    <!---------------------------- 表单 ---------------------------->
    <div class="form-box">
      <el-form
        class="edit-form"
        :model="editForm"
        ref="editForm"
        label-position="left"
        label-width="100px"
        label-suffix="："
        size="small"
      >
        <h3>类型选择</h3>
        <el-form-item
          label="类型"
          prop="loadType"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '请选择',
            },
          ]"
        >
          <el-radio v-model="editForm.loadType" :label="1">装车</el-radio>
          <el-radio v-model="editForm.loadType" :label="2">卸车</el-radio>
        </el-form-item>
        <h3>司机信息</h3>
        <el-form-item
          label="身份证号"
          prop="idcard"
          :rules="[
            {
              required: true,
              validator: checkId,
              trigger: 'change',
              message: '请输入正确的身份证号',
            },
          ]"
        >
          <el-input
            v-model="editForm.idcard"
            style="width: 468px; margin-right: 10px"
            size="small"
            placeholder="请输入身份证号"
          ></el-input>
          <el-button size="small" :loading="searchLoading" @click="searchOrder">查询订单</el-button>
        </el-form-item>
        <h3 v-if="searched">订单信息</h3>
        <div class="nodata" v-if="searched && tableData.length == 0">
          <img src="@/assets/img/nodata.png" alt />
          <p>没有查到订单信息，请联系管理员</p>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%; margin-top: 10px"
          header-row-class-name="table-header"
          v-loading="searchLoading"
          v-if="tableData.length > 0"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <input
                type="radio"
                v-model="editForm.orderid"
                name="order"
                :value="scope.row.id"
                @change="changeRadio"
              />
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="billNo"
            label="提货单号"
            width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="goodsName"
            label="物料名称"
            width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="quantity" label="应装量" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.quantity ? scope.row.quantity + 'KG' : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="consignee"
            label="客户名称"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <div class="tips" v-if="tableData.length > 0 && sjlist.length > 0">
          <p>
            <i class="el-icon-question"></i>
            提货单 {{ curOrder.billNo }} 需要
            {{ curOrder.drivers.length }} 名司机，请补充司机身份证号
          </p>
          <el-form-item
            v-for="(item, index) in sjlist"
            :key="item.id"
            label="身份证号"
            :prop="`idcards[${index}]`"
            :rules="[{ required: true, validator: checkIds, trigger: 'change' }]"
          >
            <el-input
              v-model="editForm.idcards[index]"
              style="width: 468px; margin-right: 10px"
              size="small"
              placeholder="请输入身份证号"
              @change="checkOtherId(index)"
            ></el-input>
            <!-- <span class="valid" v-if="idcardValid">
              <i class="el-icon-success"></i>身份正确
            </span>
            <span class="valid" v-else>
              <i class="el-icon-error"></i>身份错误
            </span>-->
          </el-form-item>
        </div>
        <div v-if="tableData.length > 0">
          <h3>绑定卡片</h3>
          <el-form-item
            label="卡号信息"
            prop="cardNo"
            :rules="[{ required: true, trigger: 'change', message: '请读取卡号信息' }]"
          >
            <el-input
              v-model="editForm.cardNo"
              style="width: 468px; margin-right: 10px"
              size="small"
              placeholder="正确插入卡片后自动读取卡号"
            ></el-input>
            <el-button size="small" :loading="readLoading" @click="readCard">读取卡号</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer" v-if="tableData.length > 0">
      <el-button type="primary" @click="save">确定开卡</el-button>
    </div>
    <!-- 读卡 -->
    <read-card ref="readCard"></read-card>
  </div>
</template>

<script>
import { saveCard, searchOrderByID } from '@/api/card';
import ReadCard from '@/components/ReadCard';
export default {
  components: {
    ReadCard,
  },
  props: {
    id: String,
  },
  data() {
    return {
      loading: false,
      searched: false,
      searchLoading: false,
      readLoading: false,
      tableData: [],
      editForm: {
        loadType: 1,
        idcard: null,
        orderid: null,
        cardNo: null,
        idcards: [],
      },
      curOrder: null,
      sjlist: [],
    };
  },
  methods: {
    // 校验身份证号
    checkId(rule, value, callback) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号！'));
      } else {
        callback();
      }
    },
    // 校验其他司机身份证号
    checkIds(rule, value, callback) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let ids = this.sjlist.map(i => i.idcard);
      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号！'));
      } else if (!ids.includes(value)) {
        callback(new Error('输入的身份证号与提货单司机信息不匹配！'));
      } else if (this.editForm.idcards.filter(i => i == value).length > 1) {
        callback(new Error('输入的身份证号码已存在！'));
      } else {
        callback();
      }
    },
    // 校验其他身份证
    checkOtherId(curIndex) {
      this.editForm.idcards.forEach((i, index) => {
        if (curIndex !== index) {
          this.$refs.editForm.validateField(`idcards[${index}]`);
        }
      });
    },
    // 查询订单
    searchOrder() {
      this.$refs.editForm.validateField('idcard', err => {
        if (!err) {
          this.searchLoading = true
          searchOrderByID({
		    loadType: this.editForm.loadType,
            idcard: this.editForm.idcard
          })
            .then(res => {
              this.searchLoading = false
              this.searched = true
              if (res.code == '000000') {
                this.tableData = res.data || []
          /**this.tableData = [
            {
              id: 7,
              billNo: 'B2000002',
              consignee: '测试公司',
              goodsId: '0101',
              goodsName: '甲苯',
              shipname: '苏A20013',
              drivers: [
                { id: null, billId: null, name: '王晓晓', idcard: '320876787654567621' },
                { id: null, billId: null, name: '李明', idcard: '340876787654567654' }
              ]
            },
            {
              id: 11,
              billNo: 'B2200071',
              consignee: '测试公司测试公司测试公司',
              goodsId: '0101',
              goodsName: '甲苯',
              shipname: '苏A22223',
              drivers: [
                { id: null, billId: null, name: '陈晨', idcard: '340876787654567654' }
              ]
            },
            {
              id: 12,
              billNo: 'B2200072',
              consignee: '测试公司测试公司',
              goodsId: '0101',
              goodsName: '甲苯',
              shipname: '苏A87673',
              drivers: [
                { id: null, billId: null, name: '高先', idcard: '320876787654567621' }
              ]
            }
          ]**/
          if (this.tableData.length > 0) {
            this.editForm.orderid = this.tableData[0].id
            this.changeRadio()
          } }else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '查询订单失败：' + res.msg
              })
            }
          })
          .catch(err => {
            this.searchLoading = false
            this.searched = true
            this.$message({
              showClose: true,
              type: 'error',
              message: '查询订单失败：' + err
            })
          })
        }
      });
    },

    // 改变订单
    changeRadio() {
      this.curOrder = this.tableData.find(i => i.id == this.editForm.orderid);
      let drivers = this.curOrder.drivers || [];
      this.sjlist = drivers.filter(i => i.idcard !== this.editForm.idcard);
    },

    // 读取卡号
    readCard() {
      this.readLoading = true;
      this.$refs.readCard
        .readCard()
        .then(res => {
          this.readLoading = false;
          this.editForm.cardNo = res;
        })
        .catch(err => {
          this.readLoading = false;
          this.editForm.cardNo = null;
          this.$message({
            showClose: true,
            type: 'error',
            duration: 5000,
            message: err,
          });
        });
    },

    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let param = { ...this.curOrder, cardNo: this.editForm.cardNo, openCardType: '2' };
          saveCard(param)
            .then(res => {
              this.loading = false;
              if (res.code == '000000') {
                this.$confirm('您已开卡成功！', '开卡成功', {
                  confirmButtonText: '返回',
                  cancelButtonText: '继续开卡',
                  showCancelButton: !this.id,
                  type: 'success',
                })
                  .then(() => {
                    this.$router.go(-1);
                  })
                  .catch(() => {
                    this.$refs.editForm.resetFields();
                    this.tableData = [];
                    this.curOrder = null;
                    this.sjlist = [];
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '开卡失败：' + res.msg,
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '开卡失败：' + err,
              });
            });
        }
      });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.search-box {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 58px;
  padding: 0 20px !important;
  border-bottom: 1px solid #dbdbdb;
  i {
    font-size: 14px;
    font-weight: 400;
    color: #3f86f7;
    cursor: pointer;
    margin-right: 5px;
  }
}
.form-box {
  width: 680px;
  margin: 0 auto;
  padding: 20px 0;
  .el-radio {
    margin-right: 50px;
    color: rgba(0, 0, 0, 0.65);
  }
  .el-table {
    margin-bottom: 20px;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #373b4b;
    margin-bottom: 15px;
  }
  .tips {
    color: #999999;
    margin-bottom: 20px;
    p {
      margin-top: -5px;
      margin-bottom: 10px;
    }
    i {
      color: #faad14;
      margin-right: 5px;
    }
    .valid {
      color: rgba(0, 0, 0, 0.65);
    }
    .el-icon-success {
      color: #52c41a;
    }
    .el-icon-error {
      color: #ff4d4f;
    }
  }
}
.footer {
  width: 680px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid #dbdbdb;
  .el-button {
    width: 160px;
  }
}
</style>
