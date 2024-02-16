import axios from "axios";
import DefaultURL from "../usefull/DefaultURL";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import Alert from "../components/Alert";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import CategoriesSelect from "../components/articleFormComponents/CategoriesSelect";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [titleLive, setTitleLive] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    const getArticleById = async () => {
      const response = await axios.get(`${DefaultURL}/article/${id}`);
      const data = response.data;
      setCurrentArticle(data);
      setTitleLive(data.title);
    };

    getArticleById();
  }, []);

  const updateTitleLive = (e) => {
    console.log(e.target.value);
    setTitleLive(e.target.value);
  };

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
    <div className="container-xl mt-3">
      {showAlert && (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      )}

      <div className="row">
        <form onSubmit={onSave} className="container-xl col-xl-6 col-md-12">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-8 col-lg-6 col-xl-10">
              <div className="border border-danger">
                <div
                  className="card-body p-4 text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255,0.5)",
                    wordWrap: "break-word",
                  }}
                >
                  <h1 className="mb-4">
                    Edit Article <br></br>"{titleLive}"
                  </h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4">
                    <TitleInput
                      article={currentArticle}
                      id={"floatingNameValue"}
                      updateTitleLive={updateTitleLive}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <ThumbnailDescription
                      article={currentArticle}
                      id={"floatingThumbnailDescriptionValue"}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <CategoriesSelect id={"floatingCategoriesSelectValue"} />
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
        </form>

        <div className="col-xl-6 col-md-12">
          <BodyTextInput
            article={currentArticle}
            id={"floatingBodyTextValue"}
          />
        </div>
      </div>
    </div>
  );
}
