import openSocket from 'socket.io-client';

const port = process.env.PORT || 3000;

const serverUrl = 'https://onlinewhiteboardthesis.herokuapp.com:' + port

// const serverUrl = 'http://localhost:3000'

const socket = openSocket(serverUrl)

export default socket;