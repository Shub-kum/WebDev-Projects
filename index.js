const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");


app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.set("views engine","ejs");
// app.set("views", path.join(__dirname,"/views"));

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "./uploads")
    },
    filename:(req, file, cb)=>{
        const newfilename = Date.now() + path.extname(file.originalname) 
        cb(null, newfilename)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.fieldname === "userfile"){

if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
        cb(null, true)
    }
    else{
        cb(new Error("Only image are allowed!"), false)
    }

    }
    else if(file.fieldname === "userdocuments"){

if(file.mimetype == "application/pdf"){
        cb(null, true)
    }
    else{
        cb(new Error("Only pdf are allowed!"), false)
    }

    }
    else{
        cb(new Error("Unknown Field."), false)
    }
    
   
} 

const upload = multer({
    storage : storage,
    limites:{
        filesize : 1024 * 1024 * 3,
    },
    fileFilter : fileFilter
})

app.get("/",(req, res)=>{
res.render("myform.ejs");
});

// app.post("/submitform",upload.array("userfile",3),(req, res)=>{
// if(!req.file || req.files.length === 0){
//     return res.status(400).send("<h1>File Uploaded Only 3.</h1>")

// }
// res.send(req.files); 
// });

app.post("/submitform",upload.fields([
    {name : "userfile", maxCount : 1},
    {name : "userdocuments", maxCount : 3}
]),(req, res)=>{
if(!req.files || req.files.length === 0){
    return res.status(400).send("<h1>File Uploaded Only 3.</h1>")

}
res.send(req.files); 
});

app.use((error, req, res, next)=>{
    if(error instanceof multer.MulterError){
        if(error.code === "LIMIT_UNEXPECTED_FILE"){
            return res.status(400).send("Error : Too many files uploaded!.")
        }
        return res.status(400).send(`Multer Error: ${error.message} : ${error.code}`)
    }
    else if(error){
        return res.status(400).send(`<h1>Something went wrong! ${error.message}</h1>`)
    }
    next()
});

app.listen(3000,()=>{
    console.log("server is run");
})