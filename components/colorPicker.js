import React from 'react';
import EventBus from '../eventBus';
import ToolStore from '../toolStore';

export default class ColorPicker extends React.Component {
	constructor(){
		super();
		this.state = {
			colors: [
				'red',
				'orange',
				'yellow',
				'green',
				'blue',
				'indigo',
				'violet',
				'black'
			],
			selectedColorIndex:7
		};
		ToolStore.subscribe(()=>{
			let selectedColor = ToolStore.color;
			let selectedColorIndex = this.state.colors.indexOf(selectedColor);
			this.setState({selectedColorIndex:selectedColorIndex});
		})
	}
	handleClick(index){
		return function(){
			EventBus.emit(EventBus.COLOR_CHANGE,this.state.colors[index]);
		}
	}

	render(){
		let colorsStyle = {
			position: 'absolute',
			left: '90px',
			top: '180px',
			borderRadius: '15px',
			backgroundColor: '#f0f0f0',
			border: 'solid 1px #dddddd',
			padding: '10px',
			width: '300px',
			flexDirection: 'row'
		}
		let colors = this.state.colors.map((color, i)=>{
			let style = {
			    display: 'flex',
				backgroundColor: color,
				width: 20,
				height: 20,
				margin: 5,
				borderRadius: 11
			};
			let borderStyle = {
			    display: 'flex',
			    backgroundColor: this.state.selectedColorIndex === i ? '#d6d6d6':'',
			    border: 1,
				margin: 1,
				borderRadius: 11
			};

			return <div key={i} style={borderStyle}>
						<div style={style} onClick={this.handleClick(i).bind(this)}></div>
					</div>});

		return(<div id="colors" style={colorsStyle}> {colors} </div>);
	}
}

