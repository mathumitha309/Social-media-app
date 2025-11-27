import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import api from "../../api";
import Message from "../Message";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const [message, setMessage] = useState("");
  const [show, setShow] = useState("fa fa-eye-slash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 MUST HAVE TOKEN HERE ALSO
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    token: "",   // 🔥 IMPORTANT (for 2FA login)
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    validateField(name, value);
  };

  const getValidationClass = (name) => {
    if (formValues[name] === "") return "";
    return formErrors[name] ? "is-invalid" : "is-valid";
  };

  const clearForm = () => {
    setFormValues({
      email: "",
      password: "",
      token: "",
    });
  };

  const validateField = (name, value) => {
    let errorMessage = null;
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = "Invalid email format..";
        }
        break;
      case "password":
        if (!value) {
          errorMessage = "This field is required...";
        }
        break;
      default:
        break;
    }

    setFormErrors({ ...formErrors, [name]: errorMessage });
  };

  // 🔥 TOKEN IS OPTIONAL – form should still submit
  const isFormValid = () => {
    return (
      formValues.email !== "" &&
      formValues.password !== "" &&
      formErrors.email === null &&
      formErrors.password === null
    );
  };

  const showPassword = () => {
    const x = document.getElementById("pass1");
    if (x.type === "password") {
      x.type = "text";
      setShow("fa fa-eye");
    } else {
      x.type = "password";
      setShow("fa fa-eye-slash");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setMessage("Please fill out the form correctly");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const { data } = await api.post("/api/auth/login", {
        email: formValues.email,
        password: formValues.password,
        token: formValues.token || "", // 🔥 SEND token correctly
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      clearForm();
      window.location.reload();
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Check credentials or 2FA"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) navigate("/profile");
  }, [navigate]);

  return (
    <Container>
      <Row>
        <Col md="4"></Col>

        {loading ? (
          <Loader />
        ) : (
          <Col md="4">
            <Card className="mt-4 p-3">
              <Form onSubmit={submitHandler}>
                <br />
                <h3 className="text-center bg-light text-dark">Login Here</h3>

                {message && (
                  <Message
                    variant="success"
                    onClose={() => setMessage("")}
                  >
                    {message}
                  </Message>
                )}

                {error && (
                  <Message
                    variant="danger"
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Message>
                )}

                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    isInvalid={!!formErrors.email}
                    className={getValidationClass("email")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <span>
                      <i className={show}></i>
                    </span>{" "}
                    Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox onClick={showPassword} />
                    <Form.Control
                      required
                      type="password"
                      name="password"
                      id="pass1"
                      value={formValues.password}
                      placeholder="Enter your Password"
                      isInvalid={!!formErrors.password}
                      className={getValidationClass("password")}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Passcode (2FA)</Form.Label>
                  <Form.Control
                    type="text"
                    name="token"
                    value={formValues.token}
                    placeholder="Enter 2FA OTP (Optional)"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  className="mt-3"
                  variant="success"
                  type="submit"
                  disabled={!isFormValid()}
                >
                  Login
                </Button>
              </Form>
            </Card>

            <Row className="py-3">
              <Col>
                New User? <Link to="/signup">Sign Up</Link>
              </Col>
            </Row>
          </Col>
        )}

        <Col md="4"></Col>
      </Row>
    </Container>
  );
}

export default Login;
