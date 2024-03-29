const jwt = require('jsonwebtoken');
const { creatUser, getUserInfo, updateById } = require('../service/user.service');
const { userRegisterError, userLoginError, updatePasswordError } = require('../constant/err.type');
// @ts-ignore
const { JWT_SECRET } = require('../config/config.default');
class UserController {
  async register(ctx, next) {
    const { user_name, password } = ctx.request.body;
    try {
      const res = await creatUser(user_name, password);
      console.log(res);
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          user_name: res.user_name,
          id: res._id
        }
      };
    } catch (err) {
      console.error('用户注册失败', err);
      ctx.app.emit('error', userRegisterError, ctx);
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body;
    ctx.body = `欢迎回来，${user_name}！`;
    //获取用户信息
    try {
      //剔除密码信息
      // @ts-ignore
      const { password, ...res } = await getUserInfo({ user_name });
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登录失败', err);
      ctx.app.emit('error', userLoginError, ctx);
    }
  }

  async changePassword(ctx, next) {
    //获取数据
    const id = ctx.state.user._doc._id;
    const user_name = ctx.state.user._doc.user_name;
    const password = ctx.request.body.password;
    //修改密码
    try {
      // @ts-ignore
      const res = await updateById({ id, user_name, password });
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: '',
      }
    } catch (err) {
      console.error('修改密码失败', err);
      ctx.app.emit('error', updatePasswordError, ctx);
    }

    await next();
  }
}

module.exports = new UserController();