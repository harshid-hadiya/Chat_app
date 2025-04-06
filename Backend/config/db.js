const mongoose=require("mongoose");

function connection() {
    mongoose.connect(process.env.CONNECTION_STRING).then((res) => {
        console.log("Your database successfully connected: "+res.connection.host);
    }).catch((err) => {
        console.log("There is some error: " + err);
    });
}

module.exports=connection