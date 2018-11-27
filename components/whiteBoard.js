import React from 'react';
import EventBus from '../eventBus';
import Store from '../store';
import Selection from './selection';
import { getShapeRect } from '../utils';
import openSocket from 'socket.io-client';

const serverUrl = 'http://127.0.0.1:3000'

export default class WhiteBoard extends React.Component {
	constructor() {
		super();

		Store.subscribe(() => {
			this.setState({ 
					data: Store.data 
				});
		});
		this.state = { data: Store.data, socket: '' };
		this.pressed = false;
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("mousemove", this.mouseMove.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));
		document.addEventListener("keydown", this.keyDown.bind(this));
		window.addEventListener("resize", this.onResize.bind(this));

		const socket = openSocket(serverUrl)
		this.setState({ data: Store.data, socket: socket });

		this.onResize();

		socket.on('apply_mouse_down', function(data){
			this.pressed = true;
			EventBus.emit(EventBus.START_PATH, data)
		})
		socket.on('apply_mouse_move', function(data){
			if (this.pressed) {
				EventBus.emit(EventBus.MOVE_PATH, data)
			}
		})
		socket.on('apply_mouse_up', function(data){
			this.pressed = false;
			EventBus.emit(EventBus.END_PATH, data)
		})
	};

	onResize() {
		this.rect = this._svg.getBoundingClientRect();
	}

	mousePos(e) {
		;
		let round = 2
		return {
			x: round * Math.round(e.clientX / round) - this.rect.left,
			y: round * Math.round(e.clientY / round) - this.rect.top
		};
	}

	_insideRect(rect, point) {
		return point.x > rect.left && point.x < rect.right
			&& point.y > rect.top && point.y < rect.bottom;
	}

	mouseDown(e) {
		if (this._insideRect(this.rect, { x: e.clientX, y: e.clientY })) {
			this.pressed = true;
			EventBus.emit(EventBus.START_PATH, this.mousePos(e))

			this.state.socket.emit('mouse_down', {pos: this.mousePos(e)})
		}
	}

	mouseMove(e) {
		if (this.pressed) {
			EventBus.emit(EventBus.MOVE_PATH, this.mousePos(e))

			this.state.socket.emit('mouse_move', {pos: this.mousePos(e)})
		}
	}

	mouseUp(e) {
		this.pressed = false;
		EventBus.emit(EventBus.END_PATH, this.mousePos(e))

		this.state.socket.emit('mouse_up', {pos: this.mousePos(e)})
	}

	keyDown(e) {
		if (e.which === 90 && e.ctrlKey) {
			EventBus.emit(EventBus.UNDO)
		}
		if (e.which === 89 && e.ctrlKey) {
			EventBus.emit(EventBus.REDO)
		}
	}
	onMove(shape){
		return move=>{
			EventBus.emit(EventBus.MOVE, {shape, move})
		}
	}

	render() {
		const data = this.state.data
		let selection = null
		const shapes = data.shapes.map((shape, i) => {
			if (shape.selected) {
				selection = <Selection rect={getShapeRect(shape)} move={this.onMove(shape)}/>
			}
			return <shape.class key={i} path={shape.path} color={shape.color} size={shape.size}/>
		});
		let current = null;
		if (data.mouseTracker && data.mouseTracker.class) {
			current = <data.mouseTracker.class color={data.mouseTracker.color} path={data.mouseTracker.path} size={data.mouseTracker.size} />
		}

		return (
			<svg
				id="whiteBoard"
				width={this.props.width}
				height={this.props.height}
				ref={(canvas) => this._svg = canvas}
			>
				{shapes}
				{current}
				{selection}
			</svg>
		)
	}
}
