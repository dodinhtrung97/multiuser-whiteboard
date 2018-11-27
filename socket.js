import openSocket from 'socket.io-client';

const serverUrl = 'http://127.0.0.1:3000'

class Socket{
	constructor(){
		this.socket = openSocket(serverUrl);
	}
}

export default new Socket();