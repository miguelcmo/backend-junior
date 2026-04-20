export function GET(req: Request) {
    const res = {
        title: "My title",
        dscription: "My test description" 
    }

    return Response.json(res)
}