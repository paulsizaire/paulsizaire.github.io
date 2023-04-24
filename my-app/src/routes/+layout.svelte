<script>
    import { Modals, closeModal } from "svelte-modals";
</script>

<nav style="height:50px">
    <ul>
        <li><a href="/">Map</a></li>
        <li><a href="/sectors">Sectors</a></li>
    </ul>
</nav>

<slot />

<Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        border: 1px solid #e7e7e7;
        background-color: #f3f3f3;
    }

    li {
        float: left;
    }

    li a {
        display: block;
        color: #666;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    /* Change the link color to #111 (black) on hover */
    li a:hover {
        background-color: #111;
    }

    .active {
        background-color: #04aa6d;
    }

    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
    }
</style>
