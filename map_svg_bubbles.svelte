<script>
  import { svg_element } from "svelte/internal";

  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v11", // "mapbox://styles/kailingraham/clgibhfvg00g001p9yiqpp4lx",
    center: [-98.5795, 39.828175], //-0.243, -0.773],
    zoom: 4, // starting zoom level
    minZoom: 0,
    maxZoom: 10,
  });
  const container = d3
    .select(map.getCanvasContainer())
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("position", "absolute")
    .style("z-index", 2);
  map.addControl(new mapboxgl.NavigationControl());

  //---------------LOAD IN DATA---------------//
  let ECFmapFile =
    "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/main/map_gdf.json";
  let ECF_data = [];
  let county_bubbles;

  fetch(ECFmapFile)
    .then((response) => response.json())
    .then((d) => (ECF_data = d.features))
    .then((d) => create_county_bubbles(d));

  //---------------DEFINE FUNCTIONS---------------//
  // projects lon & lat points to position on screen
  function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
  }
  // create transform object that uses project function, and then
  // create pathGenerator object that uses transform object to
  // generate a d3 path on the screen.
  var transform = d3.geoTransform({ point: projectPoint });
  var path = d3.geoPath().projection(transform);

  // create circles for
  function create_county_bubbles(ECF_data) {
    county_bubbles = container
      .selectAll("circle")
      .data(ECF_data)
      .enter()
      .append("circle")
      .attr("r", function (d) {
        let mig_tot = d.properties.MIG_TOT;
        return scaleRadiusMigPop(mig_tot);
      })
      .style("fill", "#808080")
      .attr("stroke", "#808080")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4);
    update_position();
  }
  // scales circle radius based on migrant population
  function scaleRadiusMigPop(mig_tot, mig_tot_max = 50000) {
    const scaleRadius = d3.scaleSqrt().domain([0, mig_tot_max]).range([1, 12]);
    return scaleRadius(mig_tot);
  }

  // position circles using pathGenerator object
  function update_position() {
    county_bubbles
      .attr("cx", function (d) {
        return path.centroid(d)[0];
      })
      .attr("cy", function (d) {
        return path.centroid(d)[1];
      });
    // applySimulation(county_bubbles);
  }
  //---------------LOAD IN MAPBOX---------------//
  // map.on("load", () => {
  //   map.addSource("totalECF_demo", {
  //     type: "vector",
  //     url: "mapbox://kailingraham.0pwui279", // albers USA: "mapbox://kailingraham.4tn9ydgc",
  //   });
  // });

  // map.on("viewreset", function () {
  //   update_position();
  // });
  map.on("move", function () {
    container.classed("hidden", true);
    update_position();
    console.log(county_bubbles);
  });
  // map.on("moveend", update_position());
  //---------------ADD FORCE SIMULATION---------------//
  var simulation = d3
    .forceSimulation()
    .force(
      "collision",
      d3.forceCollide().radius(function (d) {
        return d.r;
      })
    )
    .force("x", null)
    .force("y", null);

  simulation.nodes(county_bubbles);

  simulation.on("tick", function () {
    container
      .selectAll("circle")
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  });

  // const applySimulation = (county_bubbles) => {
  //   var simulation = d3
  //     .forceSimulation(county_bubbles)
  //     .force(
  //       "collision",
  //       d3.forceCollide().radius(function (d) {
  //         return d.radius;
  //       })
  //     )
  //     .on("tick", ticked);

  while (simulation.alpha() > 0.01) {
    simulation.tick();
  }


</script>

<main>
  <!-- <div class="overlay slider">
    <label>Minimum population density: {slider_popdens} per sq mi</label>
    <input
      id="slider"
      type="range"
      min="0"
      max="500"
      bind:value={slider_popdens}
    />
  </div>
  <div class="overlay state-drop-down">
    <select id="stateDropdown">
      <option value="default">Select state</option>
      <option value="california">California</option>
      <option value="newyork">New York</option>
      < Add more states as needed -->
  <!-- </select>
  </div>  -->
</main>
