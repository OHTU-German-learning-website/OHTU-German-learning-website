export async function GET(request) {
    const query = request.nextUrl.searchParams;
    const mode = query.get("mode");
    if (mode === "normal") {
        return Response.json({ message: "Hello World!" });
    }
}
    
