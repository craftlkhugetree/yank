示例：combine_files目录
在Node中引入模块，需要经历如下3个步骤。
(1) 路径分析
(2) 文件定位
(3) 编译执行

在Node中，模块分为两类：一类是Node提供的模块，称为核心模块；另一类是用户编写的模块，称为文件模块。
以.、..和/开始的标识符，这里都被当做文件模块来处理。
自定义模块指的是非核心模块，也不是路径形式的标识符。它是一种特殊的文件模块，可能是一个文件或者包的形式。这类模块的查找是最费时的，也是所有方式中最慢的一种。
# module.paths沿路径向上逐级递归找node_modules目录，直到根目录下的node_modules目录。当前文件的路径越深，模块查找耗时会越多，这是自定义模块的加载速度是最慢的原因。

核心模块的优先级仅次于缓存加载，它在Node的源代码编译过程中已经编译为二进制代码，其加载过程最快。

不论是核心模块还是文件模块，require()方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。


 文件扩展名分析
require ()在分析标识符的过程中，会出现标识符中不包含文件扩展名的情况。CommonJS模块规范也允许在标识符中不包含文件扩展名，这种情况下，Node会按.js、.json、.node的次序补足扩展名，依次尝试。
在尝试的过程中，需要调用fs模块同步阻塞式地判断文件是否存在。因为Node是单线程的，所以这里是一个会引起性能问题的地方。小诀窍是：如果是.node和.json文件，在传递给require()的标识符中带上扩展名，会加快一点速度。另一个诀窍是：同步配合缓存，可以大幅度缓解Node单线程中阻塞式调用的缺陷。

事实上，在编译的过程中，Node对获取的JavaScript文件内容进行了头尾包装。在头部添加了
(function (exports, require, module, __filename, __dirname) {\n，在尾部添加了\n});。
一个正常的JavaScript文件会被包装成如下的样子：
(function (exports, require, module, __filename, __dirname) {
  var math = require('math');
  exports.area = function (radius) {
    return Math.PI * radius * radius;
  };
});
这样每个模块文件之间都进行了作用域隔离。

那些由纯C/C++编写的部分统一称为内建模块，因为它们通常不被用户直接调用。Node的buffer、crypto、evals、fs、os等模块都是部分通过C/C++编写的。
内建模块的优势在于：首先，它们本身由C/C++编写，性能上优于脚本语言；其次，在进行文件编译时，它们被编译进二进制文件。一旦Node开始执行，它们被直接加载进内存中，无须再次做标识符定位、文件定位、编译等过程，直接就可执行。

单线程同步编程模型会因阻塞I/O导致硬件资源得不到更优的使用。多线程编程模型也因为编程中的死锁、状态同步等问题让开发人员头疼。
Node在两者之间给出了它的方案：利用单线程，远离多线程死锁、状态同步等问题；利用异步I/O，让单线程远离阻塞，以更好地使用CPU。

异步I/O的提出是期望I/O的调用不再阻塞后续运算，将原有等待I/O完成的这段时间分配给其余需要的业务去执行。

请求对象是异步I/O过程中的重要中间产物，所有的状态都保存在这个对象中，包括送入线程池等待执行以及I/O操作完毕后的回调处理。

事件循环、观察者、请求对象、I/O线程池这四者共同构成了Node异步I/O模型的基本要素。Windows下主要通过IOCP来向系统内核发送I/O调用和从内核获取已完成的I/O操作，配以事件循环，以此完成异步I/O的过程。在Linux下通过epoll实现这个过程，FreeBSD下通过kqueue实现，Solaris下通过Event ports实现。不同的是线程池在Windows下由内核（IOCP）直接提供，*nix系列下由libuv自行实现。

异步I/O的几个关键词：单线程、事件循环、观察者和I/O线程池。
# 这里单线程与I/O线程池之间看起来有些悖论的样子。由于我们知道JavaScript是单线程的，所以按常识很容易理解为它不能充分利用多核CPU。事实上，在Node中，除了JavaScript是单线程外，Node自身其实是多线程的，只是I/O线程使用的CPU较少。另一个需要重视的观点则是，除了用户代码无法并行执行外，所有的I/O（磁盘I/O和网络I/O等）则是可以并行起来的。

process.nextTick()中的回调函数执行的优先级要高于setImmediate()。这里的原因在于事件循环对观察者的检查是有先后顺序的，process.nextTick()属于idle观察者，setImmediate ()属于check观察者。在每一个轮循环检查中，idle观察者先于I/O观察者，I/O观察者先于check观察者。

在具体实现上，process.nextTick()的回调函数保存在一个数组中，setImmediate()的结果则是保存在链表中。在行为上，process.nextTick()在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数。

# 难点1-异常处理
调用async()方法后，callback被存放起来，直到下一个事件循环（Tick）才会取出来执行。尝试对异步方法进行try/catch操作只能捕获当次事件循环内的异常，对callback执行时抛出的异常将无能为力，示例代码如下：
try {
   async(callback);
} catch (e) {
    // TODO
}
Node在处理异常上形成了一种约定，将异常作为回调函数的第一个实参传回，如果为空值，则表明异步调用没有异常抛出：
async(function (err, results) {
    // TODO
});
在我们自行编写的异步方法上，也需要去遵循这样一些原则：
原则一：必须执行调用者传入的回调函数；
原则二：正确传递回异常供调用者判断。
示例代码如下：
var async = function (callback) {
    process.nextTick(function() {
    var results = something;
    if (error) {
        return callback(error);
    }
    callback(null, results);
  });
};

在异步方法的编写中，另一个容易犯的错误是对用户传递的回调函数进行异常捕获，示例代码如下：
try {
    req.body = JSON.parse(buf, options.reviver);
    callback();
} catch (err){
    err.body = buf;
    err.status = 400;
    callback(err);
}
上述代码的意图是捕获JSON.parse()中可能出现的异常，但是却不小心包含了用户传递的回调函数。这意味着如果回调函数中有异常抛出，将会进入catch()代码块中执行，于是回调函数将会被执行两次。这显然不是预期的情况，可能导致业务混乱。正确的捕获应当为：
try {
    req.body = JSON.parse(buf, options.reviver);
} catch (err){
    err.body = buf;
    err.status = 400;
    return callback(err);
}
callback();


