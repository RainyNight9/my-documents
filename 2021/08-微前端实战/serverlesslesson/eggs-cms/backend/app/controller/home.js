'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async login() {
    console.log('/api/login/account');

    const { ctx, app } = this;
    let { userName, password } = ctx.request.body;
    const users = await ctx.model.User.findAll({
      where: { userName, password },
      limit: 1
    });
    if (users.length > 0) {
      let user = users[0];
      ctx.status = 200;
      const token = app.jwt.sign({
        id: user.id,
        userName: user.userName
      }, app.config.jwt.secret, {
        expiresIn: '1h'
      });
      //await app.redis.set(`token_${user.id}`, token);
      ctx.body = {
        status: 'ok',
        type: 'account',
        currentAuthority: 'admin',
        token
      }
    } else {
      ctx.body = {
        status: 'error'
      }
    }
  }
  async currentUser() {
    const { ctx } = this;
    const { user } = ctx.state;
    console.log('user', user);

    this.ctx.body = {
      name: user.userName,
      userid: user.id,
      avatar: `http://img.zhufengpeixun.cn/tuizi.jpg`
    }
  }
}

module.exports = HomeController;
