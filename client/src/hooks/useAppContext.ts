import { useOutletContext } from "react-router-dom";
import type { AppContext } from "../types";

export default function useAppContext() {
  return useOutletContext<AppContext>();
}
