// Jwt 
const jwt = require("jsonwebtoken");

// auth middleware
const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.headers.token;
        if (!token) return next(new Error(" Token not provided"));
        const paload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = paload.id;
        socket.role = paload.role;
        next();
    } catch (error) {
         return next(new Error("Authentication error: Invalid token"));
    }
};


const socketChatController = (io) => {
    io.use(socketAuthMiddleware);
        io.on("connection", (socket)=> {
            console.log(`userId ${socket.userId}&Role is ${socket.role}`);

            if (socket.role === "admin"){
                socket.join("room_admin");

            }else if (socket.role === "user"){
                socket.join(`room_${socket.userId}`)
            }

        //si = user send promblem Admin
        socket.on("sendMsg",(date)=>{
            io.to("roomadmin").emit("reqMsg", {
                msg:date.msg,
                user: socket.userId
            });

            socket.on("responMsg",(data)=>{
                io.join(`room_${date.userId}`).emit("rewMsg",{
                      msg:date.msg,
                      admin: socket.admin
                });
            })
        })

       });
    };

module.exports = socketChatController;