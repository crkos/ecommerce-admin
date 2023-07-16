"use client"


import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useParams, useRouter} from "next/navigation";
import {FC} from "react";
import {SizeColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns";
import {DataTable} from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";

interface SizesClientProps {
    data: SizeColumn[]
}

const SizesClient: FC<SizesClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Sizes (${data.length})`} description="Manage sizes for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API Calls for sizes" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    );
};

export default SizesClient;