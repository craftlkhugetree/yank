
# POST/GET
axios的params形式传递数据不管是get还是post请求，参数最后都是以拼接url?a=aa的形式出现，为query参数， {params: 555}被转为 ?0=555   
  {params: {test:555}}被转为 ?test=555;       get还有path传参， /get/{id}。
axios用data属性来表示body参数。get请求没有body的传参方式。

# 使用post请求且body为application/x-www-form-urlencoded时，通常需要借助qs进行数据转换，转换后的数据发送给后端，后端才能正确的处理。
data里面的参数（简单的对象，通过“{}”或者“new Object”创建的），body会以Form Data的形式存在，但是Form Data里面把我们传进去的整体当成了一个key值，没有value，解决方法：导入qs库。
DTO就是数据传输对象(Data Transfer Object)的缩写，是表现层也就是页面上有的字段，用于向接口传递，但该字段可能数据库没有。 

post请求当Content-Type设置为application/json;时,query（简单对象）里面的参数仍然会被拼接到请求连接后面，但是data（简单对象）里面的参数放到Request Payload中。
————————————————
1.前端向后端传输数据时，有 get 和 post 两种：
如果是 get 传输，直接传在 url 后；如果是 post 传输，则在请求体 body 中传输。HTTP 请求中的 get 请求和 post 请求参数的存放位置是不一样的。

2.在 body 中的数据格式（post 请求）：
一种是 json 数据格式，另一种是 字符串。具体要用哪种格式取决于后端入参的格式

如果后端接收 json 数据类型，post 的 headers 需要设置 { ‘content-type’: ’application/json’ }，传给后端的数据就形如 { ‘name’:’edward’, ‘age’:’25’ }
如果后端接收的是（表单）字符串类型，post 的 headers 需设置 { ‘content-type’: ’application/x-www-form-urlencoded’ }，传输给后端的数据就形如 ‘name=edward&age=25’
multipart/form-data(一般用来上传文件)
为什么一般是给 post 请求设置 content-type,get 请求不需要设置吗？
get 请求一般没有消息体 body，而 content-type 是用来指定消息体的格式的

3.接口数据传输方式 form data、payload 和 Query String Parameters
POST 提交数据有两种数据传输方式，这两种方式浏览器是通过 Content-Type 来进行区分：
如果是 application/json 或 multipart/form-data 的话，则为 request payload；json 格式
如果是 application/x-www-form-urlencoded 的话，则为 formdata 方式；字符串
如果是 GET 请求，则为 Query String Parameters

qs.stringfy()是将对象序列化成 URL 的形式，以&进行拼接。安装 axios 即可使用 qs。
axios 默认数据格式为 json,所以： 1.当后端需要接收 json 格式的数据时,post 请求头不需要设置请求头，数据格式也不需要我们去转换(若数据已经是 json)； 2.当后端需要接收字符串格式的数据时，我们需要给 post 请求头设置{ ‘content-type’: ’application/x-www-form-urlencoded’ }，
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
这个时候如果我们传的入参是一个 js 对象，这时候我们就需要用 qs 转换数据格式

let data = { name: 'edward', age: '25' }
前者：JSON.stringfy(data) // ”{ 'name' : 'edward' , 'age' : '25' }”
后者：qs.stringfy(data) // 'name=edward&age=25'


1、GET请求会向数据库发索取数据的请求，从而来获取信息，该请求就像数据库的select操作一样，只是用来查询一下数据，不会修改、增加数据，不会影响资源的内容，即该请求不会产生副作用。无论进行多少次操作，结果都是一样的。

2、PUT请求是向服务器端发送数据的（与GET不同）从而改变信息，该请求就像数据库的update操作一样，用来修改数据的内容，但是不会增加数据的种类等，也就是说无论进行多少次PUT操作，其结果并没有不同。

3、POST请求同PUT请求类似，都是向服务器端发送数据的，但是该请求会改变数据的种类等资源，就像数据库的insert操作一样，会创建新的内容。几乎目前所有的提交操作都是用POST请求的。

4、DELETE请求顾名思义，就是用来删除某一个资源的，该请求就像数据库的delete操作。

 就像前面所讲的一样，既然PUT和POST操作都是向服务器端发送数据的，那么两者有什么区别呢。。。POST主要作用在一个集合资源之上的（url），而PUT主要作用在一个具体资源之上的（url/xxx），通俗一下讲就是，如URL可以在客户端确定，那么可使用PUT，否则用POST。

综上所述，我们可理解为以下：

1、POST    /url      创建  
2、DELETE  /url/xxx  删除  
3、PUT     /url/xxx  更新
4、GET     /url/xxx  查看

