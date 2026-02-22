-- CreateTable
CREATE TABLE "InstallationStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "sectionsInstalled" BOOLEAN NOT NULL DEFAULT false,
    "installedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InstallationStatus_shop_key" ON "InstallationStatus"("shop");
