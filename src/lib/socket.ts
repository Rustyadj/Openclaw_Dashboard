import { io } from "socket.io-client";

// In our environment, the backend and frontend are on the same port (3000)
const socket = io();

export default socket;
