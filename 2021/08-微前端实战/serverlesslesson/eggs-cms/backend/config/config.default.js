/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1588425923655_2514';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    security: {
      csrf: false//关闭csrf的校验
    },
    sequelize: {
      dialect: "mysql",
      host: "localhost",
      port: "3306",
      database: "eggs-cms",
      username: "root",
      password: "5f8b8a5d650637f8"
    },
    redis: {
      client: {
        port: 6379,          // Redis port
        host: '127.0.0.1',   // Redis host
        password: 'auth',
        db: 0,
      },
    }

  };

  return {
    ...config,
    ...userConfig,
  };
};
