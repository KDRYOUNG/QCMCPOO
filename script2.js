let questions = [];


async function loadQuestions() {
    try {
        const response = await fetch('questions2.json');
        const data = await response.json();
        questions = data.questions;
        displayQuestions();
    } catch (error) {
        console.error('Erreur lors du chargement des questions :', error);
    }
}


function displayQuestions() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = ""; 

    questions.forEach((question, questionIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question-${questionIndex}`; 


        questionDiv.innerHTML = `<p>${question.text}</p>`;


        if (question.image) {
            const imgElement = document.createElement('img');
            imgElement.src = question.image; 
            imgElement.alt = "Image de la question"; 
            imgElement.style.maxWidth = "100%"; 
            imgElement.style.borderRadius = "4px"; 
            questionDiv.appendChild(imgElement);
        }

        question.options.forEach((option, optionIndex) => {
            const optionLabel = document.createElement('label');
            optionLabel.innerHTML = `
                <input type="checkbox" class="answer" data-question="${questionIndex}" data-option="${optionIndex}">
                ${option.text}
            `;
            questionDiv.appendChild(optionLabel);
            questionDiv.appendChild(document.createElement('br'));
        });

        quizContent.appendChild(questionDiv);
    });
}


function checkAnswers() {
    let score = 0;
    let incorrectQuestions = [];  

    questions.forEach((question, questionIndex) => {
        const options = document.querySelectorAll(`input[data-question="${questionIndex}"]`);
        let questionCorrect = true;

        options.forEach((option, optionIndex) => {
            const isChecked = option.checked;
            const isCorrect = question.options[optionIndex].correct;

           
            if (isChecked !== isCorrect) {
                questionCorrect = false;
            }
        });


        if (questionCorrect) {
            score++;
            document.getElementById(`question-${questionIndex}`).classList.add('correct');  
        } else {
            incorrectQuestions.push(questionIndex);  
            document.getElementById(`question-${questionIndex}`).classList.add('incorrect'); 
        }
    });


    let totalQuestions = questions.length;
    let noteSur20 = (score / totalQuestions) * 20;

    let resultText = `Vous avez obtenu ${score} sur ${totalQuestions}. Note : ${noteSur20.toFixed(2)}/20.`;


    if (incorrectQuestions.length > 0) {
        resultText += `\n\nCorrection :\n`;
        incorrectQuestions.forEach(questionIndex => {
            const question = questions[questionIndex];
            resultText += `\n- Question : ${question.text}\n`;
            resultText += `Explication : ${question.explanation}\n`;
        });
    }

    document.querySelector('.result').innerText = resultText;
}


window.onload = loadQuestions;
