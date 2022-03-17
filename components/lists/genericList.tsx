import style from "../../styles/Lists.module.css";
import GenericListRow from "./genericListRow";
import { ReactElement } from "react";

export type ListRow = {
  id: string;
  cells: string[];
  details: ReactElement;
}

export const GenericList: React.FC<{ 
    title: string, 
    supplementalInformation: string,
    headers: string[], 
    rows: ListRow[]
     }> = ({ 
    headers, 
    title, 
    supplementalInformation,
    rows }) => {
  return (
    <div className={style.gridContainer} key={title}>
      <section className={style.header}>
        <h2>{title}</h2>
        <p>{supplementalInformation}</p>
      </section>
      <section>
        <table className={style.table}>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          {rows
            .map(row => (
              <GenericListRow key={row.id} row={row}></GenericListRow>
            ))}
        </table>
      </section>
    </div>
  );
};