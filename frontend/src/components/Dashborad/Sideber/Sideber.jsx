import styles from "./Sideber.module.css";
import { NavLink } from "react-router-dom";


export default function Sideber() {
    const links = [
        { icon: "fa-table-cells-large", title: "Dashboard", path: "/status", end: true },
        { icon: "fa-users", title: "Employees", path: "/users" },
        { icon: "fa-calendar-check", title: "Attendance", path: "/attendance" },
        { icon: "fa-wallet", title: "Payroll", path: "/payroll" },
        { icon: "fa-file-lines", title: "Leave", path: "/leave" },
        { icon: "fa-gear", title: "Settings", path: "/settings" },
    ];

    return (
        <aside className={styles.sideber}>
            <div className={styles.brand}>
            </div>
            <nav className={styles.nav}>
                {links.map((item, index) => (
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
