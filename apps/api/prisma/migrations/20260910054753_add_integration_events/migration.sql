-- CreateEnum
CREATE TYPE "IntegrationEventLevel" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "integration_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "IntegrationEventLevel" NOT NULL,
    "integration" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integration_events_integration_idx" ON "integration_events"("integration");

-- CreateIndex
CREATE INDEX "integration_events_level_idx" ON "integration_events"("level");

-- CreateIndex
CREATE INDEX "integration_events_event_idx" ON "integration_events"("event");

-- CreateIndex
CREATE INDEX "integration_events_timestamp_idx" ON "integration_events"("timestamp");
