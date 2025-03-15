document.addEventListener('DOMContentLoaded', function () {
	const allText = document.querySelectorAll('[data-text-split]');
	console.log(allText);
	allText.forEach((text) => {
		console.log(text);
		const splittedText = SplitText.create(text, {
			type: 'lines,words,chars',
			linesClass: 'line',
			wordsClass: 'word',
			charsClass: 'char',
		});
		console.log(splittedText);
		// gsap set clip path to text
		// gsap.set(text, { clipPath: 'inset(0 0 0 0)' });
		gsap.set(text, { clipPath: 'inset(0 0 0 0)' });
	});
});
