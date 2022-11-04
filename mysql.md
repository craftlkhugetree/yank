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
