// 应用程序启动入口
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var swig = require('swig')
var Cookies = require('cookies');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User');
var port = 3000 || '';
var app = express();
app.engine('html', swig.renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// 加载bodyParser解析post过来的数据
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户的类型，是否为管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                console.log(userInfo);
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
            });
        } catch (e){
            console.log(e);
        }
    } else {

    }
    next();
});

//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use( '/public', express.static( __dirname + '/public') );

/*
 * 根据不同的功能划分模块
 * */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 加载数据库

app.use(function(req, res, next) {
  next(createError(404));
});
mongoose.connect('mongodb://localhost:27017/demobolg',function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('数据库连接成功');
        app.listen(port);
        console.log('success listen port ' + port);
    }

})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
<!--第一个-->
