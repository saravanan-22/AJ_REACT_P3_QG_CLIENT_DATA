import React, { useEffect, useContext, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./GK.css";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CartContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import image from "../images/quiz.jpg";

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const gkReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "SET_SELECTED_ANSWER":
      return { ...state, selectedAnswer: action.payload };
    case "SET_CURRENT_QUESTION_INDEX":
      return { ...state, currentQuestionIndex: action.payload };
    case "DECREASE_TIMER":
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case "SET_POINTS":
      return { ...state, points: action.payload };
    case "SET_ANSWERED_CORRECTLY":
      return { ...state, answeredCorrectly: action.payload };
    case "SET_TOTAL_POINTS":
      return { ...state, totalPoints: action.payload };
    case "SET_POINTS_ARRAY":
      return { ...state, pointsArray: action.payload };
    case "SET_TOTAL_CURR":
      return { ...state, totalCurrPoints: action.payload };
    case "SET_IS_OPTION_SELECTED":
      return { ...state, isOptionSelected: action.payload };
    default:
      return state;
  }
};

const initialState = {
  questions: [],
  selectedAnswer: [],
  currentQuestionIndex: 0,
  timeRemaining: 60,
  points: 0,
  pointsArray: [0],
  answeredCorrectly: [],
  totalPoints: 0,
  totalCurrPoints: 0,
  isOptionSelected: false,
};

const userId = localStorage.getItem("uid");
const userSpecificStorageKey = `currPointsArray_${userId}`;
let currPointsArray = JSON.parse(localStorage.getItem(userSpecificStorageKey));

if (!currPointsArray) {
  currPointsArray = [0];
  localStorage.setItem(userSpecificStorageKey, JSON.stringify(currPointsArray));
}

