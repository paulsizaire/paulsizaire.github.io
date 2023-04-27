<div class="box">
	<slot />
</div>
th

<style>
	.box {
		position: absolute;
		bottom: 0;
		left: 2%;
		width: 600px;
		height: 400px;
		border: 1px solid #aaa;
		border-radius: 2px;
		z-index: 3;
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: 2px 2px 8px rgba(255, 255, 255, 1);
		padding: 1em;
		margin: 0 0 1em 0;
	}
</style>
