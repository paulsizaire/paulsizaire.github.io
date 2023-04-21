<script>
    import Modal from "./Modal.svelte";
    import { onMount } from "svelte";
    let showModal = false;

    onMount(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoicHNpemFpcmUiLCJhIjoiY2xnY2pjMGw1MjFndTNnbzhjN2U0OTg2eiJ9.KJTEvvMq-wI3N3f_H0P3Rg";
        const map = new mapboxgl.Map({
            container: "map", // container ID
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: "mapbox://styles/mapbox/streets-v12", // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
        });
    });
</script>

<div class="row">
    <div class="column left">
        <div style="height: 500px">
            <h2>View</h2>
            <hr />
            <p>Some text..</p>
            <h2>Filter</h2>
            <hr />
            <p>Some text..</p>
            <h2>Search</h2>
            <hr />
            <p>Some text..</p>
        </div>

        <div>
            <button on:click={() => (showModal = true)}> show modal </button>

            <Modal bind:showModal>
                <h2 slot="header">
                    modal
                    <small><em>adjective</em> mod·al \ˈmō-dəl\</small>
                </h2>

                <ol class="definition-list">
                    <li>of or relating to modality in logic</li>
                    <li>
                        containing provisions as to the mode of procedure or the
                        manner of taking effect —used of a contract or legacy
                    </li>
                    <li>of or relating to a musical mode</li>
                    <li>of or relating to structure as opposed to substance</li>
                    <li>
                        of, relating to, or constituting a grammatical form or
                        category characteristically indicating predication
                    </li>
                    <li>of or relating to a statistical mode</li>
                </ol>

                <a href="https://www.merriam-webster.com/dictionary/modal"
                    >merriam-webster.com</a
                >
            </Modal>
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
</style>
