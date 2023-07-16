import prismadb from "@/lib/prismadb";
import CategoryForm from "@/app/(dashboard)/[storeId]/(routes)/categories/[categoryId]/components/CategoryForm";

const CategoryPage = async ({params}: {params: { categoryId: string, storeId: string }}) => {
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billbords = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm billboards={billbords} initialData={category} />
            </div>
        </div>
    );
};

export default CategoryPage;