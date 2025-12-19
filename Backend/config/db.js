const mongoose=require("mongoose");

function connection() {
    mongoose.connect("mongodb+srv://23ithar032:scrRs8p8Dqh8kgUl@mymongo.3lqj4.mongodb.net/Live_chat").then((res) => {
        console.log("Your database successfully connected: "+res.connection.host);
    }).catch((err) => {
        console.log("There is some error: " + err);
    });
}

module.exports=connection