在计算机中，缓存由于存放在内存中，访问速度十分快，常常用于加速数据访问，让绝大多数的请求不必重复去做一些低效的数据读取。所谓雪崩问题，就是在高访问量、大并发量的情况下缓存失效的情景，此时大量的请求同时涌入【数据库】中，数据库无法同时承受如此大的查询请求，进而往前影响到网站整体的响应速度。
以下是一条数据库查询语句的调用：
var select = function (callback) {
    db.select("SQL", function (results) {
        callback(results);
    });
};
如果站点刚好启动，这时缓存中是不存在数据的，而如果访问量巨大，同一句SQL会被发送到数据库中反复查询，会影响服务的整体性能。一种改进方案是添加一个状态锁，相关代码如下：
var status = "ready";
var select = function (callback) {
if (status === "ready") {
    status = "pending";
    db.select("SQL", function (results) {
        status = "ready";
        callback(results);
    });
  }
}
但是在这种情景下，连续地多次调用select()时，只有第一次调用是生效的，后续的其他select()是没有数据服务的，这个时候可以引入事件队列，相关代码如下：
var proxy = new events.EventEmitter();
var status = "ready";
var select = function (callback) {
    proxy.once("selected", callback);
    if (status === "ready") {
        status = "pending";
        db.select("SQL", function (results) {
            proxy.emit("selected", results);
            status = "ready";
        });
    }
};
这里我们利用了once()方法，将所有请求的回调都压入事件队列中，利用其执行一次就会将监视器移除的特点，保证每一个回调只会被执行一次。对于相同的SQL语句，保证在同一个查询开始到结束的过程中永远只有一次。SQL在进行查询时，新到来的相同调用只需在队列中等待数据就绪即可，一旦查询结束，得到的结果可以被这些调用共同使用，同名（'selected'）的事件一起结束，它们的回调都被执行了，结果都是第一个返回的数据。
这种方式能节省重复的数据库调用产生的开销。由于Node单线程执行的原因，此处无须担心状态同步问题。这种方式其实也可以应用到其他远程调用的场景中，即使外部没有缓存策略，也能有效节省重复开销。此处可能因为存在侦听器过多引发的警告，需要调用setMaxListeners(0)移除掉警告，或者设更大的警告阈值。

# 难点2-函数嵌套过深
由于多个异步场景中回调函数的执行并不能保证顺序，且回调函数之间互相没有任何交集，所以需要借助一个第三方函数和第三方变量来处理异步协作的结果。通常，我们把这个用于检测次数的变量叫做【哨兵变量】。同时利用偏函数来处理哨兵变量和第三方函数的关系，相关代码如下：
var after = function (times, callback) {
    var count = 0, results = {};
    return function (key, value) {
        results[key] = value;
        count++;
        if (count === times) {
            callback(results);
        }
    };
};
var done = after(times, render);
上述方案实现了多对一的目的。如果业务继续增长，我们依然可以继续利用发布/订阅方式来完成多对多的方案，相关代码如下：
var emitter = new events.Emitter();
var done = after(times, render);
emitter.on("done", done);
emitter.on("done", other);
fs.readFile(template_path, "utf8", function (err, template) {
    emitter.emit("done", "template", template);
});
db.query(sql, function (err, data) {
    emitter.emit("done", "data", data);
});
l10n.get(function (err, resources) {
    emitter.emit("done", "resources", resources);
});

偏函数 (Partial application)    在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。（什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数。）    局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

柯里化 (Currying)    在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。    柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
-----------------------------------
除了async、Step、EventProxy、wind等方案外，还有一类通过源代码编译的方案来实现流程控制的简化，streamline是典型的例子。

# 难点3-阻塞代码

# 难点4-多线程编程

process.memoryUsage()可以看到Node进程的内存占用情况，rss是resident set size的缩写，即进程的常驻内存部分。进程的内存总共有几部分，一部分是
rss，其余部分在交换区（swap）或者文件系统（filesystem）中。
os模块中的totalmem()和freemem()这两个方法用于查看操作系统的内存使用情况，它们分别返回系统的总内存和闲置内存，都以字节为单位。

通过process.momoryUsage()的结果可以看到，堆中的内存用量总是小于进程的常驻内存用量，这意味着Node中的内存使用并非都是通过V8进行分配的。我们将那些不是通过V8分配的内存称为堆外内存。
Buffer对象不同于其他对象，它不经过V8的内存分配机制，所以也不会有堆内存的大小限制。
这意味着利用堆外内存可以突破内存限制的问题。为何Buffer对象并非通过V8分配？这在于Node并不同于浏览器的应用场景。在浏览器中，
JavaScript直接处理字符串即可满足绝大多数的业务需求，而Node则需要处理网络流和文件I/O流，操作字符串远远不能满足传输的性能需求。

Node的内存构成主要由通过V8进行分配的部分和Node自行分配的部分。受V8的垃圾回收限制的主要是V8的堆内存。


Buffer对象类似于数组，它的元素为16进制的两位数，即0到255的数值。
var str = "深入浅出node.js";
var buf = new Buffer(str, 'utf-8');
console.log(buf);
// => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73>
不同编码的字符串占用的元素个数各不相同，上面代码中的中文字在UTF-8编码下占用3个元素，字母和半角标点符号占用1个元素。

