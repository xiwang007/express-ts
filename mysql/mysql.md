# Windows安装

[下载地址windows](https://dev.mysql.com/downloads/installer/)

[下载地址Zip](https://downloads.mysql.com/archives/community/)

[MySQL-mysql 8.0.11安装教程](https://www.cnblogs.com/laumians-notes/p/9069498.html)

my.ini文件

> 在安装根目录下添加 my.ini文件
>
> **说明：my.ini文件的编码格式要是ANSI**

```shell
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=D:\\Program Files\\mysql-8.0.25   # 切记此处一定要用双斜杠\\，单斜杠我这里会出错，不过看别人的教程，有的是单斜杠。自己尝试吧
# 设置mysql数据库的数据的存放目录
datadir=D:\\Program Files\\mysql-8.0.25\\Data   # 此处同上
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为utf8mb4 
#character-set-server=utf8mb4 
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8mb4 
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8mb4 
```

### 解决运行库的问题

(发生在服务器上面)

[MySQL安装过程中提示计算机丢失vcruntime140_1.dll问题（Windows）](https://blog.csdn.net/mr__sun__/article/details/104669448)

[The latest supported Visual C++ downloads](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0)

> Visual Studio 2015, 2017 and 2019安装这个运行库即可
>
> x64: vc_redist.x64.exe

## 安装步骤

```shell
#1. /bin 目录下执行下面命令 定位到安装目录下的 bin 文件夹 
mysqld --initialize --console
#2.
mysqld ‐‐install [name]
#3.启动服务 右键我的电脑-管理-服务和应用程序-服务-MySQL-右键MySQL,启动
#4.登陆
mysql -u root -p

#5.修改密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

#6.新建远程登陆用户
create user 'root'@'%' identified with mysql_native_password by 'password';
grant all privileges on *.* to 'root'@'%' with grant option;
# 刷新权限
flush privileges;
```

# Linux安装

## MySQL安装步骤

参考链接：

[CentOS7安装MySQL8.0图文教程](https://www.cnblogs.com/yanglang/articles/10782941.html)

[MySQL 编码](https://blog.csdn.net/kikajack/article/details/84668924)

**说明：my.ini文件的编码格式要是ANSI**

安装前，我们可以检测系统是否自带安装 MySQL:

```shell
rpm -qa | grep mysql
```

如果你系统有安装，那可以选择进行卸载:

```shell
rpm -e mysql　　// 普通删除模式
rpm -e --nodeps mysql　　// 强力删除模式，如果使用上面命令删除时，提示有依赖的其它文件，则用该命令可以对其进行强力删除
```

**安装 MySQL：**

接下来我们在 Centos7 系统下使用 yum 命令安装 MySQL，需要注意的是 CentOS 7 版本中 MySQL数据库已从默认的程序列表中移除，所以在安装前我们需要先去官网下载 Yum 资源包，下载地址为：<https://dev.mysql.com/downloads/repo/yum/>

```shell
wget https://repo.mysql.com//mysql80-community-release-el7-3.noarch.rpm
rpm -ivh mysql80-community-release-el7-3.noarch.rpm

yum update
yum install mysql-server
```



### 在防火墙中开启3306端口

[centos7安装Mysql8.0步骤](https://www.jianshu.com/p/a355bbf11d07)

CentOS7默认使用的是firewall作为防火墙，我这里改为习惯常用的iptables防火墙

第一步：开启firewall3306端口防火墙

```shell
firewall-cmd --zone=public --list-ports 查看所有打开的端口
firewall-cmd --zone=public --add-port=80/tcp --permanent    开启一个端口，添加--permanent永久生效，没有此参数重启后失效
firewall-cmd --permanent --add-port=80/tcp  开放端口80
firewall-cmd --permanent --add-port=3306/tcp  开放端口3306数据库查询接口
firewall-cmd --permanent --remove-port=80/tcp   移除端口80
firewall-cmd --reload   重启防火墙，修改后重启防火墙生效

启动：service firewalld start
检查状态：service firewalld status
关闭或禁用防火墙：service firewalld stop/disable
```

常用mysql服务命令：

```shell
mysql -u username -p #登录mysql
quit #退出mysql 
systemctl start mysqld.service  #启动mysql
systemctl stop mysqld.service #结束
systemctl restart mysqld.service #重启
systemctl enable mysqld.service #开机自启
select version(); #查看mysql版本
systemctl status mysqld #查看 MySQL 运行状态
mysqladmin --version #查看版本
```

### 运行不了解决方法

> 是/var/lib/mysql /这个目标路径已经存在/var/lib/mysql /，导致无法初始化。
> 解决办法：删除/var/lib/mysql /后重启MySQL服务就可以了！



### 设置配置文件

cd /etc

vim my.cnf

```shell
[mysqld]
# 设置3306端口
port=3306
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```

my.cnf

```shell
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
port=3306
max_connections=200
max_connect_errors=10
character-set-server=utf8mb4
default-storage-engine=INNODB
default_authentication_plugin=mysql_native_password
[mysql]
default-character-set=utf8mb4
[client]
port=3306
default-character-set=utf8mb4
```



### 初始化MySQL

```shell
mysqld --initialize
```

### 权限设置

```shell
chown mysql:mysql -R /var/lib/mysql
```

### 启动MySQL

```shell
systemctl start mysqld
```

### 将mysql 服务加入开机启动项

```shell
systemctl enable mysqld.service
```

### MySQL获取密码

```shell
cat /var/log/mysqld.log | grep password

# DpLotfa=6iXh
```

### MySQL登录

```shell
mysql -u root -p  #会提示输入密码
```

### 修改密码

> 这些命令和平台无关

```shell
# 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

### 通过以下命令，进行远程访问的授权

```shell
# 新建远程登陆用户
create user 'root'@'%' identified with mysql_native_password by 'password';
grant all privileges on *.* to 'root'@'%' with grant option;
# 刷新权限
flush privileges;
#  到这里就可以了开启端口外部进行访问了
```

### 授权基本的查询修改权限，按需求设置

```shell
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON *.* TO 'root'@'%';
```

### 查看用户权限

```shell
show grants for 'root'@'%';
```

### 全局变量

```shell
#/etc/profile 找到这个文件 编辑（这里进行全局配置
#export PATH=$PATH:/usr/bin
#将环境变量生效 上面不用写
source /etc/profile

source ~/.bash_profile
```



# MAC安装

### Mac-mysql

```shell
We've installed your MySQL database without a root password. To secure it run:
    mysql_secure_installation

MySQL is configured to only allow connections from localhost by default

To connect run:
    mysql -uroot

To have launchd start mysql now and restart at login:
  brew services start mysql
Or, if you don't want/need a background service you can just run:
  mysql.server start
```

[参考教程](https://www.jianshu.com/p/4fc53d7d7620)



# MySQL使用

### MySQL操作

```mysql
mysql> show databases;  ‐‐ 显示全部数据库 
mysql> create database <db‐name>;  ‐‐ 创建一个指定名称的数据库 
mysql> use <db‐name>;  ‐‐ 使用一个数据库，相当于进入指定的数据库 
mysql> show tables;  ‐‐ 显示当前数据库中有哪些表 
mysql> create table <table‐name> (id int, name varchar(20), age int);  ‐‐ 创建一个指定名称的数据 表，并添加 3 个列 
mysql> desc <table‐name>;  ‐‐ 查看指定表结构 
mysql> source ./path/to/sql‐file.sql  ‐‐ 执行本地 SQL 文件中的 SQL 语句 mysql> drop table <table‐name>;  ‐‐ 删除一个指定名称的数据表 
mysql> drop database <db‐name>;  ‐‐ 删除一个指定名称的数据库 
mysql> exit|quit;  ‐‐ 退出数据库终端
```

 [保留关键字](https://blog.csdn.net/z714359830/article/details/52205586)

### 数据库的数据类型

> 也就是数据库中可以存储的数据类型(又叫做字段类型)

字段类型初步介绍

- 整型 int

  存储如年龄，产品数量，编号等。

- 小数类型  float  ,  decimal 

  重量，工资，奖金，价格等

  ```
  使用decimal类型，实现小数的精确存储,一般用来存储与钱有关的数字。3.333333331
  ```

- 字符串型  varchar(M)，char(M) 

  M为该字段可以存储的最多字符数(字节)

  ```
  如varchar(10)最大可以存储10个字节
  
  varchar一般用来存储长度变化比较大的字符串，如文章标题，商品名称，	
  
  char存储长度比较固定的字符串，如手机号，身份证号，序列号，邮编。	
  
  此外可以使用text类型，存储较长的字符串，无需指定字符串的具体长度。
  ```

- 日期时间型 datetime,  date(年月日)，time（时分秒）

  年月日时分秒。

**字段约束**

字段约束: 字段数据的属性规则（特征）

1. not null 不为空

   可以限制字段值不能为空

2. default  默认值, 

   可以设置字段的默认值，在没有录入时自动使用默认值填充。

3. primary key  主键 ：唯一标识，不能重复，不能为空 

   设置字段为主键，主键字段的值不能重复，不能为空。而且一个数据表中只能设置一个字段为主键，作为每行记录的唯一身份信息（索引）。

4. auto_increment  自动增长

   设置字段为自动增长，默认从1开始自动分配编号。自增长字段必须为一个key（索引，数据结构，便于快速查找数据，相当于书的目录），一般与primary key结合使用。

   类型必须为整型。

5. unique key  不能重复

   唯一键，设置字段的值为唯一的，可以设置多个字段为唯一键。唯一键字段的值可以为空。

   学号设置为主键，要求唯一的，不能为空的，用来标识学生信息，

   

### 创建数据表

> 注意 创建表时，每个表必须有一个主键

#SQL-操作数据库的语言

> SQL：structured Query Language 结构化查询语言。

- 通过这个语言可以对数据库,进行增删改查

SQL编写注意点:  注释用 -- , 语句结束加分号(;)

#### 增删改查

##### 查询数据select

```sql
-- select 字段列表 from 表名
select name, author from book -- 只查询表中name和author的信息 
-- select * from 表名 where 条件  *表示所有字段
select * from book where author='金庸' and price>20
```

##### 删除数据delete

```sql
-- delete from 表名 where 条件
delete from book -- 会删除所有数据
delete from book where id=10
```

##### 修改数据update

```sql
-- update 表名 set 字段名称1=值1,字段名称2=值2,... where 条件
-- 如果不加条件会修改表中所有对应的字段
update book set name='笑傲江湖',price='30' where id=10
```

##### 插入数据 insert

```sql
-- insert into 表名 (字段列表) values (值列表)
insert into book (name,author,category,price) values ('天龙八部','金庸','文学',20)
 
-- 插入全部字段 
insert into users values (null, '王五', 0, '2020‐12‐12', '12312'); 

-- 指定字段 
insert into users (name, gender, avatar) values ('王五', 0, '12312');


```

查询刚插入的自增主键ID

[SELECT LAST_INSERT_ID() 的使用和注意事项](https://blog.csdn.net/czd3355/article/details/71302441)

[mysql LAST_INSERT_ID详解](http://blog.sina.com.cn/s/blog_5b5460eb0100nwvo.html)

[Mysql 中获取刚插入的自增长id的值](https://blog.csdn.net/likika2012/article/details/9959699)

```
SELECT LAST_INSERT_ID();
```



#### SQL高级

##### where 条件

   查询时，不添加 where 条件,  返回数据表所有行。需要添加限定条件，只返回需要的行。

   select  字段列表 from  table where 条件；

```sql
-- 条件 : =, >, <, >=, <=, and, or  
```

##### Like 

 模糊匹配  % 通配符

```sql
-- 查找姓张的人
select * from 表名 where name like '张%';
```

##### in 语法

：一次查询多个符合条件的数据

```sql
select * from 表名 where  字段 in  (value1,value2,value3);
示例:
select * from stu1 where name in ('zs', 'ls', 'ww'); -- 查找name值为zs, ls, ww 的数据
```

##### count()  

获取返回数据的总条数

```sql
表名-- 查询满足条件数据的总条数	
select count(*) from 表名 where 条件

//下面这个比较好，参考
select count(1) as count from 表名 where 条件
```

##### 排序

```sql
select * from 表名 order by  字段名称;   	  asc	默认升序
select * from 表名 order by  age;  -- 按照年龄来排序
select * from 表名 order by 字段名称 desc;      降序
```

##### limit 

对结果集进行截取 一般用于取数据的前几条

```sql
select *  from  表名  limit 截取的起始索引，截取的长度; 
select *  from  表名  limit （页数-1）*每页多少条，每页多少条数据; 
```

##### 联合查询

（多个表联合查询）

```sql
  select 字段列表  from  表A  join 表B  on  表A.字段=表B.字段 

  join 将表A和表B联合起来
  on  根据什么字段把表A和表B联合起来

  select *  from  teacher  join class  on class.id=teacher.classid;  -- 老师表和班级表联合查询
  select teacher.*, class.classname  from  teacher  join class  on class.id=teacher.classid;   -- 老师表和班级表联合查询,但只显示老师表的全部内容和班级表的名称

  
-- 注意: 多表联合查询时,字段要写明是那个表的字段 如  表.字段名
```

```mysql
SELECT
n.article_id,
a.title,
count(1) as num

FROM
article_nice n
JOIN article a
on n.article_id=a.id
WHERE n.nice=1
AND a.open=1


GROUP BY
n.article_id
order by num desc
LIMIT 10
```



### mysql字段唯一约束

```
mysql字段唯一约束
1、建表时加上唯一性约束
CREATE TABLE `t_user` (
`Id` int(11) NOT NULL AUTO_INCREMENT,  -- 自增
`username` varchar(18) NOT NULL unique,  -- 唯一性约束
`password` varchar(18) NOT NULL,
PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=gbk;
2、给已经建好的表加上唯一性约束
ALTER TABLE `t_user` ADD unique(`username`);



UNIQUE INDEX `name`(`name`) USING BTREE
```