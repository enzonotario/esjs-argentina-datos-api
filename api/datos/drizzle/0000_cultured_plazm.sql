CREATE TABLE `feriados` (
	`id` integer PRIMARY KEY NOT NULL,
	`fecha` text,
	`tipo` text,
	`nombre` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feriados_fecha` ON `feriados` (`fecha`);