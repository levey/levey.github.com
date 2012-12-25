---
layout: post
title: "Objective-C / Node.js 编写 iOS app 前后端教程 - Node.js Server"
description: ""
category: blog
tags: ["iOS", "Node.js"]
---
{% include JB/setup %}

####  说明

这是一篇很基础的教程，全篇通过制作一个叫 WhateverNote 的 app，来描述 iOS app 的前端和服务端交互的。

这份教程只是用于初学示例，可能有很多不严谨的地方（比如有些类型检查遗漏了），请多多包含 :)

代码托管在 [GitHub](https://github.com/levey/WhateverNote).

#### 语言 / 框架

iOS 端用到的语言就是 Objective-C, 为了方便我选择 [AFNetowrking](https://github.com/AFNetworking/AFNetworking) 作为 HTTP 库 。服务器端本来想用 Ruby on Rails  或者 Sinatra 的，但是后来想试一试 Node.js 的体验，所以就用 Node.js了，选择的 web framework 是 express.js, 跟 Sinatra 是类似的，都比较轻量级。

#### 工具

iOS:  `Xcode`

Node.js: `Sublime Text 2` / ` iTerm 2`

---

####  WhateverNote - Server

先从 [http://nodejs.org](http://nodejs.org) 下载安装 Node.js，我当前的最新稳定版本为 v0.8.15。

安装 Node.js 成功后，通过终端安装 express.js, -g 参数表示安装的包为全局的。

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
	  app.get('/', function(req, res) {
  	    res.send('hello world');
	  });
	};

最后在 **app.js** 中 把那些 express 的默认建立的 user 变量删除，然后用以下代码替换原来的路由代码。

	routes.route(app);
	// app.get('/', routes.index);

然后重新启动 Server (node app.js)，我们就可以看到主页只输出 hello world 字符串。

##### 创建Model

mongoose 这个库管理 MongoDB 听方便的，在 **/models/note.js** 里写下如下代码

	var mongoose = require('mongoose');
    var db = mongoose.createConnection('mongodb://localhost/notes')
    var NoteSchema = mongoose.Schema({
	  title: String,
	  content: String,
	  author: String
    });

    exports.Note = db.model('Note',NoteSchema);

然后我们在 **/controllers/note.js** 里用一句

	var Note = require('../models/note').Note;

来引入 Note 这个 model，之后在这个 controller 里就能新建 Note 对象了。



##### 创建路由

在 **routes.js** 里追加如下 API

	var note = require('./controllers/note')

	exports.route = function (app) {
	  app.get('/', function(req, res) {
  	    res.send('hello world');
	  });
	  app.get('/notes', note.index);
	  app.get('/notes/:id', note.show);
	  app.post('/notes', note.create);
	  app.put('/notes/:id',note.update);
	  app.delete('/notes/:id', note.destroy);
	};

第一个就是获取 note 列表。

第二个是得到一个 note 的详细信息（不过咱这个 demo 直接一个列表就有了详细信息）。

第三个是新建一个 note.

第四个是删除一个对应 id 的 note.


##### 最后一步，完善 Controller

在之前一步我们看到了 每个 API 都调用了 controller 里的相应方法, 打开 **./controllers/note** 输入如下代码

var Note = require('../models/note').Note;

	exports.index = function(req, res) {
	  Note.find(function(err, notes) {
		if (!err) {
			res.send(notes);
		} else {
			res.send(err);
		}
	  });
    }

	exports.show = function(req, res) {
	  Note.findById(req.params.id, function (err, note) {
        if (!err) {
          res.send({success: 1, note: note});
        } else {
    	  res.send({success: 0});
        }
      });
    }

    exports.create = function(req, res) {
	  var note = new Note();
	  note.title = req.body.title;
	  note.content = req.body.content;
	  note.author = req.body.author;
	  console.log(note);
	  note.save(function(err){
		if (!err) {
			res.send({success: 1});
		} else {
			res.send({success: 0});
		}
	  });
    }
    
    exports.update = function(req, res) {
	  var update = {
		title: req.param('title'), 
		content: req.param('content'), 
		author: req.param('author')
	  };
	  Note.findByIdAndUpdate(req.params.id, update, function(err) {
	    if (err) {
	      res.send(err);
	    } else {
	      res.send({success: 1});
	    }
	  });
    }

	exports.destroy = function(req, res) {
	  if (!req.params.id) {
		res.send({success: 0, error: "Need <id> parameter."});
	  } else {
		Note.findById(req.params.id, function (err, note) {
	      if (!err) {
	    	if (note) {
	    	  note.remove(function(err) {
	      		if (!err) {
	      			res.send({success: 1});
	      		} else {
	      			res.send({success: 0, error: "Failed to delete."});
	      		}
	      	  });
	    	} else {
	    		res.send({success: 0, error: "Can not find note."});
	    	}
	      } else {
	    	res.send({success: 0, error: "Failed to delete."});
	      }
	    });
	  }
	}


##### 测试

由于我们使用了 MongoDB 作为数据库，我们需要先安装，使用 Homebrew 安装很方便，终端执行

	brew update
	brew install mongodb
	

安装好后，在终端执行 **mongod** 就可以开启数据库服务了。

然后，我们先在终端执行 **node app.js** 开启应用服务器。

最后，可以写个脚本试一下创建一个 note, Ruby 代码如下


	require 'net/http'
	response = Net::HTTP.post_form(URI.parse('http://localhost:3000/notes'), 
                               {title: 'hello world',
                               	content: 'hello big world',
                               	author: 'levey'})
 
	puts response.body

如果输出 { "success": 1 } ， 说明创建成功。

##### 歇会儿 & 接下来

至此，WhateverNote 的 Server 端的这几个 API 完成了，接下来的第二篇将是 iOS 客户端与刚写好的 Server 端的交互的教程。


**Have a nice day.**



	
















