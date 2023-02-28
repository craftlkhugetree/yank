<template>
  <div v-loading="loading">
    <p v-if="!shopid" style="padding: 30px">您暂无管理的餐厅</p>
    <div class="title" v-if="shopid">{{ shopname }}</div>
    <div class="content" v-if="shopid">
      <!------------------- 开放时间 ------------------->
      <div class="item">
        <label>开放时间：</label>
        <div class="item-right">
          <div v-if="!isOpenTimeEdit">
            <span>{{ openTimes }}</span>
            <span class="btn" @click="isOpenTimeEdit = true">编辑</span>
          </div>
          <div v-else>
            <div class="input-item" v-for="(item, index) in openTimeList" :key="index">
              <month-picker v-model="item.time"></month-picker>
              <i class="el-icon-delete" @click="deleteOpenTime(index)"></i>
            </div>
            <div class="add-btn" @click="addOpenTime">+ 新增时间段</div>
            <el-button type="primary" size="small" @click="saveOpenTime">保存</el-button>
            <el-button class="white-btn" size="small" @click="cancelOpenTime">取消</el-button>
            <!-- <el-popover placement="bottom" title="标题" width="500" trigger="click">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="date">
                    <div class="date-column">
                      <ul ref="month">
                        <li
                          v-for="(month,index) in monthList"
                          :key="month"
                          :class="{'select':curMonth==month}"
                          @click="chooseMonth(month,index)"
                        >{{month}}月</li>
                      </ul>
                    </div>
                    <div class="date-column">
                      <ul ref="day">
                        <li
                          v-for="(day,index) in dayList"
                          :key="day"
                          :class="{'select':curDay==day}"
                          @click="chooseDay(day,index)"
                        >{{day}}日</li>
                      </ul>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-button slot="reference">选择日期</el-button>
            </el-popover>-->
          </div>
        </div>
      </div>
      <!------------------- 开放对象 ------------------->
      <div class="item">
        <label>开放对象：</label>
        <div class="item-right">
          <div v-if="!isOpenObjEdit">
            <span>{{ openObjNames }}</span>
            <span class="btn" @click="isOpenObjEdit = true">编辑</span>
          </div>
          <div v-else>
            <div class="input-item">
              <el-checkbox-group v-model="openObj">
                <el-checkbox v-for="item in openObjList" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
                <span class="tips" v-if="openObj.length == 0">请选择开放对象！</span>
              </el-checkbox-group>
            </div>
            <el-button type="primary" size="small" @click="saveOpenObj">保存</el-button>
            <el-button class="white-btn" size="small" @click="cancelOpenObj">取消</el-button>
          </div>
        </div>
      </div>
      <!------------------- 订餐类型 ------------------->
      <div class="item">
        <label>订餐类型：</label>
        <div class="item-right">
          <div v-if="!isOrderTypeEdit">
            <span>{{ orderTypeNames }}</span>
            <span class="btn" @click="isOrderTypeEdit = true">编辑</span>
          </div>
          <div v-else>
            <div class="input-item">
              <el-checkbox-group v-model="orderType">
                <el-checkbox v-for="item in orderTypeList" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
                <span class="tips" v-if="orderType.length == 0">请选择订餐类型！</span>
              </el-checkbox-group>
            </div>
            <el-button type="primary" size="small" @click="saveOrderType">保存</el-button>
            <el-button class="white-btn" size="small" @click="cancelOrderType">取消</el-button>
          </div>
        </div>
      </div>

      <!------------------- 选择预定方式 ------------------->
      <div class="item">
        <label>预定方式：</label>
        <div class="item-right">
          <el-radio-group v-model="order_type_selected">
            <!-- :disabled="order_type_list.some(t => t.id == config.orderway)" -->
            <el-radio :label="type.id" v-for="type in order_type_list" :key="type.id">
              {{ type.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <!------------------- 具体预定方式 ------------------->
      <div class="item">
        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <div class="item-right order-type">
          <!------------------- 订餐类 ------------------->
          <div v-if="order_type_selected == 1">
            <!------------------- 配送时间 ------------------->
            <div class="item">
              <label>配送时间：</label>
              <div class="item-right">
                <div v-if="!isSendTimeEdit">
                  <span>{{ sendTimes }}</span>
                  <!-- <span class="btn" @click="isSendTimeEdit = true">编辑</span> -->
                </div>
                <div v-else>
                  <div class="input-item" v-for="(item, index) in sendTimeList" :key="index">
                    <el-time-select
                      v-model="item.time[0]"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                        maxTime: item.time[1],
                      }"
                      placeholder="开始时间"
                      size="small"
                      style="width: 163px"
                    ></el-time-select>
                    至
                    <el-time-select
                      v-model="item.time[1]"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                        minTime: item.time[0],
                      }"
                      :disabled="!item.time[0]"
                      placeholder="结束时间"
                      size="small"
                      style="width: 163px"
                    ></el-time-select>
                    <i class="el-icon-delete" @click="deleteSendTime(index)"></i>
                  </div>
                  <div class="add-btn" @click="addSendTime">+ 新增时间段</div>
                  <!-- <el-button type="primary" size="small" @click="saveSendTime">保存</el-button>
                  <el-button class="white-btn" size="small" @click="cancelSendTime">取消</el-button> -->
                </div>
              </div>
            </div>
            <!------------------- 备餐时间 ------------------->
            <div class="item">
              <label>备餐时间：</label>
              <div class="item-right">
                <div v-if="!isSetupTimeEdit">
                  <span>{{ setUpTime || '--' }}{{ common.unitFormat(setUpTimeUnit) }}</span>
                  <!-- <span class="btn" @click="isSetupTimeEdit = true">编辑</span> -->
                </div>
                <div v-else>
                  <div class="input-item">
                    <el-input
                      v-model="setUpTime"
                      size="small"
                      placeholder="请输入备餐时间"
                      style="width: 300px; margin-bottom: 10px"
                    >
                      <!-- :class="{ 'is-error': !/^[1-9][0-9]*$/.test(setUpTime) }" -->
                      <el-select v-model="setUpTimeUnit" slot="append" style="width: 80px">
                        <el-option label="分钟" value="minute"></el-option>
                        <el-option label="小时" value="hour"></el-option>
                        <el-option label="天" value="day"></el-option>
                      </el-select>
                    </el-input>
                  </div>
                  <!-- <el-button type="primary" size="small" @click="saveSetupTime">保存</el-button>
                  <el-button class="white-btn" size="small" @click="cancelSetupTime">
                    取消
                  </el-button> -->
                </div>
              </div>
            </div>
            <!------------------- 订餐提醒 ------------------->
            <div class="item">
              <label>订餐提醒：</label>
              <div class="item-right">
                <div v-if="!isWarnEdit">
                  配送时间在
                  <span style="color: #3a78fc">{{ timeinfo }}</span>
                  小时内，订单内菜品数量超过
                  <span style="color: #3a78fc">{{ maxitems }}</span>
                  份时提醒订餐数量过多
                  <!-- <span class="btn" @click="isWarnEdit = true">编辑</span> -->
                </div>
                <div v-else>
                  <div style="margin-bottom: 5px">
                    配送时间在
                    <el-input-number
                      v-model="timeinfo"
                      :min="1"
                      :max="1000"
                      size="mini"
                      step-strictly
                    ></el-input-number>
                    小时内，订单内菜品数量超过
                    <el-input-number
                      v-model="maxitems"
                      :min="1"
                      :max="1000"
                      size="mini"
                      step-strictly
                    ></el-input-number>
                    份时提醒订餐数量过多
                  </div>
                  <!-- <el-button type="primary" size="small" @click="saveWarn">保存</el-button>
                  <el-button class="white-btn" size="small" @click="cancelWarn">取消</el-button> -->
                </div>
              </div>
            </div>
          </div>
          <!------------------- 净菜预定类 ------------------->
          <div v-if="order_type_selected == 2">
            <!-- 净菜预定时间 -->
            <div class="item">
              <label>预定时间：</label>
              <div class="item-right">
                <div v-if="!isFixedTimeEdit">
                  {{ chEveryday }}
                  <span style="color: #3a78fc">{{ fixedTime1 || '--' }}</span>
                  前可预订
                  <span style="color: #3a78fc">{{ fixedTime2 || '--' }}</span>
                  天后的菜品
                  <!-- <span class="btn" @click=" isFixedTimeEdit = true; fixedTime1 = '13:00'; " > 编辑 </span> -->
                </div>
                <div v-else>
                  <div style="margin-bottom: 5px">
                    {{ chEveryday }}
                    <el-time-select
                      v-model="fixedTime1"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                      }"
                      placeholder="时间点"
                      size="small"
                      style="width: 163px"
                    ></el-time-select>
                    前可预订
                    <el-input-number
                      v-model="fixedTime2"
                      :min="1"
                      :max="7"
                      size="mini"
                      step-strictly
                    ></el-input-number>
                    天后的菜品
                  </div>
                  <!-- <el-button type="primary" size="small" @click="saveFixedTime">保存</el-button>
                  <el-button class="white-btn" size="small" @click="cancelFixedTime">
                    取消
                  </el-button> -->
                </div>
              </div>
            </div>
            <!-- 净菜取餐时间 -->
            <div class="item">
              <label>取餐时间：</label>
              <div class="item-right">
                <div v-if="!isPickupTimeEdit">
                  <span
                    v-for="p in pickupTimes"
                    :key="p.text"
                    :style="p.isVal ? { color: '#3a78fc' } : ''"
                  >
                    {{ p.isVal ? ' ' + p.text + ' ' : p.text }}
                  </span>
                  <span v-if="!pickupTimes || !pickupTimes.length">暂无</span>
                  <!-- <span class="btn" @click="isPickupTimeEdit = true">编辑</span> -->
                </div>
                <div v-else>
                  <div class="input-item" v-for="(item, index) in pickupTimeList" :key="index">
                    <el-time-select
                      v-model="item[0]"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                        maxTime: item[1],
                      }"
                      placeholder="开始时间"
                      size="small"
                      style="width: 163px"
                    ></el-time-select>
                    至
                    <el-time-select
                      v-model="item[1]"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                        minTime: item[0],
                      }"
                      :disabled="!item[0]"
                      placeholder="结束时间"
                      size="small"
                      style="width: 163px"
                    ></el-time-select>
                    <i class="el-icon-delete" @click="deletePickupTime(index)"></i>
                  </div>
                  <div class="add-btn" @click="addPickupTime">+ 新增时间段</div>
                  <!-- <el-button type="primary" size="small" @click="savePickupTime">保存</el-button>
                  <el-button class="white-btn" size="small" @click="cancelPickupTime">
                    取消
                  </el-button> -->
                </div>
              </div>
            </div>
          </div>
          <!------------------- 货品预定类 ------------------->
          <div v-if="order_type_selected == 3">
            <!-- 货品预定时间 -->
            <div class="item">
              <label>预定时间：</label>
              <div class="item-right">
                <div v-if="!isGoodsFixedTimeEdit">
                  <span>{{ goodsTimeText }}</span>
                  <!-- <span class="btn" @click="editGoodsTime">编辑</span> -->
                </div>
                <div v-else>
                  <div style="margin-bottom: 5px">
                    <el-date-picker
                      v-model="goodsTime"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      size="small"
                    ></el-date-picker>
                  </div>
                  <!-- <el-button type="primary" size="small" @click="saveGoodsFixedTime">
                    保存
                  </el-button>
                  <el-button class="white-btn" size="small" @click="cancelGoodsFixedTime">
                    取消
                  </el-button> -->
                </div>
              </div>
            </div>
            <!-- 货品取餐时间 -->
            <div class="item">
              <label>取餐时间：</label>
              <div class="item-right">
                <div v-if="!isPickupGoodsEdit">
                  <span
                    v-for="p in pickupGoods"
                    :key="p.text"
                    :style="p.isVal ? { color: '#3a78fc' } : ''"
                  >
                    {{ p.isVal ? ' ' + p.text + ' ' : p.text }}
                  </span>
                  <span v-if="!pickupGoods || !pickupGoods.length">暂无</span>
                  <!-- <span class="btn" @click="editGoodsDay">编辑</span> -->
                </div>
                <div v-else>
                  <div style="margin-bottom: 5px">
                    <el-date-picker
                      v-model="goodsRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      size="small"
                    ></el-date-picker>
                    <div
                      class="input-item up-date"
                      v-for="(item, index) in pickupGoodsList"
                      :key="index"
                    >
                      <el-time-select
                        v-model="item[0]"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                          maxTime: item[1],
                        }"
                        placeholder="开始时间"
                        size="small"
                        style="width: 163px"
                      ></el-time-select>
                      至
                      <el-time-select
                        v-model="item[1]"
                        :picker-options="{
                          start: '00:00',
                          step: '00:10',
                          end: '23:50',
                          minTime: item[0],
                        }"
                        :disabled="!item[0]"
                        placeholder="结束时间"
                        size="small"
                        style="width: 163px"
                      ></el-time-select>
                      <!-- <i class="el-icon-delete" @click="deletePickupTime(index)"></i> -->
                    </div>
                  </div>
                  <!-- <div class="add-btn" @click="addGoodsTime" v-if="!pickupGoodsList.length">
                    + 新增时间段
                  </div> -->
                  <!-- <el-button type="primary" size="small" @click="savePickupTime">保存</el-button>
                  <el-button class="white-btn" size="small" @click="isPickupGoodsEdit = false">
                    取消
                  </el-button> -->
                </div>
              </div>
            </div>
          </div>
          <div class="flex-row">
            <el-button v-if="!isEdit" type="primary" plain key="1" size="small" @click="openEdit">
              编辑
            </el-button>
            <el-button v-if="isEdit" type="primary" size="small" key="2" @click="saveEdit">
              保存
            </el-button>
            <el-button v-if="isEdit" class="white-btn" size="small" key="3" @click="closeEdit">
              取消
            </el-button>
          </div>
        </div>
      </div>

      <!------------------- 联系电话 ------------------->
      <div class="item">
        <label>联系电话：</label>
        <div class="item-right">
          <div v-if="!isMobileEdit">
            <span>{{ mobile || '暂无' }}</span>
            <span class="btn" @click="isMobileEdit = true">编辑</span>
          </div>
          <div v-else>
            <div class="input-item" v-for="(item, index) in mobileList" :key="index">
              <el-input
                v-model="mobileList[index]"
                placeholder="请输入正确的手机号或座机号如025-88888888"
                size="small"
                style="width: 350px"
                :class="{ 'is-error': mobileList[index] && !mobileTest.test(mobileList[index]) }"
              ></el-input>
              <i class="el-icon-delete" @click="deleteMobile(index)"></i>
              <span class="tips" v-if="mobileList[index] && !mobileTest.test(item)">
                请输入正确的手机号或座机号如025-88888888！
              </span>
            </div>
            <div class="add-btn" @click="addMobile">+ 新增联系电话</div>
            <el-button type="primary" size="small" @click="saveMobile">保存</el-button>
            <el-button class="white-btn" size="small" @click="cancelMobile">取消</el-button>
          </div>
        </div>
      </div>
      <!------------------- 餐厅说明 ------------------->
      <div class="item">
        <label>餐厅说明：</label>
        <div class="item-right">
          <div v-if="!isNoteEdit">
            <span>{{ note || '暂无' }}</span>
            <span class="btn" @click="isNoteEdit = true">编辑</span>
          </div>
          <div v-else>
            <div style="margin-bottom: 5px">
              <el-input
                type="textarea"
                rows="4"
                resize="none"
                maxlength="100"
                v-model="note"
                size="small"
                style="width: 500px"
                show-word-limit
              ></el-input>
            </div>
            <el-button type="primary" size="small" @click="saveNote">保存</el-button>
            <el-button class="white-btn" size="small" @click="cancelNote">取消</el-button>
          </div>
        </div>
      </div>
      <!------------------- 餐厅图片 ------------------->
      <div class="item">
        <label style="vertical-align: top">餐厅图片：</label>
        <div class="upload-box" v-if="isPhotoEdit">
          <el-button icon="el-icon-upload2" size="small" @click="upload" :loading="imgLoading">
            上传图片
          </el-button>
          <p class="img-des">支持.jpeg .jpg .png .bmp .gif</p>
          <div class="upload-box-img">
            <img :src="url" />
            <span class="hoverStyle" v-if="photo">
              <i class="el-icon-delete" @click="deletePhoto"></i>
            </span>
          </div>
          <el-button type="primary" size="small" @click="savePhoto">保存</el-button>
          <el-button class="white-btn" size="small" @click="cancelPhoto">取消</el-button>
        </div>
        <div v-else class="img-box">
          <img :src="url" />
          <span class="btn" @click="isPhotoEdit = true">编辑</span>
        </div>
      </div>
    </div>
    <!---------------------------- 上传组件 ---------------------------->
    <upload
      v-show="false"
      ref="upload"
      :url="uploadUrl"
      :multiple="false"
      :size="1024"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @choose="chooseFile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import MonthPicker from '@/components/MonthPicker/index';
