var urls = akconfig.url + 'rest/';
// var urls="http://160.255.0.191:8088/bemweb/rest/";
var userid = location.search.substr(1).split('=')[1];
var eastTreeStoredata;
var gridfilter;
var tabName = 'download';
var opType = {
  download: {
    fields: [
      { name: 'ctmname' },
      { name: 'userip' },
      { name: 'booktitle' },
      { name: 'pagenum' },
      { name: 'userid' },
      { name: 'datetime2' },
    ],
    url: 'dataAnalysis/downloadData',
  },
  read: {
    fields: [
      { name: 'ctmname' },
      { name: 'ip' },
      { name: 'booktitle' },
      { name: 'userid' },
      { name: 'datetime' },
    ],
    url: 'dataAnalysis/readData',
  },
  search: {
    fields: [
      { name: 'ctmname' },
      { name: 'ip' },
      { name: 'keyword' },
      { name: 'pagenum' },
      { name: 'userid' },
      { name: 'datetime' },
    ],
    url: 'dataAnalysis/searchData',
  },
};

// function CenterGridRed(type) {
//   return new Ext.data.JsonReader({
//     fields: opType[type].fields,
//     root: 'data',
//     id: 'id',
//     totalProperty: 'total',
//   });
// }

// function CenterGridStore(type) {
//   return new Ext.data.Store({
//     url: urls + opType[type].url,
//     reader: CenterGridRed(type),
//   });
// }

var CenterGridRed = new Ext.data.JsonReader({
  fields: opType[tabName].fields,
  root: 'data',
  id: 'id',
  totalProperty: 'total',
});

var CenterGridStore = new Ext.data.Store({
  url: urls + opType.download.url,
  reader: new Ext.data.JsonReader({
    fields: opType.download.fields,
    root: 'data',
    id: 'id',
    totalProperty: 'total',
  }),
});
var CenterGridStore1 = new Ext.data.Store({
  url: urls + opType.read.url,
  reader: new Ext.data.JsonReader({
    fields: opType.read.fields,
    root: 'data',
    id: 'id',
    totalProperty: 'total',
  }),
});
var CenterGridStore2 = new Ext.data.Store({
  url: urls + opType.search.url,
  reader: new Ext.data.JsonReader({
    fields: opType.search.fields,
    root: 'data',
    id: 'id',
    totalProperty: 'total',
  }),
});

var UserStore = new Ext.data.Store({
  url: urls + 'Customer/list',
  reader: new Ext.data.JsonReader({
    //   fields: ['NAME', 'ID'],
    fields: [{ name: 'NAME' }, { name: 'ID' }],
    root: 'items',
    id: 'ID',
    totalProperty: 'total',
  }),
});

// 下载
function d(type) {
  let xmlResquest = new XMLHttpRequest();
  //   let url = location.protocol + '//' + location.host + urls + `dataAnalysis/${type}DataExcel`;
  let url = location.protocol + '//' + location.host + urls + `dataAnalysis/${type}DataExcel?data=`;
  let param = JSON.stringify({ page: 1, start: 0, filter: gridfilter });
  url += encodeURIComponent(param);
  let fileName = type + '统计';
  xmlResquest.open('get', url, true);
  xmlResquest.responseType = 'blob';
  xmlResquest.timeout = 0; // 设置超时时间
  xmlResquest.onload = function (oEvent) {
    const content = xmlResquest.response;
    // 因为可能后端可能会传递json格式的报错信息，所以在接收信息的时候需要判断一下是否是json文件。如果是json文件，则为报错信息。不是json文件就是正常文本信息
    let fileReader = new FileReader();
    fileReader.onload = function () {
      try {
        let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
        if (jsonData.code) {
        }
      } catch (error) {
        let url = window.URL.createObjectURL(content);
        let link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.setAttribute('download', fileName + '.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    };
    fileReader.readAsText(content);
  };
  xmlResquest.send();
}