正确的Buffer拼接方法应该如下面展示的形式：
var chunks = [];
var size = 0;
res.on('data', function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
});
res.on('end', function () {
    var buf = Buffer.concat(chunks, size);
    var str = iconv.decode(buf, 'utf8');
    console.log(str);
});
正确的拼接方式是用一个数组来存储接收到的所有Buffer片段并记录下所有片段的总长度，然后调用Buffer.concat()方法生成一个合并的Buffer对象。Buffer.concat()方法封装了从小Buffer对象向大Buffer对象的复制过程，实现十分细腻，值得围观学习：
Buffer.concat = function(list, length) {
    if (!Array.isArray(list)) {
        throw new Error('Usage: Buffer.concat(list, [length])');
    }
    if (list.length === 0) {
        return new Buffer(0);
    } else if (list.length === 1) {
        return list[0];
    }
    if (typeof length !== 'number') {
        length = 0;
        for (var i = 0; i < list.length; i++) {
            var buf = list[i];
            length += buf.length;
        }
    }
    var buffer = new Buffer(length);
    var pos = 0;
    for (var i = 0; i < list.length; i++) {
        var buf = list[i];
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};

mysql 中 localhost 和 127.0.0.1 连接的区别，其实质分别对应的就是 Unix domain socket 和 TCP/IP socket。 下面再来看看这两者之间的区别。
UNIX Domain Socket用于IPC更有效率：不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序号和应答等，只是将应用层数据从一个进程拷贝到另一个进程。
UNIX域套接字与TCP套接字相比较，在同一台主机的传输速度前者是后者的两倍。
这是因为，IPC机制本质上是可靠的通讯，而网络协议是为不可靠的通讯设计的。

尽管在网络的一端调用write()会触发另一端的data事件，但是并不意味着每次write()都会触发一次data事件，在关闭掉Nagle算法后，另一端可能会将接收到的多个小数据包合并，然后只触发一次data事件。

UDP套接字相对TCP套接字使用起来更简单，它只是一个EventEmitter的实例，而非Stream的实例。

QPS（Query Per Second）：每秒请求数，就是说服务器在一秒的时间内处理了多少个请求。

cat xx.log |grep 'GET /mvc2'|cut -d ' ' -f4|uniq -c|sort -n -r 
cut -d ' ' -f4 过滤出来的内容按照空格分割，取第四列
uniq -c 每列旁边显示该行重复出现的次数
sort -n -r 依照数值大小排序 

异步I/O不仅仅应用在文件操作中。对于网络套接字的处理，Node也应用到了异步I/O，网络套接字上侦听到的请求都会形成事件交给I/O观察者。事件循环会不停地处理这些网络I/O事件。如果JavaScript有传入回调函数，这些事件将会最终传递到业务逻辑层进行处理。利用Node构建Web服务器，正是在这样一个基础上实现的。

Node通过事件驱动的方式处理请求，无须为每一个请求创建额外的对应线程，可以省掉创建线程和销毁线程的开销，同时操作系统在调度任务时因为线程较少，上下文切换的代价很低。这使得服务器能够有条不紊地处理请求，即使在大量连接的情况下，也不受线程上下文切换开销的影响，这是Node高性能的一个原因。

// TCP
var net = require('net');
var server = net.createServer(function (socket) { })

// UDP
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
    server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " +
        rinfo.address + ":" + rinfo.port);
});
server.on("listening", function () {
var address = server.address();

// http
var http = require('http');
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  })
  .listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

curl -v http://127.0.0.1:1337    看到TCP的3次握手，只看response的话用-i

# Node的http模块包含对HTTP处理的封装。在Node中，HTTP服务继承自TCP服务器（net模块），它能够与多个客户端保持连接，由于其采用事件驱动的形式，并不为每一个连接创建额外的线程或进程，保持很低的内存占用，所以能实现高并发。HTTP服务与TCP服务模型有区别的地方在于，在开启keepalive后，一个TCP会话可以用于多次请求和响应。TCP服务以connection为单位进行服务，HTTP服务以request为单位进行服务。http模块是将connection到request的过程进行了封装。


为不需要Cookie的组件换个域名可以实现减少无效Cookie的传输。所以很多网站的静态文件会有特别的域名，使得业务相关的Cookie不再影响静态资源。当然换用额外的域
名带来的好处不只这点，还可以突破浏览器下载线程数量的限制，因为域名不同，可以将下载线程数翻倍。但是换用额外域名还是有一定的缺点的，那就是将域名转换为IP需要进行DNS查询，多一个域名就多一次DNS查询。

通过CA机构颁发证书通常是一个烦琐的过程，需要付出一定的精力和费用。对于中小型企业
而言，多半是采用自签名证书来构建安全网络的。所谓自签名证书，就是自己扮演CA机构，给自
己的服务器端颁发签名证书。以下为生成私钥、生成CSR文件、通过私钥自签名生成证书的过程：
# 扮演CA角色需要的文件:
$ openssl genrsa -out ca.key 1024
$ openssl req -new -key ca.key -out ca.csr
$ openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt

服务器端需要向CA机构申请签名证书。在申请签名证书之前依然是要创建自己的CSR文件。值得注意的是，这个过程中的Common Name要匹配服务器域名，否则在后续的认证过程中会出错。如下是生成CSR文件所用的命令：
$ openssl req -new -key server.key -out server.csr
得到CSR文件后，向我们自己的CA机构申请签名吧。签名过程需要CA的证书和私钥参与，最终颁发一个带有CA签名的证书，如下所示：
$ openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in server.csr -out server.crt
客户端在发起安全连接前会去获取服务器端的证书，并通过CA的证书验证服务器端证书的真伪。除了验证真伪外，通常还含有对服务器名称、IP地址等进行验证的过程。

在RESTful类Web服务中请求方法十分重要，因为它会决定资源的操作行为。PUT代表新建一个资源，POST表示要更新一个资源，GET表示查看一个资源，而DELETE表示删除一个资源。
在MVC流行之前，主流的处理方式都是通过文件路径进行处理的，甚至以为是常态。直到有一天开发者发现用户请求的URL路径原来可以跟具体脚本所在的路径没有任何关系。
MVC模型的主要思想是将业务逻辑按职责分离，主要分为以下几种。
 控制器（Controller），一组行为的集合。
 模型（Model），数据相关的操作和封装。
 视图（View），视图的渲染。
这是目前最为经典的分层模式（如图8-3所示），大致而言，它的工作模式如下说明。
 路由解析，根据URL寻找到对应的控制器和行为。
 行为调用相关的模型，进行数据操作。
 数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端。

REST的全称是Representational State Transfer，中文含义为表现层状态转化。符合REST规范的设计，我们称为RESTful设计。它的设计哲学主要将服务器端提供的内容实体看作一个资源，并表现在URL上。

浏览器对内容采用了不同的处理方式，前者为纯文本，后者为HTML，并渲染了DOM树。浏览器正是通过不同的Content-Type的值来决定采用不同的渲染方式，这个值我们简称为MIME值。
MIME的全称是Multipurpose Internet Mail Extensions，从名字可以看出，它最早用于电子邮件 ， 后 来 也 应 用 到 浏 览 器 中 。 不 同 的 文 件 类 型 具 有 不 同 的 MIME 值 ， 如 JSON文 件 的 值为application/json、XML文件的值为application/xml、PDF文件的值为application/pdf。
为了方便获知文件的MIME值，社区有专有的mime模块可以用判段文件类型。它的调用十分简单，如下所示：
var mime = require('mime');
mime.lookup('/path/to/file.txt'); // => 'text/plain'
mime.lookup('file.txt'); // => 'text/plain'
mime.lookup('.TXT'); // => 'text/plain'
mime.lookup('htm'); // => 'text/html'
除了MIME值外，Content-Type的值中还可以包含一些参数，如字符集。示例如下：
Content-Type: text/javascript; charset=utf-8


