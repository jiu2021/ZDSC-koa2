const { context } = require("../app");

const { addrFormatError } = require('../constant/err.type');

const validator = (rules) => {
  return async(ctx, next) => {
    try {
      await ctx.verifyParams(rules);
    } catch (err) {
      console.error(err);
      addrFormatError.result = err;
      ctx.app.emit('error', addrFormatError, ctx);
    }
    await next();
  }
}


module.exports = {
  validator,
}