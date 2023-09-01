打印机 160.255.1.19
服务接口认证信息
APPID：1b63f344
APISecret：ODMyMTFlNDhlMWRjMzg2NjQxMzQ4ZjRi
APIKey：1fe443319e96410ffb4f9989ed7cafdc
百度地图开发申请账号：
账号：NJAngke
密码：Angke@52333181
baiduToken: "a8FktrSeMsSVs4pWh3vWMQvpSohO9i0v",


天地图：a78161064fc4c8eae8af9dcacce349cb
  SkyToken: "f6b99f9bc16051a55b8249297e538251",
公司wifi: dkr84813279

http://ddzs.njau.edu.cn/ddzsmobile 1993032/HBli123456
孟丽丽：T2015152 密码：basili951008!

# Project

https://z.angke.com.cn/ 账户 liken 密码 Liken123
jenkins: liken 123456 http://160.255.0.64:10086/
svn: liken123
lanhu: 123456

208080338/123 208080337
读者教育 http://172.20.0.116:11080/lres2022/rest/swagger-ui.html
白马 http://app.dev.angke.com.cn/bsermipweb/rest/swagger-ui.html
座位预约 svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc
http://seat.dev.angke.cn/mseat/#/index 手机端 admin/123
svn://160.255.0.56/01module/lres/03code/lresweb/src/main/webapp/mobile_nh

民国库 前端 http://172.20.1.251:8085/book/h5/index/index.html
后台 http://172.20.1.251:8085/appportalweb/ admin/123 Admin/Mgjsk@2019\_&
民国库向日葵：172 988 279 3ZW3oN

https://720yun.com/t/c9fjr7syOu5

南农 bm 正式：
https://authserver.njau.edu.cn/authserver/login?service=http%3A%2F%2Fbmjd.njau.edu.cn%2Fidsweb%2Frest%2FCas2Login%2Flogin%3FreqKey%3D4251609
T2019037 020613xiu; 你好，我的账号 2014069，密码 pswd0923
读者教育：
http://172.20.1.236/lres/control reader/123
http://172.20.1.236/lres/web/index.html 208080337/888
http://172.20.1.236/lres/mobile/index.html

座位预约：
http://seat.dev.angke.cn/seatweb/#/section-manage
http://seat.dev.angke.cn/mseat/#/index
seat 123
https://tsgzwyy.xijing.edu.cn/seatweb/index.html  
用户名 seat 密码 Seat@52333181

南农
http://myportal.njau.edu.cn/new/index.html 1993032/HBli123456

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
【fix】interval-seat can't in border; import \* as XLSX from equals require
【feat】check and transform excel data; export excel template; seatData's seats trigger seatSet component re-render

2022/5/11
【座位预定】增加查询预约记录和取消预约接口；增加预约记录路由:id 和 props:里的传参；assignRecord、preAssign；seatMap、assignDialog
【feat】timeChoose

2022/5/12
【座位预定】api and seat img；选座、日期、人员；取消预约的 msgBox 感叹号；el-tag 的@close 必须有参数。

【座位预定】timeChoose 与 assignDialog 交互
1655 【后台管理*培训资料】分页问题汇总
1657 【后台管理*培训资料】查看资料页面，点击删除，功能不生效
1660 【后台管理\_培训资料】删除资料弹窗文字换行显示

2022/5/16
【富文本】1、斜体不生效 2、引用不生效 3、表格没有样式 1656 【后台管理\_培训资料】保存资料成功后，点击查看资料，页面跳转 undefined。

1663 【后台管理\_题库管理】新增单选题保存成功后，弹窗新增下一题页面，输入选项不成功，页面报错。切换题型，表单内容串了；新增时，不是当前列表的题型；编辑时，不应当还能切换题型。删除时，pagesize 紊乱。

radio 的默认有值时，该值不能点击，所以要设为 null。1664 【后台管理\_题库管理】题库列表删除任一题目后，列表自动刷新显示题数不正确。

1666 【后台管理*考试管理】考试记录统计不正确；1665 【后台管理*题库管理】导出题库功能不生效

2022/5/17
修复 poolMax 书写错误，1670 【管理端\_考试管理】编辑考试，当组卷信息中的题目模块发现变更时，题目数量直接变更为空，需要重新编辑修改

