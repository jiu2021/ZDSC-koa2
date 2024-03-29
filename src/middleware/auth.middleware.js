const jwt = require('jsonwebtoken');
const app = require('../app');

// @ts-ignore
const { JWT_SECRET } = require('../config/config.default');
const { tokenExpireError, invalidToken, hasNotAdminPermission } = require('../constant/err.type');

const auth = async(ctx, next) => {
  const { authorization = '' } = ctx.request.header;
  const token = authorization.replace('Bearer ', '');

  try {
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user;
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        {
          console.error('token已过期', err);
          return ctx.app.emit('error', tokenExpireError, ctx);
        }
      case 'JsonWebTokenError':
        {
          console.error('无效的token', err);
          return ctx.app.emit('error', invalidToken, ctx);
        }
    }
  }

  await next();
}

const hadAdminPermission = async(ctx, next) => {
  const { is_admin } = ctx.state.user._doc;
  if (!is_admin) {
    console.error('该用户没有管理员权限', ctx.state.user._doc);
    return ctx.app.emit('error', hasNotAdminPermission, ctx);
  }

  await next();
}



module.exports = {
  auth,
  hadAdminPermission
}