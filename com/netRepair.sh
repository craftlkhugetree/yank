# !/bin/sh
#不能有空格
read - p  "订餐nannong请填写IDSTGC:" msg
filename1 = '/d/kxiangmu/njauLogistics/netRepair-mobile/src/assets/js/util.js'
filename2 = '/d/kxiangmu/njauLogistics/netRepair/src/assets/js/util.js'
#file1 = '/D/kxiangmu/appointment/appointmentFrontEnd_v2/src/components/BaseUpload.vue'
#file2 = '/D/kxiangmu/appointment/appointmentFrontEnd_v2_mobile/src/components/BaseUpload.vue'
#headers = "headers: { IDSTGC: getCookie('IDSTGC') || '$msg'}"
#head = "headers: { IDSTGC: this.getCookie('IDSTGC') || '$msg'}"

IDSTGC = "var IDSTGC"

arr = ($filename1 $filename2)

for filename in $ {arr[ * ]}
do
  sed - i "s/\($IDSTGC.*\)[\"'].*[\"']/\1\"$msg\"/g" $filename 
done

#sed正则内的括号必须转义