1671 【管理端*考试管理*闯关考试】新增闯关考试关卡题目均为 0 保存成功，再次编辑页面报错
1672 【管理端*考试管理*闯关考试】编辑闯关考试，关卡显示新增的分类模块以及模块下面的题目数量可以选择
1677 【后台管理*用户管理】点击勾选功能不生效，点击用户导出页面报错
1667 【PC 端*入馆考试】当前没有试卷的时候，仍然显示该学生类型可以学习的资料 // 没有考试时，学习资料为普通考试形式展示，原闯关资料也可以浏览
1669 【PC 端\_入馆考试】考试合格分为 30 分，0 分通过后图书证首页显示激活

2022/5/18
el-dialog v-modal 高度，scrollIntoView()；字符串的 includes 不准确；三个异步接口的顺序问题。
1668 【PC 端*入馆考试】学习资料显示不全
1674 【PC 端*闯关考试】学习时长不够，应当无法点击立即考试
1676 【PC 端*闯关考试】闯关考试第三关部通过后，返回入馆考试页面，多次刷新考试页面，显示重新从第一关开始考试
1675 【PC 端*闯关考试】考试不通过，图片不显示
1662 【后台管理*培训资料*在线文章】在线文章，没有下载功能，查看详情不需要下载量和大小统计

2022/5/19
1686 【PC 端\_入馆考试】限制 IP 访问后，在限制范围内的 IP，不能参加考试

2022/5/23
feat：管理端富文本框从 wangEditor 改为 angkeEditor，且手机端无需预览，管理端预览为富文本框内部的移动端预览。1659 【后台管理\_培训资料】新增资料页面，手机端和 PC 端预览功能不生效

# 2022/5/25 白马基地

feat：pc、移动端的泵水审批，增加批量审批功能。 options 换行复用。 props 多个 type 用|。webpack：'st@tic': resolve('static');
移动端按需引入 ElementUi
import { Table, TableColumn, Checkbox } from 'element-ui';
Vue.use(Table).use(TableColumn).use(Checkbox)

2022/5/26
fix: 移动端 audit 表格高度 NaN。
移动端按需引入 ElementUi

2022/5/27
feat：隐藏 basicLayout；增加功能模块首页 funModule；批量审批按钮是传参路由；批量审批归于详情页，判断 isBatch，伸缩。默认跳到灌水审批。
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

userInfo 判断 16000-6 是后勤管理员。准备把学生信息表下载链接放在表格中。
feat: html2canvas,jspdf

2022/6/7
功能说明：增加后勤管理员角色；本科生实习申请中需要用餐的申请，在基地管理员审核后，增加后勤管理员审核，后勤管理员可查看基地管理员审核后的本科生实习信息、打印申请表，申请表包含申请信息、审核信息

myRepairs: status 0 草稿； 1,2,3,4 已报修
pageQuery: bizNode 未处理；handledNode 已处理；movedNode 已转移。角色对应值 \_START， \_BM，\_HQ
过滤里的 filter 中：keyword: 标题和内容。 标题增加了 title 字段，来应对搜索。
/bmRepair/countFlag {createId: userID}和 bizNode
photos: "id1,id2"
myTasks: bizNode, status (integer, optional): 0 待办 1 完成 ,

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

实习审批，移动端 /practice-audit-bm
实习审批，PC 端，白马 /practive-BM-audit
后勤 /practive-HQ-audit

2022/6/16
feat: detail,editReport,list,report,window.g.url,router; mock sideBar
mobile fix: markscore=1; 更多暗色；badge left 50%；

2022/6/17
feat: move,judge;fix: curRole,checkbox,opinions,

2022/6/20
feat: hqList,bmList,pc 端路由区分，移动端 curRole 点击区分。 报修办理的 3 个 Tab 后添加数量。
feat: hqList,bmList,pc 端路由区分，移动端 curRole 点击区分。 新增后勤角色在 funModule 的图片。
fix: myMessage；批量转移。

# 2022/6/21 线上订餐

feat： loading, /dist；需求会。

2022/6/23
feat: cafeSetting; order/cafe; 订餐、净菜、货品预定； 时间处理和校验； $和|以及逗号分隔。

2022/6/24
fix: 列表展示所有餐厅，使适应 orderway 不是 1 的情况，没有 sendtime 等字段的情况。 时间禁选的 pickerOptions 要等到 focus 时才赋值。
pickupTimeText 公共函数产生新增加的 tips。

