# Project

jenkins: liken 123456 http://160.255.0.64:10086/
208080338/123 208080337
读者教育 http://172.20.0.116:11080/lres2022/rest/swagger-ui.html
白马 http://app.dev.angke.com.cn/bsermipweb/rest/swagger-ui.html
座位预约 svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc
http://seat.dev.angke.cn/mseat/#/index 手机端
svn://160.255.0.56/01module/lres/03code/lresweb/src/main/webapp/mobile_nh

https://720yun.com/t/c9fjr7syOu5


# 2022/5/6 读者教育
【feat】mixins:confirmDialog 4 exam and timing; result, examResult, examing; replace $message by Notify.

【fix】toExam(normal exam is the 0 index，otherwise no content);modelStep last item's text nowrap; exam component's canClick is only 4 normal exam

【fix】Notify(warning); img(object-fit: cover); Result component's CSS

【feat】circle for examing condition

2022/5/7
【feat】answerPop
【feat】examResult; publicPath

# 2022/5/9 座位预约
【feat】座位预约，排序上移下移 sectionManage

2022/5/10
【feat】importDialog(require xlsx)
【fix】interval-seat can't in border; import * as XLSX from equals require
【feat】check and transform excel data; export excel template; seatData's seats trigger seatSet component re-render

2022/5/11
【座位预定】增加查询预约记录和取消预约接口；增加预约记录路由:id和props:里的传参；assignRecord、preAssign；seatMap、assignDialog
【feat】timeChoose

2022/5/12
【座位预定】api and seat img；选座、日期、人员；取消预约的msgBox感叹号；el-tag的@close必须有参数。

【座位预定】timeChoose与assignDialog交互
1655 【后台管理_培训资料】分页问题汇总
1657 【后台管理_培训资料】查看资料页面，点击删除，功能不生效
1660 【后台管理_培训资料】删除资料弹窗文字换行显示

2022/5/16
【富文本】1、斜体不生效 2、引用不生效 3、表格没有样式 1656 【后台管理_培训资料】保存资料成功后，点击查看资料，页面跳转undefined。

1663 【后台管理_题库管理】新增单选题保存成功后，弹窗新增下一题页面，输入选项不成功，页面报错。切换题型，表单内容串了；新增时，不是当前列表的题型；编辑时，不应当还能切换题型。删除时，pagesize紊乱。

radio的默认有值时，该值不能点击，所以要设为null。1664 【后台管理_题库管理】题库列表删除任一题目后，列表自动刷新显示题数不正确。

1666 【后台管理_考试管理】考试记录统计不正确；1665 【后台管理_题库管理】导出题库功能不生效

2022/5/17
修复poolMax书写错误，1670 【管理端_考试管理】编辑考试，当组卷信息中的题目模块发现变更时，题目数量直接变更为空，需要重新编辑修改

1671 【管理端_考试管理_闯关考试】新增闯关考试关卡题目均为0保存成功，再次编辑页面报错
1672 【管理端_考试管理_闯关考试】编辑闯关考试，关卡显示新增的分类模块以及模块下面的题目数量可以选择
1677 【后台管理_用户管理】点击勾选功能不生效，点击用户导出页面报错
1667 【PC端_入馆考试】当前没有试卷的时候，仍然显示该学生类型可以学习的资料      // 没有考试时，学习资料为普通考试形式展示，原闯关资料也可以浏览
1669 【PC端_入馆考试】考试合格分为30分，0分通过后图书证首页显示激活
    
2022/5/18
el-dialog v-modal高度，scrollIntoView()；字符串的includes不准确；三个异步接口的顺序问题。
1668 【PC端_入馆考试】学习资料显示不全
1674 【PC端_闯关考试】学习时长不够，应当无法点击立即考试
1676 【PC端_闯关考试】闯关考试第三关部通过后，返回入馆考试页面，多次刷新考试页面，显示重新从第一关开始考试
1675 【PC端_闯关考试】考试不通过，图片不显示
1662 【后台管理_培训资料_在线文章】在线文章，没有下载功能，查看详情不需要下载量和大小统计

2022/5/19
1686 【PC端_入馆考试】限制IP访问后，在限制范围内的IP，不能参加考试

2022/5/23
feat：管理端富文本框从wangEditor改为angkeEditor，且手机端无需预览，管理端预览为富文本框内部的移动端预览。1659 【后台管理_培训资料】新增资料页面，手机端和PC端预览功能不生效

