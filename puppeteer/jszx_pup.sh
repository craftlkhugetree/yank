# !/bin/sh
#不能有空格
node "/d/yank/puppeteer/jszx.js"
cacheFilePath='/d/yank/puppeteer/tmp';
msg=$(cat $cacheFilePath)

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

dir=$path'/xnzz-jszx/'
cd $dir
# if [ ! -n "$1" ]; then
# # code $path'/netRepair-mobile_njit'
# # code $path'/netRepair_njit'
# cd $dir
# # cd $path'/clglPC/'
# # cd $path'/jszx-pc/'
# fi