import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";

import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

import ContactUs from "./pages/Contact/ContactUs"
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import EditReview from "./pages/Tables/EditReview";
import AllEmployees from "./pages/Employees/AllEmployees";
import EditEmployee from "./pages/Employees/EditEmployee";
import ReachUsTable from "./pages/Reachus/Reachus";
import NewsletterSubscribers from "./pages/NewsLetter/Newsltter";
import ProtectedRoute from "./hooks/protectedRoute";
import Services from "./pages/Services/Services";
import EditServices from "./pages/Services/EditServices"
import AddSkills from "./pages/skills/Addskills";
import EditSkills from "./pages/skills/Editskills";
import Skills from "./pages/skills/Skills";
import Addservices from "./pages/Services/Addservices";
import ITServices from "./pages/ITServices/ITServices";
import EditITServices from "./pages/ITServices/EditITServices"
import AddITServices from "./pages/ITServices/AddITServices";



export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/form-elements" element={<FormElements />} />
           

           <Route path="/it-services" element={<ITServices />} />
          <Route path="/it-services/edit/:id" element={<EditITServices />} />
          <Route path="/it-services/create" element={<AddITServices />} />
           
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/reviews/edit/:id" element={<EditReview />} />
            <Route path="/contact/contact_us" element={<ContactUs />} />
            <Route path="/newLetter/all" element={<NewsletterSubscribers />} />
            <Route path="/employees" element={<AllEmployees/>}/>
            <Route path="/employees/edit/:id" element={<EditEmployee />} />
            <Route path="/reachus" element={<ReachUsTable/>}/>
            <Route path="/news-letter" element={<NewsletterSubscribers/>}/>
            <Route path="/services" element={<Services/>}/>
           
            <Route path="/services/edit/:id" element={<EditServices />} />
            <Route path="/skills" element={<Skills/>}/>
            <Route path="/skills/edit/:id" element={<EditSkills />} />
            <Route path="/skills/create" element={<AddSkills/>} />
          
            <Route path="/services/create" element={<Addservices />} />
          

            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
          </Route>
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}