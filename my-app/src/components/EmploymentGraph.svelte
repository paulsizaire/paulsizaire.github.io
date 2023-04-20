<script>

    import * as d3 from 'd3' ;

    let arcGenerator = d3.arc()
		.innerRadius(5)
		.outerRadius(50)
		.padAngle(.015)
		.cornerRadius(4);

    let pieAngleGenerator = d3.pie().value( d => d.count );
	
    // let sample_data = [
	// 	{animal: "cat", count: 1},
	// 	{animal: "dog", count: 4},
	// 	{animal: "rabbit", count: 5},
	// 	{animal: "hamster", count: 2},
	// 	{animal: "pony", count: 4}
	// ]
	export let sample_data
	
    let arc_data = pieAngleGenerator(sample_data);

	//console.log(JSON.stringify(arc_data));

	const arc_color = d3.scaleLinear()
		.range(["#faffd1", "#db921d", "#b86a04", "#a65d29" ,"#6e3003"])
		.domain([0,3,6,9,12]);

	let hovered = -1

	let recorded_mouse_position = {
		x: 0, y: 0
	};


	$: {
		// interactive data here
		// console.log(JSON.stringify(todo_record));		
	}


    
</script>

<div class="visualization">
    <svg width="500" height="500">
        <g transform="translate(350, 50)">
            <!-- Place for Pie -->
            {#each arc_data as data, index}
            <path 
                d={arcGenerator({
                    startAngle: data.startAngle,
                    endAngle: data.endAngle
                })}
				fill={index === hovered ? "brown": arc_color(data.data[0])}
				on:mouseover={(event) => { hovered = index;
							recorded_mouse_position = {
							x: event.pageX,
							y: event.pageY
						} }}
				on:mouseout={(event) => { hovered = -1; }}
            />
            {/each}
        </g>
    </svg>

	<div class={hovered === -1 ? "tooltip-hidden": "tooltip-visible"}
			style="left: {recorded_mouse_position.x + 40}px; top: {recorded_mouse_position.y + 40}px" >
		{#if hovered !== -1}
		   You're hovering!
		    <!-- 
			There are { arc_data[hovered].data[1] } 
			record{ arc_data[hovered].data[1]===1 ? "" : "s" } 
			where you have { arc_data[hovered].data[0] } todo items. -->
		{/if}
		
	

	</div>


</div>


<style>
	.visualization {
		font: 15px sans-serif;
		margin: auto;
		margin-top: 1px;
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
</style>