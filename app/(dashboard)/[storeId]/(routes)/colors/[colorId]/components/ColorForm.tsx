"use client"

import {Color} from "@prisma/client";
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

interface ColorFormProps {
    initialData: Color | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code"
    })
})

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: FC<ColorFormProps> = ({initialData}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = initialData ? "Edit color" : "Create color"
    const description = initialData ? "Edit color" : "Add a new color"
    const toastMessage = initialData ? "Color updated" : "Color created"
    const action = initialData ? "Save changes" : "Create Color"

    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(` /api/${params.storeId}/colors/${params.colorId}`, data);
            } else {
                await axios.post(` /api/${params.storeId}/colors`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast.success("Color deleted.");
        } catch (err) {
            toast.error("Make sure you removed all products using this color first.");
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
                                    <Input disabled={loading} placeholder="Color name" {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="name" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="Value" {...field}/>
                                        <div className="border p-4 rounded-full" style={{backgroundColor: field.value}}/>
                                    </div>
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

export default ColorForm;