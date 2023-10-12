// Declare variables for future use
let totalQuestions = 0;
let answeredQuestions = 0;
let answersCorrect = 0;
let questionAnswered = new Array(totalQuestions).fill(false);

// Add a event listener to setup quiz quesitons
document.addEventListener("DOMContentLoaded", function () {
  // Fetch the JSON data
  fetch("../config.json")
    .then((response) => response.json())
    .then((data) => {
      const quizQuestionsContainer = document.querySelector(
        ".quiz-questions-container"
      );
      if (!quizQuestionsContainer) return;

      // set variables for future use
      totalQuestions = Object.keys(data).length;
      questionAnswered = new Array(totalQuestions).fill(false);

      // iterate over all the questions in the JSON file
      data.forEach((question, index) => {
        // Create a div for the quiz element
        const quizElement = document.createElement("div");
        quizElement.classList.add("quiz-element");

        // Create a div for the header
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("quiz-element-header");

        // Create a div for the question number
        const questionNumberDiv = document.createElement("div");
        questionNumberDiv.classList.add("question-number");
        questionNumberDiv.innerHTML = `<h1>${index + 1} of ${data.length}</h1>`;

        // Create a div for the question text
        const questionTextDiv = document.createElement("div");
        questionTextDiv.classList.add("question-text");
        questionTextDiv.innerHTML = `<p>${question.questionText}</p>`;

        // Append the question number and text to the header
        headerDiv.appendChild(questionNumberDiv);
        headerDiv.appendChild(questionTextDiv);

        // Create an image element
        const imageElement = document.createElement("img");
        imageElement.src = question.imageURL;
        imageElement.alt = "alternate-text";
        imageElement.style.height = "300px";
        imageElement.style.width = "auto";

        // Create a div for the answer options
        const optionContainer = document.createElement("div");
        optionContainer.classList.add("quiz-element-answer-container");

        // Create button elements for each option on the question
        question.options.forEach((option, answerIndex) => {
          const optionButton = document.createElement("button");
          optionButton.textContent = option;
          optionContainer.appendChild(optionButton);

          // Create a event handler for the button
          optionButton.addEventListener("click", () => {
            if (!questionAnswered[index]) {
              // Update our vars
              questionAnswered[index] = true;
              answersCorrect += question.answer === answerIndex ? 1 : 0;
              answeredQuestions++;

              // Disable all the buttons for the question
              const buttonsToDisable =
                optionContainer.querySelectorAll("button");
              buttonsToDisable.forEach((button, index) => {
                button.disabled = true;

                // update the colors
                if (index == question.answer) {
                  button.style.backgroundColor = "green";
                } else if (optionButton === button) {
                  button.style.backgroundColor = "red";
                }
              });

              // Handle completion of the quiz
              if (answeredQuestions === totalQuestions) {
                const finalScoreElement = document.createElement("div");
                finalScoreElement.classList.add("final-score-div");
                finalScoreElement.innerHTML = `<p>You got ${answersCorrect} out of ${totalQuestions} correct!</p>`;
                quizQuestionsContainer.appendChild(finalScoreElement);
              }
            }
          });
        });

        // Append the header, image, answer, and separator to the quiz element
        quizElement.appendChild(headerDiv);
        if (question.imageURL && question.imageURL.trim() !== "") {
          quizElement.appendChild(imageElement);
        }
        quizElement.appendChild(optionContainer);
        const elementSeparatorElement = document.createElement("div");
        elementSeparatorElement.classList.add("quiz-element-separator");
        quizElement.appendChild(elementSeparatorElement);

        // Append the quiz element to the quiz questions container
        quizQuestionsContainer.appendChild(quizElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching quiz questions:", error);
    });
});
