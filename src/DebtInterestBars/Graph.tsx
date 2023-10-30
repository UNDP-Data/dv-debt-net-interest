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
  data1: DebtNetInterestType[];
  option1: string;
  svgWidth1: number;
  svgHeight1: number;
}

export function Graph(props: Props) {
  const { data1, option1, svgWidth1, svgHeight1 } = props;
  const periods = ['2011-2013', '2021-2023'];
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const graphWidth = svgWidth1 - margin.left - margin.right;
  const graphHeight = svgHeight1 - margin.top - margin.bottom;
  const minParam = 0;
  const valueArray = data1
    .filter(d => d.option === option1)[0]
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

  const yAxisTicks = y.ticks().filter(tick => Number.isInteger(tick));

  const yAxis = axisLeft(y as any)
    .tickValues(yAxisTicks)
    .tickSize(-graphWidth)
    .tickFormat((d: any) => `${d}${option1 === 'Percentage' ? '%' : ''}`);
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
  }, [data1]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth1} ${svgHeight1}`}
          id='debtNetInterest'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
            <g className='yAxis' transform='translate(0,0)' />
            <g>
              {periods.map((k, j) => (
                <g key={j} transform={`translate(${j * 35},0)`}>
                  {data1
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
                        <text
                          className='barLabel'
                          x={x(d[0])}
                          dx={x.bandwidth() / 4}
                          y={y(d[1]) - 5}
                        >
                          {option1 === 'Percentage'
                            ? `${Number(d[1]).toFixed(1)}%`
                            : d[1]}
                        </text>
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
            {option1 === 'Percentage'
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