2022/6/27
fix: disabledTime && minDate
fix: 货品预定类，默认日期 1970 不是[],而是[null, null]； radio disable 及保存提示
fix: 橙色提示；超出开放时间用了单边或，不合理之处在于：处于当前端中，下一段肯定不符合；时间函数 undefined

2022/6/28
fix: 编辑页面；期望函数 expectFetch()；pc 端支付成功提示。

fix: orange-font >span； isDev

2022/6/30
webpack 按需引入 lodash，require 存在 common 里，不同模块引用。

# 2022/07/01 服务监督

http://app.dev.angke.com.cn/supervision-api/rest/swagger-ui.html

2022/07/04
fix:orderfood-m 年货类修改订单，不需要预期时间；pc 端餐厅类型改为可以修改！
fix: [serviceSupervision]i.USER.includes；新增用户时清空 keyword；删除业务领域时直接调接口；新增用户时带出其已有的业务领域。

fix:orderfood-pc 端餐厅类型改为可以修改,预定时间按钮统一置于下方。

2022/07/05
fix: orderfood-m 编辑页面期望日期。
fix: orderfood-m 编辑页面期望日期未带出；各页面期望取餐未加粗。 orderfood-pc 详情页 orderway == 3 写反了；只有订餐才有几点几分。

# 2022/07/06 白马科教资源

白马科教资源需求会

2022/07/07
prdetail,prdialog 被多个组件调用，props 和 query 的统一。 转化当天日期的函数 ymd 增加参数后可转化传入的日期。

2022/07/11
feat: 角色：基地管理员
功能
① 资源库维护：卡片改成列表样式，操作增加“资源管理”，可进行资源的添加、删除和导入、开启关闭等基础管理操作；

② 　新增资源类型操作中，规则编辑框，文字可换行，换行后生成的协议文件排版中也换行，协议文件格式重新排版设计；

③ 　资源管理操作：新增、下载模板、导入等操作规则同原来资源日常管理列表一样；

备注：手机端资源类型及资源管理去掉

2022/07/12
feat：空闲资源 idle；back()；router.js；api.js

2022/07/13
feat：申请记录及详情、领导审批、confirmDialog.vue、resProcess.vue 区别于原有的灌溉进度条。

2022/07/14
feat：白马办审批及详情、完善进程条和审批记录(events，process)

2022/07/15
feat：我的资源，resDetail,

2022/07/18
feat：编辑联系人；资源入驻管理

2022/07/19
feat：协议 agreementForm 在新租和续租的对话框中，以及列表中的下载。

2022/07/20
feat：申请表、交接单
feat：费用管理、费用结算；费用导出

2022/07/21
feat: 白马 pc 端资源入驻信息无限滚动。

2022/07/25
feat: 移动端 bm 我的资源、空闲资源，资源详情，入住资源及状态，入住资源伸缩，申请、续租表单。 resProcess。申请列表。三种文件，及对应预览和转化为 pdf 下载。
fix: pc 端搜索有时是 resName；我的资源的 resList 不能是空闲。

2022/07/26
feat：移动端领导、白马办审核资源；资源入驻管理。缴纳水电费。费用管理和结算。
fix：退出时直接用接口查出的类型和资源，不用 liveList 筛选出的。pdf 样式 padding 调整。

2022/07/27
fix: pc 端实习申请的餐食日期 blur 不更新；多选禁用在不同 tab 不同；更改水电上传图片按钮。学生信息表样式。

空闲资源 path: "/idle-resource",
资源入驻管理(原来的资源日常管理) path: "/resource-info-management",
费用结算 path: "/resource-teacher-fee",
费用管理 path: "/resource-BM-fee",
去掉科教资源的报修菜单

2022/08/01
fix: 移动端菜单隐藏
fix: 网上订餐保存订餐地址作为默认。
feat: 1、在区间管理列表添加 签到地址 操作，点击直接复制到剪切板里
2、签到地址生成规则：域名+ sign3.html?SECTIONID=

# 座位预约大屏 bigScreen

feat: 1、按照设计图卡法新版签到页面 sign3.html
2、链接需添加区间 ID sign3.html?SECTIONID=
3、二维码生成规则：扫码信息为 json 格式。
包含：
appid:这个学工统一提供
clickType：跳转类型，固定值为 URL。
clickContent:跳转内容，我们的访问链接，见 sign.html。

# 2022/08/02 民国库

mgsjk

2022/08/03
feat: 用户端
功能：1、若有处于弹框有效期内的公告，直接在首页弹出窗口展示
2、在首页添加公告列表，显示 3 排序靠前 3 条通知公告

