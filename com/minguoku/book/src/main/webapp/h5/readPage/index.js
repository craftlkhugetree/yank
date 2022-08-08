var dao = {};
var nodePAGE;
var zjPage = [];
var bookID;

var fontSizeWidth;
var fontSizeHeight;

var wordIsPress;
var pageCount = 0;

var keywordCombx = '';
let bookTitle = '';

let pieceList = [];
let isSearchOpen = false;
let searchUnit = (plusUnit = 5);
let allUnitCount = 0;
const map = new Map();

$('.toStart').on('click', function () {
  window.location.href = '../index/index.html';
});

$(function () {
  // 产生xml map
  let xmlAddress =
    (location.protocol === 'file:'
      ? 'http://172.20.1.251:8080'
      : location.protocol + '//' + location.host) +
    '/mgwxk/' +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/docbook/main.xml';

  // xmlAddress = './main.xml' || xmlAddress;
  readFile(xmlAddress);
  //静止页面复制，图片下载
  function stop() {
    return false;
  }
  document.oncontextmenu = stop;

  function jumpPage() {
    if (event.keyCode == 37) {
      fun_a();
      //	    	event.preventDefault();
    } //左

    if (event.keyCode == 38) {
      fun_d();
      event.preventDefault();
    } //上

    if (event.keyCode == 39) {
      fun_c();
      //		    event.preventDefault();
    } //右

    if (event.keyCode == 40) {
      fun_b();
      event.preventDefault();
    } //下
  }

  function fun_a() {
    if (nodePAGE != 1) {
      nodePAGE--;
      keybordContent(pageCount, nodePAGE);
    }
  }

  function fun_b() {
    if (nodePAGE < pageCount) {
      nodePAGE++;
      keybordContent(pageCount, nodePAGE);
    }
  }

  function fun_c() {
    if (nodePAGE < pageCount) {
      nodePAGE++;
      keybordContent(pageCount, nodePAGE);
    }
  }

  function fun_d() {
    if (nodePAGE != 1) {
      nodePAGE--;
      keybordContent(pageCount, nodePAGE);
    }
  }

  document.onkeydown = jumpPage;

  //点击左按钮
  $('.leftBtn').on('click', function () {
    if (nodePAGE != 1) {
      nodePAGE--;
      keybordContent(pageCount, nodePAGE);
    }
  });
  //点击右按钮
  $('.rightBtn').on('click', function () {
    if (nodePAGE < pageCount) {
      nodePAGE++;
      keybordContent(pageCount, nodePAGE);
    }
  });

  function keybordContent(params1, params2) {
    $('#div_pager').pagination({
      callback: PageCallback,
      pageCount: params1,
      totalData: params1,
      current_page: 10, //当前页索引
      showData: 1,
      current: params2,
      prevCls: 'prev',
      nextCls: 'next',
      activeCls: 'active',
      count: 3,
      coping: true,
      homePage: '首页',
      endPage: '末页',
      prevContent: '上页',
      nextContent: '下页',
      jump: true, //跳转到指定页数
      jumpIptCls: 'jump-ipt', //文本框内容
      jumpBtnCls: 'jump-btn', //跳转按钮
      jumpBtn: '跳转', //跳转按钮文本
      showGoInput: true,
      showGoButton: true,
    });
    keyInitTable(params2);
  }
  //更改检索后节点后的字体颜色
  function getFont(treeId, node) {
    if (node.ISRED) {
      return { height: '25px', color: '#ff0000' };
    } else {
      return { height: '25px', color: '#000' };
    }
  }
  function getClasses(treeId, node) {
    if (node.ISRED) {
      return { add: ['highlight'] };
    } else {
      return { remove: ['highlight'] };
    }
  }
  //加载树结构的参数
  var setting = {
    view: {
      showIcon: false,
      fontCss: getFont,
      nodeClasses: getClasses,
      //showIcon: showIconForTree
    },
    callback: {
      onClick: zTreeOnClick,
    },
    data: {
      simpleData: {
        enable: true,
      },
      key: {
        //title:"TITLE",
        name: 'TITLE',
        id: 'ZJ',
        pId: 'PZJ',
        children: 'children',
        checked: 'checked',
      },
    },
    view: {
      addDiyDom: addDiyDom,
      dblClickExpand: true,
      showIcon: false,
      //				fontCss:{height:'25px',color:'#000'}
      fontCss: getFont,
      nodeClasses: getClasses,
    },
  };

  function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
  }

  function addDiyDom(treeId, treeNode) {
    var aObj = $('#' + treeNode.tId + '_a .node_name');
    if ($('#diyBtn_' + treeNode.id).length > 0) return;
    //var editStr= "<div id='diyBtn_space_" +treeNode.id+ "'> </div>";
    aObj.attr('id', treeNode.tId + '_span');
    //var editStr = "<a disabled href=''> </a>";
    //aObj.append(editStr);
  }

  function zTreeOnClick(event, treeId, treeNode) {
    $('.wordContent').empty();
    $('.allPicture').empty();
    $('.scanning').empty();
    treeNode.PAGE = String(treeNode.PAGE);
    var pagehtml =
      GLOBAL.PAGEURL +
      decryData(GLOBAL.GETQUERYSTRING('DIR')) +
      '/epub/EPUB' +
      '/' +
      'page_' +
      (treeNode.PAGE.length == 2
        ? '00' + treeNode.PAGE
        : treeNode.PAGE.length == 3
        ? '0' + treeNode.PAGE
        : treeNode.PAGE.length == 1
        ? '000' + treeNode.PAGE
        : treeNode.PAGE) +
      '.html';
    tempPage =
      GLOBAL.PAGEURL +
      decryData(GLOBAL.GETQUERYSTRING('DIR')) +
      '/epub/EPUB' +
      '/' +
      'page_' +
      (treeNode.PAGE.length == 2
        ? '00' + treeNode.PAGE
        : treeNode.PAGE.length == 3
        ? '0' + treeNode.PAGE
        : treeNode.PAGE.length == 1
        ? '000' + treeNode.PAGE
        : treeNode.PAGE) +
      '.html';

    treeNode.SCANPICTURE =
      GLOBAL.PAGEURL +
      decryData(GLOBAL.GETQUERYSTRING('DIR')) +
      '/scanpic/m' +
      '/' +
      (treeNode.PAGE.length == 2
        ? '00' + treeNode.PAGE
        : treeNode.PAGE.length == 3
        ? '0' + treeNode.PAGE
        : treeNode.PAGE.length == 1
        ? '000' + treeNode.PAGE
        : treeNode.PAGE) +
      '.png';

    $('#' + treeNode.tId + '_span').addClass('active');
    $('#' + treeId)
      .find('span')
      .not('#' + treeNode.tId + '_span')
      .removeClass('active');

    //判断文件是否存在
    pagingIsFile(pagehtml, treeNode, treeNode.PAGE);

    if (treeNode.hasOwnProperty('PAGECOUNT') && treeNode.PAGECOUNT != '') {
      nodePAGE = Number(treeNode.PAGE);
      //点击分页
      $('#div_pager').pagination({
        callback: PageCallback,
        pageCount: treeNode.PAGECOUNT,
        totalData: treeNode.PAGECOUNT,
        current_page: 10, //当前页索引
        showData: 1,
        current: Number(treeNode.PAGE),
        prevCls: 'prev',
        nextCls: 'next',
        activeCls: 'active',
        count: 3,
        coping: true,
        homePage: '首页',
        endPage: '末页',
        prevContent: '上页',
        nextContent: '下页',
        jump: true, //跳转到指定页数
        jumpIptCls: 'jump-ipt', //文本框内容
        jumpBtnCls: 'jump-btn', //跳转按钮
        jumpBtn: '跳转', //跳转按钮文本
        showGoInput: true,
        showGoButton: true,
      });
    }

    if (keywordflag) {
      dao
        .heightLightKeyword({
          data: JSON.stringify({ BOOKID: bookID, PAGENUM: Number(treeNode.PAGE), TYPE: '1' }),
        })
        .done(function (res) {
          var nameArray = [];
          var typeArray = [];

          //					if($.trim($('#articleKeyword').val())){
          //				      	nameArray.push($.trim($('#articleKeyword').val()));
          //				      	typeArray.push('');
          //				    }else{
          //				      	for (var i=0;i<res.data.items.length;i++) {
          //	      					nameArray.push(res.data.items[i].NAME);
          //	      					typeArray.push(res.data.items[i].TYPE);
          //	      				}
          //				    }
          for (var i = 0; i < res.data.items.length; i++) {
            nameArray.push(res.data.items[i].NAME);
            typeArray.push(res.data.items[i].TYPE);
          }
          if (nameArray.length != 0) {
            setTimeout(function () {
              highlight(nameArray, 'pagecss', typeArray);
            }, 500);
          }
        });
    } else {
      if (changeflag) {
        //繁体
        var nameArray1 = [];
        var typeArray1 = [];

        if (keywordCombx) {
          nameArray1.push(keywordCombx);
          typeArray1.push('');
        }
        if (nameArray1.length != 0) {
          setTimeout(function () {
            highlight(nameArray1, 'pagecss', typeArray1);
          }, 500);
        }
      } else {
        //简体

        var nameArray1 = [];
        var typeArray1 = [];

        if ($.trim($('#articleKeyword').val())) {
          nameArray1.push($.trim($('#articleKeyword').val()));
          typeArray1.push('');
        }
        if (nameArray1.length != 0) {
          setTimeout(function () {
            highlight(nameArray1, 'pagecss', typeArray1);
          }, 500);
        }
      }
    }
  }

  //加载书的基本信息
  dao.bookInfo = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/isRead', param);
  };

  //搜索书的关键词
  dao.searchBookInfo = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/inBookSearch', param);
  };

  //下载
  dao.downloadBookParaph = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/saveDownRecord', param);
  };

  //引用
  dao.quote = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/quote', param);
  };

  //关键词高亮
  dao.heightLightKeyword = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/pageEntry', param);
  };

  //关键词显示详细信息
  dao.heightLightDetail = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/getEntry', param);
  };

  //搜索关键词转化繁体
  dao.changeCombx = function (param) {
    return dkr.util.ajaxPost(GLOBAL.URL + 'Book/converter', param);
  };

  function keywordSearch(p) {
    if (wordIsPress) {
      //			        	if($.trim($('#articleKeyword').val())){
      $('.bookInfo').empty();
      dao
        .changeCombx({
          KEYWORD: $.trim($(p == 2 ? '#articleKeyword2' : '#articleKeyword').val()),
        })
        .done(function (result) {
          keywordCombx = result.data;
          searchxml(keywordCombx);
        });

      // 	return
      //   dao
      //     .searchBookInfo({
      //       data: JSON.stringify({
      //         KEYWORD: $.trim($('#articleKeyword').val()),
      //         BOOKID: res.ID,
      //         dir: decryData(GLOBAL.GETQUERYSTRING('DIR')),
      //       }),
      //     })
      //     .done(function (res) {
      //       // $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
      //       res.HANSKEYWORD = $('#articleKeyword').val();
      //       $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
      //       $('.keywordShow').toggle();
      //       for (var i = 0; i < res.CALEGORY.length; i++) {
      //         res.CALEGORY[i].id = res.CALEGORY[i].ZJ;
      //         res.CALEGORY[i].pId = res.CALEGORY[i].PZJ;
      //         res.CALEGORY[i].PAGECOUNT = res.PAGECOUNT;
      //         res.CALEGORY[i].ISRED = res.CALEGORY[i].ISRED ? true : false;
      //       }
      //       $.fn.zTree.init($('#treeDemo'), setting, res.CALEGORY);
      //       $.fn.zTree.getZTreeObj('treeDemo').expandAll(true);
      //       //$('#bookCatalogTemp').tmpl(res).appendTo('.catalog > ul');

      //       if (res.hasOwnProperty('CALEGORY') && res.CALEGORY.length > 0) {
      //         //默认ztree加载一条数据
      //         var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
      //         var node = treeObj.getNodeByParam('id', res.CALEGORY[0].id);
      //         treeObj.selectNode(node);

      //         treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node); //调用事件
      //       }
      //     });
    } else {
      if (!$('#searchWord').is(':visible')) {
        $('#searchWord')
          .css({ display: 'block', top: '-100px', position: 'fixed' })
          .animate({ top: '+100' }, 500, function () {
            setTimeout(noWords, 1000);
          });
      }
    }
    //			        	}else{
    //			        		    if(!$('#note').is(':visible')){
    //					                $('#note').css({display:'block', top:'-100px',position:'fixed'}).animate({top: '+100'}, 500, function(){
    //					                    setTimeout(out, 1000);
    //					                });
    //					            }
    ////			        		 layer.msg('<span style="color:red">请输入关键字</span>');
    //			        	}
  }
  dao
    .bookInfo({
      data: JSON.stringify({
        dir: decryData(GLOBAL.GETQUERYSTRING('DIR')),
        ZTTYPE: decryData(GLOBAL.GETQUERYSTRING('ZTTYPE')),
      }),
    })
    .done(function (res) {
      var isLook = res.ISLOOK;
      if (!isLook) {
        window.location.href = './noPower.html';
      }
      var hasText = res.HASTEXT;
      if (!hasText) {
        $('.changeFont').css('display', 'none');
        $('.word').css('display', 'none');
      }
      $('#bookInfomationTemp').tmpl(res).appendTo('.bookInfo');
      bookID = res.ID;
      wordIsPress = res.TYPE;
      pageCount = res.PAGECOUNT;
      bookTitle = res.TITLE || '';
      //$('#bookCatalogTemp').tmpl(res).appendTo('.catalog > ul');

      if (res.hasOwnProperty('CALEGORY') && res.CALEGORY.length > 0) {
        for (var i = 0; i < res.CALEGORY.length; i++) {
          res.CALEGORY[i].id = res.CALEGORY[i].ZJ;
          res.CALEGORY[i].pId = res.CALEGORY[i].PZJ;
          res.CALEGORY[i].PAGECOUNT = res.PAGECOUNT;
        }
        $.fn.zTree.init($('#treeDemo'), setting, res.CALEGORY);
        $.fn.zTree.getZTreeObj('treeDemo').expandAll(true);

        var pagehtml =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUB' +
          '/' +
          'page_0001.html';
        tempPage =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUB' +
          '/' +
          'page_0001.html';
        var treeNode = {};
        treeNode.SCANPICTURE =
          GLOBAL.PAGEURL + decryData(GLOBAL.GETQUERYSTRING('DIR')) + '/scanpic/m' + '/0001.png';
        nodePAGE = Number(1);
        pagingIsFile(pagehtml, treeNode, '1');

        //点击分页
        $('#div_pager').pagination({
          callback: PageCallback,
          pageCount: res.PAGECOUNT,
          totalData: res.PAGECOUNT,
          current_page: 10, //当前页索引
          showData: 1,
          current: 1,
          prevCls: 'prev',
          nextCls: 'next',
          activeCls: 'active',
          count: 3,
          coping: true,
          homePage: '首页',
          endPage: '末页',
          prevContent: '上页',
          nextContent: '下页',
          jump: true, //跳转到指定页数
          jumpIptCls: 'jump-ipt', //文本框内容
          jumpBtnCls: 'jump-btn', //跳转按钮
          jumpBtn: '跳转', //跳转按钮文本
          showGoInput: true,
          showGoButton: true,
        });

        //默认ztree加载一条数据
        var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
        //				var node = treeObj.getNodeByParam("id", res.CALEGORY[0].id);
        //				treeObj.selectNode(node);
        //				treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件
        //获取目录所有的页数
        var node = treeObj.getNodes();
        var nodes = treeObj.transformToArray(node);

        nodes.forEach(function (x, y) {
          zjPage.push(Number(nodes[y].PAGE));
        });

        if (keywordflag) {
          dao
            .heightLightKeyword({
              data: JSON.stringify({ BOOKID: res.ID, PAGENUM: Number(1), TYPE: '1' }),
            })
            .done(function (res) {
              var nameArray = [];
              var typeArray = [];

              if ($.trim($('#articleKeyword').val())) {
                nameArray.push($.trim($('#articleKeyword').val()));
                typeArray.push('');
              } else {
                for (var i = 0; i < res.data.items.length; i++) {
                  nameArray.push(res.data.items[i].NAME);
                  typeArray.push(res.data.items[i].TYPE);
                }
              }

              //						for (var i=0;i<res.data.items.length;i++) {
              //							nameArray.push(res.data.items[i].NAME);
              //							typeArray.push(res.data.items[i].TYPE);
              //						}
              if (nameArray.length != 0) {
                setTimeout(function () {
                  highlight(nameArray, 'pagecss', typeArray);
                }, 500);
              }
            });
        }
      } else {
        $('#treeDemo').text('暂无目录数据');
        if (res.hasOwnProperty('PAGECOUNT') && res.PAGECOUNT != '') {
          nodePAGE = Number(1);

          var pagehtml =
            GLOBAL.PAGEURL +
            decryData(GLOBAL.GETQUERYSTRING('DIR')) +
            '/epub/EPUB' +
            '/' +
            'page_0001.html';
          tempPage =
            GLOBAL.PAGEURL +
            decryData(GLOBAL.GETQUERYSTRING('DIR')) +
            '/epub/EPUB' +
            '/' +
            'page_0001.html';
          var treeNode = {};
          treeNode.SCANPICTURE =
            GLOBAL.PAGEURL + decryData(GLOBAL.GETQUERYSTRING('DIR')) + '/scanpic/m' + '/0001.png';

          pagingIsFile(pagehtml, treeNode, '1');

          //点击分页
          $('#div_pager').pagination({
            callback: PageCallback,
            pageCount: res.PAGECOUNT,
            totalData: res.PAGECOUNT,
            current_page: 10, //当前页索引
            showData: 1,
            current: 1,
            prevCls: 'prev',
            nextCls: 'next',
            activeCls: 'active',
            count: 3,
            coping: true,
            homePage: '首页',
            endPage: '末页',
            prevContent: '上页',
            nextContent: '下页',
            jump: true, //跳转到指定页数
            jumpIptCls: 'jump-ipt', //文本框内容
            jumpBtnCls: 'jump-btn', //跳转按钮
            jumpBtn: '跳转', //跳转按钮文本
            showGoInput: true,
            showGoButton: true,
          });
        }
      }

      //搜索关键词
      $('#articleKeyword').keypress(function (e) {
        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (eCode == 13) {
          keywordSearch();
        }
      });
      $('.icon-search').click(function () {
        keywordSearch();
      });

      //下载
      $('.operation .downloadBook').on('click', function () {
        dao
          .downloadBookParaph({
            data: JSON.stringify({
              BOOKID: res.ID,
              PAGENUM: nodePAGE,
              IMGURL:
                decryData(GLOBAL.GETQUERYSTRING('DIR')) +
                '/scanpic/l' +
                '/' +
                (String(nodePAGE).length == 2
                  ? '00' + String(nodePAGE)
                  : String(nodePAGE).length == 3
                  ? '0' + String(nodePAGE)
                  : String(nodePAGE).length == 1
                  ? '000' + String(nodePAGE)
                  : '') +
                '.png',
            }),
          })
          .done(function (res) {
            var imgpic = res.data.IMGSRC;

            // window.open(GLOBAL.PAGEURL+"temp/"+imgpic);
            window.open(GLOBAL.URL + 'Book/down?IMGSRC=' + imgpic);
          });
      });

      //  引用
      /* 	$('.appoint').click(function(){
				    dao.quote({
						  	data:JSON.stringify({"TITLE":res.hasOwnProperty('TITLE')?res.TITLE:'',"AUTHOR":res.hasOwnProperty('AUTHOR')?res.AUTHOR:'',"PUBLISHNAME":res.hasOwnProperty('HOLDER')?res.HOLDER:'',"PUBDATE":res.hasOwnProperty('CREATEYEAR')?res.CREATEYEAR:''})
						}).done(function(result){
							
							
							layer.open({
								type: 1,
								title:"引用",
								skin: 'layui-layer-rim', //加上边框
								area: ['580px', '350px'], //宽高
								content: '<div style="margin-left:30px;margin-top:30px;width: 518px;">'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A;">GB/T 7714</span><span style="color:#000">'+
								            //'闻一多. 诗经研究[M]. 巴蜀书社, 2002.'
								            res.AUTHOR+' . '+res.TITLE+' . '+res.HOLDER+' , '+res.CREATEYEAR+' . '
								            +'</span></p><br/>'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">MLA</span><span style="color:#000">'+
								            res.AUTHOR+' . '+res.TITLE+' . '+res.HOLDER+' , '+res.CREATEYEAR+' . '+
								            '</span></p><br/>'+
								            '<p style="margin:0px;border-bottom: 1px solid gray;padding-bottom: 10px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:20px;color:#9A9A9A">APA</span><span style="color:#000">'+
								            res.AUTHOR+' . '+'('+res.CREATEYEAR+')'+' . '+res.TITLE+' . '+res.HOLDER+' , '+
								            '</span></p><br/>'+
								            '<p style="margin:0px;"><span style="display: inline-block;width:90px;text-align:right;margin-right:12px;color:#9A9A9A">导入链接</span>'+   
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.BibTeX+'" download="">BibTeX</a> <a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.EndNote+'" download="">EndNote</a>'+ 
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.RefMan+'" download="">RefMan</a> <a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteFirst+'" download="">NoteFirst</a>'+ 
								            '<a style="color:#669BE4" href="'+GLOBAL.PAGEURL+"temp/"+result.data.NoteExpress+'" download="">NoteExpress</a></p></div>'
							});
							
							
					});
				
				    
					
			}); */
      $('#appoint').click(function () {
        $('#showPoint').css('display', 'block');
        $('#showPoint').css('left', $(this)[0].offsetLeft - 20);
        $('#showPoint').css('top', $(this)[0].offsetTop + 20);
      });
      var d1 = document.getElementById('showPoint');
      d1.onmouseout = mouseout_x;
      function mouseout_x(ae) {
        var e = window.event || ae;
        var s = e.toElement || e.relatedTarget;
        if (document.all) {
          if (!this.contains(s)) {
            $('#showPoint').hide();
          }
        } else {
          var res = this.compareDocumentPosition(s);
          if (!(res == 20 || res == 0)) {
            $('#showPoint').hide();
          }
        }
      }
      $('.p-download').click(function () {
        var url = encodeURIComponent(window.location.href);
        id = res.ID;
        type = $(this).data('text');
        window.open(GLOBAL.URL + 'Book/getQuote?url=' + url + '&id=' + id + '&type=' + type);
      });
    });

  //屏蔽键盘事件
  document.onkeydown = function () {
    var e = window.event || arguments[0];
    //F12
    if (e.keyCode == 123) {
      return false;
      //Ctrl+Shift+I
    }
  };

  //屏蔽鼠标右键
  document.oncontextmenu = function () {
    return true;
  };

  // 产生xml map
  function genXmlDocMap(xmlDoc) {
    let xml = xmlDoc.getElementsByTagName('chapter');
    let str = '';
    Array.from(xml).forEach(x => {
      str += x.innerHTML;
    });

    let page = 1;
    let title = '';

    // 先分title，再分page，最后分<>和\n\n
    const xmlarray = str.split(/(<title>.*<\/title>){1}/);
    const tmp = xmlarray.filter(x => !!x.trim());
    tmp.forEach(t => {
      if (t.indexOf('<title>') < t.indexOf('</title>')) {
        const txt = t.match(/.*(?=<\/title>)/);
        const text = txt[0].match(/(?<=<title>).*/);
        title = text && text[0];
      } else {
        const arr = [];
        let pag = t.split(/(<pagenumber pagenum=[^>]*\/>){1}/);
        const ptmp = pag.filter(p => !!p.trim());
        ptmp.forEach(x => {
          if (x.indexOf('<pagenumber pagenum=') > -1) {
            const numArr = x.match(/(?<=pagenum=\")\d+/);
            page = (numArr && numArr[0]) || page;
          } else {
            let xtmp = x.replace(/<[^>]*>/g, '\n');
            let xarr = xtmp.split('\n\n').filter(xt => !!xt.trim());
            xarr.forEach(xa => {
              arr.push({ page, text: xa });
            });
          }
        });
        title ? map.set(title, arr) : null;
      }
    });
    // searchxml('一');
  }

  // xml文件搜索
  function searchxml(keyword) {
    allUnitCount = 0;
    searchUnit = plusUnit;
    pieceList = [];
    let reg =
      /[\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]/g;
    map.forEach((m, t) => {
      let to = { title: t, arr: [] };
      m &&
        m.length &&
        m.forEach(x => {
          let n = x.text.indexOf(keyword);
          if (n > -1) {
            const obj = { ...x };
            let strx = x.text.substring(0, n);
            let dot;
            let count = 0;
            while ((dot = reg.exec(strx))) {
              count = dot.index;
            }
            obj.display = obj.text.substring(count ? count + 1 : count);
            const arr = obj.display.split(keyword);
            obj.html = arr.join(`<span style="color: red">${keyword}</span>`);
            obj.title = t;
            to.arr.push(obj);
            allUnitCount++;
          }
        });
      if (to.arr.length) {
        pieceList.push(to);
      }
    });
    openLayer(genUnit(pieceList));
  }

  // 产生搜索框body
  function genUnit(prr) {
    let tmp = [];
    let flag = false;
    let n = 0;
    for (let i = 0; i < prr.length; i++) {
      tmp[i] = { title: prr[i].title, arr: [] };
      for (let j = 0; j < prr[i].arr.length; j++) {
        n++;
        tmp[i].arr.push(prr[i].arr[j]);
        if (n >= searchUnit) {
          flag = true;
          break;
        }
      }
      if (flag) break;
    }
    return tmp;
  }

  // 加载更多
  function getMore(e) {
    e.stopPropagation && e.stopPropagation();
    e.preventDefault && e.preventDefault();
    searchUnit += plusUnit;
    if (searchUnit >= allUnitCount) {
      $('.getMore').hide();
    }
    openLayer(genUnit(pieceList));
  }

  // 打开对话框并设置
  function openLayer(arr) {
    let timer = setInterval(() => {
      if ($('#diagWrapper') && $('#diagWrapper').length) {
        $('.bookTitle').html(bookTitle);
        //搜索关键词
        $('#articleKeyword2').unbind();
        $('#articleKeyword2').keypress(function (e) {
          var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
          if (eCode == 13) {
            keywordSearch(2);
          }
        });
        $('.icon-search2').unbind();
        $('.icon-search2').click(() => keywordSearch(2));
        $('#diagWrapper').html('');
        $('#search-book-keyword').tmpl(arr).appendTo('#diagWrapper');

        $('.getMore').unbind();
        $('.getMore').click(e => getMore(e));
        console.log(map, pieceList, searchUnit, allUnitCount);
        if (searchUnit >= allUnitCount) {
          $('.getMore').hide();
        } else {
          $('.getMore').show();
        }
        $('#diagWrapper').unbind()
        $('#diagWrapper').delegate('p', 'click', function () {
          isSearchOpen = false;
          let item = $.tmplItem(this);
          let tmp = item.data.arr.find(a => a.display === this.title) || {};
          keybordContent(pageCount, parseInt(tmp.page));
          layer.closeAll();
        });
        clearInterval(timer);
      }
    }, 100);
    if (!isSearchOpen) {
      isSearchOpen = true;
      layer.open({
        type: 1,
        skin: 'dialog-class',
        fix: true,
        maxmin: false,
        shadeClose: false,
        closeBtn: 1,
        shade: 0.8, //默认0.3  遮罩层不显示  也可以shade: [0.8, '#393D49']；
        area: ['1100px', '600px'],
        offset: '100px',
        // title: [' ', 'background: #FFFCF1'],
        title: false,
        content: `
	<div class="diagWrapper">
       <div class="diagTitle">
          <span class="bookTitle"></span>
          <input type="text" placeholder="输入检索关键词" id="articleKeyword2" />
          <img class="icon-search2" src="../img/icon-search-brown.png" />
       </div>
       <div  id="diagWrapper"></div>
       <div class="getMore">
          <span>加载更多</span>
          <img src="../img/downArrow.png" />
       </div>
    </div>
	  `,
        //   content: $('#diagWrapper'),
        cancel: function () {
          //右上角关闭回调
          isSearchOpen = false;
          $('#diagWrapper').hide();
          //return false 开启该代码可禁止点击该按钮关闭
        },
      });
    }
  }

  /**
   * 利用ajax 读取本地json文件的数据
   * @param {文件路径} url
   */
  function readFile(url) {
    var param;
    $.ajax({
      url: url, // 文件位置
      type: 'GET', // 请求方式为get
      async: false,
      dataType: 'xml', // 返回数据格式为xml
      success: function (data) {
        param = data;
        genXmlDocMap(data);
      },
    });
    return param;
  }
});

