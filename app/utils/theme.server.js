import { THEME_FILES, FILENAMES } from "../sections/index.js";

/**
 * Get the main theme ID for the store
 *
 * Note: Using REST API as Theme Asset operations are still primarily supported via REST.
 * REST Admin API is legacy as of Oct 2024, but Theme/Asset resources are still functional.
 * Reference: https://shopify.dev/docs/api/admin-rest/latest/resources/theme
 */
export async function getMainThemeId(admin) {
  // Use REST resources from admin
  const themes = await admin.rest.resources.Theme.all({
    session: admin.session,
  });

  const mainTheme = themes.data.find((theme) => theme.role === "main");

  if (!mainTheme) {
    throw new Error("No main theme found");
  }

  return mainTheme.id;
}

/**
 * Install sections to the theme using REST API
 *
 * Note: Using REST Asset API for theme file operations.
 * While REST Admin API is legacy, the Asset resource is still the recommended
 * way to programmatically manage theme files for apps not using Theme App Extensions.
 *
 * Alternative: GraphQL Admin API themeFilesUpsert mutation requires special approval.
 * Reference: https://shopify.dev/docs/api/admin-rest/latest/resources/asset
 */
export async function installSections(admin, themeId) {
  const results = [];

  for (const file of THEME_FILES) {
    try {
      const asset = new admin.rest.resources.Asset({ session: admin.session });
      asset.theme_id = themeId;
      asset.key = file.filename;
      asset.value = file.content;

      await asset.save({ update: true });

      results.push({ filename: file.filename });
    } catch (error) {
      console.error(`Failed to upload ${file.filename}:`, error);
      throw new Error(`Failed to install ${file.filename}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Uninstall sections from the theme using REST API
 *
 * Note: Using REST Asset API for deleting theme files.
 * Alternative: GraphQL Admin API themeFilesDelete mutation requires special approval.
 * Reference: https://shopify.dev/docs/api/admin-rest/latest/resources/asset
 */
export async function uninstallSections(admin, themeId) {
  const results = [];

  for (const filename of FILENAMES) {
    try {
      await admin.rest.resources.Asset.delete({
        session: admin.session,
        theme_id: themeId,
        asset: {
          key: filename,
        },
      });

      results.push({ filename });
    } catch (error) {
      console.error(`Failed to delete ${filename}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}
