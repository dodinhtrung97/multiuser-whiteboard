import openSocket from 'socket.io-client';

const serverUrl = 'https://onlinewhiteboardthesis.herokuapp.com:3000'

const socket = openSocket(serverUrl)

export default socket;