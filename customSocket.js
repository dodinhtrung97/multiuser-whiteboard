import openSocket from 'socket.io-client';

const port = process.env.PORT || 3000;

const serverUrl = 'https://whiteboard-server.herokuapp.com'

// const serverUrl = 'http://localhost:3000'

const socket = openSocket(serverUrl)

export default socket;