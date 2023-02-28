import io from "socket.io-client";
import { BASE_URL } from "../../APIs/apiRequests";

export const socket = io(BASE_URL);
