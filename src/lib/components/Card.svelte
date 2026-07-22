<script lang="ts">
	let {
		card,
		column,
		index,
		cardDragStart,
		cardDragEnd
	}: {
		card: {
			_id: string;
			title: string;
			column: string;
			order: number;
		};
		column: string;
		index: number;
		cardDragStart: (card_id: string, column_id: string, index: number) => void;
		cardDragEnd: (card_id: string, column_id: string, order: number) => void;
	} = $props();
</script>

<div
	role="listitem"
	draggable="true"
	ondragstart={() => cardDragStart(card._id, column, index)}
	ondragend={() => cardDragEnd(card._id, column, index)}
	class="cursor-grab rounded-md border border-border bg-background p-3 text-sm text-foreground shadow-sm active:cursor-grabbing"
>
	{card.title}
</div>