# 2022/5/25 白马基地
feat：pc、移动端的泵水审批，增加批量审批功能。 options换行复用。 props多个type用|。webpack：'st@tic': resolve('static');
移动端按需引入ElementUi
import { Table, TableColumn, Checkbox } from 'element-ui';
Vue.use(Table).use(TableColumn).use(Checkbox)

2022/5/26
fix: 移动端audit表格高度NaN。
移动端按需引入ElementUi

2022/5/27
feat：隐藏basicLayout；增加功能模块首页funModule；批量审批按钮是传参路由；批量审批归于详情页，判断isBatch，伸缩。默认跳到灌水审批。
feat: 1、灌溉申请页面，灌溉日期后增加选择“全天”“上午”或“下午”；
                  2、灌溉用水申请中，可自动显示本人名下的科研项目名称，进行选择；填写项目名称时，有红字提示“请规范详实填写项目名称”

2022/5/30
角色：水电工

菜单：移动端手机端 水电工接收页面

功能说明：页面样式及显示字段调整，日期默认当天，增加按全天、上午、下午显示

字段：学院名称、灌溉类型、资源编号、田间值守人、联系方式、状态、操作

前端展示：可滑动展示更多字段，操作列固定

2022/5/31
feat:学生信息表-详情
.use(Input).use(DropdownMenu).use(DropdownItem)

2022/6/6
2213 实习申请导入学生信息 界面。菜单：本科生实习-》本科生实习申请
功能说明：申请界面上传学生信息表时增加弹框提示“请按模板上传学生信息表，否则将无法通过审核”，提交实习申请时，增加弹窗“友情提醒：实习期间，未经允许，请勿随意进入他人实验区域”；学生信息表导入后可在线编辑。
学生信息表模板字段：班级、姓名、学号、身份证号、性别、民族；
规则：字段均必填，未填导入失败；

userInfo 判断16000-6是后勤管理员。准备把学生信息表下载链接放在表格中。
feat: html2canvas,jspdf

2022/6/7
功能说明：增加后勤管理员角色；本科生实习申请中需要用餐的申请，在基地管理员审核后，增加后勤管理员审核，后勤管理员可查看基地管理员审核后的本科生实习信息、打印申请表，申请表包含申请信息、审核信息

myRepairs:  status  0草稿； 1,2,3,4已报修
pageQuery:  bizNode未处理；handledNode已处理；movedNode已转移。角色对应值 _START， _BM，_HQ
        过滤里的filter中：keyword: 标题和内容。 标题增加了title字段，来应对搜索。
/bmRepair/countFlag  {createId: userID}和 bizNode
photos:  "id1,id2"
myTasks: bizNode,   status (integer, optional): 0待办1完成 ,

2022/6/8
feat: report/repair; 16000-6; childNodes; transToPdf

2022/6/10
feat:report pics,imgs css; 合并文件和函数; api.js, 'GET'。

2022/6/13
feat:handle/repaired

2022/6/14
一级菜单: 在线报修  
二级菜单: 
        我要报修 DISPLAYURL: "/repair/report"
        后勤保修审批 DISPLAYURL: "/repair/hq_handle"    
        白马保修审批 DISPLAYURL: "/repair/bm_handle"    
一级菜单：我的消息 DISPLAYURL: "/mission/my_message"     

实习审批，移动端   /practice-audit-bm
实习审批，PC端，白马   /practive-BM-audit
                后勤  /practive-HQ-audit


2022/6/16
feat: detail,editReport,list,report,window.g.url,router; mock sideBar
        mobile fix: markscore=1; 更多暗色；badge left 50%；

2022/6/17
feat: move,judge;fix: curRole,checkbox,opinions,

2022/6/20
feat: hqList,bmList,pc端路由区分，移动端curRole点击区分。 报修办理的3个Tab后添加数量。
feat: hqList,bmList,pc端路由区分，移动端curRole点击区分。 新增后勤角色在funModule的图片。
fix: myMessage；批量转移。

# 2022/6/21 线上订餐
feat： loading, /dist；需求会。

2022/6/23
feat: cafeSetting; order/cafe; 订餐、净菜、货品预定； 时间处理和校验； $和|以及逗号分隔。

2022/6/24
fix: 列表展示所有餐厅，使适应orderway不是1的情况，没有sendtime等字段的情况。   时间禁选的pickerOptions要等到focus时才赋值。
pickupTimeText公共函数产生新增加的tips。