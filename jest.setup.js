/* eslint-disable @typescript-eslint/no-require-imports -- Jest setup runs in CJS context */
require("@testing-library/jest-dom");

// Mantine / DataTable need these in jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
window.ResizeObserver = ResizeObserverMock;

window.getComputedStyle = jest.fn().mockImplementation(() => ({
  getPropertyValue: () => "",
}));

Element.prototype.scrollIntoView = jest.fn();
