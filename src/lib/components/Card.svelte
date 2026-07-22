<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	type CardType = {
		_id: string;
		title: string;
		description: string;
		column: string;
		order: number;
		labels: {
			_id: string;
			name: string;
			color: string;
		}[];
		due_date?: string;
	};

	let {
		card,
		column,
		index,
		cardDragStart,
		cardDragEnd
	}: {
		card: CardType;
		column: string;
		index: number;
		cardDragStart: (card_id: string, column_id: string, index: number) => void;
		cardDragEnd: (card_id: string, column_id: string, order: number) => void;
	} = $props();

	let dialog_open = $state(false);

	let title = $state(card.title);
	let description = $state(card.description);
	let due_date = $state(card.due_date ?? '');
	let labels = $state([...card.labels]);

	function open_dialog() {
		title = card.title;
		description = card.description;
		due_date = card.due_date ?? '';
		labels = [...card.labels];

		dialog_open = true;
	}
</script>

<button
	type="button"
	draggable="true"
	ondragstart={(event) => {
		event.stopPropagation();
		cardDragStart(card._id, column, index);
	}}
	ondragend={(event) => {
		event.stopPropagation();
		cardDragEnd(card._id, column, index);
	}}
	onclick={() => {
		open_dialog();
	}}
	class="w-full cursor-grab rounded-md border border-border bg-background p-3 text-left text-sm text-foreground shadow-sm active:cursor-grabbing"
>
	{card.title}
</button>

<Dialog.Root bind:open={dialog_open}>
	<Dialog.Content class="sm:max-w-xl">
		<form action="?/save_card" method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Edit card</Dialog.Title>
			</Dialog.Header>

			<div class="flex flex-col gap-6">
				<!-- Titel -->
				<div class="flex flex-col gap-1.5">
					<Label for="title">Title</Label>

					<Input bind:value={title} name="title" id="title" />
				</div>

				<!-- Beschreibung -->
				<div class="flex flex-col gap-1.5">
					<Label for="description">Description</Label>

					<textarea
						bind:value={description}
						class="min-h-32 rounded-md border border-border bg-background p-3 text-sm"
						placeholder="Add a description..."
						name="description"
						id="description"></textarea>
				</div>

				<!-- Labels -->
				<div class="flex flex-col gap-2">
					<Label>Labels</Label>

					<div class="flex flex-wrap gap-2">
						{#each card.labels as label}
							<span
								class="rounded px-2 py-1 text-xs text-white"
								style="background-color: {label.color}"
							>
								{label.name}
							</span>
						{/each}
					</div>

					<Button variant="outline">Add label</Button>
				</div>

				<!-- Fälligkeitsdatum -->
				<div class="flex flex-col gap-1.5">
					<Label for="due_date">Due date</Label>

					<Input type="date" id="due_date" name="due_date" bind:value={due_date} />
				</div>

				<!-- Aktivität -->
				<div class="flex flex-col gap-2">
					<Label>Activity</Label>

					<div class="rounded-md border border-border p-3 text-sm text-muted-foreground">
						No activity yet.
					</div>
				</div>
			</div>

			<Dialog.Footer>
				<Button type="submit">Save</Button>
			</Dialog.Footer>
			<input type="hidden" name="card_id" value={card._id} hidden />
		</form>
	</Dialog.Content>
</Dialog.Root>
