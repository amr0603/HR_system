require ("dotenv").config();
const express = require("express");
const app = express();

// create  node server
const http = require("http");
const appServer = http.createServer(app);

const morgan = require("morgan");
app.use(express.json());


if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
}
app.get("/", (req, res) => {
    res.json({message: "Hello World AMr"})
});

const connectedDB = require("./Config/db");
connectedDB();

const adminroute = require('./Routes/Admin.Route');
const userRoutes = require("./routes/user.route");
const userAuthRoutes = require("./routes/authUser.route");
const employroll = require("./Routes/employee.route")

app.use('/api/dashbord', adminroute);
app.use("/api/dashboard/users", userRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/employroll", employroll);

const {Server} = require("socket.io");
const io = new Server(appServer , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
}
);


require("./Sockets/Chat.Socket")(io);


const port = process.env.PORT || 8000;
appServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
