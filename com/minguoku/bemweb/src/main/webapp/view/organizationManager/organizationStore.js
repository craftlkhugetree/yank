var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/";        //严涛涛那边的
// var userid=location.search.substr(1).split("=")[1];
var gridfilter;   //过滤
var eastTreeStoredata;
var countforeastTreeStoreload=0;

var orgfilter;

var CenterGridRed = new Ext.data.JsonReader({
    fields: [{
            name: 'NAME'
        }, {
            name: 'PARENTID'
        }, {
            name: 'TYPE'
        }, {
            name: 'SETACCORDING'
        }, {
            name: 'SETDATE'
        }, {
            name: 'ID'
        }, {
            name: 'ENDACCORDING'
        }, {
            name: 'NAME'
        }, {
            name: 'ENDDATE'
        }, {
            name: 'SOURCEORGID'
        }, {
            name: 'CREATER'
        }, {
            name: 'CREATEDATE'
        },{
            name: 'ACCORDINGNAME'
        }, {
            name: 'MODIFIER'
        },{
            name: 'MODIFYDATE'
        },  {
            name: 'ENDACCORDINGNAME'
        },  {
            name: 'PARENTNAME'
        },
        {
            name: 'ORGSOURCENAME'
        }
    ],
    root: 'items',
    id: 'ID',
    totalProperty: 'total'
});
var CenterGridStore = new Ext.data.Store({    //机构列表

    // url: urls + 'Org/getListByParentId',
    url: urls + 'Org/getGrid',
    reader: CenterGridRed
});

var setRad = new Ext.data.JsonReader({
    fields: [{
        name: "NAME"
    }, {
        name: "ID"
    }],
    root: 'items',
    id: 'ID'
});
var setStore = new Ext.data.Store({                   // 设置依据
    url: urls + 'According/getList',
    reader: setRad
});

// setStore.load({
//     params:{
//         data:JSON.stringify({"start":0,"page":1})
//     }
// });

var appointOrganRad = new Ext.data.JsonReader({
    fields: [{name: "NAME"},
              {
                name: "ID"
            }],
    root: 'items',
    id: 'ID'
});
var appointOrganStore = new Ext.data.Store({                   // 上级机构及原机构
    url: urls + 'Org/getOrgList',
    reader: appointOrganRad
});
// appointOrganStore.load({              // 加载上级机构及原机构
//     params:{
//       data:JSON.stringify({"start":0,"page":1})
//     }
// });

var eastTreeStore=new Ext.tree.TreeLoader({
        dataUrl:urls + "Org/list"
});