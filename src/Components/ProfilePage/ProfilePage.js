import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/profile_background.jpg";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [usersData, setUsersData] = useState(); //
  const [foundUser, setFoundUser] = useState(); //
  // const [user, setUser] =useState()
  // Define state variables for editing and user details
  const [editing, setEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [update, setUpdate] = useState("");

  // Add state variables for error handling
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users")
      .then((res) => {
        const fetchedUsers = res.data.data;
        setUsersData(fetchedUsers);

        // Find the user by email
        const userId = localStorage.getItem("uid");
        setUserId(userId);
        const user = fetchedUsers.find((user) => user._id === userId);
        // console.log(user);

        if (user) {
          setFoundUser(user);
          const delay = 2000;
          setTimeout(() => {
            setEditedImage(user.profileImage || "Loading...");
            setEditedUsername(user.username || "Loading...");
            setEditedEmail(user.email || "Loading...");
            setEditedPassword(user.password || "Loading...");
            setEditedPhoneNumber(user.ph || "Loading...");
          }, delay);
        } else {
          setFoundUser(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setFoundUser(null);
      });
  }, [userId]);
  // Function to handle form submission when editing

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert the image data to Base64 encoding
        const base64String = reader.result.split(",")[1];
        setUpdate(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  // console.log(update);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/editedUserData/singleUser/${userId}`,
        {
          userImage: update,
          username: editedUsername,
          email: editedEmail,
          password: editedPassword,
          ph: editedPhoneNumber,
        }
      )
      .then((res) => {
        alert("User details updated successfully");
        navigate("/Home");
      })
      .catch((err) => {
        console.error("Error updating user details:", err.response.data);
      });

    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete(
          `https://ill-cyan-gosling-toga.cyclic.cloud/api/v1/users/deleteAccount/${userId}`
        )
        .then((res) => {
          alert("account deleted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          navigate("/");
        })
        .catch((err) => console.log(err));
    } else {
      alert("Something went wrong. Please try again later.");
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
        justifyContent: "center",
        alignItems: "center", // Center the form vertically
      }}
    >
      <Card style={{ width: "25rem", margin: "auto" }}>
        <Card.Body>
          <Card.Title>
            <h4 style={{ textAlign: "center" }}>User Details</h4>
          </Card.Title>
          {/* {editing ? ( */}
          <div>
            <Form onSubmit={handleEditSubmit}>
              <img
                src={`data:image/jpeg;base64,${editedImage}`}
                alt="Profile"
                className="profile-image-preview"
                style={{
                  width: "150px",
                  height: "160px",
                  marginTop: "0.5em",
                  marginBottom: "1em",
                }}
              />
              <label htmlFor="profileImageInput" className="custom-file-upload">
                | Update Profile Picture |
              </label>
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                onChange={handleImageUpload}
                className="hidden-file-input"
              />
              <Form.Group controlId="editedUsername">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    display: "inline-block",
                    width: "30%",
                  }}
                >
                  Username :
                </Form.Label>
                <Form.Control
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  required
                  style={{
                    display: "inline-block",
                    width: "70%",
                    textAlign: "start",
                    marginBottom: "5px",
                  }}
                />
                {usernameError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.875rem",
                      marginLeft: "32%",
                    }}
                  >
                    Username must be at least 2 characters long.
                  </p>
                )}
              </Form.Group>

              <Form.Group controlId="editedEmail">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    display: "inline-block",
                    width: "30%",
                  }}
                >
                  Email :
                </Form.Label>
                <Form.Control
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  required
                  style={{
                    display: "inline-block",
                    width: "70%",
                    textAlign: "start",
                    marginBottom: "5px",
                  }}
                />
                {emailError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.875rem",
                      marginLeft: "32%",
                    }}
                  >
                    Invalid email format.
                  </p>
                )}
              </Form.Group>

              <Form.Group controlId="editedPassword">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    display: "inline-block",
                    width: "30%",
                  }}
                >
                  Password :
                </Form.Label>
                <Form.Control
                  type="password"
                  value={editedPassword}
                  onChange={(e) => setEditedPassword(e.target.value)}
                  required
                  style={{
                    display: "inline-block",
                    width: "70%",
                    textAlign: "start",
                    marginBottom: "5px",
                  }}
                />
                {passwordError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.875rem",
                      marginLeft: "32%",
                    }}
                  >
                    Password must be at least 6 characters long.
                  </p>
                )}
              </Form.Group>

              <Form.Group controlId="editedPhoneNumber">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    display: "inline-block",
                    width: "30%",
                  }}
                >
                  Ph No :
                </Form.Label>
                <Form.Control
                  type="text"
                  value={editedPhoneNumber}
                  onChange={(e) => setEditedPhoneNumber(e.target.value)}
                  required
                  disabled
                  style={{
                    display: "inline-block",
                    width: "70%",
                    textAlign: "start",
                  }}
                />
                {phoneNumberError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.875rem",
                      marginLeft: "32%",
                    }}
                  >
                    Phone number must be at least 10 digits.
                  </p>
                )}
              </Form.Group>

              <Button type="submit" variant="success" className="my-2">
                Save Changes
              </Button>
              <Link to={"/"}>
                <Button variant="outline-secondary" className="ms-2">
                  Logout
                </Button>
              </Link>
              <Link to={"/Home"}>
                <Button variant="outline-primary " className="ms-2">
                  Home
                </Button>
              </Link>
              <Button variant="danger" className="ms-2" onClick={handleDelete}>
                Delete
              </Button>
            </Form>
          </div>
          {/* ) : ( */}
          <div>{/* Display user details here when not in edit mode */}</div>
          {/* )} */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
