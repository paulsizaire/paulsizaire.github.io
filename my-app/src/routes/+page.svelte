<script>
    import PanelApp from "../components/PanelApp.svelte";
    import mapboxgl from "mapbox-gl";
    import { onMount } from "svelte";
    import * as d3 from "d3";

    import { openModal } from "svelte-modals";
    import Modal from "./Modal.svelte";

    function handleClick() {
        openModal(Modal, {
            title: "The Employee Carbon Footprint Explained",
            message: "Here is an explanation of all our fantastic work",
        });
    }

    let map;
    let sliderValue = 0;

    let data = [];
    let uniqueStates = [];
    let counties = [];
    let selectedState = "";
    let selectedCounty = "";
    let FIPScode;

    onMount(async () => {
        const requestURL =
            "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/paul/my-app/static/uscounties.csv";
        data = await d3.csv(requestURL);
    });

    $: {
        if (data.length > 0) {
            data.sort(function (a, b) {
                return d3.ascending(a.state_name, b.state_name);
            });

            const stateSet = new Set();
            data.forEach((row) => {
                stateSet.add(row.state_name); // Replace 'state' with the appropriate column name for states
            });
            uniqueStates = Array.from(stateSet);
        }
    }

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
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedState}.json?types=region&access_token=pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Get the bounds of the state polygon
                const w = data.features[0].bbox[0];
                const s = data.features[0].bbox[1];
                const e = data.features[0].bbox[2];
                const n = data.features[0].bbox[3];

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

    function zoomToCounty(event) {
        selectedCounty = event.currentTarget.value;

        const countyData = data.find(
            (row) =>
                row.county === selectedCounty &&
                row.state_name === selectedState
        );

        if (countyData) {
            FIPScode = countyData.county_fips;
        } else {
            FIPScode = "";
        }

        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCounty}.json?types=district&access_token=pk.eyJ1Ijoia2FpbGluZ3JhaGFtIiwiYSI6ImNsZzg2d3gwMDAybWczbG1tenV5Z3hvZDMifQ.LbDSd2q9tN0i-rxqaN9VQA`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Get the bounds of the state polygon
                const w = data.features[0].bbox[0];
                const s = data.features[0].bbox[1];
                const e = data.features[0].bbox[2];
                const n = data.features[0].bbox[3];

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
        selectedState = event.currentTarget.value;
        console.log(selectedState);
        if (!selectedState) {
            // If no state is selected, clear the counties dropdown and return
            counties = [];
            return;
        }

        const data_state = data.filter(
            (row) => row.state_name === selectedState
        );
        data_state.sort(function (a, b) {
            return d3.ascending(a.county, b.county);
        });

        counties = data_state.map((row) => row.county);
    }

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
                    {#each uniqueStates as state}
                        <option value={state}>{state}</option>
                    {/each}
                </select>
                {#if selectedState}
                    <select on:change={zoomToCounty}>
                        <option value="">Select a county</option>
                        {#each counties as county}
                            <option value={county}>{county}</option>
                        {/each}
                    </select>
                {/if}

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
    {console.log(selectedCounty)}
    {#if selectedCounty}
        <PanelApp {FIPScode} />
    {/if}
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
