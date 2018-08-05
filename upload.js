const express =require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const multer = require('multer'); 

//创建一个 Express 应用
var app=express();

// 解析json格式数据
app.use(bodyParser.json());
// 解析表单数据
app.use(bodyParser.urlencoded({extended:true}));
// 解析multipart/form-data 类型的表单数据，它主要用于上传文件
// app.use(bodyParser.multer()); 
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// app.get('/', function (req, res) {
//  res.sendFile(__dirname+'/form.html');
// })

// 创建文件夹方法
var createFolder=function(folder) {
  try{
    fs.accessSync(folder);
  }catch(e) {
    fs.mkdirSync(folder);
  }
}
//文件上传路径
var uploadFolder='./upload/';
createFolder(uploadFolder);
// 文件配置磁盘存储
var storage=multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload=multer({ storage:storage})
//上传单个文件
app.post('/singleUpload',upload.single('img'),function(req,res) {
  console.log(req.body);
  res.send('{"respCode":"01"}')
})
// 上传单个或多个文件
app.post('/upload',upload.array('files'),function(req,res) {
  console.log(req.files[0],req.body)  // 打印file日志和请求体body
  if(req.files[0]){
    res.send('{"respCode":"01"}');
  }else{
    res.send('{"respCode":"00"}');
  }
})
app.listen(3000);
console.log('监听3000端口');