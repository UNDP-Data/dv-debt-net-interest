/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { DebtNetInterestType, CategoryData } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtNetInterestType[];
  categories: CategoryData[];
}

const GraphDiv = styled.div`
  flex-grow: 1;
  height: 800px;
  @media (max-width: 960px) {
    height: 70vw;
    max-height: 31.25rem;
  }
`;
const numberPercentOptions = ['Number', 'Percentage'];

export function DebtInterestBars(props: Props) {
  const { data, categories } = props;
  const [totalPercentSelection, setTotalPercentSelection] = useState('Number');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv]);
  return (
    <GraphDiv ref={graphDiv} style={{ maxWidth: '900px', maxHeight: '600px' }}>
      <div>
        <div className='margin-bottom-05'>
          <div>
            <p className='label undp-typography'>Select a category</p>
            <Select
              options={categories.map(d => ({
                label: d.description,
                value: d.description,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => {
                setCategorySelection(el);
              }}
              value={categorySelection}
            />
          </div>
        </div>
      </div>
      <div className='chart-container'>
        <div className='margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              Number of countries with net interest payments higher than 5 to 40
              percent of revenue today relative to a decade ago
            </h6>
            <p className='undp-typography small-font margin-bottom-01'>
              Years: 2000-2023
            </p>
          </div>
          <div className='flex-div flex-space-between flex-wrap'>
            <div className='legend-container'>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[0],
                  }}
                />
                <div className='small-font'>2011-2013</div>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[1],
                  }}
                />
                <div className='small-font'>2021-2023</div>
              </div>
            </div>
            <div>
              <Radio.Group
                defaultValue={totalPercentSelection}
                onChange={(el: RadioChangeEvent) => {
                  setTotalPercentSelection(el.target.value);
                }}
              >
                {numberPercentOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        {svgHeight && svgWidth ? (
          <Graph
            data={data.filter(
              d =>
                d.region === categorySelection &&
                d.option === totalPercentSelection,
            )}
            option={totalPercentSelection}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        ) : null}
        <p className='source'>Source:</p>
      </div>
    </GraphDiv>
  );
}
