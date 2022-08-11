var CenterGrid_download = setType('download');
var CenterGrid_read = setType('read');
var CenterGrid_search = setType('search');

function setType(type) {
  tabName = type;
  var CenterGrid = new Ext.grid.GridPanel({
    layout: 'fit',
    region: 'center',
    id: 'classi' + type,
    // split:true,
    collapsible: false,
    store: genData(type),
    // store: CenterGridStore(type),
    sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: true }),
    cm: new Ext.grid.ColumnModel(genCol(type)),
    viewConfig: {
      forceFit: true,
    },
    bbar: new Ext.PagingToolbar({
      pageSize: 16,
      // height:50,
      id: 'CenterGrid-MainPT' + type,
      cls: 'ak-pager',
      store: genData(type),
      // store: CenterGridStore(type),
      displayInfo: true,
      displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
      beforePageText: '第',
      listeners: {
        beforechange: function (a, param) {
          var start = param.start;
          var page = param.start / 16 + 1;
          var xx = { start: start, limit: 16, page: page, filter: gridfilter };
          param.data = JSON.stringify(xx);
        },
        render: function () {
          // akconfig.checkAuth(['100110'],userid);
        },
      },
    }),
    tbar: [
      '->',
      '开始时间：',
      {
        xtype: 'datetimefield',
        fieldLabel: '时间范围  开始',
        // labelWidth: 90,
        name: 'starttime',
        id: 'starttime' + type,
        format: 'Y-m-d H:i:s',
        width: 200,
      },
      '<span style="margin-left: 20px">结束时间： </span>',
      {
        xtype: 'datetimefield',
        fieldLabel: '结束',
        // labelWidth: 40,
        name: 'endtime',
        id: 'endtime' + type,
        format: 'Y-m-d H:i:s',
        width: 200,
      },
      ' <span style="margin-left: 20px">客户： </span>',
      //   new Ext.form.TextField({
      //     id: 'querykeyword' + type,
      //     name: 'KEYWORD',
      //     width: 150,
      //   }),
      new Ext.form.ComboBox({
        name: 'userOrg',
        id: 'userOrg' + type,
        hiddenName: 'ctmname',
        // triggerAction: 'all',
        lazyRender: true,
        store: UserStore,
        valueField: 'NAME',
        displayField: 'NAME',
        emptyText: '请选择',
        mode: 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
        editable: true,
        selectOnFocus: true,
        width: 180,
        pageSize: 0, // 当设置大于 0 时会显示分页按钮
        listeners: {
          beforerender: function (th) {
            th.getStore().load(
              // Ext.getCmp('userOrg').doLoad({
              {
                params: {
                  start: 0,
                  limit: 16000,
                  data: JSON.stringify({ page: 1, start: 0, limit: 16000 }),
                },
              }
            );
          },
          beforequery: function (e) {
            var combo = e.combo;
            if (!e.forceAll) {
              var input = e.query;
              // 检索的正则
              var regExp = new RegExp('.*' + input + '.*');
              // 执行检索
              combo.store.filterBy(function (record, id) {
                // 得到每个record的项目名称值
                var text = record.get(combo.displayField);
                return regExp.test(text);
              });
              combo.expand();
              return true;
            }
          },
        },
      }),

      new Ext.Button({
        text: '查询',
        cls: 'ak-btn btn-green',
        iconCls: 'ak-icon icon-search',
        listeners: {
          click: function () {
            let ctmname = Ext.getCmp('userOrg' + type).getValue();
            let starttime = Ext.getCmp('starttime' + type).getValue();
            let endtime = Ext.getCmp('endtime' + type).getValue();
            if (starttime && endtime && starttime.getTime() > endtime.getTime()) {
              starttime = Ext.getCmp('endtime' + type).getValue();
              endtime = Ext.getCmp('starttime' + type).getValue();
            }
            // console.log(ctmname);
            gridfilter = {};
            assignObj({ obj: gridfilter, name: starttime, str: 'starttime' });
            assignObj({ obj: gridfilter, name: endtime, str: 'endtime' });
            assignObj({ obj: gridfilter, name: ctmname, str: 'ctmname' });

            Ext.getCmp('CenterGrid-MainPT' + type).doLoad(0);
          },
        },
      }),
      new Ext.Button({
        iconCls: 'ak-icon icon-reset',
        cls: 'ak-btn btn-green',
        text: '重置',
        listeners: {
          click: function () {
            Ext.getCmp('userOrg' + type).setValue('');
            Ext.getCmp('starttime' + type).setValue('');
            Ext.getCmp('endtime' + type).setValue('');
            gridfilter = {};

            Ext.getCmp('CenterGrid-MainPT' + type).doLoad(0);
          },
        },
      }),
      {
        xtype: 'button',
        text: '下载',
        iconCls: 'ak-icon icon-download',
        cls: 'ak-btn btn-red ak-auth',
        listeners: {
          click: function () {
            d(type);
          },
        },
      },
    ],
    listeners: {
      beforerender: function (th) {
        Ext.getCmp('CenterGrid-MainPT' + type).doLoad(0);
        // CenterGrid.show()
        // th.getStore().load({
        //     params:{SEARCH:false,start:0,limit:16}
        // });
      },
    },
  });
  return CenterGrid;
}

