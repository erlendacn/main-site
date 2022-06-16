import React from "react";
import styles from "../../styles/HTMLEmbed.module.css";

export interface NormalImage {
  code: string;
  grayscale?: boolean;
}
export const HTMLEmbed: React.FC<NormalImage> = ({ code, grayscale }) => {
  const classNames = [styles.wrapper];
  if (grayscale) classNames.push(styles.grayscale);

  return <div className={classNames.join(" ")} dangerouslySetInnerHTML={{ __html: code }}></div>;
};
