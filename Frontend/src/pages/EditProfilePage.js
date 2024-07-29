import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import ErrorPage from "./ErrorPage";
import Alert from "../components/Alert";
import LoaderSaver from "../LoaderSaver";
import DefaultURL from "../usefull/DefaultURL";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import NameInput from "../components/accountFormComponents/NameInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import PhoneNumberInput from "../components/accountFormComponents/PhoneNumberInput";
import SocialMediaInput from "../components/accountFormComponents/SocialMediaInput";
import ProfileImageInput from "../components/accountFormComponents/ProfileImageInput";
import ShortDescriptionInput from "../components/accountFormComponents/ShortDescriptionInput";
import ProfileBackgroundImageInput from "../components/accountFormComponents/ProfileBackgroundImageInput";

export default function EditProfilePage() {
  const token = useAuthHeader();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const { id } = useParams();

  const photoRef = useRef(null);
  const photoBackgroundRef = useRef(null);

  const x = useRef(null);
  const facebook = useRef(null);
  const instagram = useRef(null);

  const currentUser = CurrentUserInfos();

  useEffect(() => {
    if (id && currentUser) {
      if (!isAuthenticated() || currentUser?.id !== Number(id)) {
        navigate("/an-error-has-occurred");
      }
    }
  }, [id, currentUser?.id]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(null);

  const onSubmit = async (values) => {
    try {
      setShowLoader(true);
      setLoaderMessage(
        "Your New Account Informations Is Being Saved.."
      );

      const headers = { Authorization: token() };
      if (!Number.isNaN(values.location.id)) {
        await axios.put(`${DefaultURL}/user/edit-user`, values, {
          headers,
        });

        if (photoRef.current && typeof photoRef.current.name === "string") {
          const formData = new FormData();
          formData.append("file", photoRef.current);
          await axios.put(`${DefaultURL}/user/set-profile-photo`, formData, {
            headers,
            "Content-Type": "multipart/form-data",
          });
        } else if (
          photoRef.current === null &&
          currentUser.profilePhoto !== null
        ) {
          await axios.put(`${DefaultURL}/user/delete-profile-photo`, null, {
            headers,
          });
        }

        if (
          photoBackgroundRef.current &&
          typeof photoBackgroundRef.current.name === "string"
        ) {
          const formData = new FormData();
          formData.append("file", photoBackgroundRef.current);
          await axios.put(`${DefaultURL}/user/set-background-photo`, formData, {
            headers,
            "Content-Type": "multipart/form-data",
          });
        } else if (
          photoBackgroundRef.current === null &&
          currentUser.profileBackgroundPhoto !== null
        ) {
          await axios.put(`${DefaultURL}/user/delete-background-photo`, null, {
            headers,
          });
        }

        setShowLoader(false);

        setShowAlert(true);
        setAlertInfos([
          "Congratulations!",
          "The Modifications Were Successfully Saved!",
          "success",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        setShowLoader(false);

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
      setShowLoader(false);

      setShowAlert(true);
      setAlertInfos([
        "Be Careful!",
        "An Error Has Occurred! Please Try Again Carefully!",
        "danger",
      ]);
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
      location: { id: parseInt(formData.get("countryInput"), 10) },
      phoneNumber: formData.get("phoneNumberInput"),
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

      {showLoader && <LoaderSaver message={loaderMessage} />}

      <div className="container-xl">
        {currentUser ? (
          <form onSubmit={onSave}>
            <div className="container py-2 mt-4">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div className="border border-danger rounded">
                    <div
                      className="card-body p-4 text-center"
                      style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                    >
                      <h1 className="mb-4">Edit Profile</h1>
                      <hr style={{ color: "#dc3545" }} />

                      <div className="form-outline mb-4 mt-5">
                        <NameInput
                          user={currentUser}
                          id={"floatingTitleValue"}
                        />
                      </div>

                      <div className="form-outline mb-4 mt-5">
                        <PhoneNumberInput
                          user={currentUser}
                          id={"floatingPhoneNumberValue"}
                        />
                      </div>

                      <div className="form-outline mb-4 mt-5">
                        <CountrySelect
                          user={currentUser}
                          id={"floatingCountryValue"}
                        />
                      </div>

                      <div className="form-outline mb-4 mt-5">
                        <ShortDescriptionInput
                          user={currentUser}
                          id={"floatingShortDescriptionValue"}
                        />
                      </div>

                      <div className="form-outline mb-5 mt-5">
                        <h4>Profile Picture</h4>
                        <ProfileImageInput userId={id} ref={photoRef} />
                      </div>

                      <div className="form-outline mb-5 mt-5">
                        <h4>Background Picture</h4>
                        <ProfileBackgroundImageInput
                          userId={id}
                          ref={photoBackgroundRef}
                        />

                        <div className="form-outline mb-5 mt-5">
                          <h4>Social Media</h4>
                          <SocialMediaInput
                            ref={instagram}
                            user={currentUser}
                            platform={"instagram"}
                            id={"floatingShortDescriptionValue"}
                          />
                          <SocialMediaInput
                            ref={facebook}
                            user={currentUser}
                            platform={"facebook"}
                            id={"floatingShortDescriptionValue"}
                          />
                          <SocialMediaInput
                            ref={x}
                            platform={"x"}
                            user={currentUser}
                            id={"floatingShortDescriptionValue"}
                          />
                        </div>
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
        ) : (
          <ErrorPage />
        )}
      </div>
    </>
  );
}