import { fetchMyCafe, fetchCafeConfig, saveCafeConfig } from '@/api/admin/cafe';
import upload from '@/components/BaseUpload';
import { order_type_list } from '@/assets/js/options.js';
export default {
  components: {
    MonthPicker,
    upload,
  },
  data() {
    return {
      loading: false,
      shopid: null,
      shopname: null,
      config: {},
      openTimeList: [],
      isOpenTimeEdit: false,
      sendTimeList: [],
      isSendTimeEdit: false,
      setUpTime: null,
      setUpTimeUnit: 'minute',
      isSetupTimeEdit: false,
      openObj: [],
      openObjList: [
        {
          id: 'teacher',
          name: '教职工',
        },
        {
          id: 'student',
          name: '学生',
        },
      ],
      isOpenObjEdit: false,
      orderType: [],
      orderTypeList: [
        {
          id: 'group',
          name: '单位订餐',
        },
        {
          id: 'self',
          name: '个人订餐',
        },
      ],
      isOrderTypeEdit: false,
      mobile: null,
      mobileTest: /(^1\d{10}$)|(^((0\d{2,3})(-)?)?(\d{7,8})(-(\d{3,}))?$)/,
      isMobileEdit: false,
      mobileList: [],
      isWarnEdit: false,
      timeinfo: 5,
      maxitems: 15,
      isNoteEdit: false,
      note: null,
      imgLoading: false,
      uploadUrl: window.g.uploadUrl,
      photo: null,
      isPhotoEdit: false,
      d1: '$',
      d2: '|',
      d3: '，',
      chEveryday: '每天',
      chGetGoods: '可取',
      order_type_selected: null,
      order_type_list,
      // 净菜预定时间
      isFixedTimeEdit: false,
      fixedTime1: '',
      fixedTime2: '',
      // 货品预定时间
      isGoodsFixedTimeEdit: false,
      goodsTime: [], // ["2022.06.11 00:00","2022.07.05 00:00"]
      // 净菜取餐时间
      isPickupTimeEdit: false,
      pickupTimes: [],
      pickupTimeList: [],
      // 货品取餐时间
      isPickupGoodsEdit: false,
      pickupGoods: [],
      pickupGoodsList: [[]],
      goodsRange: [], // ["2022.06.24","2022.07.18"]
    };
  },
  watch: {
    order_type_selected(v, o) {
      if (this.config) {
        if (this.config.orderway == v) {
          this.getCafeConfig();
        } else {
          if (v == 2) {
            this.fixedTime1 = '';
            this.fixedTime2 = '';
            this.pickupTimes = [];
            this.pickupTimeList = [];
          }
          if (v == 3) {
            this.goodsTime = [];
            this.pickupGoods = [];
            this.goodsRange = [];
            this.pickupGoodsList = [[]];
          }
        }
      }
      this.isSetupTimeEdit = false;
      this.isPickupTimeEdit = false;
      this.isPickupGoodsEdit = false;
      // this.isEdit = false;
      this.isSendTimeEdit = false;
      this.isFixedTimeEdit = false;
      this.isGoodsFixedTimeEdit = false;
    },
  },
  computed: {
    isEdit() {
      return this.isSendTimeEdit || this.isFixedTimeEdit || this.isGoodsFixedTimeEdit;
    },
    // 图片地址
    url() {
      return this.photo ? window.g.viewUrl + this.photo : require('@/assets/img/nophoto.png');
    },
    // 货品预定时间 格式转换
    goodsTimeText() {
      const arr = this.goodsTime;
      let flag = arr && arr.some(i => i);
      if (flag) {
        return (arr[0] || '') + ' ~ ' + (arr[1] || '');
      }
      return '暂无';
    },
    // 开放时间 格式转换
    openTimes() {
      let arr = this.openTimeList.filter(i => i.time);
      if (arr.length > 0) {
        return arr
          .map(i => {
            let st = i.time[0];
            let et = i.time[1];
            return (
              this.moment(st, 'MMDD').format('MM月DD日') +
              ' ~ ' +
              this.moment(et, 'MMDD').format('MM月DD日')
            );
          })
          .join('，');
      } else {
        return '暂无';
      }
    },
    // 配送时间 格式转换
    sendTimes() {
      let arr = this.sendTimeList.filter(i => i.time && i.time.length).map(i => i.time);
      if (arr.length > 0) {
        return arr.map(i => (i[0] || '--') + ' ~ ' + (i[1] || '--')).join('，');
      } else {
        return '暂无';
      }
    },
    // 开放对象 格式转换
    openObjNames() {
      let arr = this.openObj;
      if (arr && arr.length) {
        return arr
          .map(i => {
            let obj = this.openObjList.filter(j => j.id == i)[0];
            return obj ? obj.name : '';
          })
          .join('，');
      } else {
        return '暂无';
      }
    },
    // 订餐类型 格式转换
    orderTypeNames() {
      let arr = this.orderType;
      if (arr.length > 0) {
        return arr
          .map(i => {
            let obj = this.orderTypeList.filter(j => j.id == i)[0];
            return obj ? obj.name : '';
          })
          .join('，');
      } else {
        return '暂无';
      }
    },
  },
  methods: {
    openEdit() {
      // this.isEdit = true;
      if (this.order_type_selected == 1) {
        this.isSendTimeEdit = true;
        this.isSetupTimeEdit = true;
        this.isWarnEdit = true;
      } else if (this.order_type_selected == 2) {
        this.isFixedTimeEdit = true;
        this.isPickupTimeEdit = true;
        this.fixedTime1 = this.fixedTime1 && this.fixedTime1.length < 6 ? this.fixedTime1 : '13:00';
      } else if (this.order_type_selected == 3) {
        this.isGoodsFixedTimeEdit = true;
        this.editGoodsTime();
        this.editGoodsDay();
      }
    },
    closeEdit() {
      // this.isEdit = false;
      if (this.order_type_selected == 1) {
        this.isSendTimeEdit = false;
        this.cancelSendTime();
        this.cancelSetupTime();
        this.cancelWarn();
      } else if (this.order_type_selected == 2) {
        this.isFixedTimeEdit = false;
        this.cancelFixedTime();
        this.cancelPickupTime();
      } else if (this.order_type_selected == 3) {
        this.isGoodsFixedTimeEdit = false;
        this.cancelGoodsFixedTime();
        this.isPickupGoodsEdit = false;
      }
    },
    saveEdit() {
      let param = {};
      if (this.order_type_selected == 1) {
        if ((param = this.saveSendTime())) {
        } else {
          return;
        }
        param = Object.assign({}, param, this.saveSetupTime(), this.saveWarn());
      } else if (this.order_type_selected == 2) {
        if ((param = this.savePickupTime())) {
        } else {
          return;
        }
        param = Object.assign({}, param, this.saveFixedTime());
      } else if (this.order_type_selected == 3) {
        if ((param = this.saveGoodsFixedTime())) {
        } else {
          return;
        }
        let tmp;
        if ((tmp = this.savePickupTime())) {
          param = Object.assign({}, param, tmp);
        } else {
          return;
        }
      }
      this.saveCafeConfig(param, 1);
    },
    // 货品函数 =====================================>
    // addGoodsTime() {
    //   this.pickupGoodsList.push([]);
    // },
    editGoodsDay() {
      if (!this.goodsRange) {
        this.goodsRange = [];
      }
      if (!this.goodsRange.length) {
        this.goodsRange.push(new Date());
      }
      this.isPickupGoodsEdit = true;
    },

    // 校验货品预定时间是否超出餐厅开放时间
    ifBeyondOpenTime() {
      const year = new Date().getFullYear();
      const a0 = new Date(this.goodsTime[0]).getTime();
      const a1 = new Date(this.goodsTime[1]).getTime();
      return this.openTimeList.some(p => {
        const start = new Date(
          this.moment(year + p.time[0]).format('YYYY-MM-DD HH:mm:ss')
        ).getTime();
        const end =
          new Date(this.moment(year + p.time[1]).format('YYYY-MM-DD HH:mm:ss')).getTime() +
          3600 * 1000 * 24 -
          1;
        // 某时间段内符合，则直接符合
        return a0 >= start && a1 <= end;
      });
    },
    // 货品预定时间
    saveGoodsFixedTime() {
      const arr = this.goodsTime;
      if (!arr || arr.some(a => !a)) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '未选择预定时间！',
        });
        return;
      }
      if (!this.config.opentime) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请先选择开放时间！',
        });
        return;
      }
      if (!this.ifBeyondOpenTime()) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '超出餐厅开放时间!',
        });
        return;
      }
      const fixedtime1 = this.momentTrans(arr[0], 'YYYY.MM.DD HH:mm');
      const fixedtime2 = this.momentTrans(arr[1], 'YYYY.MM.DD HH:mm');
      let param = {
        id: this.config.id,
        shopid: this.shopid,
        fixedtime1,
        fixedtime2,
      };
      return param;
      // this.saveCafeConfig(param, 1);
    },
    cancelGoodsFixedTime() {
      this.resetGoodsFixedTime();
      this.isGoodsFixedTimeEdit = false;
    },
    resetGoodsFixedTime() {
      if (this.config) {
        this.goodsTime = [];
        if (this.config.fixedtime1 && this.config.fixedtime2) {
          this.goodsTime.push(this.config.fixedtime1);
          this.goodsTime.push(this.config.fixedtime2);
        }
      }
    },
    // 货品预定时间编辑
    editGoodsTime() {
      if (!this.goodsTime) {
        this.goodsTime = [];
      }
      if (!this.goodsTime.length) {
        // this.goodsTime.push(new Date());
        // this.goodsTime.push(new Date());
      }
      this.isGoodsFixedTimeEdit = true;
    },
    // <===================================== 货品函数

    // 净菜函数 =====================================>
    // 净菜预定时间
    saveFixedTime() {
      let param = {
        id: this.config.id,
        shopid: this.shopid,
        fixedtime1: this.fixedTime1,
        fixedtime2: this.fixedTime2,
      };
      return param;
      // this.saveCafeConfig(param, 1);
    },
    cancelFixedTime() {
      this.resetFixedTime();
      this.isFixedTimeEdit = false;
    },
    resetFixedTime() {
      if (this.config) {
        this.fixedTime1 = this.config.fixedtime1;
        this.fixedTime2 = this.config.fixedtime2;
      }
    },
    // 时间段校验
    isPair(arrO) {
      const arr = arrO && arrO.filter(p => p[0] || p[1]);
      if (arr.length) {
        let flag = arr.some(a => !(a[0] && a[1]));
        flag &&
          this.$message({
            showClose: true,
            type: 'error',
            message: '时间段不完整！',
          });
        return flag;
      }
      this.$message({
        showClose: true,
        type: 'error',
        message: '请选择时间段！',
      });
      return 1;
    },
    // 含有~字符串的二维数组
    dealArr_WaveLine(arrO) {
      let str = '';
      const arr = arrO && arrO.filter(p => p[0] || p[1]);
      if (arr && arr.length) {
        // 分隔符要统一
        arr.forEach(p => {
          str += p[0] + ' ~ ' + p[1] + this.d3;
        });
        str = str.substring(0, str.length - 1);
      }
      return str;
    },
    // new Date转换moment
    momentTrans(time, f) {
      return this.moment(new Date(time)).format(f);
    },
    // 保存取餐时间
    savePickupTime() {
      let pickuptime = '';
      if (this.order_type_selected == 2) {
        if (!this.fixedTime1 || !this.fixedTime2) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请填写完整预定时间！',
          });
          return;
        }
        if (this.isPair(this.pickupTimeList)) {
          return;
        }
        if (this.isRepeat(this.pickupTimeList)) {
          return;
        }
        // pickuptime: "每天$$可取|01:00 ~ 00:40，04:20 ~ 10:20"
        pickuptime =
          this.chEveryday +
          this.d1 +
          this.d1 +
          this.chGetGoods +
          this.d2 +
          this.dealArr_WaveLine(this.pickupTimeList);
      } else if (this.order_type_selected == 3) {
        if (!this.goodsRange || !this.goodsRange.length) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请选择日期！',
          });
          return;
        }
        if (this.isPair(this.pickupGoodsList)) {
          return;
        }
        const tmp = [];
        this.goodsRange.forEach(g => {
          tmp.push(this.momentTrans(g, 'YYYY.MM.DD'));
        });
        pickuptime =
          this.d1 +
          this.d1 +
          this.d3 +
          this.chEveryday +
          this.d1 +
          this.d1 +
          this.chGetGoods +
          this.d2 +
          this.dealArr_WaveLine([tmp]) +
          this.d2 +
          this.dealArr_WaveLine(this.pickupGoodsList);
      }

      let param = {
        id: this.config.id,
        shopid: this.shopid,
        pickuptime,
      };
      return param;
      // this.saveCafeConfig(param, 1);
    },
    cancelPickupTime() {
      this.isPickupTimeEdit = false;
    },
    genPickupTimes() {
      if (this.config) {
        let str = this.config.pickuptime;
        // arr字符串数组
        let arr = (str && str.split(this.d2)) || [];
        if (arr.length) {
          let label = arr.shift();
          let labelArr = label.split(this.d1);
          if (labelArr.length && !labelArr[0]) {
            labelArr.shift();
          }
          if (labelArr.length && !labelArr[labelArr.length - 1]) {
            labelArr.pop();
          }
          const tmp = [];
          labelArr.forEach(b => {
            tmp.push(b ? { text: b, isVal: 0 } : { text: '', isVal: 1 });
          });
          let valArr = tmp.filter(t => t.isVal);
          valArr.forEach((v, id) => {
            v.text = arr[id] || '';
          });
          this.pickupTimeList = [];
          this.pickupGoodsList = [[]];

          if (this.order_type_selected == 2) {
            // 净菜取餐时间文字
            this.pickupTimes = tmp;
            // 取餐时间数值
            arr.forEach(a => {
              let arrT = a.split(this.d3);
              arrT.forEach(at => {
                let t = at.split('~');
                this.pickupTimeList.push([t[0].trim(), t[1].trim()]);
              });
            });
          } else if (this.order_type_selected == 3) {
            this.pickupGoodsList = [];
            // 货品取餐时间文字
            this.pickupGoods = tmp;
            // 取餐时间数值
            arr.forEach(a => {
              let arrT = a.split(this.d3);
              arrT.forEach(at => {
                let t = at.split('~');
                this.pickupGoodsList.push([t[0].trim(), t[1].trim()]);
              });
            });
            // 货品取餐的第一个元素是日期段
            this.goodsRange = this.pickupGoodsList.splice(0, 1)[0];
          }
        } else {
          this.pickupTimes = [];
          this.pickupGoods = [];
        }
      }
    },
    // 删除取餐
    deletePickupTime(index) {
      this.pickupTimeList.splice(index, 1);
    },
    // 增加取餐
    addPickupTime() {
      this.pickupTimeList.push([]);
    },
    // <===================================== 净菜函数

    // 上传
    upload() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择图片
    chooseFile() {
      this.imgLoading = true;
    },
    // 上传完成
    finish(file) {
      this.imgLoading = false;
      let data = file.data[0] || '';
      if (data) {
        this.photo = data.ID;
      }
    },
    deletePhoto() {
      this.photo = '';
    },
    // 取消图片
    cancelPhoto() {
      this.resetPhoto();
      this.isPhotoEdit = false;
    },
    // 保存图片
    savePhoto() {
      let param = {
        id: this.config ? this.config.id : null,
        shopid: this.shopid,
        photo: this.photo,
      };
      this.saveCafeConfig(param);
    },
    // 删除开放时间
    deleteOpenTime(index) {
      this.openTimeList.splice(index, 1);
    },
    addOpenTime() {
      this.openTimeList.push({ time: null });
    },
    // 取消开放时间编辑
    cancelOpenTime() {
      this.resetOpenTime();
      this.isOpenTimeEdit = false;
    },
    // 保存开放时间
    saveOpenTime() {
      let arr = this.openTimeList.filter(i => i.time);
      // 判断是否存在重复时间
      let timeArr = arr.map(i => i.time);
      if (this.isRepeat(timeArr)) {
        return;
      }
      let time = arr
        .map(i => {
          return i.time[0] + '-' + i.time[1];
        })
        .join(',');
      let param = {
        id: this.config ? this.config.id : null,
        shopid: this.shopid,
        opentime: time,
      };
      this.saveCafeConfig(param);
    },
    // 删除配送时间
    deleteSendTime(index) {
      this.sendTimeList.splice(index, 1);
    },
    addSendTime() {
      this.sendTimeList.push({ time: [] });
    },
    // 取消配送时间编辑
    cancelSendTime() {
      this.resetSendTime();
      this.isSendTimeEdit = false;
    },
    // 保存配送时间
    saveSendTime() {
      let arr = this.sendTimeList.filter(i => i.time && (i.time[0] || i.time[1]));
      let timeArr = arr.map(i => i.time);
      if (this.isPair(timeArr)) {
        return;
      }
      // 判断是否存在重复时间
      if (this.isRepeat(timeArr)) {
        return;
      }
      let time = arr
        .map(i => {
          return i.time[0] + '-' + i.time[1];
        })
        .join(',');
      let param = {
        id: this.config.id,
        shopid: this.shopid,
        sendtime: time,
      };
      return param;
      // this.saveCafeConfig(param, 1);
    },
    // 取消备餐时间编辑
    cancelSetupTime() {
      this.resetSetupTime();
      this.isSetupTimeEdit = false;
    },
    // 保存备餐时间
    saveSetupTime() {
      if (/^[1-9][0-9]*$/.test(this.setUpTime)) {
        let param = {
          id: this.config.id,
          shopid: this.shopid,
          preparetime: this.setUpTime,
          prepareunit: this.setUpTimeUnit,
        };
        return param;
        // this.saveCafeConfig(param, 1);
      }
      return {};
    },
    // 取消开放对象编辑
    cancelOpenObj() {
      this.resetOpenObj();
      this.isOpenObjEdit = false;
    },
    // 保存开放对象
    saveOpenObj() {
      if (this.openObj.length > 0) {
        let param = {
          id: this.config.id,
          shopid: this.shopid,
          openobj: this.openObj.join(','),
        };
        this.saveCafeConfig(param);
      }
    },
    // 取消订单类型编辑
    cancelOrderType() {
      this.resetOrderType();
      this.isOrderTypeEdit = false;
    },
    // 保存订单类型
    saveOrderType() {
      if (this.orderType.length > 0) {
        let param = {
          id: this.config.id,
          shopid: this.shopid,
          ordertype: this.orderType.join(','),
        };
        this.saveCafeConfig(param);
      }
    },
    addMobile() {
      this.mobileList.push('');
    },
    deleteMobile(index) {
      this.mobileList.splice(index, 1);
    },
    // 取消联系电话编辑
    cancelMobile() {
      this.resetMobile();
      this.isMobileEdit = false;
    },
    // 取消订餐提醒编辑
    cancelWarn() {
      this.resetWarn();
      this.isWarnEdit = false;
    },
    // 取消说明
    cancelNote() {
      this.resetNote();
      this.isNoteEdit = false;
    },
    // 保存联系电话
    saveMobile() {
      let list = this.mobileList.filter(i => i);
      if (list.every(i => this.mobileTest.test(i))) {
        let param = {
          id: this.config.id,
          shopid: this.shopid,
          mobile: list.join(','),
        };
        this.saveCafeConfig(param);
      }
    },
    // 保存提醒
    saveWarn() {
      let param = {
        id: this.config.id,
        shopid: this.shopid,
        timeinfo: this.timeinfo,
        maxitems: this.maxitems,
      };
      return param;
      // this.saveCafeConfig(param, 1);
    },
    // 保存说明
    saveNote() {
      let param = {
        id: this.config.id,
        shopid: this.shopid,
        note: this.note,
      };
      this.saveCafeConfig(param);
    },
    // 获取我的餐厅
    getMyCafe() {
      fetchMyCafe().then(res => {
        if (res.success) {
          let data = res.data[0] || {};
          this.shopid = data.id;
          this.shopname = data.name;
          this.getCafeConfig();
        }
      });
    },
    resetConfig() {
      // let obj = {
      //   id: '9e9512b1dc944f22869ddee6d3ed2826',
      //   shopid: '04ef5c52f8a24689a850473ca25e61af',
      //   opentime: '0611-0709',
      //   sendtime: '10:40-16:20,17:20-22:00',
      //   setuptime: '30',
      //   openobj: 'teacher,student',
      //   ordertype: 'group,self',
      //   mobile: '15896452107,15850705318,84396058',
      //   timeinfo: '5',
      //   maxitems: 15,
      //   note: null,
      //   preparetime: 30,
      //   prepareunit: 'minute',
      //   photo: '08d01260c3ce482ebcf6bd93611910c1',
      //   orderway: 2,
      //   fixedtime1: '13:00',
      //   fixedtime2: '2',
      //   pickuptime: '$$，每天$$可取|2022.06.01 ~ 2022.07.01|00:30 ~ 06:40',
      // };
      if (this.config.orderway == 1) {
        this.config.fixedtime1 = null;
        this.config.fixedtime2 = null;
        this.config.pickuptime = null;
      } else {
        this.config.sendtime = null;
        this.config.setuptime = null;
        this.config.preparetime = null;
      }
    },
    // 获取餐厅的配置
    getCafeConfig() {
      let param = {
        shopid: this.shopid,
      };
      this.loading = true;
      fetchCafeConfig(param)
        .then(res => {
          this.loading = false;
          if (res.success && res.data) {
            this.config = res.data;
            if (this.config && this.config.orderway) {
              this.resetConfig();
            }
            this.photo = res.data.photo;
            this.resetOpenTime();
            this.resetSendTime();
            this.resetSetupTime();
            this.resetOpenObj();
            this.resetOrderType();
            this.resetMobile();
            this.resetWarn();
            this.resetNote();
            this.resetPhoto();
            // 设置预定方式
            this.order_type_selected = this.config.orderway;
            this.resetFixedTime();
            this.genPickupTimes();
            this.resetGoodsFixedTime();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 重置开放时间
    resetOpenTime() {
      if (this.config) {
        let time = this.config.opentime;
        if (time) {
          let openTimeArr = this.config.opentime.split(',');
          this.openTimeList = openTimeArr.map(i => {
            return {
              time: i.split('-'),
            };
          });
        }
      }
    },
    // 重置配送时间
    resetSendTime() {
      if (this.config) {
        let time = this.config.sendtime;
        if (time) {
          let sendTimeArr = time.split(',');
          this.sendTimeList = sendTimeArr.map(i => {
            return {
              time: i.split('-'),
            };
          });
        } else {
          this.sendTimeList = [];
        }
      }
    },
    // 重置备餐时间
    resetSetupTime() {
      if (this.config) {
        this.setUpTime = this.config.preparetime;
        this.setUpTimeUnit = this.config.prepareunit || 'minute';
      }
    },
    // 重置开放对象
    resetOpenObj() {
      if (this.config) {
        this.openObj = (this.config.openobj && this.config.openobj.split(',')) || [];
      }
    },
    // 重置订单类型
    resetOrderType() {
      if (this.config) {
        this.orderType = (this.config.ordertype && this.config.ordertype.split(',')) || [];
      }
    },
    // 重置联系电话
    resetMobile() {
      if (this.config) {
        let mobile = this.config.mobile || '';
        this.mobileList = mobile.split(',');
        this.mobile = this.mobileList.join('，');
      }
    },
    // 重置提醒
    resetWarn() {
      if (this.config) {
        this.timeinfo = this.config.timeinfo || 5;
        this.maxitems = this.config.maxitems || 15;
      }
    },
    // 重置说明
    resetNote() {
      if (this.config) {
        this.note = this.config.note || null;
      }
    },
    // 重置图片
    resetPhoto() {
      if (this.config) {
        this.photo = this.config.photo || null;
      }
    },
    // 判断是否存在重复的时间
    isRepeat(timeArr) {
      let flag = false;
      for (let i = 0; i < timeArr.length; i++) {
        let curSt = timeArr[i][0];
        let curEt = timeArr[i][1];
        for (let j = i + 1; j < timeArr.length; j++) {
          let st = timeArr[j][0];
          let et = timeArr[j][1];
          flag =
            (curSt >= st && curSt <= et) ||
            (curEt >= st && curEt <= et) ||
            (curSt <= st && curEt >= et);
          if (flag) {
            this.$message({
              showClose: true,
              type: 'error',
              message: '存在重复的时间段！',
            });
            return flag;
          }
        }
      }
      return false;
    },
    // 保存餐厅配置
    saveCafeConfig(param, isRadio) {
      const svCafeConfig = () => {
        this.loading = true;
        saveCafeConfig(param)
          .then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功！',
              });
              this.isOpenTimeEdit = false;
              this.isSendTimeEdit = false;
              this.isSetupTimeEdit = false;
              this.isOpenObjEdit = false;
              this.isOrderTypeEdit = false;
              this.isMobileEdit = false;
              this.isWarnEdit = false;
              this.isNoteEdit = false;
              this.isPhotoEdit = false;
              this.isFixedTimeEdit = false;
              this.isPickupTimeEdit = false;
              this.isGoodsFixedTimeEdit = false;
              this.isPickupGoodsEdit = false;
              // this.isEdit = false;
              this.getCafeConfig();
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败！' + res.data.message,
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              showClose: true,
              type: 'error',
              message: '保存失败！' + err,
            });
          });
      };
      this.order_type_selected && (param.orderway = this.order_type_selected);
      svCafeConfig();
      // if (!this.config.orderway && isRadio) {
      //   this.$confirm('保存后将不能切换至另两项, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   }).then(() => {
      //   });
      // } else {
      //   svCafeConfig();
      // }
    },
  },
  created() {
    this.getMyCafe();
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 600;
  color: #373b4b;
  line-height: 22px;
  padding: 20px 10px 10px 20px;
  border-bottom: 1px solid #dbdbdb;
}
.content {
  padding: 20px;
  .item {
    font-size: 14px;
    font-weight: 400;
    color: #5f6464;
    line-height: 22px;
    margin-bottom: 10px;
    label {
      display: inline-block;
      width: 100px;
      line-height: 32px;
    }
    .btn {
      color: #3f86f7;
      cursor: pointer;
      margin-left: 20px;
    }
  }
}
.item-right {
  display: inline-block;
  width: calc(100% - 120px);
  vertical-align: top;
  & > div {
    line-height: 32px;
  }
}
.input-item {
  margin-bottom: 10px;
  i {
    margin-left: 10px;
    cursor: pointer;
  }
}
.add-btn {
  width: 350px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  border-radius: 4px;
  padding: 4px 0;
  margin-bottom: 10px;
  cursor: pointer;
}
.tips {
  margin-left: 10px;
  font-size: 12px;
  color: #f56c6c;
}
.date {
  width: 180px;
  height: 200px;
  &::before {
    content: '';
    width: 180px;
    top: 50%;
    position: absolute;
    margin-top: -15px;
    height: 40px;
    z-index: -1;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding-top: 6px;
    text-align: left;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
  }
  .date-column {
    display: inline-block;
    width: 80px;
    height: 100%;
    overflow-y: auto;
    &:not(:last-child) {
      margin-right: 20px;
    }
    ul {
      transform: translate(0, 95px);
    }
    li {
      height: 40px;
      padding: 0 4px;
      font-size: 16px;
      color: #999999;
      cursor: pointer;
      &.select {
        color: #373b4b;
      }
    }
  }
}
.upload-box {
  display: inline-block;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin: 8px 0;
  }
  img {
    display: block;
    height: 90px;
    width: 120px;
    object-fit: cover;
    margin-bottom: 10px;
  }
  .upload-box-img {
    position: relative;
    .hoverStyle {
      position: absolute;
      width: 120px;
      height: 90px;
      line-height: 90px;
      top: 0;
      left: 0;
      text-align: center;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.6);
      transition: opacity 0.3s;
      opacity: 0;
      cursor: pointer;
    }
    &:hover .hoverStyle {
      opacity: 1;
      i {
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
}
.img-box {
  display: inline-block;
  img {
    height: 90px;
    width: auto;
    max-width: 120px;
  }
  .btn {
    vertical-align: top;
  }
}
.order-type {
  width: 80%;
  background: #f3f3f3;
  border-radius: 3px;
  border: 1px solid #dbdbdb;
  & > div {
    margin: 16px 20px;
  }
}

.blue-edit {
  color: #3a78fc;
}
.flex-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.up-date {
  margin-top: 10px;
}
</style>