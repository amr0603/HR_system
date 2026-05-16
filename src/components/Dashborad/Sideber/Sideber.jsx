import styles from "./Sideber.module.css";
import { NavLink } from "react-router-dom";


export default function Sideber() {
    const links = [
        { icon: "fa-chart-line", title: "status" ,path:"/"},
        { icon: "fa-users", title: "Users Management", path: "/users" },
        { icon: "fa-building", title: "projects Management", path: "/projects" },
        { icon: "fa-building", title: "Developers Management", path: "/developers" },
        { icon: "fa-globe", title: "CMS"},
        { icon: "fa-message", title: "Live Chat" },
    ];

    return (
        <aside className={`min-vh-100 py-4 fs-4 ${styles.sideber}`}>

            <div className=" ms-5 fs-3 mb-3 px-4 ">Dashboard</div>
            <nav>
                
                {links.map((item, index ) => (

                    <NavLink 
                    to={item.path}  
                    key={index}className={` ${styles.navItem} py-4 px-3 d-flex align-items-center gap-3`}>
                        <i className={`fa-solid ${item.icon} ${styles.icon}`}></i>
                        <span className={`linkTitle ${styles.linkTitle}`}>{item.title}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
