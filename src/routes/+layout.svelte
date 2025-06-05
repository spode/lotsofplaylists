<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<!-- <ModeWatcher /> -->
<div
	class="grid h-full grid-rows-3 gap-3 lg:mx-auto lg:max-w-4/5 lg:grid-cols-2 lg:grid-rows-2 lg:py-10"
>
	{@render children()}
</div>
