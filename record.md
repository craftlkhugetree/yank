# Project
liken 123456    http://160.255.0.64:10086/
208080338/123 208080337
读者教育 http://172.20.0.116:11080/lres2022/rest/swagger-ui.html
白马 http://app.dev.angke.com.cn/bsermipweb/rest/swagger-ui.html
座位预约 svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc
  http://seat.dev.angke.cn/mseat/#/index 手机端
svn://160.255.0.56/01module/lres/03code/lresweb/src/main/webapp/mobile_nh
# Git

git svn clone -r HEAD --username=liken svn://160.255.0.56/01module/seatreser/03code/seat_v2_pc

git show（查看上一次修改）
git svn rebase === git pull

git checkout master(切换分支)
git merge new_branch（将分支 new_branch 合并到 master 分支）
git svn dcommit（然后将所有已经合并到 master 分支的本地修改提交到 svn）

git update-index --assume-unchanged
git ls-files -v | grep '^h\ '

git config --list

git修改注释的方法：1、利用“git commit --amend -m”命令，可以在还没有push之前修改注释内容；2、利用“git push -f”命令，可以在push之后修改注释内容。

ssh-keygen -t rsa -C "345823102@qq.com" 
ssh -T git@github.com  // 测试


# npm

npm config list

# shell
如果dir2目录不存在，则可以直接使用
cp -r dir1 dir2
如果dir2目录已存在，则需要使用
cp -r dir1/. dir2
如果这时使用cp -r dir1 dir2,则也会将dir1目录复制到dir2中
# sed

在第一行前插入文本
sed -i '1 i\插入字符串' datafile
在最后一行后插入文本
sed -i '$ a\插入字符串' datafile
在匹配行前插入一行
sed -i '/pattern/ i "插入字符串"'' datafile
删除最后一行
sed -i '$ d' .git/config

# vscode

ctrl + shift + o 查找函数类名
ctrl + p 打开文件

# js
// 回到顶部
document.getElementsByTagName('html')[0].scrollTop = 0
1.document.body.scrollTop=document.documentElement.scrollTop=0 //页面滚动到顶部
2.document.body.scrollIntoView()
3.document.getElementById('site-nav').scrollIntoView()
下面是一个小的例子：
// 每次切换标题栏都从第一个开始展示
        document.querySelector('.infinite-scroll-component').scrollTo(0,0)
//选中当前想要回到dom元素，使用scrollTo(0,0),实现能够在切换中始终保持第一栏在顶部显示。

// 下载
      this.util.exportFile('learn/download', true, this.id, name, ext)  // false就是params对象。
let exportFile = function (url, isGet, params, fileName, fileType) {
    Axios({
      url: window.g.url + url,
      method: isGet ? "GET" : "POST",
      responseType: "blob",
      headers: {
        IDSTGC: getCookie("IDSTGC") || "4c94867cb4854ede8ce3121f4a2a037e",
      },
      data: params,
    }).then((res) => {
      let url = window.URL.createObjectURL(res.data);
      let link = document.createElement("a");
      link.href = url;
      link.style.display = "none";
      link.setAttribute("download", fileName + "." + fileType);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
}

# regex
^(?!.*(localhost|z.angke.com.cn)).*$
# vant
<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay

# Vue
// 对于editForm.content.totalScore，如何设置校验规则。
<el-col :span="12">
            <el-form-item label="总分" prop="totalScore"></el-form-item>
            <el-form-item prop="content.totalScore" style="margin-left: -100px" :rules="rules.totalScore">
              <el-input
                v-model="editForm.content.totalScore"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
  let validateZero = (rule, val, callback) => {
      if (val == "0") {
        return callback(new Error("总分不能为零!"));
      } else {
        return callback();
      }
    };
 totalScore: [
          { required: true, validator: validateZero, trigger: "change" },
        ],


computed的值不能给data赋值，computed时还没有this呢。因为data里的数据是在mouted中执行函数才获取到数据，是在computed之后，所以在第一次computed计算时，data中数据还是空的，所以computed找不到data里的数据。

watch数组list，可以 computed: {
        newList(){ 
           return JSON.parse(JSON.stringify(this.list)) // 深拷贝依赖
        }
    },
    watch: {
        newList(newVal, oldVal) {
            console.log(newVal， this.list)
            console.log(oldVal)
        },
    },

change事件中，editForm的属性已改变，若要拿到旧值，就得用watch:
watch: {
    'editForm.type': {
      handler(oldVal, newVal) {
        console.log(oldVal, newVal);
      }
    }
  },