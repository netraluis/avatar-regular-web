import { useAppContext } from "../appContext";

export const useLoadingRouter = () => {
  const { dispatch } = useAppContext();

  function loadingRouter(loading: boolean) {
    dispatch({
      type: "SET_LOADING",
      payload: { loading },
    });
  }

  return { loadingRouter };
};