var flagword = false;
var flagscan = false;
//点击文字触发的事件
$('.showStyle > .word > img').on('click', function () {
  if (wordIsPress) {
    $('.showStyle .changeFont img').css('display', 'none');
    $('.zoomIn div a img').css('display', 'block');
    if (flagword) {
      $(this).attr('src', '../img/icon-txt.png'); //文字取消状态
      $('.articleContent > .wordContent').css('display', 'none');
      $('.articleContent > .scanning').css('display', 'none');
      if (flagscan) {
        $(this).attr('src', '../img/icon-txt-active.png');
        $('.articleContent > .wordContent').css('display', 'block');
        $('.articleContent > .scanning').css('display', 'none');
        $('.articleContent > .allPicture').css('display', 'none');
        flagword = true;
      } else {
        $(this).attr('src', '../img/icon-txt.png');
        //$('.articleContent > .wordContent').css('display','none');
        $('.articleContent > .allPicture').css('display', 'block');
        $('.articleContent > .allPicture').css(
          'width',
          $('.articleContent > .allPicture > img').width()
        );
        flagword = false;
      }
    } else {
      $('.showStyle .changeFont img').css('display', 'inline-block');
      $('.zoomIn div a img').css('display', 'none');
      $(this).attr('src', '../img/icon-txt-active.png'); //文字选用状态
      $('.articleContent > .wordContent').css('display', 'block');
      $('.articleContent > .allPicture').css('display', 'none');
      if (flagscan) {
        //只选文字
        var minwidth = '650px';
        var minheight = '1104px';
        if ($('#iframeId').contents().find('.pagecss')[0] != undefined) {
          minwidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth;
          minheight = $('#iframeId').contents().find('.pagecss')[0].offsetHeight;
        }
        $('.articleContent > .wordContent').css('width', '50%');
        //			$('.articleContent > .wordContent').css('height',minheight);

        var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
        var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

        $('#iframeId')
          .contents()
          .find('body')
          .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');

        $('#iframeId').contents().find('body').css('overflow', 'hidden');

        $('.articleContent > .scanning').css('display', 'none');
      } else {
        var minwidth = '650px';
        var minheight = '1104px';
        if ($('#iframeId').contents().find('.pagecss')[0] != undefined) {
          minwidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth;
          minheight = $('#iframeId').contents().find('.pagecss')[0].offsetHeight;
        }
        //			$('.articleContent > .wordContent').css('width','auto');       //文字和扫描同时选中
        //			$('.articleContent > .wordContent').css('min-width',minwidth);       //文字和扫描同时选中
        //			$('.articleContent > .wordContent').css('min-height',minheight);       //文字和扫描同时选中

        //$('.articleContent > .wordContent').css('flex-grow',1);
        $('.articleContent > .wordContent').css('margin', '0px');
        $('.articleContent > .scanning').css('display', 'block');

        $('.articleContent > .wordContent').css('width', '50%');
        $('.articleContent > .scanning').css('width', '50%');

        $('.articleContent .wordContent').css('min-width', '');
        $('.articleContent .wordContent').css('min-height', '');

        var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
        var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

        $('#iframeId')
          .contents()
          .find('body')
          .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');

        $('#iframeId').contents().find('body').css('overflow', 'hidden');
      }
      flagword = true;
    }
  } else {
    //		layer.msg('<span style="color:red">该书没有文字页面</span>');
    if (!$('#noWord').is(':visible')) {
      $('#noWord')
        .css({ display: 'block', top: '-100px', position: 'fixed' })
        .animate({ top: '+100' }, 500, function () {
          setTimeout(noWords, 1000);
        });
    }
  }
});
//点击扫描触发的事件
$('.showStyle > .scan > img').on('click', function () {
  if (flagscan) {
    $(this).attr('src', '../img/origin-page-active.png'); //扫描选用状态
    $('.articleContent > .allPicture').css('display', 'block');
    $('.articleContent > .wordContent').css('display', 'none');
    $('.articleContent > .scanning').css('display', 'none');
    if (flagword) {
      //文字和扫描同时选中
      var minwidth = '650px';
      var minheight = '1104px';
      if ($('#iframeId').contents().find('.pagecss')[0] != undefined) {
        minwidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth;
        minheight = $('#iframeId').contents().find('.pagecss')[0].offsetHeight;
      }

      //$('.articleContent > .wordContent').css('flex-grow',1);

      //			$('.articleContent > .wordContent').css('width','auto');
      //			$('.articleContent > .wordContent').css('min-width',minwidth);
      //			$('.articleContent > .wordContent').css('min-height',minheight);       //文字和扫描同时选中

      $('.articleContent > .wordContent').css('margin', '0px');

      $('.articleContent > .wordContent').css('display', 'block');
      $('.articleContent > .scanning').css('display', 'block');
      $('.articleContent > .allPicture').css('display', 'none');

      $('.articleContent > .wordContent').css('width', '50%');
      $('.articleContent > .scanning').css('width', '50%');

      $('.articleContent .wordContent').css('min-width', '');
      $('.articleContent .wordContent').css('min-height', '');

      var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
      var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度
      $('#iframeId')
        .contents()
        .find('body')
        .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
      $('#iframeId').contents().find('body').css('transform-origin', 'top left');

      $('#iframeId')
        .contents()
        .find('body')
        .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');

      $('#iframeId').contents().find('body').css('overflow', 'hidden');
    } else {
      //只选扫描
      //			$('.showStyle > .word > img').attr('src','../img/icon-txt.png');
      $('.articleContent > .wordContent').css('display', 'none');
      $('.articleContent > .scanning').css('display', 'none');
      $('.articleContent > .allPicture').css('width', '50%');
    }
    flagscan = false;
  } else {
    var minwidth = '650px';
    var minheight = '1104px';
    if ($('#iframeId').contents().find('.pagecss')[0] != undefined) {
      minwidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth;
      minheight = $('#iframeId').contents().find('.pagecss')[0].offsetHeight;
    }
    $(this).attr('src', '../img/origin-page.png'); //扫描取消状态
    $('.articleContent > .allPicture').css('display', 'none');
    //		$('.articleContent > .wordContent').css('min-width',minwidth);

    //$('.articleContent > .wordContent').css('min-height',minheight);
    $('.articleContent > .wordContent').css('margin', '0 auto');
    $('.articleContent > .scanning').css('display', 'none');

    setTimeout(function () {
      if (fontSizeWidth != '') {
        $('.articleContent .wordContent').css('width', fontSizeWidth);
        $('.articleContent .wordContent').css('height', fontSizeHeight);
        //实时的缩放比列
        $('#iframeId')
          .contents()
          .find('body')
          .css(
            'transform',
            'scale(' +
              $('.articleContent .wordContent').width() /
                $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
              ')'
          );
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css(
            'zoom',
            ($('.articleContent .wordContent').width() /
              $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
              100 +
              '% !important'
          );

        $('#iframeId').contents().find('body').css('overflow', 'hidden');
      } else {
        var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
        var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

        $('#iframeId')
          .contents()
          .find('body')
          .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
        $('#iframeId').contents().find('body').css('overflow', 'hidden');
      }
      //
      //
      //				var screenWordContent=$('.articleContent .wordContent').width();                //屏幕大小自适应宽度
      //		        var htmlWidth=$("#iframeId").contents().find('.pagecss')[0].offsetWidth;    //html宽度
      //		        $("#iframeId").contents().find("body").css("transform",'scale('+screenWordContent/htmlWidth+')');
      //	            $("#iframeId").contents().find("body").css("transform-origin",'top left');
      //
      //		        $("#iframeId").contents().find("body").css("zoom",screenWordContent/htmlWidth*100+'% !important');
      //
      //	            $("#iframeId").contents().find("body").css('overflow','hidden');
    }, 200);

    //至少存在一个
    if (!flagword) {
      //文字取消

      $(this).attr('src', '../img/origin-page-active.png');
      $('.articleContent > .allPicture').css('display', 'block');
      $('.articleContent > .scanning').css('display', 'none');
      $('.articleContent > .wordContent').css('display', 'none');
      flagscan = false;
    } else {
      flagscan = true;
    }
    //$("#iframeId").contents().find("body").css("zoom",'100%');
  }
});

var test;
//字体放大
$('.zoomIn .fontAdd').on('click', function () {
  if ((!flagword && !flagscan) || (flagword && flagscan)) {
    //只选一个
    fontBig();
  }
});

//字体缩小
$('.zoomIn .fontReduce').on('click', function () {
  if ((!flagword && !flagscan) || (flagword && flagscan)) {
    //只选一个
    fontSmall();
  }
});

//字体放大
function fontBig() {
  setTimeout(function () {
    //扩大的最大宽度 不能 超过显示区域

    if (
      $('.articleContent .wordContent').width() <
      $('.showcontent .articleContent').width() * 0.9
    ) {
      $('.articleContent .wordContent').css(
        'width',
        $('.articleContent .wordContent').width() * 1.1
      );
      $('.articleContent .wordContent').css(
        'height',
        $('.articleContent .wordContent').height() * 1.1
      );

      //实时的缩放比列
      $('#iframeId')
        .contents()
        .find('body')
        .css(
          'transform',
          'scale(' +
            $('.articleContent .wordContent').width() /
              $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
            ')'
        );
      $('#iframeId').contents().find('body').css('transform-origin', 'top left');

      $('#iframeId')
        .contents()
        .find('body')
        .css(
          'zoom',
          ($('.articleContent .wordContent').width() /
            $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
            100 +
            '% !important'
        );

      $('#iframeId').contents().find('body').css('overflow', 'hidden');

      if (test == undefined && test != '') {
        test = $('.articleContent .wordContent').width();
      }
    }
    fontSizeWidth = $('.articleContent .wordContent').width();
    fontSizeHeight = $('.articleContent .wordContent').height();
    $('.articleContent .allPicture').css('width', $('.articleContent .allPicture').width() * 1.1);
  }, 100);
}

//字体放小
function fontSmall() {
  setTimeout(function () {
    //缩小的最大宽度 不能 超过初始化的宽度
    //if($('.articleContent .wordContent').width()>=test){

    $('.articleContent .wordContent').css('width', $('.articleContent .wordContent').width() * 0.9);
    $('.articleContent .wordContent').css(
      'height',
      $('.articleContent .wordContent').height() * 0.9
    );
    //实时的缩放比列

    $('#iframeId')
      .contents()
      .find('body')
      .css(
        'transform',
        'scale(' +
          $('.articleContent .wordContent').width() /
            $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
          ')'
      );
    $('#iframeId').contents().find('body').css('transform-origin', 'top left');

    $('#iframeId')
      .contents()
      .find('body')
      .css(
        'zoom',
        ($('.articleContent .wordContent').width() /
          $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
          100 +
          '% !important'
      );

    $('#iframeId').contents().find('body').css('overflow', 'hidden');

    if (test == undefined && test != '') {
      test = $('.articleContent .wordContent').width();
    }
    //}
    fontSizeWidth = $('.articleContent .wordContent').width();
    fontSizeHeight = $('.articleContent .wordContent').height();
    $('.articleContent .allPicture').css('width', $('.articleContent .allPicture').width() * 0.9);
  }, 100);
}

/**
 * 分页
 */
//分页回调函数
function PageCallback(index, jq) {
  InitTable(index);
}

//分页
function InitTable(pageIndex) {
  var currentpage = String(pageIndex.getCurrent());
  var treeNode = {};
  nodePAGE = Number(currentpage);
  $('.wordContent').empty();
  $('.allPicture').empty();
  $('.scanning').empty();
  var pagehtml =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/epub/EPUB' +
    '/' +
    'page_' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.html';
  //			treeNode.PAGEHTML=GLOBAL.GETQUERYSTRING('DIR')+"/"+"page_"+(currentpage.length==2?'00'+currentpage:(currentpage.length==3?'0'+currentpage:(currentpage.length==1?'000'+currentpage:'')))+".html";
  tempPage =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/epub/EPUB' +
    '/' +
    'page_' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.html';

  treeNode.SCANPICTURE =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/scanpic/m' +
    '/' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.png';

  //判断文件是否存在
  pagingIsFile(pagehtml, treeNode, currentpage);

  var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
  if (treeObj != null) {
    var node = treeObj.getNodes();
    var nodes = treeObj.transformToArray(node);

    var data = find(zjPage, currentpage);
    //定位目录的位置
    for (var i = 0; i < nodes.length; i++) {
      if (data == nodes[i].PAGE || nodes[i].PAGE == currentpage) {
        var nodeid = treeObj.getNodeByParam('id', nodes[i].id);
        treeObj.selectNode(nodeid);

        $('#' + nodes[i].tId + '_span').addClass('active');
        $('#treeDemo')
          .find('span')
          .not('#' + nodes[i].tId + '_span')
          .removeClass('active');

        break;
      }
    }
  }

  var treeNode = {};

  if (keywordflag) {
    dao
      .heightLightKeyword({
        data: JSON.stringify({ BOOKID: bookID, PAGENUM: Number(currentpage), TYPE: '1' }),
      })
      .done(function (res) {
        var nameArray = [];
        var typeArray = [];

        //	      				if($.trim($('#articleKeyword').val())){
        //    				      	nameArray.push($.trim($('#articleKeyword').val()));
        //    				      	typeArray.push('');
        //    				    }else{
        //    				      	for (var i=0;i<res.data.items.length;i++) {
        //		      					nameArray.push(res.data.items[i].NAME);
        //		      					typeArray.push(res.data.items[i].TYPE);
        //		      				}
        //    				    }

        for (var i = 0; i < res.data.items.length; i++) {
          nameArray.push(res.data.items[i].NAME);
          typeArray.push(res.data.items[i].TYPE);
        }
        if (nameArray.length != 0) {
          setTimeout(function () {
            highlight(nameArray, 'pagecss', typeArray);
          }, 500);
        }
      });
  }
  if (changeflag) {
    //繁体
    var nameArray1 = [];
    var typeArray1 = [];

    if (keywordCombx) {
      nameArray1.push(keywordCombx);
      typeArray1.push('');
    }
    if (nameArray1.length != 0) {
      setTimeout(function () {
        highlight(nameArray1, 'pagecss', typeArray1);
      }, 500);
    }
  } else {
    //简体

    var nameArray1 = [];
    var typeArray1 = [];

    if ($.trim($('#articleKeyword').val())) {
      nameArray1.push($.trim($('#articleKeyword').val()));
      typeArray1.push('');
    }
    if (nameArray1.length != 0) {
      setTimeout(function () {
        highlight(nameArray1, 'pagecss', typeArray1);
      }, 500);
    }
  }
}

//键盘按键-分页
function keyInitTable(pageIndex) {
  var currentpage = String(pageIndex);
  var treeNode = {};
  nodePAGE = Number(currentpage);
  $('.wordContent').empty();
  $('.allPicture').empty();
  $('.scanning').empty();
  var pagehtml =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/epub/EPUB' +
    '/' +
    'page_' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.html';
  //			treeNode.PAGEHTML=GLOBAL.GETQUERYSTRING('DIR')+"/"+"page_"+(currentpage.length==2?'00'+currentpage:(currentpage.length==3?'0'+currentpage:(currentpage.length==1?'000'+currentpage:'')))+".html";
  tempPage =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/epub/EPUB' +
    '/' +
    'page_' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.html';

  treeNode.SCANPICTURE =
    GLOBAL.PAGEURL +
    decryData(GLOBAL.GETQUERYSTRING('DIR')) +
    '/scanpic/m' +
    '/' +
    (currentpage.length == 2
      ? '00' + currentpage
      : currentpage.length == 3
      ? '0' + currentpage
      : currentpage.length == 1
      ? '000' + currentpage
      : currentpage) +
    '.png';

  //判断文件是否存在
  pagingIsFile(pagehtml, treeNode, currentpage);

  var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
  if (treeObj != null) {
    var node = treeObj.getNodes();
    var nodes = treeObj.transformToArray(node);

    var data = find(zjPage, currentpage);
    //定位目录的位置
    for (var i = 0; i < nodes.length; i++) {
      if (data == nodes[i].PAGE || nodes[i].PAGE == currentpage) {
        var nodeid = treeObj.getNodeByParam('id', nodes[i].id);
        treeObj.selectNode(nodeid);

        $('#' + nodes[i].tId + '_span').addClass('active');
        $('#treeDemo')
          .find('span')
          .not('#' + nodes[i].tId + '_span')
          .removeClass('active');

        break;
      }
    }
  }

  var treeNode = {};

  if (keywordflag) {
    dao
      .heightLightKeyword({
        data: JSON.stringify({ BOOKID: bookID, PAGENUM: Number(currentpage), TYPE: '1' }),
      })
      .done(function (res) {
        var nameArray = [];
        var typeArray = [];

        //	      				if($.trim($('#articleKeyword').val())){
        //    				      	nameArray.push($.trim($('#articleKeyword').val()));
        //    				      	typeArray.push('');
        //    				    }else{
        for (var i = 0; i < res.data.items.length; i++) {
          nameArray.push(res.data.items[i].NAME);
          typeArray.push(res.data.items[i].TYPE);
        }
        //    				    }

        if (nameArray.length != 0) {
          setTimeout(function () {
            highlight(nameArray, 'pagecss', typeArray);
          }, 500);
        }
      });
  }

  if (changeflag) {
    //繁体
    var nameArray1 = [];
    var typeArray1 = [];

    if (keywordCombx) {
      nameArray1.push(keywordCombx);
      typeArray1.push('');
    }
    if (nameArray1.length != 0) {
      setTimeout(function () {
        highlight(nameArray1, 'pagecss', typeArray1);
      }, 500);
    }
  } else {
    //简体

    var nameArray1 = [];
    var typeArray1 = [];

    if ($.trim($('#articleKeyword').val())) {
      nameArray1.push($.trim($('#articleKeyword').val()));
      typeArray1.push('');
    }
    if (nameArray1.length != 0) {
      setTimeout(function () {
        highlight(nameArray1, 'pagecss', typeArray1);
      }, 500);
    }
  }
}

//判断点击分页的数字是否在章节区间
function find(array, val) {
  var idx;
  for (var i = 0; i < array.length; i++) {
    if (array[i] > val) {
      idx = array[i - 1];
      break;
    }
  }
  return idx;
}

$('.backtop').on('click', function () {
  $('.showcontent').animate({ scrollTop: 0 }, 'fast');
});

//目录显示滚动条
var height = window.innerHeight - $('.catalog').offset().top;
$('.catalogContent .catalog').css('height', height + 'px');
$('.catalogContent .catalog').css('overflow', 'auto');

//内容显示滚动条
var heightCon = window.innerHeight - $('.showcontent').offset().top;
$('.showcontent').css('height', heightCon + 'px');
$('.showcontent').css('overflow', 'auto');

document.getElementById('showcontentid').onscroll = function () {
  if ($('.showcontent').scrollTop() >= 100) {
    $('.backtop').fadeIn(1000);
  } else {
    $('.backtop').fadeOut(1000);
  }
};

//简体是否选择，根据简体情况，控制关键词
var tempPage;
//字体转化
var changeflag = true;
$('.showStyle .changeFont').on('click', function () {
  if (wordIsPress) {
    if (flagword) {
      var treeNode = {};
      nodePAGE = String(nodePAGE);
      kkk = 0;
      var parent = div.parentElement;

      if (kkk != 0) {
        parent.removeChild(div);
      }
      $('.wordContent').empty();
      if (changeflag || (flagword == false && flagscan == false)) {
        $('.showStyle .changeFont img').attr('src', '../img/simplifiedCheck.png'); //转化为简体

        treeNode.PAGEHTML =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUBS' +
          '/' +
          'page_' +
          (nodePAGE.length == 2
            ? '00' + nodePAGE
            : nodePAGE.length == 3
            ? '0' + nodePAGE
            : nodePAGE.length == 1
            ? '000' + nodePAGE
            : nodePAGE) +
          '.html';
        tempPage =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUBS' +
          '/' +
          'page_' +
          (nodePAGE.length == 2
            ? '00' + nodePAGE
            : nodePAGE.length == 3
            ? '0' + nodePAGE
            : nodePAGE.length == 1
            ? '000' + nodePAGE
            : nodePAGE) +
          '.html';
        fontChange(treeNode);

        if (keywordflag) {
          dao
            .heightLightKeyword({
              data: JSON.stringify({ BOOKID: bookID, PAGENUM: nodePAGE, TYPE: '0' }),
            })
            .done(function (res) {
              var nameArray = [];
              var typeArray = [];

              //						if($.trim($('#articleKeyword').val())){
              //    				      	nameArray.push($.trim($('#articleKeyword').val()));
              //    				      	typeArray.push('');
              //    				    }else{
              //    				      	for (var i=0;i<res.data.items.length;i++) {
              //		      					nameArray.push(res.data.items[i].NAME);
              //		      					typeArray.push(res.data.items[i].TYPE);
              //		      				}
              //    				    }

              for (var i = 0; i < res.data.items.length; i++) {
                nameArray.push(res.data.items[i].NAME);
                typeArray.push(res.data.items[i].TYPE);
              }
              if (nameArray.length != 0) {
                setTimeout(function () {
                  highlight(nameArray, 'pagecss', typeArray);

                  var list = document
                    .getElementById('iframeId')
                    .contentWindow.document.getElementsByClassName('highlight');

                  for (var i = 0; i < list.length; i++) {
                    (function (i) {
                      list[i].onmouseover = function () {
                        //提示信息
                        dao
                          .heightLightDetail({
                            data: JSON.stringify({
                              NAME: $(list[i]).html(),
                              TYPE: $(list[i]).attr('value'),
                              CODE: '0',
                            }),
                          })
                          .done(function (res) {
                            tipsPosition(res.data.MAINBOOK, $(list[i]));
                          });
                      };

                      list[i].onmouseleave = function (e) {
                        tipsLeave();
                      };
                    })(i);
                  }
                }, 500);
              }
            });
        } else {
          if (!changeflag) {
            //繁体
            var nameArray1 = [];
            var typeArray1 = [];

            if (keywordCombx) {
              nameArray1.push(keywordCombx);
              typeArray1.push('');
            }
            if (nameArray1.length != 0) {
              setTimeout(function () {
                highlight(nameArray1, 'pagecss', typeArray1);
              }, 500);
            }
          } else {
            //简体

            var nameArray1 = [];
            var typeArray1 = [];

            if ($.trim($('#articleKeyword').val())) {
              nameArray1.push($.trim($('#articleKeyword').val()));
              typeArray1.push('');
            }
            if (nameArray1.length != 0) {
              setTimeout(function () {
                highlight(nameArray1, 'pagecss', typeArray1);
              }, 500);
            }
          }
        }

        changeflag = false;
      } else if (!changeflag || (flagword == true && flagscan == true)) {
        $('.showStyle .changeFont img').attr('src', '../img/simplified.png'); //转化为繁体
        treeNode.PAGEHTML =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUB' +
          '/' +
          'page_' +
          (nodePAGE.length == 2
            ? '00' + nodePAGE
            : nodePAGE.length == 3
            ? '0' + nodePAGE
            : nodePAGE.length == 1
            ? '000' + nodePAGE
            : nodePAGE) +
          '.html';
        tempPage =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUB' +
          '/' +
          'page_' +
          (nodePAGE.length == 2
            ? '00' + nodePAGE
            : nodePAGE.length == 3
            ? '0' + nodePAGE
            : nodePAGE.length == 1
            ? '000' + nodePAGE
            : nodePAGE) +
          '.html';
        fontChange(treeNode);

        if (keywordflag) {
          dao
            .heightLightKeyword({
              data: JSON.stringify({ BOOKID: bookID, PAGENUM: nodePAGE, TYPE: '1' }),
            })
            .done(function (res) {
              var nameArray = [];
              var typeArray = [];
              //							if($.trim($('#articleKeyword').val())){
              //	      				      	nameArray.push($.trim($('#articleKeyword').val()));
              //	      				      	typeArray.push('');
              //	      				    }else{
              //	      				      	for (var i=0;i<res.data.items.length;i++) {
              //			      					nameArray.push(res.data.items[i].NAME);
              //			      					typeArray.push(res.data.items[i].TYPE);
              //			      				}
              //	      				    }
              for (var i = 0; i < res.data.items.length; i++) {
                nameArray.push(res.data.items[i].NAME);
                typeArray.push(res.data.items[i].TYPE);
              }
              if (nameArray.length != 0) {
                setTimeout(function () {
                  highlight(nameArray, 'pagecss', typeArray);

                  var list = document
                    .getElementById('iframeId')
                    .contentWindow.document.getElementsByClassName('highlight');

                  for (var i = 0; i < list.length; i++) {
                    (function (i) {
                      list[i].onmouseover = function () {
                        //提示信息
                        dao
                          .heightLightDetail({
                            data: JSON.stringify({
                              NAME: $(list[i]).html(),
                              TYPE: $(list[i]).attr('value'),
                              CODE: '1',
                            }),
                          })
                          .done(function (res) {
                            tipsPosition(res.data.MAINBOOK, $(list[i]));
                          });
                      };

                      list[i].onmouseleave = function (e) {
                        tipsLeave();
                      };
                    })(i);
                  }
                }, 500);
              }
            });
        } else {
          if (changeflag) {
            //繁体
            var nameArray1 = [];
            var typeArray1 = [];

            if (keywordCombx) {
              nameArray1.push(keywordCombx);
              typeArray1.push('');
            }
            if (nameArray1.length != 0) {
              setTimeout(function () {
                highlight(nameArray1, 'pagecss', typeArray1);
              }, 500);
            }
          } else {
            //简体

            var nameArray1 = [];
            var typeArray1 = [];

            if ($.trim($('#articleKeyword').val())) {
              nameArray1.push($.trim($('#articleKeyword').val()));
              typeArray1.push('');
            }
            if (nameArray1.length != 0) {
              setTimeout(function () {
                highlight(nameArray1, 'pagecss', typeArray1);
              }, 500);
            }
          }
        }

        changeflag = true;
      }
    }
  } else {
    if (!$('#noWord').is(':visible')) {
      $('#noWord')
        .css({ display: 'block', top: '-100px', position: 'fixed' })
        .animate({ top: '+100' }, 500, function () {
          setTimeout(noWords, 1000);
        });
    }
  }
});

//关键词是否提示
var keywordflag = false;
$('.showStyle .changeKeyword').on('click', function () {
  if (wordIsPress) {
    $('#articleKeyword').val('');
    var treeNode = {};
    nodePAGE = String(nodePAGE);
    kkk = 0;
    //	        var parent = div.parentElement;
    //
    //	        if(kkk!=0){
    //	        	parent.removeChild(div);
    //	        }
    $('.wordContent').empty();
    if (keywordflag || (flagword == false && flagscan == false)) {
      $('.showStyle .changeKeyword img').attr('src', '../img/keyword.png'); //转化为关键字未选中

      treeNode.PAGEHTML = tempPage;

      fontChange(treeNode);

      keywordflag = false;
    } else if (!keywordflag || (flagword == true && flagscan == true)) {
      $('.showStyle .changeKeyword img').attr('src', '../img/keywordCheck.png'); //转化为关键字选中
      treeNode.PAGEHTML = tempPage;
      fontChange(treeNode);

      dao
        .heightLightKeyword({
          data: JSON.stringify({ BOOKID: bookID, PAGENUM: nodePAGE, TYPE: '1' }),
        })
        .done(function (res) {
          var nameArray = [];
          var typeArray = [];

          if ($.trim($('#articleKeyword').val())) {
            nameArray.push($.trim($('#articleKeyword').val()));
            typeArray.push('');
          } else {
            for (var i = 0; i < res.data.items.length; i++) {
              nameArray.push(res.data.items[i].NAME);
              typeArray.push(res.data.items[i].TYPE);
            }
          }
          //					for (var i=0;i<res.data.items.length;i++) {
          //						nameArray.push(res.data.items[i].NAME);
          //						typeArray.push(res.data.items[i].TYPE);
          //					}
          if (nameArray.length != 0) {
            setTimeout(function () {
              highlight(nameArray, 'pagecss', typeArray);

              var list = document
                .getElementById('iframeId')
                .contentWindow.document.getElementsByClassName('highlight');

              for (var i = 0; i < list.length; i++) {
                (function (i) {
                  list[i].onmouseover = function () {
                    //提示信息
                    dao
                      .heightLightDetail({
                        data: JSON.stringify({
                          NAME: $(list[i]).html(),
                          TYPE: $(list[i]).attr('value'),
                          CODE: '1',
                        }),
                      })
                      .done(function (res) {
                        tipsPosition(res.data.MAINBOOK, $(list[i]));
                      });
                  };

                  list[i].onmouseleave = function (e) {
                    tipsLeave();
                  };
                })(i);
              }
            }, 500);
          }
        });

      keywordflag = true;
    }
  } else {
    if (!$('#noWord').is(':visible')) {
      $('#noWord')
        .css({ display: 'block', top: '-100px', position: 'fixed' })
        .animate({ top: '+100' }, 500, function () {
          setTimeout(noWords, 1000);
        });
    }
  }
});

//字体判断文件是否存在
function fontChange(treeNode) {
  $.ajax({
    url: treeNode.PAGEHTML,
    type: 'HEAD',
    error: function () {
      treeNode.PAGEHTML = 'lostPage.html';
      $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');

      $('#iframeId').on('load', function () {
        var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
        var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

        $('#iframeId')
          .contents()
          .find('body')
          .css(
            'transform',
            'scale(' +
              $('.articleContent .wordContent').width() /
                $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
              ')'
          );
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
        $('#iframeId').contents().find('body').css('overflow', 'hidden');
      });
    },
    success: function () {
      $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');

      $('#iframeId').on('load', function () {
        var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
        var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

        $('#iframeId')
          .contents()
          .find('body')
          .css(
            'transform',
            'scale(' +
              $('.articleContent .wordContent').width() /
                $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
              ')'
          );
        $('#iframeId').contents().find('body').css('transform-origin', 'top left');

        $('#iframeId')
          .contents()
          .find('body')
          .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
        $('#iframeId').contents().find('body').css('overflow', 'hidden');
      });
    },
  });
}

//分页或点击目录判断文件是否存在
function pagingIsFile(pagehtml, treeNode, pageNum) {
  //  	    layer.load(2, {shade: false});
  //  	    layer.open({
  //  		  type: 1,
  //  		  shade: [0.1,'#fff'],
  //  		  skin: 'layui-layer-rim', //加上边框
  //  		  area: ['300px', '150px'], //宽高
  //  		  content: '<p style="text-align:center;margin-top:30px;">加载中......</p>'
  //  		});

  layer.load(1, {
    shade: [0.01, '#fff'], //0.1透明度的白色背景
  });

  //判断文件是否存在
  $.ajax({
    url: pagehtml,
    type: 'HEAD',
    error: function () {
      treeNode.PAGEHTML = 'lostPage.html';

      $('.articleContent > .wordContent').css('width', '50%');

      $.ajax({
        url: treeNode.SCANPICTURE,
        type: 'HEAD',
        error: function () {
          treeNode.SCANPICTURE = '../img/lostPage.png';
          $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
          $('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
          $('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');

          $('#iframeId').on('load', function () {
            if (fontSizeWidth != '') {
              $('.articleContent .wordContent').css('width', fontSizeWidth);
              $('.articleContent .wordContent').css('height', fontSizeHeight);
              //实时的缩放比列
              $('#iframeId')
                .contents()
                .find('body')
                .css(
                  'transform',
                  'scale(' +
                    $('.articleContent .wordContent').width() /
                      $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
                    ')'
                );
              $('#iframeId').contents().find('body').css('transform-origin', 'top left');

              $('#iframeId')
                .contents()
                .find('body')
                .css(
                  'zoom',
                  ($('.articleContent .wordContent').width() /
                    $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
                    100 +
                    '% !important'
                );

              $('#iframeId').contents().find('body').css('overflow', 'hidden');
            } else {
              var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
              var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

              $('#iframeId')
                .contents()
                .find('body')
                .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
              $('#iframeId').contents().find('body').css('transform-origin', 'top left');

              $('#iframeId')
                .contents()
                .find('body')
                .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
              $('#iframeId').contents().find('body').css('overflow', 'hidden');
            }
            layer.closeAll();
          });
        },
        success: function () {
          $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
          $('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
          $('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');

          $('#iframeId').on('load', function () {
            if (fontSizeWidth != '') {
              $('.articleContent .wordContent').css('width', fontSizeWidth);
              $('.articleContent .wordContent').css('height', fontSizeHeight);
              //实时的缩放比列
              $('#iframeId')
                .contents()
                .find('body')
                .css(
                  'transform',
                  'scale(' +
                    $('.articleContent .wordContent').width() /
                      $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
                    ')'
                );
              $('#iframeId').contents().find('body').css('transform-origin', 'top left');
              $('#iframeId')
                .contents()
                .find('body')
                .css(
                  'zoom',
                  ($('.articleContent .wordContent').width() /
                    $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
                    100 +
                    '% !important'
                );
              $('#iframeId').contents().find('body').css('overflow', 'hidden');
            } else {
              var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
              var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

              $('#iframeId')
                .contents()
                .find('body')
                .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
              $('#iframeId').contents().find('body').css('transform-origin', 'top left');
              $('#iframeId')
                .contents()
                .find('body')
                .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
              $('#iframeId').contents().find('body').css('overflow', 'hidden');
            }
            layer.closeAll();
          });
        },
      });
    },
    success: function () {
      kkk = 0;
      var parent = div.parentElement;

      if (kkk != 0) {
        parent.removeChild(div);
      }
      console.log(pageNum);

      if (changeflag) {
        //选择的是简体
        treeNode.PAGEHTML = pagehtml;
        tempPage = pagehtml;
      } else {
        treeNode.PAGEHTML =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUBS' +
          '/' +
          'page_' +
          (pageNum.length == 2
            ? '00' + pageNum
            : pageNum.length == 3
            ? '0' + pageNum
            : pageNum.length == 1
            ? '000' + pageNum
            : pageNum) +
          '.html';
        tempPage =
          GLOBAL.PAGEURL +
          decryData(GLOBAL.GETQUERYSTRING('DIR')) +
          '/epub/EPUBS' +
          '/' +
          'page_' +
          (pageNum.length == 2
            ? '00' + pageNum
            : pageNum.length == 3
            ? '0' + pageNum
            : pageNum.length == 1
            ? '000' + pageNum
            : pageNum) +
          '.html';

        changeflag = false;
      }

      if (flagword && !flagscan) {
        //同时选中文字和原页
        $('.articleContent > .wordContent').css('width', '50%');
        $('.articleContent > .scanning').css('width', '50%');
      } else {
        $('.articleContent > .allPicture').css(
          'height',
          window.innerHeight - $('.allPicture').offset().top
        );
        $('.articleContent > .allPicture > img').css('height', '100%');
        $('.articleContent > .allPicture > img').css('width', '100%');
      }

      $('#bookContentShowTemp').tmpl(treeNode).appendTo('.wordContent');
      $('#bookScanShowTemp').tmpl(treeNode).appendTo('.allPicture');
      $('#bookScanShowTemp').tmpl(treeNode).appendTo('.scanning');

      $('#iframeId').on('load', function () {
        if (flagword && !flagscan) {
          $('.articleContent .wordContent').css('width', '50%');
          $('.articleContent > .scanning').css('width', '50%');
          //实时的缩放比列
          $('#iframeId')
            .contents()
            .find('body')
            .css(
              'transform',
              'scale(' +
                $('.articleContent .wordContent').width() /
                  $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
                ')'
            );
          $('#iframeId').contents().find('body').css('transform-origin', 'top left');
          $('#iframeId')
            .contents()
            .find('body')
            .css(
              'zoom',
              ($('.articleContent .wordContent').width() /
                $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
                100 +
                '% !important'
            );
          $('#iframeId').contents().find('body').css('overflow', 'hidden');
          layer.closeAll();
        } else {
          //从前一页字体是否放大或缩小
          if (fontSizeWidth != '') {
            $('.articleContent .wordContent').css('width', fontSizeWidth);
            $('.articleContent .wordContent').css('height', fontSizeHeight);
            //实时的缩放比列
            $('#iframeId')
              .contents()
              .find('body')
              .css(
                'transform',
                'scale(' +
                  $('.articleContent .wordContent').width() /
                    $('#iframeId').contents().find('.pagecss')[0].offsetWidth +
                  ')'
              );
            $('#iframeId').contents().find('body').css('transform-origin', 'top left');
            $('#iframeId')
              .contents()
              .find('body')
              .css(
                'zoom',
                ($('.articleContent .wordContent').width() /
                  $('#iframeId').contents().find('.pagecss')[0].offsetWidth) *
                  100 +
                  '% !important'
              );
            $('#iframeId').contents().find('body').css('overflow', 'hidden');
            layer.closeAll();
          } else {
            var screenWordContent = $('.articleContent .wordContent').width(); //屏幕大小自适应宽度
            var htmlWidth = $('#iframeId').contents().find('.pagecss')[0].offsetWidth; //html宽度

            $('#iframeId')
              .contents()
              .find('body')
              .css('transform', 'scale(' + screenWordContent / htmlWidth + ')');
            $('#iframeId').contents().find('body').css('transform-origin', 'top left');
            $('#iframeId')
              .contents()
              .find('body')
              .css('zoom', (screenWordContent / htmlWidth) * 100 + '% !important');
            $('#iframeId').contents().find('body').css('overflow', 'hidden');
            layer.closeAll();
          }
        }

        setTimeout(function () {
          var list = document
            .getElementById('iframeId')
            .contentWindow.document.getElementsByClassName('highlight');

          for (var i = 0; i < list.length; i++) {
            (function (i) {
              list[i].onmouseover = function (e) {
                //判断鼠标从哪移到id1上面
                //											var related=getRelated(e);
                //											//如果related是id1的子元素id2，即从子元素id2移动到id1，或是related为id1，即从id1移动到其子元素id2上面，则不进行任何操作，否则进行相应的操作
                //											if(this!=related && !contains(this,related)){
                //提示信息
                dao
                  .heightLightDetail({
                    data: JSON.stringify({
                      NAME: $(list[i]).html(),
                      TYPE: $(list[i]).attr('value'),
                      CODE: '1',
                    }),
                  })
                  .done(function (res) {
                    tipsPosition(res.data.MAINBOOK, $(list[i]));
                  });
                return false;
                //											}
              };

              list[i].onmouseleave = function (e) {
                //判断鼠标要从id1上面移动到哪去？
                //											var related=getRelated(e);
                //											//如果related是id1，即当id1从其子元素移动到id1上，或是related是id2，即从id1上移动到其子元素，不进行任何操作，否则进行相应的操作
                //											if(this !=related && !contains(this,related)){

                tipsLeave();
                return false;

                //											}
              };
            })(i);
          }
        }, 800);

        //禁止iframe右键
        document.getElementById('iframeId').contentWindow.document.oncontextmenu = function () {
          return true;
        };
      });
    },
  });
}

//关键字tips提示
var kkk = 0;
var div = document.getElementById('tipId');
function tipsPosition(params, element) {
  var leftDis = element.offset().left + element.width();

  if (kkk == 0) {
    div.innerText = params;

    if ($('#iframeId').contents().find('.pagecss')[0].offsetWidth - leftDis < 120) {
      //当右侧位置显示不够时
      var leftWidth = element.offset().left - 120;
      div.setAttribute(
        'style',
        'position: absolute;left:' +
          leftWidth +
          'px;top:' +
          element.offset().top +
          'px;z-index:100;background:#FEFDFB;cursor:default;color:#000;border:1px solid #000;width:120px;font-size:14px;'
      );
    } else {
      div.setAttribute(
        'style',
        'position: absolute;left:' +
          leftDis +
          'px;top:' +
          element.offset().top +
          'px;z-index:100;background:#FEFDFB;cursor:default;color:#000;border:1px solid #000;width:120px;'
      );
    }
    $('#iframeId')[0].contentWindow.document.body.appendChild(div);

    kkk++;
  } else {
    var list = document.getElementById('iframeId').contentWindow.document.getElementById('tipId');
    list.innerText = params;

    if ($('#iframeId').contents().find('.pagecss')[0].offsetWidth - leftDis < 120) {
      //当右侧位置显示不够时
      var leftSecondWidth = element.offset().left - 120;
      list.setAttribute(
        'style',
        'position: absolute;left:' +
          leftSecondWidth +
          'px;top:' +
          element.offset().top +
          'px;z-index:100;background:#FEFDFB;cursor:default;color:#000;border:1px solid #000;width:120px;font-size:14px;'
      );
    } else {
      list.setAttribute(
        'style',
        'position: absolute;left:' +
          leftDis +
          'px;top:' +
          element.offset().top +
          'px;z-index:100;background:#FEFDFB;cursor:default;color:#000;border:1px solid #000;width:120px;'
      );
    }
  }
}
//关键词提示消失
function tipsLeave() {
  var list = document.getElementById('iframeId').contentWindow.document.getElementById('tipId');
  list.setAttribute('style', 'display:none;');
}
//该页面没有文字
function noWords() {
  $('#noWord').animate({ top: '0' }, 500, function () {
    $(this).css({ display: 'none', top: '-100px' });
  });
  $('#searchWord').animate({ top: '0' }, 500, function () {
    $(this).css({ display: 'none', top: '-100px' });
  });
}

function contains(a, b) {
  return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
}
function getRelated(e) {
  var related;
  var type = e.type.toLowerCase(); //这里获取事件名字
  if (type == 'mouseenter') {
    related = e.relatedTarget || e.fromElement;
  } else if ((type = 'mouseleave')) {
    related = e.relatedTarget || e.toElement;
  }
  return related;
}
