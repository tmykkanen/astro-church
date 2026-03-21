import { useHistory, useLocation } from "react-router-dom";

export const useSearchParams = (param) => {
  const location = useLocation();
  const history = useHistory();

  const urlParams = new URLSearchParams(window.location.search);
};
