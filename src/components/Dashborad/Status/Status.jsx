import styles from "./Status.module.css";
import CardStatus from "../Ui/CardStatus/CardStatus";
export default function Status() {
  return (
    <>
      <section className="py-4">
        <div className="contauner">
          <div className={`${styles.row}`}>


            <div className={`${styles.card}  col-12 col-md-3`}  > 
               <i className="fa-regular fa-building"></i>
              <CardStatus counter={"120"} title ={"Porjects"}/></div>
            <div className={`${styles.card} col-12 col-md-3`}>
              <i class="fa-solid fa-users"></i>
               <CardStatus counter={"150"} title ={"Users"}/></div>
            <div className={`${styles.card} col-12 col-md-3`}>
              <i class="fa-brands fa-js"></i>
              <CardStatus counter={"200"} title ={"Developers"}/></div>
            <div className={`${styles.card} col-12 col-md-3`}>
              <i class="fa-brands fa-blogger"></i>
               <CardStatus counter={"500"} title ={"Blogs"}/></div>
       
          </div>
        </div>
      </section>
    </>
  );
}
