const express=require("express");
const path=require("path"),fs=require("fs");
const Database=require("better-sqlite3"),bcrypt=require("bcryptjs"),multer=require("multer"),cookieSession=require("cookie-session");
require("dotenv").config?.();

const app=express(),PORT=process.env.PORT||3000;
const ROOT=__dirname,UPLOADS=path.join(ROOT,"uploads");
fs.mkdirSync(UPLOADS,{recursive:true});
const db=new Database(path.join(ROOT,"sir_mahee.db"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,email TEXT UNIQUE,password_hash TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS materials(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,class_name TEXT NOT NULL,subject TEXT NOT NULL,chapter TEXT,description TEXT,type TEXT,filename TEXT,stored_name TEXT,mime TEXT,size INTEGER,created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
const email=process.env.ADMIN_EMAIL||"admin@sirmahee.com",pass=process.env.ADMIN_PASSWORD||"change-this-password";
if(!db.prepare("SELECT id FROM users WHERE email=?").get(email)){
 db.prepare("INSERT INTO users(email,password_hash) VALUES(?,?)").run(email,bcrypt.hashSync(pass,12));
}
app.use(express.json());app.use(express.urlencoded({extended:true}));
app.use(cookieSession({name:"sir_mahee_session",keys:[process.env.SESSION_SECRET||"dev-only-change-me"],httpOnly:true,sameSite:"lax",secure:false,maxAge:1000*60*60*8}));
app.use("/uploads",express.static(UPLOADS));app.use(express.static(path.join(ROOT,"public")));

function auth(req,res,next){if(req.session?.userId)return next();res.status(401).json({error:"Login required"});}
const maxMB=Number(process.env.MAX_FILE_MB||200)*1024*1024;
const storage=multer.diskStorage({destination:UPLOADS,filename:(req,file,cb)=>cb(null,Date.now()+"-"+Math.random().toString(36).slice(2)+path.extname(file.originalname))});
const upload=multer({storage,limits:{fileSize:maxMB}});

app.post("/api/login",(req,res)=>{
 const u=db.prepare("SELECT * FROM users WHERE email=?").get(req.body.email||"");
 if(!u||!bcrypt.compareSync(req.body.password||"",u.password_hash))return res.status(401).json({error:"Invalid email or password"});
 req.session.userId=u.id;res.json({ok:true});
});
app.post("/api/logout",(req,res)=>{req.session=null;res.json({ok:true})});
app.get("/api/me",(req,res)=>res.json({loggedIn:!!req.session?.userId,email:req.session?.userEmail||null}));

app.get("/api/materials",(req,res)=>{
 const {className,subject,q}=req.query;let sql="SELECT * FROM materials WHERE 1=1",args=[];
 if(className){sql+=" AND class_name=?";args.push(className)}
 if(subject){sql+=" AND subject=?";args.push(subject)}
 if(q){sql+=" AND (title LIKE ? OR chapter LIKE ? OR description LIKE ?)";let z="%"+q+"%";args.push(z,z,z)}
 sql+=" ORDER BY id DESC";res.json(db.prepare(sql).all(...args));
});
app.post("/api/materials",auth,upload.single("file"),(req,res)=>{
 if(!req.file)return res.status(400).json({error:"File is required"});
 const b=req.body;
 const r=db.prepare(`INSERT INTO materials(title,class_name,subject,chapter,description,type,filename,stored_name,mime,size) VALUES(?,?,?,?,?,?,?,?,?,?)`)
 .run(b.title||req.file.originalname,b.className||"All Classes",b.subject||"Other",b.chapter||"",b.description||"",b.type||"Other",req.file.originalname,req.file.filename,req.file.mimetype,req.file.size);
 res.json({ok:true,id:r.lastInsertRowid});
});
app.delete("/api/materials/:id",auth,(req,res)=>{
 const m=db.prepare("SELECT * FROM materials WHERE id=?").get(req.params.id);if(!m)return res.status(404).json({error:"Not found"});
 try{fs.unlinkSync(path.join(UPLOADS,m.stored_name))}catch{}
 db.prepare("DELETE FROM materials WHERE id=?").run(req.params.id);res.json({ok:true});
});
app.get("/admin",(req,res)=>{
  res.sendFile(path.join(ROOT,"public","admin.html"));
});
app.get("*",(req,res)=>res.sendFile(path.join(ROOT,"public","index.html")));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Sir Mahee server running on port ${PORT}`);
});
