import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loader from "./ui/loader";

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("authToken");
          const userUID = localStorage.getItem("userUID");
          if (!token || !userUID) {
            localStorage.setItem(
              "authError",
              "Debes iniciar sesión para ver esta información."
            );
            router.push("/admin/auth/login");
          } else {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
              if (user && user.uid === userUID) {
                setLoading(false);
              } else {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userUID");
                localStorage.setItem(
                  "authError",
                  "Debes iniciar sesión para ver esta información."
                );
                router.push("/admin/auth/login");
              }
            });
          }
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <Loader />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
