const startPage = document.getElementById('mainPage');
const startButton = document.getElementById('enterButton');
const loginSection = document.getElementById('login');
const readyButton = document.getElementById('playButton');
const categorySection = document.getElementById('categories');
const getCategories = document.getElementById('showCategroies');
const questionsSection = document.getElementById('questions');
const questionsDiv = document.getElementById('showQuestions');
let allQuestions = []; 
let currentQuestionIndex = 0; 
let playerName1 = "";
let playerName2 = "";
let playerScore1 = 0;
let playerScore2 = 0;
const playerTurn = document.getElementById('turn');
const winSection = document.getElementById('winBoard');
const winMsg = document.getElementById('winMessage');
const playerMsg1 = document.getElementById('playerMessage1');
const playerMsg2 = document.getElementById('playerMessage2');
const selectedCategories = new Set(); 
let playerWin1 = 0;
let playerWin2 = 0;

startButton.addEventListener('click', function(){
    startPage.style.display = 'none'; 
    categorySection.style.display = 'none';
    loginSection.style.display = 'block';
    document.body.style.backgroundImage = "url('imgg66.jpg')";
    document.body.style.backgroundPosition = 'top';
    questionsSection.style.display = 'none'; 
    winSection.style.display = 'none';
});

readyButton.addEventListener('click', function(event){
    event.preventDefault();
    startPage.style.display = 'none'; 
    loginSection.style.display = 'none';
    categorySection.style.display = 'block';
    document.body.style.backgroundImage = "url('imgg1.webp')";
    questionsSection.style.display = 'none'; 
    playerName1 = document.getElementById('user1').value || 'Player1';
    playerName2 = document.getElementById('user2').value || 'Player2';
    // console.log(playerName1);
    // console.log(playerName2);
    winSection.style.display = 'none';
});

const apiUrl = 'https://the-trivia-api.com/v2/categories';

fetch(apiUrl).then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    // console.log('Categories:', data);
   
    for (const category in data) {
        if (data.hasOwnProperty(category)) {
         
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category'); 
            categoryDiv.textContent = category; 
            categoryDiv.style.display = 'flex';
       
            getCategories.appendChild(categoryDiv);

            categoryDiv.addEventListener('click', function(){
                const selectedCategory = category;
                // console.log(selectedCategory);
                selectedCategories.add(selectedCategory);
    
                categoryDiv.style.pointerEvents = 'none'; 
                categoryDiv.style.opacity = '0.5'; 

                getQuestions(selectedCategory);
                startPage.style.display = 'none'; 
                loginSection.style.display = 'none';
                categorySection.style.display = 'none';
                questionsSection.style.display = 'block';
            });
        }
    }
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});


function getQuestions(selCategory) {
    const difficulties = ['easy', 'medium', 'hard']; 
    const limit = 2; 
    const encodedCategory = encodeURIComponent(selCategory);

    const requests = difficulties.map(difficulty => {
        const quesUrl = `https://the-trivia-api.com/v2/questions?categories=${encodedCategory}&limit=${limit}&difficulties=${difficulty}`;
        
        return fetch(quesUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching ${difficulty} questions: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(error);
                return []; 
            });
    });

    Promise.all(requests)
        .then(results => {
            allQuestions = results.flat();
            displayQuestion(currentQuestionIndex);
        })
        .catch(error => {
            console.error('Error fetching all questions:', error);
        });
}


