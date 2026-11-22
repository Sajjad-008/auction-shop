import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import type { AppContext, Role, User } from "../../types";

const userWith = (role: Role): User => ({
  name: "کاربر",
  email: `${role}@example.com`,
  role,
});

const renderGuard = (user: User | null, role: Role, guestOk = false) => {
  // RoleGuard فقط به user نیاز دارد
  const context = { user } as unknown as AppContext;
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route
            path="/protected"
            element={
              <RoleGuard role={role} guestOk={guestOk}>
                <p>محتوای محافظت‌شده</p>
              </RoleGuard>
            }
          />
        </Route>
        <Route path="/login" element={<p>صفحه‌ی ورود</p>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("RoleGuard", () => {
  it("redirects a guest to the login page", () => {
    renderGuard(null, "seller");
    expect(screen.getByText("صفحه‌ی ورود")).toBeInTheDocument();
    expect(screen.queryByText("محتوای محافظت‌شده")).not.toBeInTheDocument();
  });

  it("shows the content to a guest when guestOk is set", () => {
    renderGuard(null, "buyer", true);
    expect(screen.getByText("محتوای محافظت‌شده")).toBeInTheDocument();
  });

  it("shows the content when the role matches", () => {
    renderGuard(userWith("seller"), "seller");
    expect(screen.getByText("محتوای محافظت‌شده")).toBeInTheDocument();
  });

  it("shows the content to an administrator on an admin route", () => {
    renderGuard(userWith("admin"), "admin");
    expect(screen.getByText("محتوای محافظت‌شده")).toBeInTheDocument();
  });

  it("shows the access-denied page when the role does not match", () => {
    renderGuard(userWith("buyer"), "admin");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByText("محتوای محافظت‌شده")).not.toBeInTheDocument();
  });
});
