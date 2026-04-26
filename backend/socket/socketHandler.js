export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => userId && socket.join(`user:${userId}`));
    socket.on("join:owner", (isOwner) => isOwner && socket.join("owners"));
  });
};
