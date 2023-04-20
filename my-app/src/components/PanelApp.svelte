<script>
    import Box from "./Box.svelte";
    import * as d3 from 'd3' ;
    import EmploymentGraph from "./EmploymentGraph.svelte";
    import EmissionsGraph from "./EmissionsGraph.svelte";
    import { onMount } from 'svelte';

    //load socio-economic data
    let socioeconFile = "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/main/socioec_ECF.csv";
    
    //load emissions data
    let emissionsFile = "https://raw.githubusercontent.com/paulsizaire/paulsizaire.github.io/main/ACS/emissions.csv"
    
    //set stats you want to show
    let countyData = []
 
    let emissions_data = [];
    let panel_data = [];

    onMount(async function() {
        emissions_data = await 
        
        d3.csv(emissionsFile,
        function(d) {
            return {
                industry: d.FIPS,
                emissions_pct: d['1001']
                // FIPS: d.FIPS,
                // agriculture: d.TONCO2E_AG_PERCENT,
                // cn: d.TONCO2E_CN_PERCENT,
                // commercial: d.TONCO2E_COMM_PERCENT,
                // manufacturing:d.TONCO2E_MF_PERCENT,
                // mn_rest: d.TONCO2E_MN_REST_PERCENT,
                // power: d.TONCO2E_PWR_PERCENT,
                // oilgas: d.TONCO2E_OG_PERCENT,
                // coal: d.TONCO2E_COAL_PERCENT ,     
            }
        }
        )
        panel_data = await
        d3.csv(socioeconFile,
        function(d) {
            return {
                //...d,
                county: d.COUNTY,
                state: d.STATE,
                population: d.POP,
                mig_pop: d.MIG_TOT,
                FIPS: d.FIPS,
                poverty_rate: d.POV_RATE,
                
            }
        }
        )

        ;

        });




    
    //let pie_keys = ["TONCO2E_AG_PERCENT","TONCO2E_CN_PERCENT"]
    $: {
        //filter dataset to the county you care about (THIS SHOULD BE CHANGED LATER)
        countyData = panel_data.filter(d => d.FIPS === '01001')
        //emissions_county_data = emissions_data['01001']
        
    }; //lab 9

    //$: {console.log(countyData["population"])}

    
    
  
    let sample_data = [
		{animal: "cat", count: 1},
		{animal: "dog", count: 4},
		{animal: "rabbit", count: 5},
		{animal: "hamster", count: 2},
		{animal: "pony", count: 4}
	]


    
</script>

{#each emissions_data as d}
    {console.log(d)}
{/each}


<Box>

    <section class="graph">
        <EmissionsGraph  bind:emissions_data={emissions_data}/>
        <!-- <EmissionsGraph{emissions_data}/> -->

    </section>

    <section class="graph">
        <EmploymentGraph {sample_data}/>
    </section>

    {#each countyData as d} 
    <!-- add more county level stats here if you want to -->
        <h2>{d.county}, {d.state}</h2>
        <p>Migrant Population: {d.mig_pop}</p>
        <p>Total Population: {d.population}</p>
        <p>Poverty Rate: {d.poverty_rate}</p>
    {/each}



</Box>


<style>
    .graph {
        display: inline-block;
    }
</style>