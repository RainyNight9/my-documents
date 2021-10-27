'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/', controller.home.index);

  router.post('/api/login/account', controller.home.login);
  router.get('/api/currentUser', jwt, controller.home.currentUser);
};
