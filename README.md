# express-ts

> 这个是一个后端模板  可以快速简单搭建自己的项目并且快速简单部署到服务器

访问旁边Git地址以查看最新文档[express-ts](https://github.com/xiwang007/express-ts)

- express
- typescript
- mysql
- pug
- pm2

这边只做了整合，以及最基础的一些项目设置和初始化.

- 可以直接使用***token***令牌进行无状态用户登录验证
- 简单配置并使用mysql数据库
- 使用typescript开发，更舒服和流畅
- 项目部署方便，只需要修改简单的配置即可快速部署更新到服务器
- 一些常用的方法和规范都在代码里面 或者注释里面 更利于快速开发

## 项目结构说明

- /dist 是/src 目录下.ts文件打包后目录 也就是项目运行js代码
  - 说明一下，为什么项目会上传dist文件，为了更好的鲁棒性，这边会只使用生成的js文件，ts文件只是开发时使用而已。所以部署的时候，不会操作生成，直接启动dist里面的项目代码。
- /key 目录是存放token加密解密的私钥和公钥
- /mysql 目录是存放MySQL表结构的文件夹，以及我个人整理的文档
- /views 目录是pug模板引擎的根目录，里面分为webpage和component
  - /views/webpage 是根据网址地址存放的模板
    - 使用这种方式就简单的把网址和模板目录对应，方便理解和开发
  - /views/component 是存放webpage 需要的一些组件模板 比如 head 
- /src 目录是存放项目所需要的脚本和资源
  - /src/app 路面里面存放是项目所有的ts文件
    - /src/app/router 目录是存放和webpage 所对应的路由（返回的是HTML）
    - /src/app/api 目录是存放所有api路由（返回的是json）
  - /src/types 目录是存放所有扩展的ts定义文件 项目里面有对res进行了userid的扩展，用于token验证用户id
- /public 是存放项目公开的资源文件



## 机器说明 

### 本机 

> 本机代表着我们平常开发使用的电脑

### 服务器

> 服务器代表线上运行的电脑我这边默认是centos7



use

```shell
# 复制代码到本机(Windows 用Git Bash/Mac 用自带的终端)
git clone git@github.com:xiwang007/express-ts.git

# package.json里面scripts对象里面有一些设置的自定义命令 使用方法 npm run xxx 例子:npm run go
# 如果没有安装pm2 则需要安装 npm install pm2 -g
# 如果没有全局安装 nodemon 则需要安装 npm install nodemon -g
npm run go

# 游览器输入 http://localhost:8080/ 即可访问
# http://localhost:8080/test.json 访问静态文件
```

可能的错误:

[Failed to load parser '@typescript-eslint/parser'](https://stackoverflow.com/questions/60134596/create-react-app-without-typescript-got-error-failed-to-load-parser-types)

```shell
#重新安装即可
npm install @typescript-eslint/parser typescript
```

## mysql

安装和一些简单的使用可以查看我整理的文档  [mysql.md](https://github.com/xiwang007/express-ts/blob/master/mysql/mysql.md)

使用MySQL需要修改的地方

1.

创建一个`test`的数据库

2.

> 文件路径 mysql\test.sql

把上面文件内容放到 

- 1.打开 Navicat Premium

- 2.打开创建好的`test`数据库

- 3.新建查询

- 4.文件内容粘贴进去

- 5.运行

3.

> 路径 src\app\common.ts

host对象的password修改成你设置的密码

4.

设置好上面之后运行项目之后访问下面地址即可

http://localhost:8080/api/mysql?id=2

## pm2自动部署到服务器

关于pm2 的更多使用方法请访问[官网](https://pm2.keymetrics.io/)

下面是示范的例子

1.全局安装pm2(本机和部署的服务器都需要安装pm2 而且最好版本一致)

> npm install pm2@4.2.3 -g
>
> 上面的命令是安装指定版本

```shell
npm install pm2 -g
```

2.设置ecosystem.config.js 文件注释的部分

- host为服务器主机,可以是虚拟机 自动部署时这是必须要修改的
- repo是你要clone的地址
- path是服务器主机的地址 /home/code/xxxxxx // xxxxxx项目的文件夹

3.注意

- 你这台电脑要能无密码ssh访问你设置的host服务器,可以用Git Bash/Mac 用自带的终端 ssh root@host 连接

- 服务器要能正常使用下面的命令 (如果是私有项目需要进行设置)

参考:[克隆私有项目](https://www.jianshu.com/p/0503722f69af)

```shell
git clone git@github.com:xiwang007/express-ts.git
```

4.本机用命令部署到服务器

> 说明这个命令是在本机下的项目根目录下执行的

```shell
pm2 deploy ecosystem.config.js production setup
```

5.在本机启动服务器的项目

> 说明这个命令是在本机下的项目根目录下执行的

```shell
pm2 deploy ecosystem.config.js production
```

6.正常访问 OK

7.项目更新代码后只需要执行第5步即可同步代码到服务器并重启应用

```shell
pm2 deploy ecosystem.config.js production
```



### 可能的问题

1.

```shell
Deploy failed
spawn sh ENOENT
```

因为使用的是`windows`的命令窗口。

把文件用`git bash`打开执行相关命令就不会出现这种错误。

2.

```shell
  commit or stash your changes before deploying

Deploy failed
Deploy failed with exit code: 1
```

因为你有代码没有推送到git上面去,所以要全部推送上去再使用

```
pm2 deploy ecosystem.config.js production
```

如果是因为示例修改host,可以用`git bash`或者`终端`登录服务器手动启动即可(正常私有项目只要推送了就不会有这个问题)

```shell
cd /home/code/express-ts/source/
npm install && pm2 reload ecosystem.config.js --env production
```

3.其他:版本不一致

```shell
# 升级
npm install pm2 -g
pm2 update
```



## SSH安全免密登录：ssh key

- ssh key使用非对称加密方式生成公钥和私钥
- 私钥存放在本地~/.ssh目录
- 公钥可以对外公开，放在服务器的~/.ssh/authorized_keys
- authorized_keys 没有的话可以创建
- A电脑生成密钥，把生成的公钥放到B服务器上，放在B服务器的~/.ssh/authorized_keys,这样就可以实现A免密ssh访问B

```shell
#生成秘钥
ssh-keygen
# 生成秘钥或者直接用git的生成方式，这样把公钥匙保存到SSH设置里面即可
# 同理B服务器需要git代码，则需要生成密钥，然后把公钥保存到git的SSH设置里面即可 需要注意的是，需要先使用一下 xxxx为自己的邮箱
ssh-keygen -t rsa -C "xxxx@qq.com"
```

