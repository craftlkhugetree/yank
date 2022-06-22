<template>
  <div>
    <van-nav-bar title="详情" :border="false" left-arrow @click-left="goBack" />
    <!-- 步骤条 -->
    <basic-process v-show="detail.applystatus !== 0" :active="active" :data="processData"></basic-process>
    <!-- 申请信息 -->
    <div class="form-box">
      <div class="form-box-title">基本信息</div>
      <div class="form-box-content">
        <van-cell title="资源类型" :value="detail.restypename" />
        <van-cell title="资源编号" :value="detail.rescodes" />
        <van-cell title="学院名称" :value="detail.orgname" />
        <van-cell title="课题组名称" :value="detail.classname" />
        <van-cell title="申请人" :border="false" :value="detail.applyername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{detail.applyermobile}}
          </span>
        </van-cell>
        <van-cell title="课题组负责人" :border="false" :value="detail.classleadername" />
        <van-cell title="联系电话" class="van-cell-phone">
          <span slot="default">
            <van-icon name="phone" />
            {{detail.classleadermobile}}
          </span>
        </van-cell>
        <van-cell title="使用时长" :value="(detail.usecycle || '--') + ' ' + detail.chargecycle" />
        <van-cell title="项目名称" :value="detail.projectname" />
        <van-cell title="项目来源" :value="detail.projectfrom" />
        <van-cell title="项目经费" :value="common.money(detail.projectprice, 4) + ' 万元'" />
        <van-cell title="项目概况" :value="detail.projectnote" />
        <van-cell title="实验概况" :border="false" :value="detail.situation || '--'" />
      </div>
    </div>
    <!-- 费用(退出时不显示) -->
    <div class="form-box" v-if="detail.usetype !== '3'">
      <div class="form-box-title">费用</div>
      <!-- <span class="form-box-title-btn" v-if="operType === 'audit'">
        <van-icon name="edit" color="#faac16"></van-icon>编辑
      </span>-->
      <div class="form-box-content" style="padding:10px 0;">
        <el-table :data="detail.ress" style="width: 100%">
          <el-table-column prop="rescode" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="area" label="面积(m²)" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="price"
            :label="'单价(元/'+detail.chargecycle+'/'+detail.chargetype+')'"
            align="center"
            show-overflow-tooltip
            :formatter="common.moneyFormatter"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="usecycle"
            :label="'时长('+detail.chargecycle+')'"
            align="center"
            show-overflow-tooltip
            :formatter="common.defaultFormatter"
          >
          </el-table-column>
          <el-table-column prop="cost" label="费用(元)" align="center" show-overflow-tooltip :formatter="common.moneyFormatter"></el-table-column>
        </el-table>
        <div class="total-cost">
          <van-cell title="费用总计" :border="false" :value="common.money(detail.costTotal) + ' 元'" />
        </div>
      </div>
    </div>

    <!-- 材料文件(退出时不显示) -->
    <div class="form-box" v-if="detail.usetype !== '3'">
      <div class="form-box-title">材料文件</div>
      <div class="form-box-content">
        <van-cell class="van-cell-file">
          <div slot="default">
            <img src="../../../static/imgs/bm-file-pdf.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">申请表</h3>
              <span>{{common.formatTime(detail.applytime, "YYYY.MM.DD hh:mm")}}</span>
            </div>
            <div class="file-list-btns">
              <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="downFile('applyForm','2')"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downFile('applyForm','1')"
              />
            </div>
          </div>
        </van-cell>
        <van-cell class="van-cell-file">
          <div slot="default">
            <img src="../../../static/imgs/bm-file-pdf.png" />
            <div class="file-list-content">
              <h3 class="ellipsis">租用协议</h3>
              <span>{{common.formatTime(detail.applytime, "YYYY.MM.DD hh:mm")}}</span>
            </div>
            <div class="file-list-btns">
              <img
                class="file-view"
                src="../../../static/imgs/bm-file-view.png"
                @click="downFile('applyRules','2')"
              />
              <img
                class="file-down"
                src="../../../static/imgs/bm-file-down.png"
                @click="downFile('applyRules','1')"
              />
            </div>
          </div>
        </van-cell>
      </div>
    </div>
    <!-- 审批信息 -->
    <div class="form-box">
      <div class="form-box-title">审批信息</div>
      <div class="form-box-content" v-show="auditList.length === 0">
        <van-cell title="暂无审批信息" />
      </div>
      <div class="form-box-content" v-for="item in auditList" :key="item.id">
        <van-cell
          :title="item.eventresult === 1 ? '通过该申请' : '驳回该申请'"
          :class="{'van-cell-pass':item.eventresult === 1,'van-cell-reject': item.eventresult !== 1}"
        >
          <van-icon slot="right-icon" :name="item.eventresult === 1 ? 'checked' : 'clear'"></van-icon>
        </van-cell>
        <van-cell title="审批人" :border="false" style="padding-bottom: 0">{{item.eventername}}</van-cell>
        <van-cell title="审批意见" :border="false" style="padding-bottom: 0">{{item.eventnote}}</van-cell>
        <van-cell title="审批日期">{{common.formatTime(item.eventtime, "YYYY.MM.DD")}}</van-cell>
      </div>
    </div>
    <!-- 审批意见 -->
    <div class="form-box" v-if="operType === 'audit'" style="margin-bottom: 54px;">
      <div class="form-box-title">审批意见</div>
      <div class="form-box-content">
        <van-field
          style="background:#f8f8f8;"
          v-model="eventnote"
          name="审批意见"
          placeholder="请输入审批意见"
          rows="4"
          autosize
          type="textarea"
          maxlength="100"
          :show-word-limit="true"
          :rules="[{ required: true, message: '请输入审批意见' }]"
        />
      </div>
    </div>
    <div class="form-btns" v-if="operType === 'audit'">
      <van-button type="default" @click="doAudit(0)">不通过</van-button>
      <van-button type="primary" @click="doAudit(1)">通过</van-button>
    </div>
  </div>
