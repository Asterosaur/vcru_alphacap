import { lerp, clamp }  from "../js/utils.js";


const template = document.createElement("template");
template.innerHTML =`
<div class="wrapper">
	<div class="ring"></div>
	<div class="mask -right">
		<div class="sector" id="rs-1"></div>
	</div>
	<div class="mask -left">
		<div class="sector" id="rs-2"></div>
	</div>

	<div class="inner"></div>
</div>

<style>

.wrapper
{
	position:relative;
	overflow:hidden;
}

.mask
{
	width:100%;
	height:100%;
	overflow:hidden;
}

.mask.-right
{
	left: 50%;
	width: 50%;
    height: 100%;
}

.mask.-left
{
    height: 100%;
    width: 50%;
}

 .inner, .ring, .mask
{
	position:absolute;
}

.wrapper, .inner, .ring
{
	border-radius: 50%;
}

.sector
{
	transform-origin: bottom center;
	width:100%;
	height:100%;
	transform: rotate(-180deg);
}

#rs-1
{
	transform-origin: center left;
}

#rs-2
{
	transform-origin: center right;
	
}


</style>

`;

class RadialProgress extends HTMLElement{

	constructor(){
		super();

		this.size = 140;
		this.thickness = 30;
		this.ringColor = "gray";
		this.color = "black";
		this.background = "white" ;
		this.progress = "50";
		this.speed = "100";
		
		this.attachShadow({ mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		
		this.wrapper = this.shadowRoot.querySelector(".wrapper");
		this.radialInner = this.wrapper.querySelector(".inner");
		this.sectors = this.wrapper.querySelectorAll(".sector");
		this.ring = this.wrapper.querySelector(".ring");
	}
	
	connectedCallback(){

		this.size = this.getAttribute("size");
		this.thickness = this.getAttribute("thickness");
		this.color= this.getAttribute("color");
		this.background= this.getAttribute("background");
		this.progress= this.getAttribute("progress");
		this.speed= this.getAttribute("speed");
		this.ringColor = this.getAttribute("ring_color");


		this.applyStyles = () =>
		{
			this.wrapper.style.width = this.wrapper.style.height = `${this.size}px`;
			this.radialInner.style.width = this.radialInner.style.height = `${this.size - this.thickness*2}px`;

			this.radialInner.style.left = this.radialInner.style.top = `${this.thickness}px`;

			this.radialInner.style.background = this.background;

			this.sectors.forEach(sector =>
			{
				sector.style.background = this.color;
			});

			this.ring.style.background = this.ringColor;

			this.ring.style.width = this.ring.style.height = `${this.size - this.thickness}px`;
			this.ring.style.top = this.ring.style.left = `${this.thickness/2}px`;
		}

		this.applyStyles();



	}

	disconnectedCallback() {

	}

	static get observedAttributes()
	{
		return ["progress","speed"];
	}

	attributeChangedCallback(name, oldValue, newValue) {




		this.setSectors = (progress) =>
		{


			this.sectors[0].style.transform = `rotate(${clamp(-180+(progress*3.6),-180,0)}deg)`;
			if(progress>49)
			this.sectors[1].style.transform = `rotate(${clamp(-180+(progress-50)*3.6, -180,0)}deg)`;
		}

		

		this.animateProgress = (from, to, interval, steps) =>
		{
			let currentStep = 0;

			let ticker = setInterval(() => {
				currentStep++;
				let progress = lerp(from, to, currentStep/steps);
				this.setSectors(progress);
				if(currentStep==steps){clearInterval(ticker)}
			}, interval);

		}
		if (name=="progress"){
			let _oldvalue = 0;
			oldValue==null ? _oldvalue = 0: _oldvalue = parseInt(oldValue);

			let _newValue = Math.min(newValue,100);
			let steps = Math.abs(_oldvalue - _newValue);
			let interval = 1000/this.getAttribute("speed");
			console.log(_oldvalue, _newValue);
			this.animateProgress(_oldvalue,_newValue,interval,steps);
			}
	}
  
	adoptedCallback() {
  
	}

}

window.customElements.define("radial-progress", RadialProgress);