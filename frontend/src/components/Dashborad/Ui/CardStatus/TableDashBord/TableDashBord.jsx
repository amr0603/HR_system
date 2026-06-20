import styles from "./TableDashBord.module.css"

export default function TableDashBord() {
  return (
    <>
    <table className= {`  ${styles.table}`}>
      <tr className = {`  ${styles.column}`}>
        <th className= {`  ${styles.column}`}>Employee Name</th>
        <th className= {`  ${styles.column}`}>Department</th>
        <th className= {`  ${styles.column}`}>Attendance</th>
        <th className= {`  ${styles.column}`}>Payroll</th>
        <th className= {`  ${styles.column}`}>Leave</th>
      </tr>

      <tr className = {`  ${styles.column}`}>
        <td className= {`  ${styles.column}`}>John Doe</td>
        <td className= {`  ${styles.column}`}>Engineering</td>
        <td className= {`  ${styles.column}`}>95%</td>
        <td className= {`  ${styles.column}`}>$5000</td>
        <td className= {`  ${styles.column}`}>2 days</td></tr>

      <tr className = {`  ${styles.column}`}>
        <td className= {`  ${styles.column}`}>Jane Smith</td>
        <td className= {`  ${styles.column}`}>Marketing</td>
        <td className= {`  ${styles.column}`}>90%</td>
        <td className= {`  ${styles.column}`}>$4500</td>
        <td className= {`  ${styles.column}`}>5 days</td>
      </tr>

      <tr className = {`  ${styles.column}`}>
        <td className= {`  ${styles.column}`}>Michael Johnson</td>
        <td className= {`  ${styles.column}`}>Sales</td>
        <td className= {`  ${styles.column}`}>92%</td>
        <td className= {`  ${styles.column}`}>$4800</td>
        <td className= {`  ${styles.column}`}>3 days</td>
      </tr>
    </table>
    
    </>
  )
}
