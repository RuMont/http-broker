import MessageController from "./src/controllers/MessageController";
import Server from "./src/server";
import MessageService from "./src/services/MessageService";

try {
    Server
        .createInstance({ port: 3000 })
        .injectServices([
          new MessageService()
        ])
        .loadControllers([
          new MessageController(),
        ])
        .listen();
} catch (err) {
    console.log(err);
    process.exit(1);
}

process.on("uncaughtException", err => {
    console.log("uncaughtException", err);
    process.exit(1);
})