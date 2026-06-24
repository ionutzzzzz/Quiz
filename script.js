const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const resultsContainer = document.getElementById('results-container');
const resultsScore = document.getElementById('results-score');
const resultsMark = document.getElementById('results-mark');
const restartButton = document.getElementById('restart-btn');
const controlsElement = document.querySelector('.controls');

let shuffledQuestions, currentQuestionIndex, score;
let questions = [];

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
submitButton.addEventListener('click', submitAnswer);

fetch('data/quiz.json')
    .then(res => res.json())
    .then(data => {
        questions = data;
    });

function startGame() {
    resultsContainer.classList.add('hide');
    startButton.classList.add('hide');
    controlsElement.classList.remove('hide');
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = 'Score: ' + score;
    questionContainerElement.classList.remove('hide');
    updateProgressBar();
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (shuffledQuestions.length > currentQuestionIndex) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        updateProgressBar();
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionElement.innerText = `${question.id}. ${question.question}`;
    question.options.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    submitButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    selectedButton.classList.toggle('selected');

    const hasSelected = Array.from(answerButtonsElement.children).some(button => button.classList.contains('selected'));
    if (hasSelected) {
        submitButton.classList.remove('hide');
    } else {
        submitButton.classList.add('hide');
    }
}

function submitAnswer() {
    submitButton.classList.add('hide');
    const correctAnswers = shuffledQuestions[currentQuestionIndex].answer;
    const selectedButtons = Array.from(answerButtonsElement.children).filter(button => button.classList.contains('selected'));

    if (selectedButtons.length > 0) {
        const selectedAnswers = selectedButtons.map(button => button.innerText);
        
        const sortedSelectedAnswers = [...selectedAnswers].sort();
        const sortedCorrectAnswers = [...correctAnswers].sort();

        let isCorrect = sortedSelectedAnswers.length === sortedCorrectAnswers.length && sortedSelectedAnswers.every((value, index) => value === sortedCorrectAnswers[index]);

        if (isCorrect) {
            score++;
            scoreElement.innerText = 'Score: ' + score;
        }

        Array.from(answerButtonsElement.children).forEach(button => {
            if (correctAnswers.includes(button.innerText)) {
                button.classList.add('correct');
            } else if (button.classList.contains('selected')) {
                button.classList.add('wrong');
            }
            button.disabled = true;
        });

        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove('hide');
        } else {
            // Delay showing results to allow user to see the feedback
            setTimeout(showResults, 1000);
        }
    }
}


function showResults() {
    questionContainerElement.classList.add('hide');
    controlsElement.classList.add('hide');
    resultsContainer.classList.remove('hide');

    const totalQuestions = shuffledQuestions.length;
    resultsScore.innerText = `You scored ${score} out of ${totalQuestions}!`;

    const mark = calculateMark(score, totalQuestions);
    resultsMark.innerText = `Your mark: ${mark}`;
}

function calculateMark(score, total) {
    const percentage = score / total;
    if (percentage >= 0.9) return 10;
    if (percentage >= 0.8) return 9;
    if (percentage >= 0.7) return 8;
    if (percentage >= 0.6) return 7;
    if (percentage >= 0.5) return 6;
    if (percentage >= 0.4) return 5;
    if (percentage >= 0.3) return 4;
    if (percentage >= 0.2) return 3;
    if (percentage >= 0.1) return 2;
    return 1;
}


function updateProgressBar() {
    const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressBar.style.width = progress + '%';
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}