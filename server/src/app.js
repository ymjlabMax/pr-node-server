require("dotenv").config({ path: __dirname + "/config/.env" });

const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const routes = require("./routes"); /** router  모듈 사용  */
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PreInterceptor = require("./middleware/PreInterceptor");
const PostInterceptor = require("./middleware/PostInterceptor");

const HTTPS_PORT = process.env.HTTPS_PORT;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({}));

/**
 *
 * cross-origin 설정
 *
 */
app.use(
    cors({
        origin: [`${CLIENT_DOMAIN}`],
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "DELETE", "PATCH"],
    })
);
/** 전처리 interceptor */
app.use(PreInterceptor);

/** 후처리 interceptor */
app.use(PostInterceptor);

app.use(routes);

let server;

/**
 * 로컬환경에서 SSL 설정
 */
if (fs.existsSync("src/key.pem") && fs.existsSync("src/cert.pem")) {
    const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf-8");
    const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf-8");
    const credentials = { key: privateKey, cert: certificate };

    server = https.createServer(credentials, app);
    server.listen(HTTPS_PORT, () => {
        console.log(`HTTPS SERVER LISTENING ON ${SERVER_DOMAIN}${HTTPS_PORT}`);
    });
} else {
    server = app.listen(HTTPS_PORT, () => {
        let host = server.address().address;

        console.log("host", host);

        console.log("현재 HTTP로 서버가 실행 중입니다. 보안에 유의하세요.");
    });
}

console.log(server.address().port);

console.log("host");

module.exports = server;
