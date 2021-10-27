class AppHooks {
    constructor(app) {
        this.app = app;
    }
    async willReady() {
        // await this.app.model.sync({ force: true });
    }
}
module.exports = AppHooks;