2022/08/04
feat: 3、添加新闻通知列表页和详情页

2022/08/08
feat: 书籍搜索弹框，高亮关键词，点击跳转该页。
1、检索结果默认显示 5 条，加载更多时再显示 5 条，没有更多数据时，加载更多按钮隐藏
2、检索未前端检索，通过加载 对应图书 docbook/main.xml 里面的内容进行检索

# 2022/08/10 民国库后台

feat: 菜单：客户管理》统计查询
功能：查询、导出 excel
字段： 检索（客户名称、IP、检索关键词、账号、检索时间） 对应表 WXK_DOWNRECORD
下载 （客户名称、IP 、书名、页码、账号、下载时间）对应表 WXK_SEARCHRECORD
阅读（客户名称、IP、书名、账号、阅读时间） 对应表 WXK_READRECORD

            客户表：CRM_CUSTOMER
            图书信息表： WXK_BOOK_CNMARC

查询条件：客户、时间段
D:\kxiangmu\mgsjk\03code\bemweb\src\main\webapp\view\classificationStats

2022/08/11
fix：【二期 PC 端*科教资源*费用管理】列表单价显示为空；【二期 PC 端*科教资源*缴费记录】水电费计算不正确
fix：【二期 PC 端*科教资源*申请审批】审批列表，审批人为空；1693 【二期 PC 端*本科生实习*实习审批】本科生实习审批列表可以按照实习时间进行排序
fix：1689 【二期 PC 端*本科生实习*申请】查看学生信息表，样式修改；1690 【二期 PC 端*灌溉用水*申请】提交灌溉申请，页面无反应；【二期 PC 端*灌溉用水*申请】查看申请单详情，灌溉日期详情包含全天/上午/下午
fix：1692 【二期 PC 端*本科生实习*实习审批】白马办查看已审批列表，存在申请单不显示申请表；审批状态

2022/08/12
fix：实习申请，日期限制要加 1，否则后台报错；后勤审批 process 及文字；
test: process iseat == 0; 餐食申请中途驳回;
fix：1711 【二期 PC 端*共通】系统中所有的白马办更为基地，审批流程改为基地审批
fix：退出资源的申请不能撤回；1708 【二期 PC 端*在线报修*报修处理】转移的时候，白马管理员修改为基地管理员，进度展示中，同样修改为基地管理员；1706 【二期 PC 端*在线报修\_报修处理】点击已处理，图标换行显示，同我要报修--我的报修；
fix：点击状态图标调用接口，且查询'2,3,4'；维修完成调用$parent.changeTab；内部错误；半选；
fix：重置报修表单；状态待维修；进展不显示报修人图片；我的报修全部状态是'1,2,3,4'

2022/08/15
fix：续租提示为基地管理员；审批人 charger()；opinions 内 v-else；
feat：reportList,gLoading。1、右侧我的报修，显示查看详情按钮，点击后，报修内容展开下放显示，点击收起详情，收起内容

2022/08/17
fix：报修进展的图片被条件屏蔽；报修草稿编辑的 title 被覆盖；limitday；水电工无 pc 端菜单，移动端直接进入。

2022/08/19
fix：协议合计金额溢出；实习申请单；灌溉对话框的查询资源接口调用延后。
2022/08/25
fix：座位预约 occupyList,showList
feat：座位预约 renameId(), 补墙去空

2022/08/29
fix：moveNode, pending,
feat：vue.component('name', comp); res.items[0]; 4 help pngs

去掉 path: "/spresRepair",
修改 科教资源欠费统计表——菜单名称变更为 “科教资源收费统计”
新增 本院科研项目统计 path: "/projectHistory/leadership",
新增 本院基地学生实习统计 path: "/prapply/leadership",

2022/08/30
feat：seatMobile 在 config.js 里面添加 isAppointTime : true ,可自由选择预约时间；false 默认选择所有时间 并且不可更改，去选择 按钮隐藏，选择时间段改为时间段。
seatMobile tag: scale4tags

# appointment-门禁管理 2022/09/06

NAME: '门禁管理', DISPLAYURL: '/entrance-guard-manage',

- sideBar.vue; screen 3 页面的 url

# 网上报修 2022/09/07

