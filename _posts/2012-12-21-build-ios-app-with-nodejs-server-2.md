---
layout: post
title: "Objective-C / Node.js 编写 iOS app 前后端教程-  iOS Client"
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


####  WhateverNote - iOS


###### 准备工作

首先，使用 Xcode 新建一个名为 WhateverNote 的空项目。

预先在项目目录里预先新建 **Controllers**,**Models**, **3rd-party** 等目录。

然后从网上下载 **AFNetworking**, **JSONKit** 这2个第三方库到 3rd-party 目录下，然后引用进项目。

##### 实现 Model

由于 WhateverNote 比较简单，就一个 model，而且属性也只有三个，所以 我们只要在 Model 目录下新建 **Note.h** 和 **Note.m**.代码如下：

**Note.h**



@interface Note : NSObject

@property (nonatomic, strong) NSString *noteID;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *content;
@property (nonatomic, strong) NSString *author;

- (id)initWithAttributes:(NSDictionary *)attributes;

@end



**Note.m**


#import "Note.h"

@implementation Note

- (id)initWithAttributes:(NSDictionary *)attributes
{
	self = [super init];
	if (self) {
    	_noteID = [attributes valueForKeyPath:@"_id"];
    	_title = [attributes valueForKeyPath:@"title"];
    	_content = [attributes valueForKeyPath:@"content"];
    	_author = [attributes valueForKeyPath:@"author"];
	}

	return self;
}

@end

	
接下来在 Note List 页面，我们会把从 server 端获取的 json 数据 解析成一个都是 Note 对象的列表。



##### 实现 Controller

在 Controller 目录下新建 **NoteListViewController** 和 **NoteViewController**.

NoteListViewController 继承自 UITableViewController, 功能是显示已存在 server 的 note 列表，能对列表的 cell 做删除，从而删除 server 上一个对应的 note.
NoteViewConrller 功能是新增、查看、更新单个 Note 的信息 (通过回调给 NoteListViewController 执行)。

由于 API 是 RESTful 风格，我就直接使用了 AFNetworking 的 HTTPClient 类。

以下是网络请求的代码:

**NoteListViewController.m**


-(void)refreshList
{    
	[self.httpClient getPath:@"notes" parameters:nil
	 success:^(AFHTTPRequestOperation *operation, id responseObject) {
    		NSArray *responseArray = [responseObject objectFromJSONData];
    		NSLog(@"%@", responseArray);
    
    		NSMutableArray *mArr = [NSMutableArray array];
    		for (NSDictionary *attributes in responseArray) {
        		Note *note = [[Note alloc] initWithAttributes:attributes];
        		[mArr addObject:note];
    		}
    		self.dataArray = mArr;
    		[self.tableView reloadData];

		} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    			NSLog(@"Failed to get note list, ERROR >> %@", error);
	}];
}

- (void)deleteNote:(Note *)aNote
{
	NSLog(@"Delete a note with ID >> %@", aNote.noteID);
	[self.httpClient deletePath:[NSString stringWithFormat:@"notes/%@",aNote.noteID] 
	parameters:nil 
	success:^(AFHTTPRequestOperation *operation, id responseObject) {
    		NSLog(@"%@", [responseObject objectFromJSONData]);
    		NSDictionary *dict = [responseObject objectFromJSONData];
    		if ([dict[@"success"] integerValue] == 1) {
        		[self.dataArray removeObjectAtIndex:self.indexPathToBeDeleted.row];
        		[self.tableView deleteRowsAtIndexPaths:@[self.indexPathToBeDeleted]
        	withRowAnimation:UITableViewRowAnimationFade];
    		}
		} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    			NSLog(@"Failed to delete a note, ERROR >> %@", error);
	}];
}



- (void)updateNote:(Note *)aNote
{
	NSDictionary *parameters = @{@"title": aNote.title,
	 @"content": aNote.content, 
	 @"author": aNote.author};
	[self.httpClient putPath:[NSString stringWithFormat:@"notes/%@",aNote.noteID]
	parameters:parameters 
	success:^(AFHTTPRequestOperation *operation, id responseObject) {
    		NSLog(@"%@", [responseObject objectFromJSONData]);
    		NSDictionary *dict = [responseObject objectFromJSONData];
    		if ([dict[@"success"] integerValue] == 1) {
        		[self.navigationController popViewControllerAnimated:YES];
        		[self refreshList];
    		}

		} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    			NSLog(@"Failed to update a note, ERROR >> %@", error);

	}];
}

- (void)createNote:(Note *)aNote
{
	NSDictionary *parameters = @{@"title": aNote.title,
	 @"content": aNote.content, 
	 @"author": aNote.author};

	[self.httpClient postPath:@"notes" parameters:parameters 
	success:^(AFHTTPRequestOperation *operation, id responseObject) {
    		NSLog(@"%@", [responseObject objectFromJSONData]);
    		NSDictionary *dict = [responseObject objectFromJSONData];
    		if ([dict[@"success"] integerValue] == 1) {
        		[self.navigationController popViewControllerAnimated:YES];
        		[self refreshList];
    		}
		} failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    			NSLog(@"Failed to create a note, ERROR >> %@", error);
	}];
}

	

iOS 端的具体逻辑也大致是这样了，整个教程就分 server 端 和 iOS 端 2个简洁的教程，具体看托管在 [GitHub](https://github.com/levey/WhateverNote) 上的代码。

实际项目往往复杂很多，引用居里夫人的话：

>Life is not easy for any of us.

咖啡馆坐累了， 回家睡觉。


