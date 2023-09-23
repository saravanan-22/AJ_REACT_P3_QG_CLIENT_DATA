import React, { createContext, useContext, useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import loadingImage from "../images/loading.jpg";
import "./Context.css";

export const CartContext = createContext();

export const Context = ({ children }) => {
  const [Gk, setGk] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [userId, setUserId] = useState();
  const [prevPoints, setPrevPoints] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleUserDetails, setSingleUserDetails] = useState([]);

  useEffect(() => {
    const selectedCategory = localStorage.getItem("category");
    const userId = localStorage.getItem("uid");

    // Fetch GK questions
    // Construct the API URL based on selectedCategory
    axios
      .get(`https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/questions/${selectedCategory}`)
      .then((res) => {
        const fetchedQuestions = res.data.data;
        setGk(fetchedQuestions);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch current points
    axios
      .get(
        `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/getCurrentPoints/${userId}`
      )
      .then((res) => {
        const data = res.data.data;
        setCurrentPoints(data.currentPoints);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Fetch previous points
    axios
      .get(
        `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/getGkQuestions/previousPoints/${userId}`
      )
      .then((res) => {
        const data = res.data.data;
        setPrevPoints(data.previousPoint);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Fetch total points and user details
    axios
      .get(
        `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/getGkQuestions/totalPoints/${userId}`
      )
      .then((res) => {
        const data = res.data.data;
        setSingleUserDetails(data);
        setTotalPoints(data.totalPoints);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <CartContext.Provider
      value={{
        Gk,
        currentPoints,
        prevPoints,
        totalPoints,
        singleUserDetails,
        setSingleUserDetails,
      }}
    >
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              backgroundImage: `url(${loadingImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
              zIndex: "9999",
            }}
          >
            <Spinner animation="border" variant="secondary" />
            <p
              style={{
                color: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",
              }}
              className="ms-2 mt-2"
            >
              Loading<span className="loading-dots">...</span>
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </CartContext.Provider>
  );
};
