import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import image from "../images/forgot_password.jpg";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [emailValue, setEmailValue] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [foundUser, setFoundUser] = useState();
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get all user details from the API
    axios
      .get("https://muddy-bat-moccasins.cyclic.cloud/api/v1/users")
      .then((res) => {
        const fetchedUsers = res.data.data;
        setUsersData(fetchedUsers);

        // Find the user by email
        const user = fetchedUsers.find((user) => user.email === emailValue);
        if (user) {
          setFoundUser(user);
        } else {
          setFoundUser(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setFoundUser(null);
      });

    //use put method to change password ---------------------------------
    if (userId && userPassword) {
      axios
        .patch(
          `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/forgotPassword/${userId}`,
          {
            password: userPassword,
          }
        )
        .then((res) => {
          alert("password update successfully");
          navigate("/")
        })

        .catch((err) =>
          console.error("Error updating user details:", err.response.data)
        );
    }
  };

  useEffect(() => {
    if (foundUser) {
      setUserId(foundUser._id);
    } else {
      console.log("User not found");
    }
  }, [foundUser]);

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Center the form vertically
      }}
    >
      <Container>
        <Form onSubmit={handleSubmit}>
          {!userId ? (
            <Form.Group controlId="editedEmail">
              <Form.Label
                style={{
                  fontWeight: "bold",
                  display: "inline-block",
                  marginRight: "0.5em",
                }}
              >
                Email :
              </Form.Label>
              <Form.Control
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                style={{
                  display: "inline-block",
                  width: "50%",
                  textAlign: "start",
                  marginBottom: "5px",
                }}
                placeholder="Type your valid email Id?"
              />
            </Form.Group>
          ) : (
            <Form.Group controlId="editedPassword">
              <Form.Label
                style={{
                  fontWeight: "bold",
                  display: "inline-block",
                  marginRight: "0.5em",
                }}
              >
                Password :
              </Form.Label>
              <Form.Control
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                style={{
                  display: "inline-block",
                  width: "70%",
                  textAlign: "start",
                  marginBottom: "5px",
                  backgroundColor: "black",
                  color: "white",
                }}
              />
            </Form.Group>
          )}
          <Button type="submit" variant="outline-dark">
            Submit
          </Button>
          <Link to={"/"}>
            <Button variant="outline-dark" className="ms-2">
              Home
            </Button>
          </Link>
        </Form>
      </Container>
    </div>
  );
};

export default ResetPassword;
