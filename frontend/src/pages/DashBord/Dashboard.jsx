import { Routes, Route } from "react-router-dom";
import Footer from "../../components/Dashborad/Footer/Footer";
import Navbar from "../../components/Dashborad/Navbar/Navbar";
import Sideber from "../../components/Dashborad/Sideber/Sideber";
import Empolysse from "./Empolysse";
import Attendance from "./Attendance";
import Leave from "./Leave";
import Settings from "./settings";
import Payroll from "./Payroll";
import TableDashBord from "../../components/Dashborad/Ui/CardStatus/TableDashBord/TableDashBord";
import FormDashBord from "../../components/Dashborad/Ui/CardStatus/FormDashBord/FormDashBord";
import Status from "../../components/Dashborad/Status/Status";

function Dashboard() {
  return (
    <>
      <div className="d-flex h-100 w-100 overflow-hidden">
        <Sideber />
        <div className="d-flex flex-column w-100 overflow-hidden">
          <Navbar adminName=" Admin"/>
          <div className="d-flex h-100 w-100 overflow-auto">
                <Routes>
                  <Route index element={<Status />} />

                  <Route path="/users" element={<Empolysse />}>
                    <Route
                      index
                      element={
                        <TableDashBord head="Users" title="User Management" />
                      }
                    />
                    <Route path="add" element={<FormDashBord />} />
                  </Route>

                  <Route path="/attendance" element={<Attendance />}>
                    <Route
                      index
                      element={
                        <TableDashBord
                          head="Projects"
                          title="Project Management"
                        />
                      }
                    />
                    <Route path="add" element={<FormDashBord />} />
                  </Route>

                  <Route path="/payroll" element={<Payroll />}>
                    <Route
                      index
                      element={
                        <TableDashBord
                          head="Projects"
                          title="Project Management"
                        />
                      }
                    />
                    <Route path="add" element={<FormDashBord />} />
                  </Route>

                  <Route path="/leave" element={<Leave />}>
                    <Route
                      index
                      element={
                        <TableDashBord
                          head="Projects"
                          title="Project Management"
                        />
                      }
                    />
                    <Route path="add" element={<FormDashBord />} />
                  </Route>

                  <Route path="/settings" element={<Settings />}>
                    <Route
                      index
                      element={
                        <TableDashBord
                          head="Developers"
                          title="Developer Management"
                        />
                      }
                    />
                    <Route path="add" element={<FormDashBord />} />
                  </Route>
                </Routes>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
