# Project
liken 123456    http://160.255.0.64:10086/
208080338/123 208080337
读者教育 http://172.20.0.116:11080/lres2022/rest/swagger-ui.html
白马 http://app.dev.angke.com.cn/bsermipweb/rest/swagger-ui.html

# Git

git svn clone -r HEAD --username=liken svn://160.255.0.56/01module/lres/03code/lresweb2022/mobile

git show（查看上一次修改）
git svn rebase === git pull

git checkout master(切换分支)
git merge new_branch（将分支 new_branch 合并到 master 分支）
git svn dcommit（然后将所有已经合并到 master 分支的本地修改提交到 svn）

git update-index --assume-unchanged
git ls-files -v | grep '^h\ '

git config --list

ssh-keygen -t rsa -C "345823102@qq.com" 
ssh -T git@github.com  // 测试


# npm

npm config list

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

# css

<style lang="scss" scoped>
margin-left: calc(50% - 68px);

$height: 70px;
.main {
  height: calc(100vh - #{$height});
}

// img 水平居中
img {
clear: both;
display: block;
margin: auto;
}
// 透明底部 tab
.tabbar-bottom {
height: 120px;
bottom: 100px;
background: rgba(255, 255, 255, 0.9);
box-shadow: 0px -3px 6px 0px rgba(0, 0, 0, 0.05);
position: fixed;
left: 0;
z-index: 1;
box-sizing: content-box;
width: 100%;
}

// 图片配文字
.step {
  overflow-x: auto;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(3, 27, 78, 0.12);
  border-radius: 5px;
}
.step-box {
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  &.last {
    flex: 1;
    margin-right: 0;
  }
  &.active {
    .step-item {
      border-bottom: 4px solid #3a78fc;
      border-radius: 2px;
    }
  }
  .line {
    width: 60px;
    height: 20px;
  }
}
.step-item {
  padding: 20px;
  display: inline-block;
  position: relative;
  &.last {
    padding-left: 0;
    padding-right: 10px;
  }
  img {
    width: 60px;
    height: 60px;
    clear: both;
    display: block;
    margin: auto;
  }
  .tag {
    width: 14px;
    height: 29px;
    position: absolute;
    top: 0;
    left: 0;
  }
  p {
    margin-top: 10px;
    color: #373b4b;
    line-height: 28px;
    text-align: center;
    white-space: nowrap;  // 关键，否则文字换行
  }
</style>

// 回到顶部
document.getElementsByTagName('html')[0].scrollTop = 0

# regex
^(?!._localhost)._$
^(?!._?localhost)._$

# vant
<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay

