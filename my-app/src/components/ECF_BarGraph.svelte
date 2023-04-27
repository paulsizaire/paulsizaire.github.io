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

  $: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.1);
  $: xScale = scaleLinear()
    .domain([0, Math.max.apply(null, yDomain)])
    .range([0, innerWidth]);

  let hovered = -1;
  let recorded_mouse_position = {
    x: 0,
    y: 0,
  };

  const bar_colors = d3.scaleOrdinal(d3.schemeGreys).domain([0, 1, 2]);

  const barcolors = [
    { scale: "County", color: "black" },
    { scale: "State", color: "gray" },
    { scale: "National", color: "gray" },
  ];
</script>

<div class="visualization">
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

      {#each ecf_data as d, index}
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
          fill={index === hovered ? "brown" : barcolors[index].color}
          on:mouseover={(event) => {
            hovered = index;
            recorded_mouse_position = {
              x: event.pageX,
              y: event.pageY,
            };
          }}
          on:mouseout={(event) => {
            hovered = -1;
          }}
        />
      {/each}
    </g>
  </svg>

  <div
    class={hovered === -1 ? "tooltip-hidden" : "tooltip-visible"}
    style="left: {recorded_mouse_position.x -
      170}px; top: {recorded_mouse_position.y - 100}px"
  >
    {#if hovered !== -1}
      {ecf_data[hovered].ECF}
    {/if}
  </div>
</div>

<style>
  .visualization {
    font: 7px sans-serif;
    margin: auto;
    margin-top: 0.5px;
    text-align: middle;
  }

  /* dynamic classes for the tooltip */
  .tooltip-hidden {
    visibility: hidden;
    font-family: "Nunito", sans-serif;
    width: 200px;
    position: absolute;
  }

  .tooltip-visible {
    font: 15px sans-serif;
    font-family: "Nunito", sans-serif;
    visibility: visible;
    background-color: #f0dba8;
    border-radius: 10px;
    width: 100px;
    color: black;
    position: absolute;
    padding: 10px;
  }

  .xticks {
    transform: rotate(-90deg);
  }
</style>
