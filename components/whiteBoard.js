import React from 'react';
import EventBus from '../eventBus';
import Store from '../store';
import Selection from './selection';
import { getShapeRect } from '../utils';
import socket from '../customSocket';

export default class WhiteBoard extends React.Component {
	constructor() {
		super();

		Store.subscribe(() => {
			this.setState({ 
					data: Store.data 
				});
		});
		this.state = { data: Store.data };
		this._id = '';
		this.pressed = false;
	}

	componentDidMount() {
		document.addEventListener("touchstart", this.mouseDown.bind(this));
		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("touchmove", this.mouseMove.bind(this));
		document.addEventListener("mousemove", this.mouseMove.bind(this));
		document.addEventListener("touchend", this.mouseUp.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));
		document.addEventListener("keydown", this.keyDown.bind(this));
		window.addEventListener("resize", this.onResize.bind(this));
		
		this.setState({ data: Store.data });

		this.onResize();

		socket.on('client_connected', (data) => {
			this._id = data.id;
		})
		socket.on('apply_mouse_down', (data) => {
			if (data.id != this._id) {
				console.log(data.id)
				this.pressed = true;
				EventBus.emit(EventBus.START_PATH, data.pos)
			}
		})
		socket.on('apply_mouse_move', (data) => {
			if (data.id != this._id) {
				if (this.pressed) {
					EventBus.emit(EventBus.MOVE_PATH, data.pos)
				}
			}
		})
		socket.on('apply_mouse_up', (data) => {
			if (data.id != this._id) {
				this.pressed = false;
				EventBus.emit(EventBus.END_PATH, data.pos)
			}
		})
		socket.on('apply_shape_move', function(data){
			const selectedShape = data.shape
			const selectedMove = data.move
			EventBus.emit(EventBus.MOVE, {shape: selectedShape, move: selectedMove})
		})
		socket.on('apply_undo', function(msg){
			EventBus.emit(EventBus.UNDO)
		})
		socket.on('apply_redo', function(msg){
			EventBus.emit(EventBus.REDO)
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
		this.pressed = true;
		EventBus.emit(EventBus.START_PATH, this.mousePos(e))
		socket.emit('mouse_down', {id: this._id, rect: this.rect, pos: this.mousePos(e)})
	}

	mouseMove(e) {
		if (this.pressed) {
			EventBus.emit(EventBus.MOVE_PATH, this.mousePos(e))
		}
		socket.emit('mouse_move', {id: this._id, rect: this.rect, pos: this.mousePos(e)})
	}

	mouseUp(e) {
		this.pressed = false;
		EventBus.emit(EventBus.END_PATH, this.mousePos(e))
		socket.emit('mouse_up', {id: this._id, pos: this.mousePos(e)})
	}

	keyDown(e) {
		if (e.which === 90 && e.ctrlKey) {
			socket.emit('undo', {msg: "Undo"})
		}
		if (e.which === 89 && e.ctrlKey) {
			socket.emit('redo', {msg: "Redo"})
		}
	}
	onMove(shape){
		return move=>{
			EventBus.emit(EventBus.MOVE, {shape, move})

			socket.emit('shape_move', {shape: shape, move: move})
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
