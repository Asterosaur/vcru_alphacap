export const convertToCurrency = (input) => {
	var inputArray = input.toString().match(/(\d+?)(?=(\d{3})+(?!\d)|$)/g);
	return inputArray.join(" ");
  };

export const calculateDepoReplenished = (input, rate, monthsTotal, monthsCapitalize) => {
	let sum = parseInt(input) + calculateDepoSimple(input, rate, 365 / 12);
	let percents = 0;
	for (let i = 1; i < monthsTotal; i++) {
	  sum += parseInt(input);
	  percents += calculateDepoSimple(sum, rate, 365/12)
	  if (monthsCapitalize % i == 0)
	  {sum += percents}
	}
	sum += percents;
	return sum;
};

export const calculateDepoSimple = (input, rate, term) => {
	return Math.ceil((input * rate * term) / (365 * 100));
};		

export const lerp = (value1, value2, amount) => {
	return value1 + (value2 - value1) * amount;
  };

export const clamp = (a, b, c) => {
	return Math.max(b, Math.min(c, a));
};


export const animateCurrency = function (
	obj,
	end,
	steps = 120,
	currentStep = 0
  ) {
	//let obj = document.querySelector(id);
	let start = parseInt(obj.textContent.replace(/ /g, ""));
	if (start === end) return;
	let progress = currentStep / steps;
	  (obj.textContent = convertToCurrency(
		  Math.round(lerp(start, end, progress))
		))
	currentStep++;
	if (currentStep < steps) {
	  window.requestAnimationFrame(function () {
		animateCurrency(obj, end, steps, currentStep);
	  });
	}
  };

export const animateScrollTo = function (
	obj,
	duration = 500,
	value = null,
	startTime = null
  ) {
	let from = value || window.pageYOffset;
	startTime = startTime || new Date().getTime();
	let timestamp = new Date().getTime();
	let runtime = timestamp - startTime;
	let progress = runtime / duration;
	let to =
	obj.getBoundingClientRect().top + window.pageYOffset;
	window.scrollTo(0, lerp(from, to, progress));
	if (runtime < duration) {
	  window.requestAnimationFrame(function () {
		animateScrollTo(obj, duration, from, startTime);
	  });
	}
  };
  