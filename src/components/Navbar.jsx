import { useAuth } from "../context/AuthContext";
import CustomerNavbar from "./CustomerNavbar";
import StoreOwnerNavbar from "./StoreOwnerNavbar";
import SuperAdminNavbar from "./SuperAdminNavbar";

export default function NavbarSwitcher() {
  const { user } = useAuth();

  if (!user) return <CustomerNavbar />;

  if (user.role === "superadmin") return <SuperAdminNavbar />;
  if (user.role === "storeOwner") return <StoreOwnerNavbar />;

  return <CustomerNavbar />;
}
