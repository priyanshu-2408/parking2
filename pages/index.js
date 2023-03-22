import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./Layout/Loader";
import HomePage from "./pages/HomePage";
import SplitPage from "./pages/SplitPage";
import AuthLoginPage from "./pages/AuthLoginPage";
import AuthSignUpPage from "./pages/AuthSignUpPage";
import UserWindow from "./userWindow";
import OwnerDetailsPage from "./pages/ownerDetailsPage";

function Index() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplitPage />} />
        <Route path="/:authPerson" element={<HomePage />} />
        <Route path="/login/:person" element={<AuthLoginPage />} />
        <Route path="/signup/:person" element={<AuthSignUpPage />} />
        <Route path="/userWindow" exact element={<UserWindow />}/>
        <Route path="/ownerDetails" exact element={<OwnerDetailsPage/>} />
      </Routes>
    </Router>
  );
}

export default Index;
