import axios from "axios";
import { useState } from "react";
import Alert from "../components/Alert";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import DefaultURL from "../usefull/DefaultURL";

import EmailInput from "../components/accountFormComponents/EmailInput";
import PasswordInput from "../components/accountFormComponents/PasswordInput";

export default function LoginPage() {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

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
      setShowAlert(true);
      setAlertInfos(["Be Careful!", "Wrong Email or Password! Try Again!", "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
    <>
      {showAlert ? (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      ) : null}

      <form onSubmit={onSave}>
        <div className="container py-2 mt-4">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="border border-danger">
                <div
                  className="card-body p-4 text-center"
                  style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                >
                  <h1 className="mb-4">Log In</h1>
                  <hr style={{ color: "#dc3545" }} />
                  <div className="form-outline mb-4 mt-5">
                    <EmailInput
                      user={null}
                      ref={null}
                      id={"floatingEmailValue"}
                    />
                  </div>

                  <div className="form-outline mb-5">
                    <PasswordInput ref={null} id={"floatingPasswordValue"} />
                  </div>

                  <button
                    className="btn btn-success btn-lg btn-block"
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
    </>
  );
}