在一些场景下，无论响应的内容是什么样的MIME值，需求中并不要求客户端去打开它，只需 弹 出 并 下 载 它 即 可 。 为 了 满 足 这 种 需 求 ， Content-Disposition 字 段 应 声 登 场 。 Content-Disposition字段影响的行为是客户端会根据它的值判断是应该将报文数据当做即时浏览的内容，还是可下载的附件。当内容只需即时查看时，它的值为inline，当数据可以存为附件时，它的值为attachment。另外，Content-Disposition字段还能通过参数指定保存时应该使用的文件名。示例如下：
Content-Disposition: attachment; filename="filename.ext"
如果我们要设计一个响应附件下载的API（res.sendfile），我们的方法大致是如下这样的：
res.sendfile = function (filepath) {
    fs.stat(filepath, function(err, stat) {
        var stream = fs.createReadStream(filepath);
        // 设置内容
        res.setHeader('Content-Type', mime.lookup(filepath));
        // 设置长度
        res.setHeader('Content-Length', stat.size);
        // 设置为附件
        res.setHeader('Content-Disposition' 'attachment; filename="' + path.basename(filepath) + '"');
        res.writeHead(200);
        stream.pipe(res);
    });
};

# 模板函数如下所示：
var render = function (str, data) {
    // 模板技术就是替换特殊标签的技术
    var tpl = str.replace(/<%=([\s\S]+?)%>/g, function(match, code) {
        return "' + obj." + code + "+ '";
    });
    tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
    var complied = new Function('obj', tpl);
    return complied(data);
};
调用上面的模板函数试试，如下所示：
var tpl = 'Hello <%=username%>.';
console.log(render(tpl, {username: 'Jackson Tian'}));
// => Hello Jackson Tian.
 模板编译
上述代码的实现过程中，可以看到有部分内容前文没有提及，它的内容如下：
tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
var complied = new Function('obj', tpl);
为了能够最终与数据一起执行生成字符串，我们需要将原始的模板字符串转换成一个函数对象。比如Hello <%=username%>这句模板字符串，最终会生成如下的代码：
function (obj) {
    var tpl = 'Hello ' + obj.username + '.';
    return tpl;
}
这个过程称为模板编译，生成的中间函数只与模板字符串相关，与具体的数据无关。如果每次都生成这个中间函数，就会浪费CPU。为了提升模板渲染的性能速度，我们通常会采用模板预编译的方式。是故，上面的代码可以拆解为两个方法，如下所示：
var complie = function (str) {
    var tpl = str.replace(/<%=([ \s\S]+?)%>/g, function(match, code) {
        return "' + obj." + code + "+ '";
    });
    tpl = "var tpl = '" + tpl + "'\nreturn tpl;";
    return new Function('obj, escape', tpl);
};
var render = function (complied, data) {
    return complied(data);
};
通过预编译缓存模板编译后的结果，实际应用中就可以实现一次编译，多次执行，而原始的方式每次执行过程中都要进行一次编译和执行。

上面实现的模板引擎非常弱，只能替换变量，<%="Jackson Tian"%>就无法支持了。为了让它更灵活，我们需要改进它的实现，使字符串能继续表达为字符串，变量能够自动寻找属于它的对象。于是with关键字引入到我们的实现中。

// with
function foo(obj) {
	with (obj) {
		a = 2;
	}
}

var o1 = {
	a: 3
};

var o2 = {
	b: 3
}

foo(o1);
console.log(o1.a);	//2

foo(o2);
console.log(o2.a);	//underfined
console.log(a);		//2，a被泄漏到全局作用域上

首先，我们来分析上面的代码。例子中创建了 o1 和 o2 两个对象。其中一个有 a 属性，另外一个没有。foo(obj) 函数接受一个 obj 的形参，该参数是一个对象引用，并对该对象引用执行了 with(obj) {...}。在 with 块内部，对 a 有一个词法引用，实际上是一个 LHS引用，将 2 赋值给了它。

当我们将 o1 传递进去，a = 2 赋值操作找到了 o1.a 并将 2 赋值给它。而当 o2 传递进去，o2 并没有 a 的属性，因此不会创建这个属性，o2.a 保持 undefined。

但为什么对 o2的操作会导致数据的泄漏呢？

这里需要回到对 LHS查询 的机制问题（详情可移步 JavaScript中的LHS和RHS查询）。

当我们传递 o2 给 with 时，with 所声明的作用域是 o2, 从这个作用域开始对 a 进行 LHS查询。o2 的作用域、foo(…) 的作用域和全局作用域中都没有找到标识符 a，因此在非严格模式下，会自动在全局作用域创建一个全局变量），在严格模式下，会抛出ReferenceError 异常。
————————————————
原文链接：https://blog.csdn.net/zwkkkk1/article/details/79725934/


Master-Worker模式，又称主从模式如下所示：
// worker.js文件
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1');
通过node worker.js启动它，将会侦听1000到2000之间的一个随机端口。将以下代码存为master.js，并通过node master.js启动它：
var fork = require('child_process').fork;
var cpus = require('os').cpus();
for (var i = 0; i < cpus.length; i++) {
    fork('./worker.js');
}
这段代码将会根据当前机器上的CPU数量复制出对应Node进程数。在*nix系统下可以通过ps aux | grep worker.js查看到进程的数量

IPC的全称是Inter-Process Communication，即进程间通信。
进程间通信的目的是为了让不同的进程能够互相访问资源并进行协调工作。实现进程间通信的技术有很多，如命名管道、匿名管道、socket、信号量、共享内存、消息队列、Domain Socket等。Node中实现IPC通道的是管道（pipe）技术。但此管道非彼管道，在Node中管道是个抽象层面的称呼，具体细节实现由libuv提供，在
Windows下由命名管道（named pipe）实现，*nix系统则采用Unix Domain Socket实现。表现在应用层上的进程间通信只有简单的message事件和send()方法，接口十分简洁和消息化。

父进程在实际创建子进程之前，会创建IPC通道并监听它，然后才真正创建出子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的IPC通道，从而完成父子进程之间的连接。