1、“我要报修”页面和“录单”页面，（PC 端和手机端） 报修类型只保留后勤，默认选中； 报修区域：选学生公寓或校园楼宇，输入选择楼宇名称； 3、维修工维修完工页面，（PC 端和手机端） 上传图片改成非必填； 4、系统首页报修电话替换

2022/09/08
fix：2、接报修人员“维修办理”页面，（PC 端） “已办理”分页，增加筛选条件：维修责任人，可下载（单个和批量）打印报修单， 点击批量下载，多个报修单以列表形式在同一个文件中 报修单下载内容：报修区域、报修内容、报修时间、报修人、联系电话、维修单位、维修责任人；无数据不 findById

fix：all List have getTotal(total); repairdeptid null or ''; dispatch 10000

2022/09/09
南京工程学院 校徽 后勤保障处

2022/09/13
fix: 科教资源查询 orgId, resname
feat: netRepair-njit ac5d
fix: new 读者教育 密码复杂度

2022/09/15
idsweb/rest/login2/authUser form-data user:{"loginname":'',"pwd":'',"yzm":'',"openid":''}
参数 base64 加密
idsweb/rest/login2/getCode 获取微信 openid

2022/09/16
feat: login.vue(modify app.vue, api.js, idsweb, isGet, ); myRepair(common.js 2,4); router.js
维修负责人和维修工：9100002njit2-3 9100002njit2-4

2022/10/08
fix: seatMobile lack of type7

2022/10/27
统计分析 iconCls: "icontongjichaxun"
资源统计 DISPLAYURL: '/analyze/resource',
系统统计 path: '/analyze/system',
2022/10/31
feat: echarts; vue-count-to; xlsx。api: resgroupItemsFillRes; statistics.js。 public.scss .count。 analyze component。

# 南理工特藏 2022/11/25 g-table Vue.component

系统配置 icon-menu-xtgl
用户管理 path: '/sys-manage/user',
角色权限 path: '/sys-manage/roles',
用户中心 path: '/sys-manage/user-center',
特藏管理 icon-menu-shgl
院士管理 path: '/tc/academician',  
 名师管理 path: '/tc/teacher',  
 校友捐赠管理 path: '/tc/alumnaSponser',
专家捐赠管理 path: '/tc/specialSponser',
著作管理 path: '/tc/famous',
古籍管理 path: '/tc/old',

# 智慧工厂

卸车单录单 el-icon-edit
"path": "/recordUnload",

# 恢复 sidebar // this.$router.push(this.urls[0]);

// pc 端判断是学生、白马办还是后勤(另一处在实习审批)
const repair = this.menuData.find(m => '在线报修' === m.NAME) || {};
if (repair.children && repair.children[0]) {
const url = repair.children[0].DISPLAYURL;
const obj = {};
if ('/repair/report' === url) {
obj.start = 1;
} else if ('/repair/bm_handle' === url) {
obj.bm = 1;
} else if ('/repair/hq_handle' === url) {
obj.hq = 1;
}
sessionStorage.setItem('url4bizNode', JSON.stringify(obj))
}

# 督导助手 2023/02/06

HeaderBar.vue 隐藏了 /paper
photoItems.vue 的 v-if="params.funTab !== 'yzy'"
removeItem: form,reply
report.vue 的$router.back
config.js: 是否事部件；GIS 地址；

待复查：createId； handleNode：DCJC,YWZX
我的督察：createId；

待处理：handleDeptId； handleNode：YWZX
已转移：handleDeptId；/workOrder/movedList
全部：handleDeptId；

待确认： handleNode：DCGL
全部督察： 不传

sort: desc；asc
orderBy：createTime；handleStartTime

待处理 YWZX，待确认 根据 handleNode 分两种，已完成 End

绿色字体为各角色查看记录的状态：督查人员
待督查：（超时）继续整改、整改通过；
我的督查：（超时）继续整改、整改通过；整改通过

业务中心人员
待处理：（超时）转移、反馈
已转移：无
全部：1（超时）转移、反馈；2 已处理：待复查确认；3 整改通过；

督查管理员 1.我的督查——同督查人员 2.全部督查
待确认：（超时）继续整改、确认通过；
全部督查：（超时）待处理反馈；（超时）已处理：待复查确认；整改通过；

eventType 事件类型 1 创建 2 反馈 3 确认 7 超时 8 转移
status integer($int32) 状态  0草稿1待处理2待确认3已完成9组长不同意
leaderCheck	integer($int32)组长检查 1 不需要检查 2 未检查 3 已检查

