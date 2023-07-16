import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

interface PatchProps {
    req: Request,
    params: {
        storeId: string
    }
}

export async function PATCH(req: Request, {params}: PatchProps) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name} = body

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb?.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store)

    } catch (err) {
        console.log('[STORE_PATCH]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: PatchProps) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb?.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store)

    } catch (err) {
        console.log('[STORE DELETE]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}