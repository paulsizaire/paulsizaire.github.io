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
    export let FIPScode;
    console.log("Data type of fips code: ", typeof FIPScode);
    console.log(FIPScode);
    let countyData = [];
    let emissions_data = [];
    let panel_data = [];
    let employment_data = [];
    let ecf_data = [];

    async function fetchEmissionsData() {
        console.log("Yooo! This is the fips: ", FIPScode);
        if (FIPScode) {
            emissions_data = await d3.csv(emissionsFile, function (d) {
                return {
                    industry: d.FIPS,
                    emissions_pct: d[FIPScode],
                };
            });
        }
    }

    async function fetchEmploymentData() {
        employment_data = await d3.csv(employmentFile, function (d) {
            return {
                industry: d.FIPS,
                employment_pct: d[FIPScode],
            };
        });
    }

    async function fetchECFData() {
        ecf_data = await d3.csv(ecfFile, function (d) {
            return {
                scale: d.FIPS,
                ECF: d[FIPScode],
            };
        });
    }

    async function fetchPanelData() {
        panel_data = await d3.csv(socioeconFile, function (d) {
            return {
                county: d.COUNTY,
                state: d.STATE,
                population: d.POP,
                mig_pop: d.MIG_TOT,
                FIPS: d.FIPS,
                poverty_rate: d.POV_RATE,
            };
        });
    }

    $: {
        FIPScode, fetchEmissionsData();
        FIPScode, fetchEmploymentData();
        FIPScode, fetchECFData();
        FIPScode, fetchPanelData();
    }

    $: {
        countyData = panel_data.filter((d) => d.FIPS === FIPScode);
        console.log("Another fips: ", FIPScode);
    }
</script>

<Box>
    <div class="row">
        <div class="column">
            {#each countyData as d}
                <!-- add more county level stats here if you want to -->
                <h1>{d.county}, {d.state}</h1>
                <p>Migrant Population: {Math.round(d.mig_pop)}</p>
                <p>Total Population: {Math.round(d.population)}</p>
                <p>Poverty Rate: {Math.round(d.poverty_rate * 100)} %</p>
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
                {#await fetchEmissionsData() then}
                    <EmissionsGraph bind:emissions_data />
                {/await}
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
