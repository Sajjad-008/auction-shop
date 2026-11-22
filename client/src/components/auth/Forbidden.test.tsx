import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Forbidden from "./Forbidden";
import { roleLabels } from "../../utils/paths";
import type { Role } from "../../types";

const renderPage = (requiredRole: Role, currentRole: Role, path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Forbidden requiredRole={requiredRole} currentRole={currentRole} />
    </MemoryRouter>,
  );

describe("Forbidden", () => {
  it("has exactly one main heading", () => {
    renderPage("admin", "buyer");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("names the required account type", () => {
    renderPage("admin", "buyer");
    expect(screen.getByText(new RegExp(roleLabels.admin))).toBeInTheDocument();
  });

  it("links a buyer back to the auction list", () => {
    renderPage("seller", "buyer");
    expect(screen.getByRole("link", { name: /پنل کاربری/ })).toHaveAttribute(
      "href",
      "/auctions",
    );
  });

  it("links a seller back to the seller panel", () => {
    renderPage("admin", "seller");
    expect(screen.getByRole("link", { name: /پنل کاربری/ })).toHaveAttribute(
      "href",
      "/seller",
    );
  });

  it("lets the user report an access problem to support", () => {
    renderPage("admin", "buyer");
    expect(screen.getByRole("link", { name: /مشکل دسترسی/ })).toHaveAttribute(
      "href",
      "/support/new",
    );
  });

  it("does not show the requested address", () => {
    renderPage("admin", "buyer", "/admin/secret-page");
    expect(screen.queryByText(/secret-page/)).not.toBeInTheDocument();
  });

  it("hides the back button when there is no history", () => {
    renderPage("admin", "buyer");
    expect(
      screen.queryByRole("button", { name: /صفحه‌ی قبل/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the back button when there is history", () => {
    vi.spyOn(window.history, "length", "get").mockReturnValue(3);
    renderPage("admin", "buyer");
    expect(screen.getByRole("button", { name: /قبل/ })).toBeInTheDocument();
  });
});
