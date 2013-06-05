---
layout: post
title: "Delegate vs Blcok vs Notification vs KVO"
description: ""
category: blog
tags: ["delegate", "block", "notification", "kvo", "iOS"]
---



最近在工作中遇到对使用 Delegate 和 Notification 的争议，我写下了自己的观点。

#### Delegate

***

##### 优点：

1. 语法严格，所有方法必须被定义。

2. 编译期的检查，Warning 或者 Error。

3. 非常容易追踪，DEBUG 或者跳转到定义的时候很方便。

##### 缺点：

1. 写的代码比较多。

2. 需要检查 delegate 是否为空指针。

3. 一对多实现困难。

#### Block

***

##### 优点：

1. 匿名方法，不需要额外定义方法。

2. 异步处理时的语法直观。

##### 缺点：

1. 使用 ARC 时需要小心 retain cycle.

2. 传入 block 的对象需要做处理。


#### Notification

***

##### 优点：


1. 实现简单。

2. 更新多个对象。

##### 缺点：

1. 没有编译时检查。

2. 在不需要的时候需要注销通知。

3. 不可追踪（DEBUG）。

4. 通知的名字需要在 controller 和 observer 都被知道,如果稍有写错,后果不堪,不好维护。


#### KVO

***

##### 优点：

1. 在2个对象间同步信息很方便。

2. 能提供一个对象的新的值和旧的值。

3. 可以 observe 嵌套的对象。

##### 缺点：

1. 被监听的属性是需要用字符串来表示的，没有编译期间检查。

2. 属性的改动导致 observe 失效。

3. 在对象销毁的时候需要移除 observer。



#### 总结

我个人比较倾向于使用 Delegate 和 Block 来在各对象之前交互（在有多个方法的时候我会使用Delegate）在少数需要更新多个对象的使用 Notification  和 KVO.

