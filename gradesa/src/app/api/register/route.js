export async function POST(request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  if (request.method === "POST") {
    return Response.json({
      email,
      password,
      message: "Email and password combination allowed.",
    });
  } else {
    return Response.json("Email and password combination not allowed.");
  }
}
