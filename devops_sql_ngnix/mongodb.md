gitbash alias里新增命令amongod启动服务；mongosh启动客户端。
mongod --config "d:\Program Files\MongoDB\Server\6.0\bin\mongodb.conf"

node连接数据库：
mongoose = {
    url: 'mongodb://127.0.0.1:27017/moyu',
    options: {
      user: 'moyu',
      pass: '123456',
      useUnifiedTopology: true,
    },
    plugins: [],
  };

{"t":{"$date":"2022-11-04T15:01:25.453+08:00"},"s":"I",  "c":"CONTROL",  "id":23138,   "ctx":"initandlisten","msg":"Shutting down","attr":{"exitCode":100}}这个报错码100，原因是没创建dbpath的文件夹，在dbpath的位置把文件夹创建出来就可以了
mongod --port=27017 --logpath=./log/mongodb.log --dbpath=./db --fork

mongod --config "d:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg"

mongod --version
mongod --shutdown --dbpath D:\Program Files\MongoDB\Server\6.0\data\db  仅linux可用选项--shutdown
db.shutdownServer()

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

db.createUser({user:"moyu",pwd:"123456",roles:["root"]}
ERROR:Could not find role: root@test   错误如下：除了admin，其他的roles不能用 root，根据需要选择所想要的role。
将其 role: 'root',置换为 role: 'readWrite', 同时增加数据库名。
 db.createUser({user:"moyu",pwd:"123456",roles:[{
    role: 'readWrite',  
    db: 'projects'     
  }]})

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

show users
show dbs; use 库名
show tables
db.表名.find()

taskkill /F /PID pid


如果你想操纵Mongoose查询的结果，通常最好在查询后调用lean() ，这样你就可以直接获得一个可以自由修改的普通JavaScript对象。 否则它是一个不容易操作的Mongoose模型实例：  
UserTabs.findOne({ 'username' :  userID }).lean().exec(function(err, data) {
    // data is a JavaScript object, modify it as needed.  Use the standard
    // JavaScript array manipulation functions to modify data.preferences.
    ...
}


问题：mongo文档末尾出现字段"__v：0"
解决方法：在model末尾加上 {versionKey: false}

mongoose.model默认会给collection默认添加s.
实际上是pluralize(name.toLowerCase())方法在起作用，该方法主要将model的name转换成collection的name。但是，对于model名称的转换分为两部分：不需要转换的模型名称和需要进行处理的模型名称。其中，不需要进行转换的名称为列表uncountables，需要转换的名称的转换规则如下：exports.pluralization = []，
如果不想使用model方法默认的model的name转换为collection的name，则只需要传递三个参数即可，其中最后一个参数是真正的collection的name.