多个子进程可以同时监听相同端口，再没有EADDRINUSE异常发生了：
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');
// Open up the server object and send the handle
var server = require('net').createServer();
server.listen(1337, function () {
    child1.send('server', server);
    child2.send('server', server);
    // 关掉
    server.close();
});
然后对子进程进行改动，如下所示：
// child.js
var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('handled by child, pid is ' + process.pid + '\n');
});
process.on('message', function (m, tcp) {
    if (m === 'server') {
        tcp.on('connection', function (socket) {
            server.emit('connection', socket);
        });
    }
});
# process是一个全局变量，可通过process.argv获得命令行参数。由于argv[0]固定等于NodeJS的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]这个位置开始。process.argv.slice(2)

只写数据流里写入数据后，如果写入速度跟不上读取速度的话，只写数据流内部的缓存会爆仓。我们可以根据.write方法的返回值来判断传入的数据是写入目标了，还是临时放在了缓存了，并根据drain事件来判断什么时候只写数据流已经将缓存中的数据写入目标，可以传入下一个待写数据了。因此代码可以改造如下：
// 每次读4b，写1b
var rs = fs.createReadStream(src, {highWaterMark: 4});
var ws = fs.createWriteStream(dst, {highWaterMark: 1});

rs.on('data', function (chunk) {
    // chunk是Buffer类型，写不下就暂停读取
    if (ws.write(chunk) === false) {
        rs.pause();
    }
});

rs.on('end', function () {
    ws.end();
});

// 内存干了就恢复读取
ws.on('drain', function () {
    rs.resume();
});

path.normalize 注意：标准化之后的路径里的斜杠在Windows是\，而在Linux是/。如果想保证任何系统下都使用/作为路径分隔符的话，需要用.replace(/\\/g, '/')再替换一下标准路径。
var cache = {};
  function store(key, value) {
      cache[path.normalize(key)] = value;
  }
 store('foo//baz//../bar', 2);
 console.log(cache);  // => { "foo/bar": 2 }


 # 同步遍历
 function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}
travel('/home/user', function (pathname) {
    console.log(pathname);
});
# 异步遍历
function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);
*** 代码在异步函数执行一次并返回执行结果后才传入下一个数组成员并开始下一轮执行，所以数组成员是一个接一个串行处理，直到所有数组成员处理完毕后，通过回调的方式触发finish执行。 ***
                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
*** travel的先前调用已经返回，并且在异步回调之前，堆栈已完全解开，因此，尽管在外观上看起来像递归，但没有堆栈建立。 ***
                        travel(pathname, callback, function () {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function () {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}

# 文本编码
使用NodeJS编写前端工具时，操作得最多的是文本文件，因此也就涉及到了文件编码的处理问题。我们常用的文本编码有UTF8和GBK两种，并且UTF8文件还可能带有BOM。在读取不同编码的文本文件时，需要将文件内容转换为JS使用的UTF8编码字符串后才能正常处理。

BOM的移除
BOM用于标记一个文本文件使用Unicode编码，其本身是一个Unicode字符（"\uFEFF"），位于文本文件头部。在不同的Unicode编码下，BOM字符对应的二进制字节如下：

    Bytes      Encoding
----------------------------
    FE FF       UTF16BE
    FF FE       UTF16LE
    EF BB BF    UTF8
因此，我们可以根据文本文件头几个字节等于啥来判断文件是否包含BOM，以及使用哪种Unicode编码。但是，BOM字符虽然起到了标记文件编码的作用，其本身却不属于文件内容的一部分，如果读取文本文件时不去掉BOM，在某些使用场景下就会有问题。例如我们把几个JS文件合并成一个文件后，如果文件中间含有BOM字符，就会导致浏览器JS语法错误。因此，使用NodeJS读取文本文件时，一般需要去掉BOM。例如，以下代码实现了识别和去除UTF8 BOM的功能。

function readText(pathname) {
    var bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
GBK转UTF8
NodeJS支持在读取文本文件时，或者在Buffer转换为字符串时指定文本编码，但遗憾的是，GBK编码不在NodeJS自身支持范围内。因此，一般我们借助iconv-lite这个三方包来转换编码。使用NPM下载该包后，我们可以按下边方式编写一个读取GBK文本文件的函数。

var iconv = require('iconv-lite');

function readGBKText(pathname) {
    var bin = fs.readFileSync(pathname);

    return iconv.decode(bin, 'gbk');
}

不管大于0xEF的单个字节在单字节编码下被解析成什么乱码字符，使用同样的单字节编码保存这些乱码字符时，背后对应的字节保持不变。
NodeJS中自带了一种binary编码可以用来实现这个方法，因此在下例中，我们使用这种编码来演示上例对应的代码该怎么写。
function replace(pathname) {
    var str = fs.readFileSync(pathname, 'binary');
    str = str.replace('foo', 'bar');
    fs.writeFileSync(pathname, str, 'binary');
}

# 处理HTTP请求时url模块使用率超高，因为该模块允许解析URL、生成URL，以及拼接URL。首先我们来看看一个完整的URL的各组成部分。

                           href
 -----------------------------------------------------------------
                            host              path
                      --------------- ----------------------------
 http: // user:pass @ host.com : 8080 /p/a/t/h ?query=string #hash
 -----    ---------   --------   ---- -------- ------------- -----
protocol     auth     hostname   port pathname     search     hash
                                                ------------
                                                   query
我们可以使用.parse方法来将一个URL字符串转换为URL对象，示例如下。

url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
/* =>
{ protocol: 'http:',
  auth: 'user:pass',
  host: 'host.com:8080',
  port: '8080',
  hostname: 'host.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/p/a/t/h',
  path: '/p/a/t/h?query=string',
  href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash' }
*/
url.parse方法还支持第二个和第三个布尔类型可选参数。第二个参数等于true时，该方法返回的URL对象中，query字段不再是一个字符串，而是一个经过querystring模块转换后的参数对象。第三个参数等于true时，该方法可以正确解析不带协议头的URL，例如//www.example.com/foo/bar。所以处理请求时一般是：
# url.parse(request.url)

# querystring模块用于实现URL参数字符串与参数对象的互相转换，示例如下。
querystring.parse('foo=bar&baz=qux&baz=quux&corge');
/* =>
{ foo: 'bar', baz: ['qux', 'quux'], corge: '' }
*/

querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
/* =>
'foo=bar&baz=qux&baz=quux&corge='
*/

# zlib模块提供了数据压缩和解压的功能。当我们处理HTTP请求和响应时，可能需要用到这个模块。
首先我们看一个使用zlib模块压缩HTTP响应体数据的例子。这个例子中，判断了客户端是否支持gzip，并在支持的情况下使用zlib模块返回gzip之后的响应体数据。
if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
        zlib.gzip(data, function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            });
            response.end(data);
        });
    }
