<script lang="ts">
	import Board from '$lib/components/board.svelte';
	import SidebarFilter from '$lib/components/sidebar-filter.svelte';
	import SidebarLeft from '$lib/components/sidebar-left.svelte';
	import type { Filter } from '$lib/types/filter';
	import { toast } from 'svelte-sonner';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filters: Filter = $state<Filter>({
		assignee: 'everyone',
		show_completed: true,
		labels: [] as string[],
		due_date: null
	});

	$effect(() => {
		if (form) {
			console.log('Form data:', form);
			if (form.error) {
				toast.error(form.error, { duration: 5000 });
			}
		}
	});
</script>

<svelte:head>
	<title>{data.organization.name} - Kanlo</title>
</svelte:head>

<div class="flex h-screen w-full">
	<SidebarLeft {data} />

	<main class="min-w-0 flex-1">
		<Board {data} bind:filters />
	</main>

	<SidebarFilter {data} bind:filters />
</div>
