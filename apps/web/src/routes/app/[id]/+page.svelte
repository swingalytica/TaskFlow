<script lang="ts">
	import Sidebar from '$lib/components/sidebar-right.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.organization.name} - Kanlo</title>
</svelte:head>

<div class="flex h-screen">
	<Sidebar {data} />
</div>
