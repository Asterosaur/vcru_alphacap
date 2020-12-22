// import {convertToCurrency} from "./utils.js"
import {animateCurrency} from "./utils.js"
import {animateScrollTo} from "./utils.js"
import {calculateDepoReplenished} from "./utils.js"

// let inputBubble = document.querySelector("#input_bubble");
let filledInput = document.querySelector('filled-range-input');
let filledInputBubble = document.querySelector('filled-range-input-bubble');



// inputBubble.style.visibility = "hidden";
// const updateInputBubble = (e) => {
// 	inputBubble.style.left =`${e.detail.thumbOffset.x}px`;
// 	inputBubble.setAttribute("left",e.detail.thumbOffset.x+e.detail.thumbOffset.width/2+window.pageXOffset);
// 	inputBubble.setAttribute("top",e.detail.thumbOffset.y+window.pageYOffset);
// 	inputBubble.querySelector("span").textContent = convertToCurrency(e.detail.value) +" ₽";
// 	inputBubble.toggleAttribute("visible",true);
// 	section2.classList.remove("-opaque");
// }
// filledInput.addEventListener("output",updateInputBubble);
// filledInputBubble.addEventListener("output",updateInputBubble);


const step2 = (e) => {

	window.dispatchEvent(new CustomEvent("redraw"));

	let section2 = document.querySelector("#section2");
	section2.classList.remove("-opaque");

	/*СВИСТОПЕРДЕЛКИ V1 */
	let value = parseInt(e.detail.value);
	let summary = updateSummary(value, value);

	/*ПЛАВНЫЙ ДОСКРОЛЛ*/

	let monthlySavingsSpan = section2.querySelector("#monthly_savings");
	let sumSimpleSpan = section2.querySelector("#sumSimple");
	let sumMultiSpan = section2.querySelector("#sumMultiplied");
	let sumDepoSpan = section2.querySelector("#sumDepo");

	animateCurrency(sumSimpleSpan, summary.sumSimple);
	animateCurrency(sumDepoSpan, summary.sumDepo);
	animateCurrency(sumMultiSpan, summary.sumMulti);
	drawCoins(summary.sumSimple, summary.sumDepo, summary.sumMulti, summary.maxMulti);

	animateScrollTo(monthlySavingsSpan,1000);
	animateCurrency(monthlySavingsSpan, e.detail.value);
	section2.classList.add("-opaque");

	step3(e);
}

const step3 = (e) => {

	let medianSavings = /*GET*/ 35240;
	let people1k = 60;
	let people10k = 53;

	let medianSavingsSpan = document.querySelector("#medianSavings");
	let moneyPile = document.querySelector(".money_pic");
	let people1kSpan = document.querySelector("#people1k");
	let people10kSpan = document.querySelector("#people10k");

	let people1kRadial = document.querySelector("#people1kRadial");
	let people10kRadial = document.querySelector("#people10kRadial");

	let accordion = document.querySelector("#section3")

	let accordionHead = accordion.querySelector(".head");
	let accordionFoot = accordion.querySelector(".foot");

	accordion.classList.add("-opaque");
	accordionHead.addEventListener("click", (e) =>{
		animateCurrency(medianSavingsSpan,medianSavings);
		people1kSpan.textContent = people1k;
		people10kSpan.textContent = people10k;
		people1kRadial.setAttribute("progress",people1k);
		people10kRadial.setAttribute("progress",people10k);
	
		medianSavings < 10000 ? moneyPile.classList.add("pic1") :
		medianSavings < 20000 ? moneyPile.classList.add("pic2") :
		medianSavings < 30000 ? moneyPile.classList.add("pic3") :
		medianSavings < 40000 ? moneyPile.classList.add("pic4") :
		moneyPile.classList.add("pic5");
		accordion.classList.add("-active");
	});


	accordionFoot.addEventListener("click", (e) =>{
		accordion.classList.remove("-active");
	});

	let section4 = document.querySelector("#section4");
	section4.classList.add("-opaque");

}

// filledInput.addEventListener("change",step2);
filledInputBubble.addEventListener("change",step2);

/*фиксируем прибыль*/
const updateSummary = function (input, max = 50000) {
	let sumSimple = input * 36;
	let sumDepo = calculateDepoReplenished(input, 6.98, 36, 12);
	let sumMulti = Math.ceil(input * 36 * 1.7121);
	let maxMulti = Math.ceil(max * 36 * 1.7121);

	return {sumSimple, sumDepo, sumMulti, maxMulti}
  };




/*монеточки*/
const drawCoins = function (
	simpleValue = 1800000,
	depoValue = 2007533,
	multiValue = 3081780,
	maxValue = 3081780
  ) {
	let step = maxValue / 10;
	let coinsSimple = document.querySelector("#coins_1");
	let coinsDepo = document.querySelector("#coins_2");
	let coinsMulti = document.querySelector("#coins_3");
  
	coinsSimple.innerHTML = "";
	coinsDepo.innerHTML = "";
	coinsMulti.innerHTML = "";
  
	doAddCoins(coinsMulti, Math.ceil(multiValue / step));
	doAddCoins(coinsDepo, Math.ceil(depoValue / step));
	doAddCoins(coinsSimple, Math.ceil(simpleValue / step));

  };
  
const doAddCoins = (obj, count, offset = 10, animDelay = .1) => {


	obj.classList.remove("has_coins");
	for (let i = 0; i < count; i++) {
		let coin = document.createElement("div");
		coin.setAttribute("class", "coin");
		obj.appendChild(coin);
		obj.classList.add("has_coins");
		coin.style.left = `${i * offset}px`;
		coin.style.transform = `translateX(${i*offset}px)`;
		coin.style.transition = `all .3s ease-out ${i*animDelay}s`;
		setTimeout(()=>{
			coin.style.transform = `translateX(0)`;
			coin.style.opacity = 1;
			},100);
	}
  };

