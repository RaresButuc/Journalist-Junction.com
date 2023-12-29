import CountrySelect from "../components/formComponents/CountrySelect";
import EmailInput from "../components/formComponents/EmailInput";
import NameInput from "../components/formComponents/NameInput";
import PasswordInput from "../components/formComponents/PasswordInput";
import PhoneNumberInput from "../components/formComponents/PhoneNumberInput";
import ShortDescriptionInput from "../components/formComponents/ShortDescriptionInput";

export default function RegisterPage() {
  return (
    <form>
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
                  <NameInput user={null} ref={null} id={"floatingNameValue"} />
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
  );
}
