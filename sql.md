这个报错码是100，原因是没创建dbpath的文件夹，在dbpath的位置把文件夹创建出来就可以了
mongod --port=27017 --logpath=./log/mongodb.log --dbpath=./db --fork

mongod --config "d:\Program Files\MongoDB\Server\6.0\bin\mongodb.conf"
mongod --config "d:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg"

#1、进入mongo语法环境
mongo
但是6.0没有mongo.exe，自行下载mongosh.exe
下载链接：https://www.mongodb.com/try/download/shell
 
#2、创建admin数据库
use admin
 
#3、添加管理员用户（用户名admin 和 密码123456 是可以自定义的 【但是要记牢哦！！】）
db.createUser({
    user："admin",
    pwd："admin",
    roles：["root"]  // 角色root是超级管理员 
}) 

# 查看当前数据库中的用户
show users
或：db.getUsers()
 
# 登录认证
db.auth("moyu", "123456")
 
# 创建用户
db.createUser({
    user："admin",    // 用户名
    pwd："123456",    // 密码
    roles：["root"]   // 角色
}) 
 
# 修改用户密码
db.updateUser( "admin", {
    pwd: "abc666"
})
 
# 删除用户
db.dropUser("admin")  // admin 是要删除的用户名