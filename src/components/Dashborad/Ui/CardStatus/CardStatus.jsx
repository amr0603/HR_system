import styles from './CardStatus.module.css'

export default function CardStatus({counter ,title}) {
  return (
    <>
                <div className={ `${styles.info} d-flex align-items-center`} >
                  <span className="counter ">{counter}</span>
                  <span className="title">{title}</span>
                </div>
    
    </>
  )
}
