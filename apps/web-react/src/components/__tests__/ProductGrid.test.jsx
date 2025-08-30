import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGrid } from "../ProductGrid";

const mockFetcherEmpty = jest.fn(() =>
  Promise.resolve({ items: [], total: 0 })
);

const mockFetcherSuccess = jest.fn(() =>
  Promise.resolve({
    items: [
      { id: 1, name: "Ürün 1", sku: "SKU1", price: 100, status: 1 },
      { id: 2, name: "Ürün 2", sku: "SKU2", price: 200, status: 0 },
    ],
    total: 2,
  })
);

describe("<ProductGrid />", () => {
  test("boş state durumunda doğru mesajı gösterir", async () => {
    render(<ProductGrid fetcher={mockFetcherEmpty} />);

    await waitFor(() => {
      expect(mockFetcherEmpty).toHaveBeenCalled();
    });

    const emptyTexts = screen.getAllByText(/Ürün bulunamadı/i);
    expect(emptyTexts[0]).toBeInTheDocument();
  });

  test("fetcher çalışınca ürünler listelenir", async () => {
    render(<ProductGrid fetcher={mockFetcherSuccess} />);

    await waitFor(() => {
      expect(mockFetcherSuccess).toHaveBeenCalled();
    });

    expect(screen.getByText("Ürün 1")).toBeInTheDocument();
    expect(screen.getByText("Ürün 2")).toBeInTheDocument();

    expect(screen.getByText("100.00 ₺")).toBeInTheDocument();
    expect(screen.getByText("Stokta")).toBeInTheDocument();
    expect(screen.getByText("Stokta Yok")).toBeInTheDocument();
  });

  test("arama input'u ile fetcher çağrılır (debounced)", async () => {
    jest.useFakeTimers();
    const mockFetcher = jest.fn(() => Promise.resolve({ items: [], total: 0 }));

    render(<ProductGrid fetcher={mockFetcher} />);
    const input = screen.getByPlaceholderText(/Ürün ara/i);

    userEvent.type(input, "test");

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledWith(
        expect.objectContaining({ query: "test" })
      );
    });

    jest.useRealTimers();
  });
});
