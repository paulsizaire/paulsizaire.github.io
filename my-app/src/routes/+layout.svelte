<script>
    import { Modals, closeModal } from "svelte-modals";
</script>

<nav class="navbar">
    <ul>
        <li><a class="nav-link" href="/">Map</a></li>
        <li><a class="nav-link" href="/sectors">Sectors</a></li>
    </ul>
</nav>

<slot />

<Modals>
    <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<style>
    .navbar {
        height: 50px;
        background-color: lightblue;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    li {
        float: left;
    }

    .nav-link {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-weight: bold;
    }

    .nav-link:hover,
    .nav-link.active {
        text-decoration: underline;
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