使用zlib模块解压HTTP响应体数据的例子:
http.request(options, function (response) {
    var body = [];

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);

        if (response.headers['content-encoding'] === 'gzip') {
            zlib.gunzip(body, function (err, data) {
                console.log(data.toString());
            });
        } else {
            console.log(data.toString());
        }
    });
}).end();

问： 为什么http模块创建的HTTP服务器返回的响应是chunked传输方式的？

答： 因为默认情况下，使用.writeHead方法写入响应头后，允许使用.write方法写入任意长度的响应体数据，并使用.end方法结束一个响应。由于响应体数据长度不确定，因此NodeJS自动在响应头里添加了Transfer-Encoding: chunked字段，并采用chunked传输方式。但是当响应体数据长度确定时，可使用.writeHead方法在响应头里加上Content-Length字段，这样做之后NodeJS就不会自动添加Transfer-Encoding字段和使用chunked传输方式。

问： 为什么使用http模块发起HTTP客户端请求时，有时候会发生socket hang up错误？

答： 发起客户端HTTP请求前需要先创建一个客户端。http模块提供了一个全局客户端http.globalAgent，可以让我们使用.request或.get方法时不用手动创建客户端。但是全局客户端默认只允许5个并发Socket连接，当某一个时刻HTTP客户端请求创建过多，超过这个数字时，就会发生socket hang up错误。解决方法也很简单，通过http.globalAgent.maxSockets属性把这个数字改大些即可。另外，https模块遇到这个问题时也一样通过https.globalAgent.maxSockets属性来处理。

# 调用终端命令来简化目录拷贝，示例代码如下：
var child_process = require('child_process');
var util = require('util');

function copy(source, target, callback) {
    child_process.exec(
        util.format('cp -r %s/* %s', source, target), callback);
}

copy('a', 'b', function (err) {
    // ...
});
从以上代码中可以看到，子进程是异步运行的，通过回调函数返回执行结果。

# 通常一个程序做完所有事情后就正常退出了，这时程序的退出状态码为0。或者一个程序运行时发生了异常后就挂了，这时程序的退出状态码不等于0。如果我们在代码中捕获了某个异常，但是觉得程序不应该继续运行下去，需要立即退出，并且需要把退出状态码设置为指定数字，比如1，就可以按照以下方式：
try {
    // ...
} catch (err) {
    // ...
    process.exit(1);
}
进程退出之后将不再执行事件循环，所有只有那些没有回调函数的代码才会被执行，在下面例子中，setTimeout里面的语句是没有办法执行到的。
process.on('exit', function () {
　　setTimeout(function () {
　　　　console.log('This will not run');
　　}, 100);
　　console.log('Bye.');
});


# 在Linux系统下，我们知道需要使用root权限才能监听1024以下端口。但是一旦完成端口监听后，继续让程序运行在root权限下存在安全隐患，因此最好能把权限降下来。以下是这样一个例子。
http.createServer(callback).listen(80, function () {
    var env = process.env,
        uid = parseInt(env['SUDO_UID'] || process.getuid(), 10),
        gid = parseInt(env['SUDO_GID'] || process.getgid(), 10);

    process.setgid(gid);
    process.setuid(uid);
});
上例中有几点需要注意：

如果是通过sudo获取root权限的，运行程序的用户的UID和GID保存在环境变量SUDO_UID和SUDO_GID里边。如果是通过chmod +s方式获取root权限的，运行程序的用户的UID和GID可直接通过process.getuid和process.getgid方法获取。

process.setuid和process.setgid方法只接受number类型的参数。

降权时必须先降GID再降UID，否则顺序反过来的话就没权限更改程序的GID了。

# 在Linux系统下，进程之间可以通过信号互相通信。以下是一个例子。
/* parent.js */
var child = child_process.spawn('node', [ 'child.js' ]);

child.kill('SIGTERM');

/* child.js */
process.on('SIGTERM', function () {
    cleanUp();
    process.exit(0);
});
在上例中，父进程通过.kill方法向子进程发送SIGTERM信号，子进程监听process对象的SIGTERM事件响应信号。不要被.kill方法的名称迷惑了，该方法本质上是用来给进程发送信号的，进程收到信号后具体要做啥，完全取决于信号的种类和进程自身的代码。

另外，如果父子进程都是NodeJS进程，就可以通过IPC（进程间通讯）双向传递数据。以下是一个例子。

/* parent.js */
var child = child_process.spawn('node', [ 'child.js' ], {
        stdio: [ 0, 1, 2, 'ipc' ]
    });

child.on('message', function (msg) {
    console.log(msg);
});

child.send({ hello: 'hello' });

/* child.js */
process.on('message', function (msg) {
    msg.hello = msg.hello.toUpperCase();
    process.send(msg);
});
可以看到，父进程在创建子进程时，在options.stdio字段中通过ipc开启了一条IPC通道，之后就可以监听子进程对象的message事件接收来自子进程的消息，并通过.send方法给子进程发送消息。在子进程这边，可以在process对象上监听message事件接收来自父进程的消息，并通过.send方法向父进程发送消息。数据在传递过程中，会先在发送端使用JSON.stringify方法序列化，再在接收端使用JSON.parse方法反序列化。

# 守护进程一般用于监控工作进程的运行状态，在工作进程不正常退出时重启工作进程，保障工作进程不间断运行。以下是一种实现方式。

/* daemon.js */
function spawn(mainModule) {
    var worker = child_process.spawn('node', [ mainModule ]);

    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(mainModule);
        }
    });
}
spawn('worker.js');
可以看到，工作进程非正常退出时，守护进程立即重启工作进程。

本章介绍了使用NodeJS管理进程时需要的API以及主要的应用场景，总结起来有以下几点：
使用process对象管理自身。
使用child_process模块创建和管理子进程。

# JS本身是单线程的，无法异步执行，因此我们可以认为setTimeout这类JS规范之外的由运行环境提供的特殊函数做的事情是创建一个平行线程后立即返回，让JS主进程可以接着执行后续代码，并在收到平行进程的通知后再执行回调函数。除了setTimeout、setInterval这些常见的，这类函数还包括NodeJS提供的诸如fs.readFile之类的异步API。

另外，我们仍然回到JS是单线程运行的这个事实上，这决定了JS在执行完一段代码之前无法执行包括回调函数在内的别的代码。也就是说，即使平行线程完成工作了，通知JS主线程执行回调函数了，回调函数也要等到JS主线程空闲时才能开始执行。

