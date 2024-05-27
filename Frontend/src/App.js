import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import PhotosGallery from "./pages/PhotosGallery";
import EditArticlePage from "./pages/EditArticlePage";
import PostArticlePage from "./pages/PostArticlePage";
import ReadArticlePage from "./pages/ReadArticlePage";
import EditProfilePage from "./pages/EditProfilePage";
import SearchArticlePage from "./pages/SearchArticlePage";
import ChangePasswordAuth from "./pages/ChangePasswordAuth";

import "./App.css";

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
            {/* <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/change-forget-password/:email"
              element={<ChangePasswordPageNoAuth />}
            />
            <Route path="/all-ads" element={<AdsPage />} />
            <Route path="/contact" element={<Contact />} />*/}
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

            {/* <Route path="/ad/:id" element={<AdDetail />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
            <Route path="/:id/active" element={<ActiveAds />} />
            <Route path="/:id/pending" element={<PendingAds />} />
            <Route path="/:id/finalised" element={<FinalisedAds />} />
            <Route
              path="/ad/:id/rejectedworkers"
              element={<RejectedWorkersPage />}
            />
            <Route
              path="/changepassoword"
              element={<ChangePasswordPageAuth />}
            />
            <Route
              path="/rating/:from/:to"
              element={
                <RequireAuth loginPath="/login">
                  <RatingPage />
                </RequireAuth>
              }
            ></Route>*/}
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
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
