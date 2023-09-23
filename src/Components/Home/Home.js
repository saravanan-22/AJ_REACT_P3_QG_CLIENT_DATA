import React, { useState } from "react";
import Header from "../Header/Header";
import "./home.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import Points from "../Point/Points";
import background from "../images/background.jpg";
import Form from "react-bootstrap/Form";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const handleStart = () => {
    if (selectedCategory === "" || selectedCategory === "Select Category") {
      alert("Please select a category.");
    } else {
      // Set localStorage when a valid category is selected
      localStorage.setItem("category", selectedCategory);

      setTimeout(() => {
        window.location.reload(navigate("/Gk"));
      }, 2000);
    }
  };

  return (
    <div
      style={{
        ...backgroundImageStyle,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <Header />
      <h2
        className="text-white"
        style={{
          backgroundColor: "black",
          padding: "0.2em",
          width: "40vw",
          margin: "auto",
        }}
      >
        Welcome to the Quiz Game!{" "}
      </h2>
      <p className="text-light m-0 p-0">Test your knowledge and have fun.</p>
      <p className="text-light  m-0 p-0">Follow these instruction:</p>
      <ul style={{ listStyle: "none", color: "white", fontSize: "20px" }}>
        <li style={{ textDecoration: "underline" }}>
          Answer the questions within the time limit.
        </li>
      </ul>
      <div style={{ width: "20%", margin: "auto" }}>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option>Select Category</option>
          <option value="Gk">Gk</option>
          <option value="Computers">Computers</option>
          <option value="sports">sports</option>
          <option value="History">History</option>
          <option value="Politics">Politics</option>
          <option value="Art">Art</option>
          <option value="Science&Nature">Science&Nature</option>
          <option value="Animals">Animals</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Comics">Comics</option>
        </Form.Select>
      </div>

      <section style={{ marginBottom: "2em", textAlign: "center" }}>
        <Container>
          <div className="text-animation ">Get Ready to Play!</div>
          {/* <Link to="/Gk" style={{ textDecoration: "none" }}> */}
          {/* <Button variant="secondary">START</Button> */}
          <span className="animated-button1" onClick={handleStart}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            START
          </span>
          {/* </Link> */}
          <Points />
        </Container>
      </section>
    </div>
  );
};

export default Home;
