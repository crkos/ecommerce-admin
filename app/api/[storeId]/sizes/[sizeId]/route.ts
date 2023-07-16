import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

interface PatchProps {
    req: Request,
    params: {
        storeId?: string,
        sizeId: string
    }
}

export async function GET(req: Request, {params}: PatchProps) {
    try {

        if(!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400});
        }


        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size)

    } catch (err) {
        console.log('[SIZE_GET]: ', err)
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

        if(!params.sizeId) {
            return new NextResponse("Size Id is required", {status: 400});
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)

    } catch (err) {
        console.log('[SIZE_PATCH]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: PatchProps) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("Unathenticated", {status: 401});
        }

        if(!params.sizeId) {
            return new NextResponse("Size id is required", {status: 400});
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size)

    } catch (err) {
        console.log('[SIZE_DELETE]: ', err)
        return new NextResponse("Internal error", {status: 500})
    }
}

