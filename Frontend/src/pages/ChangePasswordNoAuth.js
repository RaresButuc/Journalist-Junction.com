import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";

import Alert from "../components/Alert";
import DefaultURL from "../usefull/DefaultURL";

export default function ChangePasswordPageNoAuth() {
  const { uuid } = useParams();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const [active, setActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", ""]);

  const [uuidEmail, setUuidEmail] = useState("");
  const [uuidExpired, setUUIDExpired] = useState(false);

  const newPassword = useRef();
  const confirmNewPassword = useRef();

  useEffect(() => {
    const fetchUUIDRequest = async () => {
      try {
        if (!isAuthenticated()) {
          const isUUIDAvailableByTime = await axios.get(
            `${DefaultURL}/changepassword/isTimeExpired/${uuid}`
          );

          const isUUIDAvailable = await axios.get(
            `${DefaultURL}/changepassword/isRequestExpired/${uuid}`
          );

          const isDataExpiredByTime = isUUIDAvailableByTime.data;
          const isDataExpired = isUUIDAvailable.data;

          setUUIDExpired(isDataExpiredByTime || isDataExpired);

          if (!isDataExpiredByTime && !isDataExpired) {
            const reqByUUID = await axios.get(
              `${DefaultURL}/changepassword/getEmail/${uuid}`
            );
            setUuidEmail(reqByUUID.data);
          }
        }
      } catch (err) {
        navigate("/an-error-has-occurred");
      }
    };

    signOut();
    fetchUUIDRequest();
  }, []);

  const unlockSaveButton = () => {
    const newPassFieldValue = newPassword.current.value;
    const confirmPassFieldVaue = confirmNewPassword.current.value;

    setActive(
      newPassFieldValue === confirmPassFieldVaue && newPassFieldValue.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPasswordForm = formData.get("newPasswordInput");

    try {
      const response = await axios.put(
        `${DefaultURL}/user/set-password?email=${uuidEmail}&uuid=${uuid}`,
        {},
        {
          headers: {
            newPassword: newPasswordForm,
          },
        }
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setShowAlert(true);
      setAlertInfos(["Congratulations!", response.data, "success"]);
    } catch (err) {
      setShowAlert(true);
      setAlertInfos(["Be Careful!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
        window.location.reload(false);
      }, 3000);
    }
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

      {!uuidExpired ? (
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
                          ref={newPassword}
                          onChange={() => unlockSaveButton()}
                          className="form-control"
                          type="password"
                          name="newPasswordInput"
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
                          *The Confirmation Password Should Be The Same As The
                          New Password!
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
        </form>
      ) : (
        <h1 className="article-title container-xl position-absolute top-50 start-50 translate-middle">
          This Link Is Not Available Anymore!
          <br />
          Please Demand a New Email Request From{" "}
          <a href="http://localhost:3000/change-password-mail-request">This Page</a>!
        </h1>
      )}
    </>
  );
}
