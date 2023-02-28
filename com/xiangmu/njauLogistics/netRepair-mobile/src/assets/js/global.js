const code = "url";
const authCode = "auth";
const fileCode = "file";
const menuCode = "appportal";
export default {
  code,
  authCode,
  fileCode,
  menuCode
}
//项目方法
let statusMap = {
  '1': '等待派单',
  '2': '等待派单',
  '3': '维修中',
  '4': '待评价',
  '5': '完成',
}
let faulttypeMap = {
  '1': '后勤维修',
  '2': '网络维修',
  '3': '消防类',
}
export let eventtype = {
  1: "办理",
  2: "撤回",
  3: "退回",
  4: "处理",
  5: "评价",
  6: "转移",
};
export function setListInfo(listItem) {
  let item = _.cloneDeep(listItem);
  item.markscore = parseInt(item.markscore);
  item.statusname = statusMap[listItem.applystatus];
  item.faulttypename = faulttypeMap[listItem.faulttype];
  if (item.applycontinues) {
    item.applycontinues.forEach(i => {
      i.photoList = i.photos ? i.photos.split(",") : []
    });
    item.applycontinues.sort((a, b) => {
      return a.createtime > b.createtime ? 1 : -1;
    })
  }
  return item;
}
