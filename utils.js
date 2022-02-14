import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient,
    MongoURL=process.env.MongoURL ,
    dbName = "catch_a_ride";

function registration(req,res) {
    const newUser = req.body;
    newUser.Driving = [];
    newUser.Hitchhiking = [];
    newUser.Chat = [];
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").insertOne(newUser).then((doc)=>{
            newUser.id = doc.insertedId
            res.send(newUser).status(201)
        })
    })
    .catch((err)=>{throw err})
}

function login(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOne(req.body).then((doc)=>{
            res.send(doc).status(201)
        })
    })
    .catch((err)=>{throw err})
}


function getUser(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").find({_id:mongodb.ObjectId(req.params.id)}).toArray().then((doc)=>{
            res.send(doc).status(200)
        })
    })
    .catch((err)=>{throw err}) 
}

function add_a_ride(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("hitchhiking").insertOne(req.body).then((doc)=>{
            res.send(doc).status(201)
        })
    })
    .catch((err)=>{throw err}) 
}

function addUserRide(req,res) {
    const item = req.body.id
    console.log(item);
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},
        {$push:{Driving:req.body}}).then((doc)=>{
            res.send(doc).status(201)
        })
    })
    .catch((err)=>{throw err}) 
}

function sendMessage(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOne({ _id :  mongodb.ObjectId(req.params.id)}).then((doc)=>{
            doc.Chat.map((item)=>{
                if (req.body.id == item.id) { 
                    item.conversation.push(req.body)
                }
            })

            db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},{$set:doc}).then((doc)=>{})
        })

        let index;
        db.db(dbName).collection("users").findOne({ _id :  mongodb.ObjectId(req.body.id)}).then((user)=>{
            user.Chat.map((item,i)=>{
                if (req.params.id == item.id) {
                    item.conversation.push(req.body)
                    index=item;
                }
            })
            db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.body.id)},{$set:user}).then((doc)=>{
                
                res.send(index).status(201)
            })
        })
             
        })
    .catch((err)=>{throw err}) 
}

function getHitchhiking(req,res) {
    const searchRide ={
            pointStart:req.body.pointStart,
            pointEnd:req.body.pointEnd,
            day:req.body.day
    }
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("hitchhiking").find(searchRide).toArray().then((docs)=>{
            const newArray= docs.filter((item)=>{
                if (item.seats && item.seats > item.pick_up_people.length && item.time >= req.body.time ) {
                    return item
                }
            })
            res.send(newArray).status(200)
        })
    })
    .catch((err)=>{throw err}) 
}

function deleteRide(req,res) {

    MongoClient.connect(MongoURL).then((db)=>{

        db.db(dbName).collection("hitchhiking").deleteOne({ _id :  mongodb.ObjectId(req.params.id)}).then(()=>{
            res.send("deleted from hitchhiking").status(200)
        })
    })
    .catch((err)=>{throw err})
}

function deleteRideFromUsers(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{

       db.db(dbName).collection("users").findOneAndUpdate({_id: mongodb.ObjectId(req.params.id)},{$pull:{Driving:{id:req.body.id}}}).then(()=>{
          if (!req.body.pick_up_people.length) {
              res.send("deleted from users").status(200)
          }
       })
        db.db(dbName).collection("users").updateMany({},{$pull:{Hitchhiking:{id:req.body.id}}}).then(()=>{
            res.send("deleted from users").status(200)
        })
   })
   .catch((err)=>{throw err})
}

function updateUserDetails(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},{$set:req.body}).then(()=>{
            res.send("deleted from users").status(200)
        })
    })
    .catch((err)=>{throw err})
}

function addHitchhiker(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOne({ _id :  mongodb.ObjectId(req.body.driverId)})
        .then((user)=>{
            const hitchhiker = {
                name:req.body.name,
                phone:req.body.phone,
                hitchhikerId:req.params.id
            }
            user.Driving.map((item)=>{
                if (item.id == req.body.id) {
                    item.pick_up_people.push(hitchhiker)
                }
            })

            db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.body.driverId)},
            {$set:{Driving:user.Driving}}).then(()=>{
            })
            db.db(dbName).collection("hitchhiking").findOneAndUpdate({ _id :  mongodb.ObjectId(req.body.id)},
            {$push:{pick_up_people:hitchhiker}}).then(()=>{
            })

            let chack=false;
            user.Chat.map((item)=>{
                if (item.id ==req.params.id) {
                    chack=true;
                }
            })
            if(!chack){
                db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.body.driverId)},
                {$push:{Chat:{id:req.params.id,name:req.body.name,conversation:[]}}}).then(()=>{
                })
                db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},
                {$push:{Chat:{id:req.body.driverId,name:user.name,conversation:[]}}}).then(()=>{
                })
            }

            db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},
            {$push:{Hitchhiking:req.body}}).then(()=>{
            res.send("update from users").status(200)
            })
        })
    })
    .catch((err)=>{throw err})
}

function userHitchhiking(req,res) {
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("users").findOne({ _id :  mongodb.ObjectId(req.params.id)}).then((doc)=>{
            res.send(doc).status(200)
        })
    })
    .catch((err)=>{throw err})
}
function deleteHitchhiker(req,res) { 
    MongoClient.connect(MongoURL).then((db)=>{
        db.db(dbName).collection("hitchhiking")
        .findOneAndUpdate({ _id :  mongodb.ObjectId(req.body.id)},{$pull:{pick_up_people:{hitchhikerId: String(req.params.id)}}})
        .then(()=>{})
        .catch((err)=>{throw err})

        db.db(dbName).collection("users").findOne({ _id :  mongodb.ObjectId(req.body.driverId)}).then((doc)=>{
           doc.Driving.map((ride)=>{
               if(req.body.id == ride.id){
                   ride.pick_up_people.map((hitchhiker,j)=>{
                       if(hitchhiker.hitchhikerId == req.params.id){
                           ride.pick_up_people.splice(j,1)
                           return;
                       }
                       })
               }
           }) 
           db.db(dbName).collection("users").findOneAndUpdate({_id: mongodb.ObjectId(req.body.driverId)},{$set:doc}).then(()=>{
           })
           .catch((err)=>{throw err})
        })
        .catch((err)=>{throw err})

        db.db(dbName).collection("users").findOneAndUpdate({ _id :  mongodb.ObjectId(req.params.id)},{$pull:{Hitchhiking:{id: String(req.body.id)}}}).then((doc)=>{
            res.send("deleted from users").status(200)
        })
        .catch((err)=>{throw err})

    })
    .catch((err)=>{throw err})

}

export {
    registration, 
    login, 
    add_a_ride, 
    addUserRide, 
    getHitchhiking , 
    deleteRide, 
    deleteRideFromUsers, 
    updateUserDetails,
    addHitchhiker,
    userHitchhiking,
    deleteHitchhiker,
    getUser,
    sendMessage
}