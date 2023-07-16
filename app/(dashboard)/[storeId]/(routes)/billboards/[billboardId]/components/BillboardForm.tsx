"use client"

import {Billboard} from "@prisma/client";
import {FC, useState} from "react";
import Heading from "@/components/ui/Heading";
import {Trash} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {Separator} from "@/components/ui/Separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";

interface BillboardsFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardsFormValues = z.infer<typeof formSchema>;

const BillboardForm: FC<BillboardsFormProps> = ({initialData}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save changes" : "Create billboard"

    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardsFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(` /api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(` /api/${params.storeId}/billboards`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage);

        } catch (err) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success("Billboard deleted.");
        } catch (err) {
            toast.error("Make sure you removed all categories using this billboard first.");
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    const {handleSubmit, control} = form


    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => onDelete()} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}></Heading>{ initialData &&
                <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4"/>
                </Button>}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField render={({field}) => (
                        <FormItem>
                            <FormLabel>Background image</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange((""))}/>
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )} name="imageUrl" control={control}/>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label." {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="label" control={control}/>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
        </>
    );
};

export default BillboardForm;