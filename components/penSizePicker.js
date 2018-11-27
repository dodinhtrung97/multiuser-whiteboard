import React from 'react';
import EventBus from '../eventBus';
import ToolStore from '../toolStore';
import NumberPicker from "react-number-picker";
import "react-number-picker/dist/style.css"

export default class PenSizePicker extends React.Component {
	constructor(){
		super()
		this.state = {
			size: ToolStore.size
		};
		ToolStore.subscribe(()=>{
			let size = ToolStore.size;
			this.setState({size: size});
		})
	}

	handleOnChange(value) {
		this.setState({size: value});
		EventBus.emit(EventBus.PEN_SIZE_CHANGE, value);
	}

	render(){
		let penSizeStyle = {
			position: 'absolute',
			left: '90px',
			top: '220px',
			width: '42px',
			height: '78px',
			backgroundColor: '#f0f0f0',
			borderRadius: '8px'
		}
		return (<div className="penSize" style={penSizeStyle}>
					<NumberPicker
				        value={this.state.size}
				        digits={2}
				        onChange={(value) => this.handleOnChange(value).bind(this)}
				    />
			    </div>);
	}
}