const router = require('koa-router')()
const util = require('./util.js')
const config = require("../config.json")
const CLOUD_FUNCTION_NAME = 'upload'

router.get('/', async (ctx, next) => {

  await ctx.render('ueditor', {
    title: '量价突破监控'
  })

})


router.get("/ueditor/ue", async (ctx, next) => {
  var req = ctx.request
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    console.log("uploadimage")
    ctx.set('Content-Type', 'text/html')
    // res.setHeader('Content-Type', 'text/html');
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    ctx.set('Content-Type', 'application/json');
    ctx.redirect('/ueditor/nodejs/config.json');
  }
});

router.post("/ueditor/ue", async (ctx, next) => {
  let req = ctx.request

  let filetemppath = req.files.upfile.path;
  let originalname = req.files.upfile.name

  let ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    let res = await util.sendMultipart('images',filetemppath,originalname);

    let obj = {"url":res.resp_data,title:originalname,"original":originalname,"state":"SUCCESS"}
    ctx.body = obj
    ctx.set('Content-Type', 'text/html')
    // res.setHeader('Content-Type', 'text/html');
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {

    console.log(" post listimage")
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    ctx.set('Content-Type', 'application/json');
    ctx.redirect('/ueditor/nodejs/config.json');
  }
});

router.post("/savearticle", async (ctx, next) => {
  let req = ctx.request
  console.log(req.body)
  let res = await util.uploadArticle(req.body)
  ctx.body = res
});

router.post('/uploadThumb', async (ctx, next) => {
  let req = ctx.request
  let filetemppath = req.files.file.path;
  let originalname = req.files.file.name
  let res = await util.sendMultipart('thumbs',filetemppath,originalname);
  ctx.body = res.resp_data
})

router.get('/string', async (ctx, next) => {

  let req = ctx.request
  console.log(req.body)
  ctx.body = "save success"
})

router.get('/json', async (ctx, next) => {
  let json = JSON.parse('{ "name":"runoob", "alexa":10000, "site":"www.runoob.com" }');
  ctx.body = json
})

module.exports = router