</template>

<script>
import BasicProcess from "../../components/BasicProcess";
export default {
  components: {
    BasicProcess
  },
  data() {
    return {
      active: 1,
      processData: [
        { id: 1, title: "申请日期", des: "", status: "success" },
        { id: 2, title: "单位领导审批日期", des: "", status: "" },
        { id: 3, title: "白马办审批日期", des: "", status: "" }
      ],
      detail: {},
      attment: {},
      auditList: [],
      eventnote: "",
      showDialog: false,
      filePreviewUrl: ""
    };
  },
  props: {
    id: String,
    operDev: String, // 审批单位：单位领导leader、白马办bm
    operType: String // 操作类型：审批audit
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    // 预览下载文件
    downFile(filetype, type) {
      // filetype 申请表applyForm  协议applyRules ,  type 1下载 2预览
      if (type === "2") {
        this.$router.push({
          path: `/edures/file-view/${this.id}`,
          query: {
            filetype: filetype
          }
        });
      } else if (type === "1") {
        let url = `${window.g.bm}/spapply/${filetype}?id=${this.id}&type=1`
        window.open(url, "_blank");
      }
    },

    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spapply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.detail = res.item || {};
            let restype = this.detail.restype;
            this.detail.restypename = restype.name;
            // 计费周期
            this.detail.chargecycle = this.common.chargecycleFormatter(
              restype.chargecycle
            );
            // 计费方式
            this.detail.chargetype = this.common.chargetypeFormatter(
              restype.chargetype,
              "unit"
            );
            // 合计费用
            this.detail.costTotal = this.detail.ress.reduce((pre, cur) => {
              return cur.cost + pre;
            }, 0);
            // 资源编号
            this.detail.rescodes = this.detail.ress
              .map(i => i.rescode)
              .join(",");

            // 审批列表转换
            this.auditList = res.item.events.filter(i =>
              ["3", "4", "5"].includes(i.eventtype)
            );

            //进程日期 1申请 3单位领导 4白马办 5水电工
            let process = res.item.events.filter(i =>
              ["1", "3", "4"].includes(i.eventtype)
            );
            process.forEach(i => {
              let eventtime = this.common.formatTime(i.eventtime, "YYYY.MM.DD");
              switch (i.eventtype) {
                case "1":
                  this.processData[0].des = eventtime;
                  break;
                case "3":
                  this.processData[1].des = eventtime;
                  this.processData[1].status =
                    i.eventresult === 1 ? "success" : "fail";
                  break;
                case "4":
                  this.processData[2].des = eventtime;
                  this.processData[2].status =
                    i.eventresult === 1 ? "success" : "fail";
                  break;
              }
            });

            // 退出申请，去掉单位领导审批
            if(this.detail.usetype === "3") {
              this.processData.splice(1,1);
            }
          } else {
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },

    // 审批
    doAudit(type) {
      let params = {
        eventnote: this.eventnote,
        eventresult: type,
        eventtype: this.operDev === "leader" ? 3 : 4,
        applyid: this.id
      };
      if (!this.eventnote) {
        this.$toast.fail("请输入审批意见");
        return;
      }
      this.$toast.loading({
        message: "审批中...",
        forbidClick: true,
        duration: 0
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spapply/saveEvent",
          isRep: true,
          data: params
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success("审批成功");
            this.goBack();
          } else {
            this.$toast.fail("审批失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("审批失败" + '\n' + err);
        });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.total-cost {
  margin: 15px;
  .van-cell {
    background: #e3f9f5;
    border-radius: 5px;
    padding: 10px 20px;
    .van-cell__title,
    .van-cell__value {
      color: #00b09b;
      font-weight: bold;
    }
  }
}
</style>