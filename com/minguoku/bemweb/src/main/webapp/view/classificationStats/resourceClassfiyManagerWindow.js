/** 第一个tab页 */
var firstPanel = new Ext.Panel({
  title: '下载统计',
  layout: 'border',
  items: [CenterGrid_download],
  listeners: {
    click: function () {
      gridfilter = {};
      tabName = 'download';
      // Ext.getCmp('CenterGrid-MainPT' + 'download').doLoad(0);
      setType(tabName);
    },
  },
});

/** 第二个tab页 */
var secondPanel = new Ext.Panel({
  title: '阅读统计',
  layout: 'border',
  items: [CenterGrid_read],
  listeners: {
    click: function () {
      gridfilter = {};
      tabName = 'read';
      // Ext.getCmp('CenterGrid-MainPT' + 'read').doLoad(0);
      setType(tabName);
    },
  },
});

/** 第三个tab页 */
var thirdPanel = new Ext.Panel({
  title: '检索统计',
  layout: 'border',
  items: [CenterGrid_search],
  listeners: {
    click: function () {
      gridfilter = {};
      tabName = 'search';
      // Ext.getCmp('CenterGrid-MainPT' + 'search').doLoad(0);
      setType(tabName);
    },
  },
});

/** 将tab页放到TabPanel面板中 */
var myTabsPanel = new Ext.TabPanel({
  activeTab: 0,
  region: 'center',
  // items: [firstPanel],
  items: [firstPanel, secondPanel, thirdPanel],
});

myTabsPanel.show(); //显示窗口
