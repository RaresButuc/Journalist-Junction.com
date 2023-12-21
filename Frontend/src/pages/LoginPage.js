import { useNavigate } from "react-router-dom";
import DefaultURL from "../GlobalVariables";
import { useSignIn } from "react-auth-kit";
import axios, { AxiosError } from "axios";
import { useState } from "react";

import EmailInput from "../components/formComponents/EmailInput";
import PasswordInput from "../components/formComponents/PasswordInput";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const signIn = useSignIn();

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${DefaultURL}/user/authenticate`,
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
      email: formData.get("emailInput"),
      password: formData.get("passwordInput"),
    };
    onSubmit(authenticateData);
  };

  return (
    <form onSubmit={onSave}>
      <div className="container py-2">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="border border-danger">
              <div className="card-body p-4 text-center">
                <h1 className="mb-4">Log In</h1>
                <hr style={{ color: "red" }} />
                <div className="form-outline mb-4 mt-5">
                  {/* <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                  /> */}
                  <EmailInput
                    user={null}
                    ref={null}
                    id={"floatingEmailValue"}
                  />
                </div>

                <div className="form-outline mb-5">
                  {/* <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                  /> */}
                  <PasswordInput ref={null} id={"floatingPasswordValue"} />
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                >
                  Log in
                </button>

                <p className="mt-4">
                  Did you forget the password?{" "}
                  <a href="/forget-password" style={{ color: "#f84e45" }}>
                    Change it NOW
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2">
        Not a member yet?{" "}
        <a href="/register" style={{ color: "#f84e45" }}>
          Register NOW
        </a>
      </p>
    </form>
  );
}
