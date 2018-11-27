import React from 'react';
import EventBus from '../eventBus';
import ToolStore, { COLOR_PICKER, PEN_SIZE_PICKER, POINTER, PEN, LINE, ELLIPSE, RECT, ERASER } from '../toolStore';
import ColorPicker from './colorPicker';
import PenSizePicker from './penSizePicker';
import socket from '../customSocket';

export default class Tools extends React.Component {
	constructor() {
		super();
		this.state = {
			tools: [
				{ id: POINTER, label: '../images/select.png', type: 'cursor' },
				{ id: COLOR_PICKER, label: '../images/color.png', type: 'color-picker'},
				{ id: PEN, label: '../images/pen.png', type: 'pen', selected: true },
				{ id: ERASER, label: '../images/eraser.png', type: 'eraser' },
				{ id: LINE, label: '../images/line.png', type: 'line' },
				{ id: RECT, label: '../images/rect.png', type: 'rect' },
				{ id: ELLIPSE, label: '../images/el.png', type: 'ellipse' }
			],
			showColorPicker: false,
			showPenSizePicker: false
		};
		ToolStore.subscribe(() => {
			const tools = this.state.tools.map(tool => ({ ...tool, selected: ToolStore.tool === tool.id }))
			this.setState({ tools })
		})
	}

	componentDidMount() {
		const toolList = this.state.tools
		socket.on('apply_tool_change', function(data){
			EventBus.emit(EventBus.TOOL_CHANGE, toolList[data.index].id);
		})
	};

	handleClick(index) {
		return function () {
			if (this.state.tools[index].id == 'ColorPicker')
				this.state.showColorPicker = !this.state.showColorPicker
			else this.state.showColorPicker = false
			
			if (this.state.tools[index].id == 'Pen')
				this.state.showPenSizePicker = !this.state.showPenSizePicker
			else this.state.showPenSizePicker = false
			
			EventBus.emit(EventBus.TOOL_CHANGE, this.state.tools[index].id);
			socket.emit('tool_change', {index: index})
		}
	}

	render() {
		const tools = this.state.tools.map((tool, i) => 
			<div
				key={i}
				onClick={this.handleClick(i).bind(this)}
				className={tool.selected ? 'selected' : ''}
			><img src={tool.label}/>
			</div>)
		return (
			<div id="tools">
				{tools}
				{this.state.showColorPicker && <ColorPicker/>}
				{this.state.showPenSizePicker && <PenSizePicker/>}
			</div>);
	}
}

