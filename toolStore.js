import EventBus from './eventBus'

export const POINTER = 'Pointer'
export const PEN ='Pen'
export const LINE ='Line'
export const ELLIPSE = 'Elipse'
export const RECT = 'Rect'
export const ERASER = 'Eraser'
export const COLOR_PICKER = "ColorPicker"
export const PEN_SIZE_PICKER = 'PenSizePicker'

class ToolStore{

	constructor(){
		this.id = 'toolStore';
		EventBus.on(EventBus.TOOL_CHANGE, this.toolChange.bind(this));
		EventBus.on(EventBus.COLOR_CHANGE, this.colorChange.bind(this));
		EventBus.on(EventBus.PEN_SIZE_CHANGE, this.penSizeChange.bind(this));
		this.tool = PEN;
		this.color = 'black';
		this.size = 2;
	}
	subscribe(cb){
		EventBus.on(this.id,cb);
	}
	emitChanges(){
		EventBus.emit(this.id);
	}
	toolChange(event, tool){
		this.tool = tool;
		this.emitChanges()
	}
	colorChange(event, color){
		this.color = color;
		this.emitChanges()
	}
	penSizeChange(event, penSize){
		this.size = penSize;
		this.emitChanges()
	}
}

export default new ToolStore();