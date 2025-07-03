const mongoose=require("mongoose");

function connection() {
    mongoose.connect("mongodb://localhost:27017/chat_app_data").then((res) => {
        console.log("Your database successfully connected: "+res.connection.host);
    }).catch((err) => {
        console.log("There is some error: " + err);
    });
}

module.exports=connection