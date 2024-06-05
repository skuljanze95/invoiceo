CREATE TABLE `client` (
	`billing_email` text NOT NULL,
	`city` text NOT NULL,
	`client_description` text NOT NULL,
	`contact_email` text NOT NULL,
	`contact_first_name` text NOT NULL,
	`contact_last_name` text NOT NULL,
	`country` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`client` text NOT NULL,
	`state` text NOT NULL,
	`street_address` text NOT NULL,
	`user_id` text NOT NULL,
	`vat_number` text NOT NULL,
	`zip_code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice` (
	`billing_email` text,
	`client_id` text,
	`client_name` text,
	`created_at` integer NOT NULL,
	`due_date` integer,
	`id` text PRIMARY KEY NOT NULL,
	`invoice_details` text,
	`invoice_id` text,
	`issued_at` integer,
	`items` text,
	`paid_at` integer,
	`reference` text,
	`subtotal` integer,
	`tax` integer,
	`terms_and_conditions` text,
	`total` integer,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`bank_iban` text,
	`city` text,
	`country` text,
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`state` text,
	`street_address` text,
	`user_id` text NOT NULL,
	`vat_number` text,
	`zip_code` text
);
