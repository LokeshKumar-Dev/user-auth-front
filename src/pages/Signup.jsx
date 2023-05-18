import React, { useState, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "n-s":
      return { ...state, nameStatus: "success" };
    case "n-e":
      return { ...state, nameStatus: "error" };
    case "e-s":
      return { ...state, emailStatus: "success" };
    case "e-e":
      return { ...state, emailStatus: "error" };
    case "p-s":
      return { ...state, passwordStatus: "success" };
    case "p-e":
      return { ...state, passwordStatus: "error" };
    case "pc-s":
      return { ...state, passwordConfirmStatusc: "success" };
    case "pc-e":
      return { ...state, passwordConfirmStatus: "error" };
    default:
      return state;
  }
};

const initalState = {
  nameStatus: "",
  emailStatus: "",
  passwordStatus: "",
  passwordConfirmStatus: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [state, dispatch] = useReducer(reducer, initalState);

  const submit = () => {
    if (name.length < 4) {
      return dispatch({ type: "n-e" });
    }
    dispatch({ type: "n-s" });
    if (password.length < 8) {
      return dispatch({ type: "p-e" });
    }
    dispatch({ type: "p-s" });
    if (cPassword !== password) {
      return dispatch({ type: "pc-e" });
    }
    dispatch({ type: "pc-s" });
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!validRegex.test(email)) {
      return dispatch({ type: "e-e" });
    }
    dispatch({ type: "e-s" });

    return signupUser();
  };

  async function signupUser() {
    const r = await axios
      .post("https://user-ptob.onrender.com/user", {
        name,
        email,
        password,
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
    if (r && r.status > 199) {
      setStatus("success");
      const myTimeout = setTimeout(() => {
        return navigate("/");
      }, 2000);
    }
  }

  return (
    <>
      <div className="ui grid flex h-100">
        <div className="row">
          <div className="six wide column">
            <h2 style={{ textAlign: "center" }}>Signup</h2>
            {/* Form Starts */}
            <div
              className={`ui form ${status} ${state.nameStatus} ${state.emailStatus} ${state.passwordStatus} ${state.passwordConfirmStatus}`}
            >
              <div className={`field ${state.nameStatus}`}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

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
              <div className={`field ${state.passwordStatus}`}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  onChange={(e) => setCPassword(e.target.value)}
                  value={cPassword}
                />
              </div>
              <div class="ui error message">
                <h5>Values:</h5>
                <p>
                  {state.nameStatus === "error"
                    ? "Name should have min of 4 letter"
                    : null}
                </p>
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
                <p>
                  {state.passwordConfirmStatus === "error"
                    ? "Password Confirm should be equal to Password"
                    : null}
                </p>
                <p>
                  {status === "error" ? "Sorry Email is already taken" : null}
                </p>
              </div>
              {status === "success" ? (
                <div class="ui success message">
                  <p>{"Successfully signed in! You can login now"}</p>
                </div>
              ) : null}
              <p>
                <Link to="/">Already have an account? Sign in</Link>
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