全部督查： "/admin"
督查反馈： /ywzx
督查报告： /paper

系统配置 children: [
角色权限："/settings/roles", iconCls: iconjiaose
业务领域： "/settings/business-area", iconCls: iconfenlei
督查地点:/settings/location, iconCls: iconfenlei
参数配置：/settings/arguments, iconCls: iconpeizhi
督导小组：/settings/group, iconCls: iconfenlei
评估标准管理：/settings/assume, iconCls: iconpeizhi
]

# 物业管理

sideBar.vue flag
社会企业信息 path: "/society-company", ICONCLS: iconfenlei
物业工作岗位 path: "/service-position", ICONCLS: iconfenlei
物业服务人员 path: "/service-people",ICONCLS: iconjiaose
物业服务区域 path: "/area",ICONCLS: iconfenlei
角色权限 path: "/roles",ICONCLS: iconjiaose
物业合同 path: "/contractor",ICONCLS: iconwenjian
企业考核信息 path: "/company-verify",ICONCLS: iconbaifenkaohe

# 后勤审批管理

fix: sidebar.vue (menus flag)
ICONCLS

角色管理： /roles
用户组管理： /group
流程中心：
流程申请 /apply
流程查询 /search
全部流程 /all
数据备份： /data_bk
流程管理： /process
部门管理： /dep

applyStatus 0 草稿 1 处理中 2 已完成
filter: {isDraft:0, currentTaskUser: userId}
filter: {isDraft:0, historyTaskUser: userId}
filter: {isDraft:0, createId: userId}
filter: {isDraft:1, createId: userId}
currentTaskName 含有经办，不可编辑
events 内最新的 taskName 为撤回，才可重新发起

# 内外高度滚动自适应

require，import 动态 静态
webpack cjs/esm 导入导出 通用
项目 minipack 模块过程
Amazon deepracer

form 有初始值才能输入，才能双向绑定？
doLayout 才能保证移动端 el-table 某列可以用 v-if，否则这一行不对齐。

项目 new 从上往下拖；全量编辑

netRepair: findId 重复 4 次？可以在 created 完成参数修改，避免多次调用接口。

card 项目 printbox 打印预览窗口 vue 父子组件传值 在 ie 不行。得用原生 js 来修改 img 的 src，才能展示图片。

Vue.component 全局挂载的组件，破坏了 export default new Vue({})

# @media 1920, home 浮动遮挡 el-footer, 插件 BaseUpload, videoCover, 组件 s-form.

数据和图形的分离， 图形小片的组合

# debian ngnix, ts-challenge, moyu vue3, vue 源码重写

? van-image el-image 与下方的 div 之间有 2-5px 的白边，因为 img 是 inline-block 而不是 block。

# 幽灵空白节点：内联元素的每个行框盒子前面有一个“空白节点”，这个“空白节点”不占据任何宽度，无法选中获取，但是又实实在在存在，表现就如同文本节点一样（本文中大量例子会用字母 x 模拟幽灵空白节点）。

！！列表页 scroll 加载，当从详情页返回列表页时，若详情页有滚动距离，那么回到列表页时，即便 scrollTop 为 0，也会触发列表页的滚动，会有两次参数一样的加载。

# 计算中心

        // 支付接入
        {
          path: "/pay",
          children: [
            // 支付接入管理
            {
              path: "/pay/payAccessManagement",
              iconCls: 'iconzhangdan'
            },
            // 支付接入
            {
              path: "/pay/accessPay",
              iconCls: 'iconzhangdan'
            },
            // 接入监测
            {
              path: "/pay/payMonitor",
              iconCls: 'iconfenlei'
            }
          ]
        }
        // 业务组管理
        {
          path: "/yewuzuManagement",
        },
        // 经营组管理
        {
          path: "/jingyingzuManagement",
        },
        // 用户管理
        {
          path: "/userManagement",
        },
        // 交易查询
        {
          path: "/tradeSearch",
        },
        // 账单查询
        {
          path: "/billSearch",
        },
        // 经营分析
        {
          path: "/analyze",
        },

统计分析
ISLEAF: 0,
children: [
督查分析："/stats/supervision", iconCls: icona-tongjifenxi_nor
反馈分析："/stats/feedback", iconCls: icona-tongjifenxi_nor
]

