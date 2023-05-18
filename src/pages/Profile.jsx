import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [Age, setAge] = useState("");
  const [cPassword, setCPassword] = useState("");

  const submit = async () => {
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const r = await axios
        .put(
          "https://user-ptob.onrender.com/user/profile",
          {
            name,
            gender,
            Age,
            lastName,
          },
          config
        )
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    const config = {
      headers: { Authorization: `Bearer ${t}` },
    };

    if (t) {
      axios
        .get("https://user-ptob.onrender.com/user/profile", config)
        .then((r) => {
          const user = r.data;
          console.log(r);
          setName(user.name);
          setLastName(user.lastname);
          setGender(user.gender);
          setAge(user.age);
          setEmail(user.email);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    return navigate("/");
  };

  return (
    <div className="ui grid flex h-100">
      <div className="row">
        <div className="six wide column">
          <h2 style={{ textAlign: "center" }}>Profile</h2>
          {/* Form Starts */}
          <div className={`ui form`}>
            <div class="two fields">
              <div className={`field`}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div class="field">
                <label>Last Name</label>
                <input
                  placeholder="Last Name"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
            </div>
            <div class="field">
              <select
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value="">Gender</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            <div className={`field disabled`}>
              <label>E-mail</label>
              <input
                type="email"
                placeholder="joe@schmoe.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className={`field`}>
              <label>Age</label>
              <input
                type="text"
                onChange={(e) => setAge(e.target.value)}
                value={Age}
              />
            </div>
            <div className="ui submit button" onClick={submit}>
              Update
            </div>
            <div className="ui submit button red" onClick={signOut}>
              Sign Out
            </div>
          </div>
          {/* Form Ends */}
        </div>
      </div>
    </div>
  );
}
