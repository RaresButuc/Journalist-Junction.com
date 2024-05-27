import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import Alert from "../components/Alert";
import DefaultURL from "../usefull/DefaultURL";
import CurrentUserInfos from "../usefull/CurrentUserInfos";

export default function ChangePasswordAuth() {
  const navigate = useNavigate();

  const currentUser = CurrentUserInfos();

  const [active, setActive] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const newPassword = useRef();
  const actualPassword = useRef();
  const confirmNewPassword = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${DefaultURL}/user/${currentUser?.id}/change-password`,
        {
          actualPassword: actualPassword.current.value,
          newPassword: newPassword.current.value,
        }
      );

      setTimeout(() => {
        navigate(`/profile/${currentUser?.id}`);
      }, 3000);
      setShowAlert(true);
      setAlertInfos(["Congratulations!", response.data, "success"]);
    } catch (err) {
      setShowAlert(true);
      setAlertInfos(["Be Careful!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const unlockSaveButton = () => {
    const newPassFieldValue = newPassword.current.value;
    const confirmPassFieldVaue = confirmNewPassword.current.value;

    setActive(
      newPassFieldValue === confirmPassFieldVaue && newPassFieldValue.length > 0
    );
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

      <form onSubmit={handleSubmit}>
        <div className="container py-2 mt-4">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="border border-danger rounded">
                <div
                  className="card-body p-4 text-center"
                  style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                >
                  <h1 className="mb-4">Change Password</h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4 mt-5">
                    <div className="form-floating">
                      <input
                        ref={actualPassword}
                        className="form-control"
                        type="password"
                        name="passwordInput"
                        placeholder="Password"
                        required
                      />
                      <label>Current Password</label>
                    </div>
                  </div>
                  <div className="form-outline mb-4 mt-5">
                    <div className="form-floating">
                      <input
                        ref={newPassword}
                        onChange={() => unlockSaveButton()}
                        className="form-control"
                        type="password"
                        name="passwordInput"
                        placeholder="Password"
                        required
                      />
                      <label>New Password</label>
                    </div>
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <div className="form-floating">
                      <input
                        ref={confirmNewPassword}
                        onChange={() => unlockSaveButton()}
                        className="form-control"
                        type="password"
                        name="passwordInput"
                        placeholder="Password"
                        required
                      />
                      <label>Confirm Password</label>
                    </div>
                  </div>

                  {active === true ? (
                    <button
                      className="btn btn-success btn-lg btn-block"
                      type="submit"
                    >
                      Save
                    </button>
                  ) : (
                    <div>
                      <div
                        id="Title-Help"
                        className="form-text"
                        style={{ color: "#fa6900" }}
                      >
                        *The Confirmation Password Should Be The Same As The New
                        Password!
                      </div>

                      <button
                        className="btn btn-danger btn-lg btn-block mt-3"
                        type="submit"
                        disabled
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2">
          Don't You Remember The Actual Password?{" "}
          <a href="/change-password-mail-request" style={{ color: "#f84e45" }}>
            Demand An Email Request!
          </a>
        </p>
      </form>
    </>
  );
}
