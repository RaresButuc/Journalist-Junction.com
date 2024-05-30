import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "../components/Alert";
import DefaultURL from "../usefull/DefaultURL";
import EmailInput from "../components/accountFormComponents/EmailInput";

export default function ForgetPasswordFormRequestPage() {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("emailInput");

    try {
      const response = await axios.put(
        `${DefaultURL}/user/forgotten-password?email=${email}`
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
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
        <div className="container py-2" style={{ marginTop: "10%" }}>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="border border-danger rounded">
                <div
                  className="card-body p-4 text-center"
                  style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                >
                  <h1 className="mb-4">Forgotten Password</h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4 mt-5">
                    <EmailInput id={"floatingEmailValue"} />
                  </div>

                  <button
                    className="btn btn-success btn-lg btn-block"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
                <div className="col"></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
