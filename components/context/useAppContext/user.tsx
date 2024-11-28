import { useState } from "react";
import { useAppContext } from "../appContext";

export const useUserLogout = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  async function userLogout() {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/signout`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({ type: "SET_USER_LOGOUT" });
      setData(responseData);
      return { data: responseData };
    } catch (error: any) {
      setError({ error });
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, userLogout };
};

export const useLoginUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, loginUser };
};

export const useSignupUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function signupUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    signupUser,
  };
};

export const useUserConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function userConfirmation({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        // throw new Error(`Error: ${response.statusText}`);
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    userConfirmation,
  };
};

export const useOtpExpired = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function otpExpired({ email }: { email: string }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/otp-expired`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        // throw new Error(`Error: ${response.statusText}`);
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    otpExpired,
  };
};

export const useUserForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function userForgotPassword({ email }: { email: string }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    userForgotPassword,
  };
};

export const useUserResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function userResetPassword({
    password,
    token,
    email,
  }: {
    password: string;
    token: string;
    email: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, otp: token, email }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        return setError(responseData.error as string);
      }

      setData(responseData);
    } catch (error: any) {
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    data,
    userResetPassword,
  };
};
