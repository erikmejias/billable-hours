<script lang="ts">
	import type { SubmittedHistory } from './utils/Types';

	export let project: SubmittedHistory;
</script>

<div class="history-item">
	<div class="history-item_project-name">{project.project}</div>
	<div class="history-item_time">{`${project.time} hrs`}</div>
	<div class="history-item_description">
		{project.workDescription}
	</div>
	<!-- <div class="history-item_date">Oct 1, 2021</div> -->
	<div class="history-item_date">{project.date}</div>
</div>
