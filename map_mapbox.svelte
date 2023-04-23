<script>
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11", // "mapbox://styles/kailingraham/clgibhfvg00g001p9yiqpp4lx",
      center: [-98.5795, 39.828175], //-0.243, -0.773],
      zoom: 4, // starting zoom level
      minZoom: 3.57,
      maxZoom: 10,
    });
  
    //---------------DEFINE FUNCTIONS---------------//
    // function updateMapZoom(selectedState) {
    //   var zoom;
    //   var center;
    //   // Update zoom and center based on selected state
    //   if (selectedState === "california") {
    //     zoom = 5;
    //     center = [-119.4, 36.8];
    //   } else if (selectedState === "newyork") {
    //     zoom = 7;
    //     center = [-74, 40.7];
    //   }
    //   // Add more conditions for other states as needed
  
    //   // Set map's zoom and center
    //   map.setZoom(zoom);
    //   map.setCenter(center);
    // }
    function calculateZoomLevel(coordinates) {
      console.log(coordinates);
      // Create a new bounding box object with the selected coordinates
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(coordinates);
      console.log(bounds);
      // Get the width and height of the map's canvas
      const { width, height } = map.getCanvas();
  
      // Get the zoom level of the map at the current center
      const { zoom } = new mapboxgl.LngLatBounds().extend(coordinates).toArray();
  
      // Convert the northeast and southwest corners of the bounding box to screen coordinates
      const ne = map.project(bounds.getNorthEast());
      const sw = map.project(bounds.getSouthWest());
  
      // Calculate the northwest and southeast corners of the bounding box based on the northeast and southwest corners
      const nw = new mapboxgl.Point(ne.x, sw.y);
      const se = new mapboxgl.Point(sw.x, ne.y);
  
      // Define the padding between the map edge and the bounding box
      const padding = 40;
  
      // Calculate the x and y ranges of the bounding box on the screen
      const minX = Math.min(nw.x, sw.x);
      const maxX = Math.max(ne.x, se.x);
      const minY = Math.min(nw.y, ne.y);
      const maxY = Math.max(sw.y, se.y);
      const mapWidth = maxX - minX;
      const mapHeight = maxY - minY;
  
      // Calculate the scale factor to fit the bounding box on the screen
      const scaleX = (width - padding * 2) / mapWidth;
      const scaleY = (height - padding * 2) / mapHeight;
      const scale = Math.min(scaleX, scaleY);
  
      // Calculate the zoom level that will fit the bounding box on the screen
      const zoomLevel = zoom + Math.log2(scale);
  
      // Return the calculated zoom level
      return zoomLevel;
    }
  
    function updateMapZoom(coordinates, zoom) {
      map.flyTo({
        center: coordinates,
        zoom: zoom,
        essential: true,
      });
    }
  
    //---------------LOAD IN MAPBOX---------------//
    map.on("load", () => {
      // const layers = map.getStyle().layers;
      // // Find the index of the first text layer in the map style.
      // let firstAdminId;
      // for (const layer of layers) {
      //   if (layer["source-layer"] === "admin") {
      //     firstAdminId = layer.id;
      //     break;
      //   }
      // }
  
      map.addSource("totalECF_demo", {
        type: "vector",
        url: "mapbox://kailingraham.0pwui279", // albers USA: "mapbox://kailingraham.4tn9ydgc",
      });
  
      map.addLayer({
        id: "ECF_choro",
        type: "fill",
        source: "totalECF_demo",
        "source-layer": "totalECF_demo_gdf-btlqdq",
        layout: {},
        paint: {
          "fill-color": {
            property: "ECF_std_dev",
            stops: [
              [-2, "#2166ac"],
              [-1, "#67a9cf"],
              [0, "#f7f7f7"],
              [2, "#ef8a62"],
              [3, "#b2182b"],
              [4, "#6b0000"],
            ],
          },
          "fill-outline-color": "#89918b",
          "fill-opacity": 0.5, // customize the fill opacity
        },
        // firstAdminId,
      });
  
      var stateDropdown = document.getElementById("stateDropdown");
      stateDropdown.addEventListener("change", function () {
        var selectedState = stateDropdown.value;
        // Call a function to update the map zoom based on the selected state
        // updateMapZoom(selectedState);
  
        // Call Mapbox's Geocoding API to obtain the geographic coordinates of the selected state
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedState}.json?access_token=pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA`
        )
          .then((response) => response.json())
          .then((data) => {
            var coordinates = data.features[0].center; // Extract the geographic coordinates from the API response
            var zoom = calculateZoomLevel(coordinates); // Call a custom function to calculate the zoom level based on the coordinates
            updateMapZoom(coordinates, zoom); // Call a custom function to update the map zoom based on the calculated zoom level
          })
          .catch((error) => console.error(error));
      });
    });
  
    //---------------DEFINE VARIABLES---------------//
    let slider_popdens_init = 0;
    let slider_popdens = 0;
  
    $: {
      if (slider_popdens !== slider_popdens_init) {
        map.setFilter("ECF_choro", [
          ">=",
          ["get", "pop_per_sqmi"],
          slider_popdens,
        ]);
        slider_popdens_init = slider_popdens;
      }
    }
  </script>
  
  <main>
    <div class="overlay slider">
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
        <!-- Add more states as needed -->
      </select>
    </div>
  </main>