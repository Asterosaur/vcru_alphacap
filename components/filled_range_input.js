import { convertToCurrency } from "../js/utils.js";


const template = document.createElement('template');

 template.innerHTML = `
	<div class="wrapper -inherit-border-radius">
		<div class="filler -pointer-events-none -inherit-border-radius"></div>
		<div class="thumb -pointer-events-none"></div>
		<div class="bg -pointer-events-none -inherit-border-radius"></div>
	</div>
	<input type="range" value="0" class="slider">


<style>
:host
{
	background: none;
}
.wrapper
{
	position: relative;
}

.wrapper > div
{
	position: absolute;
}

 .filler
 {

	height:100%;
	z-index:-1;
	top:0;
	background: tomato;
 }

 .thumb
 {

	z-index:1;
	width:25px;
	height:25px;
	border-radius:50%;
	border: 8px solid black;
	background:white;
	box-sizing: border-box;
 }

 input
 {
	-webkit-appearance:none;
	appearance:none;
	background: inherit;
	outline: none;
	width:100%;
	opacity:0;
 }

 .bg
 {
	background: #e2e2e2;
	width:100%;
	z-index:-2;
 }

 .-inherit-border-radius
{
	border-radius:inherit;
}

.-pointer-events-none
{
   pointer-events:none;
}


</style>
 `;

class FilledRangeInput extends HTMLElement {
	
  constructor() {

	
	super();


	this.fitElements = (event) => {		
		let ratio = (this.input.value / this.input.max);
		let trackWidth = Math.ceil(ratio * this.input.offsetWidth);
		this.filler.style.width = `${this.thumbSize/2 + trackWidth - this.thumbSize*ratio}px`;
		this.thumb.style.left =  `${trackWidth  - this.thumbSize*ratio}px`;;
	}
	
	this.sendOutput = (event) => {
		let type ="";
		
		if (event.type == "change") {type = "change"} else {type = "output"}
		this.dispatchEvent(new CustomEvent(
			type,
			{
				bubbles: true,
				composed: true,
				detail:{
					value:this.input.value,
					thumbOffset:this.thumb.getBoundingClientRect()
				}
			}));
	}



	this.attachShadow({ mode: 'open'});
	this.shadowRoot.appendChild(template.content.cloneNode(true));

	this.wrapper = this.shadowRoot.querySelector(".wrapper");
	this.filler =  this.shadowRoot.querySelector(".filler");
	this.thumb = this.shadowRoot.querySelector(".thumb");
	this.bg = this.shadowRoot.querySelector(".bg");

	this.input = this.shadowRoot.querySelector("input");
	this.input.addEventListener("input",this.fitElements);

	// let _this = this;
	// let _thumb = this.thumb;
	// let _input = this.input;

	// this.input.addEventListener("change", function (event) {

	// 	_this.dispatchEvent(new CustomEvent(
	// 		"change",
	// 		{
	// 			bubbles: true,
	// 			composed: true,
	// 			detail:{
	// 				text:_input.value,
	// 				thumbOffset: {x: _thumb.offsetLeft,	y:_thumb.offsetTop }
	// 			}
	// 		}
	// 	));
		
	// });

	this.input.addEventListener("input",this.sendOutput);
	this.input.addEventListener("change",this.sendOutput);
	window.addEventListener('resize',this.sendOutput);
  }

 

  connectedCallback() {
	this.thumbSize = this.getAttribute("thumb-size");
	this.thumbBorder = this.getAttribute("thumb-border");

	this.filler.style.background = this.getAttribute("fill-color");

	this.bg.style.background = this.getAttribute("background");

	this.thumb.style.width = this.thumb.style.height = this.thumbSize;
	this.thumb.style.border = this.thumbBorder;
	//this.thumb.style.top = - `-${this.thumb.style.getPropertyValue('border-top-width')}`;
	this.thumbBorderThickness = parseInt(this.thumb.style.borderWidth,10);

	this.bg.style.height = this.filler.style.height = `${this.thumbSize - this.thumbBorderThickness*2}px`;
	this.bg.style.top  = this.filler.style.top = `${this.thumbBorderThickness}px`;

	this.input.min = this.getAttribute("min");
	this.input.max = this.getAttribute("max");

	window.addEventListener('resize',this.fitElements);

  }

  disconnectedCallback() {
	window.removeEventListener('resize',fitElements);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {

  }

  adoptedCallback() {

  }

}

const bubbleTemplate = document.createElement('div');
bubbleTemplate.innerHTML =
`
	<bubble-tooltip id="input_bubble" left="0" top="0" padding="0" visible
	   color="#fe4d4a">
	   <span slot="text" class="-white -nowrap -noselect" id="input_bubble_text">1000 ₽</span>
	   </bubble-tooltip>
	   
	   <style>
			.-white
			{
				color:white;
			}

			.-nowrap
			{
				white-space: nowrap;
			}

			.-noselect
			{
				user-select:none;
			}
	   </style>
 `;


class FilledRangeInputBubble extends FilledRangeInput
{	
	constructor(){
		super();
		this.currency = "";
		this.bubble = this.shadowRoot.appendChild(bubbleTemplate).querySelector("bubble-tooltip");
		this.bubbleSpan = this.bubble.querySelector("#input_bubble_text");
		//this.input = this.shadowRoot.querySelector("input");
		

		this.drawBubble = (e) => {


			let parentRect = this.getBoundingClientRect();
			let thumbRect = this.thumb.getBoundingClientRect();

			this.bubble.toggleAttribute("visible",true);
			this.bubble.style.visibility = "visible";
			this.bubble.setAttribute("left",thumbRect.x+thumbRect.width/2-parentRect.x);

			let value = this.input.value;

			this.hasAttribute("currency") ?
			this.bubbleSpan.textContent = `${convertToCurrency(value)} ${this.currency}`
			:
			this.bubbleSpan.textContent = value;
			
		};

		this.input.addEventListener("input", this.drawBubble);
		window.addEventListener("resize", this.drawBubble);
		window.addEventListener("redraw", this.drawBubble);
	}
	
	connectedCallback(){
		super.connectedCallback && super.connectedCallback();
		this.currency = this.getAttribute("currency");
	}

	disconnectedCallback() {
		super.disconnectedCallback && super.disconnectedCallback();
	}
	
}


window.customElements.define("filled-range-input", FilledRangeInput);
window.customElements.define("filled-range-input-bubble", FilledRangeInputBubble);