import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";


import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import EditReview from "./pages/Tables/EditReview";
import Services from "./pages/Services/Services";
import Skills from "./pages/skills/Skills";
import EditSkills from "./pages/skills/Editskills";

// import EditService from "./pages/Services/EditServices";
import EditServices from "./pages/Services/EditServices"
import AddSkills from "./pages/skills/Addskills";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
  
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

        
            <Route path="/profile" element={<UserProfiles />} />
           
            <Route path="/blank" element={<Blank />} />

            <Route path="/form-elements" element={<FormElements />} />

           
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/reviews/edit/:id" element={<EditReview />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/edit/:id" element={<EditServices />} />
            <Route path="/skills/edit/:id" element={<EditSkills/>} />
            <Route path="/skills/create" element={<AddSkills />} />
            <Route path="/skills" element={<Skills />} />


            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
