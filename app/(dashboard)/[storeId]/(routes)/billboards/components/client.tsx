"use client"


import Heading from "@/components/ui/Heading";
import {Button} from "@/components/ui/Button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/Separator";
import {useParams, useRouter} from "next/navigation";
import {FC} from "react";
import {BillboardColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import {DataTable} from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";

interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient: FC<BillboardClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store"/>
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label"/>
            <Heading title="API" description="API Calls for billboards" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    );
};

export default BillboardClient;