如果数组成员可以并行处理，但后续代码仍然需要所有数组成员处理完毕后才能执行的话，则异步代码会调整成以下形式：
(function (i, len, count, callback) {
    for (; i < len; ++i) {
        (function (i) {
            async(arr[i], function (value) {
                arr[i] = value;
                if (++count === len) {
                    callback();
                }
            });
        }(i));
    }
}(0, arr.length, 0, function () {
    // All array items have processed.
}));
可以看到，与异步串行遍历的版本相比，以上代码并行处理所有数组成员，并通过计数器变量来判断什么时候所有数组成员都处理完毕了。

# JS自身提供的异常捕获和处理机制——try..catch..，只能用于同步执行的代码。
异常会沿着代码执行路径一直冒泡，直到遇到第一个try语句时被捕获住。但由于异步函数会打断代码执行路径，异步函数执行过程中以及执行之后产生的异常冒泡到执行路径被打断的位置时，如果一直没有遇到try语句，就作为一个全局异常抛出。
所以要在异步内使用try...catch，同时通过回调函数来传递异常，在NodeJS中，几乎所有异步API都按照以上方式设计，回调函数中第一个参数都是err。因此我们在编写自己的异步函数时，也可以按照这种方式来处理异常，与NodeJS的设计风格保持一致。
function async(fn, callback) {
    // Code execution path breaks here.
    setTimeout(function ()　{
        try {
            callback(null, fn());
        } catch (err) {
            callback(err);
        }
    }, 0);
}

async(null, function (err, data) {
    if (err) {
        console.log('Error: %s', err.message);
    } else {
        // Do something.
    }
});

# NodeJS通过process对象提供了捕获全局异常的方法，示例代码如下
process.on('uncaughtException', function (err) {
    console.log('Error: %s', err.message);
});

使用domain模块创建一个子域（JS子运行环境）。在子域内运行的代码可以随意抛出异常，而这些异常可以通过子域对象的error事件统一捕获。
http.createServer(function (request, response) {
    var d = domain.create();

    d.on('error', function () {
        response.writeHead(500);
        response.end();
    });

    d.run(function () {
        async(request, function (data) {
            response.writeHead(200);
            response.end(data);
        });
    });
});
可以看到，我们使用.create方法创建了一个子域对象，并通过.run方法进入需要在子域中运行的代码的入口点。而位于子域中的异步函数回调函数由于不再需要捕获异常，代码一下子瘦身很多。

JS本身的throw..try..catch异常处理机制并不会导致内存泄漏，也不会让程序的执行结果出乎意料，但NodeJS并不是存粹的JS。NodeJS里大量的API内部是用C/C++实现的，因此NodeJS程序的运行过程中，代码执行路径穿梭于JS引擎内部和外部，而JS的异常抛出机制可能会打断正常的代码执行流程，导致C/C++部分的代码表现异常，进而导致内存泄漏等问题。
因此，使用uncaughtException或domain捕获异常，代码执行路径里涉及到了C/C++部分的代码时，如果不能确定是否会导致内存泄漏等问题，最好在处理完异常后重启程序比较妥当。而使用try语句捕获异常时一般捕获到的都是JS本身的异常，不用担心上诉问题。

把map方法换成for循环或许会更快一些，但第一版代码最大的性能问题存在于从读取文件到输出响应的过程当中。我们以处理/??a.js,b.js,c.js这个请求为例，看看整个处理过程中耗时在哪儿。

 发送请求       等待服务端响应         接收响应
---------+----------------------+------------->
         --                                        解析请求
           ------                                  读取a.js
                 ------                            读取b.js
                       ------                      读取c.js
                             --                    合并数据
                               --                  输出响应
可以看到，第一版代码依次把请求的文件读取到内存中之后，再合并数据和输出响应。这会导致以下两个问题：
1. 当请求的文件比较多比较大时，串行读取文件会比较耗时，从而拉长了服务端响应等待时间。
2. 由于每次响应输出的数据都需要先完整地缓存在内存里，当服务器请求并发数较大时，会有较大的内存开销。

考虑把读取文件的方式从串行改为并行。但是别这样做，因为对于机械磁盘而言，因为只有一个磁头，尝试并行读取文件只会造成磁头频繁抖动，反而降低IO效率。而对于固态硬盘，虽然的确存在多个并行IO通道，但是对于服务器并行处理的多个请求而言，硬盘已经在做并行IO了，对单个请求采用并行IO无异于拆东墙补西墙。因此，正确的做法不是改用并行IO，而是一边读取文件一边输出响应，把响应输出时机提前至读取第一个文件的时刻。
发送请求 等待服务端响应 接收响应
---------+----+------------------------------->
         --                                        解析请求
           --                                      检查文件是否存在
             --                                    输出响应头
               ------                              读取和输出a.js
                     ------                        读取和输出b.js
                           ------                  读取和输出c.js

获取 Shell 脚本自身进程 pid，这里涉及两个指令：

1. $$ ：当前 Shell 进程的 pid
2. $! ：上一个后台进程的 pid 可以使用这两个指令来获取相应的进程 pid。例如，如果需要获取某个正在执行的进程的 pid(并写入指定的文件)：

myCommand && pid=$!
myCommand & echo $! > /path/to/pid.file

按目录结构分别存放对应的文件之后，接下来我们看看控制脚本怎么写。首先是start.sh。
#!/bin/sh
if [ ! -f "pid" ]
then
    node ../lib/daemon.js ../conf/config.json &
    echo $! > pid
fi

然后是killws.sh。
#tr用来转换或者删除一段文字。tr是translate（转换的缩写），tr所有的功能均可由sed来完成，可以将tr视为sed一个极简的实现。
#!/bin/sh
if [ -f "pid" ]
then
    kill $(tr -d '\r\n' < pid)
    rm pid
fi


# 长循环操作，服务器将不能处理其他的请求。
根据长循环操作的本质有好几种解决办法，但其中一个适合所有操作的解决方案是用 frok 将计算操作放到另一个进程中。
将整个 longComputation 函数放到一个文件中，然后受主进程指示触发这个函数。
// 在一个新的 compute.js 文件中：
const longComputation = () => {
    let sum = 0;
    for (let i = 0; i< 1e9;i++) {
        sum += i;
    }
    return sum;
};

process.on('message', (msg) => {
    const sum = longComputation();
    process.send(sum);
});

