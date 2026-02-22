import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  getMainThemeId,
  installSections,
  uninstallSections,
} from "../utils/theme.server.js";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  // Check installation status
  const installStatus = await db.installationStatus.findUnique({
    where: { shop: session.shop },
  });

  return {
    sectionsInstalled: installStatus?.sectionsInstalled ?? false,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  console.log("=== ACTION STARTED ===");
  console.log("Action:", action);
  console.log("Session shop:", session.shop);
  console.log("Session scope:", session.scope);
  console.log("Session accessToken exists:", !!session.accessToken);

  try {
    const themeId = await getMainThemeId(admin);
    console.log("Got theme ID:", themeId);

    if (action === "install") {
      const files = await installSections(session, themeId);

      // Update installation status
      await db.installationStatus.upsert({
        where: { shop: session.shop },
        update: {
          sectionsInstalled: true,
          installedAt: new Date(),
        },
        create: {
          shop: session.shop,
          sectionsInstalled: true,
          installedAt: new Date(),
        },
      });

      return {
        success: true,
        message: `Successfully installed ${files.length} theme files`,
        action: "install",
      };
    } else if (action === "uninstall") {
      const files = await uninstallSections(session, themeId);

      // Update installation status (or create if doesn't exist)
      await db.installationStatus.upsert({
        where: { shop: session.shop },
        update: {
          sectionsInstalled: false,
        },
        create: {
          shop: session.shop,
          sectionsInstalled: false,
        },
      });

      return {
        success: true,
        message: `Successfully uninstalled ${files.length} theme files`,
        action: "uninstall",
      };
    }

    return { success: false, message: "Invalid action" };
  } catch (error) {
    console.error("=== ERROR IN ACTION ===");
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show(fetcher.data.message);
    } else if (fetcher.data?.success === false) {
      shopify.toast.show(fetcher.data.message, { isError: true });
    }
  }, [fetcher.data, shopify]);

  const handleInstall = () => {
    const formData = new FormData();
    formData.append("action", "install");
    fetcher.submit(formData, { method: "POST" });
  };

  const handleUninstall = () => {
    const formData = new FormData();
    formData.append("action", "uninstall");
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <s-page heading="Theme Sections Injector">
      <s-section heading="Manage Native Theme Sections">
        <s-paragraph>
          {loaderData.sectionsInstalled
            ? "Your sections are currently installed in your theme. They appear under 'Sections' (not 'Apps') in the Theme Editor."
            : "Install native theme sections to your main theme. The sections will appear under 'Sections' (not 'Apps') in the Theme Editor."}
        </s-paragraph>

        <s-stack direction="inline" gap="base">
          <s-button
            onClick={handleInstall}
            variant={loaderData.sectionsInstalled ? "secondary" : "primary"}
            {...(isLoading ? { loading: true } : {})}
          >
            {loaderData.sectionsInstalled ? "Reinstall" : "Install"} Sections
          </s-button>
          {loaderData.sectionsInstalled && (
            <s-button
              onClick={handleUninstall}
              variant="tertiary"
              tone="critical"
              {...(isLoading ? { loading: true } : {})}
            >
              Uninstall Sections
            </s-button>
          )}
        </s-stack>
      </s-section>

      <s-section heading="Included Sections">
        <s-unordered-list>
          <s-list-item>
            <strong>App Hero Banner</strong> - Hero section with image, heading,
            subheading, and button
          </s-list-item>
          <s-list-item>
            <strong>App FAQ Accordion</strong> - Expandable FAQ section with
            multiple items
          </s-list-item>
          <s-list-item>
            <strong>App Testimonials Slider</strong> - Customer testimonials
            with star ratings and slider
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section heading="How to Use">
        <s-ordered-list>
          <s-list-item>
            Click "Install Sections" to upload the sections to your main theme
          </s-list-item>
          <s-list-item>Go to your theme editor (Customize theme)</s-list-item>
          <s-list-item>
            Click "Add section" and find the sections under "Sections" category
          </s-list-item>
          <s-list-item>
            Customize the sections using the Theme Editor settings
          </s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section slot="aside" heading="Technical Details">
        <s-paragraph>
          This app uses the <strong>REST Admin API</strong> (
          <code>Asset.save</code> and <code>Asset.delete</code>) to inject
          native Liquid sections directly into your theme.
        </s-paragraph>
        <s-paragraph>
          Use the Install/Uninstall buttons to manage your theme sections. The
          sections will appear under "Sections" (not "Apps") in the Theme
          Editor.
        </s-paragraph>
        <s-paragraph>
          The sections are built with accessibility in mind, supporting keyboard
          navigation, screen readers, and reduced motion preferences.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
