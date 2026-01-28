document.getElementById('generate-btn').addEventListener('click', () => {
    const numbersContainer = document.getElementById('numbers-container');
    numbersContainer.innerHTML = '';

    const lottoNumbers = [];
    while (lottoNumbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        if (!lottoNumbers.includes(randomNumber)) {
            lottoNumbers.push(randomNumber);
        }
    }
    lottoNumbers.sort((a, b) => a - b);

    let bonusNumber;
    do {
        bonusNumber = Math.floor(Math.random() * 45) + 1;
    } while (lottoNumbers.includes(bonusNumber));

    lottoNumbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        numbersContainer.appendChild(numberElement);
    });

    const bonusElement = document.createElement('div');
    bonusElement.classList.add('number', 'bonus');
    bonusElement.textContent = `Bonus: ${bonusNumber}`;
    numbersContainer.appendChild(bonusElement);
});