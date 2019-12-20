var express = require("express");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var image = require("imageinfo");
var child_process=require("child_process")

var downUrl='';

const listenNumber = 80;

var app = express();

app.use(express.static('upload'));
app.use(express.static('result'))

app.post("/upload", (req, res) => {
    var form = new formidable.IncomingForm();//既处理表单，又处理文件上传
    //设置文件上传文件夹/路径，__dirname是一个常量，为当前路径
    let uploadDir = path.join(__dirname, "./upload/");
    form.uploadDir = uploadDir;//本地文件夹目录路径
    form.keepExtensions = false;//上传文件保持原有扩展名

    form.parse(req, (err, fields, files) => {
        let oldPath = files.picture.path;//这里的路径是图片的本地路径
        //console.log(files.picture.name);//图片传过来的名字
        let newPath = path.join(path.dirname(oldPath), files.picture.name);
        //这里我传回一个下载此图片的Url
        downUrl = "/result/" + files.picture.name;//这里是想传回图片的链接
        fs.rename(oldPath, newPath, () => {//fs.rename重命名图片名称
            res.json({ downUrl: downUrl });
        });
    });

    //对上传图片的处理
    child_process.exec('sh /home/ubuntu/wechat/exec.sh',function(err,stdout,stderr){
        if(err){
            console.log(err);
        }
    });

    return;
});
//当小程序请求下载图片时的操作
app.get('/result',function(req,res){
    res.sendFile('/home/ubuntu/wechat'+downUrl);
});

app.listen(listenNumber);