'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {//通过对象方法操作数据库
    enable: true,
    package: 'egg-sequelize'
  },
  jwt: {//通做鉴权的
    enable: true,
    package: 'egg-jwt'
  },
  redis: {//把token或者 说用户放在redis缓存中
    enable: true,
    package: 'egg-redis'
  }
};
