<script>
  import * as d3 from "d3";
  import { scaleBand, scaleLinear } from "d3-scale";

  export let ecf_data;

  let width = 300;
  let height = 150;

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  $: xDomain = ecf_data.map((d) => d.scale);
  $: yDomain = ecf_data.map((d) => +d.ECF);
  // $: xDomain = ecf_data.map((d) => d.ECF);
  // $: yDomain = ecf_data.map((d) => d.scale);

  $: console.log(xDomain);

  $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
  $: xScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerWidth]);
</script>

<svg {width} {height}>
  <g transform={`translate(${margin.left},${margin.top})`}>
    {#each xScale.ticks() as tickValue}
      <g transform={`translate(${xScale(tickValue)},0)`}>
        <line y2={innerHeight} stroke="black" />
        <text text-anchor="middle" dy=".7em" y={innerHeight + 3}>
          {tickValue}
        </text>
      </g>
    {/each}
    {#each ecf_data as d}
      <text
        text-anchor="end"
        x="-3"
        dy=".3em"
        y={yScale(d.scale) + yScale.bandwidth() / 2}
      >
        {d.scale}
      </text>
      <rect
        x="0"
        y={yScale(d.scale)}
        width={xScale(d.ECF)}
        height={yScale.bandwidth()}
      />
    {/each}
  </g>
</svg>
