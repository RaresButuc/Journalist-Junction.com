import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DefaultURL from "../usefull/DefaultURL";

import Alert from "../components/Alert";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
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
          }, 3000);
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
        }, 3000);
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
      country: formData.get("countryInput"),
      password: formData.get("passwordInput"),
      phoneNumber: formData.get("phoneNumberInput"),
      shortAutoDescription: formData.get("shortAutoDescriptionInput"),
    };
    onSubmit(registerData);
  };

  return (
    <div className="container-xl">
      {showAlert ? (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      ) : null}

      <div className="row">
        <form onSubmit={onSave} className="col-xl-6 col-md-12">
          <div className="py-2 mt-4">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="border border-danger">
                  <div
                    className="card-body p-4 text-center"
                    style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                  >
                    <h1 className="mb-4">
                      Edit Article <br></br>"..."
                    </h1>
                    <hr style={{ color: "#dc3545" }} />

                    <div className="form-outline mb-4 mt-5">
                      <TitleInput
                        article={null}
                        ref={null}
                        id={"floatingNameValue"}
                      />
                    </div>

                    <div className="form-outline mb-4 mt-5">
                      <ThumbnailDescription
                        article={null}
                        ref={null}
                        id={"floatingThumbnailDescriptionValue"}
                      />
                    </div>

                    <button
                      className="btn btn-success btn-lg btn-block"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="col-xl-6 col-md-12 form-outline mb-4 mt-5">
          <BodyTextInput
            article={null}
            ref={null}
            id={"floatingBodyTextValue"}
          />
        </div>
      </div>
    </div>
  );
}
