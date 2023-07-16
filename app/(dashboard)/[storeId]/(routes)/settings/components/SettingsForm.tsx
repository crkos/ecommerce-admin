"use client"

import {Store} from "@prisma/client";
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
import {store} from "next/dist/build/output/store";
import ApiAlert from "@/components/ui/ApiAlert";
import useOrigin from "@/hooks/UseOrigin";

interface SettingsFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: FC<SettingsFormProps> = ({initialData}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(` /api/stores/${params.storeId}`, data);
            router.refresh()
            toast.success("Store updated.");

        } catch (err) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast.success("Store deleted.");
        } catch (err) {
            toast.error("Make sure you removed all products and categories first.");
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    const {handleSubmit, control} = form

    const origin = useOrigin();

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => onDelete()} loading={loading} />

            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store preferences"></Heading>
                <Button className="" variant="destructive" size="sm" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name." {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="name" control={control}/>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">Save changes</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"></ApiAlert>
        </>
    );
};

export default SettingsForm;