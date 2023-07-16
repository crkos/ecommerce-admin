import Heading from "@/components/ui/Heading";
import {Separator} from "@/components/ui/Separator";
import {FC} from "react";
import {OrderColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";
import {DataTable} from "@/components/ui/DataTable";

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: FC<OrderClientProps> = ({data}) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Orders (${data.length})`} description="Manage orders for your store"/>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="products"/>
        </>
    );
};

export default OrderClient;