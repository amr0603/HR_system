import Register from "../../components/Dashborad/Register/Register";
import Login from "../../components/Login/Login";
import {Routes, Route} from 'react-router-dom'


export default function Authregister() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
    </>
  )
}
