import {auth} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, {params}: {params: {storeId: string}}) {
    try {
        const {userId} = auth();
        const body = await req.json()

        const {name, value} = body

        if(!userId) {
            return new Response('Unauthenticated', {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!value) {
            return new NextResponse("Value url is required", {status: 400})
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400})
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(color)


    } catch (err) {
        console.log('[COLOR_POST] ', err)
        return new Response('Internal error', {status: 500})
    }
}

export async function GET(req: Request, {params}: {params: {storeId: string}}) {
    try {
        if(!params.storeId) {
            return new NextResponse("Store id is required", {status: 400})
        }

        const color = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(color)


    } catch (err) {
        console.log('[SIZE_GET] ', err)
        return new Response('Internal error', {status: 500})
    }
}