// const mongoose =require('mongoose')
// const url ="mongodb+srv://userb:userbpassword@cluster0.7qdbv1x.mongodb.net/?retryWrites=true&w=majority"
// mongoose.connect(url)
// const db=mongoose.connection;
 let db='start'

// db.on('error',(error)=>{
//     console.log(error)
// })
// db.once('open',()=>{
//     console.log('connect to db')
// })

module.exports=db;