const Gk = () => {
  const [state, dispatch] = useReducer(gkReducer, initialState);
  const { Gk } = useContext(CartContext);
  const navigate = useNavigate();
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [answeredQuestionIndices, setAnsweredQuestionIndices] = useState([]);


  const isQuestionAnswered = (questionIndex) => {
    return answeredQuestionIndices.includes(questionIndex);
  };

  // Shuffle the questions when Gk is updated
  useEffect(() => {
    dispatch({ type: "SET_QUESTIONS", payload: shuffleArray(Gk) });
  }, [Gk]);

  useEffect(() => {
    let timer;

    const updateTimer = () => {
      if (state.timeRemaining > 0) {
        timer = setTimeout(() => {
          dispatch({ type: "DECREASE_TIMER" });
        }, 1000);
      } else {
        // Timer has run out
        navigate("/Home");
        setTimeout(() => {
          window.location.reload();
        }, 4000);


        if (state.points > 0) {
          // Update current points array and save it to local storage
          const updatedCurrPointsArray = [...currPointsArray];
          updatedCurrPointsArray.push(state.points);
          localStorage.setItem(
            userSpecificStorageKey,
            JSON.stringify(updatedCurrPointsArray)
          );
          const totalLength = currPointsArray.length;
          // console.log(totalLength);
          const exactLength = totalLength > 2 ? `${totalLength - Number(1)}` : 0;
          const preValues = currPointsArray[exactLength];

           // update previous value in db-------------------
        axios
        .put(
          `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/updateGkQuestions/previousPoints/${userId}`,
          {
            prevPoint: preValues,
          }
        )
        .then((res) => console.log("previous point updated successfully"))
        .catch((err) => console.log(err));
          

          // Calculate total points from the current points array
          const totalValue = updatedCurrPointsArray.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue;
            },
            0
          );

          // Update total points in your API or wherever it's needed
          axios
            .put(
              `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/updateGKQuestions/totalPoints/${userId}`,
              {
                gkTotalPoints: totalValue,
              }
            )
            .then((res) => console.log("totalPoints updated successfully"))
            .catch((err) => console.log(err));
        }
      }
    };

    updateTimer();

    return () => {
      clearTimeout(timer);
    };
  }, [state.timeRemaining, state.points]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleSelectAnswer = (answer) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];

    if (currentQuestion) {
      // Check if the question has already been answered
      if (!answeredQuestionIndices.includes(state.currentQuestionIndex)) {
        if (answer === currentQuestion.correct_answer) {
          const updatedPoints = state.points + 1;

          const updatedPointsArray = [...state.pointsArray];
          updatedPointsArray[state.currentQuestionIndex] = updatedPoints;

          dispatch({ type: "SET_POINTS", payload: updatedPoints });
          dispatch({ type: "SET_POINTS_ARRAY", payload: updatedPointsArray });
          const totalCurrPoints = updatedPointsArray.length;
          dispatch({ type: "SET_TOTAL_CURR", payload: totalCurrPoints });
          const updatedAnsweredCorrectly = [...state.answeredCorrectly];
          updatedAnsweredCorrectly[state.currentQuestionIndex] = true;

          dispatch({
            type: "SET_ANSWERED_CORRECTLY",
            payload: updatedAnsweredCorrectly,
          });

          const addPoints = state.points + 1;
          dispatch({ type: "SET_TOTAL_POINTS", payload: addPoints });

          axios
            .put(
              `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/updateCurrentPoints/${userId}`,
              {
                currentPoints: updatedPoints,
              }
            )
            .then((response) => {
              console.log("Points updated successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        // Update the list of answered question indices
        setAnsweredQuestionIndices((prevIndices) => [
          ...prevIndices,
          state.currentQuestionIndex,
        ]);
      }

      dispatch({ type: "SET_IS_OPTION_SELECTED", payload: true });
    }

    const updatedSelectedAnswer = [...state.selectedAnswer];
    updatedSelectedAnswer[state.currentQuestionIndex] = answer;

    dispatch({
      type: "SET_SELECTED_ANSWER",
      payload: updatedSelectedAnswer,
    });
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      const nextQuestionIndex = state.currentQuestionIndex + 1;
      const nextQuestion = state.questions[nextQuestionIndex];

      const shuffledIncorrectAnswers = shuffleArray(
        nextQuestion.incorrect_answers
      );

      const updatedQuestions = [...state.questions];
      updatedQuestions[nextQuestionIndex] = {
        ...nextQuestion,
        incorrect_answers: shuffledIncorrectAnswers,
      };

      dispatch({
        type: "SET_SELECTED_ANSWER",
        payload: [],
      });
      dispatch({
        type: "SET_CURRENT_QUESTION_INDEX",
        payload: nextQuestionIndex,
      });
      dispatch({
        type: "SET_QUESTIONS",
        payload: updatedQuestions,
      });
      dispatch({ type: "SET_IS_OPTION_SELECTED", payload: false });
    } else {
      navigate("/");
    }
  };

  const handlePreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      const previousQuestionIndex = state.currentQuestionIndex - 1;
  
      // Check if the previous question has been answered
      if (!isQuestionAnswered(previousQuestionIndex)) {
        // If the previous question has not been answered, allow navigation
        dispatch({
          type: "SET_CURRENT_QUESTION_INDEX",
          payload: previousQuestionIndex,
        });
        dispatch({ type: "SET_IS_OPTION_SELECTED", payload: false });
        
      }
      
    }
  };
  
  return (
    <div
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <section style={{ marginTop: "6em" }}>
      <h5
        style={{
          textAlign: "end",
          margin: "0",
          marginRight: "52px",
          color: "red",
        }}
      >
        Timer: {formatTime(state.timeRemaining)}
      </h5>
      {state.questions.map((gkQuestion, index) => (
        <div
          key={index}
          style={{
            display: index === state.currentQuestionIndex ? "block" : "none",
          }}
        >
          <Card
            className="text-center mx-5 mb-2 transparent-card"
            style={{ backgroundColor: "white" }}
          >
            <Card.Header style={{ backgroundColor: "rgb(55, 134, 158)" }}>
              {gkQuestion.category}
            </Card.Header>
            <Card.Body>
              <Card.Title className="mb-3">
                QUESTION : {gkQuestion.question}
              </Card.Title>
              <Row className="mb-2">
                <Col md={6}>
                  <Button
                    onClick={() =>
                      handleSelectAnswer(gkQuestion.incorrect_answers[0])
                    }
                    variant={
                      state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[0] &&
                      gkQuestion.incorrect_answers[0] ===
                        gkQuestion.correct_answer
                        ? "success"
                        : state.selectedAnswer[state.currentQuestionIndex] ===
                          gkQuestion.incorrect_answers[0]
                        ? "danger"
                        : "dark"
                    }
                    disabled={
                      state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined ||
                      state.isOptionSelected
                    }
                  >
                    A . {gkQuestion.incorrect_answers[0]}
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    onClick={() =>
                      handleSelectAnswer(gkQuestion.incorrect_answers[1])
                    }
                    variant={
                      state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[1] &&
                      gkQuestion.incorrect_answers[1] ===
                        gkQuestion.correct_answer
                        ? "success"
                        : state.selectedAnswer[state.currentQuestionIndex] ===
                          gkQuestion.incorrect_answers[1]
                        ? "danger"
                        : "dark"
                    }
                    disabled={
                      state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined ||
                      state.isOptionSelected
                    }
                  >
                    B . {gkQuestion.incorrect_answers[1]}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Button
                    onClick={() =>
                      handleSelectAnswer(gkQuestion.incorrect_answers[2])
                    }
                    variant={
                      state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[2] &&
                      gkQuestion.incorrect_answers[2] ===
                        gkQuestion.correct_answer
                        ? "success"
                        : state.selectedAnswer[state.currentQuestionIndex] ===
                          gkQuestion.incorrect_answers[2]
                        ? "danger"
                        : "dark"
                    }
                    disabled={
                      state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined ||
                      state.isOptionSelected
                    }
                  >
                    C . {gkQuestion.incorrect_answers[2]}
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    onClick={() =>
                      handleSelectAnswer(gkQuestion.incorrect_answers[3])
                    }
                    variant={
                      state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[3] &&
                      gkQuestion.incorrect_answers[3] ===
                        gkQuestion.correct_answer
                        ? "success"
                        : state.selectedAnswer[state.currentQuestionIndex] ===
                          gkQuestion.incorrect_answers[3]
                        ? "danger"
                        : "dark"
                    }
                    disabled={
                      state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined ||
                      state.isOptionSelected
                    }
                  >
                    D . {gkQuestion.incorrect_answers[3]}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer
              className="text-muted"
              style={{ backgroundColor: "rgb(55, 134, 158)" }}
            >
              {gkQuestion.questionType}
            </Card.Footer>
          </Card>
        </div>
      ))}
      <div className="text-center">
        {state.currentQuestionIndex > 0 && (
          <Button
            onClick={handlePreviousQuestion}
            variant="primary"
            className="me-2"
          >
            Previous Question
          </Button>
        )}
        {state.currentQuestionIndex < state.questions.length - 1 && (
          <Button onClick={handleNextQuestion} variant="success">
            Next Question
          </Button>
        )}
      </div>
      <h6 className="text-start ms-5" style={{ color: "rgb(246, 222, 100)" }}>
        POINTS: {state.points}
      </h6>
      <h6 className="text-start ms-5" style={{ color: "rgb(55, 134, 158)" }}>
        Selected Answer:{" "}
        {state.selectedAnswer[state.currentQuestionIndex] || "Not Selected"}
      </h6>
      <h6 className="text-start ms-5" style={{ color: "rgb(246, 222, 100)" }}>
        Questions No: {state.currentQuestionIndex}
      </h6>
    </section>
  </div>
);
};


export default Gk;
