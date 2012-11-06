---
layout: post
title: "从 Linode 导出 PostgreSQL 数据到 Heroku"
description: ""
category: blog
tags: []
---
{% include JB/setup %}


这篇博客意在帮助有想从 Linode 迁移网站到 Heroku 的读者.

一星期前，我的网站 [coderxcoder](http://coderxcoder.com) 想从 Linode 迁移到 Heroku, 本来像尝试 使
用 ruby 的 taps 这个 gem 来迁移，但是无奈失败多次，最后使用此篇博客中的方法。

本篇使用到的手段有:

1. 使用 [pg_dump](http://www.postgresql.org/docs/7.3/static/app-pgdump.html) 备份 PostgreSQL 数据。
2. Nginx 公开备份好的文件。
3. 使用 [pgbackups](https://devcenter.heroku.com/articles/pgbackups) 这个 Heroku 的插件来导入并更新数据库。


##### 1.备份数据库

首先 SSH 连接到 Linode 服务器, 输入命令 

	PGPASSWORD=[您的PG密码] pg_dump -Fc --no-acl --no-owner -h 127.0.0.1 -U [您的PG用户名] 
	[需要导出的数据库名] > mydb.dump

导出的 mydb.dump 就是	之后需要用到的备份文件。

##### 2. Nginx 公开数据库备份文件

首先， 在 /var/www 里新建一个 dbbackup 的目录下

	sudo mkdir /var/www/dbbackup

然后， 在 /etc/nginx/sites-available 目录下 新建一个 dbbackup.conf 的文件

	sudo touch /etc/nginx/sites-available/dbbackup.conf
	
再然后， 在 dbbackup.conf 里输入以下配置

	server
	{
    	server_name [你的服务器的域名或者IP];
    	listen 7000;
    	access_log off;
    	root /var/www/dbbackup;

    	location  /  {
        	autoindex  on;
    	}
	}
	
再然后，链接到 sites-enabled 目录

	ln -s /etc/nginx/sites-available/dbbackup.conf /etc/nginx/sites-enabled/dbbackup.conf
	
再然后，重启 nginx 

	sudo /etc/init.d/ngnix restart
	
	
##### 3. 恢复数据库

 这个很简单，按照 Heroku 的教程就好了，在你的项目目录里
 
  	heroku pgbackups:restore [数据库名] [第二步公开的数据库备份文件地址]


	




	





