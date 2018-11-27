import openSocket from 'socket.io-client';

const serverUrl = 'http://127.0.0.1:3000'

const socket = openSocket(serverUrl)

export default socket;