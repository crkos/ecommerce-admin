"use client"


import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useParams, useRouter} from "next/navigation";
import {FC} from "react";
import {DataTable} from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";
import {ProductColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient: FC<ProductClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Products (${data.length})`} description="Manage products for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API Calls for billboards" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId"/>
        </>
    );
};

export default ProductClient;