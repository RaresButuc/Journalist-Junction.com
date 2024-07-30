import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import TrendingPage from "./pages/TrendingPage";
import PhotosGallery from "./pages/PhotosGallery";
import EditArticlePage from "./pages/EditArticlePage";
import PostArticlePage from "./pages/PostArticlePage";
import ReadArticlePage from "./pages/ReadArticlePage";
import EditProfilePage from "./pages/EditProfilePage";
import SearchArticlePage from "./pages/SearchArticlePage";
import ChangePasswordAuth from "./pages/ChangePasswordAuth";
import ChangePasswordPageNoAuth from "./pages/ChangePasswordNoAuth";
import AcceptContribInvitePage from "./pages/AcceptContribInvitePage";
import ForgetPasswordFormRequestPage from "./pages/ForgetPasswordFormRequestPage";

import "./App.css";
import "./CSS/ArticleTitle&Undertitle.css";
import "./CSS/CommentSection.css";
import "./CSS/ErrorPageLoader.css";
import "./CSS/LoaderCoffee.css";
import "./CSS/LoaderSaver.css";
import "./CSS/ModalContainer.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ minHeight: "84vh" }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="*"
              element={
                <ErrorPage
                  message={"404 Not Found!"}
                  message2={"Return To Main Page"}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/edit/:id" element={<EditProfilePage />} />
            <Route
              path="/profile/change-password"
              element={
                <RequireAuth loginPath="/login">
                  <ChangePasswordAuth />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/change-password-mail-request"
              element={<ForgetPasswordFormRequestPage />}
            ></Route>
            <Route
              path="/change-forgotten-password/:uuid"
              element={<ChangePasswordPageNoAuth />}
            />
            <Route
              path="/contribution-invite/:uuid"
              element={<AcceptContribInvitePage />}
            />
            {/*
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
            */}
            <Route
              path="/article/read/:id"
              element={<ReadArticlePage />}
            ></Route>
            <Route path="/view-photos/:id" element={<PhotosGallery />}></Route>
            <Route
              path="/article/edit/:id"
              element={
                <RequireAuth loginPath="/login">
                  <EditArticlePage />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/article/post/:id"
              element={
                <RequireAuth loginPath="/login">
                  <PostArticlePage />
                </RequireAuth>
              }
            ></Route>
            <Route
              path="/article/search"
              element={<SearchArticlePage />}
            ></Route>
            <Route path="/article/trending" element={<TrendingPage />}></Route>
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
