# !/bin/sh
#不能有空格
read -p  "请填写IDSTGC:" msg
filename1='/D/kxiangmu/baima/bmfrontend/src/assets/js/util.js'
filename2='/D/kxiangmu/baima/bmmobile/src/assets/js/util.js'
file1='/D/kxiangmu/baima/bmfrontend/src/components/BaseUpload.vue'
file2='/D/kxiangmu/baima/bmmobile/src/components/BaseUpload.vue'
headers="headers: { IDSTGC: getCookie('IDSTGC') || '$msg'}"
head="headers: { IDSTGC: this.getCookie('IDSTGC') || '$msg'}"
echo $headers 
echo $head 

arr=($filename1 $filename2)
a=($file1 $file2)

for filename in ${arr[*]}
do
  sed -i "{:begin;  /\}/! { $! { N; b begin }; }; s/headers:.*\}/$headers/; };" $filename
done

for filename in ${a[*]}
do
  sed -i "{:begin;  /\}/! { $! { N; b begin }; }; s/headers:.*\}/$head/; };" $filename
done

#sed  -i "{:begin;  /\}/! { $! { N; b begin }; }; s/^headers:[\d\D]*?{[\d\D]*?}$/${msg}/g; };" $filename

#sed  -i 's/^(headers:\s*{)[\s\S]*?}$/${msg}/g' $filename
