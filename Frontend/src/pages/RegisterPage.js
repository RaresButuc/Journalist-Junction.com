import Alert from "../components/Alert";

import NameInput from "../components/accountFormComponents/NameInput";
import EmailInput from "../components/accountFormComponents/EmailInput";
import PasswordInput from "../components/accountFormComponents/PasswordInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import PhoneNumberInput from "../components/accountFormComponents/PhoneNumberInput";
import SocialMediaInput from "../components/accountFormComponents/SocialMediaInput";
import ProfileImageInput from "../components/accountFormComponents/ProfileImageInput";
import ShortDescriptionInput from "../components/accountFormComponents/ShortDescriptionInput";
import ProfileBackgroundImageInput from "../components/accountFormComponents/ProfileBackgroundImageInput";

import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import DefaultURL from "../usefull/DefaultURL";

export default function RegisterPage() {
  const navigate = useNavigate();

  const photoRef = useRef(null);
  const photoBackgroundRef = useRef(null);

  const x = useRef(null);
  const facebook = useRef(null);
  const instagram = useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const onSubmit = async (values) => {
    try {
      if (!Number.isNaN(values.location.id)) {
        const token = await axios.post(`${DefaultURL}/user/register`, values);
        const headers = { Authorization: `Bearer ${token.data.token}` };

        if (photoRef.current !== null) {
          const formData = new FormData();
          formData.append("file", photoRef.current);

          await axios.put(`${DefaultURL}/user/set-profile-photo`, formData, {
            headers,
            "Content-Type": "multipart/form-data",
          });
        }
        if (photoBackgroundRef.current !== null) {
          const formData = new FormData();
          formData.append("file", photoBackgroundRef.current);
          await axios.put(`${DefaultURL}/user/set-background-photo`, formData, {
            headers,
            "Content-Type": "multipart/form-data",
          });
        }

        setTimeout(() => {
          navigate("/login");
        }, 2000);
        setShowAlert(true);
        setAlertInfos([
          "Congratulations!",
          "You have been Succesfully Registered!",
          "success",
        ]);

        await axios.post(
          `${DefaultURL}/mail/welcome/${values.email}/${values.name}`
        );
      } else {
        setShowAlert(true);
        setAlertInfos([
          "Be Careful!",
          "The Residence Country Must Be Specified!",
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (err) {
      setShowAlert(true);
      setAlertInfos(["Be Careful!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
      location: { id: parseInt(formData.get("countryInput"), 10) },
      shortAutoDescription: formData.get("shortAutoDescriptionInput"),
      socialMedia: {
        facebook: formData.get("facebook"),
        instagram: formData.get("instagram"),
        x: formData.get("x"),
      },
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
              <div className="border border-danger rounded">
                <div
                  className="card-body p-4 text-center"
                  style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                >
                  <h1 className="mb-4">Register</h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4 mt-5">
                    <NameInput
                      article={null}
                      ref={null}
                      id={"floatingTitleValue"}
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
                    <ProfileImageInput ref={photoRef} />
                  </div>

                  <div className="form-outline mb-5 mt-5">
                    <h4>Background Picture</h4>
                    <ProfileBackgroundImageInput ref={photoBackgroundRef} />
                  </div>

                  <div className="form-outline mb-5 mt-5">
                    <h4>Social Media</h4>
                    <SocialMediaInput ref={instagram} platform={"instagram"} />
                    <SocialMediaInput ref={facebook} platform={"facebook"} />
                    <SocialMediaInput ref={x} platform={"x"} />
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
          <a href="/login" style={{ color: "#f84e45" }}>
            Log In HERE
          </a>
        </p>
      </form>
    </>
  );
}
