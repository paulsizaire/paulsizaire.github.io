<script>
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
  let choro_polygons;

  fetch(ECFmapFile)
    .then((response) => response.json())
    .then((d) => (ECF_data = d.features))
    .then((d) => create_choro(d));

  //---------------DEFINE FUNCTIONS---------------//
  function projectPoint(lon, lat) {
    var point = map.project(new mapboxgl.LngLat(lon, lat));
    this.stream.point(point.x, point.y);
  }

  var transform = d3.geoTransform({ point: projectPoint });
  var path = d3.geoPath().projection(transform);

  function create_choro(ECF_data) {
    choro_polygons = container //featureElement
      .selectAll("path")
      .data(ECF_data)
      .enter()
      .append("path")
      .style("fill", "#808080");
    // .attr("stroke", "#808080")
    // .attr("stroke-width", 1)
    // .attr("fill-opacity", 0.4)
    // .attr("FIPS", function (d) {
    //   return d["FIPS"];
    // });
    update();
  }

  function update() {
    choro_polygons.attr("d", path);
  }
  // map.on("viewreset", update());
  // map.on("move", update());
  // map.on("moveend", update());
  // map.on("viewreset", update);
  // map.on("movestart", function () {
  //   container.classed("hidden", true);
  // });
  // map.on("rotate", function () {
  //   container.classed("hidden", true);
  // });
  map.on("move", function () {
    container.classed("hidden", true);
    update();
    
  });

  //---------------LOAD IN MAPBOX---------------//
  map.on("load", () => {
    map.addSource("totalECF_demo", {
      type: "vector",
      url: "mapbox://kailingraham.0pwui279", // albers USA: "mapbox://kailingraham.4tn9ydgc",
    });
  });
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
