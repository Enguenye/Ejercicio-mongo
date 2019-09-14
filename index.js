const MongoClient = require("mongodb").MongoClient;
const express = require("express");
var app=express();
var conn = MongoClient.connect("mongodb://localhost:27017",
    {useNewUrlParser: true, useUnifiedTopology: true});
function getStudents(callback){
conn.then(client =>{
    client.db("poblaciones").collection("countries").find().toArray((err,data)=>{
        callback(data);
    })
})
}


    function getStudent(callback,nombre){
    conn.then(client =>{
        client.db("poblaciones").collection("countries").find({country:nombre}).toArray((err,data)=>{
            callback(data)
        })
    })
    }

    function removeStudent(callback,nombre){
        conn.then(client =>{
            client.db("poblaciones").collection("countries").deleteOne({country:nombre},(err,data)=>{
                callback(data)
            })
        })
        }

      function postStudent(callback,info){
            conn.then(client =>{
                client.db("poblaciones").collection("countries").insertOne(JSON.parse(info),(err,data)=>{
                    callback(data);
                })
            })
            }

            function putStudent(callback,nombre,info){
                conn.then(client =>{
                    var resp = JSON.parse(info);
                    client.db("poblaciones").collection("countries").updateOne({country:nombre},{$set:{population:resp.population, country:resp.country, continent:resp.continent, lifeExpectancy:resp.lifeExpectancy, purchasingPower:resp.purchasingPower}},(err,data)=>{
                        callback(data)
                    })
                })
                }

app.get("/countries",(req,res)=>{
    getStudents((data)=>{
        res.json(data);
    })
})

app.get("/countries/:id",(req,res)=>{
    getStudent((data)=>{
        res.json(data);
    },req.params.id)
})

app.post("/countries",(req,res)=>{
    req.on('data', chunk => {
        let body = '';
        body += chunk.toString(); // convert Buffer to string
        postStudent((data)=>{
            res.json(data);
        },body)
    });
    
})

app.put("/countries/:id",(req,res)=>{
    req.on('data', chunk => {
        let body = '';
        body += chunk.toString(); // convert Buffer to string
        putStudent((data)=>{
            res.json(data);
        },req.params.id,body)
    });
})

app.delete("/countries/:id",(req,res)=>{
    removeStudent((data)=>{
        res.json(data);
    },req.params.id)
})

app.listen(8080);