import { PacmanLoader } from "react-spinners";
import styles from "./loading.module.css";
const Loading = () => (
  <div className={styles.loadingContainer}>
    <PacmanLoader color="black" size={50} />
    <p >Loading, Please Wait...</p>
  </div>
);

export default Loading;
