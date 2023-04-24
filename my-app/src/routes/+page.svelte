<script>
    import mapboxgl from "mapbox-gl";
    import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
    //import Modal from "./Modal.svelte";
    import { onMount } from "svelte";

    import { openModal } from "svelte-modals";
    import Modal from "./Modale.svelte";

    function handleClick() {
        openModal(Modal, { title: "Alert", message: "This is an alert" });
    }

    let map;
    let sliderValue = 0;

    onMount(() => {
        mapboxgl.accessToken =
            "pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA";
        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/light-v11", // "mapbox://styles/kailingraham/clgibhfvg00g001p9yiqpp4lx",
            center: [-98.5795, 39.828175], //-0.243, -0.773],
            zoom: 4, // starting zoom level
            minZoom: 3.57,
            maxZoom: 10,
        });

        map.on("load", () => {
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
                filter: [">=", ["get", "pop_per_sqmi"], parseInt(sliderValue)],
                // firstAdminId,
            });
        });
    });

    function zoomToState(event) {
        const selectedState = event.currentTarget.value;

        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedState}.json?type=region&access_token=pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Get the bounds of the state polygon
                const w = data.features[0].bbox[0];
                const s = data.features[0].bbox[1];
                const e = data.features[0].bbox[2];
                const n = data.features[0].bbox[3];
                // const statePolygon = data.features[0].geometry;
                // const stateBounds = statePolygon.coordinates.reduce(
                //     (bounds, coord) => {
                //         return bounds.extend(coord);
                //     },
                //     new mapboxgl.LngLatBounds()
                // );

                // Zoom to the bounds of the state polygon
                if (map) {
                    map.fitBounds(
                        [
                            [w, s],
                            [e, n],
                        ],
                        { padding: 20 }
                    );
                }
            });
    }

    async function selectState(event) {
        const selectedState = event.currentTarget.value;
        console.log(selectedState);
        if (!selectedState) {
            // If no state is selected, clear the counties dropdown and return
            counties = [];
            return;
        }

        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedState}.json?types=place&access_token=${mapboxgl.accessToken}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let counties;
                counties = data.features.map((feature) => ({
                    name: feature.text,
                }));
                console.log(counties);
            });
    }

    //     // Make an API call to get a list of counties for the selected state
    //     const response = await fetch(
    //         `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedState}.json?types=place&access_token=${mapboxgl.accessToken}`
    //     );
    //     const data = await response.json();

    //     // Populate the counties dropdown with options
    //     counties = data.features.map((feature) => ({
    //         name: feature.text,
    //     }));
    // }

    //---------------DEFINE VARIABLES---------------//
    function handleSliderInput(event) {
        sliderValue = event.target.value;
        console.log(map);
        if (map) {
            map.setFilter("ECF_choro", [
                ">=",
                ["get", "pop_per_sqmi"],
                parseInt(sliderValue),
            ]);
        }
    }
</script>

<div class="row">
    <div class="column left">
        <div class="container-side-panel">
            <div class="column-side-panel" style="background: red">
                <h2>View</h2>
                <hr />
                <p>Minimum population density: {sliderValue} per sq mi</p>
                <input
                    id="slider"
                    type="range"
                    min="0"
                    max="500"
                    value={sliderValue}
                    on:input={handleSliderInput}
                />
            </div>
            <div class="container-side-panel" style="background: blue">
                <h2>Filter</h2>
                <hr />
                <select on:change={zoomToState} on:change={selectState}>
                    <option value="" disabled selected>Select a state</option>
                    <option value="Alabama">Alabama</option>
                    <option value="Alaska">Alaska</option>
                    <option value="Arizona">Arizona</option>
                    <!-- more options here -->
                </select>

                <p>Some text..</p>
            </div>
            <div class="container-side-panel" style="background: green">
                <h2>Search</h2>
                <hr />
                <p>Some text..</p>
            </div>
        </div>

        <div>
            <button on:click={handleClick}>Open Modal</button>
        </div>
    </div>
    <div class="column right">
        <div id="map" />
    </div>
</div>

<style>
    .column {
        float: left;
    }

    .left {
        width: 25%;
        top: 50px;
        bottom: 0;
    }

    .right {
        width: 75%;
        top: 50px;
        bottom: 0;
    }

    .row:after {
        content: "";
        display: table;
        clear: both;
    }

    .wrapper {
        display: grid;
        grid-template-rows: 75% 25%;
        bottom: 0;
    }

    .controls {
        height: 75%;
    }

    .modal-box {
        height: 25%;
    }

    body {
        margin: 0;
        padding: 0;
    }

    #map {
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 100%;
    }

    .container-side-panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 500px;
    }

    .column-side-panel {
        flex: 1;
        color: white;
    }
</style>