现在，不再是在主进程事件循环中做长循环操作，我们可以衍生（fork） compute.js 文件，然后用通信接口在服务器（主进程）和子进程之间交流。
const http = require('http');
const { fork } = require('child_process');
const server = http.createServer();

server.on('request', (req, res) => {
    if(req.url === '/compute') {
        const compute = fork('compute.js');
        compute.send('start');
        compute.on('message', sum => {
            res.end(`Sum is ${sum}`)
        })
    } else {
        res.end('OK');
    }
});
server.listen(3000);


# 让我们首先创建一个大文件：
const fs = require('fs');
const file = fs.createWriteStream('./big.file');
for(let  i = 0;i<=1e6;i++) {
    file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit. \n');
}
file.end();

Node 的 fs 模块可以使用 createReadStream 方法创建一个可读的流，我们可以将它导入（pipe）到响应对象里面。

const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  const src = fs.createReadStream('./big.file');
  src.pipe(res);
});

server.listen(8000);


# 可读的和可写的例子结合的双向流实例：
const { Duplex } = require('stream');

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  },

  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});

inoutStream.currentCharCode = 65;
process.stdin.pipe(inoutStream).pipe(process.stdout);

这里有一个简单的 transform 流的例子，将会以大写的格式打印任何你键入的字符：
const { Transform } = require('stream');
const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});
process.stdin.pipe(upperCaseTr).pipe(process.stdout);

流除了 Buffer/String 值。这里还有一个对象模式（objectMode）的标识，我们可以设置以接受任何地 Javascript 对象。
这里有一个简单的示例。下面转换流的结合实现了一个特性，可以将逗号分割的字符串转换为 Javascript 对象，因此 “a,b,c,d”会变成 {a: b, c: d}
const { Transform } = require('stream');
const commaSplitter = new Transform({
  readableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split(','));
    callback();
  }
});
const arrayToObject = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    const obj = {};
    for(let i=0; i < chunk.length; i+=2) {
      obj[chunk[i]] = chunk[i+1];
    }
    this.push(obj);
    callback();
  }
});
const objectToString = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk) + '\n');
    callback();
  }
});
process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout)
我们传递了一个输入字符（例如：“a, b, c, d”）通过 commaSplitter 流转换为 （["a", "b", "c", "d"]）。在流上面添加 readableObjectMode 是必要的，因为 push 了一个对象，不是字符串。
当我们获取到数组并且将它 pipe 到 arrayToObject 流中，需要一个 writableObjectMode 标识让这个流接受对象。它将会 push 一个对象。这就是这里为什么也需要 readableObjectMode 标识了。最后一个 objectToString 流接受一个对象但是 push 一个字符串，这就是为什么这里只需要 writableObjectMode 标识。可读的部分是一个正常的字符串（字符化的对象）。


# 这里有一个示例，使用 zlib.crreateGzip() 流与 fs readable/writable 流结合起来创建一个文件压缩的脚本：
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .on('data', () => process.stdout.write('.'))
  .pipe(fs.createWriteStream(file + '.gz'));
  .on('finish', () => console.log('Done'));
你可以使用这个脚本 gzip 压缩任何你在参数中传递的文件。我们导入了一个可读的流，然后导入到 zlib 内置转换流，接着导入到新压缩过的文件的可写流。

关于 pipe 方法最棒的是，我们可以使用它以一种更为可读的方式来一片一片地组合我们的程序。例如，取代监听 data 事件，我们可以简单地创建一个转换流报告进度，用另一个 pipe 调用代替 .on() 调用：

const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

const { Transform } = require('stream');

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.');
    callback(null, chunk);
  }
});

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + '.zz'))
  .on('finish', () => console.log('Done'));
reportProgress 流是简单的通过（pass-through）流，但是它也向标准输出报告了进度。注意我在 transform() 方法内部是如何在 callback() 的第二个参数中 push 数据的。相当于把错误放到第一位。


1. 计时器阶段（Timer phase）的工作流程:
假设事件循环在 t+250 进入到了计时器阶段。它会首先看下计时器 A，A 的过期时间是 t+100。但是现在时间是 t+250。因此它将执行绑定在计时器 A 上的回调。然后去检查计时器 B，发现它的过期时间是 t+200，因此也会执行 B 的回调。现在它会检查 C，发现它的过期时间是 t+300，因此将离开它。事件循环不会去检查 D ，因为计时器都是按升序排好的；因此 D 的阈值比 C 大。然而这个阶段有一个系统相关的硬限制，如果达到系统依赖最大限制数量，即使有未执行的计时器，它也会移到下一阶段。
2. 即将发生的（Pengding phase）的 i/o 阶段工作流程，比如读文件
计时器阶段后，事件循环将会进入到了即将发生的 i/o 阶段，然后检查一下 pengding_queue 中是否有来自于之前的即将发生的任务的回调。如果有，一个接一个的执行，直到队列为空，或者达到系统的最大限制。之后，事件循环将会移到 idle handler 阶段，其次是准备阶段做一些内部的操作。然后最终很可能进入到了最重要的阶段 poll phase。
3. 轮询阶段（Poll phase）工作流程
像名字说的那样，这是一个观察的阶段。观察是否有新的请求或者连接传入。当事件循环进入轮询阶段，它会在 watcher_queue 中执行脚本，包含文件读响应，新的 socket 或者 http 连接请求，直到时间耗尽或者像其他阶段那样达到系统依赖上限。
4. 检查阶段（Check phase）工作流程
轮询阶段结束之后，立即来到检查阶段。这个阶段的队列中有被setImmediate 触发的回调。它将会像其他阶段那样一个接着一个的执行，直到队列为空或者达到依赖系统的最大限制。
5. 关闭回调（Close callback）的工作流程
之前例子中的定时器 （A & B）过期，那么现在在定时器阶段将会从定时器 C 开始检查是否过期。

nextTickQueue 中存储着被 process.nextTick() 触发的回调。microTaskQueue 保留着被 Promise 触发的回调。它们都不是事件循环的一部分（不是在 libUV 中开发的），而是在 node.js 中。在 C/C++ 和 Javascript 有交叉的时候，它们都是尽可能快地被调用。因此它们应该在当前操作运行后（不一定是当前 js 回调执行完）。它们当然在从当前阶段到下一个阶段之前尽可能快的运行。不像其他阶段，它们两个没有系统依赖的最大限制，node 运行它们直到两个队列是空的。

setImmediate 和 process.nextTick() 都命名错了。所以功能上，setImmediate 在下一个 tick 执行，nextTick 是马上执行的。