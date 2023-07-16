"use client"


import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useParams, useRouter} from "next/navigation";
import {FC} from "react";
import {ColorColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/colors/components/columns";
import {DataTable} from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";

interface ColorClientProps {
    data: ColorColumn[]
}

const ColorsClient: FC<ColorClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Colors (${data.length})`} description="Manage colors for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Heading title="API" description="API Calls for colors" />
            <Separator />
            <ApiList entityName="color" entityIdName="colorId"/>
        </>
    );
};

export default ColorsClient;