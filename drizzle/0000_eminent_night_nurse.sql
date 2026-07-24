CREATE TABLE "ExplorePage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"seoTitle" text,
	"seoDesc" text,
	"bannerImage" text,
	CONSTRAINT "ExplorePage_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "PageSection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pageId" uuid,
	"type" text NOT NULL,
	"sortOrder" integer NOT NULL,
	"content" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "explore_package_vehicles" (
	"packageId" text NOT NULL,
	"vehicleId" text NOT NULL,
	"basePrice" integer NOT NULL,
	CONSTRAINT "explore_package_vehicles_packageId_vehicleId_pk" PRIMARY KEY("packageId","vehicleId")
);
--> statement-breakpoint
CREATE TABLE "explore_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"citySlug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"durationDays" integer NOT NULL,
	"destinations" json,
	"includes" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Hotel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cityId" uuid,
	"stars" integer,
	"bookingApiId" text
);
--> statement-breakpoint
CREATE TABLE "VideoCollection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"sourceType" text DEFAULT 'MANUAL',
	"sourceUrl" text
);
--> statement-breakpoint
CREATE TABLE "Video" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collectionId" uuid,
	"youtubeId" text NOT NULL,
	"title" text,
	"thumbnailUrl" text
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"city" text,
	"duration" text,
	"priceStarting" text,
	"description" text,
	"image" text,
	"bannerImage" text,
	"pdfUpload" text,
	"whatsappNumber" text,
	"highlights" json,
	"inclusions" json,
	"exclusions" json,
	"terms" json,
	"pricing" json,
	"itinerary" json,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ziyarat_cities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"label" text,
	"image" text,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "ziyarat_points" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"descriptionEn" text,
	"descriptionAr" text,
	"images" json,
	"city" text
);
--> statement-breakpoint
CREATE TABLE "Vehicle" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"capacity" integer,
	"basePricePerKm" integer,
	"fixedDailyRate" integer
);
--> statement-breakpoint
CREATE TABLE "ziyarat_landmarks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"urduTitle" text,
	"slug" text NOT NULL,
	"city" text NOT NULL,
	"shortDescription" text,
	"fullHistory" text,
	"bannerImage" text,
	"images" json,
	"videoUrl" text,
	"location" text,
	"timings" text,
	"googleMapLink" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "ziyarat_landmarks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_pageId_ExplorePage_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."ExplorePage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "explore_package_vehicles" ADD CONSTRAINT "explore_package_vehicles_packageId_explore_packages_id_fk" FOREIGN KEY ("packageId") REFERENCES "public"."explore_packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "explore_package_vehicles" ADD CONSTRAINT "explore_package_vehicles_vehicleId_Vehicle_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Video" ADD CONSTRAINT "Video_collectionId_VideoCollection_id_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."VideoCollection"("id") ON DELETE no action ON UPDATE no action;