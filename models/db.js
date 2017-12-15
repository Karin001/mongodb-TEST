require('./tophero');
const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/hero';
mongoose.connect(dbURI, {
    useMongoClient:true
});
mongoose.connection.on('connected',()=>{
    console.log('monngose connected')
})
const topH = mongoose.model('topHero');

topH.find()
    
    .exec((err, hero) => {
        if(err) {
            console.log(err)
        } else {
            console.log(JSON.stringify(hero));
        }
    });
topH.findById('5a124d79fb72cd1d6c6c8810')
    .exec((err, hero) => {
        hero.skill="八百烦恼风";
        
        hero.save((err)=>{if(err){console.log(err)}});
        console.log(hero);
    })
// mongoose.connection.close((err) => {
//     console.log('connection close');
// });
// topH.create(
//     {
//         name:"索隆", 
//         skill:"三刀流三千世界",
//         age: "23"
//     },
//     (err, data)=>{
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(data);
//         }
        
//     });
