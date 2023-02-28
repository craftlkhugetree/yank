import common from "./common";

const code = "url";
const authCode = "auth";
const fileCode = "file";
const menuCode = "appportal";
const service = "service";
const viewUrl = window.g.viewUrl;
const richText = "dd_rich_text";
const REPLY = "reply";
const FORM = "form";
const imgType = "png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg";
const ST = "starttime";
const ET = "endtime";
const roleName = "roleName";
const userId = "userId";
const handleNode = "handleNode";
const handleDeptId = "handleDeptId";
const DCJC = "DCJC";
const YWZX = "YWZX";
const DCGL = "DCGL";
const showNav = true;
const barRight = "角色首页";
const STR = {
  jxzg: "继续整改",
  qrtg: "确认通过",
  zy: "我要转移",
  fk: "处理反馈"
};
const TAB = {
  tab1: "tab1",
  tab2: "tab2"
};
const routeId = [
  { rid: "20230203-2", path: "/index-admin", rName: DCGL, name: "督查管理员" },
  { rid: "20230203-3", path: "/index", rName: DCJC, name: "督查人员" },
  { rid: "20230203-4", path: "/index-ywzx", rName: YWZX, name: "业务中心人员" }
];
const roleStatus = {};
roleStatus[DCJC] = [
  {
    text: "继续整改",
    icon: "iconfont iconpinglun1",
    color: "#8C8C8C",
    exist: obj => obj.status != "3",
    btn: STR.jxzg
  },
  {
    text: "确认通过",
    icon: "iconfont iconwinking",
    color: "#8C8C8C",
    exist: obj => obj.status != "3",
    btn: STR.qrtg
  },
  {
    text: "整改通过",
    icon: "iconfont iconcheck1",
    color: "#FF9900",
    exist: obj => obj.status == "3"
  }
];
roleStatus[YWZX] = [
  {
    text: "转移",
    icon: "iconfont iconzhuanyi",
    color: "#8C8C8C",
    exist: obj => obj.status == "1" && !common.isMoved(obj),
    btn: STR.zy
  },
  {
    text: "反馈",
    icon: "iconfont iconpinglun1",
    color: "#8C8C8C",
    exist: obj => obj.status == "1" && !common.isMoved(obj),
    btn: STR.fk
  },
  {
    text: "整改通过",
    icon: "iconfont iconcheck1",
    color: "#FF9900",
    exist: obj => obj.status == "3"
  },
  {
    text: "已处理：待复查确认",
    icon: "iconfont iconinfo1",
    color: "#FF9900",
    exist: obj => obj.status == "2"
  }
];
roleStatus[DCGL] = [
  {
    text: "继续整改",
    icon: "iconfont iconpinglun1",
    color: "#8C8C8C",
    exist: obj => obj.status != "3" && obj.createId === common.getStore(userId),
    btn: STR.jxzg
  },
  {
    text: "确认通过",
    icon: "iconfont iconwinking",
    color: "#8C8C8C",
    exist: obj => obj.status != "3" && obj.createId === common.getStore(userId),
    btn: STR.qrtg
  },
  {
    text: "待处理反馈",
    icon: "iconfont iconinfo1",
    color: "#FF9900",
    exist: obj => obj.status == "1" && obj.createId !== common.getStore(userId)
  },
  {
    text: "已处理：待复查确认",
    icon: "iconfont iconinfo1",
    color: "#FF9900",
    exist: obj => obj.status == "2" && obj.createId !== common.getStore(userId)
  },
  {
    text: "整改通过",
    icon: "iconfont iconcheck1",
    color: "#FF9900",
    exist: obj => obj.status == "3"
  }
];
export default {
  code,
  authCode,
  fileCode,
  menuCode,
  viewUrl,
  service,
  roleStatus,
  FORM,
  richText,
  imgType,
  ST,
  ET,
  handleNode,
  handleDeptId,
  DCJC,
  YWZX,
  DCGL,
  showNav,
  STR,
  REPLY,
  roleName,
  userId,
  TAB,
  barRight,
  routeId
};
