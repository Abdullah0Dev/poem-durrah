"use client";

import { createContext } from "react";

export interface NavAction { onClick: () => void; disabled: boolean }
export interface BookControls { prev: NavAction; next: NavAction }

const noop: NavAction = { onClick: () => {}, disabled: true };
export const BookControlsContext = createContext<BookControls>({ prev: noop, next: noop });
