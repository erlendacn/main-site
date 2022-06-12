import React, { useContext } from "react";
import styles from "../../styles/GiveBlock.module.css";
import { WidgetContext } from "../main/layout";

export const GiveBlock: React.FC = () => {
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);

  return (
    <div className={styles.container}>
      <h3>Maksimer effekten av det du gir.</h3>
      <p className="inngress">Bruk Gi Effektivt.</p>
      <button className={styles.button} onClick={() => setWidgetOpen(true)}>
        Gi.
      </button>
    </div>
  );
};
