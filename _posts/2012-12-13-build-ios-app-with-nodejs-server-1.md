---
layout: post
title: "iOS / node.js 贯穿 iOS app 前后端教程(一)"
description: ""
category: 
tags: []
---
{% include JB/setup %}

####  说明

这是一篇很基础的教程，全篇通过制作一个叫 WhateverNote 的 app，来描述 iOS app 的前端和服务端交互的。

#### 语言 / 框架

iOS 端用到的语言就是 Objective-C, 为了方便我选择 AFNetowrking 作为 HTTP 库 。服务器端本来想用 Ruby on Rails  或者 Sinatra 的，但是后来想试一试 Node.js 的体验，所以就用 Node.js了，选择的 web framework 是 express.js, 跟 Sinatra 是类似的，都比较轻量级。

#### 工具

iOS:  `Xcode`

Node.js: `Sublime Text 2` / ` iTerm 2`

---

####  WhateverNote - Server

先从 [http://nodejs.org](http://nodejs.org) 下载安装 Node.js，我当前的最新稳定版本为 v0.8.15。

安装 Node.js 成功后，通过终端安装 experess.js, -g 参数表示安装的包为全局的。

	npm install -g express
	
安装 express.js 成功后， 在 WhateverNote 目录下新建一个 Whatever-server 的项目
	
	express Whatever-server
	
进入刚建立的项目的目录 执行 

	node app.js 
	
然后用浏览器打开 localhost:3000 就能看到 express 的欢迎页面了。

然后我们看一下 app.js 这个文件，

	var express = require('express')
 	 , routes = require('./routes')
 	 , user = require('./routes/user')
	 , http = require('http')
	 , path = require('path');

	var app = express();
	
这些是一些变量，express 是以文件目录的形式来定义类型的。


	app.configure(function(){
  	  app.set('port', process.env.PORT || 3000);
  	  app.set('views', __dirname + '/views');
  	  app.set('view engine', 'jade');
  	  app.use(express.favicon());
  	  app.use(express.logger('dev'));
  	  app.use(express.bodyParser());
  	  app.use(express.methodOverride());
  	  app.use(app.router);
  	  app.use(express.static(path.join(__dirname, 'public')));
	});

这些是对 express 的配置。

接下来

	app.get('/', routes.index);

这一行就是对刚才访问到的主页的处理。

最后

	http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
    
就是服务器的创建，因为 Node.js 运行环境本身可以作为 web server，所以不用 apache/nginx 等类似的 web server.

我们的程序结构用 MVC + Routes，类似 Ruby on Rails, 但是我们只是需要的是 iOS 端获得 JSON 数据，所以我们可以去掉 View 这一层（删掉 views 目录）。

然后新建 models 和 conterllers 目录，分别在刚建的目录里新建 note.js 文件。

我喜欢用单个文件来做 URL 路由， 所以删除了 routes 目录，新建 routes.js 代替。

在 **controllers/note.js** 写上如下代码

	exports.index = function (req, res) {
	  res.send('hello world');
	};

然后在 **routes.js** 写下如下代码

	var note = require('./controllers/note')

	exports.route = function (app) {
	  app.get('/notes', note.index);
	};

最后在 **app.js** 中 把那些 express 的默认建立的 user 变量删除，然后用以下代码替换原来的路由代码。

	routes.route(app);
	// app.get('/', routes.index);

然后重新启动 Server (node app.js)，我们就可以看到主页只输出 hello world 字符串。

**-- 未完待续**

	
















