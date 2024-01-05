# !/bin/sh
#不能有空格
path='/d/kxiangmu/njauLogistics/fuwujiandu'

if [ ! -n "$1" ]; then
  # !-n 用于判断变量是否为空,注意只要有一个符号就不为空,空格也不行
  read -p "车辆管理请填写IDSTGC:" msg
  else 
  echo "执行的文件名：$0";
  echo "第一个参数为：$1";
  echo $path'/xnzz-jszx/';
  # do_cool_thing $path'/xnzz-jszx/'
  msg=$1
fi

filename1=$path'/clglPC/src/assets/js/util.js'
filename2=$path'/clglMOBILE/src/assets/js/util.js'
filename3=$path'/jszx-pc/src/assets/js/util.js'
filename4=$path'/xnzz-jszx/src/assets/js/util.js'
filename5=$path'/xnzzmobile-jszx/src/assets/js/util.js'

IDSTGC="var IDSTGC"

arr=($filename1 $filename2 $filename3 $filename4 $filename5)

for filename in ${arr[*]}
do
  sed -i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done
#sed正则内的括号必须转义

dir=$path'/xnzz-jszx/'
cd $dir
# if [ ! -n "$1" ]; then
# # code $path'/netRepair-mobile_njit'
# # code $path'/netRepair_njit'
# cd $dir
# # cd $path'/clglPC/'
# # cd $path'/jszx-pc/'
# fi