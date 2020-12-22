import {clamp} from "../js/utils.js";
const template = document.createElement('template');

 template.innerHTML = `
		<div class="wrapper">

			<div class="bubble"><slot name="text" class="-inherit-border-radius -inherit-font">1000Р</slot></div>
			
			<div class="tail"></div>

		</div>

<style>

:host
{
}
.wrapper
{	
	z-index:1;
	position:absolute;
	display:flex;
	flex-direction:column;
	align-items: center;
	max-width:inherit;
}


.-inherit-border-radius
{
	border-radius:inherit;
}

.-inherit-font
{
	font:inherit;
	color:inherit;
}

 .bubble

 {	
	background: gray;
	position: relative;
	border-radius: 5px;
	padding: 4px 6px 3px 7px;
 }


 .tail {
	background: gray;
	width: 7px;
	height: 7px;
    position: relative;
    transform: rotate(45deg);
    top: -3px;
  }

 .pointer-events-none
 {
	pointer-events:none;
 }

</style>
 `;



class BubbleTooltip extends HTMLElement {
	
  constructor() {

	
	super();

	this.attachShadow({ mode: 'open'});
	this.shadowRoot.appendChild(template.content.cloneNode(true));
	this.wrapper = this.shadowRoot.querySelector(".wrapper");
	this.textNode = this.shadowRoot.querySelector("span");
	this.tail = this.shadowRoot.querySelector(".tail");

	this.style.visibility = "hidden";
	this.trigger = null;
  }

 

  connectedCallback() {

	// this.wrapper.style.left		=	`${this.getAttribute("left")}px`;
	// this.wrapper.style.top = `${this.getAttribute("top")}px`;
	this.style.visibility = "hidden";
	this.shadowRoot.querySelector(".bubble").style.background = this.getAttribute("color");
	this.shadowRoot.querySelector(".tail").style.background = this.getAttribute("color");
	super.connectedCallback && super.connectedCallback();

	// window.addEventListener('resize',null);
	

	if(this.hasAttribute("trigger")) {
		
		if(!this.trigger){this.trigger = document.querySelector(this.getAttribute("trigger"))}

		this.trigger.addEventListener("click", (e) => {
			let triggerRect = this.trigger.getBoundingClientRect();
			this.toggleAttribute("visible");
			this.setAttribute("left", triggerRect.x+triggerRect.width/2+window.pageXOffset);
			this.setAttribute("top", triggerRect.y+window.pageYOffset);
		})

		window.addEventListener("resize", (e) => {
			this.removeAttribute("visible");
		});

		window.addEventListener("redraw", (e) => {
			this.removeAttribute("visible");
		});

		
	};

		

	
  }

  disconnectedCallback() {
	// window.removeEventListener('resize',null);
	super.disconnectedCallback && super.disconnectedCallback();
  }

  static get observedAttributes() {
    return ["left","top","visible"];
  }

  attributeChangedCallback(name, oldValue, newValue) {

			let padding = this.getAttribute("padding");
			let rect = this.wrapper.getBoundingClientRect();
			let left = this.getAttribute("left");
			let halfRect = rect.width/2;
			let clampedHorPos = clamp(left-halfRect,padding,window.innerWidth-rect.width-padding);
			let tailShift = clamp(left - clampedHorPos - halfRect,-halfRect+padding*2,halfRect-padding*2);
			let liftedTop = this.getAttribute("top") - rect.height;

			if(this.wrapper){
				this.wrapper.style.top = `${liftedTop}px`;
				this.wrapper.style.left = `${clampedHorPos}px`;
				this.tail.style.left = `${tailShift}px`;
			}
			this.hasAttribute("visible") ? this.style.visibility = "visible" : this.style.visibility = "hidden";

  }


  adoptedCallback() {

  }


}

window.customElements.define("bubble-tooltip", BubbleTooltip);