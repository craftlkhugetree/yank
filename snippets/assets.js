// JS

function when(value) {
  // when 的参数先给 switch 的值
  // 返回一个函数来处理分支匹配 ②
  return function (...cases) {
    for (const [is, run] of cases) {
      console.log(is, run, cases);
      //                 ^^^^^^^^^ 从对象改为元组（数组）③
      if (value === is || (typeof is == 'function' && is(value))) {
        //                    ^^^^^^ 精确判断 ①
        //                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 断言函数判断
        return run(value);
        //                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 可指定行为（函数）
      }
    }
    throw new Error('非详尽');
  };
}

function calcGrade(score) {
  return when(score)(
    //         ^^^^^^^^^^^ 这里返回的是匹配处理的函数
    [v => v >= 0 && v < 80, v => `不合格 (${v})`],
    [v => v >= 80 && v < 100, v => `合格 (${v})`],
    [100, () => '满分 (100)'],
    //       ^^^ 可以指定匹配的值
    //            ^^ 计算不需要参数，可以不声明
    [_ => true, v => `无效 (${v})`]
    //       ^^^^^^^^^ 兜底的永真断言
  );
}

calcGrade(33);
