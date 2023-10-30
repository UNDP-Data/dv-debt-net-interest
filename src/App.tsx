/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { DebtNetInterestType, CategoryData } from './Types';
import { DebtInterestBars } from './DebtInterestBars';
import './style.css';

function App() {
  const [debtNetInterest, setDebtNetInterest] = useState<
    DebtNetInterestType[] | undefined
  >();
  const [categoriesData1, setCategoriesData1] = useState<
    CategoryData[] | undefined
  >(undefined);
  const dataUrl1 =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-net-interest/main/public/data/';
  // const dataUrl1 = './data/';
  useEffect(() => {
    Promise.all([
      csv(`${dataUrl1}debtNetInterest.csv`),
      csv(`${dataUrl1}categories.csv`),
    ]).then(([data, categories]) => {
      const newData = data.map(d => ({
        region: d.region,
        option: d.option,
        period: d.period,
        percentages: Object.entries(d).filter(k => Number(k[0])),
      }));
      // const categories = [...new Set(data.map(d => d.region))];
      setDebtNetInterest(newData as any);
      setCategoriesData1(categories as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtNetInterest && categoriesData1 ? (
        <DebtInterestBars data={debtNetInterest} categories={categoriesData1} />
      ) : null}
    </div>
  );
}

export default App;
