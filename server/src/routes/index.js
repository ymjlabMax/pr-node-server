const express = require("express");
const router = express.Router();

const user = require("./user");

if (process.env.NODE_ENV !== "production") {
    const morgan = require("morgan");
    router.use(morgan("dev"));
}

router.use("/user", user);

module.exports = router;
