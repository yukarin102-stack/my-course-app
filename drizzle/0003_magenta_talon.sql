CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`source` text DEFAULT 'lead_magnet',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_email_unique` ON `leads` (`email`);