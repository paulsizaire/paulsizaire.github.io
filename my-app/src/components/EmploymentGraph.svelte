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

	const arc_color = d3
		.scaleLinear()
		.range(["#faffd1", "#db921d", "#b86a04", "#a65d29", "#6e3003"])
		.domain([0, 3, 6, 9, 12]);

	let hovered = -1;

	let recorded_mouse_position = {
		x: 0,
		y: 0,
	};
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
					fill={index === hovered ? "brown" : arc_color(data.data[0])}
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
		style="left: {recorded_mouse_position.x +
			40}px; top: {recorded_mouse_position.y + 40}px"
	>
		{#if hovered !== -1}
			<!-- You're hovering! -->
			{arc_data[hovered].data.industry}
		{/if}
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
</style>