function displayQuestion(index) {
    questionsDiv.innerHTML = '';

    if (index < 0 || index >= allQuestions.length) {
        playerTurn.textContent = "";
        const scoresDiv = document.createElement('div');
        scoresDiv.className = 'scoresDiv';
        const msg = document.createElement('h2');
        msg.textContent = "Quiz completed!";
        scoresDiv.appendChild(msg);
        const msg1 = document.createElement('p');
        msg1.textContent = "Scores for this category are as follows";
        scoresDiv.appendChild(msg1);
        const pScore1 = document.createElement('p');
        pScore1.textContent = `Score of ${playerName1} : ${playerScore1}`;
        const pScore2 = document.createElement('p');
        pScore2.textContent = `Score of ${playerName2} : ${playerScore2}`;
        scoresDiv.appendChild(pScore1);
        scoresDiv.appendChild(pScore2);
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.id = "backButton";
        const quitButton = document.createElement('button');
        quitButton.textContent = 'Quit';
        quitButton.id = "quitButton";
        scoresDiv.appendChild(backButton);
        scoresDiv.appendChild(quitButton);
        questionsDiv.appendChild(scoresDiv);


        quitButton.addEventListener('click', function(){
            startPage.style.display = 'none'; 
            loginSection.style.display = 'none';
            categorySection.style.display = 'none';
            document.body.style.backgroundImage = "url('extra.jpg')";
            document.body.style.backgroundPosition = 'top';
            questionsSection.style.display = 'none';
            winSection.style.display = 'block';
           
            if(playerScore1 > playerScore2){
                playerWin1 += 1;
            } 
            else if(playerScore2 > playerScore1){
                playerWin2 += 1;
            }
            
            if(playerWin1 > playerWin2){
                winMsg.textContent = `${playerName1} won this game!!`;
                playerMsg1.textContent = `${playerName1}, You played very well. Keep it up!!`;
                playerMsg2.textContent = `${playerName2}, Don't worry. You have a lot to explore!!`;
            }
            else if(playerWin1 < playerWin2){
                winMsg.textContent = `${playerName2} won this game!!`;
                playerMsg1.textContent = `${playerName2}, You played very well. Keep it up!!`;
                playerMsg2.textContent = `${playerName1}, Don't worry. You have a lot to explore!!`;
            }
            else{
                winMsg.textContent = `Hurray! It's a Tie!!`;
                playerMsg2.textContent = "You both have an equal knowledge! Keep Learning!!";
            }
        });

        // console.log(selectedCategories.size);
        if(selectedCategories.size == 10){
            backButton.disabled = true;
            backButton.style.pointerEvents = 'none'; 
        }

        backButton.addEventListener('click', function() {

            questionsSection.style.display = 'none';
            categorySection.style.display = 'block'; 

            if(playerScore1 > playerScore2){
                playerWin1 += 1;
            } 
            else if(playerScore2 > playerScore1){
                playerWin2 += 1;
            }
            // console.log(playerWin1);
            // console.log(playerWin2);

            currentQuestionIndex = 0; 
            playerScore1 = 0;        
            playerScore2 = 0;  
            questionsDiv.innerHTML = '';

            const categoryDivs = document.querySelectorAll('.category');
            categoryDivs.forEach(categoryDiv => {
                const categoryName = categoryDiv.textContent;
                
                if (selectedCategories.has(categoryName)) {
                    categoryDiv.style.pointerEvents = 'none';
                    categoryDiv.style.opacity = '0.5';
                } else {
                    categoryDiv.style.pointerEvents = 'auto';
                    categoryDiv.style.opacity = '1';
                }
            });
        });        
        return;
    }

    const questionObj = allQuestions[index];

    if (!questionObj) {
        console.error('Question object is undefined at index:', index);
        return;
    }

    const questionFieldset = document.createElement('fieldset');
    questionFieldset.className = 'questionFieldset'; 

    const questionLegend = document.createElement('legend');
    questionLegend.className = 'questionLegend';
    questionLegend.textContent = `Question ${index + 1}`;
    questionFieldset.appendChild(questionLegend);

    const questionDiv = document.createElement('div');
    questionDiv.className = 'questionsBlock';

    const difficulty = questionObj.difficulty ? questionObj.difficulty.toUpperCase() : 'UNKNOWN';
    const questionText = document.createElement('h3');
    questionText.className = 'questionText';
    questionText.textContent = `${questionObj.question.text} [${difficulty}]`;
    questionDiv.appendChild(questionText);

    const options = [...questionObj.incorrectAnswers, questionObj.correctAnswer];
    shuffleArray(options); 

    const optionsList = document.createElement('ul');
    options.forEach(option => {
        const optionItem = document.createElement('li');
        optionItem.textContent = option;
        optionItem.addEventListener('click', () => handleAnswerSelection(option, questionObj.correctAnswer));
        optionsList.appendChild(optionItem);
    });

    questionDiv.appendChild(optionsList);

    questionFieldset.appendChild(questionDiv);

    questionsDiv.appendChild(questionFieldset);
    playerTurn.textContent = (index % 2 === 0) ? `It's ${playerName1} turn!` : `It's ${playerName2} turn!`; 
}


function handleAnswerSelection(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        if(playerTurn.textContent === `It's ${playerName1} turn!`){
            playerScore1 += 1;
        }
        else{
            playerScore2 += 1;
        }
    } else {
        alert("Incorrect! The correct answer is: " + correctAnswer);
    }

    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex); 
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
