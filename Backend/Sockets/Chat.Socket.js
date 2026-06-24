// Jwt
const jwt = require("jsonwebtoken");

// auth middleware
const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.headers.token;
    if (!token) return next(new Error("Token not provided"));

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = payload.id;
    socket.role = payload.role;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

const socketChatController = (io) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`userId ${socket.userId} & Role is ${socket.role}`);

    // role بتاع الأدمن دايمًا "admin" (من admin.controller.js)
    // أي role تاني (Employee/HR) معناه موظف عادي
    if (socket.role === "admin") {
      socket.join("room_admin");
    } else {
      socket.join(`room_${socket.userId}`);
    }

    // الموظف يبعت مشكلة/استفسار للأدمن
    socket.on("sendMsg", (data) => {
      io.to("room_admin").emit("reqMsg", {
        msg: data.msg,
        user: socket.userId,
      });
    });

    // الأدمن يرد على موظف معيّن
    // مسجّلة هنا مرة واحدة فقط لكل اتصال، مش جوه sendMsg
    socket.on("responMsg", (data) => {
      // data لازم تحتوي على userId بتاع الموظف المستهدف بالرد
      if (!data || !data.userId) return;

      io.to(`room_${data.userId}`).emit("rewMsg", {
        msg: data.msg,
        admin: socket.userId,
      });
    });
  });
};

module.exports = socketChatController;