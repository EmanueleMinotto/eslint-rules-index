/**
 * Integration tests for the Home page: render the full page with
 * fixture data and assert on header, table and filter behaviour.
 */
import { render, screen, within } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import Home from "@/app/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => ({ get: (key: string) => (key === "q" ? null : null) }),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MantineProvider>
      {ui}
    </MantineProvider>,
  );
}

describe("Home page integration", () => {
  it("renders the page title and subtitle", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { name: /ESLint Rules Index/i })).toBeInTheDocument();
    expect(screen.getByText(/rules from .* plugin.* with links to documentation/i)).toBeInTheDocument();
  });

  it("renders the search input", () => {
    renderWithProviders(<Home />);
    const search = screen.getByPlaceholderText(/Search by rule name, package, category or description/i);
    expect(search).toBeInTheDocument();
  });

  it("renders the rules table with fixture data", () => {
    renderWithProviders(<Home />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it("renders one data row per fixture rule (table row count)", () => {
    renderWithProviders(<Home />);
    const dataRows = screen.getAllByRole("row").filter((r) => r.closest("tbody"));
    expect(dataRows).toHaveLength(3);
  });

  it("shows pagination info", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/\d+–\d+ of \d+ rules/)).toBeInTheDocument();
  });
});
