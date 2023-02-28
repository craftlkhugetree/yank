/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2019/3/26 星期二 上午 10:00:04                    */
/*==============================================================*/


drop table if exists CONVERT_LOG;

drop table if exists LRES_CAMPUS;

drop table if exists LRES_LRECORD;

drop table if exists LRES_LRESOURCE;

drop table if exists LRES_QLEVEL;

drop table if exists LRES_QOPTION;

drop table if exists LRES_QRECORD;

drop table if exists LRES_QRESITEM;

drop table if exists LRES_QRESOURCE;

drop table if exists LRES_QUESTCLASS;

drop table if exists LRES_QUESTCOUNT;

drop table if exists LRES_QUESTION;

drop table if exists LRES_USER;

drop table if exists R_QRES_CLASS;

/*==============================================================*/
/* Table: CONVERT_LOG                                           */
/*==============================================================*/
create table CONVERT_LOG
(
   ID                   varchar(32) not null,
   SOURCE               varchar(100),
   TARGET               varchar(100),
   USE_TIME             varchar(20),
   RESULT_CODE          smallint(2),
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32) comment '租户ID',
   primary key (ID)
);

alter table CONVERT_LOG comment '文件转码日志记录';

/*==============================================================*/
/* Table: LRES_CAMPUS                                           */
/*==============================================================*/
create table LRES_CAMPUS
(
   ID                   varchar(32) not null,
   NAME                 varchar(50),
   TYPE                 smallint(2) comment '校区类型：1系统生成2用户添加',
   CREATE_TIME          datetime,
   TID                  varchar(32),
   IS_DELETE            smallint(2),
   primary key (ID)
);

alter table LRES_CAMPUS comment '校区表';

