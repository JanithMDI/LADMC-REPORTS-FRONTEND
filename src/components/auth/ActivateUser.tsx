import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { activateUser } from "../../services/authService";
import { Check, X, Loader2 } from "lucide-react";

export function ActivateUser() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }
    activateUser(token)
      .then((res) => {
        setStatus("success");
        setMessage(res?.message || "Account activated successfully.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Activation failed.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="p-6 bg-white rounded shadow text-center w-full max-w-md">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto animate-spin h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Verifying your account...</h2>
            <div className="text-muted-foreground">Please wait while we activate your account.</div>
          </>
        )}
        {status === "success" && (
          <>
            <div className="bg-green-200 h-16 w-16 rounded-full flex items-center justify-center mx-auto border-8 border-green-100 mb-4">
              <Check className="text-green-800" />
            </div>
            <h2 className="text-xl font-bold mb-2">Account Activated</h2>
            <div className="text-green-700">{message}</div>
          </>
        )}
        {status === "error" && (
          <>
            <div className="bg-red-200 h-16 w-16 rounded-full flex items-center justify-center mx-auto border-8 border-red-100 mb-4">
              <X className="text-red-800" />
            </div>
            <h2 className="text-xl font-bold mb-2">Activation Failed</h2>
            <div className="text-red-700">{message}</div>
          </>
        )}
      </div>
    </div>
  );
}
