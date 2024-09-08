CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userName` text
);
--> statement-breakpoint
ALTER TABLE `to-dos` ADD `userId` integer;