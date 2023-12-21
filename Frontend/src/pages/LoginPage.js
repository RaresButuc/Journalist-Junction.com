import { useNavigate } from "react-router-dom";
import DefaultURL from "../GlobalVariables";
import { useSignIn } from "react-auth-kit";
import axios, { AxiosError } from "axios";
import { useState, useRef } from "react";

import EmailInput from "../components/formComponents/EmailInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = useSignIn();

  const emailValue = useRef();
  const passwordValue = useRef();

  const onSubmit = async (values) => {
    setError("");

    try {
      const response = await axios.post(
        `${DefaultURL}/users/authenticate`,
        values
      );
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: values.email, role: response.data.role },
      });
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.message);
      else if (err instanceof Error) setError(err.message);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const authenticateData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    onSubmit(authenticateData);
  };

  return (
    <form onSubmit={onSave}>
      <div className="container py-3 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong">
              <div className="card-body p-5 text-center">
                <h1 className="mb-3">Log In</h1>

                <div className="form-outline mb-4">
                  {/* <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                  /> */}
                  <EmailInput
                    user={null}
                    ref={emailValue}
                    id={"floatingEmailValue"}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                >
                  Login
                </button>

                <p className="mt-4">
                  Did you forget the password?{" "}
                  <a href="/forget-password">Change it NOW</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p>
        Not a member yet? <a href="/register">Register NOW</a>
      </p>
    </form>
  );
}
