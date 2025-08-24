import { getToken } from "next-auth/jwt";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function GET(req) {
  await connectedDB();

  const token = await getToken({req})


  if (!token?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const trainee = await Trainee.findOne({ user: token.id });
  console.log("TOKEN IN MY-TRAININGS:", token);

  console.log("SESSION USER ID:", token.id);
  console.log("TRAINEE FOUND:", trainee);


  if (!trainee) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  return new Response(JSON.stringify(trainee.trainings), { status: 200 });
}


