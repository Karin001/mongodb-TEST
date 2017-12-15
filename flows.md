## 第一步（准备）：打开本地数据库，并放一些数据进去
- 1  **启动本地数据库**  
    $ mongod --dbpath=< your local database path >  
    若提示设置engine，则重新输入  
    $ mongod --dbpath=< your local database path > --storageEngine="mmapv1"

- 2 **不关闭终端，重新开启一个终端**  
    $ mongo  
    $ show dbs    //查看本地有哪些数据库  
    $ use hero    //使用名为hero的数据库（此时并没有hero数据库）  
    $ db.tophero.save({       //在hero中的tophero集合中存入你想要存储的文档Object （此时并没有tophero集合）
        name: "zhangsan"
        }) 
    
    到这时为止，才创建了我们想要创建的 hero->tophero->object （数据库->集合->文档）
    mongodb在存入数据时会自动生成数据库、集合、文档，省去了我们为不同环境配置环境参数

- 3 **更新数据**  
    $ db.tophero.update(      //更新name:为"zhangsan"的文档的内容
        {name: "zhangsan"},  //选择匹配条件,mongo会查找符合该条件的文档
        { name: "ryu", skill: "hadoken"}   //用新的内容进行替换
        ) 
    update还有其他更新方法，如push等。
## 第二步：mongoose连接接数据库
- 1 const mongoose = require('mongoose');
    const dbURI = 'mongodb://localhost/hero'
    mongoose.connect(dbURI, {
        useMongoClient:true
    });
    mongoose.connection.on('connected',()=>{
        console.log('monngose connected')
    })
    连接成功时打印'monngose connected'

 ## 第三步：建立一个model，对应真实数据库的collection
1） 定义一个Schema，Schema定义了文档的属性
    const topHeroSchema = new mongoose.Schema({
        name: {             
            type: String,
            required: true  //required为true 表示该属性必须存在
            },
        skill: {
            type: String
            }   
        });    

2)  用已定义的Schema定义一个model，映射真实数据库的collection
    mongoose.model('topHero', topHeroSchema，'topHero'); 
    //mongoose.model(<modelname>, <Schema>, <collectionname>);
    注意：<collectionname>缺省值为<modelname>的小写复数形式，本例中若不填此参数，则collectionname对应为topheros

## 第四步：用mongoose的model对真实数据库进行增删改查
1） 引用model
    const topH = mongoose.model('topHero');
2） 向数据库增加数据(创建一个新文档或删除一个文档都不用调用document.save命令保存，更新一个文档，创建子文档，更     新子文档，删除子文档，需要调用save命令)
    topH.create(     
    {
        name:"3221", 
        age:"23"
    },
    (err, data)=>{
        if(err) {
            console.log(err);
        } else {
            console.log(data);
        }
        
    }); 
    // model.create(<object>, callback)
    只有在对应Schema验证通过后，object才会被作为文档保存到model对应的集合中。
    当object内有Schema没有定义的属性时，则该属性不会被保存
    当object没有通过验证时，如object中没有"name"，则会触发name的require：true的验证错误
    topH.findById(<id>)
    .exec((err, hero) =>{
        dosomthing with the returned document hero
        hero.save((err) =>{
            do something in callback 
        }) 
    })

3)  从数据库查找数据：find
    topH.find()
    .exec((err, hero) => {
        if(err) {
            console.log(err)
        } else {
            console.log(JSON.stringify(hero));
        }
    });
    //find()读取了集合中的所有文档
   
    topH.find({name:"路飞"})
    .exec((err, hero) => {
        if(err) {
            console.log(err)
        } else {
            console.log(JSON.stringify(hero));
        }
    });
    //find({name:"路飞"})读取了name="路飞"的文档

    topH.find()
    .select('name')
    .exec((err, hero) => {
        if(err) {
            console.log(err)
        } else {
            console.log(JSON.stringify(hero));
        }
    });
    //.select('name') 只会抓取文档中的name属性

4)  从数据库删除：delete 
    删除整个文档
    topH.findByIdAndRemove(<id>)
    .exec((err, hero) => {
        删除完成后进入回调，可以对错误和文档做一些处理
    })

    只想删除文档中的某些数据时无法实现的，但可以删除文档的子文档，hero.id(<子文档的ID>).remove();
    