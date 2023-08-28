/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { DebtNetInterestType } from '../Types';

interface Props {
  data: DebtNetInterestType[];
  option: string;
  svgWidth: number;
  svgHeight: number;
}
/*
const XTickText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: none;
  }
`; */

/// two lines for mean and median
export function Graph(props: Props) {
  const { data, option, svgWidth, svgHeight } = props;
  const periods = ['2011-2013', '2021-2023'];
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  // const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  const minParam = 0;
  const valueArray = data
    .filter(d => d.option === option)[0]
    .percentages.map(k => Number(k[1]));
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  const xDomain = ['5', '10', '15', '20', '25', '30', '35', '40'];

  const x = scaleBand()
    .domain(xDomain as [])
    .range([0, graphWidth])
    .padding(0.3);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .tickFormat((d: any) => `${d}${option === 'Percentage' ? '%' : ''}`);
  const xAxis = axisBottom(x)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `> ${d}%`);
  useEffect(() => {
    const svg = select('#debtNetInterest');
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [data]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          id='debtNetInterest'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
            <g className='yAxis' transform='translate(0,0)' />
            <g>
              {periods.map((k, j) => (
                <g key={j} transform={`translate(${j * 35},0)`}>
                  {data
                    .filter(h => h.period === k)[0]
                    .percentages.map((d, i) => (
                      <g key={i} className={`percent${x(d[0])}_value${d[1]}`}>
                        <rect
                          x={x(d[0])}
                          y={y(d[1])}
                          width={x.bandwidth() / 2}
                          height={graphHeight - y(d[1])}
                          fill={UNDPColorModule.categoricalColors.colors[j]}
                          opacity={0.8}
                        />
                      </g>
                    ))}
                </g>
              ))}
            </g>
            <line
              x1={0}
              y1={graphHeight}
              x2={graphWidth}
              y2={graphHeight}
              stroke='#232E3D'
              strokeWidth={2}
            />
          </g>
          <text
            x={-graphHeight / 2}
            y='20'
            transform='rotate(-90)'
            textAnchor='middle'
          >
            {option === 'Percentage'
              ? 'Percentage of countries'
              : 'Number of countries'}
          </text>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
