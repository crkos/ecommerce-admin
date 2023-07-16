"use client"

import {Category, Color, Image, Product, Size} from "@prisma/client";
import {FC, useState} from "react";
import Heading from "@/components/ui/Heading";
import {Trash} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {Separator} from "@/components/ui/Separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/Form";
import {Input} from "@/components/ui/Input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[],
    sizes: Size[],
    colors: Color[]
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({
        url: z.string()
    }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>;

const ProductsForm: FC<ProductFormProps> = ({initialData, categories,sizes, colors}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = initialData ? "Edit product" : "Create product"
    const description = initialData ? "Edit product" : "Add a new product"
    const toastMessage = initialData ? "Product updated" : "Product created"
    const action = initialData ? "Save changes" : "Create product"

    const params = useParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(` /api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(` /api/${params.storeId}/products`, data);
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.");
        } catch (err) {
            toast.error("Something went wrong.");
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
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                {/*@ts-ignore*/}
                                <ImageUpload value={field.value.map(image => image.url)} disabled={loading} onChange={(url) => field.onChange([...field.value, {url}])} onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])}/>
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )} name="images" control={control}/>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Product name." {...field}/>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )} name="name" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} name="price" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem value={category.id} key={category.id} >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} name="categoryId" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizes.map(size => (
                                            <SelectItem value={size.id} key={size.id} >
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} name="sizeId" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a color value" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map(color => (
                                            <SelectItem value={color.id} key={color.id} >
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} name="colorId" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    {/*@ts-ignore*/}
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>
                                        This product will appear on the home page
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} name="isFeatured" control={control}/>
                        <FormField render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    {/*@ts-ignore*/}
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>
                                        This product will not appear in the homepage
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} name="isArchived" control={control}/>

                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
        </>
    );
};

export default ProductsForm;