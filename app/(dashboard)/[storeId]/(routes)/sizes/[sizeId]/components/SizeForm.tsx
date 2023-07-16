"use client"

import { Size} from "@prisma/client";
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

interface SizesFormProps {
    initialData: Size | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})

type SizesFormValues = z.infer<typeof formSchema>;

const SizeForm: FC<SizesFormProps> = ({initialData}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = initialData ? "Edit size" : "Create size"
    const description = initialData ? "Edit size" : "Add a new size"
    const toastMessage = initialData ? "Size updated" : "Size created"
    const action = initialData ? "Save changes" : "Create size"

    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit = async (data: SizesFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(` /api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(` /api/${params.storeId}/sizes`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success("Size deleted.");
        } catch (err) {
            toast.error("Make sure you removed all products using this size first.");
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size name" {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="name" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Value" {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="value" control={control}/>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
        </>
    );
};

export default SizeForm;