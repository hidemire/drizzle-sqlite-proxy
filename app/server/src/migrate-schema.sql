CREATE TABLE `cities` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `city_id` integer,
  FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
