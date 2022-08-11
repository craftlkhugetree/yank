var urls =akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/";
var userid=location.search.substr(1).split("=")[1];

// var midapp,endapp;
// var filters;
// var filter;
var gridfilter;
var orgfilter;     //组织架构过滤职位
var stafffilter;      //职位过滤职员
// var MidValues;
// var n = 0;
// var EndValues={};

// var CenterGridRed = new Ext.data.JsonReader({
//     fields: [{
//             name: 'NAME'
//         }, {
//             name: 'PARENTID'
//         }, {
//             name: 'TYPE'
//         }, {
//             name: 'SETACCORDING'
//         }, {
//             name: 'SETDATE'
//         }, {
//             name: 'ID'
//         }, {
//             name: 'ENDACCORDING'
//         }, {
//             name: 'NAME'
//         }, {
//             name: 'ENDDATE'
//         }, {
//             name: 'SOURCEORGID'
//         }, {
//             name: 'CREATENAME'
//         }, {
//             name: 'CREATETIME'
//         },{
//             name: 'ACCORDINGNAME'
//         }, {
//             name: 'UPDATENAME'
//         },{
//             name: 'UPDATETIME'
//         },  {
//             name: 'ENDACCORDINGNAME'
//         },  {
//             name: 'PARENTNAME'
//         },
//         {
//             name: 'ORGSOURCENAME'
//         }
//     ],
//     root: 'items',
//     id: 'ID',
//     totalProperty: 'total'
// });
// var CenterGridStore = new Ext.data.Store({    //机构列表

//     url: urls + 'Org/getListByParentId',
//     reader: CenterGridRed
// });
// 分类的store
var FcRed = new Ext.data.JsonReader({
    fields: [{
        name: "NAME"
    }, {
        name: "CODE"
    }],
    root: 'items',
    id: 'ID'
});
var FcStore = new Ext.data.Store({
    url: urls + 'commCode/getCode',
    reader: FcRed
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
var setStore = new Ext.data.Store({                   // 设置依据下拉框
    url: urls + 'According/getList',
    reader: setRad
});

// setStore.load({
//     params:{
//         data:JSON.stringify({"start":0,"page":1})
//     }
// });

var appointPropertyRad = new Ext.data.JsonReader({
    fields: [{name: "NAME"},
              {
                name: "ID"
            }],
    root: 'items',
    id: 'ID'
});
var appointPropertyStore = new Ext.data.Store({                   // 任职性质下拉框
    url: urls + 'OfficeType/getOfficeTypeList',
    reader: appointPropertyRad
});

// appointPropertyStore.load({
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
var appointOrganStore = new Ext.data.Store({                   // 任命机关下拉框
    url: urls + 'Org/getOrgList',
    reader: appointOrganRad
});

// appointOrganStore.load({
//     params:{
//         data:JSON.stringify({"start":0,"page":1})
//     }
// });

var positionRad = new Ext.data.JsonReader({
    fields: [{name: "NAME"},
              {
                name: "ID"
            }],
    root: 'items',
    id: 'ID'
});
var positionStore = new Ext.data.Store({                   // 职位下拉框
    url: urls + 'Post/list',
    reader: positionRad
});


var appList = new Ext.data.JsonReader({
    fields: [{
            name: "NAME"
        }, {
            name: "ORGID"
        },
        {
            name: "SETDATE"
        },
        {
            name: "ID"
        },
        {
            name: "ENDDATE"
        },
        {
            name: "SOURCEPOSTID"
        },
        {
            name: "DORDER"
        },
        {
            name: "CREATER"
        },
        {
            name: "CREATEDATE"
        },
        {
            name: "MODIFIER"
        },
        {
            name: "MODIFYDATE"
        },
        {
            name: "ORGNAME"
        },
        {
            name: "SOURCENAME"
        }

    ],
    root: 'items',
    id: 'ID',
    totalProperty :'total'
});

var appListStore = new Ext.data.Store({   //职位
    url: urls + 'Post/getPostListByOrgId',
    reader: appList
});

// 机构任命人
var Fund_use_Gridrender = new Ext.data.JsonReader({
    fields: [{
            name: 'POSTID'
        }, {
            name: 'LASTNAME'
        }, {
            name: 'NAME'
        }, {
            name: 'SETORGID'
        },
        {
            name: 'SETDATE'
        },
        {
            name: 'SETTYPE'
        },
        {
            name: 'ENDDATE'
        },
        {
            name: 'ENDTYPE'
        },
        {
            name: 'ID'
        },
        {
            name: 'ORGNAME'
        },
        {
            name: 'POSTNAME'
        },
        {
            name: 'PEOPLENAME'
        },
        {
            name: 'SETTYPENAME'
        },
        {
            name: 'ENDTYPENAME'
        },
        {
            name: 'PEOPLEID'
        }
    ],
    root: 'items',
    id: 'ID',
    totalProperty: 'total'
});
var Fund_use_GridStore = new Ext.data.Store({        //职位人员
    url: urls + 'PostPeople/getPeopleListByPostId',
    reader: Fund_use_Gridrender
});


var eastTreeStore=new Ext.tree.TreeLoader({
        dataUrl:urls + "Org/list"
});


var nameRad = new Ext.data.JsonReader({
    fields: [{name: "PEOPLENAME"},
              {
                name: "ID"
            }],
    root: 'items',
    id: 'ID'
});
var nameStore = new Ext.data.Store({                   // 姓名下拉框
    url: urls + 'PostPeople/getNameList',
    reader: nameRad
});

// nameStore.load({
//     params:{
//         data:JSON.stringify({"start":0,"page":1})
//     }
// });

  
  
