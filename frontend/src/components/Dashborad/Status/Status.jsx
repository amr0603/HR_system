import styles from "./Status.module.css";
import CardStatus from "../Ui/CardStatus/CardStatus";
import TableDashBord from "../Ui/CardStatus/TableDashBord/TableDashBord";

export default function Status() {
  return (
    <>
      <div className="w-100">
        <section className="py-4">
          <div className="d-flex justify-content-between m-md-5 bg:#0052FE ">
            <div className="text-dark">
              {" "}
              <span>Organizational Health</span>
              <p>Executive overview for August 2024</p>
            </div>
            <div>
              <button type="button">Export Report</button>
            </div>
          </div>

          <div className="contauner">
            <div className={`${styles.row}`}>
              <div className={`${styles.card}  col-12 col-md-3`}>
                <i class="fa-solid fa-users"></i>
                <CardStatus counter={"1,248"} title={"EMPLOYEES"} />
              </div>
              <div className={`${styles.card} col-12 col-md-3`}>
                <i class="fa-regular fa-calendar-check"></i>
                <CardStatus counter={"150"} title={"Atendance"} />
              </div>
              <div className={`${styles.card} col-12 col-md-3`}>
                <i class="fa-brands fa-wallet"></i>
                <CardStatus counter={"200"} title={"payrll"} />
              </div>
              <div className={`${styles.card} col-12 col-md-3`}>
                <i class="fa fa-gear"></i>
                <CardStatus counter={"500"} title={"leave"} />
              </div>
            </div>  
          </div>
          <TableDashBord />
        </section>
      </div>
  
    </>
  );
}