幂等性概念：幂等通俗来说是指不管进行多少次重复操作，都是实现相同的结果。
# GET，PUT，DELETE都是幂等操作，而POST不是，以下进行分析：
首先GET请求很好理解，对资源做查询多次，此实现的结果都是一样的。 
PUT请求的幂等性可以这样理解，将A修改为B，它第一次请求值变为了B，再进行多次此操作，最终的结果还是B，与一次执行的结果是一样的，所以PUT是幂等操作。 
同理可以理解DELETE操作，第一次将资源删除后，后面多次进行此删除请求，最终结果是一样的，将资源删除掉了。

POST不是幂等操作，因为一次请求添加一份新资源，二次请求则添加了两份新资源，多次请求会产生不同的结果，因此POST不是幂等操作。

# 根据幂等性区分POST与PUT的使用:
了解REST后很长一段时间不能明确区分PUT和POST的区别，在使用时很容易混淆，完全可根据idempotent（幂等性）做区分。 /ˈaɪdəmˌpəʊtənt/

举一个简单的例子，假如有一个博客系统提供一个Web API，模式是这样http://superblogging/blogs/{blog-name}，很简单，将{blog-name}替换为我们的blog名字，往这个URI发送一个HTTP PUT或者POST请求，HTTP的body部分就是博文，这是一个很简单的REST API例子。

我们应该用PUT方法还是POST方法？

取决于这个REST服务的行为是否是idempotent的，假如我们发送两个http://superblogging/blogs/post/Sample请求，服务器端是什么样的行为？如果产生了两个博客帖子，那就说明这个服务不是idempotent的，因为多次使用产生了副作用了嘛；如果后一个请求把第一个请求覆盖掉了，那这个服务就是idempotent的。前一种情况，应该使用POST方法，后一种情况，应该使用PUT方法。


# dto
j2ee中，经常提到几种对象(object)，理解他们的含义有助于我们更好的理解面向对象的设计思维。

POJO(plain old java object)：普通的java对象，有别于特殊的java对象(含继承约束等)和EJB。POJO一般只有一系列的属性和相应的get、set方法。

PO(persistant object):持久化对象，有别于POJO,必须对应数据库中的实体。一个PO对应数据库的一条记录。持久化对象的生命周期与数据库密切相关，只能存在于connection之中，连接关闭后，PO就消失了。

PO相对于POJO有诸多不同，比如PO中会有保存数据库entity状态的属性和方法。但是ORM(object-relation mapping)追求的目标是PO和POJO的一致，所以在程序员的日常开发中，都是将POJO作为PO使用，而将POJO转化为PO的功能交给hibernate等框架来实现。

DTO(data transfer object):数据传输对象，以前被称为值对象(VO,value object)，作用仅在于在应用程序的各个子系统间传输数据，在表现层展示。与POJO对应一个数据库实体不同，DTO并不对应一个实体，可能仅存储实体的部分属性或加入符合传输需求的其他的属性。

DAO(data access object):数据访问对象。提供访问数据库的抽象接口，或者持久化机制，而不暴露数据库的内部详细信息。DAO提供从程序调用到持久层的匹配。

BO(business object):业务对象。主要是将业务逻辑封装为一个对象，该对象可以包含一个或多个其他对象。如，"Principal"(委托人)，有"Name","Age"等属性，同时和"Employee"(雇员)有1对多的关系，这个"Principal"就可以作为一个与业务相关的PO。

按照标准来说：
1、entity里的每一个字段，与数据库相对应，
2、VO里的每一个字段，是和你前台页面相对应，
3、DTO，这是用来转换从entity到dto，或者从dto到entity的中间的东西。

举个例子：

你的html页面上有三个字段，name，pass，age

你的数据库表里，有两个字段，name，pass(注意没有age哦)而你的dto里，就应该有下面三个(因为对应html页面上三个字段嘛)

private string name；

private string pass;

private string age;

这个时候，你的entity里，就应该有两个(因为对应数据库表中的2个字段嘛)

private string name；

private string pass;

到了这里，好了，业务经理让你做这样一个业务“年龄大于20的才能存入数据库”

这个时候，你就要用到VO了

你要先从页面上拿到VO，然后判断dto中的age是不是大于20，如果大于20，就把dto中的

name和pass拿出来，放到vo中，然后在把DTO中的name和pass原封不懂的给entity，然后根据

entity的值，在传入数据库，这就是他们三个的区别

PS:DTO和entity里面的字段应该是一样的，DTO只是entity到VO，或者VO到entity的中间过程，如果没有这个过程，你仍然可以做到增删改查。
————————————————
原文链接：https://blog.csdn.net/weixin_31967551/article/details/114091922