<template>
  <div>
    <!--申请信息-->
    <div style="margin-bottom: 20px">
      <div class="item-title">
        <img
          style="width: 24px;height: 20px"
          src="../../../static/images/bm-basic-info.png"
          alt=""
        />
        <span>基本信息</span>
      </div>
      <table class="normal-table" style="table-layout: fixed;width: 100%">
        <tr>
          <td>资源类型</td>
          <td>{{ applyInfoForm.typeName }}</td>
          <td>资源编号</td>
          <td>{{ applyInfoForm.resName }}</td>
          <td>面积(㎡)</td>
          <td>{{ applyInfoForm.areas }}</td>
          <td>使用时长</td>
          <td>
            {{ common.cycleUnit(applyInfoForm) }}
          </td>
        </tr>
        <tr>
          <td>课题组经费负责人</td>
          <td>{{ applyInfoForm.classfeeLeaderName }}</td>
          <td>联系电话</td>
          <td>{{ applyInfoForm.classfeeLeaderMobile }}</td>
          <td>学院名称</td>
          <td>{{ applyInfoForm.orgName }}</td>
          <td>课题组名称</td>
          <td>{{ applyInfoForm.classgroupName }}</td>
        </tr>
        <tr>
          <td>日常联系人</td>
          <td>{{ applyInfoForm.contacterName }}</td>
          <td>联系电话</td>
          <td>{{ applyInfoForm.contacterMobile }}</td>
        </tr>
        <tr>
          <td>项目名称</td>
          <td>
            <!-- <td colspan="5"> -->
            <el-tooltip
              class="item"
              effect="dark"
              :content="applyInfoForm.projectName"
              placement="right"
            >
              <div style="width: 100%" class="ellipsis">
                {{ applyInfoForm.projectName }}
              </div>
            </el-tooltip>
          </td>
          <td>项目来源</td>
          <td>{{ applyInfoForm.projectFrom }}</td>
          <!-- <td><span class="ellipsis">{{ applyInfoForm.projectFrom }}</span></td> -->
          <td>项目经费</td>
          <td>{{ applyInfoForm.projectFee }}万元</td>
          <td>项目时间</td>
          <td>
            {{ applyInfoForm.projectStarttime }} ~
            {{ applyInfoForm.projectEndtime }}
          </td>
        </tr>
        <tr>
          <td>项目概况</td>
          <!-- <td :colspan="7">{{ applyInfoForm.projectOverview }}</td> -->
          <td :colspan="7">
            <el-tooltip
              class="item"
              effect="dark"
              :content="applyInfoForm.projectOverview"
              placement="right"
            >
              <div style="width: 100%" class="ellipsis">
                {{ applyInfoForm.projectOverview }}
              </div>
            </el-tooltip>
          </td>
        </tr>
        <tr>
          <td>实验概况</td>
          <!-- <td :colspan="7">{{ applyInfoForm.experimentOverview }}</td> -->
          <td :colspan="7">
            <el-tooltip
              class="item"
              effect="dark"
              :content="applyInfoForm.experimentOverview"
              placement="right"
            >
              <div style="width: 100%" class="ellipsis">
                {{ applyInfoForm.experimentOverview }}
              </div>
            </el-tooltip>
          </td>
        </tr>
        <tr>
          <td>预期成果</td>
          <!-- <td :colspan="7">{{ applyInfoForm.expectedResult }}</td> -->
          <td :colspan="7">
            <el-tooltip
              class="item"
              effect="dark"
              :content="applyInfoForm.expectedResult"
              placement="right"
            >
              <div style="width: 100%" class="ellipsis">
                {{ applyInfoForm.expectedResult }}
              </div>
            </el-tooltip>
          </td>
        </tr>
      </table>
    </div>

    <!-- 费用-->
    <div v-if="applyInfoForm.useType != '3'" style="margin-bottom: 20px">
      <div class="item-title">
        <img
          style="width: 24px;height: 20px"
          src="../../../static/images/bm-fee-info.png"
          alt=""
        />
        <span>费用</span>
      </div>
      <el-table
        class="my-table my-table-with-total"
        :data="applyInfoForm.resArr"
        style="width: 100%"
        stripe
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="eduResourceName"
          label="资源编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="eduResourceArea"
          label="面积"
          align="center"
        ></el-table-column>
        <!-- :label="`${applyInfoForm.ct1}(${applyInfoForm.ct2})`" -->
        <el-table-column
          prop="eduResourcePrice"
          :label="
            '单价（元/' +
              applyInfoForm.chargecycle +
              '/' +
              applyInfoForm.ct2 +
              '）'
          "
          :formatter="common.moneyFormatter"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="useCycle"
          :label="'时长(' + applyInfoForm.chargecycle + ')'"
          align="center"
        >
          <template>
            {{ applyInfoForm.useCycle }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cost"
          label="费用(元)"
          align="center"
          :formatter="common.moneyFormatter"
        >
          <!-- <template slot-scope="scope">
            {{
              common.moneyFormatter(
                "",
                "",
                scope.row.price * applyInfoForm.useCycle * scope.row.area
              )
            }}
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "applyInfoFee",
  props: {
    applyInfoForm: Object
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.applyInfoForm.resArr && this.applyInfoForm.resArr.length) {
        if (rowIndex === this.applyInfoForm.resArr.length - 1) {
          if (columnIndex === 0) {
            //定位到6行0列的ID，告诉该单元格合并1行4列
            return [1, 4];
          } else if (columnIndex === 4) {
            return [1, 1];
          } else {
            //定位到6行其他列，告诉该单元格不显示
            return [0, 0];
          }
        }
      }
    }
  },
  created() {
    // console.log(this.applyInfoForm);
  }
};
</script>

<style scoped></style>
