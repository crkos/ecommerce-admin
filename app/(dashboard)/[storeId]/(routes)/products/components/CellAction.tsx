"use client"

import {FC, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import {Button} from "@/components/ui/Button";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/AlertModal";
import {ProductColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

interface CellActionProps {
    data: ProductColumn
}

const CellAction: FC<CellActionProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false)
    const onCopy = async (id: string) => {
        await navigator.clipboard.writeText(id);
        toast.success("Product id copied to the clipboard")
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${data.id}`);
            router.refresh();
            toast.success("Product deleted.");
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }


    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontal className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onCopy(data.id)}>
                            <Copy className="mr-2 h-4 w-4"/>
                            Copy id
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Update
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash className="mr-2 h-4 w-4"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
        </>
    );
};

export default CellAction;