<template>
  <!---------------------------- 步骤条 ---------------------------->
  <div class="step-box" :class="{'expend':isOpen}">
    <!---------------------------- 草稿：步骤1蓝色  2灰色 ---------------------------->
    <template v-if="status=='1' || !status">
      <span>
        <span class="step-blue">1</span>
        <span class="text-blue">绩效录入</span>
      </span>
      <i class="el-icon-arrow-right arrow"></i>
      <span>
        <span class="step-gray">2</span>
        <span class="text-gray">考核工作组确认</span>
      </span>
    </template>
    <!---------------------------- 已提交：步骤1对勾  2蓝色 ---------------------------->
    <template v-if="status=='2'">
      <span>
        <i class="el-icon-circle-check"></i>
        <span class="text-blue">绩效录入</span>
      </span>
      <i class="el-icon-arrow-right arrow"></i>
      <span style="position: relative;">
        <span class="step-blue">2</span>
        <span class="text-blue">考核工作组确认</span>
        <span class="record-btn" @click="isOpen = !isOpen">
          <span v-if="isOpen">
            <i class="el-icon-arrow-up"></i>收起
          </span>
          <span v-else>
            <i class="el-icon-arrow-down"></i>展开
          </span>
        </span>
        <div v-show="isOpen">
          <span v-for="worker in checkWorks" :key="worker.id" :name="worker.id">
            <span>
              <i :class="confirmids.includes(worker.workerid) ?'blue-circle' :'gray-circle'"></i>
              {{worker.workername}} （{{worker.workerid}}）
            </span>
          </span>
        </div>
      </span>
    </template>
    <!---------------------------- 已确认：步骤1对勾  2对勾 ---------------------------->
    <template v-if="status=='3' ||status=='4' ">
      <span>
        <i class="el-icon-circle-check"></i>
        <span class="text-blue">绩效录入</span>
      </span>
      <i class="el-icon-arrow-right arrow"></i>
      <span>
        <i class="el-icon-circle-check"></i>
        <span class="text-blue">考核工作组确认</span>
        <span class="record-btn" @click="isOpen = !isOpen">
          <span v-if="isOpen">
            <i class="el-icon-arrow-up"></i>收起
          </span>
          <span v-else>
            <i class="el-icon-arrow-down"></i>展开
          </span>
        </span>
        <div v-show="isOpen">
          <span v-for="worker in checkWorks" :key="worker.id" :name="worker.id">
            <span>
              <i :class="confirmids.includes(worker.workerid) ?'blue-circle' :'gray-circle'"></i>
              {{worker.workername}} （{{worker.workerid}}）
            </span>
          </span>
        </div>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userloading: false,
      userList: [],
      status: "",
      confirmids: [],
      checkWorks: [],
      isOpen: false
    };
  },
  props: {
    kpiData: Object,
    groupWorks: Array
  },
  watch: {
    kpiData() {
      let { status, confirmids } = this.kpiData;
      this.status = status;
      let ids = confirmids || "";
      this.confirmids = ids.split(",") || [];
    },
    groupWorks() {
      this.checkWorks = this.groupWorks;
    }
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.expend {
  height: 80px !important;
}
.step-box {
  height: 40px;
  line-height: 40px;
  border-bottom: solid rgba(0, 0, 0, 0.06) 1px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .arrow {
    color: rgba(0, 0, 0, 0.15);
    font-size: 20px;
    font-weight: 600;
  }
  .text-blue {
    color: #3f86f7;
    font-weight: 600;
  }
  .text-gray {
    color: rgba(0, 0, 0, 0.45);
  }
  .step-blue {
    background: #3f86f7;
    color: #fff;
    font-weight: 600;
    border: 1px solid #3f86f7;
  }
  .step-gray {
    color: rgba(0, 0, 0, 0.15);
    background: #fff;
    border: 1px solid #e3e3e3;
  }

  .step-blue,
  .step-gray {
    position: relative;
    z-index: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    font-size: 14px;
    box-sizing: border-box;
    transition: 0.15s ease-out;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.record-btn {
  cursor: pointer;
  margin-left: 8px;
  color: #999999;
  font-size: 12px;
  line-height: 40px;
  i {
    font-size: 18px;
    margin-right: 8px;
  }
}
</style>