let gameName = "Guess the Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML=`${gameName} Game create By Mohammad Shalati`;

let numbersOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

let wordToGuess = "";
let words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let messageArea = document.querySelector(".message");

document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHintFunc);

function generateInput() {
	let inputsContainer = document.querySelector(".inputs");

	for (let i = 1; i <= numbersOfTries; i++) {
		const tryDiv = document.createElement("div");
		tryDiv.classList.add(`try-${i}`);
		tryDiv.innerHTML = `<span>Try ${i}</span>`

		if (i !== 1) tryDiv.classList.add("disabled-inputs");

		for (let j = 1; j <= numberOfLetters; j++) {
			const input = document.createElement("input");
			input.type = "text";
			input.id = `guess-${i}-letter-${j}`;
			input.setAttribute("maxlength", "1");
			tryDiv.appendChild(input);
		}

		inputsContainer.appendChild(tryDiv);
	}
	inputsContainer.children[0].children[1].focus();

	const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
	inputsInDisabledDiv.forEach((input) => (input.disabled = true));

	const inputs = document.querySelectorAll("input");
	inputs.forEach((input, index) => {
		input.addEventListener("input", () => {
			input.value = input.value.toUpperCase();
			const nextInput = inputs[index + 1];
			if (nextInput) nextInput.focus();
		})

		input.addEventListener("keydown", (e) => {
			const currentIndex = Array.from(inputs).indexOf(input);
			if (e.key === "ArrowRight") {
				const nextInput = currentIndex + 1;
				if (nextInput < inputs.length) inputs[nextInput].focus();
			}
			if (e.key === "ArrowLeft") {
				const prevInput = currentIndex - 1;
				if (prevInput >= 0) inputs[prevInput].focus();
			}
		})
	})
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
	let successGuess = true;
	for (let i = 1; i <= numberOfLetters; i++) {
		const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
		const letter = inputField.value.toLowerCase();
		const actualLetter = wordToGuess[i - 1];

		if (letter === actualLetter) {
			inputField.classList.add("in-place");
		} else if (wordToGuess.includes(letter) && letter !== "") {
			inputField.classList.add("not-in-place");
			successGuess = false;
		}
		else {
			inputField.classList.add("no");
			successGuess = false;
		}
	}

	if (successGuess) {
		messageArea.innerHTML = `You Won, The Word is <span>${wordToGuess}</span>`;
		if (numberOfHints === 2) {
			messageArea.innerHTML = `<p>Congratz you Didn't Use Hints</p>`
		}

		let allTries = document.querySelectorAll(".inputs > div");
		allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
		getHintButton.disabled = true;
	}
	else {
		document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
		const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
		currentTryInputs.forEach((input) => (input.disabled = true));

		currentTry++;

		const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
		nextTryInputs.forEach((input) => input.disabled = false);

		let el = document.querySelector(`.try-${currentTry}`);
		if (el) {
			document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
			el.children[1].focus();
		} else {
			getHintButton.disabled = true;
			guessButton.disabled = true;
			messageArea.innerHTML = `You Lost, The Word Was ${wordToGuess}`;
		}
	}
}

function getHintFunc() {
	if (numberOfHints > 0) {
		numberOfHints--;
		document.querySelector(".hint span").innerHTML = numberOfHints;
		if (numberOfHints === 0) {
			getHintButton.disabled = true;
		}

		const enabledInputs = document.querySelectorAll("input:not([disabled])");
		const emptyEnabledInputs = Array.from(enabledInputs).filter((input)=>input.value==="");

		if (emptyEnabledInputs.length > 0) {
			const randomIndex = Math.floor(Math.random() * enabledInputs.length);
			const randomInput = emptyEnabledInputs[randomIndex];
			const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

			if (indexToFill !== -1) {
				randomInput.value = wordToGuess[indexToFill].toUpperCase();
			}
		} 
	}
}

function handleBackspace(e) {
	if (e.key === "Backspace") {
		const inputs = document.querySelectorAll("input:not([disabled])");
		const currentIndex = Array.from(inputs).indexOf(document.activeElement);
		if (currentIndex > 0) {
			const currentInput = inputs[currentIndex];
			const previousInput = inputs[currentIndex - 1];
			currentInput.value = "";
			previousInput.focus();
		}
	}
}
document.addEventListener("keydown", handleBackspace);

window.onload = function() {
	generateInput();
}