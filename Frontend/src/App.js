import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ minHeight: "84vh", backgroundColor: "black" }}>
        <Router>
          <Routes>
            {/* <Route path="/" element={<HomePage />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/change-forget-password/:email"
              element={<ChangePasswordPageNoAuth />}
            />
            <Route path="/all-ads" element={<AdsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<OtherUserProfile />} />

            <Route path="/ad/:id" element={<AdDetail />} />
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
            ></Route>
            <Route
              path="post-ads"
              element={
                <RequireAuth loginPath="/login">
                  <PostOffer />
                </RequireAuth>
              }
            ></Route>*/}
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
