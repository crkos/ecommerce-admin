"use client"


import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useParams, useRouter} from "next/navigation";
import {FC} from "react";
import {DataTable} from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";
import {CategoryColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";

interface CategoryClientProps {
    data: CategoryColumn[]
}

const CategoryClient: FC<CategoryClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Categories (${data.length})`} description="Manage categories for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API Calls for categories" />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoriesId"/>
        </>
    );
};

export default CategoryClient;