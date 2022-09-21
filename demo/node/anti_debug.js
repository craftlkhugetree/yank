// function y(){var t=(function(){var B=!![];return function(W,i){var F=B?function(){if(i){var g=i['apply'](W,arguments);i=null;return g;}}:function(){};B=![];return F;};}());var l=t(this,function(){return l['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](l)['search']('(((.+)+)+)+$');});l();console['log']('aaaa');console['log']('ccc');};y();function Y(){console['log']('bbbbb');};Y();

// 格式化后匹配了换行符导致递归溢出
function y() {
  var t = (function () {
    var B = !![];
    return function (W, i) {
      var F = B
        ? function () {
            if (i) {
              var g = i['apply'](W, arguments);
              i = null;
              return g;
            }
          }
        : function () {};
      B = ![];
      return F;
    };
  })();
  var l = t(this, function () {
    return l['toString']()
      ['search']('(((.+)+)+)+$')
      ['toString']()
      ['constructor'](l)
      ['search']('(((.+)+)+)+$');
  });
  l();
  console['log']('aaaa');
  console['log']('ccc');
}
y();
function Y() {
  console['log']('bbbbb');
}
Y();