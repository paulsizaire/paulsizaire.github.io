<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let unemployment = [];
    let us;
    let counties;
    let states;
    let statemap;
    let statemesh;
    let chart;
    let ecf;
    let processedData;
    let svgNode;
    let selectedState = "";
    let selectedCounty = "";
    let stateNames;
    let usnames = [];
    let uniqueStates = [];
    let counties_list = [];
    let counties_for_zoom;
    let counties_fips;

    let path;
    let width;
    let height;
    let initialScale;
    let offsetX;
    let offsetY;
    let svg;
    let zoom;

    onMount(async () => {
        const requestURL =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/unemployment-x.csv";
        unemployment = (await d3.csv(requestURL)).map((d) => ({
            ...d,
            rate: +d.rate,
        }));

        const requestURLUS =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/counties-albers-10m.json";
        us = await d3.json(requestURLUS);

        const requestURLECF =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/map_gdf.json";
        d3.json(requestURLECF).then((data) => {
            processedData = data.features.map((feature) => {
                return {
                    id: feature.properties.FIPS,
                    rate: Math.round(feature.properties.ECF),
                };
            });
        });
        ecf = await d3.json(requestURLECF);

        const requestURLUSNAMES =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/uscounties.csv";
        usnames = await d3.csv(requestURLUSNAMES);

        counties = topojson.feature(us, us.objects.counties);
        counties_for_zoom = new Map(
            counties.features.map((d) => [d.properties.name, d])
        );

        counties_fips = new Map(counties.features.map((d) => [d.id, d]));

        states = topojson.feature(us, us.objects.states);

        statemap = new Map(states.features.map((d) => [d.properties.name, d]));
        stateNames = Array.from(statemap.keys());

        statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
    });

    async function selectState(event) {
        selectedState = event.currentTarget.value;
        if (!selectedState) {
            // If no state is selected, clear the counties dropdown and return
            counties_list = [];
            return;
        }

        const data_state = usnames.filter(
            (row) => row.state_name === selectedState
        );
        data_state.sort(function (a, b) {
            return d3.ascending(a.county, b.county);
        });

        counties_list = data_state.map((row) => row.county);
    }

    function handleStateSelection(event) {
        selectedState = event.target.value;
        if (selectedState === "") {
            resetZoom();
            return;
        }

        const stateFeature = statemap.get(selectedState);
        zoomToFeature(stateFeature);
    }

    function handleCountySelection(event) {
        selectedCounty = event.target.value;

        const countyData = usnames.find(
            (row) =>
                row.county === selectedCounty &&
                row.state_name === selectedState
        );

        if (selectedCounty === "") {
            resetZoom();
            return;
        }

        const countyFeature = counties_fips.get(countyData.county_fips);
        zoomToFeature(countyFeature);
    }

    function zoomToFeature(feature) {
        const bounds = path.bounds(feature);
        const [[x0, y0], [x1, y1]] = bounds;

        const centerX = (x0 + x1) / 2;
        const centerY = (y0 + y1) / 2;

        const scale = 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height);

        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, (height - 200) / 2)
                    .scale(scale)
                    .translate(-centerX, -centerY)
            );
    }

    function resetZoom() {
        svg.transition()
            .duration(750)
            .call(
                zoom.transform,
                d3.zoomIdentity.translate(offsetX, offsetY).scale(initialScale)
            );
    }

    function Choropleth(
        data,
        {
            id = (d) => d.id, // given d in data, returns the feature id
            value = () => undefined, // given d in data, returns the quantitative value
            title, // given a feature f and possibly a datum d, returns the hover text
            format, // optional format specifier for the title
            scale = d3.scaleSequential, // type of color scale
            domain, // [min, max] values; input of color scale
            range = d3.interpolateBlues, // output of color scale
            width = window.innerWidth, // Change this line
            height = window.innerHeight - 50, // Change this line
            projection, // a D3 projection; null for pre-projected geometry
            features, // a GeoJSON feature collection
            featureId = (d) => d.id, // given a feature, returns its id
            borders, // a GeoJSON object for stroking borders
            outline = projection && projection.rotate
                ? { type: "Sphere" }
                : null, // a GeoJSON object for the background
            unknown = "#ccc", // fill color for missing data
            fill = "white", // fill color for outline
            stroke = "white", // stroke color for borders
            strokeLinecap = "round", // stroke line cap for borders
            strokeLinejoin = "round", // stroke line join for borders
            strokeWidth, // stroke width for borders
            strokeOpacity, // stroke opacity for borders
            padding = 150, // padding around the map when fitting the projection
        } = {}
        //selectedState
    ) {
        // Compute values.
        const N = d3.map(data, id);
        const V = d3.map(data, value).map((d) => (d == null ? NaN : +d));
        const Im = new d3.InternMap(N.map((id, i) => [id, i]));
        const If = d3.map(features.features, featureId);

        // Compute default domains.
        if (domain === undefined) domain = d3.extent(V);

        // Construct scales.
        const color = scale(domain, range);
        if (color.unknown && unknown !== undefined) color.unknown(unknown);

        // Compute titles.
        if (title === undefined) {
            format = color.tickFormat(100, format);
            title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
        } else if (title !== null) {
            const T = title;
            const O = d3.map(data, (d) => d);
            title = (f, i) => T(f, O[i]);
        }

        // Compute the default height. If an outline object is specified, scale the projection to fit
        // the width, and then compute the corresponding height.
        if (height === undefined) {
            if (outline === undefined) {
                height = 400;
            } else {
                const [[x0, y0], [x1, y1]] = d3
                    .geoPath(projection.fitWidth(width, outline))
                    .bounds(outline);
                const dy = Math.ceil(y1 - y0),
                    l = Math.min(Math.ceil(x1 - x0), dy);
                projection
                    .scale((projection.scale() * (l - 1)) / l)
                    .precision(0.2);
                height = dy;
            }
        }

        // Construct a path generator.
        const path = d3.geoPath(projection);

        const svg = d3
            .create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "width: 100%; height: auto; height: intrinsic;");

        if (outline != null)
            svg.append("path")
                .attr("fill", fill)
                .attr("stroke", "currentColor")
                .attr("d", path(outline));

        const g = svg.append("g");

        const bounds = path.bounds(features);

        const scaleX = (width - padding * 2) / (bounds[1][0] - bounds[0][0]);
        const scaleY = (height - padding * 2) / (bounds[1][1] - bounds[0][1]);
        const initialScale = Math.max(scaleX, scaleY);

        const offsetX =
            (width - initialScale * (bounds[1][0] + bounds[0][0])) / 2;
        const offsetY =
            (height - initialScale * (bounds[1][1] + bounds[0][1])) / 2 - 100;

        g.selectAll("path")
            .data(features.features)
            .join("path")
            .attr("fill", (d, i) => color(V[Im.get(If[i])]))
            .attr("d", path)
            .on("click", handleCountyClick)
            .append("title")
            .text((d, i) => title(d, Im.get(If[i])));

        if (borders != null)
            svg.append("path")
                .attr("pointer-events", "none")
                .attr("fill", "none")
                .attr("stroke", stroke)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-linejoin", strokeLinejoin)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-opacity", strokeOpacity)
                .attr("d", path(borders))
                .attr("id", "state-boundaries");

        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "width: 100%; height: auto; height: intrinsic;");

        const zoom = d3
            .zoom()
            .scaleExtent([1, 8])
            .extent([
                [0, 0],
                [width, height],
            ])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
                svg.select("#state-boundaries").attr(
                    "transform",
                    event.transform
                );
            });

        svg.call(zoom);

        svg.call(
            zoom.transform,
            d3.zoomIdentity.translate(offsetX, offsetY).scale(initialScale)
        );

        function handleCountyClick(event, d) {
            // Calculate the bounding box of the clicked county
            const bounds = path.bounds(d);
            const [[x0, y0], [x1, y1]] = bounds;

            // Calculate the center point of the bounding box
            const centerX = (x0 + x1) / 2;
            const centerY = (y0 + y1) / 2;

            // Calculate the scale needed to zoom in
            const scale = 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height);

            // Apply the zoom transformation
            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, (height - 200) / 2)
                        .scale(scale)
                        .translate(-centerX, -centerY)
                );
        }

        const chartProperties = {
            node: svg.node(),
            scales: { color },
            path,
            width,
            height,
            g,
            svg,
            zoom,
            initialScale,
            offsetX,
            offsetY,
        };

        return chartProperties;
    }

    $: if (processedData && statemap && counties && statemesh) {
        chart = Choropleth(
            processedData,
            {
                id: (d) => d.id,
                value: (d) => d.rate,
                scale: d3.scaleQuantize,
                domain: [1, 10],
                range: d3.schemeBlues[9],
                // title: (f, d) =>
                //     `${f.properties.name}, ${
                //         statemap.get(f.id.slice(0, 2)).properties.name
                //     }\n${d?.rate} gCO2/employee`,
                features: counties,
                borders: statemesh,
                width: 1400,
                height: 900,
            }
            //selectedState
        );
    }

    $: if (chart) {
        svgNode = chart.node;
        svg = chart.svg;
        path = chart.path;
        width = chart.width;
        zoom = chart.zoom;
        height = chart.height;
        initialScale = chart.initialScale;
        offsetX = chart.offsetX;
        offsetY = chart.offsetY;
        d3.select("#chart-container").node().appendChild(svgNode);
    }

    $: {
        if (usnames.length > 0) {
            usnames.sort(function (a, b) {
                return d3.ascending(a.state_name, b.state_name);
            });

            const stateSet = new Set();
            usnames.forEach((row) => {
                stateSet.add(row.state_name); // Replace 'state' with the appropriate column name for states
            });
            uniqueStates = Array.from(stateSet);
        }
    }
</script>

<select on:change={handleStateSelection} on:change={selectState}>
    <option value="" disabled selected>Select a state</option>
    {#each uniqueStates as state}
        <option value={state}>{state}</option>
    {/each}
</select>
{#if selectedState}
    <select on:change={handleCountySelection}>
        <option value="">Select a county</option>
        {#each counties_list as county}
            <option value={county}>{county}</option>
        {/each}
    </select>
{/if}
<div id="chart-container" />

<style>
    #chart-container {
        width: 100%;
        height: calc(
            100% - 50px
        ); /* 100% of the viewport height minus the 50px navigation bar height */
        margin: 0 auto;
        position: relative;
    }
</style>
