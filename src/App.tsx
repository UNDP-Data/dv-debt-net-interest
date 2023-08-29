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
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  useEffect(() => {
    Promise.all([
      csv('./data/debtNetInterest.csv'),
      csv('./data/categories.csv'),
    ]).then(([data, categories]) => {
      const newData = data.map(d => ({
        region: d.region,
        option: d.option,
        period: d.period,
        percentages: Object.entries(d).filter(k => Number(k[0])),
      }));
      // const categories = [...new Set(data.map(d => d.region))];
      setDebtNetInterest(newData as any);
      setCategoriesData(categories as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtNetInterest && categoriesData ? (
        <DebtInterestBars data={debtNetInterest} categories={categoriesData} />
      ) : null}
    </div>
  );
}

export default App;
