# !/bin/sh
#不能有空格
read -p "车辆管理请填写IDSTGC:" msg
path='/d/kxiangmu/njauLogistics/fuwujiandu'
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

# code $path'/netRepair-mobile_njit'
# code $path'/netRepair_njit'
cd $path'/xnzz-jszx/'
# cd $path'/clglPC/'
# cd $path'/jszx-pc/'