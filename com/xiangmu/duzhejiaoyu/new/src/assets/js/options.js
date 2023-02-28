// 性别
const applyStatus = [
    { name: "草稿", id: "0" },
    { name: "审批中", id: "1" },
    { name: "未接受", id: "2" },
    { name: "已完成", id: "3" },
    { name: "已驳回", id: "8" },
    { name: "已撤回", id: "9" },
]

const fileList=[
  {value: 1,label: '视频'}, 
  {value: 2,label: '文档'},
  {value: 3,label: '在线文章'}
  ]

export default {
  applyStatus,fileList
}
