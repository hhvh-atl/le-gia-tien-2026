CREATE TABLE `administrators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`group_name` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `administrators_email_unique` ON `administrators` (`email`);--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`registrant_name` text NOT NULL,
	`deceased_name` text NOT NULL,
	`relationship` text NOT NULL,
	`prayer_year` integer NOT NULL,
	`group_name` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
