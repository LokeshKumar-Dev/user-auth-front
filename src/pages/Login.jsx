import React, { useState, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "e-s":
      return { ...state, emailStatus: "success" };
    case "e-e":
      return { ...state, emailStatus: "error" };
    case "p-s":
      return { ...state, passwordStatus: "success" };
    case "p-e":
      return { ...state, passwordStatus: "error" };

    default:
      return state;
  }
};

const initalState = {
  emailStatus: "",
  passwordStatus: "",
};

export default function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, dispatch] = useReducer(reducer, initalState);

  const submit = () => {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!validRegex.test(email)) {
      return dispatch({ type: "e-e" });
    }
    dispatch({ type: "e-s" });
    if (password.length < 8) {
      return dispatch({ type: "p-e" });
    }
    dispatch({ type: "p-s" });

    return loginUser();
  };

  async function loginUser() {
    const r = await axios
      .post("https://user-ptob.onrender.com/user/login", {
        email,
        password,
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
    // console.log(r.data.token)
    if (r && r.status > 199) {
      if (r.data.token) {
        localStorage.setItem("token", r.data.token);
      }
      setStatus("success");
      const myTimeout = setTimeout(() => {
        return navigate("/profile");
      }, 2000);
    }
  }

  return (
    <>
      <div className="ui grid flex h-100">
        <div className="row">
          <div className="six wide column">
            <h2 style={{ textAlign: "center" }}>Login</h2>
            {/* Form Starts */}
            <div
              className={`ui form ${status} ${state.nameStatus} ${state.emailStatus} ${state.passwordStatus} ${state.passwordConfirmStatus}`}
            >
              <div className={`field ${state.emailStatus}`}>
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="joe@schmoe.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className={`field ${state.passwordStatus}`}>
                <label>Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div class="ui error message">
                <h5>Values:</h5>
                <p>
                  {state.emailStatus === "error"
                    ? "Enter a valid Email Address"
                    : null}
                </p>
                <p>
                  {state.passwordStatus === "error"
                    ? "Password should have min of 8 length"
                    : null}
                </p>
                <p>{status === "error" ? "Invalid email or password" : null}</p>
              </div>
              {status === "success" ? (
                <div class="ui success message">
                  <p>{"Successfully Logged in!"}</p>
                </div>
              ) : null}
              <p>
                <Link to="/signup">Create Account?</Link>
              </p>
              <div className="ui submit button" onClick={submit}>
                Submit
              </div>
            </div>
            {/* Form Ends */}
          </div>
        </div>
      </div>
    </>
  );
}
