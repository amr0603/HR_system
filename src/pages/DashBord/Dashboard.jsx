
import { Routes, Route } from "react-router-dom";
import Footer from "../../components/Dashborad/Footer/Footer";
import Navbar from "../../components/Dashborad/Navbar/Navbar";
import Sideber from "../../components/Dashborad/Sideber/Sideber";
import UsersManagement from "./UsersManagement";
import ProjectsManagement from "./ProjectsManagement";
import StatusPage from "./StatusPage";
import TableDashBord from "../../components/Dashborad/Ui/CardStatus/TableDashBord/TableDashBord";
import FormDashBord from "../../components/Dashborad/Ui/CardStatus/FormDashBord/FormDashBord";
import DevelopersManagment from  "./DevelopersManagment";
function Dashboard() {
  return (
    <>
      <Navbar adminName="mohamed" />
      <div className="d-flex">
        <Sideber />   
      <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<StatusPage />} />

            <Route path="/users" element={<UsersManagement  />} > 
             <Route index element={<TableDashBord head="Users" title="User Management" />} />
             <Route path="add" element={<FormDashBord/>}/>
             </Route>


            <Route path="/projects" element={<ProjectsManagement />} >
              <Route index element={<TableDashBord head="Projects" title="Project Management" />} />
             <Route path="add" element={<FormDashBord/>}/>
             </Route>

             <Route path="/developers" element={<DevelopersManagment />} >
              <Route index element={<TableDashBord head="Developers" title="Developer Management" />} />
             <Route path="add" element={<FormDashBord/>}/>
             </Route>

          </Routes>
      </main>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
