// 性别
const applyStatus = [
    { name: "草稿", id: "0" },
    { name: "审批中", id: "1" },
    { name: "未接收", id: "2" },
    { name: "已完成", id: "3" },
    { name: "已驳回", id: "8" },
    { name: "已撤回", id: "9" },
]

//资源申请单状态
const resApplyStatus = [
  { name: "单位领导审批中", id: "1" },
  { name: "白马办审批中", id: "2" },
  { name: "已完成", id: "3" },
  { name: "已驳回", id: "8" },
  { name: "已撤回", id: "9" },
]

/*//温网室资源申请单状态
const resApplyStatus2 = [
  { name: "单位领导审批中", id: "1" },
  { name: "白马办审批中", id: "2" },
  { name: "已完成", id: "3" },
  { name: "已驳回", id: "8" },
  // { name: "已撤回", id: "9" },
]*/

//实习申请单状态
const prApplyStatus = [
  { name: "草稿", id: "0" },
  { name: "单位领导审批中", id: "1" },
  { name: "白马办审批中", id: "2" },
  { name: "已完成", id: "3" },
  { name: "系统退回", id: "7" },
  { name: "已驳回", id: "8" },
  { name: "已撤回", id: "9" },
]



//资源状态
const resStatus = [
  { name: "空闲", id: "1" },
  { name: "未入驻", id: "2" },
  { name: "已入驻", id: "3" },
  { name: "已退出", id: "4" },
  { name: "申请中", id: "5" },
]

//号码验证
const testPhone = {pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '手机格式不正确', trigger: 'blur'}

var userInfo={};

var jzgList=[];

//资源类型列表
var resTypeList=[];

export default {
  applyStatus,resStatus,testPhone,userInfo,jzgList,resApplyStatus,resTypeList,prApplyStatus
}

export const nation_data = [
  { id: 1, name: "汉族" },
  { id: 2, name: "蒙古族" },
  { id: 3, name: "回族" },
  { id: 4, name: "藏族" },
  { id: 5, name: "维吾尔族" },
  { id: 6, name: "苗族" },
  { id: 7, name: "彝族" },
  { id: 8, name: "壮族" },
  { id: 9, name: "布依族" },
  { id: 10, name: "朝鲜族" },
  { id: 11, name: "满族" },
  { id: 12, name: "侗族" },
  { id: 13, name: "瑶族" },
  { id: 14, name: "白族" },
  { id: 15, name: "土家族" },
  { id: 16, name: "哈尼族" },
  { id: 17, name: "哈萨克族" },
  { id: 18, name: "傣族" },
  { id: 19, name: "黎族" },
  { id: 20, name: "傈僳族" },
  { id: 21, name: "佤族" },
  { id: 22, name: "畲族" },
  { id: 23, name: "高山族" },
  { id: 24, name: "拉祜族" },
  { id: 25, name: "水族" },
  { id: 26, name: "东乡族" },
  { id: 27, name: "纳西族" },
  { id: 28, name: "景颇族" },
  { id: 29, name: "柯尔克孜族" },
  { id: 30, name: "土族" },
  { id: 31, name: "达翰尔族" },
  { id: 32, name: "么佬族" },
  { id: 33, name: "羌族" },
  { id: 34, name: "布朗族" },
  { id: 35, name: "撒拉族" },
  { id: 36, name: "毛南族" },
  { id: 37, name: "仡佬族" },
  { id: 38, name: "锡伯族" },
  { id: 39, name: "阿昌族" },
  { id: 40, name: "普米族" },
  { id: 41, name: "塔吉克族" },
  { id: 42, name: "怒族" },
  { id: 43, name: "乌孜别克族" },
  { id: 44, name: "俄罗斯族" },
  { id: 45, name: "鄂温克族" },
  { id: 46, name: "德昂族" },
  { id: 47, name: "保安族" },
  { id: 48, name: "裕固族" },
  { id: 49, name: "京族" },
  { id: 50, name: "塔塔尔族" },
  { id: 51, name: "独龙族" },
  { id: 52, name: "鄂伦春族" },
  { id: 53, name: "赫哲族" },
  { id: 54, name: "门巴族" },
  { id: 55, name: "珞巴族" },
  { id: 56, name: "基诺族" }
];

// 白马角色id
export const roleId = { hq: "16000-6", bm: "16000-3" };

export const bmjd = "白马基地";

export const schoolZone = [
  { val: 1, name: "卫岗校区" },
  { val: 2, name: bmjd },
  { val: 3, name: "江北校区" },
  { val: 4, name: "牌楼基地" }
];

// 白马基地区域
export const bmBasement = [
  { val: 1, name: "基地宿舍" },
  { val: 2, name: "植物生产中心" },
  { val: 3, name: "表型大楼" },
  { val: 4, name: "基地其他区域" }
];

export const repairStatus = [
  { val: 0, name: "草稿" },
  { val: 1, name: "待处理" },
  { val: 2, name: "维修完工", icon: "completed" },
  { val: 3, name: "不维修", icon: "noRepair" },
  { val: 4, name: "维修结束", icon: "finish" }
];

export const bizNode = { start: "_START", bm: "_BM", hq: "_HQ" };

export const eventType = [
  { val: 1, name: "发起" },
  { val: 2, name: "转移" },
  { val: 3, name: "处理" },
  { val: 4, name: "评价" }
];

export const result = [
  { val: "3-1", name: "维修完工" },
  { val: "3-2", name: "不维修" },
  { val: "4-1", name: "已修复", icon: "smile.png", cIcon: "colorsmile.png" },
  { val: "4-2", name: "未修复", icon: "cry.png", cIcon: "colorcry.png" }
];

