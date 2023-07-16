import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

interface PatchProps {
    req: Request,
    params: {
        storeId?: string,
        colorId: string
    }
}

export async function GET(req: Request, {params}: PatchProps) {
    try {

        if(!params.colorId) {
            return new NextResponse("Color id is required", {status: 400});
        }


        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color)

    } catch (err) {
        console.log('[COLOR_GET]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}


export async function PATCH(req: Request, {params}: PatchProps) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!value) {
            return new NextResponse("Value url is required", {status: 400});
        }

        if(!params.colorId) {
            return new NextResponse("Color Id is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color)

    } catch (err) {
        console.log('[COLOR_PATCH]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: PatchProps) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unathenticated", {status: 401});
        }

        if(!params.colorId) {
            return new NextResponse("Color id is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color)

    } catch (err) {
        console.log('[COLOR_DELETE]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}