groupType integer($int32)  1结算中心2业务组3经营组
payType	integer($int32) 1 校园卡 2 校内转账 3 一卡通
schoolCardPay string 校园卡支付：1 未申请 2 待授权 3 已授权 4 授权不通过
schoolTransferPay string 校内转账：1 未申请 2 待授权 3 已授权 4 授权不通过

# <router-view v-show="isReady" :key="+new Date()" /> 为何 roles 页面会反复刷新，别的没事。

# 读者教育-新闻动态
              NAME: '新闻动态',
              ISLEAF: '0',
              ICONCLS: 'icon-menu-train',
              children: [
                {
                  ISLEAF: '1',
                  NAME: '馆长寄语',
                  DISPLAYURL: '/news/message',
                },
                {
                  ISLEAF: '1',
                  NAME: '新闻动态',
                  DISPLAYURL: '/news',
                },
              ],
# 车辆管理

router.js // doNext(res, to, from, next);
App.vue isReady
headerBar flag

            {
              NAME: "车辆管理",
              ISLEAF: "0",
              children: [
                {
                  iconCls: "iconche",
                  NAME: "校内车辆",
                  ISLEAF: "0",
                  children: [
                    {
                      DISPLAYURL: "/vehicle/info",
                      ISLEAF: "1",
                      NAME: "车辆信息"
                    },
                    {
                      DISPLAYURL: "/vehicle/etc",
                      ISLEAF: "1",
                      NAME: "加油卡/ETC"
                    }
                  ]
                },
                {
                  DISPLAYURL: "/vehicle/outside",
                  iconCls: "iconche",
                  ISLEAF: "1",
                  NAME: "校外车辆"
                },
                {
                  DISPLAYURL: "/vehicle/driver",
                  iconCls: "iconjiaose",
                  ISLEAF: "1",
                  NAME: "驾驶员管理"
                },
                {
                  DISPLAYURL: "/vehicle/usingCarConfig",
                  iconCls: "iconpeizhi",
                  ISLEAF: "1",
                  NAME: "用车配置"
                },
                {
                  DISPLAYURL: "/training/list",
                  iconCls: "iconwenjian",
                  ISLEAF: "1",
                  NAME: "安全培训管理"
                }
              ]
            },
            {
              ISLEAF: "0",
              NAME: "系统配置",
              children: [
                {
                  DISPLAYURL: "/setting/params",
                  ISLEAF: "1",
                  NAME: "参数配置"
                },
                {
                  DISPLAYURL: "/setting/userManagement",
                  ISLEAF: "1",
                  NAME: "用户管理"
                }
              ]
            },
            {
              ISLEAF: "0",
              NAME: "信息公告",
              children: [
                {
                  iconCls: "iconwenjian",
                  ISLEAF: "1",
                  NAME: "信息公告管理",
                  DISPLAYURL: "/news/manage"
                },
                {
                  iconCls: "iconwenjian",
                  DISPLAYURL: "/news/view",
                  ISLEAF: "1",
                  NAME: "信息公告查看"
                }
              ]
            },
            {
              ISLEAF: "0",
              NAME: "班车服务",
              children: [
                {
                  iconCls: "iconbanche",
                  ISLEAF: "1",
                  NAME: "线路管理",
                  DISPLAYURL: "/busManage/routineMange"
                },
                {
                  DISPLAYURL: "/busManage/shift",
                  iconCls: "iconbanche",
                  ISLEAF: "1",
                  NAME: "班车排班"
                },
                {
                  DISPLAYURL: "/busManage/search",
                  iconCls: "iconbanche",
                  ISLEAF: "1",
                  NAME: "排班查询"
                },
                {
                  DISPLAYURL: "/busManage/status",
                  iconCls: "icona-tongjifenxi_nor",
                  ISLEAF: "1",
                  NAME: "乘坐统计"
                },
                {
                  DISPLAYURL: "/busManage/settlement",
                  iconCls: "iconzhangdan",
                  ISLEAF: "1",
                  NAME: "班车结算"
                },
                {
                  DISPLAYURL: "/busManage/applyMange",
                  iconCls: "iconwenjian",
                  ISLEAF: "1",
                  NAME: "预约管理"
                },
                 {
                  iconCls: "iconbanche",
                  ISLEAF: "1",
                  NAME: "班车线路",
                  DISPLAYURL: "/busManage/routine-search"
                },
                {
                  DISPLAYURL: "/busManage/myApply",
                  iconCls: "iconwenjian",
                  ISLEAF: "1",
                  NAME: "我的预约"
                }
              ]
            },


