<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Sidebar {data} />
