import { THEME_FILES, FILENAMES } from "../sections/index.js";

/**
 * Get the main theme ID for the store using GraphQL
 */
export async function getMainThemeId(admin) {
  const response = await admin.graphql(
    `#graphql
      query getThemes {
        themes(first: 250) {
          nodes {
            id
            name
            role
          }
        }
      }
    `,
  );

  const data = await response.json();

  // Check for GraphQL errors
  if (data.errors) {
    console.error("GraphQL errors:", data.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  if (!data.data || !data.data.themes) {
    console.error("Unexpected response format:", data);
    throw new Error("Unable to fetch themes - unexpected response format");
  }

  const themes = data.data.themes.nodes;
  console.log("All themes:", themes);

  const mainTheme = themes.find((theme) => theme.role === "MAIN");

  if (!mainTheme) {
    throw new Error("No main theme found");
  }

  // The GraphQL ID is like: gid://shopify/OnlineStoreTheme/123456789
  // REST API needs just the numeric ID
  const themeId = mainTheme.id.split("/").pop();
  console.log("Main theme found:", {
    fullId: mainTheme.id,
    numericId: themeId,
    name: mainTheme.name,
  });
  return themeId;
}

/**
 * Install sections to the theme using REST API via fetch
 * Note: Using REST API directly since theme file operations require REST
 */
export async function installSections(session, themeId) {
  const results = [];

  console.log("=== INSTALL SECTIONS ===");
  console.log("Shop:", session.shop);
  console.log("Theme ID:", themeId);
  console.log("Access token exists:", !!session.accessToken);
  console.log("Files to upload:", THEME_FILES.length);

  for (const file of THEME_FILES) {
    try {
      const url = `https://${session.shop}/admin/api/unstable/themes/${themeId}/assets.json`;
      console.log(`\nUploading: ${file.filename}`);
      console.log(`URL: ${url}`);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": session.accessToken,
        },
        body: JSON.stringify({
          asset: {
            key: file.filename,
            value: file.content,
          },
        }),
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`ERROR uploading ${file.filename}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const responseData = await response.json();
      console.log(`SUCCESS: ${file.filename} uploaded`);
      results.push({ filename: file.filename });
    } catch (error) {
      console.error(`EXCEPTION uploading ${file.filename}:`, error);
      throw new Error(`Failed to install ${file.filename}: ${error.message}`);
    }
  }

  console.log("=== INSTALL COMPLETE ===");
  return results;
}

/**
 * Uninstall sections from the theme using REST API via fetch
 */
export async function uninstallSections(session, themeId) {
  const results = [];

  for (const filename of FILENAMES) {
    try {
      const response = await fetch(
        `https://${session.shop}/admin/api/2026-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(
          filename,
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": session.accessToken,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          `Failed to delete ${filename}: HTTP ${response.status}: ${errorData}`,
        );
        // Continue with other files even if one fails
      } else {
        results.push({ filename });
      }
    } catch (error) {
      console.error(`Failed to delete ${filename}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}
