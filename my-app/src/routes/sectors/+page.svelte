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

    onMount(async () => {
        const requestURL =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/unemployment-x.csv";
        unemployment = (await d3.csv(requestURL)).map((d) => ({
            ...d,
            rate: +d.rate,
        }));
        console.log(unemployment);

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
        console.log("The ecf is: ", processedData);

        counties = topojson.feature(us, us.objects.counties);

        states = topojson.feature(us, us.objects.states);

        statemap = new Map(states.features.map((d) => [d.id, d]));

        statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

        chart = Choropleth(processedData, {
            id: (d) => d.id,
            value: (d) => d.rate,
            scale: d3.scaleQuantize,
            domain: [1, 10],
            range: d3.schemeBlues[9],
            title: (f, d) =>
                `${f.properties.name}, ${
                    statemap.get(f.id.slice(0, 2)).properties.name
                }\n${d?.rate} gCO2/employee`,
            features: counties,
            borders: statemesh,
            width: 975,
            height: 610,
        });

        console.log(chart);

        d3.select("#chart-container").node().appendChild(chart);
    });

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
            width = 640, // outer width, in pixels
            height, // outer height, in pixels
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
        } = {}
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

        g.selectAll("path")
            .data(features.features)
            .join("path")
            .attr("fill", (d, i) => color(V[Im.get(If[i])]))
            .attr("d", path)
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

        return Object.assign(svg.node(), { scales: { color } });
    }
</script>

<div id="chart-container" />

<style>
    #chart-container {
        /* Add your custom styles here */
        width: 100%;
        max-width: 960px;
        margin: 0 auto;
    }
</style>
