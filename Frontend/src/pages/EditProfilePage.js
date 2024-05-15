import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import { useParams, useNavigate } from "react-router-dom";

import ErrorPage from "./ErrorPage";
import DefaultURL from "../usefull/DefaultURL";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import NameInput from "../components/accountFormComponents/NameInput";
import EmailInput from "../components/accountFormComponents/EmailInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import PhoneNumberInput from "../components/accountFormComponents/PhoneNumberInput";
import ProfileImageInput from "../components/accountFormComponents/ProfileImageInput";
import ShortDescriptionInput from "../components/accountFormComponents/ShortDescriptionInput";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const { id } = useParams();

  const photoRef = useRef(null);

  const currentUser = CurrentUserInfos();

  useEffect(() => {
    if (id && currentUser) {
      if (!isAuthenticated() || currentUser?.id !== Number(id)) {
        navigate("/an-error-has-occurred");
      }
    }
  }, [id, currentUser?.id]);

  const onSave = () => {
    return null;
  };

  return (
    <div className="container-xl">
      {currentUser ? (
        <form onSubmit={onSave}>
          <div className="container py-2 mt-4">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div className="border border-danger">
                  <div
                    className="card-body p-4 text-center"
                    style={{ backgroundColor: "rgba(255, 255, 255,0.5)" }}
                  >
                    <h1 className="mb-4">Edit Profile #{id}</h1>
                    <hr style={{ color: "#dc3545" }} />

                    <div className="form-outline mb-4 mt-5">
                      <NameInput user={currentUser} id={"floatingTitleValue"} />
                    </div>

                    <div className="form-outline mb-4 mt-5">
                      <EmailInput
                        user={currentUser}
                        id={"floatingEmailValue"}
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
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
