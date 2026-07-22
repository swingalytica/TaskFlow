<script lang="ts" module>
	export type ColumnType = {
		_id: string;
		name: string;
		order: number;
	};
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus } from '@lucide/svelte';
	import type { ActionData } from '../../routes/app/[id]/$types';
	import Column from './Column.svelte';

	let { form }: { form: ActionData } = $props();

	const sorted_columns: ColumnType[] = $derived(
		[...(form?.board?.columns ?? [])].sort((a, b) => a.order - b.order)
	);

	let add_column_dialog_open = $state(false);
	let new_column_name = $state('');
</script>

<div class="flex h-full gap-4 overflow-x-auto p-6">
	{#each sorted_columns as column (column._id)}
		<Column {column} {form} />
	{/each}

	<Dialog.Root bind:open={add_column_dialog_open}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline', class: 'h-fit w-72 shrink-0' })}>
			<Plus class="h-4 w-4" />
			Add column
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-106.25">
			<Dialog.Header>
				<Dialog.Title>New column</Dialog.Title>
			</Dialog.Header>

			<form
				method="POST"
				action="?/add_column"
				class="flex flex-col gap-4"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						add_column_dialog_open = false;
						new_column_name = '';
					};
				}}
			>
				<input type="hidden" name="board_id" value={form?.board?._id} />

				<div class="flex flex-col gap-1.5">
					<Label for="name">Name</Label>
					<Input
						id="name"
						name="name"
						bind:value={new_column_name}
						required
						placeholder="Backlog"
					/>
				</div>

				<Dialog.Footer>
					<Button type="submit">Create column</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>
