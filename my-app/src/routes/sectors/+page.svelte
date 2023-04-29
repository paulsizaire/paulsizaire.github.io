<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import PanelApp from "../../components/PanelApp.svelte";

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
  let migrantThreshold = 0;
  let color;
  let FIPScode;

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
      ECF_log10: +d.ECF_log10,
    }));

    const requestURLUS =
      "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/counties-albers-10m.json";
    us = await d3.json(requestURLUS);

    const requestURLECF =
      "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/kailingraham/my-app/static/map_gdf.json";
    d3.json(requestURLECF).then((data) => {
      processedData = data.features.map((feature) => {
        return {
          id: feature.properties.FIPS,
          ECF: Math.round(feature.properties.ECF * 100) / 100,
          ECF_log10: Math.round(feature.properties.ECF_log10 * 100) / 100,
          ECF_log10_std: feature.properties.ECF_log10_std,
          migrant_pop: Math.round(feature.properties.MIG_PERCENT * 100) / 100,
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

  // modal functions
  let step = 0;

    import { openModal } from "svelte-modals";
    import Modal from "./Modal.svelte";

    function handleClick() {
        if (step === 0 ) {

            openModal(Modal, {
                title: "Migrants and the Energy Transition",
                message: "Employment is the #1 reason for migration to the U.S. and energy transition disproportionately affects different industrial sectors. This map explores the geographical hot spots where mgirants are particularly vulnerable to the energy transition in order to inform policymakers on resource allocation.",
                step: step,
            });

        }

        if (step === 1) {

            openModal(Modal, {
                title: "Let's visit the county of Gaines, Texas",
                message: "Gaines, Texas has a higher vulnerability to climate policies and a high migrant population. Feel free to explore other socio-economic and demographic data in the county.",
                step: step,
            });

            handleCountySelection_modal();

        }

        if (step === 2) {

            openModal(Modal, {
                title: "Compare Gaines, Texas to Kings, New York",
                message: "Kings, New York has a lower vulnerability to climate policies despite their higher migrant population",
                step: step,
            });

            handleCountySelection_modal();

        }

        if (step === 3) {

            openModal(Modal, {
                title: "Finally, let's visit Pennington, Minnesota",
                message: "Pennington, Minnesota has a lower vulnerability to climate policies and a low migrant population.",
                step: step,
            });

            handleCountySelection_modal();

            }
        if (step === 4) {
            resetZoom()

            openModal(Modal, {
                title: "Play with the tool yourself!",
                message: "Use the side panel to search for your county and state and adjust the percentage of migrants in a county to visually identify where migrants are located and if that overlaps with higher vulnerability to climate policies and explore demographic data in each county",
                step: step,
            });


        if (step === 5) {
            resetZoom()
             }
        }
        step +=1;
}

    function resetStep() {
    step =0;
    selectedCounty = ""
    resetZoom()
    resetIsolation();
    }

    // selection functions
  function handleStateSelection(event) {
    selectedState = event.target.value;
    if (selectedState === "") {
      resetZoom();
      return;
    }

    const stateFeature = statemap.get(selectedState);
    resetIsolation();
    zoomToFeature(stateFeature);
  }

  function handleCountySelection(event) {
    selectedCounty = event.target.value;

    const countyData = usnames.find(
      (row) => row.county === selectedCounty && row.state_name === selectedState
    );

    if (selectedCounty === "") {
      resetZoom();
      resetIsolation();
      return;
    }

    const countyFeature = counties_fips.get(countyData.county_fips);

    if (countyFeature) {
      FIPScode = countyData.county_fips;
    } else {
      FIPScode = "";
    }

    resetIsolation();
    isolateFeature(countyFeature);
  }

  function handleCountySelection_modal(event) {
        if (event) {
            selectedCounty = event.target.value;
            console.log(selectedCounty)

            const countyData = usnames.find(
                (row) =>
                    row.county === selectedCounty &&
                    row.state_name === selectedState
            );

            if (selectedCounty === "") {
                resetZoom();
                resetIsolation();
                return;
            }

            const countyFeature = counties_fips.get(countyData.county_fips);

            if (countyFeature) {
            FIPScode = countyData.county_fips;
              } else {
              FIPScode = "";
                }
            resetIsolation();
            isolateFeature(countyFeature);


        }
        else {
            if (step === 1) {
                console.log('zoom to county')

                selectedCounty = "Gaines";
                selectedState = "Texas";

                const countyData = usnames.find(
                    (row) =>
                        row.county === selectedCounty &&
                        row.state_name === selectedState
                        );

                const countyFeature = counties_fips.get(countyData.county_fips);
                zoomToFeature(countyFeature);
                if (countyFeature) {
                  FIPScode = countyData.county_fips;
                    } else {
                    FIPScode = "";
                    }
                  resetIsolation();
                  isolateFeature(countyFeature);
                    }

            if (step === 2) {
                console.log('zoom to county')

                selectedCounty = "Kings";
                selectedState = "New York";

                const countyData = usnames.find(
                    (row) =>
                        row.county === selectedCounty &&
                        row.state_name === selectedState
                        );

                const countyFeature = counties_fips.get(countyData.county_fips);
                zoomToFeature(countyFeature);
                if (countyFeature) {
                    FIPScode = countyData.county_fips;
                    } else {
                    FIPScode = "";
                    }
                  resetIsolation();
                  isolateFeature(countyFeature);
                  }

            if (step === 3) {
                console.log('zoom to county')

                selectedCounty = "Pennington";
                selectedState = "Minnesota";

                const countyData = usnames.find(
                    (row) =>
                        row.county === selectedCounty &&
                        row.state_name === selectedState
                        );

                const countyFeature = counties_fips.get(countyData.county_fips);
                zoomToFeature(countyFeature);
                if (countyFeature) {
                FIPScode = countyData.county_fips;
                  } else {
                  FIPScode = "";
                    }
                resetIsolation();
                isolateFeature(countyFeature);
                }
        }
    }

  function zoomToFeature(feature) {
    const bounds = path.bounds(feature);
    const [[x0, y0], [x1, y1]] = bounds;

    const centerX = (x0 + x1) / 2;
    const centerY = (y0 + y1) / 2;

    const scale = 0.7 / Math.max((x1 - x0) / width, (y1 - y0) / height);

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, (height - 200) / 2)
          .scale(scale)
          .translate(-centerX, -centerY)
      );
  }

  // isolate counties/states by reducing opacity of non-selected counties/states
  function isolateFeature(feature) {
    chart.g
      .selectAll("path")
      .filter(function (d) {
        return d !== feature;
      })
      .attr("fill-opacity", 0.3);
  }

  function resetIsolation() {
    chart.g
      .selectAll("path")
      .attr("fill-opacity", 1);
  }

  function resetZoom() {
    svg
      .transition()
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
      mg_pop = (d) => d.migrant_pop,
      title, // given a feature f and possibly a datum d, returns the hover text
      format, // optional format specifier for the title
      // scale = d3.scaleLinear, // type of color scale
      domain, // [min, max] values; input of color scale
      range = d3.interpolateRgb, // output of color scale
      width = window.innerWidth, // Change this line
      height = window.innerHeight - 50, // Change this line
      projection, // a D3 projection; null for pre-projected geometry
      features, // a GeoJSON feature collection
      featureId = (d) => d.id, // given a feature, returns its id
      borders, // a GeoJSON object for stroking borders
      outline = projection && projection.rotate ? { type: "Sphere" } : null, // a GeoJSON object for the background
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
    const M = d3.map(data, mg_pop).map((d) => (d == null ? NaN : +d));
    const Im = new d3.InternMap(N.map((id, i) => [id, i]));
    const If = d3.map(features.features, featureId);

    // Compute default domains.
    if (domain === undefined) domain = [d3.min(V), d3.mean(V), d3.max(V)];
    // if (domain === undefined) domain = d3.extent(V);
    console.log(domain);

    // Construct scales.
    const color = d3
      .scaleLinear()
      .domain(domain)
      .range(range)
      .interpolate(d3.interpolateRgb);
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
        projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
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
      svg
        .append("path")
        .attr("fill", fill)
        .attr("stroke", "currentColor")
        .attr("d", path(outline));

    const g = svg.append("g");

    const bounds = path.bounds(features);

    const scaleX = (width - padding * 2) / (bounds[1][0] - bounds[0][0]);
    const scaleY = (height - padding * 2) / (bounds[1][1] - bounds[0][1]);
    const initialScale = Math.max(scaleX, scaleY);

    const offsetX = (width - initialScale * (bounds[1][0] + bounds[0][0])) / 2;
    const offsetY =
      (height - initialScale * (bounds[1][1] + bounds[0][1])) / 2 - 100;

    g.selectAll("path")
      .data(features.features)
      .join("path")
      .attr("fill", (d, i) => {
        const value = V[Im.get(If[i])];
        const migrantPercentage = M[Im.get(If[i])];
        const baseColor = d3.color(color(value));
        return migrantPercentage >= migrantThreshold
          ? baseColor
          : d3.rgb(baseColor.r, baseColor.g, baseColor.b, 0.1);
      })
      .attr("d", path)
      .on("click", handleCountyClick)
      .append("title")
      .text((d, i) => title(d, Im.get(If[i])));

    if (borders != null)
      svg
        .append("path")
        .attr("pointer-events", "none")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", path(borders))
        .attr("id", "state-boundaries");

    svg
      .attr("width", width)
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
        svg.select("#state-boundaries").attr("transform", event.transform);
      });

    svg.call(zoom);

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(offsetX, offsetY).scale(initialScale)
    );

    function handleCountyClick(event, d) {
      // Zoom to county
      zoomToFeature(d);

      isolateFeature(d);

      // Set the selectedState and selectedCounty
      const stateFIPS = d.id.slice(0, 2);
      const selectedStateInfo = states.features.find((d) => d.id === stateFIPS);
      selectedState = selectedStateInfo.properties.name;
      selectedCounty = d.properties.name;

      // Update the dropdowns with the selected state and county
      document.getElementById("state-select").value = selectedState;
      document.getElementById("county-select").value = selectedCounty;
      selectState({ currentTarget: { value: selectedState } });

      // Simulate an event to handle the county selection
      handleCountySelection({ target: { value: selectedCounty } });
    }

    const chartProperties = {
      node: svg.node(),
      scales: { color },
      path,
      width,
      height,
      g,
      V,
      M,
      Im,
      If,
      svg,
      zoom,
      color,
      initialScale,
      offsetX,
      offsetY,
    };

    return chartProperties;
  }

  $: if (processedData && statemap && counties && statemesh) {
    // console.log(d3.min(processedData.ECF_log10));
    chart = Choropleth(
      processedData,
      {
        id: (d) => d.id,
        value: (d) => d.ECF_log10,
        mg_pop: (d) => d.migrant_pop,
        // scale: d3.scaleLinear,
        domain: [0.253002, 0.946957, 1.303415, 1.574287, 3.306079],
        range: ["#005194", "#70a8ca", "#e0e0e0", "#dcab77", "#a42900"],
        // title: (f, d) =>
        //     `${f.properties.name}, ${
        //         statemap.get(f.id.slice(0, 2)).properties.name
        //     }\n${d?.ECF_log10} gCO2/employee`,
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
    color = chart.color;
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

  $: if (chart && migrantThreshold !== null && migrantThreshold !== undefined) {
    chart.g.selectAll("path").attr("fill", (d, i) => {
      const value = chart.V[chart.Im.get(chart.If[i])];
      const migrantPercentage = chart.M[chart.Im.get(chart.If[i])];
      const baseColor = d3.color(color(value));
      return migrantPercentage >= migrantThreshold
        ? baseColor
        : d3.rgb(baseColor.r, baseColor.g, baseColor.b, 0.1);
    });
    // console.log(migrantPercentage);
  }
</script>

<div class="panel">
  <div class="box">
    <h4>Filter</h4>
    <div class="box">
      <input
        type="range"
        min="0"
        max="0.5"
        step="0.01"
        bind:value={migrantThreshold}
      />
      <span>{migrantThreshold * 100}%</span>
    </div>
  </div>
  <div class="box">
    <h4>Search</h4>
    <div>
      <label for="state-select">State:</label>
      <select
        id="state-select"
        on:change={handleStateSelection}
        on:change={selectState}
      >
        <option value="" disabled selected>Select a state</option>
        {#each uniqueStates as state}
          <option value={state}>{state}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="county-select">County:</label>
      <select id="county-select" on:change={handleCountySelection}>
        <option value="" disabled selected>Select a county</option>
        {#each counties_list as county}
          <option value={county}>{county}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
{#if selectedCounty}
  <PanelApp {FIPScode} />
{/if}

<div id="chart-container" />

<div class="tutorial">
  {#if step === 0}
    <!-- <h2>Welcome to the Tutorial!</h2>
    <p>Step 1 content goes here...</p> -->
    <button on:click={handleClick}>Start</button>

  {:else if step === 1}
    <!-- <h2>Step 2: county!</h2>
    <p>zoom to county.</p> -->
    <button on:click={handleClick}>Next Step</button>
    
  {:else if step === 2}
    <!-- <h2>Step 3: Play with filter</h2>
    <p>Play w/ filter</p> -->
    <button on:click={handleClick}>Next Step</button>

  {:else if step === 3}
    <!-- <h2>Step 4: Play with filter</h2>
    <p>Play w/ filter</p> -->
    <button on:click={handleClick}>Next Step</button>

  {:else if step === 4}
    <!-- <h2>Step 4: Play with filter</h2>
    <p>Play w/ filter</p> -->
    <button on:click={handleClick}>Next Step</button>

  {:else if step === 5}
    <!-- <h2>Step 4: Play with filter</h2>
    <p>Play w/ filter</p> -->
    <button on:click={resetStep}>Reset</button>
  {/if}
</div>

<style>
  #chart-container {
    width: 100%;
    height: calc(
      100% - 50px
    ); /* 100% of the viewport height minus the 50px navigation bar height */
    margin: 0 auto;
    position: relative;
  }

  .panel {
    position: absolute;
    top: 60px;
    left: 10px;
    background-color: rgba(245, 245, 245, 0.675);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 3;
  }

  .box {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .tutorial {
  position: absolute;
  bottom: 20px;
  right: 50px;
  }
</style>
