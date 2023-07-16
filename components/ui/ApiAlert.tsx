"use client"
import {FC} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/Alert";
import {CopyIcon, Server} from "lucide-react";
import {Badge, BadgeProps} from "@/components/ui/Badge";
import {Button} from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string
    description: string,
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
}



const ApiAlert: FC<ApiAlertProps> = ({title, description, variant = "public"}) => {
    const onCopy = async () => {
        await navigator.clipboard.writeText(description);
        toast.success("API Route copied to the clipboard")
    }

    return (
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="icon" onClick={() => onCopy()}>
                    <CopyIcon className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    );
};

export default ApiAlert;