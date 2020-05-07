const router = require('koa-router')()
//const db = require('../crud')

router.prefix('/users')

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

router.get('/', async (ctx, next) => {
  ctx.body = 'hello world';
  /*
  await ctx.render('show', {
    title: '量价突破数据库系统'
  })

  */
})

/*
router.get('/get24hour', async (ctx, next) => {
  let res = await db.get24hour(24);
  ctx.body = res;
})
*/
module.exports = router
