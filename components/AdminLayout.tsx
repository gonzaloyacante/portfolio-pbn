import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FilterDropdown from "@/app/admin/projects/FilterDropdown";
import Category from "../models/Category";

interface AdminLayoutProps {
  title: string;
  filter?: boolean;
  categories?: Category[];
  handleFilter?: (category: string) => void;
  selectedCategory?: string;
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  filter = false,
  categories = [],
  handleFilter,
  selectedCategory = "Todos",
  children,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-6 h-full">
      <header className="flex justify-between items-center space-x-4 w-full">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-20 w-20" />
            <span className="sr-only">Volver</span>
          </Button>
          <h2 className="ml-2 text-xl font-bold">{title}</h2>
        </div>
        {filter && handleFilter && (
          <FilterDropdown
            categories={categories}
            handleFilter={handleFilter}
            selectedCategory={selectedCategory}
          />
        )}
      </header>
      <div className="space-y-6 h-full flex flex-col items-center">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