//返回当前时间的年月日 2019-05-20
var ymd = function (transDate) {
  var myDate = transDate || new Date();
  var month = myDate.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    //月
    month = '0' + month;
  }
  var strDate = myDate.getDate();
  if (strDate >= 0 && strDate <= 9) {
    //日
    strDate = '0' + strDate;
  }
  var hour = myDate.getHours(); // 时

  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour;
  }
  var minutes = myDate.getMinutes(); // 分
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes;
  }

  var seconds = myDate.getSeconds(); // 秒
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds;
  }
  return myDate.getFullYear() + month + strDate + hour + minutes + seconds;
};

// 属性挂载
function assignObj({ obj, name, str }) {
  if (name || name === 0) {
    obj[str] = typeof name === 'object' ? ymd(name) : name;
  }
}

// 产生列头
function genCol(type) {
  if ('download' === type) {
    return [
      // new Ext.grid.CheckboxSelectionModel({ singleSelect: true }), //改为ture为多选
      { header: '客户名称', dataIndex: 'ctmname', width: 120 },
      { header: 'IP', dataIndex: 'userip', width: 120 },
      { header: '书名', dataIndex: 'booktitle', width: 120 },
      { header: '页码', dataIndex: 'pagenum', width: 50 },
      { header: '账号', dataIndex: 'userid', width: 120 },
      { header: '下载时间', dataIndex: 'datetime2', width: 120 },
      // {
      //   header: '最后修改日期',
      //   dataIndex: 'MODIFYDATE',
      //   width: 140,
      //   renderer: function (value) {
      //     var xx = akDateChange.timechange(value);
      //     return xx;
      //   },
      // },
    ];
  } else if ('read' === type) {
    return [
      { header: '客户名称', dataIndex: 'ctmname', width: 120 },
      { header: 'IP', dataIndex: 'ip', width: 120 },
      { header: '书名', dataIndex: 'booktitle', width: 120 },
      { header: '账号', dataIndex: 'userid', width: 120 },
      {
        header: '阅读时间',
        dataIndex: 'datetime',
        width: 120,
        renderer: function (value) {
          var xx = value ? akDateChange.timechange(value) : '';
          return xx;
        },
      },
    ];
  } else if ('search' === type) {
    return [
      { header: '客户名称', dataIndex: 'ctmname', width: 120 },
      { header: 'IP', dataIndex: 'ip', width: 120 },
      { header: '检索关键词', dataIndex: 'keyword', width: 120 },
      { header: '页码', dataIndex: 'pagenum', width: 120 },
      { header: '账号', dataIndex: 'userid', width: 120 },
      {
        header: '检索时间',
        dataIndex: 'datetime',
        width: 120,
        renderer: function (value) {
          var xx = value ? akDateChange.timechange(value) : '';
          return xx;
        },
      },
    ];
  }
}

function genData(type) {
  return 'download' === type ? CenterGridStore : 'read' === type ? CenterGridStore1 : CenterGridStore2
}