/*==============================================================*/
/* Table: LRES_LRECORD                                          */
/*==============================================================*/
create table LRES_LRECORD
(
   ID                   varchar(32) not null,
   USER_ID              varchar(32) not null comment '用户ID',
   LEARN_START          datetime,
   LEARN_TIME           int(10) comment '学习开始时间',
   LEARN_DATE           date,
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

alter table LRES_LRECORD comment '学习记录表';

/*==============================================================*/
/* Table: LRES_LRESOURCE                                        */
/*==============================================================*/
create table LRES_LRESOURCE
(
   ID                   varchar(32) not null,
   NAME                 varchar(50) comment '资源名称',
   DESCRIPTION          varchar(500) comment '资源描述',
   FILE_TYPE            smallint(2) comment '1视频2文档3超文本',
   URL                  varchar(100) comment 'url地址',
   DHTML                text comment '超文本内容',
   WATCH_COUNT          int(10),
   DOWNLOAD_COUNT       int(10),
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

alter table LRES_LRESOURCE comment '学习资源表';

/*==============================================================*/
/* Table: LRES_QLEVEL                                           */
/*==============================================================*/
create table LRES_QLEVEL
(
   ID                   varchar(32) not null,
   QRES_ID              varchar(32),
   CLASS_ID             varchar(32),
   NEED_TIME			int(10),
   LEVEL_NUM            int(5),
   SCORE                int(10),
   PASS_SCORE           int(10),
   IS_DELETE            smallint(2),
   CREATE_TIME          datetime,
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QOPTION                                          */
/*==============================================================*/
create table LRES_QOPTION
(
   ID                   varchar(32) not null,
   QUEST_ID             varchar(32) not null,
   OPTION_ITEM          varchar(250) not null,
   IS_TRUE              tinyint(4) not null,
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QRECORD                                          */
/*==============================================================*/
create table LRES_QRECORD
(
   ID                   varchar(32) not null,
   USER_ID              varchar(32) comment '用户表ID',
   RES_ID               varchar(32) comment '资源ID',
   LEVEL                int(10),
   PASS_LEVEL           smallint(2),
   IS_PASS              smallint(2),
   SCORE                int(10),
   USE_TIME             int(10),
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QRESITEM                                         */
/*==============================================================*/
create table LRES_QRESITEM
(
   ID                   varchar(32) not null,
   QRES_ID              varchar(32) not null comment '试卷ID',
   LEVEL_ID             varchar(32) comment '关卡ID',
   QUES_TYPE            smallint(2) not null comment '题目类型：1单选2多选3判断',
   QUES_NUM             int(10) comment '题目数量',
   SCORE                int(10) comment '题目分值',
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2),
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QRESOURCE                                        */
/*==============================================================*/
create table LRES_QRESOURCE
(
   ID                   varchar(32) not null,
   CAMPUS_ID            varchar(32) comment '校区ID',
   NAME                 varchar(50) comment '试卷标题',
   USER_TYPE            varchar(250) comment '考卷试用对象',
   TEST_TYPE            smallint(2) comment '考试形式：1.普通考试2.模拟考试3.闯关考试4.开卷考试',
   SCORE                int(10) comment '试卷总分数/总关卡',
   NEED_TIME            int(10) comment '考试时间',
   MIN_TIME             int(10) comment '最少考试时间',
   PASS_SCORE           int(10) comment '通过分数/通过关卡',
   IS_USE               smallint(2) comment '是否使用',
   VALID_START              datetime comment '资源有效期',
   VALID_END                datetime,
   RESULT_TYPE          smallint(2) comment '答案展示形式：1只展示结果2展示错题及分析3答一题就展示答案及分析',
   TEMPLATE_CODE        smallint(2) comment '1.模板A 2.模板B',
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

alter table LRES_QRESOURCE comment '考试资源表';

/*==============================================================*/
/* Table: LRES_QUESTCLASS                                       */
/*==============================================================*/
create table LRES_QUESTCLASS
(
   ID                   varchar(32) not null,
   NAME                 varchar(100) not null comment '考试资源分类',
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) not null default 1,
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QUESTCOUNT                                       */
/*==============================================================*/
create table LRES_QUESTCOUNT
(
   ID                   varchar(32) not null,
   QUEST_ID             varchar(32),
   USE_NUM              int(10) default 0,
   PASS_NUM             int(10) default 0,
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2),
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_QUESTION                                         */
/*==============================================================*/
create table LRES_QUESTION
(
   ID                   varchar(32) not null,
   CLASS_ID             varchar(32) not null,
   QUES_TITLE           varchar(500) not null comment '题目内容',
   QUES_TYPE            smallint(2) not null comment '1单选 2多选 3判断',
   QUES_ANALY           varchar(500) comment '题目分析',
   IS_USE               smallint(6) comment '是否必考 0否1是',
   IS_TRUE              smallint(2) comment '判断题对错：0错1对',
   FILE_URL             varchar(100) comment '附件URL',
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

/*==============================================================*/
/* Table: LRES_USER                                             */
/*==============================================================*/
create table LRES_USER
(
   ID                   varchar(32) not null comment '用户ID',
   CAMPUS_ID            varchar(32) comment '校区ID',
   READER_ID            varchar(50) comment '登录账号（证件号）',
   READER_TYPE          varchar(10) comment '读者类型',
   READER_TYPENAME      varchar(10),
   BARCODE              varchar(50) comment '条形码',
   NAME                 varchar(100) comment '用户名',
   NICK_NAME            varchar(100) comment '昵称',
   SEX                  smallint(2) comment '性别',
   GRADE                varchar(50) comment '年级',
   DEPT                 varchar(50) comment '组织结构',
   EMAIL                varchar(50) comment '邮箱',
   OPEN_ID              varchar(32),
   READER_FLAG          smallint(2),
   CREATE_ID            varchar(32),
   CREATE_TIME          datetime,
   IS_DELETE            smallint(2) default 1,
   TID                  varchar(32),
   primary key (ID)
);

alter table LRES_USER comment '用户表';

/*==============================================================*/
/* Table: R_QRES_CLASS                                          */
/*==============================================================*/
create table R_QRES_CLASS
(
   ID                   varchar(32) not null,
   QRES_ID              varchar(32),
   CLASS_ID             varchar(32),
   IS_DELETE            smallint(2),
   CREATE_TIME          datetime,
   TID                  varchar(32),
   primary key (ID)
);

alter table LRES_LRECORD add constraint FK_Reference_4 foreign key (USER_ID)
      references LRES_USER (ID);

alter table LRES_QOPTION add constraint FK_Reference_8 foreign key (QUEST_ID)
      references LRES_QUESTION (ID);

alter table LRES_QRECORD add constraint FK_Reference_2 foreign key (USER_ID)
      references LRES_USER (ID);

alter table LRES_QRECORD add constraint FK_Reference_3 foreign key (RES_ID)
      references LRES_QRESOURCE (ID);

alter table LRES_QRESOURCE add constraint FK_Reference_5 foreign key (CAMPUS_ID)
      references LRES_CAMPUS (ID);

alter table LRES_QUESTCOUNT add constraint FK_Reference_7 foreign key (QUEST_ID)
      references LRES_QUESTION (ID);

alter table LRES_QUESTION add constraint FK_Reference_6 foreign key (CLASS_ID)
      references LRES_QUESTCLASS (ID);

alter table LRES_USER add constraint FK_Reference_1 foreign key (CAMPUS_ID)
      references LRES_CAMPUS (ID);

alter table R_QRES_CLASS add constraint FK_Reference_10 foreign key (CLASS_ID)
      references LRES_QUESTCLASS (ID);

alter table R_QRES_CLASS add constraint FK_Reference_9 foreign key (QRES_ID)
      references LRES_QRESOURCE (ID);

