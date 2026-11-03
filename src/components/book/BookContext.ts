"use client";

import { createContext } from "react";

export interface NavAction { onClick: () => void; disabled: boolean }
export interface BookControls {
  prev: NavAction;
  next: NavAction;
  /** Flip through to a page (1-based page number). */
  goToPage: (page: number) => void;
}

const noop: NavAction = { onClick: () => {}, disabled: true };
export const BookControlsContext = createContext<BookControls>({ prev: noop, next: noop, goToPage: () => {} });