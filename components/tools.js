import React from 'react';
import EventBus from '../eventBus';
import ToolStore, { COLOR_PICKER, POINTER, PEN, LINE, ELLIPSE, RECT, ERASER } from '../toolStore';
import ColorPicker from './colorPicker';

export default class Tools extends React.Component {
	constructor() {
		super();
		this.state = {
			tools: [
				{ id: POINTER, label: '../images/select.png', type: 'cursor' },
				{ id: COLOR_PICKER, label: '../images/color.png', type: 'color-picker'},
				{ id: PEN, label: '../images/pen.png', type: 'pen' },
				{ id: ERASER, label: '../images/eraser.png', type: 'eraser' },
				{ id: LINE, label: '../images/line.png', type: 'line', selected: true },
				{ id: RECT, label: '../images/rect.png', type: 'rect' },
				{ id: ELLIPSE, label: '../images/el.png', type: 'ellipse' }
			],
			showColorPicker: false
		};
		ToolStore.subscribe(() => {
			const tools = this.state.tools.map(tool => ({ ...tool, selected: ToolStore.tool === tool.id }))
			this.setState({ tools })
		})
	}
	handleClick(index) {
		return function () {
			if (this.state.tools[index].id == 'ColorPicker') {
				this.state.showColorPicker = true
			} else {
				this.state.showColorPicker = false
			}
			EventBus.emit(EventBus.TOOL_CHANGE, this.state.tools[index].id);
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
				{this.state.showColorPicker && <ColorPicker className={'colorPickerStyle'}/>}
			</div>);
	}
}

