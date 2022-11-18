表tbl有a,b,c三个字段，其中a是主键，b上建了索引，然后编写sql语句SELECT * FROM tbl WHERE a=1这样不会产生回表，因为所有的数据在a的索引树中均能找到。
# SELECT * FROM tbl WHERE b=1这样就会产生回表，因为where条件是b字段，那么会去b的索引树里查找数据，但b的索引里面只有a,b两个字段的值，没有c，那么这个查询为了取到c字段，就要取出主键a的值，然后去a的索引树去找c字段的数据。查了两个索引树，这就叫回表。
索引覆盖就是查这个索引能查到你所需要的所有数据，不需要去另外的数据结构去查，其实就是不用回表。怎么避免？不是必须的字段就不要出现在SELECT里面。或者b,c建联合索引。但具体情况要具体分析，索引字段多了，存储和插入数据时的消耗会更大。这是个平衡问题


msyql 绿色版，必须是管理员 shell：
mysqld install
mysqld --initialize 先删除 data 目录
net start mysql
net stop mysql

mysql -uroot -p
但是此处的密码需要我们自己去 data 目录下的.err 文件中查找

5.x 版：
set password for root@localhost = password('root');
8.x 版：
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码' PASSWORD EXPIRE NEVER;
要用下面这个加密方式来改密码，否则 node 连不上：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '111111';
FLUSH PRIVILEGES;

show databases;

create database tour;
use tour
show tables;
source D:/kmoyu/VueNode/server/tour.sql

describe tour_user;
insert into tour_user values(23, 'admin', 'admin', )
