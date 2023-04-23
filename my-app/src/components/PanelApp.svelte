<script>
    import Box from "./Box.svelte";
    import * as d3 from "d3";
    import EmploymentGraph from "./EmploymentGraph.svelte";
    import EmissionsGraph from "./EmissionsGraph.svelte";
    import ECF_BarGraph from "./ECF_BarGraph.svelte";
    import { onMount } from "svelte";

    //load socio-economic data
    let socioeconFile =
        "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/socioec_ECF.csv";

    //load emissions data
    let emissionsFile =
        "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/emissions.csv";

    //load employment data
    let employmentFile =
        "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/employment.csv";

    //load employment data
    let ecfFile =
        "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/socioeconomic-panel/ACS/ecf.csv";

    //set stats you want to show
    let FIPScode;
    let countyData = [];
    let emissions_data = [];
    let panel_data = [];
    let employment_data = [];
    let ecf_data = [];

    onMount(async function () {
        emissions_data = await d3.csv(emissionsFile, function (d) {
            return {
                industry: d.FIPS,
                emissions_pct: d["1001"], //change to FIPScode=
            };
        });

        employment_data = await d3.csv(employmentFile, function (d) {
            return {
                industry: d.FIPS,
                employment_pct: d["1001"], //change to FIPScode=
            };
        });

        ecf_data = await d3.csv(ecfFile, function (d) {
            return {
                scale: d.FIPS,
                ECF: d["1001"], //change to FIPScode=
            };
        });

        panel_data = await d3.csv(socioeconFile, function (d) {
            return {
                //...d,
                county: d.COUNTY,
                state: d.STATE,
                population: d.POP,
                mig_pop: d.MIG_TOT,
                FIPS: d.FIPS,
                poverty_rate: d.POV_RATE,
            };
        });
    });

    $: {
        //filter dataset to the county you care about (THIS SHOULD BE CHANGED LATER)
        countyData = panel_data.filter((d) => d.FIPS === "01001"); //change to FIPScode
        //emissions_county_data = emissions_data['01001']
    } //lab 9

    $: {
        console.log(ecf_data);
    }
</script>

<Box>
    <div class="row">
        <div class="column">
            {#each countyData as d}
                <!-- add more county level stats here if you want to -->
                <h1>{d.county}, {d.state}</h1>
                <p>Migrant Population: {d.mig_pop}</p>
                <p>Total Population: {d.population}</p>
                <p>Poverty Rate: {d.poverty_rate}</p>
            {/each}
        </div>
        <div class="column">
            <h2>Employment per Industry</h2>
            <div class="graph">
                <EmploymentGraph bind:employment_data />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="column">
            <h2>ECF Comparison</h2>
            <section class="bar">
                <ECF_BarGraph bind:ecf_data />
            </section>
        </div>
        <div class="column">
            <h2>Emissions per Industry</h2>
            <div class="graph">
                <EmissionsGraph bind:emissions_data />
            </div>
        </div>
    </div>
</Box>

<style>
    .row {
        display: flex;
        height: 250px;
    }
    .column {
        flex: 50%;
    }

    .graph {
        height: 100 px;
    }

    h1 {
        text-align: center;
    }

    h2 {
        text-align: center;
    }
</style>
