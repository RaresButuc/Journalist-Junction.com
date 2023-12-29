import Alert from "../components/Alert";
import NameInput from "../components/formComponents/NameInput";
import EmailInput from "../components/formComponents/EmailInput";
import PasswordInput from "../components/formComponents/PasswordInput";
import CountrySelect from "../components/formComponents/CountrySelect";
import PhoneNumberInput from "../components/formComponents/PhoneNumberInput";
import ShortDescriptionInput from "../components/formComponents/ShortDescriptionInput";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import DefaultURL from "../usefull/DefaultURL";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const onSubmit = async (values) => {
    try {
      if (values.country !== "") {
        const response = await axios.post(
          `${DefaultURL}/user/register`,
          values
        );

        if (response.data !== "") {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          setShowAlert(true);
          setAlertInfos([
            "Congratulations!",
            "You have been Succesfully Registered!",
            "success",
          ]);
        } else {
          setShowAlert(true);
          setAlertInfos([
            "Be Careful",
            "Email or UserName Already Registered!",
            "danger",
          ]);
          setTimeout(() => {
            setShowAlert(false);
          }, 2000);
        }
      } else {
        setShowAlert(true);
        setAlertInfos([
          "Be Careful",
          "The Residence Country Must Be Specified!",
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {
      name: formData.get("nameInput"),
      email: formData.get("emailInput"),
      password: formData.get("passwordInput"),
      phoneNumber: formData.get("phoneNumberInput"),
      country: formData.get("countryInput"),
      shortAutoDescription: formData.get("shortAutoDescriptionInput"),
    };
    onSubmit(registerData);
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
                  <h1 className="mb-4">Register</h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4 mt-5">
                    <NameInput
                      user={null}
                      ref={null}
                      id={"floatingNameValue"}
                    />
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <EmailInput
                      user={null}
                      ref={null}
                      id={"floatingEmailValue"}
                    />
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <PasswordInput
                      user={null}
                      ref={null}
                      id={"floatingPasswordValue"}
                    />
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <PhoneNumberInput
                      user={null}
                      ref={null}
                      id={"floatingPhoneNumberValue"}
                    />
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <CountrySelect
                      user={null}
                      ref={null}
                      id={"floatingCountryValue"}
                    />
                  </div>

                  <div className="form-outline mb-4 mt-5">
                    <ShortDescriptionInput
                      user={null}
                      ref={null}
                      id={"floatingShortDescriptionValue"}
                    />
                  </div>

                  <div className="form-outline mb-5 mt-5">
                    <h4>Profile Picture</h4>
                    <input class="form-control" type="file" id="formFile" />
                  </div>

                  <button
                    className="btn btn-success btn-lg btn-block"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2">
          Already a member?{" "}
          <a href="/register" style={{ color: "#f84e45" }}>
            Log In HERE
          </a>
        </p>
      </form>
    </>
  );
}
