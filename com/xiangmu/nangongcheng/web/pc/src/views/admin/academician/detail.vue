<template>
  <div class="base-search-table">
    <div class="search-box clearfix" style="padding-bottom: 20px">
      <span class="go-back" @click="$router.go(-1)">&lt;&nbsp;&nbsp;&nbsp;返回</span>
      <el-divider direction="vertical"></el-divider>
      <span class="ys_title">院士信息</span>
    </div>
    <el-form ref="pForm" :model="pForm" label-width="150px" label-position="left" class="pform">
      <el-form-item prop="name" label="院士姓名">
        <span class="pname">{{ pForm.name }}</span>
      </el-form-item>
      <el-form-item prop="profile" label="人物介绍">
        <div class="ptext" :title="pForm.profile">{{ pForm.profile }}</div>
      </el-form-item>
      <el-form-item prop="media" label="音频/视频/图片">
        <div class="div_flex">
          <div v-for="img of fileList" :key="img.id">
            <div
              v-if="isVideo(img.fileType) || isAudit(img.fileType)"
              class="imgPos"
              @click="openImg(img)"
            >
              <img class="video_class" :src="img.cover" alt="" />
              <img class="videoplay_class" :src="require('@/assets/img/play.jpeg')" alt="" />
            </div>
            <!-- <div v-else-if="img.fileType === 'mp3'" class="video_class img_alt">暂无封面</div> -->
            <el-image
              v-else
              class="video_class"
              :src="img.viewUrl"
              :preview-src-list="[img.viewUrl]"
              fit="contain"
            ></el-image>
            <span class="txt ellipsis" :title="img.name">{{ img.name }}</span>
          </div>
        </div>
        <el-button @click="openDrawer(pForm)" type="primary" plain size="small">编辑</el-button>
      </el-form-item>
    </el-form>
    <detail-table :id="id" :rs="rs"></detail-table>
    <edit-drawer ref="editDrawer" :rs="rs" @doFunc="getById"></edit-drawer>
  </div>
</template>

<script>
import { personFind } from '@/api/person';
import { mvType, auditType } from '@/assets/js/options';
export default {
  name: 'AcadeDetail',
  components: {
    detailTable: () => import('./detailTable'),
    editDrawer: () => import('./editDrawer'),
  },
  props: {
    id: String,
  },
  data() {
    return {
      pForm: {},
      rs: 1,
      fileList: [],
    };
  },
  computed: {
    isVideo() {
      return function(type) {
        return mvType.indexOf(type) > -1;
      };
    },
    isAudit() {
      return function(type) {
        return auditType.indexOf(type) > -1;
      };
    },
  },
  methods: {
    getById() {
      personFind(this.id).then(res => {
        if (res && res.code === '000000') {
          this.pForm = res.data;
          this.fileList = [];
          res.data.attachs &&
            res.data.attachs.forEach(a => {
              let obj = { ...a };
              obj.viewUrl = window.g.viewUrl + a.id;
              this.fileList.push(obj);
            });
          this.getVideoCanvas(this.fileList);
        }
      });
    },
    // 视频截图封面图
    getVideoCanvas(videoList) {
      var videoCanList = []; // 因为后端返回的视频数组，这里先定义一个空数组
      videoList.forEach(item => {
        if (this.isVideo(item.fileType)) {
          // for循环获取到的视频数组
          // 因为是循环处理，这里定义一个promise函数
          var promise = new Promise(reslove => {
            // 在缓存中创建video标签
            var video = document.createElement('VIDEO');
            // 通过setAttribute给video dom元素添加自动播放的属性，因为视频播放才能获取封面图;
            video.setAttribute('autoplay', 'autoplay');
            // 再添加一个静音的属性，否则自动播放会有声音
            video.setAttribute('muted', 'muted');
            video.currentTime = 1;
            video.setAttribute('src', item.viewUrl);
            video.setAttribute('crossOrigin', 'anonymous'); //设置跨域 否则toDataURL导出图片失败
            // 上面我们只是创建了video标签，视频播放需要内部的source的标签，scr为播放源;
            // video.innerHTML = '<source src=' + item.viewUrl + ' crossorigin="anonymous">';
            // 再创建canvas画布标签
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // video注册canplay自动播放事件
            video.addEventListener(
              'canplay',
              function() {
                // 创建画布的宽高属性节点，就是图片的大小，单位PX
                var anw = document.createAttribute('width');
                // anw.nodeValue = 160;
                anw.nodeValue = video.videoWidth;
                var anh = document.createAttribute('height');
                // anh.nodeValue = 90;
                anh.nodeValue = video.videoHeight;
                // console.log(video.videoWidth, video.videoHeight);
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                // 画布渲染
                ctx.drawImage(video, 0, 0, anw.nodeValue, anh.nodeValue);
                // 生成图片
                var base64 = canvas.toDataURL('image/png'); // 这就是封面图片的base64编码
                // 视频结束播放的事件
                video.pause();
                item.cover = base64;
                reslove(base64); // promise函数成功的回调
              },
              false
            );
          });
          videoCanList.push(promise); // 这里将每一次promise函数成功回调的结果push进一开始定义的空数组
        } else if (this.isAudit(item.fileType)) {
          item.cover = require('@/assets/img/noCover.png');
        } else {
          item.cover = item.viewUrl;
        }
      });
      // 通过Promise.all方法等待上面的循环结束这里再执行业务逻辑
      Promise.all(videoCanList).then(() => {
        this.fileList = [...this.fileList];
        // console.log(res); // 这里就是每一张视频的封面图
      });
    },

    // 打开弹窗
    openDrawer(row) {
      let drawer = this.$refs.editDrawer;
      drawer.title = '编辑院士-' + row.name;
      drawer.editForm = row;
      row.attachs &&
        row.attachs.forEach(a => {
          drawer.fileList.push({ ...a });
        });
      drawer.drawer = true;
    },
    openImg(obj) {
      window.open(obj.viewUrl, obj.fileName);
    },
  },
  mounted() {
    this.getById();
  },
};
</script>
<style lang="scss" scoped>
.ys_title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  /* 黑色/85 */
  color: rgba(0, 0, 0, 0.85);
}
/deep/ .el-divider--vertical {
  margin: 0 15px;
}
.pform {
  background: #ffffff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
  padding: 10px 20px 10px 20px;
  margin: 10px 0;

  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .pname {
    /* 主色/主色 */
    color: #3a78fc;
  }
  .pname,
  .ptext {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px !important;
    display: inline-block;
    vertical-align: middle;
    width: 95%;
    white-space: normal;
    word-wrap:break-word;
  }
  .div_flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      margin-top: 10px;
      margin-right: 20px;
    }
    .imgPos {
      position: relative;
      cursor: pointer;
    }
    .video_class {
      width: 160px;
      height: 90px;
    }
    .videoplay_class {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      opacity: 0.6;
    }
    .txt {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      display: block;
      width: 150px;
      line-height: 20px;
    }
  }
  /deep/ .el-form-item__label {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: bolder;
    /* 黑色/85 */
    color: rgba(0, 0, 0, 0.85);
  }
}
.img_alt {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background: #f5f7fa;
  color: #c0c4cc;
  vertical-align: middle;
}
</style>
