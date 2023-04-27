<script>
    import { closeModal } from "svelte-modals";

    // provided by <Modals />
    export let isOpen;

    export let title;
    export let message;
    export let step;

    console.log(step);
    
</script>

{#if isOpen}
    {#if step === 0}:
        <div role="dialog" class="modal1">
            <div class="contents">
                <h2>{title}</h2>
                <p>{message}</p>
                <div class="actions">
                    <button on:click={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {:else if step === 1}:
    <div role="dialog" class="modal1">
        <div class="contents">
            <h2>{title}</h2>
            <p>{message}</p>
            <div class="actions">
                <button on:click={closeModal}>OK</button>
            </div>
        </div>
    </div>
    {:else if step === 2}:
    <div role="dialog" class="modal1">
        <div class="contents">
            <h2>{title}</h2>
            <p>{message}</p>
            <div class="actions">
                <button on:click={closeModal}>OK</button>
            </div>
        </div>
    </div>

    {:else if step === 3}:
    <div role="dialog" class="modal1">
        <div class="contents">
            <h2>{title}</h2>
            <p>{message}</p>
            <div class="actions">
                <button on:click={closeModal}>OK</button>
            </div>
        </div>
    </div>

    {:else if step === 4}:
    <div role="dialog" class="modal2">
        <div class="contents">
            <h2>{title}</h2>
            <p>{message}</p>
            <div class="actions">
                <button on:click={closeModal}>OK</button>
            </div>
        </div>
    </div>
    {/if}
{/if}

<style>
    .modal1 {
        position: absolute;
        top: 50px;
        left: 200px;
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        /* allow click-through to backdrop */
        pointer-events: none;
    }

    .modal2 {
        position: absolute;
        top: 50px;
        left: 250px;
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        /* allow click-through to backdrop */
        pointer-events: none;
    }

    .contents {
        min-width: 240px;
        border-radius: 6px;
        padding: 16px;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        pointer-events: auto;
    }

    h2 {
        text-align: center;
        font-size: 24px;
    }

    p {
        text-align: center;
        margin-top: 16px;
    }

    .actions {
        margin-top: 32px;
        display: flex;
        justify-content: flex-end;
    }
</style>
