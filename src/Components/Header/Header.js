import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/logo.svg.png";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [userPicture, setUserPicture] = useState("");
  const [userName , setUserName] = useState("")
  const [uid ,setUid] =useState("")
  const [usersData, setUsersData] = useState(); //
  const [foundUser, setFoundUser] = useState();

  useEffect(() => {

    axios
    .get("https://muddy-bat-moccasins.cyclic.cloud/api/v1/users")
    .then((res) => {
      const fetchedUsers = res.data.data;
      setUsersData(fetchedUsers);

      // Find the user by email
      const userId = localStorage.getItem("uid");
      setUid(userId);
      const user = fetchedUsers.find((user) => user._id === uid);
      // console.log(user);

      if (user) {
        setFoundUser(user);
          setUserName(user.username)
          setUserPicture(user.profileImage)
      } else {
        setFoundUser(null);
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
      setFoundUser(null);
    });
  }, [uid]);

  const handleProfileClick = () => {
    navigate("/ProfilePage");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        position: "fixed",
        top: "0",
        zIndex: "100",
        width: "100%",
        backgroundColor: "rgba(128, 126, 126, 0.6)",
      }}
    >
      <Container fluid>
        <Navbar.Brand href="">
          {" "}
          <Link to="/Home">
            <img src={image} alt="logo" width="100px" />
          </Link>{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {/* <Button
              variant="outline-light"
              style={{ margin: "auto" }}
             
            >
              <FaRegCircleUser />
              <span> Profile</span>
            </Button>{" "} */}
            <Chip
              avatar={
                <Avatar
                  alt="loading"
                  src={`data:image/jpeg;base64,${userPicture}`}
                />
              }
              label={userName}
              variant="outlined"
              onClick={handleProfileClick}
              style={{color : "white"}}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
