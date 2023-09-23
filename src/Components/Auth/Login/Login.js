import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import image from "./images/logo.svg.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import axios from "axios";
import background from "../../images/login_background.jpg";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // submitBtn-----------------------------------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("https://muddy-bat-moccasins.cyclic.cloud/api/v1/users")
      .then((res) => {
        const fetchedUsers = res.data;
        const { data } = fetchedUsers;
        const user = data.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          localStorage.setItem("uid", user._id);
          alert("Login completed successfully. Welcome!");
          navigate("/Home");
          setTimeout(() => {
            window.location.reload();
          }, 4000); 
          
        } else {
          setLoginError("Email or password doesn't match");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoginError("An error occurred during login");
      });
  };

  const setDefaultValues = (e) => {
    e.preventDefault();
    setEmail("saravanan@gmail.com")
    setPassword("1234567")
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <Card
        style={{
          width: "21rem",
          margin: "0 auto",
          padding: "1em",
          marginBottom: "4.5em",
          backgroundColor: "rgb(241, 241, 241)",
        }}
      >
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>Log in</Card.Title>
        </Card.Body>
        <>
          <Form onSubmit={handleSubmit} className="d-grid">
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                required
                style={{ textAlign: "start" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                style={{ textAlign: "start" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>
            <p className="text-danger">{loginError}</p>
            <Link to="/ResetPassword" className="text-end">
              ResetPassword
            </Link>
            <Button type="submit">Submit</Button>
          </Form>
        </>
        <Card.Body>
          <h6>
            user credentials!{" "}
            <Button
              variant="outline-dark"
              size="sm"
              style={{ textDecoration: "underline" }}
              onClick={setDefaultValues}
            >
              Login
            </Button>
          </h6>
          <h6>
            Don't have an account? <Link to="/SignUp">Sign up</Link>
          </h6>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
