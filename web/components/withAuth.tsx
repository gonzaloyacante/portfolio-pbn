import { useRouter } from "next/navigation";
import { Loader } from "../components/Loader";
import { useSession } from "@/lib/session";

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const { user, loading } = useSession({ redirectTo: "/admin/auth/login" });
    if (loading) return <Loader />;
    // Si no hay user, useSession ya redirigió.
    if (!user) return null;
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
