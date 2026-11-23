import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";
import type { Role, User } from "../types";

const userWith = (role: Role): User => ({
  name: "کاربر",
  email: `${role}@example.com`,
  role,
});

const renderPage = (user: User | null = null) =>
  render(
    <MemoryRouter initialEntries={["/does-not-exist"]}>
      <NotFound user={user} dark={false} onToggleTheme={() => {}} />
    </MemoryRouter>,
  );

describe("NotFound", () => {
  it("has exactly one main heading", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("sets the document title", () => {
    renderPage();
    expect(document.title).toContain("یافت نشد");
  });

  it("links to the home page and to the auction list", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /اصلی/ })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /مشاهده/ })).toHaveAttribute(
      "href",
      "/auctions",
    );
  });

  it("shows no panel link to a guest", () => {
    renderPage();
    expect(
      screen.queryByRole("link", { name: /پنل کاربری/ }),
    ).not.toBeInTheDocument();
  });

  it("links a seller to the seller panel", () => {
    renderPage(userWith("seller"));
    expect(screen.getByRole("link", { name: /پنل کاربری/ })).toHaveAttribute(
      "href",
      "/seller",
    );
  });

  it("links a buyer to the auction list as the panel", () => {
    renderPage(userWith("buyer"));
    expect(screen.getByRole("link", { name: /پنل کاربری/ })).toHaveAttribute(
      "href",
      "/auctions",
    );
  });

  it("shows neither the requested path nor a search box", () => {
    renderPage();
    expect(screen.queryByText(/does-not-exist/)).not.toBeInTheDocument();
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
  });

  it("hides the back button when there is no history", () => {
    renderPage();
    expect(
      screen.queryByRole("button", { name: /قبل/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the back button when there is history", () => {
    vi.spyOn(window.history, "length", "get").mockReturnValue(3);
    renderPage();
    expect(screen.getByRole("button", { name: /قبل/ })).toBeInTheDocument();
  });
});
