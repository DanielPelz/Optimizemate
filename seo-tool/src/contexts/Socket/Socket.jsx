import { io } from "socket.io-client";

const URL = process.env.REACT_APP_API_BASE_URL;
const socket = io(URL, { autoConnect: false });

export default socket;