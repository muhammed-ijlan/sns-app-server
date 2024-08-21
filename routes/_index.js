module.exports = (app) => {
    app.use("/", require("./welcomeRouter"));
    app.use("/auth", require("./authRouter"));
    app.use("/user", require("./userRouter"));
};
