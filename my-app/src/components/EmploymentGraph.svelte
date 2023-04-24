<script>
	import * as d3 from "d3";

	let arcGenerator = d3
		.arc()
		.innerRadius(5)
		.outerRadius(50)
		.padAngle(0.015)
		.cornerRadius(4);

	let pieAngleGenerator = d3.pie().value((d) => d.employment_pct);

	export let employment_data;

	$: {
		// interactive data here
		console.log(employment_data);
		// for (let key in countydata)  {
		// 	//console.log(countydata[key])
		// 	console.log(key)
		// }
	}

	let arc_data = pieAngleGenerator(employment_data);

	$: {
		arc_data = pieAngleGenerator(employment_data);
		console.log(JSON.stringify(arc_data));
	}

	const arc_color= d3
		.scaleOrdinal()
		.range(d3.schemeSet1)
		.domain([0,1,2,3,4,5,6,7]);

	let hovered = -1;

	let recorded_mouse_position = {
		x: 0,
		y: 0,
	};

	const legendData = [
  	{ label: 'Label 1', color: 'blue' },
  	{ label: 'Label 2', color: 'green' },
  	{ label: 'Label 3', color: 'red' }
	];

</script>

<!-- {#each emissions_county_data as d} 
	{console.log(d.FIPS)}
{/each} -->

<div class="visualization">
	<svg width="200" height="200">
		<g transform="translate(100, 100)">
			<!-- Place for Pie -->
			<!-- {arc_data} -->
			{#each arc_data as data, index}
				<path
					d={arcGenerator({
						startAngle: data.startAngle,
						endAngle: data.endAngle,
					})}
					fill={index === hovered ? "black" :  arc_color(data.data.industry)}
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
		style="left: {recorded_mouse_position.x -270
		}px; top: {recorded_mouse_position.y - 100}px"
	>
		{#if hovered !== -1}
			<!-- You're hovering! -->
			{arc_data[hovered].data.industry}
		{/if}
	</div>

	<div class="legend-container">
		<!-- {#each legendData as item (item.label)}
		  <div class="legend-item">
				<div class="legend-color" style="background-color: {item.color}"></div>
				<span class="legend-label">{arc_color(data.data.industry)}</span>
		  </div>
		{/each} -->
		{#each arc_data as data, index}
		  <div class="legend-item">
				<div class="legend-color" style="background-color: { arc_color(data.data.industry)}"></div>
				<span class="legend-label">{arc_data[index].data.industry }</span> 
		  </div>
		{/each}
	  </div>



</div>

<style>
	.visualization {
		font: 10px sans-serif;
		width: 200px;
		margin: auto;
		margin-top: 1px;
		text-align: middle;
		height: 90px;
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

	.legend-container {
  	position: absolute;
  	top: 250px;
  	right: 10px;
	}	
  /* Example: Style legend elements */
  .legend-container {
    /* Define container styles */
	font-size: 14px;
    color: #333;

  }

  .legend-item {
    /* Define item styles */
	display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .legend-color {
    /* Define color indicator styles */
	width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .legend-label {
    /* Define label styles */
	flex-grow: 1;
  }
</style>
